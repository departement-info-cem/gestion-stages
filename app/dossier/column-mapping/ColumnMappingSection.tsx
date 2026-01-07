import type { MutableRefObject, ChangeEvent } from "react";
import { useEffect, useRef } from "react";
import sharedStyles from "../shared.module.css";
import styles from "./ColumnMappingSection.module.css";
import modalStyles from "../modal.module.css";
import { COLUMN_LABELS, REQUIRED_KEYS } from "../constants";
import type { ColumnKey, ColumnMapping, ColumnSample } from "../types";
import { EyeIcon } from "../../components/icons/ToolIcons";

interface ColumnMappingSectionProps {
  sheetColumns: string[];
  columnMapping: ColumnMapping;
  columnSamples: ColumnSample[];
  onColumnMappingChange: (key: ColumnKey, value: string) => void;
  onPreviewClick: () => void;
}

export function ColumnMappingSection({
  sheetColumns,
  columnMapping,
  columnSamples,
  onColumnMappingChange,
  onPreviewClick,
}: ColumnMappingSectionProps) {
  const scrollRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const isScrollingRef = useRef(false);

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
    <section id="colonnes" className={sharedStyles.section}>
      <div className={styles.sectionTitleBar}>
        <h2 className={sharedStyles.sectionTitle}>3. Associez les colonnes</h2>
        <button
          type="button"
          className={styles.previewIconButton}
          onClick={onPreviewClick}
          disabled={columnSamples.length === 0}
          aria-label="Voir un aperçu des colonnes"
          title="Voir un aperçu des colonnes"
        >
          <span className={styles.visuallyHidden}>
            Voir un aperçu des colonnes
          </span>
          <EyeIcon className={styles.previewIcon} />
        </button>
      </div>

      <div className={styles.mappingGrid}>
        {REQUIRED_KEYS.map((key) => {
          const selectedColumn = columnMapping[key];
          const sample = columnSamples.find(
            (entry) => entry.header === selectedColumn
          );
          const sampleValues = sample?.values ?? [];

          return (
            <div key={key} className={styles.mappingItem}>
              <label
                className={styles.mappingLabel}
                htmlFor={`column-${key}`}
              >
                {COLUMN_LABELS[key]}
              </label>
              <select
                id={`column-${key}`}
                className={sharedStyles.select}
                value={selectedColumn}
                onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                  onColumnMappingChange(key, event.target.value)
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
                className={styles.columnSample}
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
                    <ol className={styles.columnSampleList}>
                      {sampleValues.map((value, index) => (
                        <li
                          key={`${selectedColumn}-sample-${index}`}
                          className={styles.columnSampleItem}
                        >
                          <span className={modalStyles.modalValueIndex}>
                            {index + 1}
                          </span>
                          {value ? (
                            <span
                              className={`${modalStyles.modalValueText} ${styles.columnSampleValue}`}
                            >
                              {value}
                            </span>
                          ) : (
                            <span className={styles.columnSampleValuePlaceholder}>
                              —
                            </span>
                          )}
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <span className={styles.columnSamplePlaceholder}>
                      Aucune donnée disponible pour cette colonne.
                    </span>
                  )
                ) : (
                  <span className={styles.columnSamplePlaceholder}>
                    Sélectionnez une colonne pour voir toutes les valeurs.
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
