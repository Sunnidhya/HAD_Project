import { PDFDocument, rgb, StandardFonts, drawLinesOfText } from 'pdf-lib';

async function generateDoctorReportPdf(formData) {
  console.warn("DataForm", formData)
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();

  const fontSizeTitle = 18; // Reduced font size for the title
  const fontSizeSubTitle = 24; // Reduced font size for the subtitle
  const fontSizeData = 12;
  const textX = 50;
  const startY = page.getHeight() - 50;

  const subTitleText = 'Kavach - India\'s leading TeleRadiology Platform';
  const titleText = 'Doctor\'s Report';

  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const subTitleWidth = font.widthOfTextAtSize(subTitleText, fontSizeSubTitle);
  const titleWidth = font.widthOfTextAtSize(titleText, fontSizeTitle);

  const titleX = (page.getWidth() - titleWidth) / 2;
  const subTitleX = (page.getWidth() - subTitleWidth) / 2;

  const titleOptions = {
    size: fontSizeTitle,
    color: rgb(0, 0, 0),
    font: font
  };
  const subTitleOptions = { size: fontSizeSubTitle, color: rgb(0, 0, 0), font: font };

  // Draw Subtitle
  page.drawText(subTitleText, { x: subTitleX, y: startY, ...subTitleOptions });

  // Adjust startY position for title
  const titleY = startY - fontSizeSubTitle - 10;

  // Draw Title
  page.drawText(titleText, { x: titleX, y: titleY, ...titleOptions });

  // Draw underline for Title
  page.drawLine({
    start: { x: titleX, y: titleY - 5 },
    end: { x: titleX + titleWidth, y: titleY - 5 },
    thickness: 1,
    color: rgb(0, 0, 0)
  });

  const dataX = textX;
  let dataY = titleY - fontSizeTitle - 10;

  const dataOptions = { size: fontSizeData, color: rgb(0, 0, 0), font: await pdfDoc.embedFont(StandardFonts.HelveticaBold) };
  const dataOptions1 = { size: fontSizeData, color: rgb(0, 0, 0) };
  const dataLines = Object.entries(formData);

  const columnWidth = page.getWidth() / 2 - textX-80;
  const columnGap = 10;

  dataLines.forEach((entry, index) => {
    const key = entry[0];
    const value = entry[1] !== null && entry[1] !== undefined ? entry[1] : '';

    const rowIndex = index;
    const x = dataX;
    const y = dataY - rowIndex * fontSizeData * 1.5;

    page.drawText(key, { x, y, ...dataOptions });
    page.drawText(value, { x: x + columnWidth, y, ...dataOptions1 });
  });

  const pdfBytes = await pdfDoc.save();

  return pdfBytes;
}

export default generateDoctorReportPdf;
