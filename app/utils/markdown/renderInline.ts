import { escapeHtml, sanitizeUrl } from "../htmlUtils";

/** Caractères qu'une contre-oblique peut neutraliser */
const ESCAPABLE = "[\\\\`*_{}\\[\\]()#+\\-.!~>|]";

/** Ce qui suit un « _ » fermant et lui interdit de clore une emphase */
const WORD = "[\\p{L}\\p{N}_]";

/**
 * Un seul balayage reconnaît toutes les marques en ligne, dans l'ordre de
 * priorité ci-dessous. Le texte situé entre deux marques est échappé et
 * jamais réinterprété : un « < » saisi dans le formulaire ne peut donc pas
 * devenir une balise.
 */
const INLINE_SOURCE = [
  `\\\\(${ESCAPABLE})`, //                                 1  échappement
  "(`+)([\\s\\S]*?[^`])\\2(?!`)", //                       2  délimiteur, 3 code
  '\\[([^\\][]*)\\]\\([ \\t]*([^()\\s]*)(?:[ \\t]+"([^"]*)")?[ \\t]*\\)', // 4 libellé, 5 url, 6 infobulle
  "<((?:https?://|mailto:)[^>\\s]+)>", //                  7  lien automatique
  "\\*\\*(?=\\S)([\\s\\S]*?\\S)\\*\\*", //                 8  gras
  `__(?=\\S)([\\s\\S]*?\\S)__(?!${WORD})`, //              9  gras
  "~~(?=\\S)([\\s\\S]*?\\S)~~", //                        10  barré
  "\\*(?=\\S)([\\s\\S]*?\\S)\\*", //                      11  italique
  `_(?=\\S)([\\s\\S]*?\\S)_(?!${WORD})`, //               12  italique
  "(https?://[^\\s<>\"']*[^\\s<>\"'.,;:!?)\\]])", //      13  url nue
].join("|");

const WORD_PATTERN = new RegExp(WORD, "u");

/** Le texte brut conserve les retours à la ligne saisis dans le formulaire. */
function escapeText(value: string): string {
  return escapeHtml(value).replace(/\n/g, "<br>");
}

/**
 * « nom_de_variable » ne doit pas devenir « nom<em>de</em>variable » : un
 * souligné collé à un mot est du texte, pas une emphase. La vérification a
 * lieu ici plutôt que par une rétro-assertion dans l'expression, qui ne
 * s'exécute pas partout.
 */
function isIntrawordUnderscore(source: string, match: RegExpExecArray): boolean {
  return (
    match[0].startsWith("_") &&
    WORD_PATTERN.test(source.charAt(match.index - 1))
  );
}

function anchor(url: string, text: string, title?: string): string {
  const safe = sanitizeUrl(url);
  if (!safe) return text;

  const titleAttribute = title ? ` title="${escapeHtml(title)}"` : "";
  // Seules les adresses web quittent la page ; une ancre ou un courriel non.
  const target = /^https?:/.test(safe)
    ? ' target="_blank" rel="noopener noreferrer"'
    : "";

  return `<a href="${escapeHtml(safe)}"${titleAttribute}${target}>${text}</a>`;
}

function renderLink(label: string, url: string, title?: string): string {
  const text = label.trim() ? renderInline(label) : escapeHtml(url);
  return anchor(url, text, title);
}

/**
 * Une adresse écrite telle quelle sert aussi de libellé. Elle est seulement
 * échappée : la relire comme du Markdown relancerait le même traitement
 * indéfiniment.
 */
function renderBareLink(url: string): string {
  return anchor(url, escapeHtml(url));
}

function renderMatch(match: RegExpExecArray): string {
  const [
    ,
    escaped,
    ,
    code,
    linkLabel,
    linkUrl,
    linkTitle,
    autolink,
    strongStars,
    strongUnderscores,
    struck,
    emphasisStar,
    emphasisUnderscore,
    bareUrl,
  ] = match;

  if (escaped !== undefined) return escapeHtml(escaped);
  if (code !== undefined) {
    return `<code>${escapeHtml(code.replace(/\n/g, " "))}</code>`;
  }
  if (linkUrl !== undefined) return renderLink(linkLabel, linkUrl, linkTitle);
  if (autolink !== undefined) return renderBareLink(autolink);

  const strong = strongStars ?? strongUnderscores;
  if (strong !== undefined) return `<strong>${renderInline(strong)}</strong>`;
  if (struck !== undefined) return `<del>${renderInline(struck)}</del>`;

  const emphasis = emphasisStar ?? emphasisUnderscore;
  if (emphasis !== undefined) return `<em>${renderInline(emphasis)}</em>`;
  if (bareUrl !== undefined) return renderBareLink(bareUrl);

  return escapeText(match[0]);
}

/**
 * Convertit les marques en ligne d'un fragment Markdown en HTML. L'expression
 * est reconstruite à chaque appel : le rendu est récursif (un lien à
 * l'intérieur d'un gras, par exemple) et ne peut pas partager un curseur de
 * recherche.
 */
export function renderInline(source: string): string {
  const pattern = new RegExp(INLINE_SOURCE, "gu");
  let html = "";
  let cursor = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(source)) !== null) {
    html += escapeText(source.slice(cursor, match.index));

    if (isIntrawordUnderscore(source, match)) {
      cursor = match.index + 1;
      pattern.lastIndex = cursor;
      html += "_";
      continue;
    }

    html += renderMatch(match);
    cursor = pattern.lastIndex;
  }

  return html + escapeText(source.slice(cursor));
}
