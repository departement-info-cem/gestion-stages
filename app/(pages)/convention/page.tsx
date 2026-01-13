'use client';

import { type ChangeEvent } from 'react';
import { ProgramSelectorSection } from './program-selector-section/ProgramSelectorSection';
import { ImportOrganizationInfosSection } from './import-organization-infos-section/ImportOrganizationInfosSection';
import { MappingOrganizationInfosSection } from './mapping-organization-infos-section/MappingOrganizationInfosSection';
import { DateDefaultsSection } from './date-defaults/DateDefaultsSection';
import { ImportStudentInfosSection } from './import-student-infos-section/ImportStudentInfosSection';
import { MappingStudentInfosSection } from './mapping-student-infos-section/MappingStudentInfosSection';
import { SignatureSection } from './signature-section/SignatureSection';
import { GenerationSection } from './generation-section/GenerationSection';
import { useConventionGenerator } from './useConventionGenerator';
import { MAIN_FILE_FIELDS } from './constants';
import styles from './page.module.css';

export default function ConventionPage() {

  const {
    selectedProgram,
    mainFile,
    mainSheetNames,
    selectedMainSheet,
    mainSheetColumns,
    mainColumnMapping,
    mainColumnSamples,
    additionalFile,
    additionalSheetNames,
    selectedAdditionalSheet,
    additionalSheetColumns,
    additionalColumnMapping,
    additionalColumnSamples,
    signatureDirecteur,
    signatureCoordonnateur,
    defaultStartDate,
    defaultEndDate,
    statusMessages,
    isGenerating,
    handleProgramSelect,
    handleMainFileUpload,
    handleMainSheetSelect,
    handleMainColumnMappingChange,
    handleAdditionalFileUpload,
    handleAdditionalSheetSelect,
    handleAdditionalColumnMappingChange,
    handleSignatureUpload,
    handleDefaultStartDateChange,
    handleDefaultEndDateChange,
    handleGenerate,
  } = useConventionGenerator();

  const handleMainFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await handleMainFileUpload(file);
    }
  };

  const handleMainSheetChange = (event: ChangeEvent<HTMLSelectElement>) => {
    handleMainSheetSelect(event.target.value);
  };

  const handleAdditionalFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await handleAdditionalFileUpload(file);
    }
  };

  const handleAdditionalSheetChange = (event: ChangeEvent<HTMLSelectElement>) => {
    handleAdditionalSheetSelect(event.target.value);
  };

  // Vérifier si les colonnes principales sont mappées
  const mainColumnsReady = mainSheetColumns.length > 0;

  // Vérifier si toutes les colonnes principales requises sont mappées
  const allMainColumnsMapped = MAIN_FILE_FIELDS.every(
    field => mainColumnMapping[field.key]
  );

  return (
    <div className={styles.container}>

      <div className={styles.grid}>
        {/* Étape 1 - Sélection du programme */}
        <ProgramSelectorSection
          selectedProgram={selectedProgram}
          onProgramSelect={handleProgramSelect}
        />

        {/* Étape 2 - Fichier Excel principal + Sélection onglet */}
        {selectedProgram && (
          <ImportOrganizationInfosSection
            fileName={mainFile?.name}
            sheetNames={mainSheetNames}
            selectedSheet={selectedMainSheet}
            onFileUpload={handleMainFileChange}
            onSheetChange={handleMainSheetChange}
          />
        )}
      </div>

      {/* Étape 3 - Association des colonnes principales (pleine largeur) */}
      {mainColumnsReady && (
        <MappingOrganizationInfosSection
          fields={MAIN_FILE_FIELDS}
          sheetColumns={mainSheetColumns}
          columnMapping={mainColumnMapping}
          columnSamples={mainColumnSamples}
          onColumnMappingChange={handleMainColumnMappingChange}
        />
      )}

      {/* Étape 4 et 5 - Dates par défaut et Fichier additionnel côte à côte */}
      {allMainColumnsMapped && (
        <div className={styles.grid}>
          {/* Étape 4 - Dates par défaut */}
          <DateDefaultsSection
            defaultStartDate={defaultStartDate}
            defaultEndDate={defaultEndDate}
            onStartDateChange={handleDefaultStartDateChange}
            onEndDateChange={handleDefaultEndDateChange}
          />

          {/* Étape 5 - Fichier Excel additionnel */}
          <ImportStudentInfosSection
            fileName={additionalFile?.name}
            sheetNames={additionalSheetNames}
            selectedSheet={selectedAdditionalSheet}
            onFileUpload={handleAdditionalFileChange}
            onSheetChange={handleAdditionalSheetChange}
          />
        </div>
      )}

      {/* Étape 6 - Association des colonnes additionnelles */}
      {allMainColumnsMapped && additionalFile && additionalSheetColumns.length > 0 && (
        <MappingStudentInfosSection
          sheetColumns={additionalSheetColumns}
          columnMapping={additionalColumnMapping}
          columnSamples={additionalColumnSamples}
          onColumnMappingChange={handleAdditionalColumnMappingChange}
        />
      )}

      {/* Étape 7 et 8 - Seulement si un fichier additionnel a été sélectionné */}
      {allMainColumnsMapped && additionalFile && (
        <div className={styles.grid}>
          {/* Étape 7 - Signatures */}
          <SignatureSection
            directeur={signatureDirecteur}
            coordonnateur={signatureCoordonnateur}
            onSignatureUpload={handleSignatureUpload}
          />

          {/* Étape 8 - Génération */}
          <GenerationSection
            isGenerating={isGenerating}
            statusMessages={statusMessages}
            onGenerate={handleGenerate}
          />
        </div>
      )}
    </div>
  );
}
