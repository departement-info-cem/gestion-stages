import { useState, useMemo, useCallback } from "react";
import { PROGRAM_OPTIONS, REQUIRED_KEYS } from "./constants";
import type { ProgramId, ColumnKey } from "./types";
import { useStatusMessages } from "./hooks/useStatusMessages";
import { useExcelSheet } from "./hooks/useExcelSheet";
import { generateDossiers } from "./services/generateDossiers";

export function useDossierGenerator() {
  const [program, setProgram] = useState<ProgramId>(PROGRAM_OPTIONS[0].id);
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportUrl, setReportUrl] = useState("");

  const { statusMessages, pushStatus } = useStatusMessages();

  const {
    sheetNames,
    selectedSheet,
    sheetColumns,
    columnMapping,
    columnSamples,
    sourceFileName,
    handleFilePick,
    handleSheetChange,
    handleColumnMappingChange: handleColumnMappingChangeBase,
    getWorksheet,
  } = useExcelSheet((message) => pushStatus("error", message));

  const selectedProgram = useMemo(
    () =>
      PROGRAM_OPTIONS.find((option) => option.id === program) ??
      PROGRAM_OPTIONS[0],
    [program]
  );

  const handleColumnMappingChange = useCallback(
    (key: ColumnKey, value: string) => {
      handleColumnMappingChangeBase(key, value);
    },
    [handleColumnMappingChangeBase]
  );

  const ensureColumnMapping = useCallback(() => {
    const missing = REQUIRED_KEYS.filter((key) => !columnMapping[key]);
    if (missing.length) {
      throw new Error(
        "Veuillez associer toutes les colonnes requises (matricule, nom, superviseur)."
      );
    }
  }, [columnMapping]);

  const generate = useCallback(async () => {
    try {
      const worksheet = getWorksheet();
      ensureColumnMapping();

      if (!reportUrl.trim()) {
        throw new Error(
          "Veuillez entrer un lien vers le rapport en ligne."
        );
      }

      setIsGenerating(true);

      const processed = await generateDossiers({
        worksheet,
        columnMapping,
        selectedProgram,
        reportUrl,
        onStatus: pushStatus,
      });

      pushStatus(
        "success",
        `Dossiers générés pour ${processed} étudiant(s).`
      );
    } catch (error) {
      if (error instanceof Error) {
        pushStatus("error", error.message);
      }
    } finally {
      setIsGenerating(false);
    }
  }, [
    columnMapping,
    ensureColumnMapping,
    getWorksheet,
    pushStatus,
    reportUrl,
    selectedProgram,
  ]);

  const readyToGenerate = useMemo(
    () =>
      Boolean(
        sheetColumns.length &&
        REQUIRED_KEYS.every((key) => columnMapping[key]) &&
        reportUrl.trim()
      ),
    [columnMapping, sheetColumns, reportUrl]
  );

  return {
    program,
    setProgram,
    selectedProgram,
    sheetNames,
    selectedSheet,
    sheetColumns,
    columnMapping,
    columnSamples,
    statusMessages,
    isGenerating,
    sourceFileName,
    readyToGenerate,
    reportUrl,
    setReportUrl,
    handleFilePick,
    handleSheetChange,
    handleColumnMappingChange,
    generate,
  };
}
