import * as ExcelJS from "exceljs";
import { PROGRAMMATION_CODES, RESEAUTIQUE_CODES } from "../constants";

export async function buildEvaluationWorkbook(
  buffer: ArrayBuffer,
  displayName: string,
  profileCode: string
): Promise<ArrayBuffer> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);

  const sheet = workbook.getWorksheet("evaluation");
  if (!sheet) {
    throw new Error(
      "La feuille 'evaluation' est absente du gabarit d'évaluation."
    );
  }

  const cellA1 = sheet.getCell("A1");
  cellA1.value = displayName;

  const track = PROGRAMMATION_CODES.has(profileCode)
    ? "Programmation"
    : RESEAUTIQUE_CODES.has(profileCode)
      ? "Réseautique"
      : profileCode;

  const cellA2 = sheet.getCell("A2");
  cellA2.value = track;

  return await workbook.xlsx.writeBuffer();
}
