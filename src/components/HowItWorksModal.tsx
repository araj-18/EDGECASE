import React from 'react';
import {
  X,
  HelpCircle,
  FileCheck2,
  ScanText,
  Cpu,
  Layers,
  Sparkles,
  Volume2,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const steps = [
    {
      num: '01',
      title: 'File Validation & Digital Extraction',
      desc: 'Accepts PDF, PNG, JPG, or JPEG up to 10 MB. PyMuPDF inspects digital font streams, structure metadata, and page counts.',
      badge: 'PyMuPDF Engine'
    },
    {
      num: '02',
      title: 'Optical Character Recognition (OCR)',
      desc: 'If a document is scanned, flattened, or an image file with low character density, Tesseract OCR extracts text character-by-character.',
      badge: 'Tesseract OCR'
    },
    {
      num: '03',
      title: 'Provider-Agnostic AI Analysis',
      desc: 'Extracts critical deadlines, requirements, warnings, key people, and jargon without hallucinating or modifying legal meaning.',
      badge: 'Universal AI Adapter'
    },
    {
      num: '04',
      title: 'Cognitive Simplification & HTML Generation',
      desc: 'Rewrites text into plain English (Grade 5-6 reading level) and formats semantic, screen-reader-compliant HTML with ARIA tags.',
      badge: 'WCAG AAA Semantics'
    },
    {
      num: '05',
      title: 'Multi-Sensory Access & Audio Synthesis',
      desc: 'Read aloud via browser Text-to-Speech (Web Speech API) with speed control, high-contrast low-vision profiles, and dyslexia formatting.',
      badge: 'Web Speech API'
    }
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="how-it-works-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div className="relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-2xl w-full p-6 sm:p-8 shadow-2xl animate-fade-in text-slate-900 dark:text-white">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
              <HelpCircle className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2 id="how-it-works-title" className="text-xl font-bold">
                How ACCESSAI Works
              </h2>
              <p className="text-xs text-slate-500">
                End-to-end cognitive and sensory document transformation pipeline
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            aria-label="Close how it works modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-5 space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          {steps.map((st) => (
            <div
              key={st.num}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-start gap-4"
            >
              <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                {st.num}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {st.title}
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    {st.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {st.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
