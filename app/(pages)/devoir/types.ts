/** Dossier d'un étudiant dans l'export « Submitted files » de Teams */
export interface StudentFolder {
  /** Nom affiché, débarrassé du préfixe « (new) » ajouté par Teams */
  name: string;
  handle: FileSystemDirectoryHandle;
}

/** Résultat de l'analyse du dossier sélectionné */
export interface SubmissionsScan {
  /** Dossier contenant réellement les dossiers d'étudiants */
  root: FileSystemDirectoryHandle;
  students: StudentFolder[];
  assignments: string[];
}

/** Ligne du rapport : remise (ou non) de chaque devoir par un étudiant */
export interface ReportRow {
  student: string;
  assignments: Record<string, boolean>;
}

/** Produit de la génération : archive des remises et rapport associé */
export interface AssignmentsArchive {
  zip: Blob;
  rows: ReportRow[];
  filesCount: number;
}
