import * as XLSX from 'xlsx';
import { ColumnKey, ColumnMapping, ColumnSample, StudentReport } from '../types';
import { COLUMN_ALIASES } from '../constants';

const REQUIRED_KEYS: ColumnKey[] = ['START', 'END', 'EMAIL', 'NAME'];

export function createEmptyColumnMapping(): ColumnMapping {
  return {
    START: '',
    END: '',
    EMAIL: '',
    NAME: '',
    PROGRAM: '',
  };
}

/**
 * Résout un alias de colonne en trouvant le nom réel dans le DataFrame
 */
function resolveColumn(columns: string[], candidates: string[]): string | null {
  for (const candidate of candidates) {
    if (columns.includes(candidate)) {
      return candidate;
    }
  }
  return null;
}

/**
 * Type guard pour vérifier si un objet est un valide ColumnMapping
 */
function isCompleteColumnMapping(obj: Partial<ColumnMapping>): obj is ColumnMapping {
  return REQUIRED_KEYS.every((key) => typeof obj[key] === 'string' && Boolean(obj[key]));
}

/**
 * Détecte automatiquement les colonnes requises (FR/EN)
 */
export function resolveHeaders(columns: string[]): ColumnMapping {
  const mapping: ColumnMapping = {
    START: resolveColumn(columns, COLUMN_ALIASES.START) ?? '',
    END: resolveColumn(columns, COLUMN_ALIASES.END) ?? '',
    EMAIL: resolveColumn(columns, COLUMN_ALIASES.EMAIL) ?? '',
    NAME: resolveColumn(columns, COLUMN_ALIASES.NAME) ?? '',
    PROGRAM: resolveColumn(columns, COLUMN_ALIASES.PROGRAM) ?? '',
  };

  if (!isCompleteColumnMapping(mapping)) {
    const missing = REQUIRED_KEYS.filter((key) => !mapping[key]);
    throw new Error(`Colonnes requises manquantes : ${missing.join(', ')}`);
  }

  return mapping;
}

/**
 * Formate une date Excel en objet Date JavaScript
 * Conversion depuis serial Excel (origin: 1899-12-30)
 */
function excelDateToJSDate(excelDate: number | Date | string): Date {
  if (excelDate instanceof Date) return excelDate;
  if (typeof excelDate === 'string') {
    const parsed = new Date(excelDate);
    if (!isNaN(parsed.getTime())) return parsed;
  }

  // Excel serial conversion (1899-12-30 origin)
  if (typeof excelDate === 'number') {
    const ms = (excelDate - 25569) * 24 * 60 * 60 * 1000;
    return new Date(ms);
  }

  return new Date();
}

/**
 * Vérifie si deux intervalles se chevauchent
 * [rowStart, rowEnd] chevauche [winStart, winEnd]
 */
function overlapsInterval(rowStart: Date, rowEnd: Date, winStart: Date, winEnd: Date): boolean {
  return rowEnd >= winStart && rowStart <= winEnd;
}

/**
 * Parse une feuille Excel et retourne un tableau typé StudentReport[]
 */
export function parseExcelSheet(
  worksheet: XLSX.WorkSheet,
  columnMapping: ColumnMapping,
  filterStartDate?: Date,
  filterEndDate?: Date,
  filterProgram?: string,
): StudentReport[] {
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet);

  const results: StudentReport[] = [];

  for (const row of rows) {
    // Extraction des champs
    const email = String((row[columnMapping.EMAIL] as unknown) || '').trim();
    const nom = String((row[columnMapping.NAME] as unknown) || '').trim();
    const programme = columnMapping.PROGRAM
      ? String((row[columnMapping.PROGRAM] as unknown) || '').trim()
      : undefined;

    // Parse dates
    const startTime = excelDateToJSDate((row[columnMapping.START] as unknown) as string | number | Date);
    const endTime = excelDateToJSDate((row[columnMapping.END] as unknown) as string | number | Date);

    // Filtre par plage dates
    if (filterStartDate && filterEndDate) {
      if (!overlapsInterval(startTime, endTime, filterStartDate, filterEndDate)) {
        continue;
      }
    }

    // Filtre par programme
    if (filterProgram && programme && programme.toLowerCase() !== filterProgram.toLowerCase()) {
      continue;
    }

    // Récupère toutes les réponses (colonnes non standards)
    const standardKeys = new Set([
      columnMapping.START,
      columnMapping.END,
      columnMapping.EMAIL,
      columnMapping.NAME,
      columnMapping.PROGRAM,
    ]);

    const responses: Record<string, string> = {};
    for (const [key, value] of Object.entries(row)) {
      if (!standardKeys.has(key)) {
        responses[key] = value ? String(value) : '';
      }
    }

    // Ajoute les réponses standard aussi (pour les sections)
    // On ajoute juste le nom et programme si dispo
    if (nom) responses[columnMapping.NAME] = nom;
    if (programme && columnMapping.PROGRAM) responses[columnMapping.PROGRAM] = programme;

    results.push({
      email,
      nom,
      programme,
      startTime,
      endTime,
      responses,
    });
  }

  return results;
}

/**
 * Lit un fichier Excel et retourne les noms des feuilles
 */
export function getExcelSheets(buffer: ArrayBuffer): string[] {
  const workbook = XLSX.read(buffer, { type: 'array' });
  return workbook.SheetNames;
}

/**
 * Lit une feuille spécifique d'un fichier Excel
 */
export function readExcelWorksheet(buffer: ArrayBuffer, sheetName: string): XLSX.WorkSheet {
  const workbook = XLSX.read(buffer, { type: 'array' });
  const worksheet = workbook.Sheets[sheetName];
  if (!worksheet) {
    throw new Error(`Feuille '${sheetName}' non trouvée`);
  }
  return worksheet;
}

/**
 * Récupère les en-têtes (première ligne) d'une feuille Excel
 */
export function getExcelHeaders(worksheet: XLSX.WorkSheet): string[] {
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet);
  if (rows.length === 0) return [];
  return Object.keys(rows[0]);
}

export function getWorksheetRows(worksheet: XLSX.WorkSheet): unknown[][] {
  return XLSX.utils.sheet_to_json<unknown[]>(worksheet, { header: 1 });
}

export function getColumnSamples(worksheet: XLSX.WorkSheet): ColumnSample[] {
  const rows = getWorksheetRows(worksheet);
  const rawHeaders = Array.isArray(rows[0]) ? rows[0] : [];
  const normalizedHeaders = rawHeaders.map((cell) => String(cell ?? '').trim());
  const headers = normalizedHeaders.filter(
    (value, index, array) => value && array.indexOf(value) === index,
  );

  return headers.map((header, index) => ({
    header,
    values: rows
      .slice(1, 6)
      .map((row) => {
        const values = Array.isArray(row) ? row : [];
        const value = values[index];
        return value == null ? '' : String(value);
      }),
  }));
}
