"use client";

import styles from "./page.module.css";
import { useDossierGenerator } from "./useDossierGenerator";
import { ProgramSelectorSection } from "./components/program-selector-section/ProgramSelectorSection";
import { ExcelImportSection } from "./components/excel-import-section/ExcelImportSection";
import { ColumnMappingSection } from "./components/column-mapping-section/ColumnMappingSection";
import { ReportLinkSection } from "./components/report-link-section/ReportLinkSection";
import { GenerationSection } from "./components/generation-section/GenerationSection";

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
    reportUrl,
    setReportUrl,
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

      {sheetColumns.length > 0 && (
        <ReportLinkSection
          reportUrl={reportUrl}
          onReportUrlChange={setReportUrl}
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
