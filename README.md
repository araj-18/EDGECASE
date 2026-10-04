# ACCESSAI — Make Every Document Accessible

> Universal AI Document Accessibility and Cognitive Transformation Platform

Transform complex documents into clear, understandable, and accessible formats using AI. Extract digital text with PyMuPDF, OCR scanned forms with Tesseract, simplify dense bureaucratic language, extract crucial deadlines, generate WCAG AAA screen reader HTML, and listen with interactive Text-to-Speech.

---

## Architecture Flow

```text
Upload Document (PDF, Scanned PDF, PNG, JPG, JPEG)
       ↓
Validate File (MIME & 10MB limits)
       ↓
Extract Text (PyMuPDF / Digital Stream)
       ↓
OCR Fallback (Tesseract OCR if scanned or low character density)
       ↓
Provider-Agnostic AI Service Adapter (OpenAI Compatible, Gemini, Groq, Together, Ollama)
       ↓
Analyze Document & Preserve Legal/Factual Meaning
       ↓
Generate Accessible Content (Summary, Simple Version, Deadlines, Semantic HTML)
       ↓
Display Results Dashboard & Web Speech Text-to-Speech
```

---

## Key Features

1. **AI Simplification**: Converts dense legal, academic, and administrative jargon into plain English (Grade 5-6 reading level) while strictly preserving meaning, proper names, dates, and requirements.
2. **Scanned PDF & OCR Processing**: Automatically detects non-selectable scanned pages and runs Tesseract optical character recognition.
3. **Important Information Extraction**: Automatically highlights critical deadlines, prerequisites, warnings, contacts, and key terms in high-contrast urgency cards.
4. **Semantic Screen Reader Output**: Transforms unstructured text into properly nested HTML (`<h1>`–`<h3>`, `<main>`, `<article>`, `<section>`, ARIA landmark tags) ready for JAWS, NVDA, and VoiceOver.
5. **Sensory Image Descriptions**: Generates descriptive alt text and sensory details for stamps, official seals, and signatures.
6. **Native Text-to-Speech**: Built-in speech synthesis controls (Play, Pause, Resume, Stop, 0.75x–2.0x speeds, and voice selection) without intrusive auto-play.
7. **Accessibility Profiles & Controls**:
   - **Auto**: Balanced standard layout.
   - **Simple Language**: Plain language emphasis.
   - **Screen Reader**: High semantic structure.
   - **Low Vision**: High contrast, bold yellow/cyan on black, enlarged font.
   - **Audio First**: Quick access to voice synthesis.
   - **Dyslexia Friendly**: Letter/word spacing and readable typography.
   - Dark / Light / High-Contrast modes saved to `localStorage`.
8. **Export & Download**: One-click **Copy Summary**, **Copy Simple Version**, **Download TXT**, and **Download Accessible HTML**.

---

## Universal AI Configuration (Provider-Agnostic)

ACCESSAI is intentionally designed with **no frontend provider lock-in**. You can switch AI providers via backend environment variables without changing a single line of frontend code.

### Supported Adapters:
- **OpenAI-Compatible APIs**: OpenAI, OpenRouter, Groq, Together AI, Perplexity, DeepSeek, vLLM, LM Studio, Ollama.
- **Google Gemini**: Gemini 2.5 Flash / Pro via server-side SDK.
- **Demo Mode**: Built-in zero-configuration deterministic mode for hackathon judging and offline evaluation.

### Environment Variables:
```env
# AI Provider Type: "generic", "openai", "gemini", or "demo"
AI_PROVIDER="generic"

# API Endpoint URL (e.g. OpenAI, OpenRouter, or Groq)
AI_API_URL="https://api.openai.com/v1/chat/completions"

# Model identifier
AI_MODEL="gpt-4o-mini"

# Secret API Key (kept strictly server-side; NEVER sent to browser)
AI_API_KEY="your-api-key-here"
```

### Example Configurations:

#### 1. OpenRouter (Access Llama 3, Claude, Mistral)
```env
AI_PROVIDER=generic
AI_API_URL=https://openrouter.ai/api/v1/chat/completions
AI_MODEL=meta-llama/llama-3.3-70b-instruct
AI_API_KEY=sk-or-v1-...
```

#### 2. Groq (Ultra-fast inference)
```env
AI_PROVIDER=generic
AI_API_URL=https://api.groq.com/openai/v1/chat/completions
AI_MODEL=llama-3.3-70b-versatile
AI_API_KEY=gsk_...
```

#### 3. Local Ollama / vLLM (100% Private Self-Hosted)
```env
AI_PROVIDER=generic
AI_API_URL=http://localhost:11434/v1/chat/completions
AI_MODEL=llama3.2
AI_API_KEY=ollama
```

---

## Demo Mode

**Demo Mode is always ready out of the box.**

If `AI_API_KEY` is omitted, or if an upstream AI provider returns an error (rate limits, 401 unauthorized, network issues), ACCESSAI automatically engages **Demo Mode**:
- Clearly labels: `Demo Mode — sample AI output`
- Loads a realistic fictional university admission notice (Apex University) complete with deadlines, merit scholarships, and seal descriptions.
- Never crashes the UI or leaks technical error tracebacks to the user.

---

## Installation & Running

### Full-Stack Node.js Application (Default)
```bash
# 1. Install dependencies
npm install

# 2. Build or run development server
npm run dev

# App runs on http://localhost:3000
```

### Python FastAPI Backend (Optional Replit / Standalone Backend)
For developers using Python FastAPI with native PyMuPDF and Tesseract:
```bash
# 1. Navigate to backend directory
cd backend

# 2. Install Python requirements
pip install -r requirements.txt

# 3. Start FastAPI server
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

---

## Security & Privacy Constitution

- **Backend-Only Secrets**: API credentials reside exclusively on the server and are never included in API responses or client bundles.
- **Zero Document Leakage**: Documents are parsed in temporary memory buffers and never stored in long-term databases.
- **Strict Validation**: Enforces MIME verification and a 10 MB file ceiling.

---

## Troubleshooting

| Issue | Cause | Resolution |
| :--- | :--- | :--- |
| `Demo Mode — sample AI output` displays | Missing or invalid `AI_API_KEY` | Add a valid key in your server environment variables and restart. |
| `HTTP 401 Unauthorized` | Upstream provider rejected key | Check `AI_API_KEY` in `.env`. ACCESSAI switches gracefully to Demo Mode. |
| `File too large` | File exceeds 10 MB | Compress PDF or upload individual pages. |
| Voice not speaking | System audio muted or unsupported voice | Select a different voice from the dropdown or verify browser audio permissions. |
