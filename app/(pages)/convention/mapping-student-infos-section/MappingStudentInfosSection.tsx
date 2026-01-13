import { ColumnMapping, ColumnSamples } from '../types';
import { ADDITIONAL_FILE_FIELDS } from '../constants';
import { ColumnMapper } from '@/app/components/column-mapper/ColumnMapper';
import { SectionTile } from '@/app/components/section-tile/SectionTile';
import { ColumnPreviewModal } from '../column-preview-modal/ColumnPreviewModal';
import { useState } from 'react';

interface MappingStudentInfosSectionProps {
  sheetColumns: string[];
  columnMapping: ColumnMapping;
  columnSamples: ColumnSamples;
  onColumnMappingChange: (fieldKey: string, columnName: string) => void;
}

export function MappingStudentInfosSection({
  sheetColumns,
  columnMapping,
  columnSamples,
  onColumnMappingChange
}: MappingStudentInfosSectionProps) {

  const [isPreviewAdditionalOpen, setIsPreviewAdditionalOpen] = useState(false);

  // Convertir le format de columnSamples pour le ColumnMapper
  const columnSamplesArray = Object.entries(columnMapping)
    .filter(([_, excelColumn]) => excelColumn)
    .map(([fieldKey, excelColumn]) => ({
      header: excelColumn,
      values: (columnSamples[fieldKey] || []).map(String),
    }));

  // Convertir les échantillons pour la modal additionnelle
  const additionalColumnSamplesForModal = Object.entries(columnMapping)
    .filter(([_, excelColumn]) => excelColumn)
    .map(([fieldKey, excelColumn]) => ({
      header: excelColumn,
      values: (columnSamples[fieldKey] || []).map(String),
    }));


  return (
    <SectionTile
      title="6. Mapping des informations des étudiants"
      onPreviewClick={() => setIsPreviewAdditionalOpen(true)}
      previewDisabled={columnSamplesArray.length === 0}>
      <ColumnMapper
        fields={ADDITIONAL_FILE_FIELDS}
        sheetColumns={sheetColumns}
        columnMapping={columnMapping}
        columnSamples={columnSamplesArray}
        onColumnMappingChange={onColumnMappingChange}
      />
      <ColumnPreviewModal
        isOpen={isPreviewAdditionalOpen}
        columnSamples={additionalColumnSamplesForModal}
        onClose={() => setIsPreviewAdditionalOpen(false)}
      />
    </SectionTile>
  );
}
