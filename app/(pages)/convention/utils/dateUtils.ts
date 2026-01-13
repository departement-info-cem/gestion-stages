/**
 * Calcule le nombre de jours ouvrables entre deux dates (exclut weekends)
 */
export function calculateWorkingDays(startDate: Date, endDate: Date): number {
  let count = 0;
  const current = new Date(startDate);

  while (current <= endDate) {
    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      // 0 = dimanche, 6 = samedi
      count++;
    }
    current.setDate(current.getDate() + 1);
  }

  return count;
}

/**
 * Formate une date au format français (ex: "12 janvier 2026")
 */
export function formatDateFrench(date: Date): string {
  const months = [
    "janvier",
    "février",
    "mars",
    "avril",
    "mai",
    "juin",
    "juillet",
    "août",
    "septembre",
    "octobre",
    "novembre",
    "décembre",
  ];

  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}

/**
 * Convertit une date Excel (nombre) en objet Date JavaScript
 */
export function excelDateToJSDate(excelDate: number): Date {
  const date = new Date((excelDate - 25569) * 86400 * 1000);
  return date;
}

/**
 * Parse une date depuis différents formats
 */
export function parseDate(value: unknown): Date | null {
  if (!value) return null;

  // Si c'est déjà une date
  if (value instanceof Date) return value;

  // Si c'est un nombre (format Excel)
  if (typeof value === "number") {
    return excelDateToJSDate(value);
  }

  // Si c'est une chaîne
  if (typeof value === "string") {
    const parsed = new Date(value);
    if (!isNaN(parsed.getTime())) return parsed;
  }

  return null;
}
