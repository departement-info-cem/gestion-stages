'use client';

import { useState, useCallback } from 'react';
import * as XLSX from 'xlsx';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import {
  ColumnMapping,
  ColumnSamples,
  SignatureData,
  StatusMessage,
  ConventionData,
  ProgramConfig,
} from './types';
import {
  autoMapColumns,
  extractColumnSamples,
  validateColumnMapping,
  generateConventionData,
  generateConventionDocument,
  sanitizeFileName,
} from './utils';
import { MAIN_FILE_FIELDS, ADDITIONAL_FILE_FIELDS } from './constants';

export function useConventionGenerator() {
  // État du programme sélectionné
  const [selectedProgram, setSelectedProgram] = useState<string>('');
  const [programConfig, setProgramConfig] = useState<ProgramConfig | null>(null);

  // État du fichier Excel principal
  const [mainFile, setMainFile] = useState<File | null>(null);
  const [mainWorkbook, setMainWorkbook] = useState<XLSX.WorkBook | null>(null);
  const [mainSheetNames, setMainSheetNames] = useState<string[]>([]);
  const [selectedMainSheet, setSelectedMainSheet] = useState<string>('');
  const [mainSheetColumns, setMainSheetColumns] = useState<string[]>([]);

  // État du mapping des colonnes principales
  const [mainColumnMapping, setMainColumnMapping] = useState<ColumnMapping>({});
  const [mainColumnSamples, setMainColumnSamples] = useState<ColumnSamples>({});

  // État du fichier Excel additionnel
  const [additionalFile, setAdditionalFile] = useState<File | null>(null);
  const [additionalWorkbook, setAdditionalWorkbook] = useState<XLSX.WorkBook | null>(null);
  const [additionalSheetNames, setAdditionalSheetNames] = useState<string[]>([]);
  const [selectedAdditionalSheet, setSelectedAdditionalSheet] = useState<string>('');
  const [additionalSheetColumns, setAdditionalSheetColumns] = useState<string[]>([]);

  // État du mapping des colonnes additionnelles
  const [additionalColumnMapping, setAdditionalColumnMapping] = useState<ColumnMapping>({});
  const [additionalColumnSamples, setAdditionalColumnSamples] = useState<ColumnSamples>({});

  // État des signatures
  const [signatureDirecteur, setSignatureDirecteur] = useState<SignatureData>({
    image: null,
    imageUrl: '',
    signataireName: '',
  });
  const [signatureCoordonnateur, setSignatureCoordonnateur] = useState<SignatureData>({
    image: null,
    imageUrl: '',
    signataireName: '',
  });

  // État des dates par défaut
  const [defaultStartDate, setDefaultStartDate] = useState<string>('');
  const [defaultEndDate, setDefaultEndDate] = useState<string>('');

  // Messages de statut
  const [statusMessages, setStatusMessages] = useState<StatusMessage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Ajouter un message de statut
  const addStatusMessage = useCallback(
    (type: 'success' | 'error' | 'warning', message: string) => {
      const newMessage: StatusMessage = {
        id: Date.now(),
        type,
        message,
        timestamp: new Date(),
      };
      setStatusMessages((prev) => [newMessage, ...prev].slice(0, 10));
    },
    []
  );

  // Gérer la sélection du programme
  const handleProgramSelect = useCallback((program: string, config: ProgramConfig) => {
    setSelectedProgram(program);
    setProgramConfig(config);
  }, []);

  // Gérer l'upload du fichier principal
  const handleMainFileUpload = useCallback(
    async (file: File) => {
      try {
        setMainFile(file);
        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer);
        setMainWorkbook(workbook);
        setMainSheetNames(workbook.SheetNames);

        if (workbook.SheetNames.length > 0) {
          const firstSheet = workbook.SheetNames[0];
          setSelectedMainSheet(firstSheet);
          
          // Traiter immédiatement la première feuille
          const worksheet = workbook.Sheets[firstSheet];
          const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

          if (data.length > 0) {
            const columns = data[0].filter((col: any) => col);
            setMainSheetColumns(columns);

            // Auto-mapping
            const autoMapping = autoMapColumns(columns, MAIN_FILE_FIELDS);
            setMainColumnMapping(autoMapping);

            // Extraire les échantillons
            const samples = extractColumnSamples(worksheet, autoMapping);
            setMainColumnSamples(samples);
          }
        }
      } catch (error) {
        addStatusMessage('error', 'Erreur lors du chargement du fichier principal');
        console.error(error);
      }
    },
    [addStatusMessage]
  );

  // Gérer la sélection de l'onglet principal
  const handleMainSheetSelect = useCallback(
    (sheetName: string) => {
      if (!mainWorkbook) return;

      setSelectedMainSheet(sheetName);
      const worksheet = mainWorkbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

      if (data.length > 0) {
        const columns = data[0].filter((col: any) => col);
        setMainSheetColumns(columns);

        // Auto-mapping
        const autoMapping = autoMapColumns(columns, MAIN_FILE_FIELDS);
        setMainColumnMapping(autoMapping);

        // Extraire les échantillons
        const samples = extractColumnSamples(worksheet, autoMapping);
        setMainColumnSamples(samples);

        addStatusMessage('success', `Onglet sélectionné: ${sheetName}`);
      }
    },
    [mainWorkbook, addStatusMessage]
  );

  // Gérer le changement de mapping principal
  const handleMainColumnMappingChange = useCallback(
    (fieldKey: string, columnName: string) => {
      const newMapping = { ...mainColumnMapping, [fieldKey]: columnName };
      setMainColumnMapping(newMapping);

      if (mainWorkbook && selectedMainSheet) {
        const worksheet = mainWorkbook.Sheets[selectedMainSheet];
        const samples = extractColumnSamples(worksheet, newMapping);
        setMainColumnSamples(samples);
      }
    },
    [mainColumnMapping, mainWorkbook, selectedMainSheet]
  );

  // Gérer l'upload du fichier additionnel
  const handleAdditionalFileUpload = useCallback(
    async (file: File) => {
      try {
        setAdditionalFile(file);
        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer);
        setAdditionalWorkbook(workbook);
        setAdditionalSheetNames(workbook.SheetNames);

        if (workbook.SheetNames.length > 0) {
          const firstSheet = workbook.SheetNames[0];
          setSelectedAdditionalSheet(firstSheet);
          
          // Traiter immédiatement la première feuille
          const worksheet = workbook.Sheets[firstSheet];
          const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

          if (data.length > 0) {
            const columns = data[0].filter((col: any) => col);
            setAdditionalSheetColumns(columns);

            // Auto-mapping
            const autoMapping = autoMapColumns(columns, ADDITIONAL_FILE_FIELDS);
            setAdditionalColumnMapping(autoMapping);

            // Extraire les échantillons
            const samples = extractColumnSamples(worksheet, autoMapping);
            setAdditionalColumnSamples(samples);
          }
        }
      } catch (error) {
        addStatusMessage('error', 'Erreur lors du chargement du fichier additionnel');
        console.error(error);
      }
    },
    [addStatusMessage]
  );

  // Gérer la sélection de l'onglet additionnel
  const handleAdditionalSheetSelect = useCallback(
    (sheetName: string) => {
      if (!additionalWorkbook) return;

      setSelectedAdditionalSheet(sheetName);
      const worksheet = additionalWorkbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

      if (data.length > 0) {
        const columns = data[0].filter((col: any) => col);
        setAdditionalSheetColumns(columns);

        // Auto-mapping
        const autoMapping = autoMapColumns(columns, ADDITIONAL_FILE_FIELDS);
        setAdditionalColumnMapping(autoMapping);

        // Extraire les échantillons
        const samples = extractColumnSamples(worksheet, autoMapping);
        setAdditionalColumnSamples(samples);
      }
    },
    [additionalWorkbook, addStatusMessage]
  );

  // Gérer le changement de mapping additionnel
  const handleAdditionalColumnMappingChange = useCallback(
    (fieldKey: string, columnName: string) => {
      const newMapping = { ...additionalColumnMapping, [fieldKey]: columnName };
      setAdditionalColumnMapping(newMapping);

      if (additionalWorkbook && selectedAdditionalSheet) {
        const worksheet = additionalWorkbook.Sheets[selectedAdditionalSheet];
        const samples = extractColumnSamples(worksheet, newMapping);
        setAdditionalColumnSamples(samples);
      }
    },
    [additionalColumnMapping, additionalWorkbook, selectedAdditionalSheet]
  );

  // Gérer l'upload de signature
  const handleSignatureUpload = useCallback(
    async (
      type: 'directeur' | 'coordonnateur',
      file: File,
      signataireName: string
    ) => {
      try {
        // Valider le format
        if (!file.type.match(/^image\/(png|jpeg|jpg|gif)$/)) {
          addStatusMessage('error', 'Format d\'image invalide. Utilisez PNG, JPEG ou GIF.');
          return;
        }

        const imageUrl = URL.createObjectURL(file);
        const signatureData: SignatureData = {
          image: file,
          imageUrl,
          signataireName,
        };

        if (type === 'directeur') {
          setSignatureDirecteur(signatureData);
        } else {
          setSignatureCoordonnateur(signatureData);
        }
      } catch (error) {
        addStatusMessage('error', 'Erreur lors du chargement de la signature');
        console.error(error);
      }
    },
    [addStatusMessage]
  );

  // Gérer les changements de dates par défaut
  const handleDefaultStartDateChange = useCallback((date: string) => {
    setDefaultStartDate(date);
  }, []);

  const handleDefaultEndDateChange = useCallback((date: string) => {
    setDefaultEndDate(date);
  }, []);

  // Générer les conventions
  const handleGenerate = useCallback(async () => {
    try {
      setIsGenerating(true);

      // Validation
      if (!programConfig) {
        addStatusMessage('error', 'Veuillez sélectionner un programme');
        return;
      }

      if (!mainWorkbook || !selectedMainSheet) {
        addStatusMessage('error', 'Veuillez sélectionner un fichier Excel principal et un onglet');
        return;
      }

      const mainValidation = validateColumnMapping(mainColumnMapping, MAIN_FILE_FIELDS);
      if (!mainValidation.isValid) {
        addStatusMessage(
          'error',
          `Colonnes manquantes: ${mainValidation.missingFields.join(', ')}`
        );
        return;
      }

      if (!signatureDirecteur.image || !signatureCoordonnateur.image) {
        addStatusMessage('error', 'Veuillez téléverser les deux signatures');
        return;
      }

      if (!signatureDirecteur.signataireName || !signatureCoordonnateur.signataireName) {
        addStatusMessage('error', 'Veuillez entrer les noms des signataires');
        return;
      }

      // Charger le template
      const templateResponse = await fetch(programConfig.templatePath);
      if (!templateResponse.ok) {
        addStatusMessage('error', 'Erreur lors du chargement du template');
        return;
      }
      const templateBuffer = await templateResponse.arrayBuffer();

      // Charger les signatures avec leur type MIME
      const signatureDirecteurBuffer = await signatureDirecteur.image.arrayBuffer();
      const signatureCoordonnateurBuffer = await signatureCoordonnateur.image.arrayBuffer();
      const signatureDirecteurType = signatureDirecteur.image.type;
      const signatureCoordonnateurType = signatureCoordonnateur.image.type;

      // Générer les données
      const mainWorksheet = mainWorkbook.Sheets[selectedMainSheet];
      const additionalWorksheet =
        additionalWorkbook && selectedAdditionalSheet
          ? additionalWorkbook.Sheets[selectedAdditionalSheet]
          : null;

      const conventions = generateConventionData(
        mainWorksheet,
        mainColumnMapping,
        additionalWorksheet,
        additionalColumnMapping
      );

      addStatusMessage('success', `${conventions.length} conventions à générer`);

      // Créer un ZIP
      const zip = new JSZip();

      // Générer chaque convention
      for (let i = 0; i < conventions.length; i++) {
        const convention = conventions[i];

        try {
          const docBlob = await generateConventionDocument(
            convention,
            programConfig,
            templateBuffer,
            {
              image: signatureDirecteurBuffer,
              name: signatureDirecteur.signataireName,
              mimeType: signatureDirecteurType,
            },
            {
              image: signatureCoordonnateurBuffer,
              name: signatureCoordonnateur.signataireName,
              mimeType: signatureCoordonnateurType,
            },
            {
              startDate: defaultStartDate,
              endDate: defaultEndDate,
            }
          );

          const fileName = `Convention_${sanitizeFileName(convention.nom)}_${sanitizeFileName(
            convention.prenom
          )}.docx`;
          zip.file(fileName, docBlob);

          addStatusMessage('success', `Convention générée: ${convention.nom}, ${convention.prenom}`);
        } catch (error) {
          addStatusMessage(
            'error',
            `Erreur pour ${convention.nom}, ${convention.prenom}: ${error}`
          );
          console.error(error);
        }
      }

      // Télécharger le ZIP
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, `Conventions_${selectedProgram}_${new Date().toISOString().split('T')[0]}.zip`);

      addStatusMessage('success', 'Toutes les conventions ont été générées avec succès!');
    } catch (error) {
      addStatusMessage('error', `Erreur lors de la génération: ${error}`);
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  }, [
    programConfig,
    mainWorkbook,
    selectedMainSheet,
    mainColumnMapping,
    additionalWorkbook,
    selectedAdditionalSheet,
    additionalColumnMapping,
    signatureDirecteur,
    signatureCoordonnateur,
    defaultStartDate,
    defaultEndDate,
    selectedProgram,
    addStatusMessage,
  ]);

  return {
    // État
    selectedProgram,
    programConfig,
    mainFile,
    mainSheetNames,
    selectedMainSheet,
    mainSheetColumns,
    mainColumnMapping,
    mainColumnSamples,
    additionalFile,
    additionalSheetNames,
    selectedAdditionalSheet,
    additionalSheetColumns,
    additionalColumnMapping,
    additionalColumnSamples,
    signatureDirecteur,
    signatureCoordonnateur,
    defaultStartDate,
    defaultEndDate,
    statusMessages,
    isGenerating,

    // Handlers
    handleProgramSelect,
    handleMainFileUpload,
    handleMainSheetSelect,
    handleMainColumnMappingChange,
    handleAdditionalFileUpload,
    handleAdditionalSheetSelect,
    handleAdditionalColumnMappingChange,
    handleSignatureUpload,
    handleDefaultStartDateChange,
    handleDefaultEndDateChange,
    handleGenerate,
  };
}
