import { SectionTile } from "@/app/components/section-tile/SectionTile";
import styles from "./ReportLinkSection.module.css";

export interface ReportLinkSectionProps {
  reportUrl: string;
  onReportUrlChange: (url: string) => void;
}

export function ReportLinkSection({
  reportUrl,
  onReportUrlChange,
}: ReportLinkSectionProps) {
  return (
    <SectionTile title="3. Lien du rapport en ligne">
      <div className={styles.content}>
        <p className={styles.description}>
          Entrez le lien vers le formulaire en ligne qui servira de rapport pour les étudiants.
        </p>
        <input
          type="url"
          className={styles.input}
          placeholder="https://forms.gle/..."
          value={reportUrl}
          onChange={(e) => onReportUrlChange(e.target.value)}
        />
      </div>
    </SectionTile>
  );
}
