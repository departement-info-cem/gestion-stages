"use client";

import { useState } from "react";
import styles from "./page.module.css";
import modalStyles from "./modal.module.css";
import statusStyles from "./status.module.css";
import sharedStyles from "./shared.module.css";
import { useDossierGenerator } from "./useDossierGenerator";
import { ToolNavigation } from "../components/tool-navigation/ToolNavigation";
import { buildToolNavigationItems } from "../components/tool-navigation/navigation";
import { ProgramSelector } from "./program-selector/ProgramSelector";
import { ExcelImportSection } from "./excel-import/ExcelImportSection";
import { ColumnMappingSection } from "./column-mapping/ColumnMappingSection";

export default function DossierPage() {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const {
    program,
    setProgram,
    sheetNames,
    selectedSheet,
    sheetColumns,
    columnMapping,
    columnSamples,
    statusMessages,
    isGenerating,
    sourceFileName,
    readyToGenerate,
    handleFilePick,
    handleSheetChange,
    handleColumnMappingChange,
    generate,
  } = useDossierGenerator();

  const navigationItems = buildToolNavigationItems("dossier");

  return (
    <div className={styles.wrapper}>
      <ToolNavigation
        ariaLabel="Navigation des outils"
        className={styles.toolNavigation}
        items={navigationItems}
      />

      <div className={styles.grid}>
        <ProgramSelector
          selectedProgram={program}
          onProgramChange={setProgram}
        />

        {program && (
          <ExcelImportSection
            sourceFileName={sourceFileName}
            sheetNames={sheetNames}
            selectedSheet={selectedSheet}
            onFilePick={handleFilePick}
            onSheetChange={handleSheetChange}
          />
        )}
      </div>

      {sheetColumns.length > 0 && (
        <ColumnMappingSection
          sheetColumns={sheetColumns}
          columnMapping={columnMapping}
          columnSamples={columnSamples}
          onColumnMappingChange={handleColumnMappingChange}
          onPreviewClick={() => setIsPreviewOpen(true)}
        />
      )}

      {readyToGenerate && (
        <section id="generation" className={sharedStyles.section}>
          <h2 className={sharedStyles.sectionTitle}>4. Génération</h2>
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.primaryButton}
              onClick={generate}
              disabled={!readyToGenerate || isGenerating}
            >
              {isGenerating ? "Génération en cours…" : "Générer les dossiers"}
            </button>
            <p className={statusStyles.hint}>
              Un fichier ZIP « dossiersEtu » contiendra les dossiers individuels
              et le dossier d&apos;évaluations.
            </p>
          </div>
          {statusMessages.length > 0 && (
            <div className={statusStyles.statusArea}>
              {statusMessages.map((status) => {
                const toneClass =
                  status.tone === "error"
                    ? statusStyles.statusMessageError
                    : status.tone === "success"
                      ? statusStyles.statusMessageSuccess
                      : "";

                return (
                  <div
                    key={status.id}
                    className={`${statusStyles.statusMessage} ${toneClass}`.trim()}
                  >
                    {status.message}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {isPreviewOpen && (
        <div
          className={modalStyles.modalOverlay}
          role="presentation"
          onClick={() => setIsPreviewOpen(false)}
        >
          <div
            className={modalStyles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="column-preview-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className={modalStyles.modalHeader}>
              <h2 id="column-preview-title" className={modalStyles.modalTitle}>
                Aperçu des colonnes
              </h2>
              <button
                type="button"
                className={modalStyles.closeButton}
                onClick={() => setIsPreviewOpen(false)}
                aria-label="Fermer l'aperçu"
              >
                ×
              </button>
            </div>
            {columnSamples.length > 0 ? (
              <div className={modalStyles.modalGrid}>
                {columnSamples.map((sample, sampleIndex) => (
                  <div
                    key={`${sample.header || "colonne"}-${sampleIndex}`}
                    className={modalStyles.modalColumn}
                  >
                    <h3 className={modalStyles.modalColumnTitle}>
                      {sample.header || "Colonne sans nom"}
                    </h3>
                    <div className={modalStyles.modalValueList}>
                      <ol className={modalStyles.modalValueListInner}>
                        {sample.values.map((value, index) => (
                          <li
                            key={`${sample.header || "colonne"
                              }-${sampleIndex}-${index}`}
                            className={modalStyles.modalValueItem}
                          >
                            <span className={modalStyles.modalValueIndex}>
                              {index + 1}
                            </span>
                            {value ? (
                              <span className={modalStyles.modalValueText}>
                                {value}
                              </span>
                            ) : (
                              <span className={modalStyles.modalValuePlaceholder}>
                                —
                              </span>
                            )}
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className={modalStyles.modalEmpty}>
                Aucune donnée disponible pour cet onglet.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
