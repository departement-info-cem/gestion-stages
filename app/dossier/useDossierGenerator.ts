import { useCallback, useMemo, useRef, useState } from "react";
import saveAs from "file-saver";
import JSZip from "jszip";
import * as XLSX from "xlsx";
import { PROGRAM_OPTIONS, REQUIRED_KEYS } from "./constants";
import type {
  ColumnKey,
  ColumnMapping,
  ColumnSample,
  ProgramId,
  ProfileCode,
  ProfileMode,
  StatusMessage,
  StatusTone,
} from "./types";
import {
  buildEvaluationWorkbook,
  createEmptyMapping,
  autoDetectMapping,
  parseStudentName,
  resolveAssetPath,
  slugify,
  toColumnSamples,
} from "./utils";
// Helper cache entry structure for template data

type TemplateCacheEntry = {
  kind: "binary" | "text";
  value: ArrayBuffer | string;
};

export function useDossierGenerator() {
  const [program, setProgram] = useState<ProgramId>(PROGRAM_OPTIONS[0].id);
  const [workbook, setWorkbook] = useState<XLSX.WorkBook | null>(null);
  const [sheetNames, setSheetNames] = useState<string[]>([]);
  const [selectedSheet, setSelectedSheet] = useState<string>("");
  const [sheetColumns, setSheetColumns] = useState<string[]>([]);
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>(() =>
    createEmptyMapping()
  );
  const [columnSamples, setColumnSamples] = useState<ColumnSample[]>([]);
  const [statusMessages, setStatusMessages] = useState<StatusMessage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [sourceFileName, setSourceFileName] = useState("");
  const [profileMode, setProfileMode] = useState<ProfileMode>("column");
  const [fixedProfileCode, setFixedProfileCode] = useState<ProfileCode>("420.BA");

  const statusIdRef = useRef(0);
  const templateCacheRef = useRef<Map<string, TemplateCacheEntry>>(new Map());

  const selectedProgram = useMemo(
    () =>
      PROGRAM_OPTIONS.find((option) => option.id === program) ??
      PROGRAM_OPTIONS[0],
    [program]
  );

  const pushStatus = useCallback((tone: StatusTone, message: string) => {
    statusIdRef.current += 1;
    const uniqueId = Date.now() + statusIdRef.current;
    setStatusMessages((previous) => [
      { id: uniqueId, tone, message },
      ...previous.slice(0, 4),
    ]);
  }, []);

  const updateColumnsFromSheet = useCallback(
    (sheetName: string, book: XLSX.WorkBook) => {
      const worksheet = book.Sheets[sheetName];
      if (!worksheet) {
        setSheetColumns([]);
        setColumnSamples([]);
        setColumnMapping(createEmptyMapping());
        pushStatus(
          "error",
          `L'onglet ${sheetName} est introuvable dans le fichier.`
        );
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
        if (!headers.length) return createEmptyMapping();
        const suggestions = autoDetectMapping(headers);
        const next = createEmptyMapping();
        for (const key of REQUIRED_KEYS) {
          const currentValue = previous[key];
          next[key] =
            currentValue && headers.includes(currentValue)
              ? currentValue
              : suggestions[key];
        }
        return next;
      });
      setColumnSamples(
        headers.length
          ? toColumnSamples(rows as unknown[][], normalizedHeaders)
          : []
      );
    },
    [pushStatus]
  );

  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      try {
        const buffer = await file.arrayBuffer();
        const parsedWorkbook = XLSX.read(buffer, { type: "array" });
        if (!parsedWorkbook.SheetNames.length) {
          pushStatus("error", "Le classeur Excel ne contient aucun onglet.");
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
        pushStatus("error", "Impossible de lire le fichier Excel fourni.");
      }
    },
    [pushStatus, updateColumnsFromSheet]
  );

  const handleSheetChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const sheet = event.target.value;
      setSelectedSheet(sheet);
      if (workbook && sheet) updateColumnsFromSheet(sheet, workbook);
    },
    [updateColumnsFromSheet, workbook]
  );

  const handleColumnMappingChange = useCallback(
    (key: ColumnKey, value: string) => {
      setColumnMapping((previous) => ({ ...previous, [key]: value }));
    },
    []
  );

  const getTemplateBinary = useCallback(async (path: string) => {
    const cached = templateCacheRef.current.get(path);
    if (cached?.kind === "binary" && cached.value instanceof ArrayBuffer)
      return cached.value;
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(
        `Le fichier de gabarit ${path} est introuvable. Ajoutez-le dans public${path}.`
      );
    }
    const buffer = await response.arrayBuffer();
    templateCacheRef.current.set(path, { kind: "binary", value: buffer });
    return buffer;
  }, []);

  const getTemplateText = useCallback(async (path: string) => {
    const cached = templateCacheRef.current.get(path);
    if (cached?.kind === "text" && typeof cached.value === "string")
      return cached.value;
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(
        `Le fichier de gabarit ${path} est introuvable. Ajoutez-le dans public${path}.`
      );
    }
    const content = await response.text();
    templateCacheRef.current.set(path, { kind: "text", value: content });
    return content;
  }, []);

  const ensureSheetSetup = useCallback(() => {
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

  const ensureColumnMapping = useCallback(() => {
    const missing = REQUIRED_KEYS.filter((key) => {
      if (key === "profile" && profileMode === "fixed") return false;
      return !columnMapping[key];
    });
    if (missing.length) {
      throw new Error(
        "Veuillez associer toutes les colonnes requises (matricule, nom, profil, superviseur)."
      );
    }
  }, [columnMapping, profileMode]);

  const generate = useCallback(async () => {
    let worksheet: XLSX.WorkSheet;
    try {
      worksheet = ensureSheetSetup();
      ensureColumnMapping();
    } catch (error) {
      if (error instanceof Error) pushStatus("error", error.message);
      return;
    }

    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, {
      defval: "",
      raw: false,
    });
    const suiviBuffer = await getTemplateBinary(
      resolveAssetPath(selectedProgram.templates.suivi)
    );
    const evaluationBuffer = await getTemplateBinary(
      resolveAssetPath(selectedProgram.templates.evaluation)
    );
    const readmeTemplate = await getTemplateText(
      resolveAssetPath(selectedProgram.templates.readme)
    );
    const guideBuffer = await getTemplateBinary(
      resolveAssetPath(selectedProgram.templates.guide)
    );

    const zip = new JSZip();
    const root = zip.folder("dossiersEtu");
    if (!root) throw new Error("Impossible de préparer l'archive ZIP.");
    const suivisFolder = root.folder("suivis");
    const evaluationFolder = root.folder("Evaluation_Entreprise");
    if (!suivisFolder || !evaluationFolder)
      throw new Error("Impossible de créer la structure de sortie.");

    let processed = 0;
    for (const row of rows) {
      const supervisor = String(row[columnMapping.supervisor] ?? "").trim();
      const name = String(row[columnMapping.name] ?? "").trim();
      const profile = profileMode === "fixed" 
        ? fixedProfileCode
        : String(row[columnMapping.profile] ?? "").trim();
      if (!supervisor || !name) continue;

      let parsedName;
      try {
        parsedName = parseStudentName(name);
      } catch (error) {
        if (error instanceof Error) pushStatus("error", error.message);
        continue;
      }

      const folderKey = slugify(
        `${parsedName.lastName}_${parsedName.firstName}`
      );
      const studentFolder = suivisFolder.folder(folderKey);
      if (!studentFolder) {
        pushStatus(
          "error",
          `Impossible de créer le dossier ${folderKey} dans l'archive.`
        );
        continue;
      }

      studentFolder.file(
        `Suivi_${folderKey}.xlsx`,
        new Uint8Array(suiviBuffer),
        { binary: true }
      );

      let evaluationWorkbook: ArrayBuffer;
      try {
        evaluationWorkbook = buildEvaluationWorkbook(
          evaluationBuffer,
          `${parsedName.firstName} ${parsedName.lastName}`,
          profile
        );
      } catch (error) {
        if (error instanceof Error) pushStatus("error", error.message);
        continue;
      }

      const evaluationBytes = new Uint8Array(evaluationWorkbook);
      studentFolder.file(`Auto_Evaluation_${folderKey}.xlsx`, evaluationBytes, {
        binary: true,
      });
      evaluationFolder.file(`${folderKey}.xlsx`, evaluationBytes, {
        binary: true,
      });

      const customizedReadme = readmeTemplate
        .replace(/ETUDIANT/g, parsedName.firstName)
        .replace(/SUPERVISEUR/g, supervisor);
      studentFolder.file("README.txt", customizedReadme);
      studentFolder.file("Guide_rapport.docx", new Uint8Array(guideBuffer), {
        binary: true,
      });
      processed += 1;
    }

    if (!processed) {
      pushStatus(
        "error",
        "Aucune ligne valide trouvée. Vérifiez les colonnes sélectionnées et les superviseurs."
      );
      return;
    }

    setIsGenerating(true);
    try {
      const archive = await zip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
      });
      const filename = `${selectedProgram.id}-dossiers-${Date.now()}.zip`;
      saveAs(archive, filename);
      pushStatus(
        "success",
        `Dossiers générés pour ${processed} étudiant(s). Téléchargement de ${filename}.`
      );
    } catch (error) {
      if (error instanceof Error) pushStatus("error", error.message);
    } finally {
      setIsGenerating(false);
    }
  }, [
    columnMapping,
    ensureColumnMapping,
    ensureSheetSetup,
    getTemplateBinary,
    getTemplateText,
    pushStatus,
    selectedProgram,
  ]);

  const readyToGenerate = useMemo(
    () =>
      Boolean(
        workbook &&
          selectedSheet &&
          sheetColumns.length &&
          REQUIRED_KEYS.every((key) => {
            if (key === "profile" && profileMode === "fixed") return true;
            return columnMapping[key];
          })
      ),
    [columnMapping, profileMode, selectedSheet, sheetColumns, workbook]
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
    profileMode,
    setProfileMode,
    fixedProfileCode,
    setFixedProfileCode,
    handleFileUpload,
    handleSheetChange,
    handleColumnMappingChange,
    generate,
  };
}
