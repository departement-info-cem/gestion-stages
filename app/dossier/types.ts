export type ProgramId = "dec" | "aec-devweb" | "aec-ti";

export type ColumnKey = "matricule" | "name" | "profile" | "supervisor";

export type ColumnMapping = Record<ColumnKey, string>;

export type StatusTone = "info" | "error" | "success";

export interface StatusMessage {
  id: number;
  tone: StatusTone;
  message: string;
}

export interface ProgramOption {
  id: ProgramId;
  label: string;
  description: string;
  templates: {
    suivi: string;
    evaluation: string;
    readme: string;
    guide: string;
  };
}

export interface ColumnSample {
  header: string;
  values: string[];
}
