# ACCESSAI Python FastAPI Backend

This directory contains the Python FastAPI backend implementation for ACCESSAI, utilizing **PyMuPDF** for PDF extraction and **Tesseract OCR** (`pytesseract` + `Pillow`) for scanned documents and images.

## Features
- **FastAPI** high-performance asynchronous REST endpoints
- **PyMuPDF (`fitz`)** fast digital text extraction and page rendering
- **Tesseract OCR (`pytesseract`)** automatic fallback when documents are scanned or image-based
- **Provider-Agnostic AI Adapter**: Connects to any OpenAI-compatible API or falls back to Demo Mode
- Strict zero-leakage security: Credentials are kept strictly server-side

## Endpoints
- `GET /api/health`: Health status & version check
- `GET /api/provider`: Safe AI provider info (no keys exposed)
- `POST /api/demo`: Returns deterministic demo admission notice
- `POST /api/upload`: Validates file, runs PyMuPDF/OCR, returns extracted text
- `POST /api/process`: End-to-end extraction + AI transformation

## Setup & Running
1. Install Python 3.10+
2. Install Tesseract OCR:
   - Ubuntu/Debian: `sudo apt-get install -y tesseract-ocr`
   - macOS: `brew install tesseract`
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Set environment variables in `.env`:
   ```env
   AI_PROVIDER=generic
   AI_API_KEY=your_key_here
   AI_API_URL=https://api.openai.com/v1/chat/completions
   AI_MODEL=gpt-4o-mini
   ```
5. Start server:
   ```bash
   python main.py
   # or
   uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```
