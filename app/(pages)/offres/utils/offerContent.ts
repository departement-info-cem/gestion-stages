import type {
  ColumnMapping,
  OfferContent,
  OfferContentKey,
  ProcessedOffer,
} from '../types';
import { REQUIRED_COLUMN_KEYS } from '../constants';

function readCell(offer: ProcessedOffer, column: string | undefined): string {
  if (!column) return '';
  const value = offer[column];
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

/**
 * Convertit une ligne du fichier en champs nommés, selon l'association de
 * colonnes choisie. La génération n'a ainsi pas à connaître les libellés du
 * formulaire, qui changent d'une année à l'autre.
 */
export function toOfferContent(
  offer: ProcessedOffer,
  columnMapping: ColumnMapping,
  idColumn: string
): OfferContent {
  const content = { reference: readCell(offer, idColumn) } as OfferContent;

  for (const key of REQUIRED_COLUMN_KEYS) {
    if (key === 'targetProfiles') continue;
    content[key as OfferContentKey] = readCell(offer, columnMapping[key]);
  }

  return content;
}
