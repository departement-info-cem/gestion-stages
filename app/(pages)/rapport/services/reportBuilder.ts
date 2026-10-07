import {
  Document,
  Paragraph,
  HeadingLevel,
  TextRun,
  PageBreak,
  AlignmentType,
} from 'docx';
import { StudentReport, ReportSection } from '../types';
import { INCLUDED_SECTIONS, TITLE_TEMPLATE, EMPTY_ANSWER_PLACEHOLDER } from '../constants';

/**
 * Formate une date pour affichage
 */
function formatDateTime(date: Date): string {
  if (!date || isNaN(date.getTime())) return '';
  const locale = 'fr-CA';
  return date.toLocaleString(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Formate une durée (ms) en texte lisible
 */
function formatTimeDelta(startDate: Date, endDate: Date): string {
  if (!startDate || !endDate) return '';
  const deltaMs = endDate.getTime() - startDate.getTime();
  if (deltaMs < 0) return '';

  const totalSeconds = Math.floor(deltaMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours} h`);
  if (minutes > 0) parts.push(`${minutes} min`);
  if (seconds > 0 || parts.length === 0) parts.push(`${seconds} s`);

  return parts.join(' ');
}

/**
 * Crée les paragraphes pour une section de rapport
 */
function createSectionParagraphs(
  section: ReportSection,
  studentReport: StudentReport,
): Paragraph[] {
  const paragraphs: Paragraph[] = [];

  // Saut de page optionnel
  if (section.page_break_before) {
    paragraphs.push(new Paragraph({ pageBreakBefore: true, text: '' }));
  }

  // Titre de section (heading level 2)
  paragraphs.push(
    new Paragraph({
      text: section.title,
      heading: HeadingLevel.HEADING_2,
      spacing: { after: 200 },
    }),
  );

  // Intro si fournie
  if (section.intro) {
    const introLines = section.intro.split('\n');
    for (const line of introLines) {
      paragraphs.push(
        new Paragraph({
          text: line,
          spacing: { after: 100 },
        }),
      );
    }
  }

  // Questions et réponses
  for (const question of section.questions) {
    // Question (en gras)
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: question,
            bold: true,
          }),
        ],
        spacing: { after: 100, before: 100 },
      }),
    );

    // Réponse
    let answer = studentReport.responses[question];
    if (!answer || answer.trim() === '') {
      answer = EMPTY_ANSWER_PLACEHOLDER;
    }

    // Gère le texte multi-ligne
    const answerLines = answer.split('\n');
    for (let i = 0; i < answerLines.length; i++) {
      const line = answerLines[i];
      if (i === 0) {
        paragraphs.push(
          new Paragraph({
            text: line,
            spacing: { after: i === answerLines.length - 1 ? 200 : 50 },
          }),
        );
      } else {
        paragraphs.push(
          new Paragraph({
            text: line,
            spacing: { after: i === answerLines.length - 1 ? 200 : 50 },
          }),
        );
      }
    }
  }

  return paragraphs;
}

/**
 * Construit un document Word complet pour un étudiant
 */
export function buildReportDocument(studentReport: StudentReport): Document {
  const sections: Paragraph[] = [];

  // === Première page : Titre
  const titleName = studentReport.nom || studentReport.email;
  const title = TITLE_TEMPLATE.replace('{Nom}', titleName);

  sections.push(
    new Paragraph({
      text: title,
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
    }),
  );

  // === Bloc méta-information
  const metaLines: string[] = [];

  if (studentReport.programme) {
    metaLines.push(`Programme : ${studentReport.programme}`);
  }

  // Extrait la partie locale de l'email (avant @)
  const localPart = studentReport.email.split('@')[0] || 'etudiant';
  metaLines.push(`Numéro d'étudiant : ${localPart}`);

  metaLines.push(`Formulaire complété le : ${formatDateTime(studentReport.endTime)}`);

  const timeDelta = formatTimeDelta(studentReport.startTime, studentReport.endTime);
  if (timeDelta) {
    metaLines.push(`Formulaire complété en : ${timeDelta}`);
  }

  for (const metaLine of metaLines) {
    sections.push(
      new Paragraph({
        text: metaLine,
        spacing: { after: 100 },
      }),
    );
  }

  sections.push(new Paragraph({ text: '', spacing: { after: 300 } }));

  // === Sections Q/R
  for (const section of INCLUDED_SECTIONS) {
    const sectionParagraphs = createSectionParagraphs(section, studentReport);
    sections.push(...sectionParagraphs);
  }

  // Crée et retourne le document
  return new Document({
    sections: [
      {
        children: sections,
      },
    ],
  });
}
