import { ProgramConfig } from './types';

export const PROGRAMS: { [key: string]: ProgramConfig } = {
  'DEC_REGULIER': {
    code: '420.B0',
    name: 'DEC - Régulier',
    sigleCours: '420-6GF-EM Stage',
    nomDirection: 'Direction des études',
    nbHeuresMinimumStage: 315,
    nbSemaineStage: 10,
    templatePath: '/assets/templates/convention/ConventionDEC.docx',
    profiles: {
      '420.BA': '420.BA Techniques de l\'informatique, profil Programmation',
      '420.BB': '420.BB Techniques de l\'informatique, profil Réseautique',
    }
  },
  'AEC_DEVWEB': {
    code: 'LEA.DY',
    name: 'AEC - Développement d\'applications Web',
    sigleCours: '420-AGF-EM Stage',
    nomDirection: 'Direction de la formation continue',
    nbHeuresMinimumStage: 225,
    nbSemaineStage: 10,
    templatePath: '/assets/templates/convention/ConventionAEC.docx',
  },
  'AEC_TI': {
    code: 'LEA.A6',
    name: 'AEC - Gestionnaire de réseaux, sécurité et virtualisation',
    sigleCours: '420-S7G-R0 STAGE EN ENTREPRISE',
    nomDirection: 'Direction de la formation continue',
    nbHeuresMinimumStage: 255,
    nbSemaineStage: 10,
    templatePath: '/assets/templates/convention/ConventionAEC.docx',
  },
};

export const MAIN_FILE_FIELDS = [
  { key: 'etudiant', label: 'Étudiant (Ex: 123-4567 Tremblay, Jonathan)' },
  { key: 'entreprise', label: 'Entreprise' },
  { key: 'adresseEntreprise', label: 'Adresse du siège social de l\'entreprise?' },
  { key: 'nomRepresentant', label: 'Représentant de l\'entreprise' },
  { key: 'titreRepresentant', label: 'Titre/poste du représentant de l\'entreprise' },
  { key: 'courrielEntreprise', label: 'Courriel représentant de l\'entreprise' },
  { key: 'nomSuperviseur', label: 'Personne qui supervisera le stagiaire' },
  { key: 'heuresParSemaine', label: 'Nombre d\'heures travaillées par semaine' },
  { key: 'mandat', label: 'Description du mandat' },
  { key: 'salaireHoraire', label: 'Salaire horaire du stagiaire' },
  { key: 'modaliteTeletravail', label: 'Modalités concernant le télétravail' },
  { key: 'dateDebut', label: 'Date de début du stage' },
  { key: 'dateFin', label: 'Date de fin du stage' },
];

export const ADDITIONAL_FILE_FIELDS = [
  { key: 'matricule', label: 'Matricule' },
  { key: 'superviseurAcademique', label: 'Superviseur académique' },
  { key: 'profil', label: 'Profil' },
];

// Clauses conditionnelles selon la rémunération
export const CLAUSES = {
  STAGE_REMUNERE: {
    CLAUSE_1_4: "Au cours du stage, l'ÉTUDIANT recevra la rémunération suivante pour le travail qu'il réalise : salaire horaire de {SALAIRE_HORAIRE} dollars.",
    CLAUSE_1_5: "Durant le stage, l'ÉTUDIANT demeure un étudiant du CÉGEP bien qu'il puisse avoir, durant la durée de son stage, le statut d'employé de l'ORGANISME. Ainsi l'ÉTUDIANT continuera à bénéficier des assurances en responsabilité civile du CÉGEP.",
    CLAUSE_1_6: "Puisque le stage est rémunéré, l'ORGANISME devient l'employeur du stagiaire et doit alors prendre à sa charge les responsabilités qui lui incombent quant à la protection individuelle de l'employé stagiaire en regard de la Commission des normes, de l'équité, de la santé et de la sécurité au travail (CNESST).",
  },
  STAGE_NON_REMUNERE: {
    CLAUSE_1_4: "Pendant la durée du stage, l'ÉTUDIANT ne recevra aucune rémunération, mais pourra bénéficier du remboursement des dépenses engendrées par la réalisation du stage, et un cadeau ou une bourse peuvent lui être remis.",
    CLAUSE_1_5: "Durant le stage, l'ÉTUDIANT demeure un étudiant du CÉGEP et ne sera considéré d'aucune façon comme étant un employé de l'ORGANISME. Il doit cependant respecter l'horaire de travail de l'ORGANISME.",
    CLAUSE_1_6: "Pendant la durée du stage et pour les fins des activités qui y sont reliées, l'ÉTUDIANT continuera à bénéficier des assurances en responsabilité civile du CÉGEP et de la protection individuelle accordée par la Commission des normes, de l'équité, de la santé et de la sécurité au travail (CNESST).",
  },
};
