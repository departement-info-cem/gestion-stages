import type { ColumnKey, ColumnMapping, ColumnSample } from "../types";
import { COLUMN_KEYWORDS } from "../constants";
import { detectColumnMapping } from "@/app/utils/columnMatching";
import { parseDate, formatDateFrench } from "./dateUtils";

export function createEmptyMapping(): ColumnMapping {
  return {
    matricule: "",
    name: "",
    supervisor: "",
  };
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
    return dateKeywords.some((keyword) => normalized.includes(keyword));
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
    const values = allColumnValues[headerIndex].slice(
      0,
      lastNonEmptyRowIndex + 1
    );
    return { header, values };
  });
}

export function autoDetectMapping(headers: string[]): ColumnMapping {
  return {
    ...createEmptyMapping(),
    ...detectColumnMapping<ColumnKey>(headers, COLUMN_KEYWORDS),
  };
}
