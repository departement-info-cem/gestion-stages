import type { ChangeEvent } from "react";
import { useEffect, useRef } from "react";
import styles from "./ColumnMapper.module.css";
import type { ColumnMapperProps, ColumnMapperField, ColumnSample } from "./types";

export type { ColumnMapperField, ColumnSample, ColumnMapperProps };

export function ColumnMapper<T extends string = string>({
  fields,
  sheetColumns,
  columnMapping,
  columnSamples,
  onColumnMappingChange,
}: ColumnMapperProps<T>) {
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
      element.addEventListener("scroll", listener, { passive: true });
      listeners.set(key, listener);
    });

    return () => {
      listeners.forEach((listener, key) => {
        const element = scrollRefs.current.get(key);
        if (element) {
          element.removeEventListener("scroll", listener);
        }
      });
    };
  }, [columnMapping, sheetColumns]);

  return (
    <div className={styles.mappingGrid}>
      {fields.map((field) => {
          const selectedColumn = columnMapping[field.key];
          const sample = columnSamples.find(
            (entry) => entry.header === selectedColumn
          );
          const sampleValues = sample?.values ?? [];

          return (
            <div key={field.key} className={styles.mappingItem}>
              <label className={styles.mappingLabel} htmlFor={`column-${field.key}`}>
                {field.label}
              </label>
              <select
                id={`column-${field.key}`}
                className={styles.select}
                value={selectedColumn}
                onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                  onColumnMappingChange(field.key, event.target.value)
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
                    scrollRefs.current.set(field.key, el);
                  } else {
                    scrollRefs.current.delete(field.key);
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
                          <span className={styles.valueIndex}>
                            {index + 1}
                          </span>
                          {value ? (
                            <span
                              className={`${styles.valueText} ${styles.columnSampleValue}`}
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
                    Sélectionnez une colonne pour voir un aperçu des valeurs.
                  </span>
                )}
              </div>
            </div>
          );
        })}
    </div>
  );
}
