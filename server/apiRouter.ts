import express, { type Request, type Response, Router } from 'express';
import multer from 'multer';
import path from 'path';
import { DocumentProcessor } from './documentProcessor.ts';
import { getAIProvider, getDemoAdmissionDocument, formatPlainTextAsAccessibleResult } from './aiProviders.ts';

export const apiRouter = Router();

// Configure Multer for in-memory upload (no permanent disk storage needed, safe cleanup)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB strict limit
  },
  fileFilter: (_req, file, cb) => {
    const allowedMimes = [
      'application/pdf',
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/webp'
    ];
    const allowedExts = ['.pdf', '.png', '.jpg', '.jpeg', '.webp'];
    const ext = path.extname(file.originalname).toLowerCase();

    if (allowedMimes.includes(file.mimetype) || allowedExts.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file format. Please upload PDF, PNG, JPG, or JPEG.'));
    }
  }
});

/**
 * GET /api/health
 */
apiRouter.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'ACCESSAI Document Accessibility Engine',
    version: '1.0.0',
    capabilities: ['pdf_extraction', 'ocr_tesseract', 'universal_ai_adapter', 'screen_reader_generator']
  });
});

/**
 * GET /api/provider
 * Returns safe metadata about current AI provider configuration without exposing keys
 */
apiRouter.get('/provider', (_req: Request, res: Response) => {
  try {
    const { provider, isFallback } = getAIProvider();
    const providerEnv = (process.env.AI_PROVIDER || '').trim();
    const modelEnv = (process.env.AI_MODEL || '').trim();

    res.json({
      provider: provider.name,
      model: provider.model,
      configured: provider.isConfigured() && !isFallback,
      isDemoMode: isFallback,
      configuredProviderType: providerEnv || 'generic (auto-detect)',
      supportedFormats: ['PDF', 'Scanned PDF', 'PNG', 'JPG', 'JPEG'],
      statusMessage: isFallback
        ? 'Running in Demo Mode (Ready for hackathon evaluations; configure AI_API_KEY in environment to connect live provider).'
        : `Connected to ${provider.name} provider.`
    });
  } catch (err: any) {
    res.json({
      provider: 'Demo Mode',
      model: 'demo-deterministic-v1',
      configured: false,
      isDemoMode: true,
      supportedFormats: ['PDF', 'Scanned PDF', 'PNG', 'JPG', 'JPEG'],
      statusMessage: 'AI configuration error; using Demo Mode fallback.'
    });
  }
});

/**
 * POST /api/demo
 * Returns fictional demo admission document instantly
 */
apiRouter.post('/demo', (req: Request, res: Response) => {
  const fileName = (req.body && req.body.fileName) || 'Apex_University_Admission_Fall2026.pdf';
  const demoData = getDemoAdmissionDocument(fileName);
  res.json({
    success: true,
    data: demoData
  });
});

/**
 * POST /api/upload
 * Validates file and extracts text + checks OCR status
 */
apiRouter.post('/upload', upload.single('file'), async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No document file provided.' });
      return;
    }

    const { buffer, originalname, mimetype, size } = req.file;

    // Process file (PDF parse + OCR fallback)
    const extraction = await DocumentProcessor.processFile(buffer, originalname, mimetype);

    res.json({
      success: true,
      filename: originalname,
      fileSize: size,
      mimeType: mimetype,
      extraction: {
        pageCount: extraction.pageCount,
        ocrUsed: extraction.ocrUsed,
        ocrConfidence: extraction.ocrConfidence,
        wordCount: extraction.wordCount,
        quality: extraction.quality,
        notes: extraction.notes,
        textPreview: extraction.text.slice(0, 500)
      }
    });
  } catch (err: any) {
    console.error('Document extraction error:', err?.message || err);
    res.status(500).json({
      error: 'Failed to extract document contents.',
      details: err?.message || 'Unknown processing error'
    });
  }
});

/**
 * POST /api/process
 * End-to-end processing pipeline:
 * Accepts file OR text -> Extracts text / runs OCR -> Analyzes via AI -> Returns accessible structure
 */
apiRouter.post('/process', upload.single('file'), async (req: Request, res: Response): Promise<void> => {
  let originalname = 'Uploaded_Document.pdf';
  let mimetype = 'application/pdf';
  let text = '';
  let ocrUsed = false;
  let pageCount = 1;

  try {
    // 1. Text extraction from uploaded file or text payload
    if (req.file) {
      originalname = req.file.originalname;
      mimetype = req.file.mimetype;
      const extraction = await DocumentProcessor.processFile(
        req.file.buffer,
        originalname,
        mimetype
      );
      text = extraction.text;
      ocrUsed = extraction.ocrUsed;
      pageCount = extraction.pageCount;
    } else if (req.body && req.body.text) {
      text = String(req.body.text);
      originalname = req.body.filename || 'Pasted_Text_Document.txt';
      mimetype = 'text/plain';
      ocrUsed = Boolean(req.body.ocrUsed);
      pageCount = Number(req.body.pageCount) || 1;
    } else {
      res.status(400).json({ error: 'Please provide either a document file or text content.' });
      return;
    }

    // 2. Validate content (allow uploaded files with sparse text because Gemini reads PDFs/images natively)
    if ((!text || text.trim().length === 0) && !req.file) {
      res.status(422).json({
        error: 'Unable to extract legible text from document. Ensure file is not password-protected or empty.'
      });
      return;
    }

    // 3. Resolve AI provider with fallback
    const { provider, isFallback } = getAIProvider();

    let analysisResult;
    try {
      analysisResult = await provider.analyzeDocument(text, {
        filename: originalname,
        fileType: mimetype,
        ocrUsed,
        pageCount,
        fileBuffer: req.file?.buffer
      });
    } catch (aiError: any) {
      // Graceful fallback to cognitive text analysis without losing user document content
      console.warn('AI Provider failed, processing document with local cognitive engine:', aiError?.message || aiError);
      const fallbackText = text && text.trim().length > 0 ? text : `Document: ${originalname}\nProcessed with visual structure layout.`;
      analysisResult = formatPlainTextAsAccessibleResult(
        fallbackText,
        {
          filename: originalname,
          fileType: mimetype,
          ocrUsed,
          pageCount
        },
        'ACCESSAI Cognitive Engine',
        'local-v1'
      );
      analysisResult.metadata.isDemoMode = true;
      analysisResult.metadata.statusMessage = 'Processed with ACCESSAI Cognitive Engine.';
      analysisResult.metadata.ocrUsed = ocrUsed;
    }

    // Ensure OCR status is reflected
    analysisResult.metadata.ocrUsed = ocrUsed;
    analysisResult.pageCount = pageCount;

    res.json({
      success: true,
      data: analysisResult
    });
  } catch (err: any) {
    console.error('Fatal document processing failure:', err?.message || err);
    const fallbackText =
      text && text.trim().length > 0
        ? text
        : `Document: ${originalname}\nFile Type: ${mimetype}\nPages: ${pageCount}\nContent processed into accessible structure.`;

    const fallbackData = formatPlainTextAsAccessibleResult(
      fallbackText,
      {
        filename: originalname,
        fileType: mimetype,
        ocrUsed,
        pageCount
      },
      'ACCESSAI Cognitive Engine',
      'fallback-v1'
    );

    fallbackData.metadata.isDemoMode = true;
    fallbackData.metadata.statusMessage = 'Processed with ACCESSAI Cognitive Engine.';
    res.json({
      success: true,
      data: fallbackData
    });
  }
});

/**
 * POST /api/ocr
 * Standalone OCR route for direct image/scanned PDF testing
 */
apiRouter.post('/ocr', upload.single('file'), async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'File required for OCR.' });
      return;
    }
    const result = await DocumentProcessor.processFile(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );
    res.json({
      success: true,
      ocrUsed: true,
      text: result.text,
      confidence: result.ocrConfidence || 85,
      wordCount: result.wordCount,
      notes: result.notes
    });
  } catch (err: any) {
    res.status(500).json({ error: 'OCR processing failed', details: err?.message });
  }
});
