import JSZip from 'jszip';
import { Packer } from 'docx';
import { StudentReport, ColumnMapping } from '../types';
import { parseExcelSheet, getExcelHeaders, resolveHeaders } from './excelParser';
import { buildReportDocument } from './reportBuilder';
import * as XLSX from 'xlsx';

export interface GenerateReportsOptions {
  excelBuffer: ArrayBuffer;
  sheetName: string;
  columnMapping?: ColumnMapping;
  startDate?: Date;
  endDate?: Date;
  filterProgram?: string;
  onProgress?: (message: string, type: 'success' | 'error' | 'warning' | 'info') => void;
}

/**
 * Sanitise un nom de fichier
 */
function sanitizeFilename(name: string): string {
  if (!name) return 'document';
  let sanitized = name.trim();
  sanitized = sanitized.replace(/[\\/*?":<>|]/g, '-');
  sanitized = sanitized.replace(/\s+/g, ' ');
  sanitized = sanitized.replace(/-{2,}/g, '-');
  sanitized = sanitized.replace(/[\s.]+$/, '');
  return sanitized.substring(0, 120) || 'document';
}

/**
 * Récupère la partie locale d'une adresse email
 */
function getLocalPartFromEmail(email: string): string {
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return 'etudiant';
  }
  const localPart = email.split('@')[0].trim();
  return sanitizeFilename(localPart) || 'etudiant';
}

/**
 * Génère un ou plusieurs rapports
 * Retourne le fichier Blob à télécharger (Word ou ZIP)
 */
export async function generateReports(options: GenerateReportsOptions): Promise<{
  blob: Blob;
  filename: string;
  studentCount: number;
}> {
  const { excelBuffer, sheetName, startDate, endDate, filterProgram, onProgress } = options;

  if (!onProgress) {
    console.log('generateReports started');
  }

  // Lit la feuille Excel
  const workbook = XLSX.read(excelBuffer, { type: 'array' });
  const worksheet = workbook.Sheets[sheetName];

  if (!worksheet) {
    throw new Error(`Feuille '${sheetName}' non trouvée`);
  }

  // Détecte automatiquement les en-têtes si pas fourni
  let columnMapping = options.columnMapping;
  if (!columnMapping) {
    const headers = getExcelHeaders(worksheet);
    columnMapping = resolveHeaders(headers);
    onProgress?.(`En-têtes détectés automatiquement`, 'success');
  }

  // Parse les données
  const studentReports = parseExcelSheet(worksheet, columnMapping, startDate, endDate, filterProgram);

  if (studentReports.length === 0) {
    throw new Error('Aucun étudiant ne correspond aux critères de filtrage');
  }

  onProgress?.(`${studentReports.length} étudiant(s) trouvé(s)`, 'info');

  // Génère les documents Word
  const documents: { report: StudentReport; buffer: Buffer }[] = [];

  for (let i = 0; i < studentReports.length; i++) {
    const studentReport = studentReports[i];
    const doc = buildReportDocument(studentReport);
    const buffer = await Packer.toBuffer(doc);
    documents.push({ report: studentReport, buffer });

    onProgress?.(
      `Rapport généré pour ${studentReport.nom || studentReport.email} (${i + 1}/${studentReports.length})`,
      'success',
    );
  }

  // Si un seul document, retourne directement
  if (documents.length === 1) {
    const { report, buffer } = documents[0];
    const localPart = getLocalPartFromEmail(report.email);
    const filename = `${sanitizeFilename(report.nom)}-${localPart}.docx`;

    return {
      blob: new Blob([new Uint8Array(buffer)], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      }),
      filename,
      studentCount: 1,
    };
  }

  // Sinon, bundle en ZIP
  const zip = new JSZip();

  for (const { report, buffer } of documents) {
    const localPart = getLocalPartFromEmail(report.email);
    const filename = `${sanitizeFilename(report.nom)}-${localPart}.docx`;
    zip.file(filename, buffer);
  }

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  const timestamp = new Date().toISOString().split('T')[0];
  const zipFilename = `Rapports-de-stage-${timestamp}.zip`;

  onProgress?.(`Archive ZIP créée : ${documents.length} rapports`, 'success');

  return {
    blob: zipBlob,
    filename: zipFilename,
    studentCount: documents.length,
  };
}
