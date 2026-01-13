import { SectionTile } from '@/app/components/section-tile/SectionTile';
import { PROGRAM_PROFILES } from '../../constants';
import styles from './OffersPreviewSection.module.css';

export interface OfferStats {
  total: number;
  byProfile: Record<string, number>;
}

export interface OffersPreviewSectionProps {
  stats: OfferStats | null;
  onProcess: () => void;
  readyToProcess: boolean;
}

export function OffersPreviewSection({
  stats,
  onProcess,
  readyToProcess,
}: OffersPreviewSectionProps) {
  return (
    <SectionTile title="4. Traiter les offres">
      <div className={styles.content}>
        <p className={styles.description}>
          Les offres seront analysées et des identifiants seront assignés selon
          les profils ciblés.
        </p>

        {stats && (
          <div className={styles.stats}>
            <h3 className={styles.statsTitle}>Statistiques</h3>
            <div className={styles.statsList}>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Total d&apos;offres:</span>
                <span className={styles.statValue}>{stats.total}</span>
              </div>

              {PROGRAM_PROFILES.map((profile) => {
                const count = stats.byProfile[profile.id] || 0;
                if (count === 0) return null;

                return (
                  <div key={profile.id} className={styles.statItem}>
                    <span className={styles.statLabel}>{profile.name}:</span>
                    <span className={styles.statValue}>{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={onProcess}
          disabled={!readyToProcess}
          className={styles.button}
        >
          {stats ? 'Retraiter les offres' : 'Traiter les offres'}
        </button>
      </div>
    </SectionTile>
  );
}
