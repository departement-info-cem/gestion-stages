'use client';

import { SectionTile } from '@/app/components/section-tile/SectionTile';
import styles from './ProgramSelectorSection.module.css';

interface ProgramSelectorSectionProps {
  filterProgram: string;
  onFilterProgramChange: (program: string) => void;
}

export function ProgramSelectorSection({
  filterProgram,
  onFilterProgramChange,
}: ProgramSelectorSectionProps) {
  return (
    <SectionTile title="Filtrer par programme (optionnel)">
      <div className={styles.container}>
        <p className={styles.description}>
          Laissez vide pour inclure tous les programmes.
        </p>

        <div className={styles.formGroup}>
          <label htmlFor="program-filter" className={styles.label}>
            Nom du programme :
          </label>
          <input
            id="program-filter"
            type="text"
            value={filterProgram}
            onChange={(e) => onFilterProgramChange(e.target.value)}
            placeholder="Ex: DEC Techniques en informatique"
            className={styles.input}
          />
        </div>
      </div>
    </SectionTile>
  );
}
