"use client";

import { useState } from "react";
import { SectionTile } from "@/app/components/section-tile/SectionTile";
import styles from "./GenerationSection.module.css";

interface Props {
  assignments: string[];
  reportRowsCount: number;
  statusMessages: string[];
  isProcessing: boolean;
  onProcess: (assignmentName: string | null) => Promise<void>;
  onDownloadCsv: () => void;
}

export function GenerationSection({
  assignments,
  reportRowsCount,
  statusMessages,
  isProcessing,
  onProcess,
  onDownloadCsv,
}: Props) {
  const [selectedAssignment, setSelectedAssignment] = useState<string>("");

  async function handleProcess() {
    await onProcess(selectedAssignment || null);
  }

  return (
    <SectionTile title="2. Traitement et téléchargement">
      <div className={styles.controlsRow}>
        <div className={styles.selectGroup}>
          <label htmlFor="devoir-select" className={styles.label}>
            Devoir à traiter:
          </label>
          <select 
            id="devoir-select" 
            className={styles.select}
            value={selectedAssignment}
            onChange={(e) => setSelectedAssignment(e.target.value)}
            disabled={assignments.length === 0}
          >
            <option value="">— Tous les devoirs —</option>
            {assignments.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>
        <button
          className={styles.processButton}
          onClick={handleProcess}
          disabled={isProcessing || assignments.length === 0}
        >
          {isProcessing ? "⏳ Traitement en cours..." : "📦 Télécharger ZIP"}
        </button>
      </div>

      <button 
        onClick={onDownloadCsv} 
        disabled={reportRowsCount === 0}
        className={styles.downloadButton}
      >
        📄 Télécharger le rapport CSV
      </button>

      {statusMessages.length > 0 && (
        <div className={styles.logsContainer}>
          <h3 className={styles.logsTitle}>Logs d’exécution</h3>
          <div className={styles.logsList}>
            {statusMessages.map((m, i) => (
              <div key={i} className={styles.logItem}>
                <span className={styles.logBullet}>•</span>
                <span className={styles.logText}>{m}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </SectionTile>
  );
}
