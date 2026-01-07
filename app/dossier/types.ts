export type ProgramId = "dec-ti" | "dec-prog" | "aec-devweb" | "aec-ti";

export type ColumnKey = "matricule" | "name" | "supervisor";

export type ProfileCode = "420.BA" | "420.BB" | "LEA.DY" | "LEA.A6";

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
  code: ProfileCode,
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
