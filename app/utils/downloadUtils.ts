/** Délai avant de libérer l'URL, le temps que le navigateur lance le téléchargement */
const REVOKE_DELAY_MS: number = 10_000;

/**
 * Déclenche le téléchargement d'un Blob sous le nom donné.
 *
 * L'URL n'est pas libérée immédiatement après le clic : certains navigateurs
 * lisent le Blob de façon asynchrone et produiraient sinon un fichier
 * tronqué ou vide.
 */
export function downloadBlob(blob: Blob, fileName: string): void {
  const url: string = URL.createObjectURL(blob);
  const link: HTMLAnchorElement = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), REVOKE_DELAY_MS);
}
