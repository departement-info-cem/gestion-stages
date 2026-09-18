import * as XLSX from "xlsx";
import type { SheetTable } from "./types";

const TEXT_FILE_EXTENSIONS: readonly string[] = [".csv", ".tsv", ".txt"];
const TEXT_MIME_TYPES: readonly string[] = ["text/csv", "text/plain", "text/tab-separated-values"];
const CELL_ADDRESS_PATTERN = /^[A-Z]+\d+$/;

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
 * Ramène la plage déclarée d'une feuille à ses cellules réellement présentes.
 *
 * Les exports Google Sheets annoncent la feuille entière (« A1:W1048576 »)
 * même pour une quinzaine de réponses. SheetJS parcourt alors des millions de
 * cellules inexistantes à chaque conversion : la lecture passe de quelques
 * millisecondes à plusieurs secondes, pendant lesquelles l'interface est figée.
 *
 * Seule la fin de la plage est rognée : le coin supérieur gauche déclaré est
 * conservé pour ne pas décaler les feuilles qui ne commencent pas en A1.
 */
export function shrinkWorksheetRange(worksheet: XLSX.WorkSheet): void {
  const declaredRef = worksheet["!ref"];
  if (!declaredRef) return;

  const declaredRange = XLSX.utils.decode_range(declaredRef);
  let lastRow = -1;
  let lastColumn = -1;

  for (const address of Object.keys(worksheet)) {
    if (!CELL_ADDRESS_PATTERN.test(address)) continue;
    const { r, c } = XLSX.utils.decode_cell(address);
    if (r > lastRow) lastRow = r;
    if (c > lastColumn) lastColumn = c;
  }

  if (lastRow < 0 || lastColumn < 0) return;

  worksheet["!ref"] = XLSX.utils.encode_range({
    s: declaredRange.s,
    e: {
      r: Math.max(declaredRange.s.r, Math.min(declaredRange.e.r, lastRow)),
      c: Math.max(declaredRange.s.c, Math.min(declaredRange.e.c, lastColumn)),
    },
  });
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
  const workbook = isTextFile(file)
    ? XLSX.read(decodeTextBuffer(buffer), { type: "string" })
    : XLSX.read(buffer, { type: "array" });

  for (const sheetName of workbook.SheetNames) {
    shrinkWorksheetRange(workbook.Sheets[sheetName]);
  }

  return workbook;
}

/**
 * Convertit une feuille en tableau de chaînes en un seul parcours.
 *
 * Les valeurs sont formatées comme à l'affichage dans le tableur (`raw: false`)
 * afin que l'aperçu des colonnes et les données générées montrent le même
 * texte.
 */
export function readSheetTable(worksheet: XLSX.WorkSheet): SheetTable {
  const grid = XLSX.utils.sheet_to_json<unknown[]>(worksheet, {
    header: 1,
    raw: false,
    blankrows: false,
  });

  const headerRow = Array.isArray(grid[0]) ? grid[0] : [];
  const headers = headerRow.map((cell) => String(cell ?? "").trim());
  const rows = grid
    .slice(1)
    .map((row) =>
      headers.map((_, index) =>
        Array.isArray(row) ? String(row[index] ?? "") : ""
      )
    );

  return { headers, rows };
}

/**
 * Associe chaque ligne à ses en-têtes, en ignorant les colonnes sans libellé
 * et les doublons (seule la première occurrence d'un libellé est retenue, comme
 * dans la liste de colonnes proposée à l'association).
 */
export function toSheetRecords(table: SheetTable): Record<string, string>[] {
  const namedColumns = table.headers
    .map((header, index) => ({ header, index }))
    .filter(
      ({ header, index }) =>
        header !== "" && table.headers.indexOf(header) === index
    );

  return table.rows.map((row) =>
    Object.fromEntries(
      namedColumns.map(({ header, index }) => [header, row[index] ?? ""])
    )
  );
}
