"use client";

import { useCallback, useState } from "react";
import JSZip from "jszip";

type ReportRow = {
  student: string;
  assignments: Record<string, boolean>;
};

function cleanStudentName(name: string): string {
  return name.replace(/^\(new\)\s*/i, "");
}

export function useDevoirGenerator() {
  const [sourceHandle, setSourceHandle] = useState<FileSystemDirectoryHandle | null>(null);
  const [sourcePath, setSourcePath] = useState<string>("");
  const [students, setStudents] = useState<string[]>([]);
  const [assignments, setAssignments] = useState<string[]>([]);
  const [report, setReport] = useState<ReportRow[]>([]);
  const [statusMessages, setStatusMessages] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const log = useCallback((m: string) => {
    setStatusMessages((s) => [...s, m]);
  }, []);

  async function pickSourceDirectory() {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore - DOM lib may not include showDirectoryPicker
      const handle = await window.showDirectoryPicker();
      setSourceHandle(handle);
      setSourcePath(handle.name);
      setStatusMessages([]);
      await scanSource(handle);
    } catch (e) {
      log("Sélection annulée ou non supportée.");
      setSourceHandle(null);
      setSourcePath("");
    }
  }

  async function scanSource(handle: FileSystemDirectoryHandle | null) {
    if (!handle) return;
    setIsScanning(true);
    log("Scan en cours...");
    const studentNames: string[] = [];
    const assignmentSet = new Set<string>();
    for await (const [name, entry] of handle.entries()) {
      if (entry.kind === "directory") {
        const cleanName = cleanStudentName(name);
        studentNames.push(cleanName);
        const dirEntry = entry as FileSystemDirectoryHandle;
        for await (const [subname, subentry] of dirEntry.entries()) {
          if (subentry.kind === "directory") assignmentSet.add(subname);
        }
      }
    }
    studentNames.sort();
    const assignmentList = Array.from(assignmentSet).sort();
    setStudents(studentNames);
    setAssignments(assignmentList);
    setIsScanning(false);
    log(`✓ Scanné ${studentNames.length} étudiants et ${assignmentList.length} devoirs.`);
  }

  async function processAssignment(assignmentName: string | null): Promise<Blob | null> {
    if (!sourceHandle) {
      log("Source non sélectionnée.");
      return null;
    }
    setIsProcessing(true);
    const rows: ReportRow[] = [];
    const zip = new JSZip();

    for (const student of students) {
      const row: ReportRow = { student, assignments: {} };
      try {
        // Find original folder name (with or without "(new)")
        let studentHandle: FileSystemDirectoryHandle | null = null;
        for await (const [name, entry] of sourceHandle.entries()) {
          if (entry.kind === "directory" && cleanStudentName(name) === student) {
            studentHandle = entry as FileSystemDirectoryHandle;
            break;
          }
        }
        
        if (!studentHandle) continue;

        const targetAssignments = assignmentName ? [assignmentName] : assignments;
        for (const devoir of targetAssignments) {
          row.assignments[devoir] = false;
          try {
            const devoirHandle = await studentHandle.getDirectoryHandle(devoir);
            // get last version folder by name sorting
            const versionNames: string[] = [];
            for await (const [vn, ventry] of devoirHandle.entries()) {
              if (ventry.kind === "directory") versionNames.push(vn);
            }
            versionNames.sort();
            const lastVersion = versionNames[versionNames.length - 1];
            if (!lastVersion) continue;
            const versionHandle = await devoirHandle.getDirectoryHandle(lastVersion);
            // take first file inside
            let fileHandle: FileSystemFileHandle | null = null;
            for await (const [fn, fent] of versionHandle.entries()) {
              if (fent.kind === "file") {
                fileHandle = fent as FileSystemFileHandle;
                break;
              }
            }
            if (!fileHandle) continue;
            const file = await fileHandle.getFile();
            const ext = file.name.includes(".") ? file.name.slice(file.name.lastIndexOf(".")) : "";
            const newName = `${student}${ext}`;
            
            // Add to ZIP
            const folder = zip.folder(devoir);
            if (folder) {
              folder.file(newName, file);
            }
            
            row.assignments[devoir] = true;
            log(`✓ Ajouté ${file.name} → ${devoir}/${newName}`);
          } catch (e) {
            // ignore missing assignment for this student
          }
        }
      } catch (e) {
        log(`Erreur pour ${student}: ${String(e)}`);
      }
      rows.push(row);
    }
    setReport(rows);
    setIsProcessing(false);
    
    // Generate ZIP blob
    const blob = await zip.generateAsync({ type: "blob" });
    return blob;
  }

  function generateCsv(): string {
    const header = ["Étudiant", ...assignments].join(",");
    const lines = [header];
    for (const r of report) {
      const cells = [r.student, ...assignments.map((a) => (r.assignments[a] ? "X" : ""))];
      lines.push(cells.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","));
    }
    return lines.join("\n");
  }

  return {
    sourceHandle,
    sourcePath,
    students,
    assignments,
    report,
    statusMessages,
    isProcessing,
    isScanning,
    pickSourceDirectory,
    processAssignment,
    generateCsv,
  };
}
