import type { ColumnMapping, ProcessedOffer } from '../types';
import type { MessageType } from '../hooks/useStatusMessages';
import { PROGRAM_PROFILES } from '../constants';
import { filterOffersByProfile, getIdColumnForProfile } from '../utils';
import { toOfferContent } from '../utils/offerContent';
import { generateOfferPage, downloadHtmlFile } from './generateOffersPages';

export interface GenerateAllPagesParams {
  processedOffers: ProcessedOffer[];
  columnMapping: ColumnMapping;
  session: string;
  onStatus: (type: MessageType, text: string) => void;
}

/**
 * Produit une page HTML par profil ayant au moins une offre et la télécharge.
 * Renvoie le nombre de fichiers générés.
 */
export async function generateAllPages({
  processedOffers,
  columnMapping,
  session,
  onStatus,
}: GenerateAllPagesParams): Promise<number> {
  let generatedCount = 0;

  for (const profile of PROGRAM_PROFILES) {
    const filteredOffers = filterOffersByProfile(processedOffers, profile.id);
    if (filteredOffers.length === 0) continue;

    try {
      const offersContent = filteredOffers.map((offer) =>
        toOfferContent(offer, columnMapping, getIdColumnForProfile(profile.id))
      );

      const html = await generateOfferPage(profile, offersContent, session);
      downloadHtmlFile(html, profile.fileName);
      generatedCount++;

      const pluriel = filteredOffers.length > 1 ? 'offres' : 'offre';
      onStatus(
        'success',
        `${profile.name} : ${filteredOffers.length} ${pluriel} générée(s).`
      );
    } catch (error) {
      console.error(`Erreur de génération pour ${profile.id} :`, error);
      onStatus('error', `Erreur lors de la génération pour ${profile.name}.`);
    }
  }

  return generatedCount;
}
