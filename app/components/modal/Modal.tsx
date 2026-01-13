import { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import styles from './Modal.module.css';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  const modalContent = (
    <div
      className={styles.modalOverlay}
      role="presentation"
      onClick={onClose}
    >
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <h2 id="modal-title" className={styles.modalTitle}>
            {title}
          </h2>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Fermer"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
