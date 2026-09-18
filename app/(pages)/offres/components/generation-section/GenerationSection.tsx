import { SectionTile } from '@/app/components/section-tile/SectionTile';
import { StatusMessageList } from '@/app/components/status-messages/StatusMessageList';
import type { StatusMessage } from '@/app/components/status-messages/types';
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

        <StatusMessageList messages={statusMessages} />
      </div>
    </SectionTile>
  );
}
