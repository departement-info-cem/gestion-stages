'use client';

import { ColumnMapper } from '@/app/components/column-mapper/ColumnMapper';
import type { ColumnMapperField as SharedColumnMapperField } from '@/app/components/column-mapper/types';
import { SectionTile } from '@/app/components/section-tile/SectionTile';
import { ColumnKey, ColumnMapping, ColumnSample } from '../../types';
import { COLUMN_MAPPER_FIELDS } from '../../constants';
import styles from './ColumnMappingSection.module.css';

interface ColumnMappingSectionProps {
  sheetColumns: string[];
  columnMapping: ColumnMapping;
  columnSamples: ColumnSample[];
  onColumnMappingChange: (key: ColumnKey, value: string) => void;
}

const FIELDS: readonly SharedColumnMapperField<ColumnKey>[] = COLUMN_MAPPER_FIELDS.map((field) => ({
  key: field.key,
  label: field.required ? `${field.label} *` : field.label,
}));

export function ColumnMappingSection({
  sheetColumns,
  columnMapping,
  columnSamples,
  onColumnMappingChange,
}: ColumnMappingSectionProps) {
  if (sheetColumns.length === 0) {
    return null;
  }

  return (
    <SectionTile title="Mapper les colonnes">
      <div className={styles.container}>
        <p className={styles.description}>
          Sélectionnez la colonne Excel correspondant à chaque champ. Les colonnes détectées
          automatiquement sont pré-sélectionnées.
        </p>

        <ColumnMapper<ColumnKey>
          fields={FIELDS}
          sheetColumns={sheetColumns}
          columnMapping={columnMapping}
          columnSamples={columnSamples}
          onColumnMappingChange={onColumnMappingChange}
        />
      </div>
    </SectionTile>
  );
}
