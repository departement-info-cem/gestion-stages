// Types pour la section offres de stages

export interface ProgramProfile {
  id: string;
  name: string;
  prefix: string;
  templateName: string;
  fileName: string;
  color: 'info' | 'primary';
}

export interface OfferRow {
  [key: string]: string | number | null;
}

export interface ProcessedOffer extends OfferRow {
  IDAecWeb?: string | null;
  IDAecTI?: string | null;
  IDTechProg?: string | null;
  IDTechTI?: string | null;
}

export interface GenerationResult {
  profile: ProgramProfile;
  offers: ProcessedOffer[];
  html: string;
}

export interface SessionConfig {
  code: string;
  year: string;
}

export type RequiredColumnKey =
  | 'companyName'
  | 'targetProfiles'
  | 'mandate'
  | 'techContext'
  | 'remunerationType'
  | 'salary'
  | 'vehicleRequired'
  | 'schedule'
  | 'remoteModes'
  | 'location'
  | 'teamSize'
  | 'followUp'
  | 'numberOfInterns'
  | 'website';

export type ColumnMapping = Record<RequiredColumnKey, string>;

export interface ColumnSample {
  header: string;
  values: string[];
}
