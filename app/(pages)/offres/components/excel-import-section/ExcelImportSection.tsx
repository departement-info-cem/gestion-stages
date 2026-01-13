import { SectionTile } from '@/app/components/section-tile/SectionTile';
import { FilePicker } from '@/app/components/file-picker/FilePicker';

export interface ExcelImportSectionProps {
  fileName?: string;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ExcelImportSection({
  fileName,
  onFileUpload,
}: ExcelImportSectionProps) {
  return (
    <SectionTile title="2. Fichier Excel">
      <FilePicker
        acceptedFileTypes=".xlsx,.xls,.csv"
        placeholderText="Sélectionner le fichier d'offres"
        selectedFileName={fileName}
        onFileChange={onFileUpload}
      />
    </SectionTile>
  );
}
