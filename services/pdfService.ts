import { PDFDocument, StandardFonts, rgb, degrees } from 'pdf-lib';
import JSZip from 'jszip';
import * as mammothUrl from 'mammoth';

// Robustly handle mammoth import for different environments (ESM/CommonJS)
const mammoth = (mammothUrl as any).default || mammothUrl;

export const mergePdfs = async (files: File[]): Promise<Uint8Array> => {
  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  return mergedPdf.save();
};

export const splitPdf = async (file: File, fromPage: number, toPage: number): Promise<Uint8Array> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer);
  const newPdf = await PDFDocument.create();
  
  // pdf-lib uses 0-based index, user input is 1-based
  const start = Math.max(0, fromPage - 1);
  const end = Math.min(pdf.getPageCount() - 1, toPage - 1);
  
  const range: number[] = [];
  for (let i = start; i <= end; i++) {
    range.push(i);
  }

  const copiedPages = await newPdf.copyPages(pdf, range);
  copiedPages.forEach((page) => newPdf.addPage(page));

  return newPdf.save();
};

export const rotatePdf = async (file: File, rotation: number): Promise<Uint8Array> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer);
  const pages = pdf.getPages();
  
  pages.forEach((page) => {
    const currentRotation = page.getRotation().angle;
    // Normalize the angle to keep it clean
    page.setRotation(degrees(currentRotation + rotation));
  });

  return pdf.save();
};

export const imagesToPdf = async (files: File[]): Promise<Uint8Array> => {
  const pdfDoc = await PDFDocument.create();

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    let image;
    
    if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
      image = await pdfDoc.embedJpg(arrayBuffer);
    } else if (file.type === 'image/png') {
      image = await pdfDoc.embedPng(arrayBuffer);
    } else {
      continue;
    }

    const page = pdfDoc.addPage([image.width, image.height]);
    page.drawImage(image, {
      x: 0,
      y: 0,
      width: image.width,
      height: image.height,
    });
  }

  return pdfDoc.save();
};

export const wordToPdf = async (file: File): Promise<Uint8Array> => {
  const arrayBuffer = await file.arrayBuffer();
  
  // Robust check for mammoth availability
  if (!mammoth || !mammoth.extractRawText) {
    throw new Error("Word conversion service is not available. Please reload the page.");
  }

  let text = "";
  try {
      const result = await mammoth.extractRawText({ arrayBuffer });
      text = result.value;
  } catch (err) {
      console.error("Mammoth extraction error:", err);
      throw new Error("Failed to read Word document. Ensure it is a valid .docx file.");
  }
  
  if (!text) {
      throw new Error("The document appears to be empty or could not be read.");
  }

  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 12;
  const lineHeight = 15;
  const margin = 50;
  
  let page = pdfDoc.addPage();
  let { width, height } = page.getSize();
  let y = height - margin;
  
  const paragraphs = text.split(/\n+/); // Split by one or more newlines
  
  // Estimate characters per line (rough approximation for client-side)
  // Average char width for Helvetica 12 is roughly 6-7 points
  const maxCharsPerLine = Math.floor((width - 2 * margin) / 6);

  for (const paragraph of paragraphs) {
      if (!paragraph.trim()) continue;

      // Simple word wrapping
      const words = paragraph.split(/\s+/);
      let currentLine = "";

      for (const word of words) {
          // If adding the next word exceeds the line length
          if ((currentLine + word).length > maxCharsPerLine) {
              // Draw current line
              page.drawText(currentLine, { x: margin, y, size: fontSize, font, color: rgb(0, 0, 0) });
              y -= lineHeight;
              currentLine = word + " "; // Start new line with current word

              // Check for page break
              if (y < margin) {
                  page = pdfDoc.addPage();
                  y = height - margin;
              }
          } else {
              currentLine += word + " ";
          }
      }

      // Draw remaining text in paragraph
      if (currentLine) {
          page.drawText(currentLine.trim(), { x: margin, y, size: fontSize, font, color: rgb(0, 0, 0) });
          y -= lineHeight;
      }

      // Add extra space after paragraph
      y -= lineHeight * 0.5;
      
      if (y < margin) {
          page = pdfDoc.addPage();
          y = height - margin;
      }
  }

  return pdfDoc.save();
};

export const downloadBlob = (data: Uint8Array | Blob, filename: string, mimeType: string = 'application/pdf') => {
  const blob = data instanceof Blob ? data : new Blob([data], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.parentNode?.removeChild(link);
};

export const getPageCount = async (file: File): Promise<number> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    return pdf.getPageCount();
}