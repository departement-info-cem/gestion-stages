import { useState, type ChangeEvent } from 'react';
import { SignatureData } from '../types';
import sharedStyles from '../shared.module.css';
import styles from './SignatureSection.module.css';

interface SignatureSectionProps {
  directeur: SignatureData;
  coordonnateur: SignatureData;
  onSignatureUpload: (
    type: 'directeur' | 'coordonnateur',
    file: File,
    signataireName: string
  ) => void;
}

export function SignatureSection({
  directeur,
  coordonnateur,
  onSignatureUpload,
}: SignatureSectionProps) {
  // États locaux pour les noms des signataires
  const [directeurName, setDirecteurName] = useState(directeur.signataireName || '');
  const [coordonnateurName, setCoordoNateurName] = useState(coordonnateur.signataireName || '');

  const handleFileChange = (
    type: 'directeur' | 'coordonnateur',
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const name = type === 'directeur' ? directeurName : coordonnateurName;
      onSignatureUpload(type, file, name);
    }
  };

  const handleNameChange = (
    type: 'directeur' | 'coordonnateur',
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const newName = event.target.value;
    if (type === 'directeur') {
      setDirecteurName(newName);
    } else {
      setCoordoNateurName(newName);
    }
  };

  const handleNameBlur = (
    type: 'directeur' | 'coordonnateur'
  ) => {
    const currentData = type === 'directeur' ? directeur : coordonnateur;
    const name = type === 'directeur' ? directeurName : coordonnateurName;
    
    // Mettre à jour le nom si une image existe
    if (currentData.image) {
      onSignatureUpload(type, currentData.image, name);
    }
  };

  return (
    <section className={sharedStyles.section}>
      <h2 className={sharedStyles.sectionTitle}>7. Téléversement des signatures</h2>
      <p className={styles.description}>
        Formats acceptés: PNG ou JPEG
      </p>

      <div className={styles.signaturesGrid}>
        {/* Signature Directeur */}
        <div className={styles.signatureBlock}>
          <h3 className={styles.signatureTitle}>Directeur adjoint</h3>

          <div className={styles.inputGroup}>
            <label htmlFor="directeur-file" className={styles.label}>
              Image de la signature
            </label>
            <input
              type="file"
              id="directeur-file"
              accept="image/png,image/jpeg,image/jpg"
              onChange={(e) => handleFileChange('directeur', e)}
              className={styles.fileInput}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="directeur-name" className={styles.label}>
              Nom complet du signataire
            </label>
            <input
              type="text"
              id="directeur-name"
              value={directeurName}
              onChange={(e) => handleNameChange('directeur', e)}
              onBlur={() => handleNameBlur('directeur')}
              placeholder="Ex: Jean Dupont"
              className={styles.textInput}
            />
          </div>

          {directeur.imageUrl && (
            <div className={styles.preview}>
              <p className={styles.previewLabel}>Aperçu:</p>
              <img
                src={directeur.imageUrl}
                alt="Signature du directeur"
                className={styles.previewImage}
              />
            </div>
          )}
        </div>

        {/* Signature Coordonnateur */}
        <div className={styles.signatureBlock}>
          <h3 className={styles.signatureTitle}>Coordonnateur</h3>

          <div className={styles.inputGroup}>
            <label htmlFor="coordonnateur-file" className={styles.label}>
              Image de la signature
            </label>
            <input
              type="file"
              id="coordonnateur-file"
              accept="image/png,image/jpeg,image/jpg"
              onChange={(e) => handleFileChange('coordonnateur', e)}
              className={styles.fileInput}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="coordonnateur-name" className={styles.label}>
              Nom complet du signataire
            </label>
            <input
              type="text"
              id="coordonnateur-name"
              value={coordonnateurName}
              onChange={(e) => handleNameChange('coordonnateur', e)}
              onBlur={() => handleNameBlur('coordonnateur')}
              placeholder="Ex: Marie Tremblay"
              className={styles.textInput}
            />
          </div>

          {coordonnateur.imageUrl && (
            <div className={styles.preview}>
              <p className={styles.previewLabel}>Aperçu:</p>
              <img
                src={coordonnateur.imageUrl}
                alt="Signature du coordonnateur"
                className={styles.previewImage}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
