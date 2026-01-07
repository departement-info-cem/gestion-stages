"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";
import mappingStyles from "./mapping.module.css";
import modalStyles from "./modal.module.css";
import statusStyles from "./status.module.css";
import { COLUMN_LABELS, PREDEFINED_PROFILE_CODES, PROGRAM_OPTIONS, REQUIRED_KEYS } from "./constants";
import { useDossierGenerator } from "./useDossierGenerator";
import { ToolNavigation } from "../components/tool-navigation/ToolNavigation";
import { buildToolNavigationItems } from "../components/tool-navigation/navigation";

export default function DossierPage() {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const scrollRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const isScrollingRef = useRef(false);
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
    profileMode,
    setProfileMode,
    fixedProfileCode,
    setFixedProfileCode,
    handleFileUpload,
    handleSheetChange,
    handleColumnMappingChange,
    generate,
  } = useDossierGenerator();

  const navigationItems = buildToolNavigationItems("dossier");

  useEffect(() => {
    const handleScroll = (sourceKey: string) => {
      if (isScrollingRef.current) return;
      
      const sourceElement = scrollRefs.current.get(sourceKey);
      if (!sourceElement) return;
      
      const scrollTop = sourceElement.scrollTop;
      
      isScrollingRef.current = true;
      scrollRefs.current.forEach((element, key) => {
        if (key !== sourceKey && element) {
          element.scrollTop = scrollTop;
        }
      });
      
      requestAnimationFrame(() => {
        isScrollingRef.current = false;
      });
    };

    const listeners = new Map<string, () => void>();
    scrollRefs.current.forEach((element, key) => {
      const listener = () => handleScroll(key);
      element.addEventListener('scroll', listener, { passive: true });
      listeners.set(key, listener);
    });

    return () => {
      listeners.forEach((listener, key) => {
        const element = scrollRefs.current.get(key);
        if (element) {
          element.removeEventListener('scroll', listener);
        }
      });
    };
  }, [columnMapping, sheetColumns]);

  return (
    <div className={styles.wrapper}>
      <ToolNavigation
        ariaLabel="Navigation des outils"
        className={styles.toolNavigation}
        items={navigationItems}
      />

      <div className={styles.grid}>
        <section id="programme" className={styles.section}>
          <h2 className={styles.sectionTitle}>1. Choisissez le programme</h2>
          <div className={styles.radioGroup}>
            {PROGRAM_OPTIONS.map((option) => (
              <label key={option.id} className={styles.radioOption}>
                <input
                  type="radio"
                  name="program"
                  value={option.id}
                  checked={program === option.id}
                  onChange={() => setProgram(option.id)}
                />
                <div className={styles.radioContent}>
                  <span className={styles.radioLabel}>{option.label}</span>
                </div>
              </label>
            ))}
          </div>
        </section>

        {program && (
          <section id="importation" className={styles.section}>
            <h2 className={styles.sectionTitle}>2. Importez la liste Excel</h2>
          <label className={styles.fileInput}>
            <span>
              {sourceFileName ||
                "Déposez un fichier ou cliquez pour sélectionner un .xlsx"}
            </span>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              hidden
            />
          </label>
          {sheetNames.length > 0 && (
            <>
              <h4>Sélectionnez l'onglet du excel à traiter</h4>
              <select
                className={styles.select}
                value={selectedSheet}
                onChange={handleSheetChange}
              >
                {sheetNames.map((sheetName) => (
                  <option key={sheetName} value={sheetName}>
                    {sheetName}
                  </option>
                ))}
              </select>
            </>
          )}
        </section>
        )}
      </div>

      {sheetColumns.length > 0 && (
        <section id="colonnes" className={styles.section}>
          <div className={styles.sectionTitleBar}>
            <h2 className={styles.sectionTitle}>3. Associez les colonnes</h2>
            <button
              type="button"
              className={styles.previewIconButton}
              onClick={() => setIsPreviewOpen(true)}
              disabled={columnSamples.length === 0}
              aria-label="Voir un aperçu des colonnes"
              title="Voir un aperçu des colonnes"
            >
              <span className={styles.visuallyHidden}>
                Voir un aperçu des colonnes
              </span>
              <svg
                aria-hidden="true"
                className={styles.previewIcon}
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="1.8"
                stroke="currentColor"
              >
                <path
                  d="M12 5c-5.06 0-8.82 3.39-10 7 1.18 3.61 4.94 7 10 7s8.82-3.39 10-7c-1.18-3.61-4.94-7-10-7Z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="12" cy="12" r="3.2" />
              </svg>
            </button>
          </div>

          <div className={mappingStyles.mappingGrid}>
            {REQUIRED_KEYS.map((key) => {
              const selectedColumn = columnMapping[key];
              const sample = columnSamples.find(
                (entry) => entry.header === selectedColumn
              );
              const sampleValues = sample?.values ?? [];

              // Traitement spécial pour le profil
              if (key === "profile") {
                return (
                  <div key={key} className={mappingStyles.mappingItem}>
                    <label className={mappingStyles.mappingLabel}>
                      {COLUMN_LABELS[key]}
                    </label>
                    <div className={styles.radioGroup}>
                      <label className={styles.radioOption}>
                        <input
                          type="radio"
                          name="profileMode"
                          value="column"
                          checked={profileMode === "column"}
                          onChange={() => setProfileMode("column")}
                        />
                        <div className={styles.radioContent}>
                          <span className={styles.radioLabel}>
                            Depuis le fichier Excel
                          </span>
                        </div>
                      </label>
                      <label className={styles.radioOption}>
                        <input
                          type="radio"
                          name="profileMode"
                          value="fixed"
                          checked={profileMode === "fixed"}
                          onChange={() => setProfileMode("fixed")}
                        />
                        <div className={styles.radioContent}>
                          <span className={styles.radioLabel}>
                            Valeur fixe pour tous
                          </span>
                        </div>
                      </label>
                    </div>

                    {profileMode === "column" ? (
                      <>
                        <select
                          id={`column-${key}`}
                          className={styles.select}
                          value={selectedColumn}
                          onChange={(event) =>
                            handleColumnMappingChange(key, event.target.value)
                          }
                        >
                          <option value="">Sélectionnez une colonne…</option>
                          {sheetColumns.map((column) => (
                            <option key={column} value={column}>
                              {column}
                            </option>
                          ))}
                        </select>
                        <div 
                          className={mappingStyles.columnSample}
                          ref={(el) => {
                            if (el) {
                              scrollRefs.current.set(key, el);
                            } else {
                              scrollRefs.current.delete(key);
                            }
                          }}
                        >
                          {selectedColumn ? (
                            sampleValues.length ? (
                              <ol className={mappingStyles.columnSampleList}>
                                {sampleValues.map((value, index) => (
                                  <li
                                    key={`${selectedColumn}-sample-${index}`}
                                    className={mappingStyles.columnSampleItem}
                                  >
                                    <span className={modalStyles.modalValueIndex}>
                                      {index + 1}
                                    </span>
                                    {value ? (
                                      <span className={`${modalStyles.modalValueText} ${mappingStyles.columnSampleValue}`}>
                                        {value}
                                      </span>
                                    ) : (
                                      <span
                                        className={
                                          mappingStyles.columnSampleValuePlaceholder
                                        }
                                      >
                                        —
                                      </span>
                                    )}
                                  </li>
                                ))}
                              </ol>
                            ) : (
                              <span className={mappingStyles.columnSamplePlaceholder}>
                                Aucune donnée disponible pour cette colonne.
                              </span>
                            )
                          ) : (
                            <span className={mappingStyles.columnSamplePlaceholder}>
                              Sélectionnez une colonne pour voir les valeurs.
                            </span>
                          )}
                        </div>
                      </>
                    ) : (
                      <select
                        id="fixed-profile"
                        className={styles.select}
                        value={fixedProfileCode}
                        onChange={(event) =>
                          setFixedProfileCode(event.target.value as typeof fixedProfileCode)
                        }
                      >
                        {PREDEFINED_PROFILE_CODES.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                );
              }

              return (
                <div key={key} className={mappingStyles.mappingItem}>
                  <label
                    className={mappingStyles.mappingLabel}
                    htmlFor={`column-${key}`}
                  >
                    {COLUMN_LABELS[key]}
                  </label>
                  <select
                    id={`column-${key}`}
                    className={styles.select}
                    value={selectedColumn}
                    onChange={(event) =>
                      handleColumnMappingChange(key, event.target.value)
                    }
                  >
                    <option value="">Sélectionnez une colonne…</option>
                    {sheetColumns.map((column) => (
                      <option key={column} value={column}>
                        {column}
                      </option>
                    ))}
                  </select>
                  <div 
                    className={mappingStyles.columnSample}
                    ref={(el) => {
                      if (el) {
                        scrollRefs.current.set(key, el);
                      } else {
                        scrollRefs.current.delete(key);
                      }
                    }}
                  >
                    {selectedColumn ? (
                      sampleValues.length ? (
                        <ol className={mappingStyles.columnSampleList}>
                          {sampleValues.map((value, index) => (
                            <li
                              key={`${selectedColumn}-sample-${index}`}
                              className={mappingStyles.columnSampleItem}
                            >
                              <span className={modalStyles.modalValueIndex}>
                                {index + 1}
                              </span>
                              {value ? (
                                <span className={`${modalStyles.modalValueText} ${mappingStyles.columnSampleValue}`}>
                                  {value}
                                </span>
                              ) : (
                                <span
                                  className={
                                    mappingStyles.columnSampleValuePlaceholder
                                  }
                                >
                                  —
                                </span>
                              )}
                            </li>
                          ))}
                        </ol>
                      ) : (
                        <span className={mappingStyles.columnSamplePlaceholder}>
                          Aucune donnée disponible pour cette colonne.
                        </span>
                      )
                    ) : (
                      <span className={mappingStyles.columnSamplePlaceholder}>
                        Sélectionnez une colonne pour voir toutes les valeurs.
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {readyToGenerate && (
        <section id="generation" className={styles.section}>
        <h2 className={styles.sectionTitle}>4. Génération</h2>
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
                    <ol className={modalStyles.modalValueList}>
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
