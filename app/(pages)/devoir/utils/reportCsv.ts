import type { ReportRow } from "../types";

/** Marque d'ordre des octets : permet à Excel de lire les accents en UTF-8 */
const UTF8_BOM: string = "﻿";

function csvCell(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

/** Rapport des remises : une ligne par étudiant, un « X » par devoir remis */
export function buildReportCsv(rows: ReportRow[], assignments: string[]): string {
  const header: string = ["Étudiant", ...assignments].map(csvCell).join(",");
  const lines: string[] = rows.map((row) =>
    [row.student, ...assignments.map((a) => (row.assignments[a] ? "X" : ""))]
      .map(csvCell)
      .join(",")
  );
  return UTF8_BOM + [header, ...lines].join("\r\n");
}
