/**
 * Types pour la génération de rapports de stage
 */

export type ColumnKey = 'START' | 'END' | 'EMAIL' | 'NAME' | 'PROGRAM';

export interface ColumnMapping {
  START: string;
  END: string;
  EMAIL: string;
  NAME: string;
  PROGRAM: string;
}

export interface ReportSection {
  title: string;
  intro?: string;
  questions: string[];
  page_break_before: boolean;
}

export interface StudentReport {
  email: string;
  nom: string;
  programme?: string;
  startTime: Date;
  endTime: Date;
  responses: Record<string, string>;
}

export interface ReportConfig {
  columnMapping: ColumnMapping;
  startDate: Date | null;
  endDate: Date | null;
  filterProgram?: string;
}

export interface StatusMessage {
  id: number;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

export interface ColumnSample {
  header: string;
  values: (string | number)[];
}

export interface ColumnMapperField {
  key: ColumnKey;
  label: string;
  required: boolean;
}
