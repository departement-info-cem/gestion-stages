import { resolveAssetPath } from '@/app/utils/pathUtils';
import type { OfferContent, ProgramProfile } from '../types';
import { renderOfferCard, renderQuickLink } from './renderOfferCard';

/**
 * Génère le HTML d'une page d'offres à partir du gabarit et des données
 */
export async function generateOfferPage(
  profile: ProgramProfile,
  offers: OfferContent[],
  session: string
): Promise<string> {
  const templatePath = resolveAssetPath('/templates/offre/template.html');
  const response = await fetch(templatePath);

  if (!response.ok) {
    throw new Error(`Le gabarit ${templatePath} est introuvable.`);
  }

  const template = await response.text();

  const now = new Date().toLocaleDateString('fr-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const nombreOffres =
    offers.length > 1 ? `${offers.length} offres` : `${offers.length} offre`;

  const quickLinks = offers
    .map((offer, index) => renderQuickLink(offer, index))
    .join('\n        ');
  const offerCards = offers
    .map((offer, index) => renderOfferCard(offer, index))
    .join('\n      ');

  return template
    .replace(/\{\{Titre\}\}/g, profile.name)
    .replace(/\{\{session\}\}/g, session)
    .replace(/\{\{now\}\}/g, now)
    .replace(/\{\{accent\}\}/g, profile.accent)
    .replace(/\{\{COUNT\}\}/g, nombreOffres)
    .replace(/\{\{QUICK_LINKS\}\}/g, quickLinks)
    .replace(/\{\{OFFER_CARDS\}\}/g, offerCards);
}

/**
 * Télécharge un fichier HTML
 */
export function downloadHtmlFile(html: string, fileName: string): void {
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
