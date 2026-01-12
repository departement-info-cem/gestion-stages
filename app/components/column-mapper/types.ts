export interface ColumnMapperField<T extends string = string> {
  key: T;
  label: string;
}

export interface ColumnSample {
  header: string;
  values: (string | number)[];
}

export interface ColumnMapperProps<T extends string = string> {
  title: string;
  fields: readonly ColumnMapperField<T>[];
  sheetColumns: string[];
  columnMapping: Record<T, string>;
  columnSamples: ColumnSample[];
  onColumnMappingChange: (key: T, value: string) => void;
  onPreviewClick?: () => void;
}
