import * as XLSX from "xlsx";
import type { ColumnMapperField } from "@/app/components/column-mapper/ColumnMapper";
import { excelDateToJSDate, formatDateFrench } from "./dateUtils";

/**
 * Détecte automatiquement les colonnes basées sur les noms
 */
export function autoMapColumns(
  sheetColumns: string[],
  requiredFields: readonly ColumnMapperField[]
): { [key: string]: string } {
  const mapping: { [key: string]: string } = {};

  // Mapping des patterns communs basé sur le script Python
  const patterns: { [key: string]: RegExp[] } = {
    etudiant: [/pour quel étudiant/i, /etudiant/i, /student/i],
    entreprise: [/nom.*entreprise/i, /^entreprise$/i, /company/i],
    adresseEntreprise: [
      /adresse.*siège/i,
      /adresse.*entreprise/i,
      /adresse.*social/i,
    ],
    nomRepresentant: [
      /nom.*représentant/i,
      /nom.*representant/i,
      /nom.*signera/i,
    ],
    titreRepresentant: [
      /titre.*représentant/i,
      /titre.*representant/i,
      /poste.*représentant/i,
      /fonction.*représentant/i,
    ],
    courrielEntreprise: [
      /courriel.*convention/i,
      /email.*convention/i,
      /courriel.*entreprise/i,
      /email.*entreprise/i,
    ],
    nomSuperviseur: [
      /nom.*supervisera/i,
      /nom.*superviseur.*entreprise/i,
      /personne.*supervisera/i,
    ],
    heuresParSemaine: [
      /nombre.*heure.*semaine/i,
      /heures.*semaine/i,
      /heure.*par.*semaine/i,
    ],
    mandat: [
      /description.*mandat/i,
      /mandat/i,
      /description.*stage/i,
      /tâches/i,
    ],
    salaireHoraire: [
      /salaire.*horaire/i,
      /taux.*horaire/i,
      /rémunération.*horaire/i,
    ],
    modaliteTeletravail: [
      /modalité.*télétravail/i,
      /modalite.*teletravail/i,
      /télétravail/i,
      /teletravail/i,
    ],
    dateDebut: [
      /date.*début.*stage/i,
      /date.*debut.*stage/i,
      /début.*stage/i,
      /debut.*stage/i,
    ],
    dateFin: [/date.*fin.*stage/i, /fin.*stage/i],
    matricule: [/^matricule$/i, /^da$/i, /no\.?\s*étu/i, /no\.?\s*etu/i],
    superviseurAcademique: [
      /superviseur\s*académique/i,
      /superviseur\s*academique/i,
      /prof\s*superviseur/i,
    ],
    profil: [/profil/i, /programme/i, /code.*profil/i],
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
  const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as unknown[][];

  if (data.length === 0) return samples;

  const headers = data[0] as string[];
  const rows = data.slice(1, Math.min(data.length, maxRows + 1));

  // Filtrer les lignes complètement vides
  const nonEmptyRows = rows.filter((row) => {
    // Vérifier si au moins une des colonnes mappées a une valeur
    return Object.values(columnMapping).some((excelColumn) => {
      const columnIndex = headers.indexOf(excelColumn);
      if (columnIndex === -1) return false;
      const val = (row as unknown[])[columnIndex];
      return val !== undefined && val !== null && val !== "";
    });
  });

  // Champs qui sont des dates
  const dateFields = ["dateDebut", "dateFin"];
  const numericFields = ["salaireHoraire"];

  Object.entries(columnMapping).forEach(([fieldKey, excelColumn]) => {
    const columnIndex = headers.indexOf(excelColumn);
    if (columnIndex !== -1) {
      samples[fieldKey] = nonEmptyRows.map((row) => {
        const val = (row as unknown[])[columnIndex];

        // Pour les dates et champs numériques, ne rien afficher si vide
        if (
          (dateFields.includes(fieldKey) || numericFields.includes(fieldKey)) &&
          (val === undefined || val === null || val === "" || val === 0)
        ) {
          return "";
        }

        // Afficher les autres valeurs vides comme "(vide)"
        if (val === undefined || val === null || val === "") {
          return "(vide)";
        }

        // Convertir les dates Excel en format français
        if (dateFields.includes(fieldKey) && typeof val === "number") {
          const date = excelDateToJSDate(val);
          return formatDateFrench(date);
        }

        return val as string | number;
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
  requiredFields: readonly ColumnMapperField[]
): { isValid: boolean; missingFields: string[] } {
  const missingFields: string[] = [];

  for (const field of requiredFields) {
    if (!columnMapping[field.key]) {
      missingFields.push(field.label);
    }
  }

  return {
    isValid: missingFields.length === 0,
    missingFields,
  };
}
