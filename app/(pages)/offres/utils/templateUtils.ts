/**
 * Remplace les retours à la ligne par des balises HTML <br/>
 */
export function replaceNewlines(text: string): string {
  return text.replace(/\n/g, '<br/>');
}

/**
 * Remplace les points-virgules par des sauts de ligne HTML
 */
export function replaceSemicolons(text: string): string {
  return text.replace(/;/g, ' <br/> ');
}

/**
 * Nettoie et formate une valeur pour l'affichage HTML
 */
export function formatForHtml(value: string | number | null): string {
  if (value === null || value === undefined) {
    return '';
  }
  return String(value).trim();
}
