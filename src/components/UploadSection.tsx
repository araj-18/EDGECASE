import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  Sparkles,
  BookOpen,
  Stethoscope,
  Building,
  Type
} from 'lucide-react';
import { ApiService } from '../services/api';
import { DocumentAnalysisResult } from '../types';

interface UploadSectionProps {
  onProcessComplete: (result: DocumentAnalysisResult) => void;
  isProcessing: boolean;
  setIsProcessing: (val: boolean) => void;
}

export const UploadSection: React.FC<UploadSectionProps> = ({
  onProcessComplete,
  isProcessing,
  setIsProcessing
}) => {
  const [activeInputMode, setActiveInputMode] = useState<'upload' | 'paste'>('upload');
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState<string>('');
  const [pastedDocTitle, setPastedDocTitle] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pipelineStep, setPipelineStep] = useState<number>(0);
  const [pipelineStatusNote, setPipelineStatusNote] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_EXTENSIONS = ['.pdf', '.png', '.jpg', '.jpeg', '.webp'];

  const validateFile = (file: File): boolean => {
    setErrorMessage(null);
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();

    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      setErrorMessage(`Unsupported format (${ext}). Supported formats: PDF, PNG, JPG, JPEG.`);
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      setErrorMessage(`File is too large (${(file.size / (1024 * 1024)).toFixed(1)} MB). Maximum allowed size is 10 MB.`);
      return false;
    }

    return true;
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const executePipeline = async (options: {
    file?: File;
    text?: string;
    docName?: string;
  }) => {
    setIsProcessing(true);
    setErrorMessage(null);
    setPipelineStep(1);
    setPipelineStatusNote('Validating document content and structure...');

    try {
      await new Promise((r) => setTimeout(r, 400));
      setPipelineStep(2);
      setPipelineStatusNote(options.file ? 'Extracting digital text layers...' : 'Reading text content...');

      await new Promise((r) => setTimeout(r, 500));
      setPipelineStep(3);
      setPipelineStatusNote('Evaluating clarity, character density & OCR requirements...');

      await new Promise((r) => setTimeout(r, 600));
      setPipelineStep(4);
      setPipelineStatusNote('AI engine transforming language, extracting deadlines & structuring content...');

      let result: DocumentAnalysisResult;
      if (options.file) {
        result = await ApiService.processFile(options.file);
      } else if (options.text) {
        result = await ApiService.processText(options.text, options.docName || 'Document.txt');
      } else {
        result = await ApiService.getDemoData(options.docName);
      }

      setPipelineStep(5);
      setPipelineStatusNote('Creating accessible screen reader views & plain language output...');
      await new Promise((r) => setTimeout(r, 300));

      onProcessComplete(result);
    } catch (err: any) {
      console.warn('Processing pipeline error:', err);
      setErrorMessage(err?.message || 'Processing failed. Please check document contents or try again.');
    } finally {
      setIsProcessing(false);
      setPipelineStep(0);
    }
  };

  const handleProcessFileClick = () => {
    if (!selectedFile) return;
    executePipeline({ file: selectedFile });
  };

  const handleProcessTextClick = () => {
    if (!pastedText.trim()) {
      setErrorMessage('Please paste or type document text to analyze.');
      return;
    }
    executePipeline({
      text: pastedText,
      docName: pastedDocTitle.trim() ? `${pastedDocTitle.trim()}.txt` : 'User_Document.txt'
    });
  };

  const handleSampleClick = (sampleType: string) => {
    if (sampleType === 'admission') {
      executePipeline({ docName: 'Apex_University_Admission_Fall2026.pdf' });
    } else if (sampleType === 'medical') {
      executePipeline({
        text: `MERCY GENERAL HOSPITAL - PATIENT DISCHARGE INSTRUCTIONS
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
        docName: 'Mercy_Hospital_Discharge_Summary.txt'
      });
    } else if (sampleType === 'lease') {
      executePipeline({
        text: `STANDARD RESIDENTIAL LEASE AGREEMENT
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
        docName: 'Standard_Residential_Tenancy_Lease.txt'
      });
    }
  };

  return (
    <section
      id="upload-section"
      aria-labelledby="upload-heading"
      className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
    >
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-md p-6 sm:p-10 transition-colors">
        <div className="text-center mb-8">
          <h2
            id="upload-heading"
            className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight"
          >
            Transform Any Document for Accessibility
          </h2>
          <p className="mt-2 text-slate-700 dark:text-slate-300 text-sm sm:text-base">
            Upload any document or paste text. ACCESSAI analyzes the content with AI to create plain language, deadlines, audio, and screen-reader views.
          </p>
        </div>

        {/* Input Mode Toggle: File Upload vs Paste Text */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => {
                setActiveInputMode('upload');
                setErrorMessage(null);
              }}
              className={`px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeInputMode === 'upload'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Document File</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveInputMode('paste');
                setErrorMessage(null);
              }}
              className={`px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeInputMode === 'paste'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Type className="w-4 h-4" />
              <span>Paste Document Text</span>
            </button>
          </div>
        </div>

        {/* MODE 1: FILE UPLOAD ZONE */}
        {activeInputMode === 'upload' && (
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => !selectedFile && fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all ${
              dragActive
                ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 ring-4 ring-blue-100 dark:ring-blue-900/40'
                : 'border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 bg-slate-50/60 dark:bg-slate-900/40'
            } ${selectedFile ? 'cursor-default' : 'cursor-pointer'}`}
            role="region"
            aria-label="Document upload drop zone"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.webp"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload-input"
              aria-label="Upload document file"
            />

            {!selectedFile ? (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300 flex items-center justify-center mb-4 shadow-xs">
                  <UploadCloud className="w-8 h-8" aria-hidden="true" />
                </div>
                <p className="text-lg font-bold text-slate-800 dark:text-slate-100">
                  Drag & drop your document here
                </p>
                <p className="text-sm text-slate-700 dark:text-slate-300 font-medium mt-1">
                  or <span className="text-blue-600 dark:text-blue-400 underline font-semibold">choose a file</span> from your device
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span className="px-2.5 py-1 bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700">
                    PDF
                  </span>
                  <span className="px-2.5 py-1 bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700">
                    Scanned PDF
                  </span>
                  <span className="px-2.5 py-1 bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700">
                    PNG
                  </span>
                  <span className="px-2.5 py-1 bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700">
                    JPG / JPEG
                  </span>
                  <span className="px-2.5 py-1 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-md border border-blue-200 dark:border-blue-900">
                    Max 10 MB
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs">
                <div className="flex items-center gap-3.5 text-left">
                  <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                    <FileText className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-base truncate max-w-xs sm:max-w-md">
                      {selectedFile.name}
                    </h4>
                    <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5">
                      {(selectedFile.size / 1024).toFixed(0)} KB • {selectedFile.type || 'Document'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile();
                    }}
                    disabled={isProcessing}
                    className="px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg transition-colors font-medium flex items-center gap-1"
                    aria-label="Remove selected document"
                  >
                    <X className="w-4 h-4" aria-hidden="true" />
                    <span>Remove</span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProcessFileClick();
                    }}
                    disabled={isProcessing}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-lg shadow-sm transition-all flex items-center gap-2"
                    aria-label="Process document with AI"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" aria-hidden="true" />
                        <span>Process Document</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* MODE 2: PASTE DOCUMENT TEXT */}
        {activeInputMode === 'paste' && (
          <div className="space-y-4">
            <div>
              <label htmlFor="pasted-doc-title" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Document Title (Optional):
              </label>
              <input
                id="pasted-doc-title"
                type="text"
                placeholder="e.g. Tenancy Agreement, Hospital Instructions, Utility Notice"
                value={pastedDocTitle}
                onChange={(e) => setPastedDocTitle(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="pasted-doc-text" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Paste Text Content:
              </label>
              <textarea
                id="pasted-doc-text"
                rows={7}
                placeholder="Paste the text from any letter, contract, notice, invoice, or legal document here..."
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                className="w-full p-4 text-sm rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-sans focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">
                {pastedText.split(/\s+/).filter(Boolean).length} words
              </span>
              <button
                type="button"
                onClick={handleProcessTextClick}
                disabled={isProcessing || !pastedText.trim()}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-bold text-sm rounded-xl shadow-sm transition-all flex items-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing Text...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Process Text Content</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Error message announcement */}
        {errorMessage && (
          <div
            role="alert"
            className="mt-4 p-4 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-800 dark:text-red-200 flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" aria-hidden="true" />
            <div className="text-sm font-medium">{errorMessage}</div>
          </div>
        )}

        {/* Processing Pipeline Animation */}
        {isProcessing && (
          <div
            role="status"
            aria-live="polite"
            className="mt-8 p-6 rounded-2xl bg-blue-50/60 dark:bg-slate-900/80 border border-blue-200 dark:border-slate-700 animate-fade-in"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-blue-600 animate-spin" aria-hidden="true" />
                <span>Processing Document Pipeline</span>
              </span>
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                Step {pipelineStep} of 5
              </span>
            </div>

            <div className="space-y-3">
              {[
                { step: 1, label: 'Document validated' },
                { step: 2, label: 'Text parsed & extracted' },
                { step: 3, label: 'Quality & OCR evaluated' },
                { step: 4, label: 'AI analyzing language & extracting deadlines' },
                { step: 5, label: 'Creating accessible screen reader version' }
              ].map((item) => (
                <div key={item.step} className="flex items-center gap-3 text-sm">
                  {pipelineStep > item.step ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" aria-label="Completed" />
                  ) : pipelineStep === item.step ? (
                    <Loader2 className="w-5 h-5 text-blue-600 animate-spin shrink-0" aria-label="In Progress" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-600 shrink-0" />
                  )}
                  <span
                    className={`font-medium ${
                      pipelineStep === item.step
                        ? 'text-blue-700 dark:text-blue-300 font-bold'
                        : pipelineStep > item.step
                        ? 'text-slate-800 dark:text-slate-200'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            <p className="mt-4 text-xs text-slate-700 dark:text-slate-300 italic">
              Status: {pipelineStatusNote}
            </p>
          </div>
        )}

        {/* 1-Click Sample Documents */}
        <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Or Try Sample Documents (1-Click Evaluation)
              </h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                Click any pre-built sample below to see how ACCESSAI processes different document types:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => handleSampleClick('admission')}
              disabled={isProcessing}
              className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 bg-slate-50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-800 text-left transition-all group focus:ring-2 focus:ring-blue-500"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <BookOpen className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
                <span className="font-bold text-xs text-slate-900 dark:text-white">
                  University Offer Letter
                </span>
              </div>
              <p className="text-[11px] text-slate-700 dark:text-slate-300 line-clamp-2">
                Apex University admission notice with deadline, merit scholarship, and seal.
              </p>
            </button>

            <button
              onClick={() => handleSampleClick('medical')}
              disabled={isProcessing}
              className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 bg-slate-50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-800 text-left transition-all group focus:ring-2 focus:ring-blue-500"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <Stethoscope className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
                <span className="font-bold text-xs text-slate-900 dark:text-white">
                  Hospital Discharge Summary
                </span>
              </div>
              <p className="text-[11px] text-slate-700 dark:text-slate-300 line-clamp-2">
                Congestive heart failure instructions, Lasix dosage, and warning fever thresholds.
              </p>
            </button>

            <button
              onClick={() => handleSampleClick('lease')}
              disabled={isProcessing}
              className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 bg-slate-50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-800 text-left transition-all group focus:ring-2 focus:ring-blue-500"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <Building className="w-4 h-4 text-purple-600 group-hover:scale-110 transition-transform" />
                <span className="font-bold text-xs text-slate-900 dark:text-white">
                  Residential Tenancy Lease
                </span>
              </div>
              <p className="text-[11px] text-slate-700 dark:text-slate-300 line-clamp-2">
                Apartment rental agreement with deposit, late fee grace periods, and rules.
              </p>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
