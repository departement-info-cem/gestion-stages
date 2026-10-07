'use client';

import { useEffect } from 'react';
import { DataImportSection } from './components/data-import-section/DataImportSection';
import { ColumnMappingSection } from './components/column-mapping-section/ColumnMappingSection';
import { DateFilterSection } from './components/date-filter-section/DateFilterSection';
import { ProgramSelectorSection } from './components/program-selector-section/ProgramSelectorSection';
import { GenerationSection } from './components/generation-section/GenerationSection';
import { useRapportGenerator } from './hooks/useRapportGenerator';
import { isValidColumnMapping } from './utils/validation';
import styles from './page.module.css';

const STORAGE_KEY = 'rapport-page-state';

export default function RapportPage() {
  const generator = useRapportGenerator();

  // Navigation tracking
  useEffect(() => {
    const trackNavigation = () => {
      sessionStorage.setItem(STORAGE_KEY, 'rapport');
    };
    trackNavigation();
  }, []);

  const canGenerate =
    generator.excelBuffer &&
    isValidColumnMapping(generator.columnMapping) &&
    generator.selectedSheet &&
    !generator.isLoading &&
    !generator.isGenerating;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Générateur de Rapports de Stage</h1>
        <p className={styles.subtitle}>
          Générez des rapports Word personnalisés à partir d'un fichier Excel contenant les réponses des
          étudiants.
        </p>
      </div>

      <div className={styles.grid}>
        {/* Section 1: Import données */}
        <DataImportSection
          onFileUpload={generator.handleFileUpload}
          sheetNames={generator.sheetNames}
          selectedSheet={generator.selectedSheet}
          onSheetSelect={generator.handleSheetSelect}
          isLoading={generator.isLoading}
        />

        {/* Section 2: Mapper colonnes */}
        {generator.sheetColumns.length > 0 && (
          <ColumnMappingSection
            sheetColumns={generator.sheetColumns}
            columnMapping={generator.columnMapping}
            columnSamples={generator.columnSamples}
            onColumnMappingChange={generator.handleColumnMappingChange}
          />
        )}

        {/* Section 3: Filtrer programme */}
        {generator.excelBuffer && (
          <ProgramSelectorSection
            filterProgram={generator.filterProgram}
            onFilterProgramChange={generator.handleFilterProgramChange}
          />
        )}

        {/* Section 4: Filtrer dates */}
        {generator.excelBuffer && (
          <DateFilterSection
            dateRange={generator.dateRange}
            onDateRangeChange={generator.handleDateRangeChange}
          />
        )}

        {/* Section 5: Générer */}
        <GenerationSection
          onGenerate={generator.handleGenerate}
          isGenerating={generator.isGenerating}
          statuses={generator.statuses}
          canGenerate={!!canGenerate}
        />
      </div>
    </div>
  );
}
