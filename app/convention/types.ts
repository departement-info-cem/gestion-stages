export interface ProgramConfig {
  code: string;
  name: string;
  sigleCours: string;
  nomDirection: string;
  nbHeuresMinimumStage: number;
  nbSemaineStage: number;
  templatePath: string;
  profiles?: { [key: string]: string };
}

export interface ColumnMapping {
  [key: string]: string;
}

export interface ColumnSamples {
  [columnName: string]: (string | number)[];
}

export interface SignatureData {
  image: File | null;
  imageUrl: string;
  signataireName: string;
}

export interface ConventionData {
  // Données étudiant (extraites du champ "Pour quel étudiant...")
  nom: string;
  prenom: string;
  matricule: string;
  
  // Données entreprise
  entreprise: string;
  adresseEntreprise: string;
  nomRepresentant: string;
  titreRepresentant: string;
  courrielEntreprise: string;
  
  // Données superviseur entreprise
  nomSuperviseur: string;
  
  // Données stage
  dateDebut: string;
  dateFin: string;
  heuresParSemaine: number;
  mandat: string;
  salaireHoraire: number;
  modaliteTeletravail: string;
  
  // Données du fichier additionnel
  superviseurAcademique?: string;
  profil?: string;
}

export interface StatusMessage {
  id: number;
  type: 'success' | 'error' | 'warning';
  message: string;
  timestamp: Date;
}
