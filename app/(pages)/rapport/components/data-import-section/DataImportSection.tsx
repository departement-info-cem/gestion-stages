'use client';

import { FilePicker } from '@/app/components/file-picker/FilePicker';
import { SectionTile } from '@/app/components/section-tile/SectionTile';
import styles from './DataImportSection.module.css';

interface DataImportSectionProps {
  onFileUpload: (file: File) => void;
  sheetNames: string[];
  selectedSheet: string;
  onSheetSelect: (sheetName: string) => void;
  isLoading: boolean;
}

export function DataImportSection({
  onFileUpload,
  sheetNames,
  selectedSheet,
  onSheetSelect,
  isLoading,
}: DataImportSectionProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <SectionTile title="Importer les données">
      <div className={styles.container}>
        <div className={styles.filePicker}>
          <FilePicker
            acceptedFileTypes=".xlsx,.xls"
            onFileChange={handleFileChange}
            placeholderText="Sélectionner un fichier Excel (.xlsx)"
          />
        </div>

        {sheetNames.length > 0 && (
          <div className={styles.sheetSelector}>
            <label htmlFor="sheet-select" className={styles.label}>
              Sélectionner la feuille :
            </label>
            <select
              id="sheet-select"
              value={selectedSheet}
              onChange={(e) => onSheetSelect(e.target.value)}
              className={styles.select}
              disabled={isLoading}
            >
              {sheetNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </SectionTile>
  );
}
