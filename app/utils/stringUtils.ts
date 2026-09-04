/**
 * Normalise un libellé pour la comparaison : minuscules, sans accents,
 * sans ponctuation, espaces simples.
 *
 * La mise en minuscules doit précéder le retrait de la ponctuation, sinon
 * `[^a-z0-9]` avale aussi les majuscules et ampute le premier mot
 * (« Courriel de la personne contact » devenait « ourriel de la personne
 * contact », que le mot-clé « courriel » ne pouvait plus reconnaître).
 */
export function normalizeToken(value: string): string {
  return value
    .replace(/\u00a0/g, " ")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Vérifie qu'un mot-clé apparaît comme mot (ou groupe de mots) entier.
 *
 * Une simple recherche de sous-chaîne ferait correspondre le mot-clé « TI »
 * à « informatique », ce qui classait toutes les offres dans le profil TI.
 */
export function containsKeyword(text: string, keyword: string): boolean {
  const normalizedKeyword = normalizeToken(keyword);
  if (!normalizedKeyword) return false;

  const pattern = new RegExp(
    `(?:^| )${escapeRegExp(normalizedKeyword)}(?: |$)`
  );
  return pattern.test(normalizeToken(text));
}
