import type {
  OfferContent,
  OfferDetailGroup,
  OfferDetailGroupDefinition,
} from '../types';
import { normalizeToken } from '@/app/utils/stringUtils';

/** Formulations du formulaire qui signalent un stage sans rémunération */
const MARQUEURS_NON_REMUNERE: readonly string[] = [
  'non remunere',
  'non remuneree',
  'aucune remuneration',
  'sans remuneration',
  'pas de remuneration',
  'non paye',
  'benevole',
];

/** Formulations qui signalent un stage entièrement à distance */
const MARQUEURS_TELETRAVAIL_COMPLET: readonly string[] = [
  '100 teletravail',
  'teletravail 100',
  'teletravail a 100',
  'teletravail complet',
  'teletravail seulement',
  'entierement en teletravail',
  'entierement a distance',
  'totalement a distance',
  'a distance seulement',
  'full remote',
];

function contientMarqueur(value: string, marqueurs: readonly string[]): boolean {
  const normalized = normalizeToken(value);
  if (!normalized) return false;
  return marqueurs.some((marqueur) => normalized.includes(marqueur));
}

/** Un stage non rémunéré n'a aucun montant à publier. */
export function isUnpaid(remunerationType: string): boolean {
  return contientMarqueur(remunerationType, MARQUEURS_NON_REMUNERE);
}

/** Le lieu ne concerne que les stages exigeant une présence sur place. */
export function isFullyRemote(remoteModes: string): boolean {
  return contientMarqueur(remoteModes, MARQUEURS_TELETRAVAIL_COMPLET);
}

function remunerationAmount(offer: OfferContent): string {
  return isUnpaid(offer.remunerationType) ? '' : offer.salary;
}

function onsiteLocation(offer: OfferContent): string {
  return isFullyRemote(offer.remoteModes) ? '' : offer.location;
}

/**
 * Les compartiments publiés sur la page, dans l'ordre d'affichage. Un
 * compartiment vide — parce que l'entreprise n'a rien répondu — disparaît de
 * la carte plutôt que d'afficher un bloc sans contenu.
 */
export const OFFER_DETAIL_GROUPS: readonly OfferDetailGroupDefinition[] = [
  {
    title: 'Conditions',
    entries: [
      {
        label: 'Rémunération',
        resolve: (offer) => offer.remunerationType,
      },
      { label: 'Montant', resolve: remunerationAmount },
      { label: 'Horaire', resolve: (offer) => offer.schedule },
    ],
  },
  {
    title: 'Lieu de travail',
    entries: [
      { label: 'Télétravail', resolve: (offer) => offer.remoteModes },
      { label: 'Sur place', resolve: onsiteLocation },
      { label: 'Véhicule requis', resolve: (offer) => offer.vehicleRequired },
    ],
  },
  {
    title: 'Équipe et perspectives',
    entries: [
      { label: 'Taille de l’équipe', resolve: (offer) => offer.teamSize },
      { label: 'Suites possibles', resolve: (offer) => offer.followUp },
    ],
  },
];

/** Répartit les champs d'une offre dans les compartiments à afficher. */
export function toOfferDetailGroups(offer: OfferContent): OfferDetailGroup[] {
  return OFFER_DETAIL_GROUPS.map((group) => ({
    title: group.title,
    details: group.entries
      .map((entry) => ({ label: entry.label, value: entry.resolve(offer).trim() }))
      .filter((detail) => detail.value !== ''),
  })).filter((group) => group.details.length > 0);
}
