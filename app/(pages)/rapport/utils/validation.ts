import { ColumnMapping } from '../types';

/**
 * Vérifie si un ColumnMapping a toutes les clés requises
 */
export function isValidColumnMapping(mapping: unknown): mapping is ColumnMapping {
  if (!mapping || typeof mapping !== 'object') {
    return false;
  }

  const obj = mapping as Record<string, unknown>;
  const requiredKeys: Array<keyof ColumnMapping> = ['START', 'END', 'EMAIL', 'NAME'];

  return requiredKeys.every((key) => {
    const value = obj[key];
    return typeof value === 'string' && value.trim().length > 0;
  });
}
