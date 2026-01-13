import { useState, useCallback } from 'react';
import * as XLSX from 'xlsx';
import type { ColumnMapping, ColumnSamples } from '../types';
import { autoMapColumns, extractColumnSamples } from '../utils';
import type { ColumnMapperField } from '@/app/components/column-mapper/ColumnMapper';

export interface UseExcelFileResult {
  file: File | null;
  workbook: XLSX.WorkBook | null;
  sheetNames: string[];
  selectedSheet: string;
  sheetColumns: string[];
  columnMapping: ColumnMapping;
  columnSamples: ColumnSamples;
  handleFileUpload: (file: File) => Promise<void>;
  handleSheetSelect: (sheetName: string) => void;
  handleColumnMappingChange: (fieldKey: string, columnName: string) => void;
  getWorksheet: () => XLSX.WorkSheet | null;
}

export function useExcelFile(
  fields: readonly ColumnMapperField[],
  onError: (message: string) => void
): UseExcelFileResult {
  const [file, setFile] = useState<File | null>(null);
  const [workbook, setWorkbook] = useState<XLSX.WorkBook | null>(null);
  const [sheetNames, setSheetNames] = useState<string[]>([]);
  const [selectedSheet, setSelectedSheet] = useState<string>('');
  const [sheetColumns, setSheetColumns] = useState<string[]>([]);
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({});
  const [columnSamples, setColumnSamples] = useState<ColumnSamples>({});

  const handleFileUpload = useCallback(
    async (file: File) => {
      try {
        setFile(file);
        const buffer = await file.arrayBuffer();
        const wb = XLSX.read(buffer);
        setWorkbook(wb);
        setSheetNames(wb.SheetNames);

        if (wb.SheetNames.length > 0) {
          const firstSheet = wb.SheetNames[0];
          setSelectedSheet(firstSheet);

          const worksheet = wb.Sheets[firstSheet];
          if (worksheet) {
            const data = XLSX.utils.sheet_to_json<unknown>(worksheet, { header: 1 });
            const headers = Array.isArray(data[0]) ? (data[0] as string[]) : [];
            setSheetColumns(headers);

            const mapping = autoMapColumns(headers, fields);
            setColumnMapping(mapping);

            const samples = extractColumnSamples(worksheet, mapping);
            setColumnSamples(samples);
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement du fichier:', error);
        onError('Impossible de lire le fichier Excel.');
      }
    },
    [fields, onError]
  );

  const handleSheetSelect = useCallback(
    (sheetName: string) => {
      if (!workbook) return;

      setSelectedSheet(sheetName);

      const worksheet = workbook.Sheets[sheetName];
      if (worksheet) {
        const data = XLSX.utils.sheet_to_json<unknown>(worksheet, { header: 1 });
        const headers = Array.isArray(data[0]) ? (data[0] as string[]) : [];
        setSheetColumns(headers);

        const mapping = autoMapColumns(headers, fields);
        setColumnMapping(mapping);

        const samples = extractColumnSamples(worksheet, mapping);
        setColumnSamples(samples);
      }
    },
    [workbook, fields]
  );

  const handleColumnMappingChange = useCallback(
    (fieldKey: string, columnName: string) => {
      const newMapping = { ...columnMapping, [fieldKey]: columnName };
      setColumnMapping(newMapping);

      if (workbook && selectedSheet) {
        const worksheet = workbook.Sheets[selectedSheet];
        const samples = extractColumnSamples(worksheet, newMapping);
        setColumnSamples(samples);
      }
    },
    [columnMapping, workbook, selectedSheet]
  );

  const getWorksheet = useCallback(() => {
    if (!workbook || !selectedSheet) return null;
    return workbook.Sheets[selectedSheet] || null;
  }, [workbook, selectedSheet]);

  return {
    file,
    workbook,
    sheetNames,
    selectedSheet,
    sheetColumns,
    columnMapping,
    columnSamples,
    handleFileUpload,
    handleSheetSelect,
    handleColumnMappingChange,
    getWorksheet,
  };
}
