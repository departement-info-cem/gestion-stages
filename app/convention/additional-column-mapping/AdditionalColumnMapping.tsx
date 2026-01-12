import { ColumnMappingSection } from '../column-mapping/ColumnMappingSection';
import { ColumnMapping, ColumnSamples } from '../types';
import { ADDITIONAL_FILE_FIELDS } from '../constants';

interface AdditionalColumnMappingProps {
  sheetColumns: string[];
  columnMapping: ColumnMapping;
  columnSamples: ColumnSamples;
  onColumnMappingChange: (fieldKey: string, columnName: string) => void;
  onPreviewClick: () => void;
}

export function AdditionalColumnMapping({
  sheetColumns,
  columnMapping,
  columnSamples,
  onColumnMappingChange,
  onPreviewClick,
}: AdditionalColumnMappingProps) {
  return (
    <ColumnMappingSection
      stepNumber="6"
      title="Association des colonnes (fichier additionnel)"
      fields={ADDITIONAL_FILE_FIELDS}
      sheetColumns={sheetColumns}
      columnMapping={columnMapping}
      columnSamples={columnSamples}
      onColumnMappingChange={onColumnMappingChange}
      onPreviewClick={onPreviewClick}
    />
  );
}
