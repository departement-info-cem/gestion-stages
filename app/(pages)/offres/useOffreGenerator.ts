import { useState, useCallback, useMemo } from 'react';
import type { ProcessedOffer, ColumnMapping, RequiredColumnKey } from './types';
import { useStatusMessages } from './hooks/useStatusMessages';
import { useOfferImport } from './hooks/useOfferImport';
import { processOffers, countOffersByProfile } from './utils';
import { generateAllPages } from './services/generateAllPages';
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
  const [processedOffers, setProcessedOffers] = useState<ProcessedOffer[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const {
    file,
    sheetColumns,
    columnMapping,
    columnSamples,
    offers,
    importProgress,
    importMessages,
    importFile,
    updateColumnMapping,
  } = useOfferImport();

  const { statusMessages, pushStatus, clearStatus } = useStatusMessages();

  const handleColumnMappingChange = useCallback(
    (key: RequiredColumnKey, value: string) => {
      updateColumnMapping(key, value);
    },
    [updateColumnMapping]
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
      const targetProfilesColumn = columnMapping.targetProfiles;

      // Republier la colonne des profils sous le libellé attendu par
      // processOffers, quel que soit son intitulé dans le fichier.
      const transformedOffers = offers.map((offer) => ({
        ...offer,
        'À quel profil s\'adresse l\'offre de stage ?':
          offer[targetProfilesColumn] ?? '',
      }));

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
    importProgress,
    importMessages,
    statusMessages,
    isGenerating,
    columnsReady,
    allRequiredColumnsMapped,
    readyToProcess,
    readyToGenerate,
    setSession,
    handleFileUpload: importFile,
    handleColumnMappingChange,
    handleProcessOffers,
    handleGenerate,
  };
}
