/** Étape en cours d'une opération longue, telle que présentée à l'utilisateur */
export interface ProgressState {
  /** Libellé de l'étape, ex. « Analyse des lignes… » */
  label: string;
  /** Avancement de 0 à 100 ; omis pour une progression indéterminée */
  value?: number;
}
