import * as XLSX from "xlsx";
import type { ConventionData } from "../types";
import { extractStudentInfo } from "./stringUtils";
import { parseDate } from "./dateUtils";

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
  const additionalIndex: { [matricule: string]: Record<string, unknown> } = {};
  if (additionalColumnMapping.matricule) {
    additionalData.forEach((row: unknown) => {
      const rowData = row as Record<string, unknown>;
      const matricule = rowData[additionalColumnMapping.matricule];
      if (matricule) {
        additionalIndex[String(matricule).trim()] = rowData;
      }
    });
  }

  // Générer les données de convention
  const conventions: ConventionData[] = [];

  for (const row of mainData as Record<string, unknown>[]) {
    // Extraire les informations de l'étudiant depuis le champ combiné
    const etudiantInfo = String(row[mainColumnMapping.etudiant] || "");

    // Ignorer les lignes vides - vérifier si toutes les valeurs mappées sont vides
    const allValuesEmpty = Object.keys(mainColumnMapping).every((key) => {
      const value = row[mainColumnMapping[key]];
      return value === undefined || value === null || value === "";
    });

    if (allValuesEmpty) {
      continue; // Passer à la ligne suivante
    }

    const { nom, prenom, matricule } = extractStudentInfo(etudiantInfo);

    const additionalRow = additionalIndex[matricule];

    const convention: ConventionData = {
      nom,
      prenom,
      matricule,
      entreprise: String(row[mainColumnMapping.entreprise] || ""),
      adresseEntreprise: String(row[mainColumnMapping.adresseEntreprise] || ""),
      nomRepresentant: String(row[mainColumnMapping.nomRepresentant] || ""),
      titreRepresentant: String(row[mainColumnMapping.titreRepresentant] || ""),
      courrielEntreprise: String(row[mainColumnMapping.courrielEntreprise] || ""),
      nomSuperviseur: String(row[mainColumnMapping.nomSuperviseur] || ""),
      heuresParSemaine: Number(row[mainColumnMapping.heuresParSemaine] || 0),
      mandat: String(row[mainColumnMapping.mandat] || ""),
      salaireHoraire: Number(row[mainColumnMapping.salaireHoraire] || 0),
      modaliteTeletravail: String(row[mainColumnMapping.modaliteTeletravail] || ""),
      dateDebut: String(row[mainColumnMapping.dateDebut] || ""),
      dateFin: String(row[mainColumnMapping.dateFin] || ""),
    };

    // Ajouter les données du fichier additionnel
    if (additionalRow) {
      if (additionalColumnMapping.superviseurAcademique) {
        convention.superviseurAcademique = String(
          additionalRow[additionalColumnMapping.superviseurAcademique] || ""
        );
      }

      if (additionalColumnMapping.profil) {
        convention.profil = String(
          additionalRow[additionalColumnMapping.profil] || ""
        );
      }
    }

    conventions.push(convention);
  }

  return conventions;
}
