import { PDFDocument, rgb } from 'pdf-lib';

async function generateDoctorReportPdfRadio(formData) {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  
  // Add a new page to the document
  const page = pdfDoc.addPage();
  
  // Set up text parameters
  const fontSize = 20;
  const textX = 50;
  const textY = page.getHeight() - 50;
  const textOptions = { size: fontSize, color: rgb(0, 0, 0) };
  
  // Draw title text
  page.drawText(`Radiologist Impression`, { x: textX, y: textY, ...textOptions });
  
  // Set up data parameters
  const dataX = textX;
  const dataY = textY - fontSize * 2;
  const dataOptions = { size: fontSize - 4, color: rgb(0, 0, 0) };
  
  // Generate an array of lines for each form data
  const dataLines = formData.map(data => `${data.RadioLogist_Name}: ${data.Impression}`);
  
  // Draw the data lines on the page
  for (let i = 0; i < dataLines.length; i++) {
    const line = dataLines[i];
    const y = dataY - i * fontSize;
    page.drawText(line, { x: dataX, y: y, ...dataOptions });
  }
  
  // Save the PDF document as bytes
  const pdfBytes = await pdfDoc.save();
  
  // Return the generated PDF bytes
  return pdfBytes;
}

export default generateDoctorReportPdfRadio;
