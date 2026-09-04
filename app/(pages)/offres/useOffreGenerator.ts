import { useState, useCallback, useMemo } from 'react';
import * as XLSX from 'xlsx';
import type { ProcessedOffer, ColumnMapping, ColumnSample, RequiredColumnKey } from './types';
import { useStatusMessages } from './hooks/useStatusMessages';
import { processOffers, countOffersByProfile } from './utils';
import { createEmptyMapping, autoDetectMapping, toColumnSamples } from './utils/columnUtils';
import { generateAllPages } from './services/generateAllPages';
import { readWorkbookFromFile } from '@/app/utils/spreadsheetUtils';
import { PROGRAM_PROFILES, MANDATORY_COLUMN_KEYS } from './constants';

function getDefaultSession(): string {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const winterYear = month >= 5 ? year + 1 : year;
  const shortYear = String(winterYear).slice(-2);
  return `H${shortYear}`;
}

export function useOffreGenerator() {
  const [session, setSession] = useState<string>(getDefaultSession());
  const [file, setFile] = useState<File | null>(null);
  const [sheetColumns, setSheetColumns] = useState<string[]>([]);
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>(createEmptyMapping());
  const [columnSamples, setColumnSamples] = useState<ColumnSample[]>([]);
  const [offers, setOffers] = useState<ProcessedOffer[]>([]);
  const [processedOffers, setProcessedOffers] = useState<ProcessedOffer[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const { statusMessages, pushStatus, clearStatus } = useStatusMessages();

  // Lecture du fichier Excel
  const handleFileUpload = useCallback(
    async (uploadedFile: File) => {
      try {
        clearStatus();
        pushStatus('info', 'Lecture du fichier Excel...');

        const workbook = await readWorkbookFromFile(uploadedFile);

        if (!workbook.SheetNames.length) {
          pushStatus('error', 'Le fichier Excel ne contient aucun onglet.');
          return;
        }

        // Utiliser le premier onglet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Lire les en-têtes et les données
        const rows = XLSX.utils.sheet_to_json<unknown[]>(worksheet, {
          header: 1,
        });
        
        const rawHeaders = Array.isArray(rows[0]) ? (rows[0] as unknown[]) : [];
        const normalizedHeaders = rawHeaders.map((cell) =>
          String(cell ?? '').trim()
        );
        const headers = normalizedHeaders.filter(
          (value, index, array) => value && array.indexOf(value) === index
        );

        if (!headers.length) {
          pushStatus('error', 'Le fichier ne contient aucune colonne.');
          return;
        }

        // Convertir en JSON avec les en-têtes nettoyés
        const jsonData = XLSX.utils.sheet_to_json<ProcessedOffer>(worksheet, {
          raw: false,
        });

        // Nettoyer les noms de colonnes dans les données (enlever les espaces trailing)
        const cleanedData = jsonData.map((row) => {
          const cleanedRow: ProcessedOffer = {};
          Object.keys(row).forEach((key) => {
            const cleanKey = key.trim();
            cleanedRow[cleanKey] = row[key];
          });
          return cleanedRow;
        });

        if (!cleanedData.length) {
          pushStatus('error', 'Le fichier ne contient aucune donnée.');
          return;
        }

        // Auto-détecter les colonnes
        const suggestions = autoDetectMapping(headers);
        
        setFile(uploadedFile);
        setSheetColumns(headers);
        setColumnMapping(suggestions);
        setColumnSamples(toColumnSamples(rows as unknown[][], normalizedHeaders));
        setOffers(cleanedData);
        
        pushStatus('success', `${cleanedData.length} offre(s) chargée(s).`);
      } catch (error) {
        console.error('Error reading Excel file:', error);
        pushStatus('error', 'Erreur lors de la lecture du fichier Excel.');
      }
    },
    [clearStatus, pushStatus]
  );

  // Gérer le changement de mapping de colonnes
  const handleColumnMappingChange = useCallback(
    (key: RequiredColumnKey, value: string) => {
      setColumnMapping((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  // Traiter les offres et assigner les IDs
  const handleProcessOffers = useCallback(() => {
    if (!offers.length) {
      pushStatus('error', 'Aucune offre à traiter.');
      return;
    }

    // Vérifier que les colonnes obligatoires sont mappées
    const missingMappings = MANDATORY_COLUMN_KEYS.filter(
      (key) => !columnMapping[key as keyof ColumnMapping]
    );
    if (missingMappings.length > 0) {
      pushStatus('error', 'Veuillez mapper toutes les colonnes obligatoires.');
      return;
    }

    try {
      // Créer un mapping des clés vers les noms de colonnes du fichier
      const keyToColumnName: Record<string, string> = {};
      (Object.keys(columnMapping) as RequiredColumnKey[]).forEach((key) => {
        const columnName = columnMapping[key];
        if (columnName) {
          keyToColumnName[key] = columnName;
        }
      });

      // Transformer les données pour utiliser les noms de colonnes mappés
      const transformedOffers = offers.map((offer) => {
        const transformed: ProcessedOffer = { ...offer };
        
        // Ajouter le champ avec le nom de colonne standard attendu par processOffers
        const targetProfilesColumn = keyToColumnName.targetProfiles;
        if (targetProfilesColumn && targetProfilesColumn in offer) {
          const profileValue = offer[targetProfilesColumn] as string;
          transformed['À quel profil s\'adresse l\'offre de stage ?'] = profileValue;
        } else {
          console.warn('⚠️ targetProfilesColumn not found in offer. Available keys:', Object.keys(offer));
        }
        
        return transformed;
      });

      const processed = processOffers(transformedOffers, session);
      setProcessedOffers(processed);

      const counts = countOffersByProfile(processed);
      const summary = Object.entries(counts)
        .filter(([, count]) => count > 0)
        .map(([profileId, count]) => {
          const profile = PROGRAM_PROFILES.find((p) => p.id === profileId);
          return `${profile?.name}: ${count}`;
        })
        .join(' | ');

      pushStatus('success', `Offres traitées. ${summary}`);
    } catch (error) {
      console.error('Error processing offers:', error);
      pushStatus('error', 'Erreur lors du traitement des offres.');
    }
  }, [offers, session, pushStatus, columnMapping]);

  // Générer les pages HTML
  const handleGenerate = useCallback(async () => {
    if (!processedOffers.length) {
      pushStatus('error', 'Aucune offre traitée à générer.');
      return;
    }

    setIsGenerating(true);
    clearStatus();
    pushStatus('info', 'Génération des pages HTML...');

    try {
      const generatedCount = await generateAllPages({
        processedOffers,
        columnMapping,
        session,
        onStatus: pushStatus,
      });

      if (generatedCount > 0) {
        const pluriel = generatedCount > 1 ? 'fichiers' : 'fichier';
        pushStatus('success', `${generatedCount} ${pluriel} HTML généré(s).`);
      } else {
        pushStatus('error', "Aucun fichier HTML n'a pu être généré.");
      }
    } catch (error) {
      console.error('Error generating offers:', error);
      pushStatus('error', 'Erreur lors de la génération des fichiers.');
    } finally {
      setIsGenerating(false);
    }
  }, [processedOffers, session, clearStatus, pushStatus, columnMapping]);

  // Statistiques sur les offres
  const offerStats = useMemo(() => {
    if (!processedOffers.length) {
      return null;
    }

    const counts = countOffersByProfile(processedOffers);
    // Une offre qui vise plusieurs profils est publiée dans chaque page :
    // le total reflète le nombre de publications, pas le nombre de lignes.
    const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
    return {
      total,
      byProfile: counts,
    };
  }, [processedOffers]);

  const columnsReady = useMemo(
    () => sheetColumns.length > 0,
    [sheetColumns]
  );

  const allRequiredColumnsMapped = useMemo(
    () => MANDATORY_COLUMN_KEYS.every((key) => columnMapping[key as keyof ColumnMapping]),
    [columnMapping]
  );

  const readyToProcess = useMemo(
    () => offers.length > 0 && session.trim() !== '' && allRequiredColumnsMapped,
    [offers, session, allRequiredColumnsMapped]
  );

  const readyToGenerate = useMemo(
    () => processedOffers.length > 0,
    [processedOffers]
  );

  return {
    session,
    file,
    sheetColumns,
    columnMapping,
    columnSamples,
    offers,
    processedOffers,
    offerStats,
    statusMessages,
    isGenerating,
    columnsReady,
    allRequiredColumnsMapped,
    readyToProcess,
    readyToGenerate,
    setSession,
    handleFileUpload,
    handleColumnMappingChange,
    handleProcessOffers,
    handleGenerate,
  };
}
