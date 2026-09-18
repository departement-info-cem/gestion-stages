import type { ColumnMapping, ColumnSample, RequiredColumnKey } from '../types';
import type { SheetTable } from '@/app/utils/types';
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

/** Regroupe les valeurs de chaque colonne pour alimenter l'aperçu */
export function toColumnSamples(table: SheetTable): ColumnSample[] {
  return table.headers.map((header, columnIndex) => ({
    header,
    values: table.rows.map((row) => (row[columnIndex] ?? '').trim()),
  }));
}

export function autoDetectMapping(headers: string[]): ColumnMapping {
  return {
    ...createEmptyMapping(),
    ...detectColumnMapping<RequiredColumnKey>(headers, COLUMN_KEYWORDS),
  };
}
