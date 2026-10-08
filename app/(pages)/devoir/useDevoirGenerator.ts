"use client";

import { useCallback, useState } from "react";
import type { AssignmentsArchive, ReportRow, StudentFolder, SubmissionsScan } from "./types";
import { scanSubmissions } from "./utils/submissionTree";
import { buildReportCsv } from "./utils/reportCsv";
import { buildAssignmentsZip } from "./services/buildAssignmentsZip";
import { downloadBlob } from "@/app/utils/downloadUtils";

const ALL_ASSIGNMENTS_ZIP_NAME: string = "devoirs.zip";
const REPORT_FILE_NAME: string = "rapport_devoirs.csv";

export function useDevoirGenerator() {
  const [sourceHandle, setSourceHandle] = useState<FileSystemDirectoryHandle | null>(null);
  const [students, setStudents] = useState<StudentFolder[]>([]);
  const [assignments, setAssignments] = useState<string[]>([]);
  const [report, setReport] = useState<ReportRow[]>([]);
  const [reportAssignments, setReportAssignments] = useState<string[]>([]);
  const [statusMessages, setStatusMessages] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(false);

  const log = useCallback((message: string) => {
    setStatusMessages((messages) => [...messages, message]);
  }, []);

  function resetScan() {
    setStudents([]);
    setAssignments([]);
    setReport([]);
    setReportAssignments([]);
  }

  async function pickSourceDirectory() {
    let handle: FileSystemDirectoryHandle;
    try {
      handle = await window.showDirectoryPicker();
    } catch {
      log("Sélection annulée ou non supportée par ce navigateur.");
      return;
    }

    setSourceHandle(handle);
    setStatusMessages([]);
    resetScan();
    setIsScanning(true);
    log(`Scan de « ${handle.name} » en cours...`);
    try {
      const scan: SubmissionsScan | null = await scanSubmissions(handle);
      if (!scan) {
        log(
          "✗ Aucun dossier d'étudiant reconnu. Sélectionnez le dossier « Submitted files » " +
            "(ou son dossier parent) : chaque étudiant doit contenir ses devoirs, " +
            "eux-mêmes organisés en dossiers « Version N »."
        );
        return;
      }
      setStudents(scan.students);
      setAssignments(scan.assignments);
      if (scan.root !== handle) log(`Dossier des remises détecté : « ${scan.root.name} ».`);
      log(`✓ Scanné ${scan.students.length} étudiants et ${scan.assignments.length} devoirs.`);
    } catch (error) {
      log(`✗ Erreur lors du scan : ${String(error)}`);
    } finally {
      setIsScanning(false);
    }
  }

  async function downloadAssignmentsZip(assignmentName: string | null) {
    if (!sourceHandle) {
      log("Source non sélectionnée.");
      return;
    }
    const targets: string[] = assignmentName ? [assignmentName] : assignments;
    setIsProcessing(true);
    log(assignmentName ? `Traitement de « ${assignmentName} »...` : "Traitement de tous les devoirs...");
    try {
      const archive: AssignmentsArchive = await buildAssignmentsZip(students, targets, log);
      setReport(archive.rows);
      setReportAssignments(targets);
      if (archive.filesCount === 0) {
        log("✗ Aucun fichier trouvé : aucune archive n'a été générée.");
        return;
      }
      downloadBlob(archive.zip, assignmentName ? `${assignmentName}.zip` : ALL_ASSIGNMENTS_ZIP_NAME);
      log(`✓ Archive générée : ${archive.filesCount} fichiers.`);
    } catch (error) {
      log(`✗ Erreur lors de la génération de l'archive : ${String(error)}`);
    } finally {
      setIsProcessing(false);
    }
  }

  function downloadReportCsv() {
    const csv: string = buildReportCsv(report, reportAssignments);
    downloadBlob(new Blob([csv], { type: "text/csv;charset=utf-8" }), REPORT_FILE_NAME);
  }

  return {
    sourceHandle,
    students,
    assignments,
    report,
    statusMessages,
    isProcessing,
    isScanning,
    pickSourceDirectory,
    downloadAssignmentsZip,
    downloadReportCsv,
  };
}
