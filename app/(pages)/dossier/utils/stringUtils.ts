export function normalizeToken(value: string): string {
  return value
    // Normalize accents and common non-breaking spaces
    .replace(/\u00A0/g, " ")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .replace(/_{2,}/g, "_")
    .toUpperCase();
}

export function parseStudentName(raw: string): {
  lastName: string;
  firstName: string;
} {
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
