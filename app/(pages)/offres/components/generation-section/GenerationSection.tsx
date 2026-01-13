import { SectionTile } from '@/app/components/section-tile/SectionTile';
import type { StatusMessage } from '../../hooks/useStatusMessages';
import styles from './GenerationSection.module.css';

export interface GenerationSectionProps {
  isGenerating: boolean;
  statusMessages: StatusMessage[];
  onGenerate: () => void;
  readyToGenerate: boolean;
}

export function GenerationSection({
  isGenerating,
  statusMessages,
  onGenerate,
  readyToGenerate,
}: GenerationSectionProps) {
  return (
    <SectionTile title="5. Générer les pages HTML">
      <div className={styles.content}>
        <p className={styles.description}>
          Les fichiers HTML seront générés pour chaque profil et téléchargés
          automatiquement.
        </p>

        <button
          type="button"
          onClick={onGenerate}
          disabled={!readyToGenerate || isGenerating}
          className={styles.button}
        >
          {isGenerating ? 'Génération en cours...' : 'Générer les pages HTML'}
        </button>

        {statusMessages.length > 0 && (
          <div className={styles.messages}>
            {statusMessages.map((msg) => (
              <div
                key={msg.id}
                className={`${styles.message} ${styles[msg.type]}`}
              >
                {msg.text}
              </div>
            ))}
          </div>
        )}
      </div>
    </SectionTile>
  );
}
