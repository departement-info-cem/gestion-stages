import { useState, useCallback } from 'react';
import type { SignatureData } from '../types';

export interface UseSignaturesResult {
  signatureDirecteur: SignatureData;
  signatureCoordonnateur: SignatureData;
  handleSignatureUpload: (
    type: 'directeur' | 'coordonnateur',
    file: File,
    signataireName: string
  ) => Promise<void>;
}

export function useSignatures(
  onError: (message: string) => void
): UseSignaturesResult {
  const [signatureDirecteur, setSignatureDirecteur] = useState<SignatureData>({
    image: null,
    imageUrl: '',
    signataireName: '',
  });

  const [signatureCoordonnateur, setSignatureCoordonnateur] = useState<SignatureData>({
    image: null,
    imageUrl: '',
    signataireName: '',
  });

  const handleSignatureUpload = useCallback(
    async (
      type: 'directeur' | 'coordonnateur',
      file: File,
      signataireName: string
    ) => {
      try {
        const imageUrl = URL.createObjectURL(file);
        const signatureData: SignatureData = {
          image: file,
          imageUrl,
          signataireName,
        };

        if (type === 'directeur') {
          setSignatureDirecteur(signatureData);
        } else {
          setSignatureCoordonnateur(signatureData);
        }
      } catch (error) {
        console.error('Erreur lors du chargement de la signature:', error);
        onError('Impossible de charger la signature.');
      }
    },
    [onError]
  );

  return {
    signatureDirecteur,
    signatureCoordonnateur,
    handleSignatureUpload,
  };
}
