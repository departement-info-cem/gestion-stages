import JSZip from "jszip";
import type { AssignmentsArchive, ReportRow, StudentFolder } from "../types";
import { findLatestVersion, listFiles } from "../utils/submissionTree";

function extensionOf(fileName: string): string {
  const dotIndex: number = fileName.lastIndexOf(".");
  return dotIndex > 0 ? fileName.slice(dotIndex) : "";
}

/**
 * Nom du fichier dans l'archive : le nom de l'étudiant, suivi du nom
 * d'origine lorsque la remise contient plusieurs fichiers (ex. CV et lettre).
 */
function archiveFileName(student: string, file: File, isOnlyFile: boolean): string {
  return isOnlyFile ? `${student}${extensionOf(file.name)}` : `${student} - ${file.name}`;
}

async function getDirectoryOrNull(
  parent: FileSystemDirectoryHandle,
  name: string
): Promise<FileSystemDirectoryHandle | null> {
  try {
    return await parent.getDirectoryHandle(name);
  } catch {
    return null;
  }
}

/**
 * Ajoute à l'archive les fichiers de la dernière version remise d'un devoir.
 * Retourne le nombre de fichiers ajoutés.
 */
async function addLatestSubmission(
  zip: JSZip,
  student: StudentFolder,
  assignment: string,
  log: (message: string) => void
): Promise<number> {
  const assignmentDir: FileSystemDirectoryHandle | null = await getDirectoryOrNull(
    student.handle,
    assignment
  );
  if (!assignmentDir) return 0;

  const version: FileSystemDirectoryHandle | null = await findLatestVersion(assignmentDir);
  if (!version) return 0;

  const fileHandles: FileSystemFileHandle[] = await listFiles(version);
  const folder: JSZip = zip.folder(assignment) ?? zip;
  for (const handle of fileHandles) {
    const file: File = await handle.getFile();
    const name: string = archiveFileName(student.name, file, fileHandles.length === 1);
    folder.file(name, await file.arrayBuffer(), { date: new Date(file.lastModified) });
    log(`✓ ${assignment}/${name} (${version.name})`);
  }
  return fileHandles.length;
}

/**
 * Construit l'archive contenant la dernière remise de chaque étudiant pour
 * les devoirs demandés, ainsi que le rapport des remises.
 */
export async function buildAssignmentsZip(
  students: StudentFolder[],
  assignments: string[],
  log: (message: string) => void
): Promise<AssignmentsArchive> {
  const zip: JSZip = new JSZip();
  const rows: ReportRow[] = [];
  let filesCount: number = 0;

  for (const student of students) {
    const row: ReportRow = { student: student.name, assignments: {} };
    for (const assignment of assignments) {
      try {
        const added: number = await addLatestSubmission(zip, student, assignment, log);
        row.assignments[assignment] = added > 0;
        filesCount += added;
      } catch (error) {
        row.assignments[assignment] = false;
        log(`Erreur pour ${student.name} (${assignment}) : ${String(error)}`);
      }
    }
    rows.push(row);
  }

  const blob: Blob = await zip.generateAsync({ type: "blob", mimeType: "application/zip" });
  return { zip: blob, rows, filesCount };
}
