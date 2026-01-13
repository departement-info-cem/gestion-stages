import { ColumnMapper, ColumnMapperField } from '@/app/components/column-mapper/ColumnMapper';
import { ColumnMapping, ColumnSamples } from '../types';
import { SectionTile } from '@/app/components/section-tile/SectionTile';
import { ColumnPreviewModal } from '../column-preview-modal/ColumnPreviewModal';
import { useState } from 'react';

interface MappingOrganizationInfosSectionProps {
  fields: readonly ColumnMapperField[];
  sheetColumns: string[];
  columnMapping: ColumnMapping;
  columnSamples: ColumnSamples;
  onColumnMappingChange: (fieldKey: string, columnName: string) => void;
}

export function MappingOrganizationInfosSection({
  fields,
  sheetColumns,
  columnMapping,
  columnSamples,
  onColumnMappingChange
}: MappingOrganizationInfosSectionProps) {
  const [isPreviewMainOpen, setIsPreviewMainOpen] = useState(false);

  // Convertir les échantillons pour la modal principale
  const mainColumnSamplesForModal = Object.entries(columnMapping)
    .filter(([_, excelColumn]) => excelColumn)
    .map(([fieldKey, excelColumn]) => ({
      header: excelColumn,
      values: (columnSamples[fieldKey] || []).map(String),
    }));

  // Convertir le format de columnSamples pour le ColumnMapper
  const columnSamplesArray = Object.entries(columnMapping)
    .filter(([_, excelColumn]) => excelColumn)
    .map(([fieldKey, excelColumn]) => ({
      header: excelColumn,
      values: (columnSamples[fieldKey] || []).map(String),
    }));

  return (
    <SectionTile title="3. Mapping des informations des entreprises" onPreviewClick={() => setIsPreviewMainOpen(true)} previewDisabled={columnSamplesArray.length === 0}>
      <ColumnMapper
        fields={fields}
        sheetColumns={sheetColumns}
        columnMapping={columnMapping}
        columnSamples={columnSamplesArray}
        onColumnMappingChange={onColumnMappingChange}
      />
      <ColumnPreviewModal
        isOpen={isPreviewMainOpen}
        columnSamples={mainColumnSamplesForModal}
        onClose={() => setIsPreviewMainOpen(false)}
      />
    </SectionTile>
  );
}
