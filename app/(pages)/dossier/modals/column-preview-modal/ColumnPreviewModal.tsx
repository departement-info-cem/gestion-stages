import { Modal } from '@/app/components/modal/Modal';
import type { ColumnSample } from '../../types';
import styles from './ColumnPreviewModal.module.css';

interface ColumnPreviewModalProps {
    isOpen: boolean;
    columnSamples: ColumnSample[];
    onClose: () => void;
}

export function ColumnPreviewModal({
    isOpen,
    columnSamples,
    onClose,
}: ColumnPreviewModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Aperçu des colonnes">
            {columnSamples.length > 0 ? (
                <div className={styles.modalGrid}>
                    {columnSamples.map((sample, sampleIndex) => (
                        <div
                            key={`${sample.header || 'colonne'}-${sampleIndex}`}
                            className={styles.modalColumn}
                        >
                            <h3 className={styles.modalColumnTitle}>
                                {sample.header || 'Colonne sans nom'}
                            </h3>
                            <div className={styles.modalValueList}>
                                <ol className={styles.modalValueListInner}>
                                    {sample.values.map((value, index) => (
                                        <li
                                            key={`${sample.header || 'colonne'}-${sampleIndex}-${index}`}
                                            className={styles.modalValueItem}
                                        >
                                            <span className={styles.modalValueIndex}>
                                                {index + 1}
                                            </span>
                                            {value ? (
                                                <span className={styles.modalValueText}>{value}</span>
                                            ) : (
                                                <span className={styles.modalValuePlaceholder}>
                                                    —
                                                </span>
                                            )}
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className={styles.modalEmpty}>
                    Aucune donnée disponible pour cet onglet.
                </p>
            )}
        </Modal>
    );
}
