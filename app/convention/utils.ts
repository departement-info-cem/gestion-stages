import * as XLSX from 'xlsx';
import { createReport } from 'docx-templates';
import { ConventionData, ProgramConfig } from './types';
import { CLAUSES } from './constants';

/**
 * Extrait le nom, prénom et matricule depuis le format "123-4567 Nom, Prénom"
 */
export function extractStudentInfo(info: string): { nom: string; prenom: string; matricule: string } {
  const parts = info.trim().split(' ');
  const matricule = parts[0];
  const nomPrenom = parts.slice(1).join(' ');
  const [nom, prenom] = nomPrenom.split(',').map(s => s.trim());
  
  return { nom, prenom, matricule };
}

/**
 * Calcule le nombre de jours ouvrables entre deux dates (exclut weekends)
 */
export function calculateWorkingDays(startDate: Date, endDate: Date): number {
  let count = 0;
  const current = new Date(startDate);
  
  while (current <= endDate) {
    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) { // 0 = dimanche, 6 = samedi
      count++;
    }
    current.setDate(current.getDate() + 1);
  }
  
  return count;
}

/**
 * Formate une date au format français (ex: "12 janvier 2026")
 */
export function formatDateFrench(date: Date): string {
  const months = [
    'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
    'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
  ];
  
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  
  return `${day} ${month} ${year}`;
}

/**
 * Convertit une date Excel (nombre) en objet Date JavaScript
 */
export function excelDateToJSDate(excelDate: number): Date {
  const date = new Date((excelDate - 25569) * 86400 * 1000);
  return date;
}

/**
 * Parse une date depuis différents formats
 */
export function parseDate(value: any): Date | null {
  if (!value) return null;
  
  // Si c'est déjà une date
  if (value instanceof Date) return value;
  
  // Si c'est un nombre (format Excel)
  if (typeof value === 'number') {
    return excelDateToJSDate(value);
  }
  
  // Si c'est une chaîne
  if (typeof value === 'string') {
    const parsed = new Date(value);
    if (!isNaN(parsed.getTime())) return parsed;
  }
  
  return null;
}

/**
 * Détecte automatiquement les colonnes basées sur les noms
 */
export function autoMapColumns(
  sheetColumns: string[],
  requiredFields: { key: string; label: string }[]
): { [key: string]: string } {
  const mapping: { [key: string]: string } = {};
  
  // Mapping des patterns communs basé sur le script Python
  const patterns: { [key: string]: RegExp[] } = {
    etudiant: [/pour quel étudiant/i, /etudiant/i, /student/i],
    entreprise: [/nom.*entreprise/i, /^entreprise$/i, /company/i],
    adresseEntreprise: [/adresse.*siège/i, /adresse.*entreprise/i, /adresse.*social/i],
    nomRepresentant: [/nom.*représentant/i, /nom.*representant/i, /nom.*signera/i],
    titreRepresentant: [/titre.*représentant/i, /titre.*representant/i, /poste.*représentant/i, /fonction.*représentant/i],
    courrielEntreprise: [/courriel.*convention/i, /email.*convention/i, /courriel.*entreprise/i, /email.*entreprise/i],
    nomSuperviseur: [/nom.*supervisera/i, /nom.*superviseur.*entreprise/i, /personne.*supervisera/i],
    heuresParSemaine: [/nombre.*heure.*semaine/i, /heures.*semaine/i, /heure.*par.*semaine/i],
    mandat: [/description.*mandat/i, /mandat/i, /description.*stage/i, /tâches/i],
    salaireHoraire: [/salaire.*horaire/i, /taux.*horaire/i, /rémunération.*horaire/i],
    modaliteTeletravail: [/modalité.*télétravail/i, /modalite.*teletravail/i, /télétravail/i, /teletravail/i],
    dateDebut: [/date.*début.*stage/i, /date.*debut.*stage/i, /début.*stage/i, /debut.*stage/i],
    dateFin: [/date.*fin.*stage/i, /fin.*stage/i],
    matricule: [/^matricule$/i, /^da$/i, /no\.?\s*étu/i, /no\.?\s*etu/i],
    superviseurAcademique: [/superviseur\s*académique/i, /superviseur\s*academique/i, /prof\s*superviseur/i],
  };
  
  for (const field of requiredFields) {
    const fieldPatterns = patterns[field.key];
    if (!fieldPatterns) continue;
    
    for (const column of sheetColumns) {
      for (const pattern of fieldPatterns) {
        if (pattern.test(column)) {
          mapping[field.key] = column;
          break;
        }
      }
      if (mapping[field.key]) break;
    }
  }
  
  return mapping;
}

/**
 * Extrait les échantillons de données pour les colonnes mappées
 */
export function extractColumnSamples(
  worksheet: XLSX.WorkSheet,
  columnMapping: { [key: string]: string },
  maxRows: number = 100
): { [columnName: string]: (string | number)[] } {
  const samples: { [columnName: string]: (string | number)[] } = {};
  const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
  
  if (data.length === 0) return samples;
  
  const headers = data[0];
  const rows = data.slice(1, Math.min(data.length, maxRows + 1));
  
  // Champs qui sont des dates
  const dateFields = ['dateDebut', 'dateFin'];
  const numericFields = ['salaireHoraire'];
  
  Object.entries(columnMapping).forEach(([fieldKey, excelColumn]) => {
    const columnIndex = headers.indexOf(excelColumn);
    if (columnIndex !== -1) {
      samples[fieldKey] = rows.map(row => {
        const val = row[columnIndex];
        
        // Pour les dates et champs numériques, ne rien afficher si vide
        if ((dateFields.includes(fieldKey) || numericFields.includes(fieldKey)) && 
            (val === undefined || val === null || val === '' || val === 0)) {
          return '';
        }
        
        // Afficher les autres valeurs vides comme "(vide)"
        if (val === undefined || val === null || val === '') {
          return '(vide)';
        }
        
        // Convertir les dates Excel en format français
        if (dateFields.includes(fieldKey) && typeof val === 'number') {
          const date = excelDateToJSDate(val);
          return formatDateFrench(date);
        }
        
        return val;
      });
    }
  });
  
  return samples;
}

/**
 * Valide que toutes les colonnes requises sont mappées
 */
export function validateColumnMapping(
  columnMapping: { [key: string]: string },
  requiredFields: { key: string; label: string }[]
): { isValid: boolean; missingFields: string[] } {
  const missingFields: string[] = [];
  
  for (const field of requiredFields) {
    if (!columnMapping[field.key]) {
      missingFields.push(field.label);
    }
  }
  
  return {
    isValid: missingFields.length === 0,
    missingFields
  };
}

/**
 * Génère les données de convention à partir des fichiers Excel
 */
export function generateConventionData(
  mainWorksheet: XLSX.WorkSheet,
  mainColumnMapping: { [key: string]: string },
  additionalWorksheet: XLSX.WorkSheet | null,
  additionalColumnMapping: { [key: string]: string }
): ConventionData[] {
  const mainData = XLSX.utils.sheet_to_json(mainWorksheet);
  const additionalData = additionalWorksheet 
    ? XLSX.utils.sheet_to_json(additionalWorksheet) 
    : [];
  
  // Créer un index par matricule pour les données additionnelles
  const additionalIndex: { [matricule: string]: any } = {};
  if (additionalColumnMapping.matricule) {
    additionalData.forEach((row: any) => {
      const matricule = row[additionalColumnMapping.matricule];
      if (matricule) {
        additionalIndex[String(matricule).trim()] = row;
      }
    });
  }
  
  // Générer les données de convention
  const conventions: ConventionData[] = [];
  
  for (const row of mainData as any[]) {
    // Extraire les informations de l'étudiant depuis le champ combiné
    const etudiantInfo = String(row[mainColumnMapping.etudiant] || '');
    const { nom, prenom, matricule } = extractStudentInfo(etudiantInfo);
    
    const additionalRow = additionalIndex[matricule];
    
    const convention: ConventionData = {
      nom,
      prenom,
      matricule,
      entreprise: String(row[mainColumnMapping.entreprise] || ''),
      adresseEntreprise: String(row[mainColumnMapping.adresseEntreprise] || ''),
      nomRepresentant: String(row[mainColumnMapping.nomRepresentant] || ''),
      titreRepresentant: String(row[mainColumnMapping.titreRepresentant] || ''),
      courrielEntreprise: String(row[mainColumnMapping.courrielEntreprise] || ''),
      nomSuperviseur: String(row[mainColumnMapping.nomSuperviseur] || ''),
      heuresParSemaine: Number(row[mainColumnMapping.heuresParSemaine] || 0),
      mandat: String(row[mainColumnMapping.mandat] || ''),
      salaireHoraire: Number(row[mainColumnMapping.salaireHoraire] || 0),
      modaliteTeletravail: String(row[mainColumnMapping.modaliteTeletravail] || ''),
      dateDebut: row[mainColumnMapping.dateDebut] || '',
      dateFin: row[mainColumnMapping.dateFin] || '',
    };
    
    // Ajouter les données du fichier additionnel
    if (additionalRow) {
      if (additionalColumnMapping.superviseurAcademique) {
        convention.superviseurAcademique = String(
          additionalRow[additionalColumnMapping.superviseurAcademique] || ''
        );
      }
      
      // Ajouter le profil s'il existe dans les données additionnelles
      const profilColumn = Object.keys(additionalRow).find(key => 
        /profil/i.test(key)
      );
      if (profilColumn) {
        convention.profil = String(additionalRow[profilColumn] || '');
      }
    }
    
    conventions.push(convention);
  }
  
  return conventions;
}

/**
 * Convertit un type MIME en extension de fichier
 */
function getExtensionFromMimeType(mimeType: string): string {
  const mimeToExt: Record<string, string> = {
    'image/png': '.png',
    'image/jpeg': '.jpg',
    'image/jpg': '.jpg',
    'image/gif': '.gif',
  };
  return mimeToExt[mimeType] || '.png';
}

/**
 * Génère un fichier Word de convention avec docx-templates
 */
export async function generateConventionDocument(
  convention: ConventionData,
  programConfig: ProgramConfig,
  templateBuffer: ArrayBuffer,
  signatureDirecteur: { image: ArrayBuffer; name: string; mimeType: string },
  signatureCoordonnateur: { image: ArrayBuffer; name: string; mimeType: string },
  defaultDates?: { startDate: string; endDate: string }
): Promise<Blob> {
  // Parser les dates
  let dateDebut = parseDate(convention.dateDebut);
  let dateFin = parseDate(convention.dateFin);
  
  // Utiliser les dates par défaut si les dates de la convention sont vides
  if (!dateDebut && defaultDates?.startDate) {
    dateDebut = new Date(defaultDates.startDate);
  }
  if (!dateFin && defaultDates?.endDate) {
    dateFin = new Date(defaultDates.endDate);
  }
  
  // Calculer les jours ouvrables
  const joursOuvrables = dateDebut && dateFin 
    ? calculateWorkingDays(dateDebut, dateFin)
    : 0;
  
  // Déterminer si le stage est rémunéré
  const isRemunere = convention.salaireHoraire > 0;
  
  // Sélectionner les clauses appropriées
  const clauses = isRemunere ? CLAUSES.STAGE_REMUNERE : CLAUSES.STAGE_NON_REMUNERE;
  
  // Déterminer le nom du programme
  let nomProgramme = programConfig.name;
  if (convention.profil && programConfig.profiles) {
    nomProgramme = programConfig.profiles[convention.profil] || programConfig.name;
  }
  
  // Préparer les données pour le template
  const templateData = {
    // Programme
    NOMPROGRAMME: nomProgramme,
    SIGLECOURS: programConfig.sigleCours,
    NOMDIRECTION: programConfig.nomDirection,
    
    // Étudiant
    ETUDIANTNOM: `${convention.prenom} ${convention.nom}`,
    MATRICULE: convention.matricule,
    
    // Entreprise
    NOMENTREPRISE: convention.entreprise,
    adresseEntreprise: convention.adresseEntreprise,
    nomRepresentant: convention.nomRepresentant,
    titreRepresentant: convention.titreRepresentant,
    emailEntreprise: convention.courrielEntreprise,
    
    // Superviseur
    nomSuperviseur: convention.nomSuperviseur,
    nomProfSuperviseur: convention.superviseurAcademique || '',
    
    // Stage
    nombreHeuresStage: programConfig.nbHeuresMinimumStage,
    nombreSemaineStage: programConfig.nbSemaineStage,
    nombreHeuresSemaine: convention.heuresParSemaine,
    nombreJoursOuvrables: joursOuvrables,
    MANDAT: convention.mandat,
    modaliteTeletravail: convention.modaliteTeletravail,
    salaireHoraire: convention.salaireHoraire || 0,
    
    // Dates
    DATE_STAGE_DEBUT: dateDebut ? formatDateFrench(dateDebut) : '',
    DATE_STAGE_FIN: dateFin ? formatDateFrench(dateFin) : '',
    DATE_DU_JOUR: formatDateFrench(new Date()),
    
    // Clauses conditionnelles
    CLAUSE_1_4: clauses.CLAUSE_1_4.replace('{SALAIRE_HORAIRE}', String(convention.salaireHoraire || '')),
    CLAUSE_1_5: clauses.CLAUSE_1_5,
    CLAUSE_1_6: clauses.CLAUSE_1_6,
    
    // Signatures (format spécifique pour docx-templates)
    SIGNATURE_DIRECTEUR: {
      width: 4,  // en cm
      height: 1.5,  // en cm
      data: new Uint8Array(signatureDirecteur.image),
      extension: getExtensionFromMimeType(signatureDirecteur.mimeType),
    },
    SIGNATURE_COORDONNATEUR: {
      width: 4,
      height: 1.5,
      data: new Uint8Array(signatureCoordonnateur.image),
      extension: getExtensionFromMimeType(signatureCoordonnateur.mimeType),
    },
    NOM_DIRECTEUR: signatureDirecteur.name,
    NOM_COORDONNATEUR: signatureCoordonnateur.name,
  };
  
  // Générer le document avec docx-templates
  const report = await createReport({
    template: new Uint8Array(templateBuffer),
    data: templateData,
    cmdDelimiter: ['{', '}'],
    processLineBreaks: true,
  });
  
  return new Blob([new Uint8Array(report)], {
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  });
}

/**
 * Nettoie un nom de fichier pour éviter les caractères invalides
 */
export function sanitizeFileName(fileName: string): string {
  return fileName.replace(/[^a-zA-Z0-9_-]/g, '_');
}
