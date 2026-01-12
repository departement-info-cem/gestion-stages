import type { ColumnKey, ColumnMapping, ColumnSample } from "../types";
import { COLUMN_LABELS, REQUIRED_KEYS } from "../constants";
import { ColumnMapper, type ColumnMapperField } from "../../../components/column-mapper/ColumnMapper";
import styles from "../shared.module.css";
import { EyeIcon } from "@/app/assets/icons/EyeIcon";

interface ColumnMappingSectionProps {
  sheetColumns: string[];
  columnMapping: ColumnMapping;
  columnSamples: ColumnSample[];
  onColumnMappingChange: (key: ColumnKey, value: string) => void;
  onPreviewClick: () => void;
}

const FIELDS: readonly ColumnMapperField<ColumnKey>[] = REQUIRED_KEYS.map(key => ({
  key,
  label: COLUMN_LABELS[key],
}));

export function ColumnMappingSection({
  sheetColumns,
  columnMapping,
  columnSamples,
  onColumnMappingChange,
  onPreviewClick,
}: ColumnMappingSectionProps) {
  return (
    <section className={styles.section}>
      <div className={styles.sectionTitleBar}>
        <h2 className={styles.sectionTitle}>3. Associez les colonnes</h2>
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

      <ColumnMapper
        fields={FIELDS}
        sheetColumns={sheetColumns}
        columnMapping={columnMapping}
        columnSamples={columnSamples}
        onColumnMappingChange={onColumnMappingChange}
      />
    </section>
  );
}

