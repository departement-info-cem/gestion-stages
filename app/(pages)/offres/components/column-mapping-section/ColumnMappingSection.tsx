import { SectionTile } from '@/app/components/section-tile/SectionTile';
import { ColumnMapper } from '@/app/components/column-mapper/ColumnMapper';
import type { ColumnMapping, ColumnSample, RequiredColumnKey } from '../../types';
import type { ColumnMapperField } from '@/app/components/column-mapper/types';
import { COLUMN_LABELS, REQUIRED_COLUMN_KEYS, MANDATORY_COLUMN_KEYS } from '../../constants';
import { useMemo } from 'react';
import styles from './ColumnMappingSection.module.css';

export interface ColumnMappingSectionProps {
  sheetColumns: string[];
  columnMapping: ColumnMapping;
  columnSamples: ColumnSample[];
  onColumnMappingChange: (key: RequiredColumnKey, value: string) => void;
}

export function ColumnMappingSection({
  sheetColumns,
  columnMapping,
  columnSamples,
  onColumnMappingChange,
}: ColumnMappingSectionProps) {
  // Convertir toutes les colonnes au format attendu par ColumnMapper
  // En mettant les obligatoires en premier
  const fields: readonly ColumnMapperField<RequiredColumnKey>[] = useMemo(() => {
    const mandatory = MANDATORY_COLUMN_KEYS.map((key) => ({
      key,
      label: `${COLUMN_LABELS[key]} *`,
    }));
    
    const optional = REQUIRED_COLUMN_KEYS.filter(
      (key) => !MANDATORY_COLUMN_KEYS.includes(key)
    ).map((key) => ({
      key,
      label: COLUMN_LABELS[key],
    }));
    
    return [...mandatory, ...optional];
  }, []);

  return (
    <SectionTile title="3. Association des colonnes">
      <p className={styles.helperText}>
        Les champs marqués d'un astérisque (*) sont obligatoires.
      </p>
      <ColumnMapper<RequiredColumnKey>
        fields={fields}
        sheetColumns={sheetColumns}
        columnMapping={columnMapping}
        columnSamples={columnSamples}
        onColumnMappingChange={onColumnMappingChange}
      />
    </SectionTile>
  );
}
