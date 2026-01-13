import type { ColumnMapping, ColumnSample, RequiredColumnKey } from '../types';
import { COLUMN_KEYWORDS } from '../constants';
import { normalizeToken } from './stringUtils';

export function createEmptyMapping(): ColumnMapping {
  return {
    companyName: '',
    targetProfiles: '',
    mandate: '',
    techContext: '',
    remunerationType: '',
    salary: '',
    vehicleRequired: '',
    schedule: '',
    remoteModes: '',
    location: '',
    teamSize: '',
    followUp: '',
    numberOfInterns: '',
    website: '',
    contactPerson: '',
    contactEmail: '',
    contactPhone: '',
  };
}

export function toColumnSamples(
  rows: unknown[][],
  headers: string[]
): ColumnSample[] {
  const allColumnValues = headers.map((header) => {
    const columnIndex = headers.indexOf(header);

    return rows.slice(1).map((row) => {
      if (!Array.isArray(row)) return '';
      const rawValue = String(row[columnIndex] ?? '').trim();
      return rawValue;
    });
  });

  let lastNonEmptyRowIndex = -1;
  for (let rowIndex = 0; rowIndex < rows.length - 1; rowIndex++) {
    const hasNonEmptyValue = allColumnValues.some(
      (columnValues) => columnValues[rowIndex] && columnValues[rowIndex] !== ''
    );
    if (hasNonEmptyValue) {
      lastNonEmptyRowIndex = rowIndex;
    }
  }

  return headers.map((header, headerIndex) => {
    const values = allColumnValues[headerIndex].slice(
      0,
      lastNonEmptyRowIndex + 1
    );
    return { header, values };
  });
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
    key: RequiredColumnKey,
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

  // First pass: exact keyword matches
  (Object.keys(COLUMN_KEYWORDS) as RequiredColumnKey[]).forEach((key) => {
    const keywords = COLUMN_KEYWORDS[key].map(normalizeToken);
    assignMatch(key, (candidate) => keywords.includes(candidate.normalized));
  });

  // Second pass: partial keyword matches
  (Object.keys(COLUMN_KEYWORDS) as RequiredColumnKey[]).forEach((key) => {
    const keywords = COLUMN_KEYWORDS[key].map(normalizeToken);
    assignMatch(key, (candidate) => {
      const tokens = candidate.normalized.split(' ');
      return keywords.some((keyword) =>
        keyword.includes(' ')
          ? candidate.normalized.includes(keyword)
          : tokens.includes(keyword)
      );
    });
  });

  return suggestions;
}
