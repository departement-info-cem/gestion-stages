import styles from "./SectionTile.module.css";
import { EyeIcon } from "@/app/assets/icons/EyeIcon";
import { ReactNode } from "react";

export interface SectionTileProps {
  title: string;
  children: ReactNode;
  onPreviewClick?: () => void;
  previewDisabled?: boolean;
  className?: string;
}
export function SectionTile({
  title,
  children,
  onPreviewClick,
  previewDisabled = false,
  className,
}: SectionTileProps) {
  return (
    <section className={styles.section}>
      <div className={styles.sectionTitleBar}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        {onPreviewClick && (
          <button
            type="button"
            className={styles.previewIconButton}
            onClick={onPreviewClick}
            disabled={previewDisabled}
            aria-label="Voir un aperçu des colonnes"
            title="Voir un aperçu des colonnes"
          >
            <span className={styles.visuallyHidden}>
              Voir un aperçu des colonnes
            </span>
            <EyeIcon className={styles.previewIcon} />
          </button>
        )}
      </div>
      {children}
    </section>
  );
}
