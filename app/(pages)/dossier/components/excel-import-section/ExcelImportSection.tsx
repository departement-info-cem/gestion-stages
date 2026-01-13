import type { ChangeEvent } from "react";
import sharedStyles from "../../../../shared.module.css";
import styles from "./ExcelImportSection.module.css";
import { FilePicker } from "../../../../components/file-picker/FilePicker";
import { SectionTile } from "@/app/components/section-tile/SectionTile";

interface ExcelImportSectionProps {
  sourceFileName?: string;
  sheetNames: string[];
  selectedSheet: string;
  onFilePick: (event: ChangeEvent<HTMLInputElement>) => void;
  onSheetChange: (event: ChangeEvent<HTMLSelectElement>) => void;
}

export function ExcelImportSection({
  sourceFileName,
  sheetNames,
  selectedSheet,
  onFilePick,
  onSheetChange,
}: ExcelImportSectionProps) {
  return (
    <SectionTile title="2. Importez la liste Excel">
      <FilePicker
        acceptedFileTypes=".xlsx,.xls"
        placeholderText="Déposez un fichier ou cliquez pour sélectionner un .xlsx"
        selectedFileName={sourceFileName}
        onFileChange={onFilePick}
      />
      {sheetNames.length > 0 && (
        <>
          <h4 className={styles.sheetSelectLabel}>
            Sélectionnez l'onglet du excel à traiter
          </h4>
          <select
            className={sharedStyles.select}
            value={selectedSheet}
            onChange={onSheetChange}
          >
            {sheetNames.map((sheetName) => (
              <option key={sheetName} value={sheetName}>
                {sheetName}
              </option>
            ))}
          </select>
        </>
      )}
    </SectionTile>
  );
}
