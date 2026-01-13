import JSZip from "jszip";
import { saveAs } from "file-saver";
import type * as XLSX from "xlsx";
import type { ColumnMapping, ProgramOption } from "../types";
import { parseStudentName, slugify, buildEvaluationWorkbook, resolveAssetPath } from "../utils";
import { templateCache } from "./templateCache";

export interface GenerateDossiersParams {
  worksheet: XLSX.WorkSheet;
  columnMapping: ColumnMapping;
  selectedProgram: ProgramOption;
  onStatus: (tone: "error" | "success" | "info", message: string) => void;
}

export async function generateDossiers({
  worksheet,
  columnMapping,
  selectedProgram,
  onStatus,
}: GenerateDossiersParams): Promise<number> {
  const XLSX = await import("xlsx");
  
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, {
    defval: "",
    raw: false,
  });

  const [suiviBuffer, evaluationBuffer, readmeTemplate, guideBuffer] =
    await Promise.all([
      templateCache.getBinary(
        resolveAssetPath(selectedProgram.templates.suivi)
      ),
      templateCache.getBinary(
        resolveAssetPath(selectedProgram.templates.evaluation)
      ),
      templateCache.getText(
        resolveAssetPath(selectedProgram.templates.readme)
      ),
      templateCache.getBinary(
        resolveAssetPath(selectedProgram.templates.guide)
      ),
    ]);

  const zip = new JSZip();
  const root = zip.folder("dossiersEtu");
  if (!root) throw new Error("Impossible de préparer l'archive ZIP.");

  const suivisFolder = root.folder("suivis");
  const evaluationFolder = root.folder("Evaluation_Entreprise");
  if (!suivisFolder || !evaluationFolder) {
    throw new Error("Impossible de créer la structure de sortie.");
  }

  let processed = 0;

  for (const row of rows) {
    const supervisor = String(row[columnMapping.supervisor] ?? "").trim();
    const name = String(row[columnMapping.name] ?? "").trim();
    
    if (!supervisor || !name) continue;

    let parsedName;
    try {
      parsedName = parseStudentName(name);
    } catch (error) {
      if (error instanceof Error) onStatus("error", error.message);
      continue;
    }

    const folderKey = slugify(
      `${parsedName.lastName}_${parsedName.firstName}`
    );
    const studentFolder = suivisFolder.folder(folderKey);
    
    if (!studentFolder) {
      onStatus(
        "error",
        `Impossible de créer le dossier ${folderKey} dans l'archive.`
      );
      continue;
    }

    studentFolder.file(`Suivi_${folderKey}.xlsx`, new Uint8Array(suiviBuffer), {
      binary: true,
    });

    let evaluationWorkbook: ArrayBuffer;
    try {
      evaluationWorkbook = await buildEvaluationWorkbook(
        evaluationBuffer,
        `${parsedName.firstName} ${parsedName.lastName}`,
        selectedProgram.code
      );
    } catch (error) {
      if (error instanceof Error) onStatus("error", error.message);
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
    
    studentFolder.file("README.md", customizedReadme);
    studentFolder.file("Guide_rapport.docx", new Uint8Array(guideBuffer), {
      binary: true,
    });
    
    processed += 1;
  }

  if (!processed) {
    throw new Error(
      "Aucune ligne valide trouvée. Vérifiez les colonnes sélectionnées et les superviseurs."
    );
  }

  const archive = await zip.generateAsync({
    type: "blob",
    compression: "DEFLATE",
  });
  
  const filename = `${selectedProgram.id}-dossiers-${Date.now()}.zip`;
  saveAs(archive, filename);

  return processed;
}
