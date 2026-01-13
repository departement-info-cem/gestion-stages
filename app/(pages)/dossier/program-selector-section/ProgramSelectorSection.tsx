import { PROGRAM_OPTIONS } from "../constants";
import { ProgramId } from "../types";
import styles from "./ProgramSelectorSection.module.css";
import { SectionTile } from "@/app/components/section-tile/SectionTile";


interface ProgramSelectorSectionProps {
  selectedProgram: ProgramId | null;
  onProgramChange: (programId: ProgramId) => void;
}

export function ProgramSelectorSection({
  selectedProgram,
  onProgramChange,
}: ProgramSelectorSectionProps) {

  return (
    <SectionTile title="1. Choisissez le programme">
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
    </SectionTile>
  );
}
