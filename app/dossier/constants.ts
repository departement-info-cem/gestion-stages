import type { ColumnKey, ProgramOption } from "./types";

export const COLUMN_LABELS: Record<ColumnKey, string> = {
  matricule: "Matricule étudiant (Ex : 1525462)",
  name: "Nom, prénom (Ex : Monfarlo, Ti-jo)",
  supervisor: "Professeur superviseur (Ex : Édouard Montpetit)",
};

export const REQUIRED_KEYS: ColumnKey[] = [
  "matricule",
  "name",
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
    "Numéro Étudiant"
  ],
  name: [
    "nom",
    "prenom",
    "nom prenom",
    "nom complet",
    "name",
    "fullname",
    "student name",
    "Étudiant"
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
    "Prof"
  ],
};

export const PROGRAM_OPTIONS: ProgramOption[] = [
  {
    id: "dec-ti",
    label: "DEC - Administration d’infrastructure TI",
    code: "420.BB",
    templates: {
      suivi: "/assets/templates/Suivi_Hebdo_DEC.xlsx",
      evaluation: "/assets/templates/Evaluation.xlsx",
      readme: "/assets/templates/README.md",
      guide: "/assets/templates/Guide_rapport_DEC.docx",
    },
  },
  {
    id: "dec-prog",
    label: "DEC - Développement d’applications",
    code: "420.BA",
    templates: {
      suivi: "/assets/templates/Suivi_Hebdo_DEC.xlsx",
      evaluation: "/assets/templates/Evaluation.xlsx",
      readme: "/assets/templates/README.md",
      guide: "/assets/templates/Guide_rapport_DEC.docx",
    },
  },
  {
    id: "aec-ti",
    label: "AEC - Gestionnaire de réseaux, sécurité et virtualisation",
    code: "LEA.A6",
    templates: {
      suivi: "/assets/templates/Suivi_Hebdo_AEC.xlsx",
      evaluation: "/assets/templates/Evaluation.xlsx",
      readme: "/assets/templates/README.md",
      guide: "/assets/templates/Guide_rapport_LEAA6.docx",
    },
  },
  {
    id: "aec-devweb",
    label: "AEC - Développement d'applications Web",
    code: "LEA.DY",
    templates: {
      suivi: "/assets/templates/Suivi_Hebdo_AEC.xlsx",
      evaluation: "/assets/templates/Evaluation.xlsx",
      readme: "/assets/templates/README.md",
      guide: "/assets/templates/Guide_rapport_LEADY.docx",
    },
  },
];

export const PROGRAMMATION_CODES = new Set(["420.BA", "LEA.DY"]);
export const RESEAUTIQUE_CODES = new Set(["420.BB", "LEA.A6"]);

export const PREDEFINED_PROFILE_CODES: Array<{ value: string; label: string }> = [
  { value: "420.BA", label: "420.BA - DEC - Développement d’applications" },
  { value: "420.BB", label: "420.BB - DEC - Administration d’infrastructure TI" },
  { value: "LEA.DY", label: "LEA.DY - AEC - Développement d'applications Web" },
  { value: "LEA.A6", label: "LEA.A6 - AEC - Gestionnaire de réseaux, sécurité et virtualisation" },
];
