import type { ChangeEvent } from 'react';
import { FilePicker } from '@/app/components/file-picker/FilePicker';
import sharedStyles from '../shared.module.css';
import styles from './AdditionalExcelConfig.module.css';

interface AdditionalExcelConfigProps {
  fileName?: string;
  sheetNames: string[];
  selectedSheet: string;
  onFileUpload: (event: ChangeEvent<HTMLInputElement>) => void;
  onSheetChange: (event: ChangeEvent<HTMLSelectElement>) => void;
}

export function AdditionalExcelConfig({
  fileName,
  sheetNames,
  selectedSheet,
  onFileUpload,
  onSheetChange,
}: AdditionalExcelConfigProps) {
  return (
    <section className={sharedStyles.section}>
      <h2 className={sharedStyles.sectionTitle}>5. Fichier Excel additionnel</h2>
      <p className={styles.description}>
        Fichier contenant les superviseurs académiques et profils des étudiants
      </p>

      <FilePicker
        acceptedFileTypes=".xlsx,.xls"
        placeholderText="Déposez un fichier ou cliquez pour sélectionner un .xlsx"
        selectedFileName={fileName}
        onFileChange={onFileUpload}
      />

      {sheetNames.length > 0 && (
        <>
          <h4 className={styles.sheetSelectLabel}>
            Sélectionnez l&apos;onglet du fichier Excel
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
    </section>
  );
}
