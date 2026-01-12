import { PROGRAM_OPTIONS } from "../constants";
import { ProgramId } from "../types";
import sharedStyles from "../shared.module.css";
import styles from "./ProgramSelector.module.css";


interface ProgramSelectorProps {
  selectedProgram: ProgramId | null;
  onProgramChange: (programId: ProgramId) => void;
}

export function ProgramSelector({
  selectedProgram,
  onProgramChange,
}: ProgramSelectorProps) {
  return (
    <section id="programme" className={sharedStyles.section}>
      <h2 className={sharedStyles.sectionTitle}>1. Choisissez le programme</h2>
      <div className={styles.radioGroup}>
        {PROGRAM_OPTIONS.map((option) => (
          <label key={option.id} className={styles.radioOption}>
            <input
              type="radio"
              name="program"
              value={option.id}
              checked={selectedProgram === option.id}
              onChange={() => onProgramChange(option.id)}
            />
            <div className={styles.radioContent}>
              <span className={styles.radioLabel}>{option.label}</span>
            </div>
          </label>
        ))}
      </div>
    </section>
  );
}
