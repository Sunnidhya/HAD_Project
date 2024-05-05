import { PDFDocument, rgb } from 'pdf-lib';

async function generateDoctorReportPdf(formData) {
  const pdfDoc = await PDFDocument.create();

  const page = pdfDoc.addPage();

  const fontSize = 20;
  const textX = 50;
  const textY = page.getHeight() - 50;
  const textOptions = { size: fontSize, color: rgb(0, 0, 0) };
  page.drawText(`Doctor Report`, { x: textX, y: textY, ...textOptions });

  const dataX = textX;
  const dataY = textY - fontSize * 2;
  const dataOptions = { size: fontSize - 4, color: rgb(0, 0, 0) };
  const dataLines = Object.entries(formData).map(([key, value], index) => `${key}: ${value}`);
  page.drawText(dataLines.join('\n'), { x: dataX, y: dataY, ...dataOptions });

  const pdfBytes = await pdfDoc.save();

  return pdfBytes;
}

export default generateDoctorReportPdf;