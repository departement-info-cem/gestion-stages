import { renderBlocks } from "./renderBlocks";
import type { MarkdownOptions, ResolvedMarkdownOptions } from "./types";

const DEFAULT_OPTIONS: ResolvedMarkdownOptions = {
  headingBaseLevel: 0,
};

/** Les tabulations fausseraient le calcul d'indentation des listes. */
function toLines(source: string): string[] {
  return source.replace(/\r\n?/g, "\n").replace(/\t/g, "    ").split("\n");
}

/**
 * Convertit un texte Markdown en HTML sûr : tout ce qui n'est pas une marque
 * Markdown reconnue est échappé, aucune balise saisie dans le formulaire
 * n'est reconduite telle quelle.
 *
 * Sous-ensemble pris en charge : titres, paragraphes, listes à puces et
 * numérotées (imbriquées), citations, blocs de code, filets, gras, italique,
 * barré, code en ligne et liens.
 */
export function renderMarkdown(
  source: string,
  options: MarkdownOptions = {}
): string {
  if (!source.trim()) return "";
  return renderBlocks(toLines(source), { ...DEFAULT_OPTIONS, ...options });
}
