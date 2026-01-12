import { ColumnMapping, ColumnSamples } from '../types';
import { ADDITIONAL_FILE_FIELDS } from '../constants';
import styles from '../shared.module.css';
import { EyeIcon } from '@/app/assets/icons/EyeIcon';
import { ColumnMapper } from '@/app/components/column-mapper/ColumnMapper';

interface StudentInfosColumnMappingSectionProps {
  sheetColumns: string[];
  columnMapping: ColumnMapping;
  columnSamples: ColumnSamples;
  onColumnMappingChange: (fieldKey: string, columnName: string) => void;
  onPreviewClick: () => void;
}

export function StudentInfosColumnMappingSection({
  sheetColumns,
  columnMapping,
  columnSamples,
  onColumnMappingChange,
  onPreviewClick,
}: StudentInfosColumnMappingSectionProps) {
  // Convertir le format de columnSamples pour le ColumnMapper
  const columnSamplesArray = Object.entries(columnMapping)
    .filter(([_, excelColumn]) => excelColumn)
    .map(([fieldKey, excelColumn]) => ({
      header: excelColumn,
      values: (columnSamples[fieldKey] || []).map(String),
    }));


  return (
    <section className={styles.section}>
      <div className={styles.sectionTitleBar}>
        <h2 className={styles.sectionTitle}>{`2. Fichier de réponse des entreprises`}</h2>
        <button
          type="button"
          className={styles.previewIconButton}
          onClick={onPreviewClick}
          disabled={columnSamplesArray.length === 0}
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
        fields={ADDITIONAL_FILE_FIELDS}
        sheetColumns={sheetColumns}
        columnMapping={columnMapping}
        columnSamples={columnSamplesArray}
        onColumnMappingChange={onColumnMappingChange}
      />
    </section>

  );
}
