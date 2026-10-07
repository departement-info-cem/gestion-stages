'use client';

import { SectionTile } from '@/app/components/section-tile/SectionTile';
import { StatusMessage } from '../../types';
import styles from './GenerationSection.module.css';

interface GenerationSectionProps {
  onGenerate: () => void;
  isGenerating: boolean;
  statuses: StatusMessage[];
  canGenerate: boolean;
}

export function GenerationSection({
  onGenerate,
  isGenerating,
  statuses,
  canGenerate,
}: GenerationSectionProps) {
  return (
    <SectionTile title="Générer les rapports">
      <div className={styles.container}>
        <button
          className={styles.generateButton}
          onClick={onGenerate}
          disabled={!canGenerate || isGenerating}
        >
          {isGenerating ? 'Génération en cours...' : 'Générer les rapports'}
        </button>

        {statuses.length > 0 && (
          <div className={styles.statusContainer}>
            {statuses.map((status) => (
              <div key={status.id} className={`${styles.statusMessage} ${styles[status.type]}`}>
                <span className={styles.icon}>
                  {status.type === 'success' && '✓'}
                  {status.type === 'error' && '✕'}
                  {status.type === 'warning' && '⚠'}
                  {status.type === 'info' && 'ℹ'}
                </span>
                <span className={styles.text}>{status.message}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </SectionTile>
  );
}
