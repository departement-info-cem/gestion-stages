import { ColumnMapper, ColumnMapperField } from '@/app/components/column-mapper/ColumnMapper';
import { ColumnMapping, ColumnSamples } from '../types';

interface ColumnMappingSectionProps {
  stepNumber: string;
  title: string;
  fields: readonly ColumnMapperField[];
  sheetColumns: string[];
  columnMapping: ColumnMapping;
  columnSamples: ColumnSamples;
  onColumnMappingChange: (fieldKey: string, columnName: string) => void;
  onPreviewClick: () => void;
}

export function ColumnMappingSection({
  stepNumber,
  title,
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
    <ColumnMapper
      title={`${stepNumber}. ${title}`}
      fields={fields}
      sheetColumns={sheetColumns}
      columnMapping={columnMapping}
      columnSamples={columnSamplesArray}
      onColumnMappingChange={onColumnMappingChange}
      onPreviewClick={onPreviewClick}
    />
  );
}
