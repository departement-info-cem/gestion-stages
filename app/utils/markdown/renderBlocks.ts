import { escapeHtml } from "../htmlUtils";
import {
  FENCE_PATTERN,
  HEADING_PATTERN,
  QUOTE_PATTERN,
  RULE_PATTERN,
  indentWidth,
  parseListItem,
  startsBlock,
} from "./blockPatterns";
import { renderInline } from "./renderInline";
import type { ListItemMarker, ResolvedMarkdownOptions } from "./types";

const MAX_HEADING_LEVEL = 6;

/** Bloc de code délimité par ``` ou ~~~ */
function appendCodeBlock(
  parts: string[],
  lines: string[],
  start: number,
  fence: string
): number {
  const closing = new RegExp(`^ {0,3}${fence[0]}{${fence.length},}\\s*$`);
  const content: string[] = [];
  let index = start + 1;

  while (index < lines.length && !closing.test(lines[index])) {
    content.push(lines[index]);
    index += 1;
  }

  parts.push(`<pre><code>${escapeHtml(content.join("\n"))}</code></pre>`);
  return Math.min(index + 1, lines.length);
}

/** Citation : les lignes suivantes sans « > » prolongent la citation. */
function appendQuote(
  parts: string[],
  lines: string[],
  start: number,
  options: ResolvedMarkdownOptions
): number {
  const inner: string[] = [];
  let index = start;

  while (index < lines.length) {
    const line = lines[index];

    if (QUOTE_PATTERN.test(line)) {
      inner.push(line.replace(QUOTE_PATTERN, ""));
    } else if (!line.trim() || startsBlock(line)) {
      break;
    } else {
      inner.push(line);
    }

    index += 1;
  }

  parts.push(`<blockquote>${renderBlocks(inner, options)}</blockquote>`);
  return index;
}

/** Un item d'un seul paragraphe n'a pas besoin d'être enveloppé dans un `<p>`. */
function tightenItem(html: string): string {
  const firstParagraph = /^<p>([\s\S]*?)<\/p>/.exec(html);
  if (!firstParagraph) return html;

  const rest = html.slice(firstParagraph[0].length);
  return rest.includes("<p>") ? html : firstParagraph[1] + rest;
}

function renderListHtml(items: string[], first: ListItemMarker): string {
  const body = items.map((item) => `<li>${item}</li>`).join("");
  if (!first.ordered) return `<ul>${body}</ul>`;

  const start = first.start === 1 ? "" : ` start="${first.start}"`;
  return `<ol${start}>${body}</ol>`;
}

/** Une puce au même niveau que `first` poursuit la même liste. */
function opensSiblingItem(line: string, first: ListItemMarker): boolean {
  const marker = parseListItem(line);
  return (
    marker !== null &&
    marker.indent <= first.indent + 1 &&
    marker.ordered === first.ordered
  );
}

/**
 * Liste à puces ou numérotée. Les lignes indentées sous une puce sont
 * désindentées puis analysées à leur tour : une sous-liste ou un second
 * paragraphe dans un item fonctionnent donc sans traitement particulier.
 */
function appendList(
  parts: string[],
  lines: string[],
  start: number,
  first: ListItemMarker,
  options: ResolvedMarkdownOptions
): number {
  const items: string[] = [];
  let itemLines: string[] = [];
  let contentIndent = first.contentIndent;
  let pendingBlank = false;
  let index = start;

  const flush = (): void => {
    if (itemLines.length) items.push(tightenItem(renderBlocks(itemLines, options)));
    itemLines = [];
  };

  while (index < lines.length) {
    const line = lines[index];

    if (!line.trim()) {
      const next = lines[index + 1];
      const listGoesOn =
        next !== undefined &&
        next.trim() !== "" &&
        (indentWidth(next) >= contentIndent || opensSiblingItem(next, first));
      if (!listGoesOn) break;

      pendingBlank = true;
      index += 1;
      continue;
    }

    const marker = parseListItem(line);
    if (marker && marker.indent <= first.indent + 1) {
      if (marker.ordered !== first.ordered) break;

      flush();
      contentIndent = marker.contentIndent;
      itemLines.push(marker.content);
      pendingBlank = false;
      index += 1;
      continue;
    }

    const isItemContent = indentWidth(line) >= contentIndent;
    if (!isItemContent && (pendingBlank || startsBlock(line))) break;

    if (pendingBlank) itemLines.push("");
    pendingBlank = false;
    itemLines.push(line.slice(Math.min(indentWidth(line), contentIndent)));
    index += 1;
  }

  flush();
  parts.push(renderListHtml(items, first));
  return index;
}

function appendParagraph(parts: string[], lines: string[], start: number): number {
  const content: string[] = [];
  let index = start;

  do {
    content.push(lines[index].trim());
    index += 1;
  } while (index < lines.length && lines[index].trim() && !startsBlock(lines[index]));

  parts.push(`<p>${renderInline(content.join("\n"))}</p>`);
  return index;
}

/** Rend une suite de lignes déjà normalisées. */
export function renderBlocks(
  lines: string[],
  options: ResolvedMarkdownOptions
): string {
  const parts: string[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (!line.trim()) {
      index += 1;
      continue;
    }

    const fence = FENCE_PATTERN.exec(line);
    if (fence) {
      index = appendCodeBlock(parts, lines, index, fence[1]);
      continue;
    }

    const heading = HEADING_PATTERN.exec(line);
    if (heading) {
      const level = Math.min(
        options.headingBaseLevel + heading[1].length,
        MAX_HEADING_LEVEL
      );
      const text = heading[2].replace(/\s+#+\s*$/, "").trim();
      parts.push(`<h${level}>${renderInline(text)}</h${level}>`);
      index += 1;
      continue;
    }

    if (RULE_PATTERN.test(line)) {
      parts.push("<hr>");
      index += 1;
      continue;
    }

    if (QUOTE_PATTERN.test(line)) {
      index = appendQuote(parts, lines, index, options);
      continue;
    }

    const marker = parseListItem(line);
    if (marker) {
      index = appendList(parts, lines, index, marker, options);
      continue;
    }

    index = appendParagraph(parts, lines, index);
  }

  return parts.join("");
}
