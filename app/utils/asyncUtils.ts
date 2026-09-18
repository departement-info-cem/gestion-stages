/**
 * Délai de repli quand `requestAnimationFrame` ne se déclenche pas, en
 * millisecondes : un onglet en arrière-plan ne peint plus, et le traitement
 * resterait bloqué en attendant une image qui ne vient jamais.
 */
const PAINT_FALLBACK_MS: number = 50;

/**
 * Rend la main au navigateur jusqu'après le prochain rendu à l'écran.
 *
 * Un `await` ordinaire ne suffit pas : sa reprise est une micro-tâche, exécutée
 * avant que le navigateur ne peigne. Sans ce point d'arrêt, un indicateur de
 * progression affiché juste avant un traitement bloquant ne serait jamais
 * visible.
 */
export function nextPaint(): Promise<void> {
  const fallback = new Promise<void>((resolve) => {
    setTimeout(resolve, PAINT_FALLBACK_MS);
  });

  if (typeof requestAnimationFrame !== "function") return fallback;

  const painted = new Promise<void>((resolve) => {
    requestAnimationFrame(() => setTimeout(resolve, 0));
  });

  return Promise.race([painted, fallback]);
}

/** Attend que `minimumMs` se soit écoulé depuis `startedAt` (`performance.now()`) */
export function waitForMinimumDuration(
  startedAt: number,
  minimumMs: number
): Promise<void> {
  const remaining = minimumMs - (performance.now() - startedAt);
  if (remaining <= 0) return Promise.resolve();
  return new Promise((resolve) => setTimeout(resolve, remaining));
}
