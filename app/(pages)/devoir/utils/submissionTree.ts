import type { StudentFolder, SubmissionsScan } from "../types";

/** Dossier de version créé par Teams pour chaque remise, ex. « Version 2 » */
const VERSION_PATTERN: RegExp = /^version\s+(\d+)$/i;

/** Préfixe ajouté par Teams aux étudiants inscrits récemment */
const NEW_STUDENT_PREFIX: RegExp = /^\(new\)\s*/i;

/** Fichiers système à ignorer (OneDrive, macOS, Windows) */
const IGNORED_FILE_NAMES: Set<string> = new Set(["desktop.ini", "thumbs.db"]);

/** Profondeur maximale explorée pour trouver les dossiers d'étudiants */
const MAX_ROOT_DEPTH: number = 3;

export function cleanStudentName(name: string): string {
  return name.replace(NEW_STUDENT_PREFIX, "").trim();
}

function isIgnored(name: string): boolean {
  return name.startsWith(".") || IGNORED_FILE_NAMES.has(name.toLowerCase());
}

export async function listDirectories(
  dir: FileSystemDirectoryHandle
): Promise<FileSystemDirectoryHandle[]> {
  const directories: FileSystemDirectoryHandle[] = [];
  for await (const entry of dir.values()) {
    if (entry.kind === "directory" && !isIgnored(entry.name)) {
      directories.push(entry as FileSystemDirectoryHandle);
    }
  }
  return directories;
}

export async function listFiles(
  dir: FileSystemDirectoryHandle
): Promise<FileSystemFileHandle[]> {
  const files: FileSystemFileHandle[] = [];
  for await (const entry of dir.values()) {
    if (entry.kind === "file" && !isIgnored(entry.name)) {
      files.push(entry as FileSystemFileHandle);
    }
  }
  return files.sort((a, b) => a.name.localeCompare(b.name));
}

function versionNumber(name: string): number {
  const match: RegExpMatchArray | null = name.match(VERSION_PATTERN);
  return match ? Number(match[1]) : -1;
}

/**
 * Retourne le dossier de la remise la plus récente. Le tri est numérique
 * pour que « Version 10 » passe après « Version 9 ».
 */
export async function findLatestVersion(
  assignment: FileSystemDirectoryHandle
): Promise<FileSystemDirectoryHandle | null> {
  const versions: FileSystemDirectoryHandle[] = await listDirectories(assignment);
  versions.sort(
    (a, b) =>
      versionNumber(a.name) - versionNumber(b.name) ||
      a.name.localeCompare(b.name, undefined, { numeric: true })
  );
  return versions[versions.length - 1] ?? null;
}

/**
 * Un dossier est la racine des remises si l'un de ses sous-dossiers
 * (étudiant) contient un devoir organisé en dossiers « Version N ».
 */
async function isSubmissionsRoot(dir: FileSystemDirectoryHandle): Promise<boolean> {
  for (const student of await listDirectories(dir)) {
    for (const assignment of await listDirectories(student)) {
      const versions: FileSystemDirectoryHandle[] = await listDirectories(assignment);
      if (versions.some((v) => VERSION_PATTERN.test(v.name))) return true;
      // Un seul devoir suffit pour conclure pour cet étudiant
      break;
    }
  }
  return false;
}

/**
 * Trouve le dossier contenant les étudiants, même si l'utilisateur a
 * sélectionné un dossier parent (ex. le dossier extrait du ZIP SharePoint,
 * qui contient « Submitted files »).
 */
export async function findSubmissionsRoot(
  dir: FileSystemDirectoryHandle,
  depth: number = 0
): Promise<FileSystemDirectoryHandle | null> {
  if (await isSubmissionsRoot(dir)) return dir;
  if (depth >= MAX_ROOT_DEPTH) return null;
  for (const child of await listDirectories(dir)) {
    const root: FileSystemDirectoryHandle | null = await findSubmissionsRoot(child, depth + 1);
    if (root) return root;
  }
  return null;
}

export async function scanSubmissions(
  selected: FileSystemDirectoryHandle
): Promise<SubmissionsScan | null> {
  const root: FileSystemDirectoryHandle | null = await findSubmissionsRoot(selected);
  if (!root) return null;

  const students: StudentFolder[] = [];
  const assignmentSet: Set<string> = new Set();
  for (const handle of await listDirectories(root)) {
    students.push({ name: cleanStudentName(handle.name), handle });
    for (const assignment of await listDirectories(handle)) {
      assignmentSet.add(assignment.name);
    }
  }

  students.sort((a, b) => a.name.localeCompare(b.name));
  const assignments: string[] = Array.from(assignmentSet).sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true })
  );
  return { root, students, assignments };
}
