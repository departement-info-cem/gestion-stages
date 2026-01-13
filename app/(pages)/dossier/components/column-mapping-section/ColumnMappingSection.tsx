import type { ColumnKey, ColumnMapping, ColumnSample } from "../../types";
import { COLUMN_LABELS, REQUIRED_KEYS } from "../../constants";
import { ColumnMapper, type ColumnMapperField } from "../../../../components/column-mapper/ColumnMapper";
import { SectionTile } from "@/app/components/section-tile/SectionTile";
import { ColumnPreviewModal } from "../../modals/column-preview-modal/ColumnPreviewModal";
import { useState } from "react";

interface ColumnMappingSectionProps {
  sheetColumns: string[];
  columnMapping: ColumnMapping;
  columnSamples: ColumnSample[];
  onColumnMappingChange: (key: ColumnKey, value: string) => void;
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
}: ColumnMappingSectionProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <SectionTile
      title="3. Associez les colonnes"
      onPreviewClick={() => setIsPreviewOpen(true)}
      previewDisabled={columnSamples.length === 0}>

      <ColumnMapper
        fields={FIELDS}
        sheetColumns={sheetColumns}
        columnMapping={columnMapping}
        columnSamples={columnSamples}
        onColumnMappingChange={onColumnMappingChange}
      />
      <ColumnPreviewModal
        isOpen={isPreviewOpen}
        columnSamples={columnSamples}
        onClose={() => setIsPreviewOpen(false)}
      />
    </SectionTile>
  );
}

