import { useCallback, useState } from 'react';
import type { ColumnMapping, ColumnSample, ProcessedOffer } from '../types';
import { useStatusMessages } from './useStatusMessages';
import {
  autoDetectMapping,
  createEmptyMapping,
  toColumnSamples,
} from '../utils/columnUtils';
import {
  readSheetTable,
  readWorkbookFromFile,
  toSheetRecords,
} from '@/app/utils/spreadsheetUtils';
import { nextPaint, waitForMinimumDuration } from '@/app/utils/asyncUtils';
import type { ProgressState } from '@/app/components/progress-indicator/types';
import { IMPORT_STEPS, MINIMUM_IMPORT_FEEDBACK_MS } from '../constants';

/**
 * Charge le fichier d'offres et prépare l'association des colonnes.
 *
 * Chaque étape est annoncée avant d'être exécutée, puis la main est rendue au
 * navigateur : l'indicateur de progression reste ainsi fidèle même quand
 * l'analyse d'un gros classeur monopolise le fil d'exécution.
 */
export function useOfferImport() {
  const [file, setFile] = useState<File | null>(null);
  const [sheetColumns, setSheetColumns] = useState<string[]>([]);
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>(
    createEmptyMapping()
  );
  const [columnSamples, setColumnSamples] = useState<ColumnSample[]>([]);
  const [offers, setOffers] = useState<ProcessedOffer[]>([]);
  const [importProgress, setImportProgress] = useState<ProgressState | null>(
    null
  );

  const {
    statusMessages: importMessages,
    pushStatus,
    clearStatus,
  } = useStatusMessages();

  const importFile = useCallback(
    async (uploadedFile: File) => {
      const startedAt = performance.now();
      clearStatus();
      setImportProgress(IMPORT_STEPS.reading);

      try {
        await nextPaint();
        const workbook = await readWorkbookFromFile(uploadedFile);

        if (!workbook.SheetNames.length) {
          pushStatus('error', 'Le fichier Excel ne contient aucun onglet.');
          return;
        }

        setImportProgress(IMPORT_STEPS.parsing);
        await nextPaint();

        // Seul le premier onglet est utilisé : le formulaire y dépose ses
        // réponses.
        const table = readSheetTable(workbook.Sheets[workbook.SheetNames[0]]);
        const headers = table.headers.filter(
          (value, index, array) => value && array.indexOf(value) === index
        );

        if (!headers.length) {
          pushStatus('error', 'Le fichier ne contient aucune colonne.');
          return;
        }

        const records = toSheetRecords(table);

        if (!records.length) {
          pushStatus('error', 'Le fichier ne contient aucune donnée.');
          return;
        }

        setImportProgress(IMPORT_STEPS.detecting);
        await nextPaint();

        setFile(uploadedFile);
        setSheetColumns(headers);
        setColumnMapping(autoDetectMapping(headers));
        setColumnSamples(toColumnSamples(table));
        setOffers(records);

        pushStatus('success', `${records.length} offre(s) chargée(s).`);
      } catch (error) {
        console.error('Error reading Excel file:', error);
        pushStatus('error', 'Erreur lors de la lecture du fichier Excel.');
      } finally {
        // Un fichier léger est traité en quelques millisecondes : sans ce
        // plancher, l'indicateur n'apparaîtrait que le temps d'un clignotement.
        await waitForMinimumDuration(startedAt, MINIMUM_IMPORT_FEEDBACK_MS);
        setImportProgress(null);
      }
    },
    [clearStatus, pushStatus]
  );

  const updateColumnMapping = useCallback(
    (key: keyof ColumnMapping, value: string) => {
      setColumnMapping((previous) => ({ ...previous, [key]: value }));
    },
    []
  );

  return {
    file,
    sheetColumns,
    columnMapping,
    columnSamples,
    offers,
    importProgress,
    importMessages,
    isImporting: importProgress !== null,
    importFile,
    updateColumnMapping,
  };
}
