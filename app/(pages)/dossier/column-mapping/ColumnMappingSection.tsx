import type { ColumnKey, ColumnMapping, ColumnSample } from "../types";
import { COLUMN_LABELS, REQUIRED_KEYS } from "../constants";
import { ColumnMapper, type ColumnMapperField } from "../../../components/column-mapper/ColumnMapper";
import { SectionTile } from "@/app/components/section-tile/SectionTile";

interface ColumnMappingSectionProps {
  sheetColumns: string[];
  columnMapping: ColumnMapping;
  columnSamples: ColumnSample[];
  onColumnMappingChange: (key: ColumnKey, value: string) => void;
  onPreviewClick: () => void;
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
  onPreviewClick,
}: ColumnMappingSectionProps) {
  return (
    <SectionTile title="3. Associez les colonnes" onPreviewClick={onPreviewClick} previewDisabled={columnSamples.length === 0}>
      <ColumnMapper
        fields={FIELDS}
        sheetColumns={sheetColumns}
        columnMapping={columnMapping}
        columnSamples={columnSamples}
        onColumnMappingChange={onColumnMappingChange}
      />
    </SectionTile>
  );
}

