import { useState, useCallback } from "react";
import * as XLSX from "xlsx";
import type { ColumnMapping, ColumnSample } from "../types";
import { autoDetectMapping, createEmptyMapping, toColumnSamples } from "../utils";
import { REQUIRED_KEYS } from "../constants";

export interface UseExcelSheetResult {
  workbook: XLSX.WorkBook | null;
  sheetNames: string[];
  selectedSheet: string;
  sheetColumns: string[];
  columnMapping: ColumnMapping;
  columnSamples: ColumnSample[];
  sourceFileName: string;
  handleFilePick: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleSheetChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  handleColumnMappingChange: (key: string, value: string) => void;
  getWorksheet: () => XLSX.WorkSheet;
}

export function useExcelSheet(
  onError: (message: string) => void
): UseExcelSheetResult {
  const [workbook, setWorkbook] = useState<XLSX.WorkBook | null>(null);
  const [sheetNames, setSheetNames] = useState<string[]>([]);
  const [selectedSheet, setSelectedSheet] = useState<string>("");
  const [sheetColumns, setSheetColumns] = useState<string[]>([]);
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>(() =>
    createEmptyMapping()
  );
  const [columnSamples, setColumnSamples] = useState<ColumnSample[]>([]);
  const [sourceFileName, setSourceFileName] = useState("");

  const updateColumnsFromSheet = useCallback(
    (sheetName: string, book: XLSX.WorkBook) => {
      const worksheet = book.Sheets[sheetName];
      if (!worksheet) {
        setSheetColumns([]);
        setColumnSamples([]);
        setColumnMapping(createEmptyMapping());
        onError(`L'onglet ${sheetName} est introuvable dans le fichier.`);
        return;
      }

      const rows = XLSX.utils.sheet_to_json<unknown[]>(worksheet, {
        header: 1,
      });
      const rawHeaders = Array.isArray(rows[0]) ? (rows[0] as unknown[]) : [];
      const normalizedHeaders = rawHeaders.map((cell) =>
        String(cell ?? "").trim()
      );
      const headers = normalizedHeaders.filter(
        (value, index, array) => value && array.indexOf(value) === index
      );

      setSheetColumns(headers);
      setColumnMapping((previous) => {
        if (!headers.length) return previous;
        
        const suggestions = autoDetectMapping(headers);
        const next = createEmptyMapping();
        for (const key of REQUIRED_KEYS) {
          next[key] = suggestions[key] ?? previous[key] ?? "";
        }
        return next;
      });
      setColumnSamples(
        headers.length
          ? toColumnSamples(rows as unknown[][], normalizedHeaders)
          : []
      );
    },
    [onError]
  );

  const handleFilePick = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      try {
        const buffer = await file.arrayBuffer();
        const parsedWorkbook = XLSX.read(buffer, { type: "array" });
        
        if (!parsedWorkbook.SheetNames.length) {
          onError("Le fichier Excel ne contient aucun onglet.");
          return;
        }

        setWorkbook(parsedWorkbook);
        setSheetNames(parsedWorkbook.SheetNames);
        const firstSheet = parsedWorkbook.SheetNames[0] ?? "";
        setSelectedSheet(firstSheet);
        setSourceFileName(file.name);

        if (firstSheet) {
          updateColumnsFromSheet(firstSheet, parsedWorkbook);
        } else {
          setSheetColumns([]);
          setColumnSamples([]);
          setColumnMapping(createEmptyMapping());
        }
      } catch (error) {
        console.error(error);
        onError("Impossible de lire le fichier Excel fourni.");
      }
    },
    [onError, updateColumnsFromSheet]
  );

  const handleSheetChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const sheet = event.target.value;
      setSelectedSheet(sheet);
      if (workbook && sheet) {
        updateColumnsFromSheet(sheet, workbook);
      }
    },
    [updateColumnsFromSheet, workbook]
  );

  const handleColumnMappingChange = useCallback(
    (key: string, value: string) => {
      setColumnMapping((previous) => ({ ...previous, [key]: value }));
    },
    []
  );

  const getWorksheet = useCallback(() => {
    if (!workbook || !selectedSheet) {
      throw new Error(
        "Veuillez importer un fichier Excel et choisir un onglet avant de générer les dossiers."
      );
    }
    const worksheet = workbook.Sheets[selectedSheet];
    if (!worksheet) {
      throw new Error(
        `Impossible de trouver l'onglet ${selectedSheet} dans le fichier.`
      );
    }
    return worksheet;
  }, [selectedSheet, workbook]);

  return {
    workbook,
    sheetNames,
    selectedSheet,
    sheetColumns,
    columnMapping,
    columnSamples,
    sourceFileName,
    handleFilePick,
    handleSheetChange,
    handleColumnMappingChange,
    getWorksheet,
  };
}
