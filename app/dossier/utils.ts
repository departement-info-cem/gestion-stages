import * as XLSX from "xlsx";
import {
  COLUMN_KEYWORDS,
  PROGRAMMATION_CODES,
  RESEAUTIQUE_CODES,
} from "./constants";
import type { ColumnKey, ColumnMapping, ColumnSample } from "./types";

const ASSET_BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function createEmptyMapping(): ColumnMapping {
  return {
    matricule: "",
    name: "",
    profile: "",
    supervisor: "",
  };
}

function normalizeToken(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export function resolveAssetPath(relativePath: string): string {
  const normalized = relativePath.startsWith("/")
    ? relativePath
    : `/${relativePath}`;
  if (!ASSET_BASE_PATH) return normalized;
  const base = ASSET_BASE_PATH.endsWith("/")
    ? ASSET_BASE_PATH.slice(0, -1)
    : ASSET_BASE_PATH;
  return `${base}${normalized}`;
}

export function toColumnSamples(
  rows: unknown[][],
  headers: string[]
): ColumnSample[] {
  return headers.map((header) => {
    const columnIndex = headers.indexOf(header);
    const values = Array.from({ length: 5 }, (_, offset) => {
      const row = rows[offset + 1];
      if (!Array.isArray(row)) return "";
      return String(row[columnIndex] ?? "").trim();
    });
    return { header, values };
  });
}

export function parseStudentName(raw: string) {
  const parts = raw.trim().split(/,\s*/);
  if (parts.length !== 2) {
    throw new Error(
      `Le nom d'étudiant « ${raw} » n'est pas au format "Nom, Prénom".`
    );
  }
  return {
    lastName: parts[0]?.trim() ?? "",
    firstName: parts[1]?.trim() ?? "",
  };
}

export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .replace(/_{2,}/g, "_")
    .toUpperCase();
}

export function buildEvaluationWorkbook(
  buffer: ArrayBuffer,
  displayName: string,
  profileCode: string
) {
  const template = XLSX.read(buffer, { type: "array" });
  const sheet = template.Sheets.evaluation;
  if (!sheet)
    throw new Error(
      "La feuille 'evaluation' est absente du gabarit d'évaluation."
    );
  sheet.A1 = { t: "s", v: displayName };
  const track = PROGRAMMATION_CODES.has(profileCode)
    ? "Programmation"
    : RESEAUTIQUE_CODES.has(profileCode)
    ? "Réseautique"
    : profileCode;
  sheet.A2 = { t: "s", v: track };
  return XLSX.write(template, { type: "array", bookType: "xlsx" });
}

export function autoDetectMapping(headers: string[]): ColumnMapping {
  const suggestions = createEmptyMapping();
  const normalizedHeaders = headers.map((header, index) => ({
    original: header,
    normalized: normalizeToken(header),
    index,
  }));
  const assigned = new Set<number>();

  const assignMatch = (
    key: ColumnKey,
    predicate: (candidate: {
      original: string;
      normalized: string;
      index: number;
    }) => boolean
  ) => {
    if (suggestions[key]) return;
    const match = normalizedHeaders.find(
      (candidate) => !assigned.has(candidate.index) && predicate(candidate)
    );
    if (match) {
      suggestions[key] = match.original;
      assigned.add(match.index);
    }
  };

  (Object.keys(COLUMN_KEYWORDS) as ColumnKey[]).forEach((key) => {
    const keywords = COLUMN_KEYWORDS[key].map(normalizeToken);
    assignMatch(key, (candidate) => keywords.includes(candidate.normalized));
  });

  (Object.keys(COLUMN_KEYWORDS) as ColumnKey[]).forEach((key) => {
    const keywords = COLUMN_KEYWORDS[key].map(normalizeToken);
    assignMatch(key, (candidate) =>
      keywords.some((keyword) => candidate.normalized.includes(keyword))
    );
  });

  return suggestions;
}
