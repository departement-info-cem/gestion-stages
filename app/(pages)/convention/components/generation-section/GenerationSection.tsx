import { StatusMessage } from '../../types';
import sharedStyles from '../shared.module.css';
import styles from './GenerationSection.module.css';
import { SectionTile } from '@/app/components/section-tile/SectionTile';

interface GenerationSectionProps {
  isGenerating: boolean;
  statusMessages: StatusMessage[];
  onGenerate: () => void;
}

export function GenerationSection({
  isGenerating,
  statusMessages,
  onGenerate,
}: GenerationSectionProps) {
  return (
    <SectionTile title="8. Génération des conventions">
      <button
        type="button"
        onClick={onGenerate}
        disabled={isGenerating}
        className={styles.generateButton}
      >
        {isGenerating ? 'Génération en cours...' : 'Générer les conventions'}
      </button>

      <div className={styles.infoBox}>
        <p>
          💡 Après la génération, vous pouvez convertir les documents Word en PDF à l'aide de{' '}
          <a
            href="https://acrobat.adobe.com/link/acrobat/word-to-pdf"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            l'outil d'Adobe
          </a>
        </p>
      </div>

      {statusMessages.length > 0 && (
        <div className={styles.statusContainer}>
          <h3 className={styles.statusTitle}>Messages de statut</h3>
          <div className={styles.messagesList}>
            {statusMessages.map((msg) => (
              <div
                key={msg.id}
                className={`${styles.message} ${styles[msg.type]}`}
              >
                <span className={styles.messageType}>
                  {msg.type === 'success' && '✓'}
                  {msg.type === 'error' && '✗'}
                  {msg.type === 'warning' && '⚠'}
                </span>
                <span className={styles.messageText}>{msg.message}</span>
                <span className={styles.messageTime}>
                  {msg.timestamp.toLocaleTimeString('fr-CA', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </SectionTile>
  );
}
