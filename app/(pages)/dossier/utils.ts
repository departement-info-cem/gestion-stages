import * as ExcelJS from "exceljs";
import {
  COLUMN_KEYWORDS,
  PROGRAMMATION_CODES,
  RESEAUTIQUE_CODES,
} from "./constants";
import type { ColumnKey, ColumnMapping, ColumnSample } from "./types";

const ASSET_BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function createEmptyMapping(): ColumnMapping {
  return {
    matricule: "",
    name: "",
    supervisor: "",
  };
}

function normalizeToken(value: string): string {
  return value
    // Normalize accents and common non-breaking spaces
    .replace(/\u00A0/g, " ")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export function resolveAssetPath(relativePath: string): string {
  const normalized = relativePath.startsWith("/")
    ? relativePath
    : `/${relativePath}`;
  if (!ASSET_BASE_PATH) return normalized;
  const base = ASSET_BASE_PATH.endsWith("/")
    ? ASSET_BASE_PATH.slice(0, -1)
    : ASSET_BASE_PATH;
  return `${base}${normalized}`;
}

/**
 * Parse date from various formats
 */
function parseDate(dateStr: string): Date | null {
  if (!dateStr || dateStr.trim() === "") return null;

  // Try ISO format first (YYYY-MM-DD)
  const isoMatch = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    return new Date(dateStr);
  }

  // Try Excel serial number
  const excelSerial = parseFloat(dateStr);
  if (!isNaN(excelSerial) && excelSerial > 1 && excelSerial < 100000) {
    const excelEpoch = new Date(1899, 11, 30);
    const date = new Date(excelEpoch.getTime() + excelSerial * 86400000);
    return date;
  }

  return null;
}

/**
 * Format date to French format: "10 mars 2025"
 */
function formatDateFrench(date: Date): string {
  const months = [
    "janvier", "février", "mars", "avril", "mai", "juin",
    "juillet", "août", "septembre", "octobre", "novembre", "décembre"
  ];

  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}

export function toColumnSamples(
  rows: unknown[][],
  headers: string[]
): ColumnSample[] {
  // Keywords to identify date columns
  const dateKeywords = [
    "date de début",
    "date debut",
    "date de fin",
    "début du stage",
    "fin du stage",
    "indiquez la date",
  ];
  
  // Check if a header is a date column
  const isDateColumn = (header: string): boolean => {
    const normalized = header.toLowerCase().trim();
    return dateKeywords.some(keyword => normalized.includes(keyword));
  };
  
  // First, collect all values for all columns
  const allColumnValues = headers.map((header) => {
    const columnIndex = headers.indexOf(header);
    const shouldFormatDate = isDateColumn(header);
    
    return rows.slice(1).map((row) => {
      if (!Array.isArray(row)) return "";
      const rawValue = String(row[columnIndex] ?? "").trim();
      
      // Try to parse and format dates only for date columns
      if (rawValue && shouldFormatDate) {
        const parsedDate = parseDate(rawValue);
        if (parsedDate) {
          return formatDateFrench(parsedDate);
        }
      }
      
      return rawValue;
    });
  });

  // Find the last row index that has at least one non-empty value across all columns
  let lastNonEmptyRowIndex = -1;
  for (let rowIndex = 0; rowIndex < rows.length - 1; rowIndex++) {
    const hasNonEmptyValue = allColumnValues.some(
      (columnValues) => columnValues[rowIndex] && columnValues[rowIndex] !== ""
    );
    if (hasNonEmptyValue) {
      lastNonEmptyRowIndex = rowIndex;
    }
  }

  // Return samples with values up to the last non-empty row (keeping empty values in between)
  return headers.map((header, headerIndex) => {
    const values = allColumnValues[headerIndex].slice(0, lastNonEmptyRowIndex + 1);
    return { header, values };
  });
}

export function parseStudentName(raw: string) {
  const parts = raw.trim().split(/,\s*/);
  if (parts.length !== 2) {
    throw new Error(
      `Le nom d'étudiant « ${raw} » n'est pas au format "Nom, Prénom".`
    );
  }
  return {
    lastName: parts[0]?.trim() ?? "",
    firstName: parts[1]?.trim() ?? "",
  };
}

export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .replace(/_{2,}/g, "_")
    .toUpperCase();
}

export async function buildEvaluationWorkbook(
  buffer: ArrayBuffer,
  displayName: string,
  profileCode: string
): Promise<ArrayBuffer> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);
  
  const sheet = workbook.getWorksheet("evaluation");
  if (!sheet)
    throw new Error(
      "La feuille 'evaluation' est absente du gabarit d'évaluation."
    );
  
  const cellA1 = sheet.getCell("A1");
  cellA1.value = displayName;
  
  const track = PROGRAMMATION_CODES.has(profileCode)
    ? "Programmation"
    : RESEAUTIQUE_CODES.has(profileCode)
    ? "Réseautique"
    : profileCode;
  
  const cellA2 = sheet.getCell("A2");
  cellA2.value = track;
  
  return await workbook.xlsx.writeBuffer();
}

export function autoDetectMapping(headers: string[]): ColumnMapping {
  const suggestions = createEmptyMapping();
  const normalizedHeaders = headers.map((header, index) => ({
    original: header,
    normalized: normalizeToken(header),
    index,
  }));
  const assigned = new Set<number>();

  const assignMatch = (
    key: ColumnKey,
    predicate: (candidate: {
      original: string;
      normalized: string;
      index: number;
    }) => boolean
  ) => {
    if (suggestions[key]) return;
    const match = normalizedHeaders.find(
      (candidate) => !assigned.has(candidate.index) && predicate(candidate)
    );
    if (match) {
      suggestions[key] = match.original;
      assigned.add(match.index);
    }
  };

  (Object.keys(COLUMN_KEYWORDS) as ColumnKey[]).forEach((key) => {
    const keywords = COLUMN_KEYWORDS[key].map(normalizeToken);
    assignMatch(key, (candidate) => keywords.includes(candidate.normalized));
  });

  (Object.keys(COLUMN_KEYWORDS) as ColumnKey[]).forEach((key) => {
    const keywords = COLUMN_KEYWORDS[key].map(normalizeToken);
    assignMatch(key, (candidate) => {
      const tokens = candidate.normalized.split(" ");
      return keywords.some((keyword) =>
        keyword.includes(" ")
          ? candidate.normalized.includes(keyword)
          : tokens.includes(keyword)
      );
    });
  });

  return suggestions;
}
