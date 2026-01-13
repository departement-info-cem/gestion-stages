"use client";

import styles from "./page.module.css";
import { useDossierGenerator } from "./useDossierGenerator";
import { ProgramSelectorSection } from "./program-selector-section/ProgramSelectorSection";
import { ExcelImportSection } from "./excel-import-section/ExcelImportSection";
import { ColumnMappingSection } from "./column-mapping-section/ColumnMappingSection";
import { GenerationSection } from "./generation-section/GenerationSection";

export default function DossierPage() {
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

  return (
    <div className={styles.container}>

      <div className={styles.grid}>
        <ProgramSelectorSection
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
        />
      )}

      {readyToGenerate && (
        <GenerationSection
          isGenerating={isGenerating}
          statusMessages={statusMessages}
          onGenerate={generate}
        />
      )}
    </div>
  );
}
