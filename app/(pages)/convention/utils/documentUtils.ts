import { createReport } from "docx-templates";
import type { ConventionData, ProgramConfig } from "../types";
import { parseDate, formatDateFrench, calculateWorkingDays } from "./dateUtils";
import { CLAUSES } from "../constants";

/**
 * Convertit un type MIME en extension de fichier
 */
function getExtensionFromMimeType(mimeType: string): string {
  const mimeToExt: Record<string, string> = {
    "image/png": ".png",
    "image/jpeg": ".jpg",
    "image/jpg": ".jpg",
    "image/gif": ".gif",
  };
  return mimeToExt[mimeType] || ".png";
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
  const joursOuvrables =
    dateDebut && dateFin ? calculateWorkingDays(dateDebut, dateFin) : 0;

  // Déterminer si le stage est rémunéré
  const isRemunere = convention.salaireHoraire > 0;

  // Sélectionner les clauses appropriées
  const clauses = isRemunere
    ? CLAUSES.STAGE_REMUNERE
    : CLAUSES.STAGE_NON_REMUNERE;

  // Déterminer le nom du programme
  let nomProgramme = programConfig.name;
  if (convention.profil && programConfig.profiles) {
    nomProgramme =
      programConfig.profiles[convention.profil] || programConfig.name;
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
    nomProfSuperviseur: convention.superviseurAcademique || "",

    // Stage
    nombreHeuresStage: programConfig.nbHeuresMinimumStage,
    nombreSemaineStage: programConfig.nbSemaineStage,
    nombreHeuresSemaine: convention.heuresParSemaine,
    nombreJoursOuvrables: joursOuvrables,
    MANDAT: convention.mandat,
    modaliteTeletravail: convention.modaliteTeletravail,
    salaireHoraire: convention.salaireHoraire || 0,

    // Dates
    DATE_STAGE_DEBUT: dateDebut ? formatDateFrench(dateDebut) : "",
    DATE_STAGE_FIN: dateFin ? formatDateFrench(dateFin) : "",
    DATE_DU_JOUR: formatDateFrench(new Date()),

    // Clauses conditionnelles
    CLAUSE_1_4: clauses.CLAUSE_1_4.replace(
      "{SALAIRE_HORAIRE}",
      String(convention.salaireHoraire || "")
    ),
    CLAUSE_1_5: clauses.CLAUSE_1_5,
    CLAUSE_1_6: clauses.CLAUSE_1_6,

    // Signatures (format spécifique pour docx-templates)
    SIGNATURE_DIRECTEUR: {
      width: 4, // en cm
      height: 1.5, // en cm
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
    cmdDelimiter: ["{", "}"],
    processLineBreaks: true,
  });

  return new Blob([new Uint8Array(report)], {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
}
