import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

/**
 * Extracts a PDF's visible text with pdf.js (test-only dependency; the API
 * itself never imports it). This is a genuine check of what a PDF reader
 * would show: pdfkit does not write literal readable bytes into the content
 * stream even with compression off, so grepping the raw file is not a valid
 * way to test its output.
 */
export const extractPdfText = async (buf: Buffer): Promise<string> => {
  const doc = await getDocument({ data: new Uint8Array(buf), useSystemFonts: true }).promise;
  const pages: string[] = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    pages.push(content.items.map((item) => ('str' in item ? item.str : '')).join(' '));
  }
  return pages.join('\n');
};

export const countPdfPages = async (buf: Buffer): Promise<number> =>
  (await getDocument({ data: new Uint8Array(buf) }).promise).numPages;
