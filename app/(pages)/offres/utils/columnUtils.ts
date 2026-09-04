import type { ColumnMapping, ColumnSample, RequiredColumnKey } from '../types';
import { COLUMN_KEYWORDS } from '../constants';
import { detectColumnMapping } from '@/app/utils/columnMatching';

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
  return {
    ...createEmptyMapping(),
    ...detectColumnMapping<RequiredColumnKey>(headers, COLUMN_KEYWORDS),
  };
}
