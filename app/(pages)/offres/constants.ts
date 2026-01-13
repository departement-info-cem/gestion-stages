import type { ProgramProfile, RequiredColumnKey } from './types';

export const PROGRAM_PROFILES: ProgramProfile[] = [
  {
    id: 'dec-ti',
    name: 'DEC - Administration d’infrastructure TI',
    prefix: 'R-',
    fileName: 'TI.html',
    color: 'info',
    keywords: ['TI', 'réseautique', 'cybersécurité', 'infrastructure']
  },
  {
    id: 'dec-prog',
    name: 'DEC - Développement d’applications',
    prefix: 'P-',
    fileName: 'Prog.html',
    color: 'primary',
    keywords: ['programmation', 'développement']
  },
  {
    id: 'aec-devweb',
    name: 'AEC - Développement d\'applications Web',
    prefix: 'DW-',
    fileName: 'AecDevWeb.html',
    color: 'primary',
    keywords: ['Développement d\'applications Web', 'AEC']
  },
  {
    id: 'aec-ti',
    name: 'AEC - Gestionnaire de réseaux, sécurité et virtualisation',
    prefix: 'L-',
    fileName: 'AecTi.html',
    color: 'info',
    keywords: ['Gestionnaire de réseaux', 'AEC']
  },
];

export const REQUIRED_COLUMN_KEYS: RequiredColumnKey[] = [
  'companyName',
  'targetProfiles',
  'mandate',
  'techContext',
  'numberOfInterns',
  'website',
  'contactPerson',
  'contactEmail',
  'contactPhone',
  'remunerationType',
  'salary',
  'vehicleRequired',
  'schedule',
  'remoteModes',
  'location',
  'teamSize',
  'followUp',
];

// Colonnes strictement obligatoires pour la validation
export const MANDATORY_COLUMN_KEYS: RequiredColumnKey[] = [
  'companyName',
  'targetProfiles',
  'mandate',
  'techContext',
];

export const COLUMN_LABELS: Record<RequiredColumnKey, string> = {
  companyName: 'Nom de l\'entreprise',
  targetProfiles: 'Profils ciblés',
  mandate: 'Description du mandat',
  techContext: 'Contexte technologique',
  remunerationType: 'Type de rémunération',
  salary: 'Salaire',
  vehicleRequired: 'Véhicule requis',
  schedule: 'Horaire hebdomadaire',
  remoteModes: 'Modalités télétravail',
  location: 'Lieu (si présentiel)',
  teamSize: 'Taille de l\'équipe',
  followUp: 'Suites possibles',
  numberOfInterns: 'Nombre de stagiaires',
  website: 'Site web',
  contactPerson: 'Personne contact',
  contactEmail: 'Courriel de la personne contact',
  contactPhone: 'Téléphone de la personne contact',
};

export const COLUMN_KEYWORDS: Record<RequiredColumnKey, string[]> = {
  companyName: [
    'nom de l\'entreprise',
    'nom entreprise',
    'entreprise',
    'company name',
    'company',
    'organisation',
  ],
  targetProfiles: [
    'à quel profil',
    'quel profil',
    'profil',
    'profils',
    'profiles',
    'target',
    's\'adresse l\'offre',
  ],
  mandate: [
    'description du mandat',
    'tâches prévues',
    'taches prevues',
  ],
  techContext: [
    'contexte technologique',
    'plateformes utilisées',
    'équipements utilisés',
    'technologies',
    'tech stack',
    'technical context',
  ],
  remunerationType: [
    'type de rémunération',
    'remuneration',
    'compensation',
    'rémunération proposée',
  ],
  salary: [
    'salaire',
    'compensation financière',
    'compensation financiere',
    'salary',
    'wage',
    'rémunéré',
  ],
  vehicleRequired: [
    'véhicule',
    'vehicule',
    'vehicle',
    'déplacer',
    'deplacement',
  ],
  schedule: [
    'horaire',
    'heures',
    'schedule',
    'hours',
    'hebdomadaire',
  ],
  remoteModes: [
    'télétravail',
    'teletravail',
    'remote',
    'modalités',
    'modalites',
  ],
  location: [
    'adresse',
    'lieu',
    'location',
    'présentiel',
    'presentiel',
    'effectué',
  ],
  teamSize: [
    'taille de l\'équipe',
    'taille equipe',
    'team size',
    'équipe',
    'team',
  ],
  followUp: [
    'suites possibles',
    'possibilités',
    'possibilities',
    'emploi',
    'suite au stage',
  ],
  numberOfInterns: [
    'combien de stagiaires',
    'nombre de stagiaires',
    'stagiaires',
    'number of interns',
    'interns',
  ],
  website: [
    'Site web',
    'website',
    'url',
    'site internet',
  ],
  contactPerson: [
    'personne contact',
    'contact person',
    'nom du contact',
    'responsable',
    'contact',
    'personne ressource',
  ],
  contactEmail: [
    'courriel',
    'email',
    'e-mail',
    'courriel contact',
    'email contact',
    'adresse courriel',
  ],
  contactPhone: [
    'téléphone',
    'telephone',
    'phone',
    'numéro',
    'numero',
    'téléphone contact',
    'phone number',
  ],
};
