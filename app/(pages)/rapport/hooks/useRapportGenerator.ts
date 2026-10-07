import { useState, useCallback, useRef } from 'react';
import { ColumnKey, ColumnMapping, ColumnSample, StatusMessage } from '../types';
import {
  createEmptyColumnMapping,
  getColumnSamples,
  getExcelSheets,
  getExcelHeaders,
  readExcelWorksheet,
  resolveHeaders,
} from '../services/excelParser';
import { generateReports } from '../services/generateReports';
import { saveAs } from 'file-saver';

export interface UseRapportGeneratorState {
  excelFile: File | null;
  excelBuffer: ArrayBuffer | null;
  sheetNames: string[];
  selectedSheet: string;
  columnMapping: ColumnMapping;
  sheetColumns: string[];
  columnSamples: ColumnSample[];
  dateRange: [Date | null, Date | null];
  filterProgram: string;
  statuses: StatusMessage[];
  isGenerating: boolean;
  isLoading: boolean;
}

const initialState: UseRapportGeneratorState = {
  excelFile: null,
  excelBuffer: null,
  sheetNames: [],
  selectedSheet: '',
  columnMapping: createEmptyColumnMapping(),
  sheetColumns: [],
  columnSamples: [],
  dateRange: [null, null],
  filterProgram: '',
  statuses: [],
  isGenerating: false,
  isLoading: false,
};

export function useRapportGenerator() {
  const [state, setState] = useState<UseRapportGeneratorState>(initialState);
  const statusIdRef = useRef(0);

  /**
   * Ajoute un message de statut
   */
  const addStatus = useCallback((message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    const id = statusIdRef.current++;
    setState((prev) => ({
      ...prev,
      statuses: [...prev.statuses, { id, message, type }].slice(-10), // Garde les 10 derniers
    }));
  }, []);

  /**
   * Efface tous les messages
   */
  const clearStatuses = useCallback(() => {
    setState((prev) => ({ ...prev, statuses: [] }));
  }, []);

  /**
   * Gère l'upload du fichier Excel
   */
  const handleFileUpload = useCallback(
    async (file: File) => {
      setState((prev) => ({ ...prev, isLoading: true }));
      clearStatuses();

      try {
        const buffer = await file.arrayBuffer();
        const sheets = getExcelSheets(buffer);

        if (sheets.length === 0) {
          throw new Error('Le fichier Excel ne contient aucune feuille');
        }

        setState((prev) => ({
          ...prev,
          excelFile: file,
          excelBuffer: buffer,
          sheetNames: sheets,
          selectedSheet: sheets[0],
          columnMapping: createEmptyColumnMapping(),
          sheetColumns: [],
          columnSamples: [],
        }));

        addStatus(`Fichier chargé : ${sheets.length} feuille(s) trouvée(s)`, 'success');

        // Auto-sélectionne la première feuille
        handleSheetSelect(sheets[0], buffer);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Erreur lors du chargement du fichier';
        addStatus(message, 'error');
        setState((prev) => ({ ...prev, excelFile: null, excelBuffer: null }));
      } finally {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    },
    [addStatus, clearStatuses],
  );

  /**
   * Sélectionne une feuille Excel
   */
  const handleSheetSelect = useCallback(
    (sheetName: string, buffer?: ArrayBuffer) => {
      setState((prev) => ({ ...prev, isLoading: true }));

      try {
        const excelBuffer = buffer || state.excelBuffer;
        if (!excelBuffer) {
          throw new Error('Aucun fichier Excel chargé');
        }

        const worksheet = readExcelWorksheet(excelBuffer, sheetName);
        const headers = getExcelHeaders(worksheet);
        const columnSamples = getColumnSamples(worksheet);

        let columnMapping = createEmptyColumnMapping();
        try {
          columnMapping = resolveHeaders(headers);
          addStatus('Colonnes détectées automatiquement', 'success');
        } catch {
          addStatus(
            'Certaines colonnes requises n\'ont pas pu être détectées automatiquement. Veuillez les mapper manuellement.',
            'warning',
          );
        }

        setState((prev) => ({
          ...prev,
          selectedSheet: sheetName,
          sheetColumns: headers,
          columnSamples,
          columnMapping,
        }));
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Erreur lors de la sélection de la feuille';
        addStatus(message, 'error');
      } finally {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    },
    [state.excelBuffer, addStatus],
  );

  /**
   * Met à jour le mapping des colonnes
   */
  const handleColumnMappingChange = useCallback((key: ColumnKey, value: string) => {
    setState((prev) => ({
      ...prev,
      columnMapping: {
        ...prev.columnMapping,
        [key]: value,
      },
    }));
  }, [addStatus]);

  /**
   * Met à jour la plage de dates
   */
  const handleDateRangeChange = useCallback((startDate: Date | null, endDate: Date | null) => {
    setState((prev) => ({
      ...prev,
      dateRange: [startDate, endDate],
    }));
  }, []);

  /**
   * Met à jour le filtre de programme
   */
  const handleFilterProgramChange = useCallback((program: string) => {
    setState((prev) => ({
      ...prev,
      filterProgram: program,
    }));
  }, []);

  /**
   * Génère les rapports
   */
  const handleGenerate = useCallback(async () => {
    setState((prev) => ({ ...prev, isGenerating: true }));
    clearStatuses();

    try {
      const { excelBuffer, selectedSheet, columnMapping, dateRange, filterProgram } = state;

      if (!excelBuffer) {
        throw new Error('Aucun fichier Excel chargé');
      }

      if (!columnMapping.START || !columnMapping.END || !columnMapping.EMAIL || !columnMapping.NAME) {
        throw new Error('Les colonnes n\'ont pas été mappées correctement');
      }

      const [startDate, endDate] = dateRange;

      const result = await generateReports({
        excelBuffer,
        sheetName: selectedSheet,
        columnMapping,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        filterProgram: filterProgram || undefined,
        onProgress: addStatus,
      });

      // Télécharge le fichier
      saveAs(result.blob, result.filename);
      addStatus(
        `${result.studentCount} rapport(s) généré(s) avec succès`,
        'success',
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur lors de la génération';
      addStatus(message, 'error');
    } finally {
      setState((prev) => ({ ...prev, isGenerating: false }));
    }
  }, [state, addStatus, clearStatuses]);

  /**
   * Réinitialise l'état
   */
  const reset = useCallback(() => {
    setState(initialState);
    clearStatuses();
  }, [clearStatuses]);

  return {
    ...state,
    addStatus,
    clearStatuses,
    handleFileUpload,
    handleSheetSelect,
    handleColumnMappingChange,
    handleDateRangeChange,
    handleFilterProgramChange,
    handleGenerate,
    reset,
  };
}
