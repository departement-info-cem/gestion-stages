import styles from "./GenerationSection.module.css";
import type { StatusMessage } from "../types";
import { SectionTile } from "@/app/components/section-tile/SectionTile";

interface GenerationSectionProps {
  isGenerating: boolean;
  statusMessages: StatusMessage[];
  onGenerate: () => void;
}

export function GenerationSection({
  isGenerating,
  statusMessages,
  onGenerate,
}: GenerationSectionProps) {
  return (
    <SectionTile title="4. Génération">
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.primaryButton}
          onClick={onGenerate}
          disabled={isGenerating}
        >
          {isGenerating ? "Génération en cours…" : "Générer les dossiers"}
        </button>
        <p className={styles.hint}>
          Un fichier ZIP « dossiersEtu » contiendra les dossiers individuels et
          le dossier d&apos;évaluations.
        </p>
      </div>
      {statusMessages.length > 0 && (
        <div className={styles.statusArea}>
          {statusMessages.map((status) => {
            const toneClass =
              status.tone === "error"
                ? styles.statusMessageError
                : status.tone === "success"
                  ? styles.statusMessageSuccess
                  : "";

            return (
              <div
                key={status.id}
                className={`${styles.statusMessage} ${toneClass}`.trim()}
              >
                {status.message}
              </div>
            );
          })}
        </div>
      )}
    </SectionTile>
  );
}
