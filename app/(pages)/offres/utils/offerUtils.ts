import type { ProcessedOffer, ProgramProfile } from '../types';
import { PROGRAM_PROFILES } from '../constants';

/**
 * Assigne un ID à une offre pour un profil donné
 */
export function assignOfferId(
  profileName: string,
  profile: ProgramProfile,
  session: string,
  currentId: number
): { id: string | null; nextId: number } {
  if (profileName.includes(profile.name)) {
    const id = `${profile.prefix}${session}-${String(currentId).padStart(2, '0')}`;
    return { id, nextId: currentId + 1 };
  }
  return { id: null, nextId: currentId };
}

/**
 * Traite toutes les offres et leur assigne des IDs selon leurs profils
 */
export function processOffers(
  offers: ProcessedOffer[],
  session: string
): ProcessedOffer[] {
  const counters: Record<string, number> = {
    'dec-ti': 1,
    'dec-prog': 1,
    'aec-devweb': 1,
    'aec-ti': 1,
  };

  return offers.map((offer) => {
    const profileField = offer['À quel profil s\'adresse l\'offre de stage ?'] as string || '';
    const processedOffer: ProcessedOffer = { ...offer };

    // Assigner les IDs pour chaque profil
    PROGRAM_PROFILES.forEach((profile) => {
      const { id: offerId, nextId } = assignOfferId(
        profileField,
        profile,
        session,
        counters[profile.id]
      );

      counters[profile.id] = nextId;

      // Stocker l'ID dans la colonne appropriée
      switch (profile.id) {
        case 'dec-ti':
          processedOffer.IDTechTI = offerId;
          break;
        case 'dec-prog':
          processedOffer.IDTechProg = offerId;
          break;
        case 'aec-devweb':
          processedOffer.IDAecWeb = offerId;
          break;
        case 'aec-ti':
          processedOffer.IDAecTI = offerId;
          break;
      }
    });

    return processedOffer;
  });
}

/**
 * Filtre les offres pour un profil donné
 */
export function filterOffersByProfile(
  offers: ProcessedOffer[],
  profileId: string
): ProcessedOffer[] {
  const idColumn = getIdColumnForProfile(profileId);
  return offers.filter((offer) => offer[idColumn] != null);
}

/**
 * Obtient le nom de la colonne ID pour un profil donné
 */
function getIdColumnForProfile(profileId: string): keyof ProcessedOffer {
  switch (profileId) {
    case 'dec-ti':
      return 'IDTechTI';
    case 'dec-prog':
      return 'IDTechProg';
    case 'aec-devweb':
      return 'IDAecWeb';
    case 'aec-ti':
      return 'IDAecTI';
    default:
      throw new Error(`Unknown profile ID: ${profileId}`);
  }
}

/**
 * Valide qu'une offre contient toutes les colonnes requises
 */
export function validateOffer(
  offer: ProcessedOffer,
  requiredColumns: string[]
): { valid: boolean; missingColumns: string[] } {
  const missingColumns = requiredColumns.filter(
    (col) => !offer[col] || String(offer[col]).trim() === ''
  );

  return {
    valid: missingColumns.length === 0,
    missingColumns,
  };
}

/**
 * Compte le nombre d'offres par profil
 */
export function countOffersByProfile(offers: ProcessedOffer[]): Record<string, number> {
  return {
    'dec-ti': filterOffersByProfile(offers, 'dec-ti').length,
    'dec-prog': filterOffersByProfile(offers, 'dec-prog').length,
    'aec-devweb': filterOffersByProfile(offers, 'aec-devweb').length,
    'aec-ti': filterOffersByProfile(offers, 'aec-ti').length,
  };
}
