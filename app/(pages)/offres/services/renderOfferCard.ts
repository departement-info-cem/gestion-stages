import { escapeHtml, toWebsiteUrl } from '@/app/utils/htmlUtils';
import { markdownToPlainText, renderMarkdown } from '@/app/utils/markdown';
import type { OfferContent, OfferDetail, OfferDetailGroup } from '../types';
import { toOfferDetailGroups } from '../utils/offerDetails';

/**
 * Les titres de section de la carte sont des `<h3>` : un « # » Markdown doit
 * donc produire un `<h4>` pour ne pas casser la hiérarchie de la page.
 */
const SECTION_HEADING_LEVEL = 3;

/** Conserve les retours à la ligne saisis dans le formulaire */
function paragraph(text: string): string {
  return escapeHtml(text).replace(/\r?\n/g, '<br>');
}

/** Ancre partageable, stable d'une génération à l'autre */
export function offerAnchor(offer: OfferContent, index: number): string {
  const reference = offer.reference || `offre-${index + 1}`;
  return `offre-${reference.replace(/[^A-Za-z0-9_-]+/g, '-')}`;
}

function renderDetail({ label, value }: OfferDetail): string {
  return `<div><dt>${escapeHtml(label)}</dt><dd>${paragraph(value)}</dd></div>`;
}

function renderDetailGroup(group: OfferDetailGroup): string {
  const details = group.details.map(renderDetail).join('');
  return `<section class="compartiment"><h3>${escapeHtml(group.title)}</h3><dl>${details}</dl></section>`;
}

/** Détails de l'offre regroupés par thème, un bloc par compartiment rempli */
function renderDetailGroups(offer: OfferContent): string {
  const groups = toOfferDetailGroups(offer);
  if (!groups.length) return '';
  return `<div class="compartiments">${groups.map(renderDetailGroup).join('')}</div>`;
}

/** Les champs libres du formulaire sont rédigés en Markdown. */
function markdownSection(title: string, value: string): string {
  const content = renderMarkdown(value, {
    headingBaseLevel: SECTION_HEADING_LEVEL,
  });
  if (!content) return '';

  return `<section><h3>${escapeHtml(title)}</h3><div class="markdown">${content}</div></section>`;
}

function highlights(offer: OfferContent): string {
  const items: string[] = [];

  if (offer.numberOfInterns) {
    const label = Number(offer.numberOfInterns) > 1 ? 'postes' : 'poste';
    items.push(`<li>${escapeHtml(offer.numberOfInterns)} ${label}</li>`);
  }

  const website = toWebsiteUrl(offer.website);
  if (website) {
    items.push(
      `<li><a href="${escapeHtml(website)}" target="_blank" rel="noopener noreferrer">Site de l&#39;entreprise</a></li>`
    );
  }

  return items.length ? `<ul class="offre-faits">${items.join('')}</ul>` : '';
}

/** Texte indexé par le champ de filtre de la page générée */
function searchIndex(offer: OfferContent): string {
  return [
    offer.reference,
    offer.companyName,
    markdownToPlainText(offer.mandate),
    markdownToPlainText(offer.techContext),
    offer.location,
    offer.remoteModes,
    offer.remunerationType,
    offer.salary,
    offer.schedule,
    offer.teamSize,
    offer.followUp,
  ]
    .join(' ')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export function renderOfferCard(offer: OfferContent, index: number): string {
  const company = offer.companyName || 'Entreprise non précisée';

  return `<article class="offre" id="${escapeHtml(offerAnchor(offer, index))}" data-recherche="${escapeHtml(searchIndex(offer))}">
        <div class="offre-entete">
          ${offer.reference ? `<p class="offre-reference">${escapeHtml(offer.reference)}</p>` : ''}
          <h2 class="offre-entreprise">${escapeHtml(company)}</h2>
          ${highlights(offer)}
        </div>
        <div class="offre-corps">
          ${markdownSection('Mandat', offer.mandate)}
          ${markdownSection('Contexte technologique', offer.techContext)}
          ${renderDetailGroups(offer)}
        </div>
      </article>`;
}

export function renderQuickLink(offer: OfferContent, index: number): string {
  const company = offer.companyName || 'Entreprise non précisée';
  const reference = offer.reference
    ? `<span class="reference">${escapeHtml(offer.reference)}</span>`
    : '';

  return `<li><a href="#${escapeHtml(offerAnchor(offer, index))}">${reference}<span class="entreprise">${escapeHtml(company)}</span></a></li>`;
}
