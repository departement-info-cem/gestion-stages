"use client";

import styles from "./page.module.css";
import { useDevoirGenerator } from "./useDevoirGenerator";
import { SourcePickerSection } from "./components/source-picker-section/SourcePickerSection";
import { GenerationSection } from "./components/generation-section/GenerationSection";
import { SectionTile } from "@/app/components/section-tile/SectionTile";

export default function DevoirPage() {
  const {
    sourceHandle,
    sourcePath,
    students,
    assignments,
    report,
    statusMessages,
    isProcessing,
    isScanning,
    pickSourceDirectory,
    processAssignment,
    generateCsv,
  } = useDevoirGenerator();

  function downloadCsv() {
    const csv = generateCsv();
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "rapport_devoirs.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className={styles.container}>
      <div className={styles.topRow}>
        <SectionTile title="Instructions préalables">
          <div className={styles.instructions}>
            <p className={styles.instructionText}>
              Avant de commencer, vous devez obtenir le dossier Teams contenant les remises des étudiants sur votre ordinateur via SharePoint :
            </p>
            <ol className={styles.instructionList}>
              <li><span className={styles.stepNumber}>1️⃣</span> <span>Ouvrir le site SharePoint : <a href="https://cegepedouardmontpetit.sharepoint.com/_layouts/15/sharepoint.aspx" target="_blank" rel="noopener noreferrer" className={styles.link}>cegepedouardmontpetit.sharepoint.com</a></span></li>
              <li><span className={styles.stepNumber}>2️⃣</span> <span>Trouver le site SharePoint de votre équipe Teams (ex. PR-Stages_Techniques_Informatique)</span></li>
              <li><span className={styles.stepNumber}>3️⃣</span> <span>Dans le menu du haut, sélectionner <strong>Contenu du site</strong></span></li>
              <li><span className={styles.stepNumber}>4️⃣</span> <span>Sélectionner <strong>Student Work</strong></span></li>
              <li><span className={styles.stepNumber}>5️⃣</span> <span>Sélectionner <strong>Submitted Files</strong></span></li>
              <li><span className={styles.stepNumber}>6️⃣</span> <span>Cliquer sur le bouton <strong>Synchroniser</strong> dans le menu du haut (si OneDrive est installé)</span></li>
              <li><span className={styles.stepNumber}>7️⃣</span> <span>Une fois synchronisé, le dossier sera accessible localement sur votre ordinateur</span></li>
            </ol>
            <p className={styles.instructionNote}>
              📌 <strong>Alternative :</strong> Si OneDrive n'est pas installé, vous pouvez télécharger le dossier en cliquant sur <strong>Télécharger</strong> dans le menu du haut, puis extraire le fichier ZIP.
            </p>
          </div>
        </SectionTile>

        <SourcePickerSection
          sourceHandle={sourceHandle}
          onPickSource={pickSourceDirectory}
          studentsCount={students.length}
          assignmentsCount={assignments.length}
          isScanning={isScanning}
        />
      </div>

      {sourceHandle && (
        <GenerationSection
          assignments={assignments}
          reportRowsCount={report.length}
          statusMessages={statusMessages}
          isProcessing={isProcessing}
          onProcess={processAssignment}
          onDownloadCsv={downloadCsv}
        />
      )}
    </div>
  );
}
