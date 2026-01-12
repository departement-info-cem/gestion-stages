import type { ChangeEvent } from 'react';
import { FilePicker } from '@/app/components/file-picker/FilePicker';
import sharedStyles from '../shared.module.css';
import styles from './ImportOrganizationInfosSection.module.css';

interface ImportOrganizationInfosSectionProps {
  fileName?: string;
  sheetNames: string[];
  selectedSheet: string;
  onFileUpload: (event: ChangeEvent<HTMLInputElement>) => void;
  onSheetChange: (event: ChangeEvent<HTMLSelectElement>) => void;
}

export function ImportOrganizationInfosSection({
  fileName,
  sheetNames,
  selectedSheet,
  onFileUpload,
  onSheetChange,
}: ImportOrganizationInfosSectionProps) {
  return (
    <section className={sharedStyles.section}>
      <h2 className={sharedStyles.sectionTitle}>
        2. Fichier de réponse des entreprises
      </h2>

      <FilePicker
        acceptedFileTypes=".xlsx,.xls"
        placeholderText="Déposez un fichier Excel ou cliquez pour sélectionner un .xlsx"
        selectedFileName={fileName}
        onFileChange={onFileUpload}
      />

      {sheetNames.length > 0 && (
        <>
          <h4 className={styles.sheetSelectLabel}>
            Sélectionnez l&apos;onglet du fichier Excel à traiter
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
