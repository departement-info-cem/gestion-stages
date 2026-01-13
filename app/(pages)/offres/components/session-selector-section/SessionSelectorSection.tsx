import { SectionTile } from '@/app/components/section-tile/SectionTile';
import styles from './SessionSelectorSection.module.css';

export interface SessionSelectorSectionProps {
  session: string;
  onSessionChange: (session: string) => void;
}

export function SessionSelectorSection({
  session,
  onSessionChange,
}: SessionSelectorSectionProps) {
  return (
    <SectionTile title="1. Session">
      <div className={styles.content}>
        <label htmlFor="session-input" className={styles.label}>
          Code de session (ex: H25, A25)
        </label>
        <input
          id="session-input"
          type="text"
          value={session}
          onChange={(e) => onSessionChange(e.target.value)}
          placeholder="H25"
          className={styles.input}
          maxLength={3}
        />
        <p className={styles.hint}>
          Ce code sera utilisé dans les identifiants des offres
        </p>
      </div>
    </SectionTile>
  );
}
