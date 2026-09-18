import type { ListItemMarker } from "./types";

export const HEADING_PATTERN = /^ {0,3}(#{1,6})\s+(.*)$/;

export const FENCE_PATTERN = /^ {0,3}(`{3,}|~{3,})\s*(.*)$/;

export const RULE_PATTERN =
  /^ {0,3}(?:(?:\*[ \t]*){3,}|(?:-[ \t]*){3,}|(?:_[ \t]*){3,})$/;

export const QUOTE_PATTERN = /^ {0,3}>[ \t]?/;

const LIST_ITEM_PATTERN = /^( *)(?:([-*+])|(\d{1,9})[.)])[ \t]+(.*)$/;

/** Largeur de l'indentation d'une ligne, en espaces */
export function indentWidth(line: string): number {
  return line.length - line.trimStart().length;
}

/** Analyse la puce d'un item de liste, ou `null` si la ligne n'en est pas un. */
export function parseListItem(line: string): ListItemMarker | null {
  if (RULE_PATTERN.test(line)) return null;

  const match = LIST_ITEM_PATTERN.exec(line);
  if (!match) return null;

  const [, indent, bullet, digits, content] = match;
  const markerWidth = bullet ? 1 : digits.length + 1;

  return {
    indent: indent.length,
    ordered: bullet === undefined,
    start: digits ? Number(digits) : 1,
    contentIndent: indent.length + markerWidth + 1,
    content,
  };
}

/**
 * Indique qu'une ligne ouvre un nouveau bloc : un paragraphe en cours doit
 * alors se terminer, même sans ligne vide.
 */
export function startsBlock(line: string): boolean {
  return (
    HEADING_PATTERN.test(line) ||
    FENCE_PATTERN.test(line) ||
    RULE_PATTERN.test(line) ||
    QUOTE_PATTERN.test(line) ||
    parseListItem(line) !== null
  );
}
