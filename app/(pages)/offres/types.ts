// Types pour la section offres de stages

export interface ProgramProfile {
  id: string;
  name: string;
  prefix: string;
  fileName: string;
  /** Teinte de la page générée : profil TI ou développement */
  accent: 'ti' | 'dev';
  keywords: string[];
}

export interface OfferRow {
  [key: string]: string | number | null | undefined;
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

/** Champs d'une offre prêts à être rendus, indépendants des libellés du formulaire */
export type OfferContentKey = Exclude<RequiredColumnKey, 'targetProfiles'>;

export type OfferContent = Record<OfferContentKey, string> & {
  /** Identifiant publié de l'offre, ex. « R-H27-01 » */
  reference: string;
};

/** Paire libellé/valeur affichée dans une carte d'offre */
export interface OfferDetail {
  label: string;
  value: string;
}

/** Bloc thématique regroupant les détails apparentés d'une offre */
export interface OfferDetailGroup {
  title: string;
  details: OfferDetail[];
}

/**
 * Gabarit d'un compartiment : chaque entrée sait extraire sa valeur d'une
 * offre, ce qui permet de masquer un champ selon le contexte (le montant d'un
 * stage non rémunéré, le lieu d'un stage entièrement à distance).
 */
export interface OfferDetailGroupDefinition {
  title: string;
  entries: readonly {
    label: string;
    resolve: (offer: OfferContent) => string;
  }[];
}
