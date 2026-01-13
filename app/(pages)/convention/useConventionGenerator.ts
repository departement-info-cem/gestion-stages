'use client';

import { useState, useCallback } from 'react';
import type { ProgramConfig } from './types';
import { PROGRAMS, MAIN_FILE_FIELDS, ADDITIONAL_FILE_FIELDS } from './constants';
import { useStatusMessages } from './hooks/useStatusMessages';
import { useExcelFile } from './hooks/useExcelFile';
import { useSignatures } from './hooks/useSignatures';
import { generateConventions } from './services/generateConventions';

export function useConventionGenerator() {
  // État du programme sélectionné
  const [selectedProgram, setSelectedProgram] = useState<string>('DEC_REGULIER');
  const [programConfig, setProgramConfig] = useState<ProgramConfig | null>(
    PROGRAMS['DEC_REGULIER']
  );

  // État des dates par défaut
  const [defaultStartDate, setDefaultStartDate] = useState<string>('');
  const [defaultEndDate, setDefaultEndDate] = useState<string>('');

  // État de génération
  const [isGenerating, setIsGenerating] = useState(false);

  // Hooks personnalisés
  const { statusMessages, addStatusMessage } = useStatusMessages();

  const mainFile = useExcelFile(
    MAIN_FILE_FIELDS,
    (message) => addStatusMessage('error', message)
  );

  const additionalFile = useExcelFile(
    ADDITIONAL_FILE_FIELDS,
    (message) => addStatusMessage('error', message)
  );

  const { signatureDirecteur, signatureCoordonnateur, handleSignatureUpload } =
    useSignatures((message) => addStatusMessage('error', message));

  // Gérer la sélection du programme
  const handleProgramSelect = useCallback(
    (program: string, config: ProgramConfig) => {
      setSelectedProgram(program);
      setProgramConfig(config);
    },
    []
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

      const mainWorksheet = mainFile.getWorksheet();
      if (!mainWorksheet) {
        addStatusMessage(
          'error',
          'Veuillez sélectionner un fichier Excel principal et un onglet'
        );
        return;
      }

      await generateConventions({
        programConfig,
        mainWorksheet,
        mainColumnMapping: mainFile.columnMapping,
        additionalWorksheet: additionalFile.getWorksheet(),
        additionalColumnMapping: additionalFile.columnMapping,
        signatureDirecteur: {
          image: signatureDirecteur.image!,
          signataireName: signatureDirecteur.signataireName,
        },
        signatureCoordonnateur: {
          image: signatureCoordonnateur.image!,
          signataireName: signatureCoordonnateur.signataireName,
        },
        defaultDates: {
          startDate: defaultStartDate,
          endDate: defaultEndDate,
        },
        mainFields: MAIN_FILE_FIELDS,
        selectedProgram,
        onProgress: addStatusMessage,
      });
    } catch (error) {
      if (error instanceof Error) {
        addStatusMessage('error', error.message);
      } else {
        addStatusMessage('error', `Erreur lors de la génération: ${error}`);
      }
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  }, [
    programConfig,
    mainFile,
    additionalFile,
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
    mainFile: mainFile.file,
    mainSheetNames: mainFile.sheetNames,
    selectedMainSheet: mainFile.selectedSheet,
    mainSheetColumns: mainFile.sheetColumns,
    mainColumnMapping: mainFile.columnMapping,
    mainColumnSamples: mainFile.columnSamples,
    additionalFile: additionalFile.file,
    additionalSheetNames: additionalFile.sheetNames,
    selectedAdditionalSheet: additionalFile.selectedSheet,
    additionalSheetColumns: additionalFile.sheetColumns,
    additionalColumnMapping: additionalFile.columnMapping,
    additionalColumnSamples: additionalFile.columnSamples,
    signatureDirecteur,
    signatureCoordonnateur,
    defaultStartDate,
    defaultEndDate,
    statusMessages,
    isGenerating,

    // Handlers
    handleProgramSelect,
    handleMainFileUpload: mainFile.handleFileUpload,
    handleMainSheetSelect: mainFile.handleSheetSelect,
    handleMainColumnMappingChange: mainFile.handleColumnMappingChange,
    handleAdditionalFileUpload: additionalFile.handleFileUpload,
    handleAdditionalSheetSelect: additionalFile.handleSheetSelect,
    handleAdditionalColumnMappingChange: additionalFile.handleColumnMappingChange,
    handleSignatureUpload,
    handleDefaultStartDateChange,
    handleDefaultEndDateChange,
    handleGenerate,
  };
}
