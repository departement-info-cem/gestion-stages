import type { OfferContent } from '../types';

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Conserve les retours à la ligne saisis dans le formulaire */
function paragraph(text: string): string {
  return escapeHtml(text).replace(/\r?\n/g, '<br>');
}

function normalizeUrl(url: string): string | null {
  if (!url) return null;
  const candidate = /^https?:\/\//i.test(url) ? url : `https://${url}`;
  try {
    const parsed = new URL(candidate);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
      ? parsed.href
      : null;
  } catch {
    return null;
  }
}

/** Ancre partageable, stable d'une génération à l'autre */
export function offerAnchor(offer: OfferContent, index: number): string {
  const reference = offer.reference || `offre-${index + 1}`;
  return `offre-${reference.replace(/[^A-Za-z0-9_-]+/g, '-')}`;
}

function detail(label: string, value: string): string {
  if (!value) return '';
  return `<div><dt>${escapeHtml(label)}</dt><dd>${paragraph(value)}</dd></div>`;
}

function section(title: string, value: string): string {
  if (!value) return '';
  return `<section><h3>${escapeHtml(title)}</h3><p>${paragraph(value)}</p></section>`;
}

function highlights(offer: OfferContent): string {
  const items: string[] = [];

  if (offer.numberOfInterns) {
    const label = Number(offer.numberOfInterns) > 1 ? 'postes' : 'poste';
    items.push(`<li>${escapeHtml(offer.numberOfInterns)} ${label}</li>`);
  }

  const website = normalizeUrl(offer.website);
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
    offer.mandate,
    offer.techContext,
    offer.location,
    offer.remoteModes,
    offer.remunerationType,
  ]
    .join(' ')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export function renderOfferCard(offer: OfferContent, index: number): string {
  const company = offer.companyName || 'Entreprise non précisée';
  const details = [
    detail('Rémunération', offer.remunerationType),
    detail('Salaire ou compensation', offer.salary),
    detail('Horaire', offer.schedule),
    detail('Télétravail', offer.remoteModes),
    detail('Lieu du stage', offer.location),
    detail('Équipe', offer.teamSize),
    detail('Véhicule requis', offer.vehicleRequired),
    detail('Après le stage', offer.followUp),
  ].join('');

  return `<article class="offre" id="${escapeHtml(offerAnchor(offer, index))}" data-recherche="${escapeHtml(searchIndex(offer))}">
        <div class="offre-entete">
          ${offer.reference ? `<p class="offre-reference">${escapeHtml(offer.reference)}</p>` : ''}
          <h2 class="offre-entreprise">${escapeHtml(company)}</h2>
          ${highlights(offer)}
        </div>
        <div class="offre-corps">
          ${section('Mandat', offer.mandate)}
          ${section('Contexte technologique', offer.techContext)}
          ${details ? `<dl class="details">${details}</dl>` : ''}
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
