/**
 * Parse date from various formats
 */
export function parseDate(dateStr: string): Date | null {
  if (!dateStr || dateStr.trim() === "") return null;

  // Try ISO format first (YYYY-MM-DD)
  const isoMatch = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    return new Date(dateStr);
  }

  // Try Excel serial number
  const excelSerial = parseFloat(dateStr);
  if (!isNaN(excelSerial) && excelSerial > 1 && excelSerial < 100000) {
    const excelEpoch = new Date(1899, 11, 30);
    const date = new Date(excelEpoch.getTime() + excelSerial * 86400000);
    return date;
  }

  return null;
}

/**
 * Format date to French format: "10 mars 2025"
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
