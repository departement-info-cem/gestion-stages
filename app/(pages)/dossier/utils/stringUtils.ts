export { normalizeToken } from "@/app/utils/stringUtils";

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
