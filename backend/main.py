import os
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from dotenv import load_dotenv

from ai_provider import resolve_provider, get_demo_admission_document
from document_processor import process_document

load_dotenv()

app = FastAPI(
    title="ACCESSAI Backend API",
    description="Provider-agnostic document accessibility and AI extraction API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class DemoRequest(BaseModel):
    fileName: Optional[str] = "Apex_University_Admission_Fall2026.pdf"

@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "service": "ACCESSAI FastAPI Engine",
        "version": "1.0.0"
    }

@app.get("/api/provider")
def get_provider_status():
    provider, is_fallback = resolve_provider()
    model = os.getenv("AI_MODEL", "gpt-4o-mini")
    configured = not is_fallback
    return {
        "provider": "OpenAI Compatible" if configured else "Demo Mode",
        "model": model,
        "configured": configured,
        "isDemoMode": is_fallback,
        "supportedFormats": ["PDF", "Scanned PDF", "PNG", "JPG", "JPEG"],
        "statusMessage": "Connected to AI Provider" if configured else "Running in Demo Mode (Configure AI_API_KEY to connect)."
    }

@app.post("/api/demo")
def get_demo(req: DemoRequest = DemoRequest()):
    return {
        "success": True,
        "data": get_demo_admission_document(req.fileName or "Apex_University_Admission_Fall2026.pdf")
    }

@app.post("/api/upload")
async def upload_document(file: UploadFile = File(...)):
    contents = await file.read()
    if len(contents) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File exceeds 10MB limit.")
    text, page_count, ocr_used, notes = process_document(contents, file.filename or "doc.pdf")
    return {
        "success": True,
        "filename": file.filename,
        "fileSize": len(contents),
        "extraction": {
            "pageCount": page_count,
            "ocrUsed": ocr_used,
            "wordCount": len(text.split()),
            "notes": notes,
            "textPreview": text[:500]
        }
    }

@app.post("/api/process")
async def process_full(
    file: Optional[UploadFile] = File(None),
    text: Optional[str] = Form(None),
    filename: Optional[str] = Form("Uploaded_Document.pdf")
):
    ocr_used = False
    page_count = 1
    extracted_text = ""

    if file:
        contents = await file.read()
        if len(contents) > 10 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="File exceeds 10MB limit.")
        extracted_text, page_count, ocr_used, _ = process_document(contents, file.filename or filename)
        doc_name = file.filename or filename
    elif text:
        extracted_text = text
        doc_name = filename
    else:
        raise HTTPException(status_code=400, detail="Must provide either a file or text content.")

    provider, is_fallback = resolve_provider()
    try:
        result = provider.analyze(extracted_text, doc_name, ocr_used, page_count)
        return {"success": True, "data": result}
    except Exception as e:
        # Graceful fallback to Demo Mode
        demo = get_demo_admission_document(doc_name)
        demo["metadata"]["isDemoMode"] = True
        demo["metadata"]["statusMessage"] = "AI service unavailable. ACCESSAI is currently showing Demo Mode."
        demo["metadata"]["ocrUsed"] = ocr_used
        return {"success": True, "data": demo}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
