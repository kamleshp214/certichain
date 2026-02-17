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
  try {
    console.log('Generating PDF for template:', data.template);
    console.log('Certificate data:', data);
    
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    
    const timesRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const timesRomanBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
    const timesRomanItalic = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const fonts = { timesRoman, timesRomanBold, timesRomanItalic, helveticaBold };

    switch (data.template) {
      case 'academic':
        await drawAcademicTemplate(page, data, fonts, pdfDoc);
        break;
      case 'corporate':
        await drawCorporateTemplate(page, data, fonts, pdfDoc);
        break;
      case 'premium':
        await drawPremiumTemplate(page, data, fonts, pdfDoc);
        break;
      case 'minimal':
        await drawMinimalTemplate(page, data, fonts, pdfDoc);
        break;
      default:
        console.warn('Unknown template, using academic:', data.template);
        await drawAcademicTemplate(page, data, fonts, pdfDoc);
    }

    const pdfBytes = await pdfDoc.save();
    console.log('PDF generated successfully, size:', pdfBytes.length);
    return pdfBytes;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}

async function drawAcademicTemplate(page: PDFPage, data: CertificateTemplate, fonts: any, pdfDoc: PDFDocument) {
  const { timesRoman, timesRomanBold, timesRomanItalic, helveticaBold } = fonts;

  // Double decorative border
  page.drawRectangle({
    x: 30,
    y: 30,
    width: PAGE_WIDTH - 60,
    height: PAGE_HEIGHT - 60,
    borderColor: rgb(0.1, 0.2, 0.5),
    borderWidth: 3,
  });

  page.drawRectangle({
    x: 40,
    y: 40,
    width: PAGE_WIDTH - 80,
    height: PAGE_HEIGHT - 80,
    borderColor: rgb(0.1, 0.2, 0.5),
    borderWidth: 1,
  });

  // Logo
  if (data.logoUrl && data.logoUrl !== '') {
    await drawLogo(page, data.logoUrl, 'top-center', pdfDoc);
  }

  // Institution name
  const institutionName = (data.institutionName || 'Institution').toUpperCase();
  const institutionText = institutionName;
  const institutionWidth = helveticaBold.widthOfTextAtSize(institutionText, 12);
  page.drawText(institutionText, {
    x: PAGE_WIDTH / 2 - institutionWidth / 2,
    y: PAGE_HEIGHT - 90,
    size: 12,
    font: helveticaBold,
    color: rgb(0.1, 0.2, 0.5),
  });

  // Title
  const titleText = 'CERTIFICATE OF COMPLETION';
  const titleWidth = timesRomanBold.widthOfTextAtSize(titleText, 24);
  page.drawText(titleText, {
    x: PAGE_WIDTH / 2 - titleWidth / 2,
    y: PAGE_HEIGHT - 140,
    size: 24,
    font: timesRomanBold,
    color: rgb(0.1, 0.2, 0.5),
  });

  // Decorative line under title
  page.drawLine({
    start: { x: PAGE_WIDTH / 2 - 100, y: PAGE_HEIGHT - 150 },
    end: { x: PAGE_WIDTH / 2 + 100, y: PAGE_HEIGHT - 150 },
    thickness: 2,
    color: rgb(0.7, 0.6, 0.2),
  });

  // Body text
  const certifyText = 'This is to certify that';
  const certifyWidth = timesRomanItalic.widthOfTextAtSize(certifyText, 12);
  page.drawText(certifyText, {
    x: PAGE_WIDTH / 2 - certifyWidth / 2,
    y: PAGE_HEIGHT - 200,
    size: 12,
    font: timesRomanItalic,
    color: rgb(0.3, 0.3, 0.3),
  });

  // Recipient name
  const recipientName = data.recipientName || 'Recipient Name';
  const recipientWidth = timesRomanBold.widthOfTextAtSize(recipientName, 28);
  page.drawText(recipientName, {
    x: PAGE_WIDTH / 2 - recipientWidth / 2,
    y: PAGE_HEIGHT - 240,
    size: 28,
    font: timesRomanBold,
    color: rgb(0.1, 0.1, 0.1),
  });

  // Underline recipient name
  page.drawLine({
    start: { x: PAGE_WIDTH / 2 - 180, y: PAGE_HEIGHT - 250 },
    end: { x: PAGE_WIDTH / 2 + 180, y: PAGE_HEIGHT - 250 },
    thickness: 1,
    color: rgb(0.5, 0.5, 0.5),
  });

  // Course completion text
  const completedText = 'has successfully completed the course';
  const completedWidth = timesRomanItalic.widthOfTextAtSize(completedText, 12);
  page.drawText(completedText, {
    x: PAGE_WIDTH / 2 - completedWidth / 2,
    y: PAGE_HEIGHT - 285,
    size: 12,
    font: timesRomanItalic,
    color: rgb(0.3, 0.3, 0.3),
  });

  // Course name
  const courseName = data.courseName || 'Course Name';
  const courseWidth = timesRomanBold.widthOfTextAtSize(courseName, 18);
  page.drawText(courseName, {
    x: PAGE_WIDTH / 2 - courseWidth / 2,
    y: PAGE_HEIGHT - 320,
    size: 18,
    font: timesRomanBold,
    color: rgb(0.1, 0.2, 0.5),
  });

  // Grade if provided
  if (data.grade) {
    const gradeText = `Grade: ${data.grade}`;
    const gradeWidth = timesRomanBold.widthOfTextAtSize(gradeText, 11);
    page.drawText(gradeText, {
      x: PAGE_WIDTH / 2 - gradeWidth / 2,
      y: PAGE_HEIGHT - 355,
      size: 11,
      font: timesRomanBold,
      color: rgb(0.1, 0.2, 0.5),
    });
  }

  // Duration if provided
  if (data.durationFrom && data.durationTo) {
    const durationText = `Duration: ${data.durationFrom} to ${data.durationTo}`;
    const durationWidth = timesRoman.widthOfTextAtSize(durationText, 9);
    page.drawText(durationText, {
      x: PAGE_WIDTH / 2 - durationWidth / 2,
      y: PAGE_HEIGHT - 380,
      size: 9,
      font: timesRoman,
      color: rgb(0.4, 0.4, 0.4),
    });
  }

  // Bottom section - Issue date
  page.drawText('Issue Date', {
    x: 80,
    y: 110,
    size: 9,
    font: timesRoman,
    color: rgb(0.4, 0.4, 0.4),
  });

  const issueDate = data.issueDate || new Date().toLocaleDateString();
  page.drawText(issueDate, {
    x: 80,
    y: 95,
    size: 10,
    font: timesRomanBold,
    color: rgb(0.2, 0.2, 0.2),
  });

  // Signature section
  await drawSignature(page, data, fonts, 'bottom-center');

  // QR Code
  await drawQRCode(page, data.certificateId, 'bottom-right', pdfDoc);

  // Certificate ID
  const certId = data.certificateId || 'N/A';
  const certIdText = `Certificate ID: ${certId}`;
  const certIdWidth = timesRoman.widthOfTextAtSize(certIdText, 8);
  page.drawText(certIdText, {
    x: PAGE_WIDTH / 2 - certIdWidth / 2,
    y: 50,
    size: 8,
    font: timesRoman,
    color: rgb(0.5, 0.5, 0.5),
  });

  // Blockchain verification text
  const blockchainText = 'Verified on Polygon Blockchain';
  const blockchainWidth = timesRoman.widthOfTextAtSize(blockchainText, 7);
  page.drawText(blockchainText, {
    x: PAGE_WIDTH / 2 - blockchainWidth / 2,
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
    x: 25,
    y: 25,
    width: PAGE_WIDTH - 50,
    height: PAGE_HEIGHT - 50,
    borderColor: rgb(0.15, 0.15, 0.15),
    borderWidth: 3,
  });

  // Header bar
  page.drawRectangle({
    x: 25,
    y: PAGE_HEIGHT - 90,
    width: PAGE_WIDTH - 50,
    height: 60,
    color: rgb(0.15, 0.15, 0.15),
  });

  // Logo on header bar
  if (data.logoUrl && data.logoUrl !== '') {
    try {
      const logoBytes = await fetch(data.logoUrl).then(res => res.arrayBuffer());
      const logoImage = data.logoUrl.toLowerCase().endsWith('.png') 
        ? await pdfDoc.embedPng(logoBytes)
        : await pdfDoc.embedJpg(logoBytes);
      
      page.drawImage(logoImage, {
        x: 50,
        y: PAGE_HEIGHT - 80,
        width: 40,
        height: 40,
      });
    } catch (error) {
      console.error('Error drawing logo:', error);
    }
  }

  // Institution name on header bar
  const institutionName = (data.institutionName || 'Institution').toUpperCase();
  page.drawText(institutionName, {
    x: 100,
    y: PAGE_HEIGHT - 60,
    size: 14,
    font: helveticaBold,
    color: rgb(1, 1, 1),
  });

  // Certificate title
  const certText = 'CERTIFICATE';
  const certWidth = helveticaBold.widthOfTextAtSize(certText, 32);
  page.drawText(certText, {
    x: PAGE_WIDTH / 2 - certWidth / 2,
    y: PAGE_HEIGHT - 160,
    size: 32,
    font: helveticaBold,
    color: rgb(0.15, 0.15, 0.15),
  });

  const achievementText = 'OF ACHIEVEMENT';
  const achievementWidth = helveticaBold.widthOfTextAtSize(achievementText, 16);
  page.drawText(achievementText, {
    x: PAGE_WIDTH / 2 - achievementWidth / 2,
    y: PAGE_HEIGHT - 185,
    size: 16,
    font: helveticaBold,
    color: rgb(0.3, 0.3, 0.3),
  });

  // Recipient name
  const recipientName = data.recipientName || 'Recipient Name';
  const recipientWidth = timesRomanBold.widthOfTextAtSize(recipientName, 26);
  page.drawText(recipientName, {
    x: PAGE_WIDTH / 2 - recipientWidth / 2,
    y: PAGE_HEIGHT - 250,
    size: 26,
    font: timesRomanBold,
    color: rgb(0.1, 0.1, 0.1),
  });

  // Course text
  const courseName = data.courseName || 'Course Name';
  const courseText = `has successfully completed ${courseName}`;
  const maxWidth = 400;
  const courseSize = 14;
  const courseWidth = timesRoman.widthOfTextAtSize(courseText, courseSize);
  
  if (courseWidth > maxWidth) {
    // Wrap text if too long
    const words = courseText.split(' ');
    let line = '';
    let y = PAGE_HEIGHT - 295;
    
    for (const word of words) {
      const testLine = line + word + ' ';
      const testWidth = timesRoman.widthOfTextAtSize(testLine, courseSize);
      
      if (testWidth > maxWidth && line !== '') {
        const lineWidth = timesRoman.widthOfTextAtSize(line, courseSize);
        page.drawText(line, {
          x: PAGE_WIDTH / 2 - lineWidth / 2,
          y,
          size: courseSize,
          font: timesRoman,
          color: rgb(0.3, 0.3, 0.3),
        });
        line = word + ' ';
        y -= 20;
      } else {
        line = testLine;
      }
    }
    
    if (line !== '') {
      const lineWidth = timesRoman.widthOfTextAtSize(line, courseSize);
      page.drawText(line, {
        x: PAGE_WIDTH / 2 - lineWidth / 2,
        y,
        size: courseSize,
        font: timesRoman,
        color: rgb(0.3, 0.3, 0.3),
      });
    }
  } else {
    page.drawText(courseText, {
      x: PAGE_WIDTH / 2 - courseWidth / 2,
      y: PAGE_HEIGHT - 295,
      size: courseSize,
      font: timesRoman,
      color: rgb(0.3, 0.3, 0.3),
    });
  }

  // Grade
  if (data.grade) {
    const gradeText = `Final Grade: ${data.grade}`;
    const gradeWidth = timesRomanBold.widthOfTextAtSize(gradeText, 12);
    page.drawText(gradeText, {
      x: PAGE_WIDTH / 2 - gradeWidth / 2,
      y: PAGE_HEIGHT - 340,
      size: 12,
      font: timesRomanBold,
      color: rgb(0.15, 0.15, 0.15),
    });
  }

  // Bottom info
  const issueDate = data.issueDate || new Date().toLocaleDateString();
  page.drawText(`Issued: ${issueDate}`, {
    x: 70,
    y: 90,
    size: 10,
    font: timesRoman,
    color: rgb(0.4, 0.4, 0.4),
  });

  // Signature
  await drawSignature(page, data, fonts, 'bottom-center');

  // QR Code
  await drawQRCode(page, data.certificateId, 'bottom-right', pdfDoc);

  // Certificate ID
  const certId = data.certificateId || 'N/A';
  const certIdWidth = timesRoman.widthOfTextAtSize(certId, 8);
  page.drawText(certId, {
    x: PAGE_WIDTH / 2 - certIdWidth / 2,
    y: 50,
    size: 8,
    font: timesRoman,
    color: rgb(0.5, 0.5, 0.5),
  });
}

async function drawPremiumTemplate(page: PDFPage, data: CertificateTemplate, fonts: any, pdfDoc: PDFDocument) {
  const { timesRoman, timesRomanBold, timesRomanItalic, helveticaBold } = fonts;

  // Ornamental double border
  page.drawRectangle({
    x: 25,
    y: 25,
    width: PAGE_WIDTH - 50,
    height: PAGE_HEIGHT - 50,
    borderColor: rgb(0.7, 0.6, 0.2),
    borderWidth: 4,
  });

  page.drawRectangle({
    x: 35,
    y: 35,
    width: PAGE_WIDTH - 70,
    height: PAGE_HEIGHT - 70,
    borderColor: rgb(0.7, 0.6, 0.2),
    borderWidth: 2,
  });

  // Corner decorations
  const cornerSize = 20;
  const corners = [
    { x: 45, y: PAGE_HEIGHT - 45 }, // top-left
    { x: PAGE_WIDTH - 45, y: PAGE_HEIGHT - 45 }, // top-right
    { x: 45, y: 45 }, // bottom-left
    { x: PAGE_WIDTH - 45, y: 45 }, // bottom-right
  ];

  corners.forEach(corner => {
    page.drawLine({
      start: { x: corner.x - cornerSize, y: corner.y },
      end: { x: corner.x + cornerSize, y: corner.y },
      thickness: 2,
      color: rgb(0.7, 0.6, 0.2),
    });
    page.drawLine({
      start: { x: corner.x, y: corner.y - cornerSize },
      end: { x: corner.x, y: corner.y + cornerSize },
      thickness: 2,
      color: rgb(0.7, 0.6, 0.2),
    });
  });

  // Logo
  if (data.logoUrl && data.logoUrl !== '') {
    try {
      const logoBytes = await fetch(data.logoUrl).then(res => res.arrayBuffer());
      const logoImage = data.logoUrl.toLowerCase().endsWith('.png') 
        ? await pdfDoc.embedPng(logoBytes)
        : await pdfDoc.embedJpg(logoBytes);
      
      const logoSize = 50;
      page.drawImage(logoImage, {
        x: PAGE_WIDTH / 2 - logoSize / 2,
        y: PAGE_HEIGHT - 100,
        width: logoSize,
        height: logoSize,
      });
    } catch (error) {
      console.error('Error drawing logo:', error);
    }
  }

  // Institution
  const institutionName = data.institutionName || 'Institution';
  const institutionWidth = timesRomanItalic.widthOfTextAtSize(institutionName, 12);
  page.drawText(institutionName, {
    x: PAGE_WIDTH / 2 - institutionWidth / 2,
    y: PAGE_HEIGHT - 120,
    size: 12,
    font: timesRomanItalic,
    color: rgb(0.6, 0.5, 0.2),
  });

  // Title
  const titleText = 'Certificate of Excellence';
  const titleWidth = timesRomanBold.widthOfTextAtSize(titleText, 26);
  page.drawText(titleText, {
    x: PAGE_WIDTH / 2 - titleWidth / 2,
    y: PAGE_HEIGHT - 160,
    size: 26,
    font: timesRomanBold,
    color: rgb(0.7, 0.6, 0.2),
  });

  // Decorative line
  page.drawLine({
    start: { x: PAGE_WIDTH / 2 - 80, y: PAGE_HEIGHT - 170 },
    end: { x: PAGE_WIDTH / 2 + 80, y: PAGE_HEIGHT - 170 },
    thickness: 1,
    color: rgb(0.7, 0.6, 0.2),
  });

  // Header border
  page.drawLine({
    start: { x: 60, y: PAGE_HEIGHT - 185 },
    end: { x: PAGE_WIDTH - 60, y: PAGE_HEIGHT - 185 },
    thickness: 1,
    color: rgb(0.7, 0.6, 0.2),
  });

  // Presented to
  const presentedText = 'Presented to';
  const presentedWidth = timesRomanItalic.widthOfTextAtSize(presentedText, 12);
  page.drawText(presentedText, {
    x: PAGE_WIDTH / 2 - presentedWidth / 2,
    y: PAGE_HEIGHT - 220,
    size: 12,
    font: timesRomanItalic,
    color: rgb(0.6, 0.5, 0.2),
  });

  // Recipient
  const recipientName = data.recipientName || 'Recipient Name';
  const recipientWidth = timesRomanBold.widthOfTextAtSize(recipientName, 30);
  page.drawText(recipientName, {
    x: PAGE_WIDTH / 2 - recipientWidth / 2,
    y: PAGE_HEIGHT - 260,
    size: 30,
    font: timesRomanBold,
    color: rgb(0.1, 0.1, 0.1),
  });

  // Achievement text
  const courseName = data.courseName || 'Course Name';
  const achievementText = `For outstanding achievement in ${courseName}`;
  const maxWidth = 400;
  const achievementSize = 13;
  const achievementWidth = timesRoman.widthOfTextAtSize(achievementText, achievementSize);
  
  if (achievementWidth > maxWidth) {
    // Wrap text
    const words = achievementText.split(' ');
    let line = '';
    let y = PAGE_HEIGHT - 305;
    
    for (const word of words) {
      const testLine = line + word + ' ';
      const testWidth = timesRoman.widthOfTextAtSize(testLine, achievementSize);
      
      if (testWidth > maxWidth && line !== '') {
        const lineWidth = timesRoman.widthOfTextAtSize(line, achievementSize);
        page.drawText(line, {
          x: PAGE_WIDTH / 2 - lineWidth / 2,
          y,
          size: achievementSize,
          font: timesRoman,
          color: rgb(0.3, 0.3, 0.3),
        });
        line = word + ' ';
        y -= 18;
      } else {
        line = testLine;
      }
    }
    
    if (line !== '') {
      const lineWidth = timesRoman.widthOfTextAtSize(line, achievementSize);
      page.drawText(line, {
        x: PAGE_WIDTH / 2 - lineWidth / 2,
        y,
        size: achievementSize,
        font: timesRoman,
        color: rgb(0.3, 0.3, 0.3),
      });
    }
  } else {
    page.drawText(achievementText, {
      x: PAGE_WIDTH / 2 - achievementWidth / 2,
      y: PAGE_HEIGHT - 305,
      size: achievementSize,
      font: timesRoman,
      color: rgb(0.3, 0.3, 0.3),
    });
  }

  // Grade
  if (data.grade) {
    const gradeText = `With ${data.grade} distinction`;
    const gradeWidth = timesRomanItalic.widthOfTextAtSize(gradeText, 11);
    page.drawText(gradeText, {
      x: PAGE_WIDTH / 2 - gradeWidth / 2,
      y: PAGE_HEIGHT - 345,
      size: 11,
      font: timesRomanItalic,
      color: rgb(0.6, 0.5, 0.2),
    });
  }

  // Date
  const issueDate = data.issueDate || new Date().toLocaleDateString();
  const dateText = `Awarded on ${issueDate}`;
  const dateWidth = timesRoman.widthOfTextAtSize(dateText, 10);
  page.drawText(dateText, {
    x: PAGE_WIDTH / 2 - dateWidth / 2,
    y: PAGE_HEIGHT - 375,
    size: 10,
    font: timesRoman,
    color: rgb(0.4, 0.4, 0.4),
  });

  // Footer border
  page.drawLine({
    start: { x: 60, y: 180 },
    end: { x: PAGE_WIDTH - 60, y: 180 },
    thickness: 1,
    color: rgb(0.7, 0.6, 0.2),
  });

  // Signature
  await drawSignature(page, data, fonts, 'bottom-center');

  // QR Code
  await drawQRCode(page, data.certificateId, 'bottom-right', pdfDoc);

  // Certificate ID
  const certId = data.certificateId || 'N/A';
  const certIdWidth = timesRoman.widthOfTextAtSize(certId, 8);
  page.drawText(certId, {
    x: PAGE_WIDTH / 2 - certIdWidth / 2,
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
    x: 50,
    y: 50,
    width: PAGE_WIDTH - 100,
    height: PAGE_HEIGHT - 100,
    borderColor: rgb(0.15, 0.15, 0.15),
    borderWidth: 2,
  });

  // Logo
  if (data.logoUrl && data.logoUrl !== '') {
    try {
      const logoBytes = await fetch(data.logoUrl).then(res => res.arrayBuffer());
      const logoImage = data.logoUrl.toLowerCase().endsWith('.png') 
        ? await pdfDoc.embedPng(logoBytes)
        : await pdfDoc.embedJpg(logoBytes);
      
      page.drawImage(logoImage, {
        x: 80,
        y: PAGE_HEIGHT - 110,
        width: 40,
        height: 40,
      });
    } catch (error) {
      console.error('Error drawing logo:', error);
    }
  }

  // Institution
  const institutionName = (data.institutionName || 'Institution').toUpperCase();
  page.drawText(institutionName, {
    x: 130,
    y: PAGE_HEIGHT - 90,
    size: 10,
    font: helveticaBold,
    color: rgb(0.15, 0.15, 0.15),
  });

  // Header border
  page.drawLine({
    start: { x: 70, y: PAGE_HEIGHT - 120 },
    end: { x: PAGE_WIDTH - 70, y: PAGE_HEIGHT - 120 },
    thickness: 1,
    color: rgb(0.15, 0.15, 0.15),
  });

  // Title
  const titleText = 'CERTIFICATE';
  const titleWidth = helveticaBold.widthOfTextAtSize(titleText, 36);
  page.drawText(titleText, {
    x: PAGE_WIDTH / 2 - titleWidth / 2,
    y: PAGE_HEIGHT - 200,
    size: 36,
    font: helveticaBold,
    color: rgb(0.15, 0.15, 0.15),
  });

  // Recipient
  const recipientName = data.recipientName || 'Recipient Name';
  const recipientWidth = timesRomanBold.widthOfTextAtSize(recipientName, 24);
  page.drawText(recipientName, {
    x: PAGE_WIDTH / 2 - recipientWidth / 2,
    y: PAGE_HEIGHT - 260,
    size: 24,
    font: timesRomanBold,
    color: rgb(0.2, 0.2, 0.2),
  });

  // Course
  const courseName = data.courseName || 'Course Name';
  const courseWidth = timesRoman.widthOfTextAtSize(courseName, 16);
  page.drawText(courseName, {
    x: PAGE_WIDTH / 2 - courseWidth / 2,
    y: PAGE_HEIGHT - 300,
    size: 16,
    font: timesRoman,
    color: rgb(0.3, 0.3, 0.3),
  });

  // Grade
  if (data.grade) {
    const gradeWidth = timesRoman.widthOfTextAtSize(data.grade, 11);
    page.drawText(data.grade, {
      x: PAGE_WIDTH / 2 - gradeWidth / 2,
      y: PAGE_HEIGHT - 330,
      size: 11,
      font: timesRoman,
      color: rgb(0.4, 0.4, 0.4),
    });
  }

  // Footer border
  page.drawLine({
    start: { x: 70, y: 150 },
    end: { x: PAGE_WIDTH - 70, y: 150 },
    thickness: 1,
    color: rgb(0.15, 0.15, 0.15),
  });

  // Date
  const issueDate = data.issueDate || new Date().toLocaleDateString();
  page.drawText(issueDate, {
    x: 80,
    y: 120,
    size: 9,
    font: timesRoman,
    color: rgb(0.4, 0.4, 0.4),
  });

  // Signature
  await drawSignature(page, data, fonts, 'bottom-center');

  // Verified text
  page.drawText('Verified', {
    x: PAGE_WIDTH - 130,
    y: 120,
    size: 9,
    font: timesRoman,
    color: rgb(0.4, 0.4, 0.4),
  });

  // QR Code
  await drawQRCode(page, data.certificateId, 'bottom-right', pdfDoc);

  // Certificate ID
  const certId = data.certificateId || 'N/A';
  const certIdWidth = timesRoman.widthOfTextAtSize(certId, 8);
  page.drawText(certId, {
    x: PAGE_WIDTH / 2 - certIdWidth / 2,
    y: 80,
    size: 8,
    font: timesRoman,
    color: rgb(0.6, 0.6, 0.6),
  });
}

async function drawLogo(page: PDFPage, logoUrl: string, position: string, pdfDoc: PDFDocument) {
  try {
    if (!logoUrl || logoUrl === '') return;
    
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

  if (data.signatureUrl && data.signatureUrl !== '') {
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

  const signatoryName = data.instructorName || data.issuerName || 'Authorized Signatory';
  page.drawText(signatoryName, {
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
  try {
    const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/verify/${certificateId}`;
    const qrCodeDataUrl = await QRCode.toDataURL(verifyUrl, { width: 200, margin: 1, errorCorrectionLevel: 'H' });
    
    // Convert data URL to blob
    const response = await fetch(qrCodeDataUrl);
    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    
    const qrImage = await pdfDoc.embedPng(new Uint8Array(arrayBuffer));
    
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
  } catch (error) {
    console.error('Error drawing QR code:', error);
  }
}
