import type { ColumnKey, ProgramOption } from "./types";

export const COLUMN_LABELS: Record<ColumnKey, string> = {
  matricule: "Matricule étudiant (Ex : 1525462)",
  name: "Nom, prénom (Ex : Ti-jo, Monfarlo)",
  profile: "Code profil (Ex : 420.BA)",
  supervisor: "Professeur superviseur (Ex : Édouard Montpetit)",
};

export const REQUIRED_KEYS: ColumnKey[] = [
  "matricule",
  "name",
  "profile",
  "supervisor",
];

export const COLUMN_KEYWORDS: Record<ColumnKey, string[]> = {
  matricule: [
    "matricule",
    "matricule etudiant",
    "id",
    "identifiant",
    "code permanent",
    "student id",
  ],
  name: [
    "nom",
    "prenom",
    "nom prenom",
    "nom complet",
    "name",
    "fullname",
    "student name",
  ],
  profile: [
    "profil",
    "profile",
    "programme",
    "program",
    "code programme",
    "code profil",
    "track",
  ],
  supervisor: [
    "superviseur",
    "prof",
    "professeur",
    "profsuperviseur",
    "enseignant",
    "supervisor",
    "responsable",
    "tuteur",
  ],
};

export const PROGRAM_OPTIONS: ProgramOption[] = [
  {
    id: "dec",
    label: "DEC Régulier",
    description:
      "Dossiers pour les cohortes DEC régulières (Prof. superviseur requis).",
    templates: {
      suivi: "/assets/templates/Suivi_Hebdo_DEC.xlsx",
      evaluation: "/assets/templates/Evaluation.xlsx",
      readme: "/assets/templates/README.md",
      guide: "/assets/templates/Guide_rapport_DEC.docx",
    },
  },
  {
    id: "aec-devweb",
    label: "AEC Développement Web",
    description:
      "Dossiers pour le programme AEC Développement Web (code LEA.DY).",
    templates: {
      suivi: "/assets/templates/Suivi_Hebdo_AEC.xlsx",
      evaluation: "/assets/templates/Evaluation.xlsx",
      readme: "/assets/templates/README.md",
      guide: "/assets/templates/Guide_rapport_LEADY.docx",
    },
  },
  {
    id: "aec-ti",
    label: "AEC Technologies de l'information",
    description: "Dossiers pour l'AEC TI (code LEA.A6).",
    templates: {
      suivi: "/assets/templates/Suivi_Hebdo_AEC.xlsx",
      evaluation: "/assets/templates/Evaluation.xlsx",
      readme: "/assets/templates/README.md",
      guide: "/assets/templates/Guide_rapport_LEAA6.docx",
    },
  },
];

export const PROGRAMMATION_CODES = new Set(["420.BA", "LEA.DY"]);
export const RESEAUTIQUE_CODES = new Set(["420.BB", "LEA.A6"]);
