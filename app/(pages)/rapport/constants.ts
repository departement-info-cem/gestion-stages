import { ReportSection, ColumnMapperField } from './types';

/**
 * Sections des rapports de stage (basé sur le script Python)
 */
export const INCLUDED_SECTIONS: ReportSection[] = [
  {
    title: 'Notes au professeur',
    intro:
      "Le barème de correction est disponible dans le fichier Excel de suivi hebdo.\nDéplacer ce rapport corrigé dans le dossier de stage de l'étudiant.",
    questions: [],
    page_break_before: false,
  },
  {
    title: 'Évaluation du milieu de stage',
    intro: undefined,
    questions: [
      'Dans quelle entreprise était ton stage ?',
      "Parles-nous de la qualité de l'accueil, de ton intégration et de l'atmosphère de travail pendant ton stage :",
      "Parles-nous de l'équipement qui t'as été fourni pendant ton stage (qualité, adéquat, adapté aux tâches) :",
      'Je recommande le milieu de stage que j\'ai eu aux prochains étudiants de mon programme',
      'Pourquoi recommandes-tu (ou non) ce milieu de stage ?',
    ],
    page_break_before: false,
  },
  {
    title: 'Réflexion personnelle',
    intro: undefined,
    questions: [
      'Décris les appréhensions que tu avais avant de commencer ton stage',
      'Raconte la situation la plus difficile que tu as dû traverser pendant ton stage, et la leçon que tu en tire',
      "Présente la ou les personnes qui t'ont le plus aidé·e·s pendant ton stage et précise comment elles t'ont aidé·e·s",
      'Indique ce que les personnes avec qui tu as travaillé retiendront de toi',
      "Identifie les intérêts ou préférences que tu as découverts ou confirmés lors de cette expérience professionnelle",
      "Donne, à l'aide d'exemples concrets, au moins un aspect professionnel que tu devrais améliorer ou faire différemment à l'avenir",
      "Décris ce que ce stage t'a permis d'apprendre sur tes compétences personnelles et relationnelles et en quoi cela te sera utile professionnellement",
      'Explique de quelle manière tu t\'es démarqué·e favorablement pendant ce stage',
    ],
    page_break_before: false,
  },
  {
    title: 'Commentaires du prof :',
    intro: '',
    questions: [],
    page_break_before: false,
  },
];

/**
 * Mappeurs de colonnes pour détection automatique FR/EN
 */
export const COLUMN_ALIASES = {
  START: ['Heure de début', 'Start time', 'Start Time'],
  END: ['Heure de fin', 'Completion time', 'Completion Time', 'End time', 'End Time'],
  EMAIL: ['Adresse de messagerie', 'Email', 'Email address', 'Courriel'],
  NAME: ['Nom', 'Name'],
  PROGRAM: [
    'Mon programme d\'études est',
    'My program of study is',
    'Programme',
    'Program',
    'My program is',
  ],
};

/**
 * Templates et formats
 */
export const TITLE_TEMPLATE = 'Rapport de stage de {Nom}';
export const EMPTY_ANSWER_PLACEHOLDER = '(aucune réponse de l\'étudiant n\'a été fournie à cette question)';

/**
 * Champs du mapper de colonnes
 */
export const COLUMN_MAPPER_FIELDS: ColumnMapperField[] = [
  { key: 'START', label: 'Heure de début', required: true },
  { key: 'END', label: 'Heure de fin / Completion time', required: true },
  { key: 'EMAIL', label: 'Adresse de messagerie', required: true },
  { key: 'NAME', label: 'Nom', required: true },
  { key: 'PROGRAM', label: 'Mon programme d\'études est', required: false },
];

/**
 * Configuration de formatage temporel
 */
export const TIMEZONE = 'America/Toronto';

/**
 * Message pour fichier vide après filtrage
 */
export const NO_RESULTS_MESSAGE =
  'Aucun étudiant ne correspond aux critères de filtrage (dates, programme).';
