import { PROGRAMS } from '../constants';
import { ProgramConfig } from '../types';
import sharedStyles from '../shared.module.css';
import styles from './ProgramSelector.module.css';

interface ProgramSelectorProps {
  selectedProgram: string;
  onProgramSelect: (programKey: string, config: ProgramConfig) => void;
}

export function ProgramSelector({
  selectedProgram,
  onProgramSelect,
}: ProgramSelectorProps) {
  const programEntries = Object.entries(PROGRAMS);

  return (
    <section className={sharedStyles.section}>
      <h2 className={sharedStyles.sectionTitle}>1. Choisissez le programme</h2>
      <div className={styles.radioGroup}>
        {programEntries.map(([key, config]) => (
          <label key={key} className={styles.radioOption}>
            <input
              type="radio"
              name="program"
              value={key}
              checked={selectedProgram === key}
              onChange={() => onProgramSelect(key, config)}
            />
            <div className={styles.radioContent}>
              <span className={styles.radioLabel}>{config.name}</span>
            </div>
          </label>
        ))}
      </div>
    </section>
  );
}
