import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

async function generateDoctorReportPdfRadio(formData) {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  
  // Add a new page to the document
  const page = pdfDoc.addPage();
  
  // Set up text parameters
  const fontSizeKavach = 24;
  const fontSizeTitle = 18;
  const fontSizeData = 16;
  const textX = 50;
  let textY = page.getHeight() - 50;
  const titleOptions = { size: fontSizeTitle, color: rgb(0, 0, 0), font: await pdfDoc.embedFont(StandardFonts.HelveticaBold) };
  const kavachOptions = { size: fontSizeKavach, color: rgb(0, 0, 0), font: await pdfDoc.embedFont(StandardFonts.HelveticaBold) };
  const dataOptions = { size: fontSizeData, color: rgb(0, 0, 0)};
  const dataOptions1 = { size: fontSizeData, color: rgb(0, 0, 0), font: await pdfDoc.embedFont(StandardFonts.HelveticaBold) };
  
  // Draw Kavach text
  const kavachText = "Kavach - India's Leading TeleRadiology Platform";
  const kavachWidth = kavachOptions.font.widthOfTextAtSize(kavachText, fontSizeKavach);
  const kavachX = (page.getWidth() - kavachWidth) / 2;
  page.drawText(kavachText, { x: kavachX, y: textY, ...kavachOptions });
  
  // Move the y position up for the Radiologist Impression title
  textY -= fontSizeKavach + 10;
  
  // Draw title text with bold and underline style
  const titleText = 'Radiologist Impression';
  const titleWidth = titleOptions.font.widthOfTextAtSize(titleText, fontSizeTitle);
  const titleX = (page.getWidth() - titleWidth) / 2;
  page.drawText(titleText, { x: titleX, y: textY, ...titleOptions });

  // Draw underline for Radiologist Impression text
  page.drawLine({
    start: { x: titleX, y: textY - 5 },
    end: { x: titleX + titleWidth, y: textY - 5 },
    thickness: 1,
    color: rgb(0, 0, 0)
  });
  
  // Move the y position up for the table headers
  textY -= fontSizeTitle + 20;

  // Draw table headers
  page.drawText("Name", { x: textX, y: textY, ...dataOptions1 });
  page.drawText("Impression", { x: textX + 200, y: textY, ...dataOptions1 });

  // Move the y position up for the table data
  textY -= 10;
  
  // Draw the data in tabular format
  formData.forEach(({ RadioLogist_Name, Impression }) => {
    textY -= fontSizeData * 1.5;
    page.drawText(RadioLogist_Name, { x: textX, y: textY, ...dataOptions });
    page.drawText(Impression, { x: textX + 200, y: textY, ...dataOptions });
  });

  // Save the PDF document as bytes
  const pdfBytes = await pdfDoc.save();
  
  // Return the generated PDF bytes
  return pdfBytes;
}

export default generateDoctorReportPdfRadio;
