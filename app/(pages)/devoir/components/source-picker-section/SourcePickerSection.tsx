"use client";

import { SectionTile } from "@/app/components/section-tile/SectionTile";
import styles from "./SourcePickerSection.module.css";

interface Props {
  sourceHandle: FileSystemDirectoryHandle | null;
  onPickSource: () => Promise<void>;
  studentsCount: number;
  assignmentsCount: number;
  isScanning: boolean;
}

export function SourcePickerSection({
  sourceHandle,
  onPickSource,
  studentsCount,
  assignmentsCount,
  isScanning,
}: Props) {
  return (
    <SectionTile title="1. Sélection du dossier Teams">
      <button onClick={onPickSource} className={styles.button}>
        📁 Sélectionner le dossier Teams
      </button>

      {sourceHandle && (
        <div className={styles.successIndicator}>
          ✓ Dossier sélectionné
        </div>
      )}

      {isScanning && (
        <div className={styles.scanningMessage}>
          ⏳ Scan en cours...
        </div>
      )}

      {sourceHandle && !isScanning && (
        <div className={styles.statusGrid}>
          <div className={styles.statusItem}>
            <span className={styles.statusLabel}>Étudiants détectés:</span>
            <span className={styles.statusCount}>{studentsCount}</span>
          </div>
          <div className={styles.statusItem}>
            <span className={styles.statusLabel}>Devoirs détectés:</span>
            <span className={styles.statusCount}>{assignmentsCount}</span>
          </div>
        </div>
      )}
    </SectionTile>
  );
}
