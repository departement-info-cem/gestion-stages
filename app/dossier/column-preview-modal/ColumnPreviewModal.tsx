import type { ColumnSample } from "../types";
import styles from "./ColumnPreviewModal.module.css";

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
    if (!isOpen) return null;

    return (
        <div
            className={styles.modalOverlay}
            role="presentation"
            onClick={onClose}
        >
            <div
                className={styles.modal}
                role="dialog"
                aria-modal="true"
                aria-labelledby="column-preview-title"
                onClick={(event) => event.stopPropagation()}
            >
                <div className={styles.modalHeader}>
                    <h2 id="column-preview-title" className={styles.modalTitle}>
                        Aperçu des colonnes
                    </h2>
                    <button
                        type="button"
                        className={styles.closeButton}
                        onClick={onClose}
                        aria-label="Fermer l'aperçu"
                    >
                        ×
                    </button>
                </div>
                {columnSamples.length > 0 ? (
                    <div className={styles.modalGrid}>
                        {columnSamples.map((sample, sampleIndex) => (
                            <div
                                key={`${sample.header || "colonne"}-${sampleIndex}`}
                                className={styles.modalColumn}
                            >
                                <h3 className={styles.modalColumnTitle}>
                                    {sample.header || "Colonne sans nom"}
                                </h3>
                                <div className={styles.modalValueList}>
                                    <ol className={styles.modalValueListInner}>
                                        {sample.values.map((value, index) => (
                                            <li
                                                key={`${sample.header || "colonne"}-${sampleIndex}-${index}`}
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
            </div>
        </div>
    );
}
