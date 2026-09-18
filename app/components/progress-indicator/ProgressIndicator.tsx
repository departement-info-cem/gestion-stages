import type { CSSProperties } from "react";
import type { ProgressState } from "./types";
import styles from "./ProgressIndicator.module.css";

export interface ProgressIndicatorProps {
  progress: ProgressState;
}

export function ProgressIndicator({ progress }: ProgressIndicatorProps) {
  const { label, value } = progress;
  const isDeterminate: boolean = typeof value === "number";
  const percentage: number = Math.min(100, Math.max(0, Math.round(value ?? 0)));
  // La largeur de la barre est la seule valeur qui dépend de l'exécution : elle
  // passe par une propriété personnalisée pour que la mise en forme reste dans
  // la feuille de style.
  const barStyle = { "--progress-value": `${percentage}%` } as CSSProperties;

  return (
    <div className={styles.container} role="status" aria-live="polite">
      <div className={styles.header}>
        <span className={styles.label}>{label}</span>
        {isDeterminate && <span className={styles.value}>{percentage} %</span>}
      </div>
      <div
        className={styles.track}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={isDeterminate ? percentage : undefined}
        aria-valuetext={label}
      >
        <div
          className={`${styles.bar} ${
            isDeterminate ? styles.determinate : styles.indeterminate
          }`}
          style={barStyle}
        />
      </div>
    </div>
  );
}
