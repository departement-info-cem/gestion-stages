import { ColumnMapper, ColumnMapperField } from '@/app/components/column-mapper/ColumnMapper';
import { ColumnMapping, ColumnSamples } from '../types';
import styles from '../shared.module.css';
import { EyeIcon } from '@/app/assets/icons/EyeIcon';

interface ColumnMappingSectionProps {
  fields: readonly ColumnMapperField[];
  sheetColumns: string[];
  columnMapping: ColumnMapping;
  columnSamples: ColumnSamples;
  onColumnMappingChange: (fieldKey: string, columnName: string) => void;
  onPreviewClick: () => void;
}

export function OrganizationInfosColumnMapping({
  fields,
  sheetColumns,
  columnMapping,
  columnSamples,
  onColumnMappingChange,
  onPreviewClick,
}: ColumnMappingSectionProps) {
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
        fields={fields}
        sheetColumns={sheetColumns}
        columnMapping={columnMapping}
        columnSamples={columnSamplesArray}
        onColumnMappingChange={onColumnMappingChange}
      />
    </section>
  );
}
