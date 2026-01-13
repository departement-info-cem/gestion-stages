import { SectionTile } from '@/app/components/section-tile/SectionTile';
import styles from './SessionSelectorSection.module.css';

export interface SessionSelectorSectionProps {
  session: string;
  onSessionChange: (session: string) => void;
}

function getDefaultSession(): string {
  const now = new Date();
  const month = now.getMonth() + 1; // 0-indexed
  const year = now.getFullYear();
  
  // Si on est en mai ou après (>= 5), la session d'hiver est l'année suivante
  // Si on est avant mai (< 5), la session d'hiver est l'année actuelle
  const winterYear = month >= 5 ? year + 1 : year;
  const shortYear = String(winterYear).slice(-2);
  
  return `H${shortYear}`;
}

export function SessionSelectorSection({
  session,
  onSessionChange,
}: SessionSelectorSectionProps) {
  const defaultSession = getDefaultSession();
  const currentYear = new Date().getFullYear();
  const shortCurrentYear = String(currentYear).slice(-2);
  const month = new Date().getMonth() + 1;
  
  // Exemple hiver: année précédente si avant mai, sinon année courante
  const winterExampleYear = month < 5 ? String(currentYear - 1).slice(-2) : shortCurrentYear;
  
  return (
    <SectionTile title="1. Session">
      <div className={styles.content}>
        <label htmlFor="session-input" className={styles.label}>
          Code de session (ex: H{winterExampleYear}, A{shortCurrentYear})
        </label>
        <input
          id="session-input"
          type="text"
          value={session}
          onChange={(e) => onSessionChange(e.target.value)}
          placeholder={defaultSession}
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
