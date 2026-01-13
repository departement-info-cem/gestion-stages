'use client';

import type { ChangeEvent } from 'react';
import { useOffreGenerator } from './useOffreGenerator';
import { SessionSelectorSection } from './components/session-selector-section/SessionSelectorSection';
import { ExcelImportSection } from './components/excel-import-section/ExcelImportSection';
import { ColumnMappingSection } from './components/column-mapping-section/ColumnMappingSection';
import { OffersPreviewSection } from './components/offers-preview-section/OffersPreviewSection';
import { GenerationSection } from './components/generation-section/GenerationSection';
import styles from './page.module.css';

export default function OffresPage() {
  const {
    session,
    file,
    sheetColumns,
    columnMapping,
    columnSamples,
    offerStats,
    statusMessages,
    isGenerating,
    columnsReady,
    allRequiredColumnsMapped,
    readyToProcess,
    readyToGenerate,
    setSession,
    handleFileUpload,
    handleColumnMappingChange,
    handleProcessOffers,
    handleGenerate,
  } = useOffreGenerator();

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      await handleFileUpload(uploadedFile);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        <SessionSelectorSection session={session} onSessionChange={setSession} />
        <ExcelImportSection fileName={file?.name} onFileUpload={handleFileChange} />
      </div>

      {columnsReady && (
        <ColumnMappingSection
          sheetColumns={sheetColumns}
          columnMapping={columnMapping}
          columnSamples={columnSamples}
          onColumnMappingChange={handleColumnMappingChange}
        />
      )}

      {allRequiredColumnsMapped && (
        <OffersPreviewSection
          stats={offerStats}
          onProcess={handleProcessOffers}
          readyToProcess={readyToProcess}
        />
      )}

      {readyToGenerate && (
        <GenerationSection
          isGenerating={isGenerating}
          statusMessages={statusMessages}
          onGenerate={handleGenerate}
          readyToGenerate={readyToGenerate}
        />
      )}
    </div>
  );
}
