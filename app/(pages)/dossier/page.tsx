"use client";

import { useState } from "react";
import styles from "./page.module.css";
import { useDossierGenerator } from "./useDossierGenerator";
import { ToolNavigation } from "../../components/navbar/Navbar";
import { buildToolNavigationItems } from "../../components/navbar/navigation";
import { ProgramSelector } from "./program-selector/ProgramSelector";
import { ExcelImportSection } from "./excel-import/ExcelImportSection";
import { ColumnMappingSection } from "./column-mapping/ColumnMappingSection";
import { GenerationSection } from "./generation/GenerationSection";
import { ColumnPreviewModal } from "./column-preview-modal/ColumnPreviewModal";

export default function DossierPage() {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const {
    program,
    setProgram,
    sheetNames,
    selectedSheet,
    sheetColumns,
    columnMapping,
    columnSamples,
    statusMessages,
    isGenerating,
    sourceFileName,
    readyToGenerate,
    handleFilePick,
    handleSheetChange,
    handleColumnMappingChange,
    generate,
  } = useDossierGenerator();

  const navigationItems = buildToolNavigationItems("dossier");

  return (
    <div className={styles.wrapper}>
      <ToolNavigation
        ariaLabel="Navigation des outils"
        className={styles.toolNavigation}
        items={navigationItems}
      />

      <div className={styles.grid}>
        <ProgramSelector
          selectedProgram={program}
          onProgramChange={setProgram}
        />

        {program && (
          <ExcelImportSection
            sourceFileName={sourceFileName}
            sheetNames={sheetNames}
            selectedSheet={selectedSheet}
            onFilePick={handleFilePick}
            onSheetChange={handleSheetChange}
          />
        )}
      </div>

      {sheetColumns.length > 0 && (
        <ColumnMappingSection
          sheetColumns={sheetColumns}
          columnMapping={columnMapping}
          columnSamples={columnSamples}
          onColumnMappingChange={handleColumnMappingChange}
          onPreviewClick={() => setIsPreviewOpen(true)}
        />
      )}

      {readyToGenerate && (
        <GenerationSection
          isGenerating={isGenerating}
          statusMessages={statusMessages}
          onGenerate={generate}
        />
      )}

      <ColumnPreviewModal
        isOpen={isPreviewOpen}
        columnSamples={columnSamples}
        onClose={() => setIsPreviewOpen(false)}
      />
    </div>
  );
}
