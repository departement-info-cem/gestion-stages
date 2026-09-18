import type { ChangeEvent } from 'react';
import { SectionTile } from '@/app/components/section-tile/SectionTile';
import { FilePicker } from '@/app/components/file-picker/FilePicker';
import { ProgressIndicator } from '@/app/components/progress-indicator/ProgressIndicator';
import { StatusMessageList } from '@/app/components/status-messages/StatusMessageList';
import type { ProgressState } from '@/app/components/progress-indicator/types';
import type { StatusMessage } from '@/app/components/status-messages/types';
import styles from './ExcelImportSection.module.css';

export interface ExcelImportSectionProps {
  fileName?: string;
  progress: ProgressState | null;
  messages: StatusMessage[];
  onFileUpload: (event: ChangeEvent<HTMLInputElement>) => void;
}

export function ExcelImportSection({
  fileName,
  progress,
  messages,
  onFileUpload,
}: ExcelImportSectionProps) {
  return (
    <SectionTile title="2. Fichier Excel">
      <div className={styles.content}>
        <FilePicker
          acceptedFileTypes=".xlsx,.xls,.csv"
          placeholderText="Sélectionner le fichier d'offres"
          selectedFileName={fileName}
          onFileChange={onFileUpload}
        />

        {progress ? (
          <ProgressIndicator progress={progress} />
        ) : (
          <StatusMessageList messages={messages} />
        )}
      </div>
    </SectionTile>
  );
}
