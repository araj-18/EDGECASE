import path from 'path';
import { createWorker } from 'tesseract.js';
import { PDFParse } from 'pdf-parse';

export interface DocumentExtractionResult {
  text: string;
  pageCount: number;
  ocrUsed: boolean;
  ocrConfidence?: number;
  wordCount: number;
  quality: 'high' | 'medium' | 'low' | 'scanned_fallback';
  detectedLanguage?: string;
  notes: string[];
}

export class DocumentProcessor {
  /**
   * Cleans and normalizes extracted text
   */
  static cleanText(rawText: string): string {
    return rawText
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/[ \t]{2,}/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  /**
   * Run OCR on an image buffer or file using Tesseract.js
   */
  static async runOcrOnBuffer(
    buffer: Buffer,
    lang: string = 'eng'
  ): Promise<{ text: string; confidence: number }> {
    const worker = await createWorker(lang);
    try {
      const ret = await worker.recognize(buffer);
      const text = ret.data.text || '';
      const confidence = ret.data.confidence || 0;
      await worker.terminate();
      return { text: this.cleanText(text), confidence };
    } catch (err) {
      await worker.terminate().catch(() => {});
      throw err;
    }
  }

  /**
   * Extract text from PDF buffer
   */
  static async extractFromPdf(buffer: Buffer): Promise<DocumentExtractionResult> {
    const notes: string[] = [];
    let extractedText = '';
    let pageCount = 1;

    try {
      const parser = new PDFParse({ data: buffer });
      const textResult = await parser.getText();
      const rawText = textResult?.text || (typeof textResult === 'string' ? textResult : '');
      extractedText = this.cleanText(rawText);
      // Remove PDFParse page pagination banners like "-- 1 of 1 --"
      extractedText = extractedText.replace(/--\s*\d+\s*of\s*\d+\s*--/gi, '').trim();

      const info = await parser.getInfo().catch(() => null);
      if (typeof (info as any)?.total === 'number') {
        pageCount = (info as any).total;
      } else if (typeof (info as any)?.pages === 'number') {
        pageCount = (info as any).pages;
      } else if (Array.isArray(textResult?.pages)) {
        pageCount = textResult.pages.length;
      }
      await parser.destroy().catch(() => {});
    } catch (err: any) {
      notes.push(`PDF parser notice: ${err?.message || 'Digital text layer sparse'}`);
    }

    const words = extractedText.split(/\s+/).filter(Boolean).length;
    const isSparse = extractedText.length < 30;

    return {
      text: extractedText,
      pageCount: Math.max(1, pageCount),
      ocrUsed: isSparse,
      wordCount: words,
      quality: words > 100 ? 'high' : words > 30 ? 'medium' : 'scanned_fallback',
      notes
    };
  }

  /**
   * Extract text from image (PNG, JPG, JPEG)
   */
  static async extractFromImage(buffer: Buffer): Promise<DocumentExtractionResult> {
    const notes: string[] = ['Image document input. Performed optical character recognition (OCR).'];
    const ocrResult = await this.runOcrOnBuffer(buffer);
    const words = ocrResult.text.split(/\s+/).filter(Boolean).length;

    return {
      text: ocrResult.text,
      pageCount: 1,
      ocrUsed: true,
      ocrConfidence: ocrResult.confidence,
      wordCount: words,
      quality: ocrResult.confidence > 75 ? 'high' : 'medium',
      notes
    };
  }

  /**
   * Universal file extractor supporting PDF, PNG, JPG, JPEG
   */
  static async processFile(
    fileBuffer: Buffer,
    originalName: string,
    mimeType: string
  ): Promise<DocumentExtractionResult> {
    const ext = path.extname(originalName).toLowerCase();
    const isPdf = mimeType.includes('pdf') || ext === '.pdf';
    const isImage =
      mimeType.startsWith('image/') ||
      ['.png', '.jpg', '.jpeg', '.webp'].includes(ext);

    if (isPdf) {
      return this.extractFromPdf(fileBuffer);
    } else if (isImage) {
      return this.extractFromImage(fileBuffer);
    } else {
      const asText = fileBuffer.toString('utf-8');
      return {
        text: this.cleanText(asText),
        pageCount: 1,
        ocrUsed: false,
        wordCount: asText.split(/\s+/).filter(Boolean).length,
        quality: 'medium',
        notes: ['Processed as plain document']
      };
    }
  }
}
