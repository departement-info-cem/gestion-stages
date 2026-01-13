import JSZip from "jszip";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import type { ProgramConfig, ConventionData } from "../types";
import { generateConventionData, generateConventionDocument, sanitizeFileName, validateColumnMapping } from "../utils";
import type { ColumnMapperField } from "@/app/components/column-mapper/ColumnMapper";

export interface GenerateConventionsParams {
  programConfig: ProgramConfig;
  mainWorksheet: XLSX.WorkSheet;
  mainColumnMapping: { [key: string]: string };
  additionalWorksheet: XLSX.WorkSheet | null;
  additionalColumnMapping: { [key: string]: string };
  signatureDirecteur: {
    image: File;
    signataireName: string;
  };
  signatureCoordonnateur: {
    image: File;
    signataireName: string;
  };
  defaultDates: {
    startDate: string;
    endDate: string;
  };
  mainFields: readonly ColumnMapperField[];
  selectedProgram: string;
  onProgress: (type: 'success' | 'error' | 'warning', message: string) => void;
}

export async function generateConventions(
  params: GenerateConventionsParams
): Promise<void> {
  const {
    programConfig,
    mainWorksheet,
    mainColumnMapping,
    additionalWorksheet,
    additionalColumnMapping,
    signatureDirecteur,
    signatureCoordonnateur,
    defaultDates,
    mainFields,
    selectedProgram,
    onProgress,
  } = params;

  // Validation
  const mainValidation = validateColumnMapping(mainColumnMapping, mainFields);
  if (!mainValidation.isValid) {
    throw new Error(
      `Colonnes manquantes: ${mainValidation.missingFields.join(", ")}`
    );
  }

  if (!signatureDirecteur.image || !signatureCoordonnateur.image) {
    throw new Error("Veuillez téléverser les deux signatures");
  }

  if (!signatureDirecteur.signataireName || !signatureCoordonnateur.signataireName) {
    throw new Error("Veuillez entrer les noms des signataires");
  }

  // Charger le template
  const templateResponse = await fetch(programConfig.templatePath);
  if (!templateResponse.ok) {
    throw new Error("Erreur lors du chargement du template");
  }
  const templateBuffer = await templateResponse.arrayBuffer();

  // Charger les signatures avec leur type MIME
  const signatureDirecteurBuffer = await signatureDirecteur.image.arrayBuffer();
  const signatureCoordonnateurBuffer = await signatureCoordonnateur.image.arrayBuffer();
  const signatureDirecteurType = signatureDirecteur.image.type;
  const signatureCoordonnateurType = signatureCoordonnateur.image.type;

  // Générer les données
  const conventions = generateConventionData(
    mainWorksheet,
    mainColumnMapping,
    additionalWorksheet,
    additionalColumnMapping
  );

  onProgress("success", `${conventions.length} conventions à générer`);

  // Créer un ZIP
  const zip = new JSZip();

  // Générer chaque convention
  for (let i = 0; i < conventions.length; i++) {
    const convention = conventions[i];

    try {
      const docBlob = await generateConventionDocument(
        convention,
        programConfig,
        templateBuffer,
        {
          image: signatureDirecteurBuffer,
          name: signatureDirecteur.signataireName,
          mimeType: signatureDirecteurType,
        },
        {
          image: signatureCoordonnateurBuffer,
          name: signatureCoordonnateur.signataireName,
          mimeType: signatureCoordonnateurType,
        },
        defaultDates
      );

      const fileName = `Convention_${sanitizeFileName(
        convention.nom
      )}_${sanitizeFileName(convention.prenom)}.docx`;
      zip.file(fileName, docBlob);

      onProgress(
        "success",
        `Convention générée: ${convention.nom}, ${convention.prenom}`
      );
    } catch (error) {
      onProgress(
        "error",
        `Erreur pour ${convention.nom}, ${convention.prenom}: ${error}`
      );
      console.error(error);
    }
  }

  // Télécharger le ZIP
  const zipBlob = await zip.generateAsync({ type: "blob" });
  saveAs(
    zipBlob,
    `Conventions_${selectedProgram}_${new Date().toISOString().split("T")[0]}.zip`
  );

  onProgress("success", "Toutes les conventions ont été générées avec succès!");
}
