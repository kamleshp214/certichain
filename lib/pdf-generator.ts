import { PDFDocument, rgb, StandardFonts, PDFPage } from 'pdf-lib';
import QRCode from 'qrcode';

export interface CertificateTemplate {
  recipientName: string;
  courseName: string;
  institutionName: string;
  issuerName: string;
  instructorName?: string;
  certificateId: string;
  issueDate: string;
  expiryDate?: string;
  durationFrom?: string;
  durationTo?: string;
  grade?: string;
  template: 'academic' | 'corporate' | 'premium' | 'minimal';
  logoUrl?: string;
  signatureUrl?: string;
  qrPosition?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  logoPosition?: 'top-left' | 'top-center' | 'top-right';
  signaturePosition?: 'bottom-left' | 'bottom-center' | 'bottom-right';
}

// A4 Landscape: 842 x 595 points
const PAGE_WIDTH = 842;
const PAGE_HEIGHT = 595;

export async function generateCertificatePDF(data: CertificateTemplate): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  
  const timesRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const timesRomanBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const timesRomanItalic = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  switch (data.template) {
    case 'academic':
      await drawAcademicTemplate(page, data, { timesRoman, timesRomanBold, timesRomanItalic, helveticaBold }, pdfDoc);
      break;
    case 'corporate':
      await drawCorporateTemplate(page, data, { timesRoman, timesRomanBold, timesRomanItalic, helveticaBold }, pdfDoc);
      break;
    case 'premium':
      await drawPremiumTemplate(page, data, { timesRoman, timesRomanBold, timesRomanItalic, helveticaBold }, pdfDoc);
      break;
    case 'minimal':
      await drawMinimalTemplate(page, data, { timesRoman, timesRomanBold, timesRomanItalic, helveticaBold }, pdfDoc);
      break;
  }

  return await pdfDoc.save();
}

async function drawAcademicTemplate(page: PDFPage, data: CertificateTemplate, fonts: any, pdfDoc: PDFDocument) {
  const { timesRoman, timesRomanBold, timesRomanItalic, helveticaBold } = fonts;

  // Decorative border
  page.drawRectangle({
    x: 40,
    y: 40,
    width: PAGE_WIDTH - 80,
    height: PAGE_HEIGHT - 80,
    borderColor: rgb(0.15, 0.25, 0.45),
    borderWidth: 3,
  });

  page.drawRectangle({
    x: 50,
    y: 50,
    width: PAGE_WIDTH - 100,
    height: PAGE_HEIGHT - 100,
    borderColor: rgb(0.15, 0.25, 0.45),
    borderWidth: 1,
  });

  // Logo
  if (data.logoUrl) {
    await drawLogo(page, data.logoUrl, data.logoPosition || 'top-center', pdfDoc);
  }

  // Institution name
  page.drawText(data.institutionName.toUpperCase(), {
    x: PAGE_WIDTH / 2 - (data.institutionName.length * 6),
    y: PAGE_HEIGHT - 100,
    size: 18,
    font: helveticaBold,
    color: rgb(0.15, 0.25, 0.45),
  });

  // Title
  page.drawText('CERTIFICATE OF COMPLETION', {
    x: PAGE_WIDTH / 2 - 180,
    y: PAGE_HEIGHT - 150,
    size: 28,
    font: timesRomanBold,
    color: rgb(0.15, 0.25, 0.45),
  });

  // Decorative line
  page.drawLine({
    start: { x: PAGE_WIDTH / 2 - 150, y: PAGE_HEIGHT - 165 },
    end: { x: PAGE_WIDTH / 2 + 150, y: PAGE_HEIGHT - 165 },
    thickness: 2,
    color: rgb(0.7, 0.6, 0.3),
  });

  // Body text
  page.drawText('This is to certify that', {
    x: PAGE_WIDTH / 2 - 85,
    y: PAGE_HEIGHT - 220,
    size: 14,
    font: timesRomanItalic,
    color: rgb(0.3, 0.3, 0.3),
  });

  // Recipient name
  page.drawText(data.recipientName, {
    x: PAGE_WIDTH / 2 - (data.recipientName.length * 7),
    y: PAGE_HEIGHT - 260,
    size: 32,
    font: timesRomanBold,
    color: rgb(0.1, 0.1, 0.1),
  });

  // Underline
  page.drawLine({
    start: { x: PAGE_WIDTH / 2 - 200, y: PAGE_HEIGHT - 270 },
    end: { x: PAGE_WIDTH / 2 + 200, y: PAGE_HEIGHT - 270 },
    thickness: 1,
    color: rgb(0.5, 0.5, 0.5),
  });

  // Course completion text
  page.drawText('has successfully completed the course', {
    x: PAGE_WIDTH / 2 - 130,
    y: PAGE_HEIGHT - 310,
    size: 14,
    font: timesRomanItalic,
    color: rgb(0.3, 0.3, 0.3),
  });

  // Course name
  page.drawText(data.courseName, {
    x: PAGE_WIDTH / 2 - (data.courseName.length * 5.5),
    y: PAGE_HEIGHT - 345,
    size: 22,
    font: timesRomanBold,
    color: rgb(0.15, 0.25, 0.45),
  });

  // Duration if provided
  if (data.durationFrom && data.durationTo) {
    page.drawText(`Duration: ${data.durationFrom} to ${data.durationTo}`, {
      x: PAGE_WIDTH / 2 - 100,
      y: PAGE_HEIGHT - 380,
      size: 11,
      font: timesRoman,
      color: rgb(0.4, 0.4, 0.4),
    });
  }

  // Grade if provided
  if (data.grade) {
    page.drawText(`Grade: ${data.grade}`, {
      x: PAGE_WIDTH / 2 - 40,
      y: PAGE_HEIGHT - 400,
      size: 12,
      font: timesRomanBold,
      color: rgb(0.15, 0.25, 0.45),
    });
  }

  // Bottom section
  const bottomY = 120;

  // Issue date
  page.drawText(`Issue Date: ${data.issueDate}`, {
    x: 100,
    y: bottomY,
    size: 11,
    font: timesRoman,
    color: rgb(0.3, 0.3, 0.3),
  });

  // Expiry date if provided
  if (data.expiryDate) {
    page.drawText(`Valid Until: ${data.expiryDate}`, {
      x: 100,
      y: bottomY - 20,
      size: 11,
      font: timesRoman,
      color: rgb(0.3, 0.3, 0.3),
    });
  }

  // Signature section
  await drawSignature(page, data, fonts, data.signaturePosition || 'bottom-center');

  // QR Code
  await drawQRCode(page, data.certificateId, data.qrPosition || 'bottom-right', pdfDoc);

  // Certificate ID
  page.drawText(`Certificate ID: ${data.certificateId}`, {
    x: PAGE_WIDTH / 2 - 80,
    y: 50,
    size: 8,
    font: timesRoman,
    color: rgb(0.5, 0.5, 0.5),
  });

  // Blockchain label
  page.drawText('Verified on Polygon Blockchain', {
    x: PAGE_WIDTH / 2 - 75,
    y: 35,
    size: 7,
    font: timesRoman,
    color: rgb(0.6, 0.6, 0.6),
  });
}

async function drawCorporateTemplate(page: PDFPage, data: CertificateTemplate, fonts: any, pdfDoc: PDFDocument) {
  const { timesRoman, timesRomanBold, helveticaBold } = fonts;

  // Modern border
  page.drawRectangle({
    x: 30,
    y: 30,
    width: PAGE_WIDTH - 60,
    height: PAGE_HEIGHT - 60,
    borderColor: rgb(0.2, 0.4, 0.7),
    borderWidth: 4,
  });

  // Accent bar
  page.drawRectangle({
    x: 30,
    y: PAGE_HEIGHT - 120,
    width: PAGE_WIDTH - 60,
    height: 80,
    color: rgb(0.2, 0.4, 0.7),
  });

  // Logo
  if (data.logoUrl) {
    await drawLogo(page, data.logoUrl, data.logoPosition || 'top-left', pdfDoc);
  }

  // Institution name on accent bar
  page.drawText(data.institutionName.toUpperCase(), {
    x: 60,
    y: PAGE_HEIGHT - 80,
    size: 20,
    font: helveticaBold,
    color: rgb(1, 1, 1),
  });

  // Certificate title
  page.drawText('CERTIFICATE', {
    x: PAGE_WIDTH / 2 - 100,
    y: PAGE_HEIGHT - 180,
    size: 36,
    font: helveticaBold,
    color: rgb(0.2, 0.4, 0.7),
  });

  page.drawText('OF ACHIEVEMENT', {
    x: PAGE_WIDTH / 2 - 90,
    y: PAGE_HEIGHT - 210,
    size: 20,
    font: helveticaBold,
    color: rgb(0.3, 0.3, 0.3),
  });

  // Recipient
  page.drawText(data.recipientName, {
    x: PAGE_WIDTH / 2 - (data.recipientName.length * 6.5),
    y: PAGE_HEIGHT - 280,
    size: 30,
    font: timesRomanBold,
    color: rgb(0.1, 0.1, 0.1),
  });

  // Course
  page.drawText(`has successfully completed ${data.courseName}`, {
    x: PAGE_WIDTH / 2 - 180,
    y: PAGE_HEIGHT - 330,
    size: 16,
    font: timesRoman,
    color: rgb(0.3, 0.3, 0.3),
    maxWidth: 360,
  });

  // Grade
  if (data.grade) {
    page.drawText(`Final Grade: ${data.grade}`, {
      x: PAGE_WIDTH / 2 - 60,
      y: PAGE_HEIGHT - 370,
      size: 14,
      font: timesRomanBold,
      color: rgb(0.2, 0.4, 0.7),
    });
  }

  // Bottom info
  page.drawText(`Issued: ${data.issueDate}`, {
    x: 80,
    y: 100,
    size: 11,
    font: timesRoman,
    color: rgb(0.4, 0.4, 0.4),
  });

  // Signature
  await drawSignature(page, data, fonts, data.signaturePosition || 'bottom-right');

  // QR Code
  await drawQRCode(page, data.certificateId, data.qrPosition || 'bottom-left', pdfDoc);

  // Certificate ID
  page.drawText(data.certificateId, {
    x: PAGE_WIDTH / 2 - 60,
    y: 50,
    size: 9,
    font: timesRoman,
    color: rgb(0.5, 0.5, 0.5),
  });
}

async function drawPremiumTemplate(page: PDFPage, data: CertificateTemplate, fonts: any, pdfDoc: PDFDocument) {
  const { timesRoman, timesRomanBold, timesRomanItalic, helveticaBold } = fonts;

  // Ornamental double border
  page.drawRectangle({
    x: 35,
    y: 35,
    width: PAGE_WIDTH - 70,
    height: PAGE_HEIGHT - 70,
    borderColor: rgb(0.6, 0.5, 0.2),
    borderWidth: 5,
  });

  page.drawRectangle({
    x: 45,
    y: 45,
    width: PAGE_WIDTH - 90,
    height: PAGE_HEIGHT - 90,
    borderColor: rgb(0.6, 0.5, 0.2),
    borderWidth: 2,
  });

  // Corner decorations (simple lines)
  const cornerSize = 30;
  const corners = [
    { x: 55, y: PAGE_HEIGHT - 55 }, // top-left
    { x: PAGE_WIDTH - 55, y: PAGE_HEIGHT - 55 }, // top-right
    { x: 55, y: 55 }, // bottom-left
    { x: PAGE_WIDTH - 55, y: 55 }, // bottom-right
  ];

  corners.forEach(corner => {
    page.drawLine({
      start: { x: corner.x - cornerSize, y: corner.y },
      end: { x: corner.x + cornerSize, y: corner.y },
      thickness: 2,
      color: rgb(0.6, 0.5, 0.2),
    });
    page.drawLine({
      start: { x: corner.x, y: corner.y - cornerSize },
      end: { x: corner.x, y: corner.y + cornerSize },
      thickness: 2,
      color: rgb(0.6, 0.5, 0.2),
    });
  });

  // Logo
  if (data.logoUrl) {
    await drawLogo(page, data.logoUrl, data.logoPosition || 'top-center', pdfDoc);
  }

  // Institution
  page.drawText(data.institutionName, {
    x: PAGE_WIDTH / 2 - (data.institutionName.length * 5),
    y: PAGE_HEIGHT - 110,
    size: 16,
    font: timesRomanItalic,
    color: rgb(0.3, 0.3, 0.3),
  });

  // Title
  page.drawText('Certificate of Excellence', {
    x: PAGE_WIDTH / 2 - 140,
    y: PAGE_HEIGHT - 160,
    size: 30,
    font: timesRomanBold,
    color: rgb(0.6, 0.5, 0.2),
  });

  // Decorative line
  page.drawLine({
    start: { x: PAGE_WIDTH / 2 - 100, y: PAGE_HEIGHT - 175 },
    end: { x: PAGE_WIDTH / 2 + 100, y: PAGE_HEIGHT - 175 },
    thickness: 1,
    color: rgb(0.6, 0.5, 0.2),
  });

  // Presented to
  page.drawText('Presented to', {
    x: PAGE_WIDTH / 2 - 55,
    y: PAGE_HEIGHT - 220,
    size: 14,
    font: timesRomanItalic,
    color: rgb(0.4, 0.4, 0.4),
  });

  // Recipient
  page.drawText(data.recipientName, {
    x: PAGE_WIDTH / 2 - (data.recipientName.length * 7.5),
    y: PAGE_HEIGHT - 260,
    size: 34,
    font: timesRomanBold,
    color: rgb(0.1, 0.1, 0.1),
  });

  // Course
  page.drawText(`For outstanding achievement in ${data.courseName}`, {
    x: PAGE_WIDTH / 2 - 160,
    y: PAGE_HEIGHT - 310,
    size: 15,
    font: timesRoman,
    color: rgb(0.3, 0.3, 0.3),
    maxWidth: 320,
  });

  // Grade
  if (data.grade) {
    page.drawText(`With ${data.grade} distinction`, {
      x: PAGE_WIDTH / 2 - 80,
      y: PAGE_HEIGHT - 350,
      size: 13,
      font: timesRomanItalic,
      color: rgb(0.6, 0.5, 0.2),
    });
  }

  // Date
  page.drawText(`Awarded on ${data.issueDate}`, {
    x: PAGE_WIDTH / 2 - 70,
    y: PAGE_HEIGHT - 390,
    size: 12,
    font: timesRoman,
    color: rgb(0.4, 0.4, 0.4),
  });

  // Signature
  await drawSignature(page, data, fonts, data.signaturePosition || 'bottom-center');

  // QR Code
  await drawQRCode(page, data.certificateId, data.qrPosition || 'bottom-right', pdfDoc);

  // Certificate ID
  page.drawText(data.certificateId, {
    x: PAGE_WIDTH / 2 - 60,
    y: 60,
    size: 8,
    font: timesRoman,
    color: rgb(0.6, 0.6, 0.6),
  });
}

async function drawMinimalTemplate(page: PDFPage, data: CertificateTemplate, fonts: any, pdfDoc: PDFDocument) {
  const { timesRoman, timesRomanBold, helveticaBold } = fonts;

  // Simple border
  page.drawRectangle({
    x: 60,
    y: 60,
    width: PAGE_WIDTH - 120,
    height: PAGE_HEIGHT - 120,
    borderColor: rgb(0.2, 0.2, 0.2),
    borderWidth: 1,
  });

  // Logo
  if (data.logoUrl) {
    await drawLogo(page, data.logoUrl, data.logoPosition || 'top-left', pdfDoc);
  }

  // Institution
  page.drawText(data.institutionName, {
    x: 100,
    y: PAGE_HEIGHT - 110,
    size: 14,
    font: helveticaBold,
    color: rgb(0.2, 0.2, 0.2),
  });

  // Title
  page.drawText('CERTIFICATE', {
    x: PAGE_WIDTH / 2 - 90,
    y: PAGE_HEIGHT - 180,
    size: 40,
    font: helveticaBold,
    color: rgb(0.1, 0.1, 0.1),
  });

  // Recipient
  page.drawText(data.recipientName, {
    x: PAGE_WIDTH / 2 - (data.recipientName.length * 6),
    y: PAGE_HEIGHT - 260,
    size: 28,
    font: timesRomanBold,
    color: rgb(0.2, 0.2, 0.2),
  });

  // Course
  page.drawText(data.courseName, {
    x: PAGE_WIDTH / 2 - (data.courseName.length * 4.5),
    y: PAGE_HEIGHT - 310,
    size: 18,
    font: timesRoman,
    color: rgb(0.3, 0.3, 0.3),
  });

  // Date
  page.drawText(data.issueDate, {
    x: 100,
    y: 120,
    size: 11,
    font: timesRoman,
    color: rgb(0.4, 0.4, 0.4),
  });

  // Signature
  await drawSignature(page, data, fonts, data.signaturePosition || 'bottom-right');

  // QR Code
  await drawQRCode(page, data.certificateId, data.qrPosition || 'bottom-left', pdfDoc);

  // Certificate ID
  page.drawText(data.certificateId, {
    x: PAGE_WIDTH / 2 - 60,
    y: 80,
    size: 8,
    font: timesRoman,
    color: rgb(0.6, 0.6, 0.6),
  });
}

async function drawLogo(page: PDFPage, logoUrl: string, position: string, pdfDoc: PDFDocument) {
  try {
    const logoBytes = await fetch(logoUrl).then(res => res.arrayBuffer());
    const logoImage = logoUrl.toLowerCase().endsWith('.png') 
      ? await pdfDoc.embedPng(logoBytes)
      : await pdfDoc.embedJpg(logoBytes);
    
    const logoSize = 60;
    let x = 80;
    let y = PAGE_HEIGHT - 90;

    if (position === 'top-center') {
      x = PAGE_WIDTH / 2 - logoSize / 2;
    } else if (position === 'top-right') {
      x = PAGE_WIDTH - 140;
    }

    page.drawImage(logoImage, {
      x,
      y,
      width: logoSize,
      height: logoSize,
    });
  } catch (error) {
    console.error('Error drawing logo:', error);
  }
}

async function drawSignature(page: PDFPage, data: CertificateTemplate, fonts: any, position: string) {
  const { timesRoman, timesRomanBold } = fonts;
  
  let x = 100;
  const y = 140;

  if (position === 'bottom-center') {
    x = PAGE_WIDTH / 2 - 60;
  } else if (position === 'bottom-right') {
    x = PAGE_WIDTH - 250;
  }

  if (data.signatureUrl) {
    try {
      const sigBytes = await fetch(data.signatureUrl).then(res => res.arrayBuffer());
      const sigImage = data.signatureUrl.toLowerCase().endsWith('.png')
        ? await page.doc.embedPng(sigBytes)
        : await page.doc.embedJpg(sigBytes);
      
      page.drawImage(sigImage, {
        x,
        y: y + 20,
        width: 100,
        height: 40,
      });
    } catch (error) {
      console.error('Error drawing signature:', error);
    }
  }

  page.drawLine({
    start: { x, y: y + 15 },
    end: { x: x + 120, y: y + 15 },
    thickness: 1,
    color: rgb(0.3, 0.3, 0.3),
  });

  page.drawText(data.instructorName || data.issuerName, {
    x,
    y,
    size: 12,
    font: timesRomanBold,
    color: rgb(0.2, 0.2, 0.2),
  });

  page.drawText('Authorized Signatory', {
    x,
    y: y - 15,
    size: 9,
    font: timesRoman,
    color: rgb(0.5, 0.5, 0.5),
  });
}

async function drawQRCode(page: PDFPage, certificateId: string, position: string, pdfDoc: PDFDocument) {
  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/verify/${certificateId}`;
  const qrCodeDataUrl = await QRCode.toDataURL(verifyUrl, { width: 100, margin: 1 });
  const qrImageBytes = await fetch(qrCodeDataUrl).then(res => res.arrayBuffer());
  const qrImage = await pdfDoc.embedPng(qrImageBytes);
  
  let x = PAGE_WIDTH - 140;
  let y = 80;

  if (position === 'bottom-left') {
    x = 80;
  } else if (position === 'top-right') {
    y = PAGE_HEIGHT - 140;
  } else if (position === 'top-left') {
    x = 80;
    y = PAGE_HEIGHT - 140;
  }

  page.drawImage(qrImage, {
    x,
    y,
    width: 80,
    height: 80,
  });

  page.drawText('Scan to Verify', {
    x: x + 5,
    y: y - 12,
    size: 7,
    font: await pdfDoc.embedFont(StandardFonts.TimesRoman),
    color: rgb(0.5, 0.5, 0.5),
  });
}
