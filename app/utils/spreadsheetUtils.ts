import * as XLSX from "xlsx";

const TEXT_FILE_EXTENSIONS: readonly string[] = [".csv", ".tsv", ".txt"];
const TEXT_MIME_TYPES: readonly string[] = ["text/csv", "text/plain", "text/tab-separated-values"];

function isTextFile(file: File): boolean {
  const name = file.name.toLowerCase();
  return (
    TEXT_FILE_EXTENSIONS.some((extension) => name.endsWith(extension)) ||
    TEXT_MIME_TYPES.includes(file.type)
  );
}

/**
 * Décode un fichier texte en UTF-8 (BOM géré), avec un repli sur Windows-1252
 * pour les exports produits par Excel en encodage occidental.
 */
export function decodeTextBuffer(buffer: ArrayBuffer): string {
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(buffer);
  } catch {
    return new TextDecoder("windows-1252").decode(buffer);
  }
}

/**
 * Lit un classeur à partir d'un fichier téléversé.
 *
 * Les fichiers texte (CSV, TSV) sont décodés explicitement avant l'analyse :
 * sans cela, SheetJS applique la page de codes Windows-1252 et les accents
 * d'un fichier UTF-8 sont corrompus (« déroulera » devient « dÃ©roulera »).
 */
export async function readWorkbookFromFile(file: File): Promise<XLSX.WorkBook> {
  const buffer = await file.arrayBuffer();

  if (isTextFile(file)) {
    return XLSX.read(decodeTextBuffer(buffer), { type: "string" });
  }

  return XLSX.read(buffer, { type: "array" });
}
