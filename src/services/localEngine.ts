import { DocumentAnalysisResult } from '../types';

// Standalone in-browser cognitive transformation engine
export class LocalEngine {
  static getSampleDocument(type: 'admission' | 'medical' | 'lease' = 'admission'): DocumentAnalysisResult {
    if (type === 'medical') {
      return this.transformText(
        `MERCY GENERAL HOSPITAL - PATIENT DISCHARGE INSTRUCTIONS
Patient Name: Jane Martinez | DOB: 04/12/1988 | Discharge Date: October 24, 2026
Attending Physician: Dr. Robert Alvarez, MD (Cardiology)

Diagnosis: Acute exacerbation of mild congestive heart failure (stabilized).
Medication Plan:
1. Furosemide (Lasix) 40mg: Take 1 tablet orally each morning with breakfast.
2. Lisinopril 10mg: Take 1 tablet orally at bedtime.
3. Potassium Chloride 20mEq: Take 1 tablet daily with meals.
WARNING: Do not take non-steroidal anti-inflammatory drugs (NSAIDs like Ibuprofen or Naproxen) without consulting your cardiologist.

Daily Requirements:
- Record your body weight every morning after urinating, prior to breakfast.
- Strictly restrict dietary sodium intake to under 2,000 mg (2 grams) per day.
- Maintain fluid intake limit of 1.5 liters (50 ounces) per 24 hours.

Critical Red Flags - Contact Clinic Immediately or Call 911 if:
- Weight gain of greater than 3 pounds in 24 hours or 5 pounds in one week.
- Sudden onset of shortness of breath while resting or lying flat.
- Persistent swelling in lower ankles or legs that worsens through the day.

Follow-up Appointments:
- Echocardiogram & lab draw (Electrolytes & Creatinine): November 4, 2026 at 9:30 AM.
- Outpatient Cardiology Consultation: November 7, 2026 at 2:00 PM at Heart Institute Suite 300.
Contact Cardiology Clinic: (555) 018-9941.`,
        'Mercy_General_Post_Operative_Instructions.pdf'
      );
    }

    if (type === 'lease') {
      return this.transformText(
        `STANDARD RESIDENTIAL LEASE AGREEMENT
Landlord: Highline Properties LLC (Manager: Sarah Jenkins, Phone: 555-017-4822)
Tenant: Michael Chang
Premises: Apartment 4B, 742 Evergreen Boulevard

1. Term of Lease: 12 months beginning December 1, 2026 and ending November 30, 2027.
2. Monthly Rent: $1,850.00 USD due on or before the 1st calendar day of each month.
3. Grace Period & Late Penalty: Rent received after 11:59 PM on the 5th of the month will incur a mandatory late penalty fee of $75.00.
4. Security Deposit: $1,850.00 deposited into escrow. Deposit shall be refunded within 21 days following move-out, minus legitimate deductions for damages beyond normal wear and tear.
5. Utilities: Tenant is solely responsible for electric, internet, and gas utilities. Landlord provides water, sewer, and trash collection.
6. Prohibitions & Warnings:
- Smoking of any kind is strictly prohibited inside the unit and common hallways. Violation will result in a $250 cleaning fee.
- Pets: Only registered domestic cats/dogs permitted with prior written consent and $35 monthly pet fee.
- Subleasing without written consent is an immediate material breach of contract.
7. Maintenance Requests: Submit via resident portal or email support@highlineproperties.com.`,
        'Standard_Residential_Tenancy_Agreement.pdf'
      );
    }

    // Default: Admission Document
    return {
      title: "Apex University — Official Offer of Admission & Enrollment Requirements (Fall 2026)",
      documentType: "Official University Admission Notice & Financial Aid Award",
      pageCount: 2,
      wordCount: 785,
      readingTimeMinutes: 3,
      summary:
        "This document is an official offer of admission from Apex University to the Bachelor of Science in Computer Science program for the Fall 2026 semester. It outlines mandatory next steps including accepting your offer by May 15, submitting final official academic transcripts by July 1, paying the non-refundable $350 enrollment deposit, and attending mandatory campus orientation on August 20. It also confirms a merit scholarship award of $12,500 per academic year.",
      quickTakeaways: [
        "Admitted to B.S. in Computer Science for Fall 2026 term.",
        "Enrollment deposit of $350 and formal acceptance due by May 15, 2026 (11:59 PM EST).",
        "$12,500 annual renewable Dean's Merit Scholarship awarded.",
        "Final official high school/college transcripts must arrive by July 1, 2026.",
        "Mandatory International & First-Year Student Orientation begins August 20, 2026."
      ],
      simpleVersion:
        "Congratulations! You have been accepted to Apex University for the Fall 2026 semester to study Computer Science.\n\nHere is what you need to do next:\n1. Accept the offer and pay a $350 deposit online before May 15, 2026.\n2. Ask your school to send your final official grades before July 1, 2026.\n3. Complete your student housing application before June 1, 2026 if you plan to live on campus.\n4. Come to campus orientation on August 20, 2026.\n\nYou also won a $12,500 scholarship each year as long as you keep your grades up (GPA 3.0 or higher). If you have questions, you can call or email the Admissions Office.",
      gradeLevel: "Grade 5 Plain Language (Flesch-Kincaid 5.2)",
      importantInformation: [
        {
          category: "deadline",
          label: "Offer Acceptance & Deposit Deadline",
          detail: "Submit enrollment response form and pay $350 non-refundable deposit by May 15, 2026 at 11:59 PM EST.",
          urgent: true
        },
        {
          category: "deadline",
          label: "Final Official Transcripts",
          detail: "Must be received directly from your institution by July 1, 2026 to verify graduation.",
          urgent: true
        },
        {
          category: "warning",
          label: "Provisional Admission Contingency",
          detail: "Admission is contingent upon maintaining current academic standing and completion of all prerequisite courses.",
          urgent: true
        },
        {
          category: "requirement",
          label: "Health Immunization Records",
          detail: "Proof of MMR, Meningitis ACWY, and Tdap vaccines required before dormitory check-in.",
          urgent: false
        },
        {
          category: "contact",
          label: "Undergraduate Admissions Office",
          detail: "Email: admissions@apex.edu | Phone: (555) 019-2834 | Office: Hall of Letters, Room 104",
          urgent: false
        }
      ],
      deadlines: [
        {
          task: "Submit Intent to Enroll and $350 Deposit",
          date: "May 15, 2026",
          time: "11:59 PM EST",
          consequences: "Offer may be rescinded and seat offered to waitlisted candidates."
        },
        {
          task: "Campus Housing Priority Application",
          date: "June 1, 2026",
          time: "5:00 PM EST",
          consequences: "On-campus dorm placement cannot be guaranteed after this date."
        },
        {
          task: "Final High School / College Transcripts Submission",
          date: "July 1, 2026",
          time: "5:00 PM EST",
          consequences: "Registration hold placed on Fall class schedule."
        },
        {
          task: "Immunization & Medical History Forms",
          date: "August 1, 2026",
          time: "5:00 PM EST",
          consequences: "Cannot move into residence halls or attend in-person labs."
        },
        {
          task: "Mandatory New Student Orientation",
          date: "August 20, 2026",
          time: "9:00 AM EST",
          consequences: "Required for course enrollment confirmation."
        }
      ],
      requirements: [
        "Submit $350 non-refundable enrollment deposit via student portal.",
        "Maintain a minimum 3.0 cumulative GPA through the conclusion of current academic term.",
        "Submit official final transcripts showing award of secondary diploma or associate degree.",
        "Complete state-mandated health immunization clearance.",
        "Attend mandatory New Student Orientation in-person on August 20, 2026."
      ],
      warnings: [
        "Failure to submit official transcripts by July 1 will result in an administrative registration freeze.",
        "Any disciplinary actions or significant drops in final term grades may lead to admission revocation.",
        "Scholarship renewal requires continuous full-time enrollment (minimum 12 credits/term) and a 3.0 cumulative GPA."
      ],
      keyPeople: [
        {
          name: "Dr. Eleanor Vance",
          role: "Dean of Undergraduate Admissions",
          contact: "admissions@apex.edu"
        },
        {
          name: "Marcus Holloway",
          role: "Academic Advisor, College of Engineering & Computing",
          contact: "m.holloway@apex.edu | (555) 019-2880"
        }
      ],
      keyTerms: [
        {
          term: "Enrollment Deposit",
          definition: "A payment of $350 that reserves your spot in the incoming class. It is applied toward your first semester tuition."
        },
        {
          term: "Provisional Admission",
          definition: "You are admitted now, but your final acceptance depends on finishing your current school term with good grades."
        }
      ],
      sections: [
        {
          id: "section-welcome",
          heading: "1. Formal Offer of Admission",
          level: 2,
          originalText:
            "On behalf of the Faculty and the Board of Trustees of Apex University, it is my privilege to offer you admission to the College of Engineering & Computing for the Fall 2026 academic year.",
          simplifiedText:
            "We are thrilled to invite you to join Apex University this Fall 2026 to study Engineering and Computing.",
          keyPoints: [
            "Admitted to College of Engineering & Computing",
            "Term begins Fall 2026"
          ]
        },
        {
          id: "section-scholarship",
          heading: "2. Dean's Academic Merit Scholarship Award",
          level: 2,
          originalText:
            "In recognition of your exceptional academic performance, you have been selected to receive the Dean's Academic Merit Scholarship in the amount of $12,500 annually.",
          simplifiedText:
            "You have been awarded a scholarship of $12,500 every year ($6,250 each semester).",
          keyPoints: [
            "$12,500 per year / $6,250 per semester",
            "Renewable for 4 years (8 semesters)"
          ]
        }
      ],
      imageDescriptions: [
        {
          id: "img-crest",
          type: "stamp",
          title: "Apex University Embossed Seal",
          altText: "Official gold-embossed seal of Apex University with motto 'Veritas et Scientia'.",
          detailedDescription: "Circular university seal rendered in deep navy and gold foil with Latin motto."
        }
      ],
      accessibilityNotes: [
        "Document transformed with high semantic heading structure (H1 through H3).",
        "High-contrast color ratio (WCAG AAA compliant 7:1) enabled.",
        "Deadlines arranged in chronological order."
      ],
      screenReaderHtml: `<main role="main"><h1>Apex University Admission Notice</h1><section><h2>Summary</h2><p>You have been admitted to Apex University Computer Science for Fall 2026.</p></section></main>`,
      metadata: {
        processedAt: new Date().toISOString(),
        ocrUsed: false,
        aiProvider: "Demo Mode (Apex University Admission Notice)",
        aiModel: "demo-deterministic-v1",
        isDemoMode: true,
        statusMessage: "Demo Mode Active"
      }
    };
  }

  static transformText(rawText: string, filename: string = 'Document.txt'): DocumentAnalysisResult {
    const clean = rawText.trim();
    const sentences = clean
      .split(/(?<=[.?!])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 5);

    const lines = clean.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
    const words = clean.split(/\s+/).filter(Boolean);

    let title = lines[0]?.slice(0, 90) || `Document: ${filename}`;
    title = title.replace(/^#+\s*/, '').replace(/[:*_-]+$/, '').trim();

    let documentType = 'Official Document';
    const lower = clean.toLowerCase();
    if (lower.includes('patient') || lower.includes('hospital') || lower.includes('discharge') || lower.includes('doctor')) {
      documentType = 'Medical Record / Discharge Notice';
    } else if (lower.includes('lease') || lower.includes('tenant') || lower.includes('landlord') || lower.includes('rent')) {
      documentType = 'Residential Tenancy Agreement';
    } else if (lower.includes('invoice') || lower.includes('bill') || lower.includes('payment due')) {
      documentType = 'Billing & Payment Notice';
    } else if (lower.includes('admission') || lower.includes('university') || lower.includes('scholarship')) {
      documentType = 'Academic Notice';
    } else if (lower.includes('contract') || lower.includes('agreement')) {
      documentType = 'Legal Contract / Agreement';
    }

    const summarySentences = sentences.slice(0, 4);
    const summary = summarySentences.join(' ') || clean.slice(0, 300);

    const quickTakeaways: string[] = [];
    for (const s of sentences) {
      if (quickTakeaways.length >= 4) break;
      if (/(must|shall|require|due|before|deadline|important|warning|danger|penalty|doctor|fee)/i.test(s)) {
        quickTakeaways.push(s.replace(/^[-*•\d.]+\s*/, ''));
      }
    }
    if (quickTakeaways.length === 0) {
      quickTakeaways.push(...sentences.slice(0, 3));
    }

    const simplified = clean
      .replace(/\bcommence\b/gi, 'start')
      .replace(/\bterminate\b/gi, 'end')
      .replace(/\butilize\b/gi, 'use')
      .replace(/\bpursuant to\b/gi, 'following')
      .replace(/\bprior to\b/gi, 'before')
      .replace(/\bsubsequent to\b/gi, 'after')
      .replace(/\bcontingent upon\b/gi, 'depending on')
      .replace(/\bin order to\b/gi, 'to')
      .replace(/\bdisbursed\b/gi, 'paid out')
      .replace(/\brescind\b/gi, 'cancel');

    const simpleVersion = simplified
      .split('\n')
      .filter((l) => l.trim().length > 0)
      .join('\n\n');

    const deadlines: Array<{ task: string; date: string; time?: string; consequences?: string }> = [];
    const dateRegex = /\b(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2}(?:st|nd|rd|th)?(?:\s*,\s*\d{4})?|\b\d{1,2}\/\d{1,2}\/\d{2,4}\b|\bby\s+[A-Z][a-z]+\s+\d{1,2}/gi;
    for (const s of sentences) {
      const dateMatch = s.match(dateRegex);
      if (dateMatch || /(due|deadline|before|by)\b/i.test(s)) {
        const dateStr = dateMatch ? dateMatch[0] : 'Specified in document';
        deadlines.push({
          task: s.slice(0, 90),
          date: dateStr,
          time: 'As indicated in document',
          consequences: /(penalty|fee|rescind|cancel|loss|forfeit|hold)/i.test(s) ? 'Failure to comply may result in penalties or status change.' : undefined
        });
        if (deadlines.length >= 4) break;
      }
    }

    const requirements: string[] = [];
    for (const s of sentences) {
      if (/(must|shall|required|requires|need to|ensure)\b/i.test(s)) {
        requirements.push(s);
        if (requirements.length >= 4) break;
      }
    }
    if (requirements.length === 0) {
      requirements.push('Review document contents thoroughly.');
    }

    const warnings: string[] = [];
    for (const s of sentences) {
      if (/(warning|caution|danger|penalty|fine|consequence|risk|fail|prohibited)\b/i.test(s)) {
        warnings.push(s);
        if (warnings.length >= 3) break;
      }
    }

    const keyPeople: Array<{ name: string; role?: string; contact?: string }> = [];
    const emailMatch = clean.match(/[\w.-]+@[\w.-]+\.\w+/g);
    const phoneMatch = clean.match(/(?:\+?\d{1,3}[-. ]?)?\(?\d{3}\)?[-. ]?\d{3}[-. ]?\d{4}/g);
    if (emailMatch || phoneMatch) {
      keyPeople.push({
        name: 'Document Contact / Department',
        role: 'Inquiries & Official Communications',
        contact: [emailMatch?.[0], phoneMatch?.[0]].filter(Boolean).join(' | ')
      });
    }

    const sections = [
      {
        id: 'sec-1',
        heading: 'Overview & Essential Points',
        level: 2,
        originalText: clean.slice(0, 600),
        simplifiedText: simpleVersion.slice(0, 600),
        keyPoints: quickTakeaways
      }
    ];

    const screenReaderHtml = `<main role="main">
  <h1>${title}</h1>
  <section aria-labelledby="sec-summary">
    <h2 id="sec-summary">Document Summary</h2>
    <p>${summary}</p>
  </section>
  <section aria-labelledby="sec-content">
    <h2 id="sec-content">Plain Language Content</h2>
    ${sentences.map((s) => `<p>${s}</p>`).join('')}
  </section>
</main>`;

    return {
      title,
      documentType,
      pageCount: 1,
      wordCount: words.length,
      readingTimeMinutes: Math.max(1, Math.ceil(words.length / 200)),
      summary,
      quickTakeaways,
      simpleVersion,
      gradeLevel: 'Grade 5-6 Plain Language',
      importantInformation: [
        {
          category: 'general',
          label: 'Cognitive Transformation',
          detail: 'Analyzed with plain-language hierarchy and accessibility enhancements.',
          urgent: false
        }
      ],
      deadlines,
      requirements,
      warnings,
      keyPeople,
      keyTerms: [
        {
          term: 'Plain Language',
          definition: 'Clear, concise communication designed so the reader can understand it on the first reading.'
        }
      ],
      sections,
      imageDescriptions: [],
      accessibilityNotes: [
        'WCAG 2.1 AAA high-contrast layout generated.',
        'Semantic landmarks and headings applied.'
      ],
      screenReaderHtml,
      metadata: {
        processedAt: new Date().toISOString(),
        ocrUsed: false,
        aiProvider: 'ACCESSAI Cognitive Engine',
        aiModel: 'client-edge-v1',
        isDemoMode: true,
        statusMessage: `Processed successfully for ${filename}.`
      }
    };
  }
}
