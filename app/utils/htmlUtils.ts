/** Caractères à neutraliser avant d'insérer du texte dans le HTML généré */
const HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

/** Rend un texte saisi par une entreprise inoffensif dans une page générée. */
export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => HTML_ESCAPES[char]);
}

/**
 * Protocoles publiables : tout le reste (« javascript: », « data: »…) est
 * rejeté, car les liens proviennent d'un formulaire non contrôlé.
 */
const ALLOWED_PROTOCOLS: readonly string[] = ["http:", "https:", "mailto:"];

/** Retourne l'URL normalisée, ou `null` si elle n'est pas publiable. */
export function sanitizeUrl(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("#")) return trimmed;

  try {
    const parsed = new URL(trimmed);
    return ALLOWED_PROTOCOLS.includes(parsed.protocol) ? parsed.href : null;
  } catch {
    return null;
  }
}

/**
 * Le formulaire accepte « exemple.com » sans protocole : on le complète avant
 * validation. Seules les adresses web sont retenues.
 */
export function toWebsiteUrl(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return null;

  const candidate = /^[a-z][a-z0-9+.-]*:/i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;
  const safe = sanitizeUrl(candidate);

  return safe && /^https?:/.test(safe) ? safe : null;
}
