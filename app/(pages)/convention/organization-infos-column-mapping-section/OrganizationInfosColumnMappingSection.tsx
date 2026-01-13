import { ColumnMapper, ColumnMapperField } from '@/app/components/column-mapper/ColumnMapper';
import { ColumnMapping, ColumnSamples } from '../types';
import { SectionTile } from '@/app/components/section-tile/SectionTile';

interface OrganizationInfosColumnMappingSectionProps {
  fields: readonly ColumnMapperField[];
  sheetColumns: string[];
  columnMapping: ColumnMapping;
  columnSamples: ColumnSamples;
  onColumnMappingChange: (fieldKey: string, columnName: string) => void;
  onPreviewClick: () => void;
}

export function OrganizationInfosColumnMappingSection({
  fields,
  sheetColumns,
  columnMapping,
  columnSamples,
  onColumnMappingChange,
  onPreviewClick,
}: OrganizationInfosColumnMappingSectionProps) {
  // Convertir le format de columnSamples pour le ColumnMapper
  const columnSamplesArray = Object.entries(columnMapping)
    .filter(([_, excelColumn]) => excelColumn)
    .map(([fieldKey, excelColumn]) => ({
      header: excelColumn,
      values: (columnSamples[fieldKey] || []).map(String),
    }));

  return (
    <SectionTile title="3. Mapping des informations des entreprises" onPreviewClick={onPreviewClick} previewDisabled={columnSamplesArray.length === 0}>
      <ColumnMapper
        fields={fields}
        sheetColumns={sheetColumns}
        columnMapping={columnMapping}
        columnSamples={columnSamplesArray}
        onColumnMappingChange={onColumnMappingChange}
      />
    </SectionTile>
  );
}
