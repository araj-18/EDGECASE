import os
import json
import re
from typing import Dict, Any, Optional

SYSTEM_PROMPT = """You are ACCESSAI, an expert AI document accessibility and cognitive transformation engine.
Transform documents into accessible, high-clarity, and structured formats for people with diverse needs (low vision, dyslexia, screen reader users, cognitive fatigue).

CRITICAL RULES:
1. Never invent or hallucinate information.
2. Preserve all proper names, numbers, dates, deadlines, requirements, warnings, URLs, and technical terms.
3. Preserve the original legal, medical, or official meaning—do not introduce ambiguity through oversimplification.
4. If specific information is missing, explicitly state "Not specified in the document."
5. Never fabricate image descriptions; only describe visual elements or figures detected.
6. Return a valid JSON object matching the exact schema.

Schema:
{
  "title": "Document Title",
  "documentType": "Document Classification",
  "summary": "Clear, concise 2-3 paragraph executive summary.",
  "quickTakeaways": ["Point 1", "Point 2"],
  "simpleVersion": "Plain-language version written at a Grade 5-6 reading level.",
  "gradeLevel": "Grade 5-6 Plain Language",
  "importantInformation": [
    { "category": "deadline|requirement|warning|contact|instruction|general", "label": "Label", "detail": "Detail", "urgent": true }
  ],
  "deadlines": [
    { "task": "Task", "date": "Date", "time": "Time", "consequences": "Consequences" }
  ],
  "requirements": ["Req 1", "Req 2"],
  "warnings": ["Warning 1"],
  "keyPeople": [
    { "name": "Name", "role": "Role", "contact": "Contact" }
  ],
  "keyTerms": [
    { "term": "Term", "definition": "Definition" }
  ],
  "sections": [
    { "id": "sec-1", "heading": "Heading", "level": 2, "originalText": "...", "simplifiedText": "...", "keyPoints": ["..."] }
  ],
  "imageDescriptions": [
    { "id": "img-1", "type": "stamp", "title": "Title", "altText": "Alt", "detailedDescription": "Desc" }
  ],
  "accessibilityNotes": ["Note on structure"],
  "screenReaderHtml": "<main><h1>...</h1><p>...</p></main>"
}
Only output the JSON object without markdown fences or extraneous text."""


def get_demo_admission_document(filename: str = "Apex_University_Admission_Fall2026.pdf") -> Dict[str, Any]:
    return {
        "title": "Apex University — Official Offer of Admission & Enrollment Requirements (Fall 2026)",
        "documentType": "Official University Admission Notice & Financial Aid Award",
        "pageCount": 2,
        "wordCount": 785,
        "readingTimeMinutes": 3,
        "summary": "This document is an official offer of admission from Apex University to the Bachelor of Science in Computer Science program for the Fall 2026 semester. It outlines mandatory next steps including accepting your offer by May 15, submitting final official academic transcripts by July 1, paying the non-refundable $350 enrollment deposit, and attending mandatory campus orientation on August 20. It also confirms a merit scholarship award of $12,500 per academic year.",
        "quickTakeaways": [
            "Admitted to B.S. in Computer Science for Fall 2026 term.",
            "Enrollment deposit of $350 and formal acceptance due by May 15, 2026 (11:59 PM EST).",
            "$12,500 annual renewable Dean's Merit Scholarship awarded.",
            "Final official high school/college transcripts must arrive by July 1, 2026.",
            "Mandatory International & First-Year Student Orientation begins August 20, 2026."
        ],
        "simpleVersion": "Congratulations! You have been accepted to Apex University for the Fall 2026 semester to study Computer Science.\n\nHere is what you need to do next:\n1. Accept the offer and pay a $350 deposit online before May 15, 2026.\n2. Ask your school to send your final official grades before July 1, 2026.\n3. Complete your student housing application before June 1, 2026.\n4. Come to campus orientation on August 20, 2026.",
        "gradeLevel": "Grade 5 Plain Language (Flesch-Kincaid 5.2)",
        "importantInformation": [
            {
                "category": "deadline",
                "label": "Offer Acceptance & Deposit Deadline",
                "detail": "Submit enrollment response form and pay $350 non-refundable deposit by May 15, 2026 at 11:59 PM EST.",
                "urgent": True
            },
            {
                "category": "deadline",
                "label": "Final Official Transcripts",
                "detail": "Must be received directly from your institution by July 1, 2026 to verify graduation.",
                "urgent": True
            },
            {
                "category": "warning",
                "label": "Provisional Admission Contingency",
                "detail": "Admission is contingent upon maintaining current academic standing and completion of all prerequisite courses.",
                "urgent": True
            },
            {
                "category": "requirement",
                "label": "Health Immunization Records",
                "detail": "Proof of MMR, Meningitis ACWY, and Tdap vaccines required before dormitory check-in.",
                "urgent": False
            }
        ],
        "deadlines": [
            {
                "task": "Submit Intent to Enroll and $350 Deposit",
                "date": "May 15, 2026",
                "time": "11:59 PM EST",
                "consequences": "Offer may be rescinded and seat offered to waitlisted candidates."
            },
            {
                "task": "Final High School / College Transcripts Submission",
                "date": "July 1, 2026",
                "time": "5:00 PM EST",
                "consequences": "Registration hold placed on Fall class schedule."
            }
        ],
        "requirements": [
            "Submit $350 non-refundable enrollment deposit via student portal.",
            "Maintain a minimum 3.0 cumulative GPA through the conclusion of current academic term.",
            "Submit official final transcripts showing award of secondary diploma."
        ],
        "warnings": [
            "Failure to submit official transcripts by July 1 will result in an administrative registration freeze.",
            "Scholarship renewal requires continuous full-time enrollment and a 3.0 cumulative GPA."
        ],
        "keyPeople": [
            { "name": "Dr. Eleanor Vance", "role": "Dean of Undergraduate Admissions", "contact": "admissions@apex.edu" }
        ],
        "keyTerms": [
            { "term": "Enrollment Deposit", "definition": "A payment of $350 that reserves your spot in the incoming class." }
        ],
        "sections": [
            {
                "id": "sec-1",
                "heading": "1. Formal Offer of Admission",
                "level": 2,
                "originalText": "On behalf of the Faculty of Apex University, it is my privilege to offer you admission to the College of Engineering & Computing for Fall 2026.",
                "simplifiedText": "We are thrilled to invite you to join Apex University this Fall 2026 to study Engineering and Computing.",
                "keyPoints": ["Admitted to College of Engineering & Computing", "Term begins Fall 2026"]
            }
        ],
        "imageDescriptions": [
            {
                "id": "img-seal",
                "type": "stamp",
                "title": "Apex University Embossed Seal",
                "altText": "Official gold-embossed seal of Apex University with motto 'Veritas et Scientia'.",
                "detailedDescription": "A circular university seal in deep navy and embossed gold foil, certifying the authenticity of this official admission letter."
            }
        ],
        "accessibilityNotes": [
            "Transformed with high semantic heading structure (H1 through H3).",
            "High contrast color ratios enabled by default."
        ],
        "screenReaderHtml": "<main role='main'><h1>Apex University — Official Offer of Admission</h1><p>Admitted to Fall 2026 B.S. in Computer Science.</p></main>",
        "metadata": {
            "processedAt": "2026-10-03T12:00:00Z",
            "ocrUsed": False,
            "aiProvider": "Demo Mode (Fictional University Admission Notice)",
            "aiModel": "demo-deterministic-v1",
            "isDemoMode": True,
            "statusMessage": "Demo Mode active — sample AI output for evaluation."
        }
    }


def clean_and_parse_json(content: str) -> Optional[Dict[str, Any]]:
    clean = content.strip()
    if clean.startswith("```json"):
        clean = re.sub(r"^```json\s*", "", clean, flags=re.IGNORECASE)
        clean = re.sub(r"\s*```$", "", clean)
    elif clean.startswith("```"):
        clean = re.sub(r"^```\s*", "", clean)
        clean = re.sub(r"\s*```$", "", clean)
    try:
        return json.loads(clean)
    except Exception:
        match = re.search(r"(\{.*\})", clean, re.DOTALL)
        if match:
            try:
                return json.loads(match.group(1))
            except Exception:
                pass
    return None


class BaseAIProvider:
    def analyze(self, text: str, filename: str, ocr_used: bool, page_count: int) -> Dict[str, Any]:
        raise NotImplementedError


class OpenAICompatibleProvider(BaseAIProvider):
    def __init__(self, api_url: str, api_key: str, model: str):
        self.api_url = api_url or "https://api.openai.com/v1/chat/completions"
        self.api_key = api_key
        self.model = model or "gpt-4o-mini"

    def analyze(self, text: str, filename: str, ocr_used: bool, page_count: int) -> Dict[str, Any]:
        import requests
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.api_key}"
        }
        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": f"Document: {filename}\nOCR: {ocr_used}\n\nContent:\n{text[:30000]}"}
            ],
            "temperature": 0.2
        }
        res = requests.post(self.api_url, headers=headers, json=payload, timeout=60)
        res.raise_for_status()
        data = res.json()
        raw_msg = data.get("choices", [{}])[0].get("message", {}).get("content", "")
        parsed = clean_and_parse_json(raw_msg)
        if parsed:
            parsed.setdefault("metadata", {})
            parsed["metadata"].update({
                "ocrUsed": ocr_used,
                "aiProvider": "OpenAI Compatible API",
                "aiModel": self.model,
                "isDemoMode": False
            })
            return parsed
        raise ValueError("Failed to parse JSON response from OpenAI-compatible provider")


class DemoProvider(BaseAIProvider):
    def analyze(self, text: str, filename: str, ocr_used: bool, page_count: int) -> Dict[str, Any]:
        return get_demo_admission_document(filename)


def resolve_provider():
    provider_type = os.getenv("AI_PROVIDER", "openai").lower().strip()
    api_key = (os.getenv("OPENAI_API_KEY") or os.getenv("AI_API_KEY") or "").strip()
    api_url = os.getenv("AI_API_URL", "https://api.openai.com/v1/chat/completions").strip()
    if "googleapis.com" in api_url or not api_url:
        api_url = "https://api.openai.com/v1/chat/completions"
    model = (os.getenv("OPENAI_MODEL") or os.getenv("AI_MODEL") or "gpt-4o-mini").strip()

    if api_key and (provider_type == "openai" or api_key.startswith("sk-")):
        return OpenAICompatibleProvider(api_url=api_url, api_key=api_key, model=model), False
    return DemoProvider(), True
