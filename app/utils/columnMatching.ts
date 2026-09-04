import { normalizeToken } from "./stringUtils";

interface KeywordScore {
  /** Le libellé de la colonne correspond exactement à un mot-clé */
  exact: boolean;
  /** Nombre de mots-clés distincts retrouvés dans le libellé */
  coverage: number;
  /** Longueur cumulée des mots-clés retrouvés : favorise les correspondances précises */
  weight: number;
  /** Position du mot-clé le plus précoce : « Courriel de… » l'emporte sur « Adresse de courriel » */
  position: number;
}

interface MatchCandidate<K extends string> extends KeywordScore {
  key: K;
  headerIndex: number;
}

function scoreHeader(
  normalizedHeader: string,
  keywords: readonly string[]
): KeywordScore | null {
  const tokens = normalizedHeader.split(" ");
  let exact = false;
  let coverage = 0;
  let weight = 0;
  let position = Number.MAX_SAFE_INTEGER;

  for (const keyword of keywords) {
    let index = -1;

    if (keyword.includes(" ")) {
      index = normalizedHeader.indexOf(keyword);
    } else {
      const tokenIndex = tokens.indexOf(keyword);
      if (tokenIndex >= 0) {
        index = tokens
          .slice(0, tokenIndex)
          .reduce((sum, token) => sum + token.length + 1, 0);
      }
    }

    if (index < 0) continue;

    coverage += 1;
    weight += keyword.length;
    position = Math.min(position, index);
    if (normalizedHeader === keyword) {
      exact = true;
    }
  }

  return coverage > 0 ? { exact, coverage, weight, position } : null;
}

function compareCandidates<K extends string>(
  a: MatchCandidate<K>,
  b: MatchCandidate<K>
): number {
  if (a.exact !== b.exact) return a.exact ? -1 : 1;
  if (a.coverage !== b.coverage) return b.coverage - a.coverage;
  if (a.weight !== b.weight) return b.weight - a.weight;
  if (a.position !== b.position) return a.position - b.position;
  return a.headerIndex - b.headerIndex;
}

/**
 * Associe chaque champ à la colonne du fichier qui lui correspond le mieux.
 *
 * Toutes les paires champ/colonne sont évaluées puis attribuées de la
 * meilleure à la moins bonne, chaque colonne ne servant qu'une fois. Un
 * simple parcours dans l'ordre des champs attribuerait « Adresse de
 * courriel » au champ « Lieu » (mot-clé « adresse ») avant que le champ
 * « Courriel du contact » ait pu se manifester.
 */
export function detectColumnMapping<K extends string>(
  headers: readonly string[],
  keywordsByKey: Readonly<Record<K, readonly string[]>>
): Record<K, string> {
  const normalizedHeaders = headers.map((header) => normalizeToken(header));
  const keys = Object.keys(keywordsByKey) as K[];
  const candidates: MatchCandidate<K>[] = [];

  for (const key of keys) {
    const keywords = keywordsByKey[key]
      .map((keyword) => normalizeToken(keyword))
      .filter((keyword) => keyword.length > 0);

    normalizedHeaders.forEach((normalizedHeader, headerIndex) => {
      const score = scoreHeader(normalizedHeader, keywords);
      if (score) {
        candidates.push({ key, headerIndex, ...score });
      }
    });
  }

  candidates.sort(compareCandidates);

  const mapping = Object.fromEntries(keys.map((key) => [key, ""])) as Record<
    K,
    string
  >;
  const usedHeaders = new Set<number>();

  for (const candidate of candidates) {
    if (mapping[candidate.key]) continue;
    if (usedHeaders.has(candidate.headerIndex)) continue;
    mapping[candidate.key] = headers[candidate.headerIndex];
    usedHeaders.add(candidate.headerIndex);
  }

  return mapping;
}
