import React from 'react';
import {
  UploadCloud,
  PlayCircle,
  FileCheck2,
  ScanText,
  AlertTriangle,
  Code,
  Image as ImageIcon,
  Volume2,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface HeroLandingProps {
  onUploadClick: () => void;
  onDemoClick: () => void;
}

export const HeroLanding: React.FC<HeroLandingProps> = ({ onUploadClick, onDemoClick }) => {
  return (
    <section aria-labelledby="hero-title" className="relative pt-8 pb-16 md:pt-16 md:pb-24 overflow-hidden">
      {/* Background glowing gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-blue-500/10 dark:bg-blue-600/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Startup Pill Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs sm:text-sm font-semibold mb-6 shadow-xs animate-fade-in">
          <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
          <span>Universal Cognitive & Sensory Accessibility Platform</span>
        </div>

        {/* Hero Title */}
        <h1
          id="hero-title"
          className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-4"
        >
          ACCESS<span className="text-blue-600 dark:text-blue-500">AI</span>
        </h1>

        {/* Sub-Headline */}
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight mb-6">
          Make Every Document Accessible.
        </h2>

        {/* Subtitle */}
        <p className="max-w-3xl mx-auto text-base sm:text-xl text-slate-700 dark:text-slate-200 font-normal mb-10 leading-relaxed">
          Transform complex documents into clear, understandable and accessible information using AI.
          Extract digital text, run OCR on scanned forms, extract critical deadlines, and listen via text-to-speech.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <button
            onClick={onUploadClick}
            className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base sm:text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2.5 focus:ring-4 focus:ring-blue-300"
            aria-label="Upload your document now"
          >
            <UploadCloud className="w-5 h-5" aria-hidden="true" />
            <span>Upload Document</span>
          </button>

          <button
            onClick={onDemoClick}
            className="px-8 py-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-base sm:text-lg border border-slate-300 dark:border-slate-700 shadow-xs hover:-translate-y-0.5 transition-all flex items-center gap-2.5 focus:ring-4 focus:ring-slate-300"
            aria-label="Try Sample University Admission Notice in Demo Mode"
          >
            <PlayCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
            <span>Try Demo</span>
          </button>
        </div>

        {/* Visual Workflow (Section 12) */}
        <div className="mb-20">
          <div className="text-xs uppercase tracking-widest font-black text-slate-700 dark:text-slate-300 mb-6">
            Intelligent Document Transformation Pipeline
          </div>
          <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { step: '01', title: 'UPLOAD', desc: 'PDF, Scanned & Image Files' },
              { step: '02', title: 'EXTRACT', desc: 'PyMuPDF & Tesseract OCR' },
              { step: '03', title: 'UNDERSTAND', desc: 'Provider-Agnostic AI' },
              { step: '04', title: 'SIMPLIFY', desc: 'Plain English (Grade 5)' },
              { step: '05', title: 'ACCESS', desc: 'Audio, Screen Reader & HTML' }
            ].map((node, idx) => (
              <div
                key={node.step}
                className="relative bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-left shadow-xs"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
                    {node.step}
                  </span>
                  {idx < 4 && (
                    <ArrowRight className="hidden sm:block w-3.5 h-3.5 text-slate-400 -mr-2" aria-hidden="true" />
                  )}
                </div>
                <div className="font-extrabold text-sm text-slate-900 dark:text-white tracking-wide">
                  {node.title}
                </div>
                <div className="text-xs text-slate-700 dark:text-slate-300 mt-1 leading-snug">
                  {node.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Cards Grid (Section 12) */}
        <div className="text-left mb-6">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
            Engineered For Every Accessibility Need
          </h3>
          <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base font-medium">
            Bridging cognitive overload, visual impairments, and sensory barriers with real-time AI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {/* Card 1: AI Simplification */}
          <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs hover:border-blue-400 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300 flex items-center justify-center mb-5">
              <FileCheck2 className="w-6 h-6" aria-hidden="true" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              AI Simplification
            </h4>
            <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
              Rewrites dense legalese, bureaucratic forms, and academic jargon into plain, clear language (Grade 5-6 reading level) without altering critical legal or official meaning.
            </p>
          </div>

          {/* Card 2: OCR */}
          <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs hover:border-blue-400 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-300 flex items-center justify-center mb-5">
              <ScanText className="w-6 h-6" aria-hidden="true" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              OCR & Scanned PDF Extraction
            </h4>
            <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
              Automatically detects flattened or scanned pages. Uses Tesseract OCR to convert unselectable images, receipts, and faxes into clean machine-readable digital text.
            </p>
          </div>

          {/* Card 3: Important Information */}
          <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs hover:border-blue-400 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-300 flex items-center justify-center mb-5">
              <AlertTriangle className="w-6 h-6" aria-hidden="true" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Important Information Extraction
            </h4>
            <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
              Instantly surfaces critical dates, submission deadlines, financial terms, prerequisites, warnings, and contacts into high-visibility urgency cards.
            </p>
          </div>

          {/* Card 4: Screen Reader View */}
          <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs hover:border-blue-400 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-300 flex items-center justify-center mb-5">
              <Code className="w-6 h-6" aria-hidden="true" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Screen Reader Semantic HTML
            </h4>
            <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
              Generates properly nested semantic HTML with strict heading hierarchies (H1-H3), ARIA landmark roles, and accessible table representations ready for NVDA, JAWS, or VoiceOver.
            </p>
          </div>

          {/* Card 5: Image Descriptions */}
          <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs hover:border-blue-400 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-pink-100 dark:bg-pink-900/60 text-pink-600 dark:text-pink-300 flex items-center justify-center mb-5">
              <ImageIcon className="w-6 h-6" aria-hidden="true" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Sensory Image Descriptions
            </h4>
            <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
              Provides detailed descriptions and screen-reader alt text for charts, figures, official embossed seals, stamps, and handwritten signatures detected across pages.
            </p>
          </div>

          {/* Card 6: Text-to-Speech */}
          <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs hover:border-blue-400 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/60 text-purple-600 dark:text-purple-300 flex items-center justify-center mb-5">
              <Volume2 className="w-6 h-6" aria-hidden="true" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Interactive Text-to-Speech
            </h4>
            <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
              Built-in browser SpeechSynthesis player with 0.75x–2x speed controls, system voice selection, and section-by-section spoken playback without auto-playing.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
