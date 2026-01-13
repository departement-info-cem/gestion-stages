/**
 * Extrait le nom, prénom et matricule depuis le format "123-4567 Nom, Prénom"
 */
export function extractStudentInfo(info: string): {
  nom: string;
  prenom: string;
  matricule: string;
} {
  const parts = info.trim().split(" ");
  const matricule = parts[0];
  const nomPrenom = parts.slice(1).join(" ");
  const [nom, prenom] = nomPrenom.split(",").map((s) => s.trim());

  return { nom, prenom, matricule };
}

/**
 * Nettoie un nom de fichier pour éviter les caractères invalides
 */
export function sanitizeFileName(fileName: string): string {
  return fileName.replace(/[^a-zA-Z0-9_-]/g, "_");
}
