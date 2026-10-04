import React, { useState } from 'react';
import {
  FileText,
  Copy,
  Download,
  Check,
  Calendar,
  AlertTriangle,
  Info,
  Clock,
  Layers,
  Image as ImageIcon,
  Volume2,
  BookOpen,
  Code,
  ShieldCheck,
  User,
  Sparkles,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { DocumentAnalysisResult } from '../types';
import { TTSPlayer } from './TTSPlayer';
import { useAccessibility } from '../context/AccessibilityContext';

interface ResultsDashboardProps {
  data: DocumentAnalysisResult;
  onReset: () => void;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ data, onReset }) => {
  const { settings } = useAccessibility();
  const [activeTab, setActiveTab] = useState<
    'summary' | 'simple' | 'important' | 'screen_reader' | 'images' | 'audio'
  >('summary');
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [expandedSectionId, setExpandedSectionId] = useState<string | null>(
    data.sections[0]?.id || null
  );

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  const downloadTextFile = () => {
    const content = `ACCESSAI ACCESSIBLE DOCUMENT EXPORT
Title: ${data.title}
Type: ${data.documentType}
Date: ${data.metadata.processedAt}
OCR Used: ${data.metadata.ocrUsed ? 'Yes' : 'No'}
AI Engine: ${data.metadata.aiProvider} (${data.metadata.aiModel})

=== EXECUTIVE SUMMARY ===
${data.summary}

=== KEY TAKEAWAYS ===
${data.quickTakeaways.map((t) => `• ${t}`).join('\n')}

=== PLAIN LANGUAGE VERSION (GRADE 5-6) ===
${data.simpleVersion}

=== CRITICAL DEADLINES ===
${data.deadlines.map((d) => `• ${d.task}: Due ${d.date} (${d.time || 'Time unspecified'}). ${d.consequences || ''}`).join('\n')}

=== REQUIREMENTS ===
${data.requirements.map((r) => `• ${r}`).join('\n')}

=== WARNINGS & ADVISORIES ===
${data.warnings.map((w) => `• ${w}`).join('\n')}

=== SECTIONS ===
${data.sections.map((s) => `\n## ${s.heading}\n${s.simplifiedText}`).join('\n')}
`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${data.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_accessible.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadHtmlFile = () => {
    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${data.title} — Accessible Screen Reader Format</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.7; max-width: 800px; margin: 40px auto; padding: 0 20px; color: #111; }
    h1 { color: #1e3a8a; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; }
    h2 { color: #1e40af; margin-top: 2rem; }
    .alert-box { border-left: 4px solid #ea580c; background: #fff7ed; padding: 1rem; margin: 1rem 0; }
    .takeaways { background: #f0fdf4; border-left: 4px solid #16a34a; padding: 1rem; margin: 1rem 0; }
  </style>
</head>
<body>
  ${data.screenReaderHtml}
</body>
</html>`;
    const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${data.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_accessible.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section
      id="results-section"
      aria-labelledby="results-title"
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in"
    >
      {/* Demo Mode Notice Banner if Demo Mode active (Section 10 & 11) */}
      {data.metadata.isDemoMode && (
        <div
          role="status"
          className="mb-6 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs"
        >
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-amber-200/80 dark:bg-amber-900 font-bold text-amber-800 dark:text-amber-200 text-xs">
              DEMO MODE
            </span>
            <div>
              <p className="font-bold text-sm">
                Demo Mode — sample AI output
              </p>
              <p className="text-xs text-amber-800 dark:text-amber-300">
                {data.metadata.statusMessage ||
                  'Demonstrating complete document extraction, OCR, plain-language simplification and audio.'}
              </p>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-amber-800 dark:text-amber-300 bg-white/60 dark:bg-black/30 px-2.5 py-1 rounded-md shrink-0">
            Hackathon Demonstration
          </span>
        </div>
      )}

      {/* Scanned PDF notice if OCR was used (Section 17) */}
      {data.metadata.ocrUsed && (
        <div
          role="status"
          className="mb-6 p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200 flex items-center gap-3 shadow-xs"
        >
          <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" aria-hidden="true" />
          <p className="text-sm font-semibold">
            Scanned document detected — OCR was used to convert visual text into accessible characters.
          </p>
        </div>
      )}

      {/* Document Header Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm mb-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-700">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-bold">
                {data.documentType || 'Official Document'}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium">
                {data.pageCount || 1} {data.pageCount === 1 ? 'Page' : 'Pages'}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium">
                ~{data.readingTimeMinutes || 2} min read ({data.wordCount || 500} words)
              </span>
              <span className="px-2.5 py-1 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                {data.gradeLevel || 'Grade 5-6 Plain Language'}
              </span>
            </div>

            <h2
              id="results-title"
              className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight"
            >
              {data.title}
            </h2>
          </div>

          <button
            onClick={onReset}
            className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all shrink-0"
          >
            ← Upload Another Document
          </button>
        </div>

        {/* Copy & Download Actions Toolbar (Section 24) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => copyToClipboard(data.summary, 'summary')}
              className="px-3.5 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1.5"
              aria-label="Copy concise summary to clipboard"
            >
              {copiedType === 'summary' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Copied Summary!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Summary</span>
                </>
              )}
            </button>

            <button
              onClick={() => copyToClipboard(data.simpleVersion, 'simple')}
              className="px-3.5 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1.5"
              aria-label="Copy plain language version to clipboard"
            >
              {copiedType === 'simple' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Copied Plain Language!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Simple Version</span>
                </>
              )}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={downloadTextFile}
              className="px-3.5 py-2 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900 border border-blue-200 dark:border-blue-800 text-xs font-semibold transition-colors flex items-center gap-1.5"
              aria-label="Download accessible plain text file"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download TXT</span>
            </button>

            <button
              onClick={downloadHtmlFile}
              className="px-3.5 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold transition-colors flex items-center gap-1.5"
              aria-label="Download semantic accessible HTML file"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Accessible HTML</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs (Section 18) */}
      <div
        role="tablist"
        aria-label="Document view formats"
        className="flex items-center gap-1 sm:gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl mb-8 overflow-x-auto"
      >
        {[
          { id: 'summary', label: 'Summary', icon: BookOpen },
          { id: 'simple', label: 'Simple Version', icon: Sparkles },
          { id: 'important', label: 'Important Info', icon: AlertTriangle, badge: data.deadlines.length + data.warnings.length },
          { id: 'screen_reader', label: 'Screen Reader', icon: Code },
          { id: 'images', label: 'Images & Seals', icon: ImageIcon, badge: data.imageDescriptions.length },
          { id: 'audio', label: 'Text-to-Speech', icon: Volume2 }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              id={`tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" aria-hidden="true" />
              <span>{tab.label}</span>
              {typeof tab.badge === 'number' && tab.badge > 0 && (
                <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-[10px] flex items-center justify-center font-black">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB PANEL 1: SUMMARY */}
      {activeTab === 'summary' && (
        <div
          role="tabpanel"
          id="panel-summary"
          aria-labelledby="tab-summary"
          className="space-y-6 animate-fade-in"
        >
          {/* Executive Summary Card */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" aria-hidden="true" />
              <span>Executive Summary</span>
            </h3>
            <p className="text-slate-800 dark:text-slate-200 text-base sm:text-lg leading-relaxed font-normal">
              {data.summary}
            </p>
          </div>

          {/* Quick Takeaways Grid */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Check className="w-5 h-5 text-emerald-600" aria-hidden="true" />
              <span>Quick Key Takeaways</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {data.quickTakeaways.map((takeaway, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-start gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-snug">
                    {takeaway}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB PANEL 2: SIMPLE VERSION */}
      {activeTab === 'simple' && (
        <div
          role="tabpanel"
          id="panel-simple"
          aria-labelledby="tab-simple"
          className="space-y-6 animate-fade-in"
        >
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" aria-hidden="true" />
                <span>Simplified Plain Language (Grade 5-6)</span>
              </h3>
              <span className="text-xs px-2.5 py-1 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-semibold border border-blue-200 dark:border-blue-900">
                Cognitive Clarity
              </span>
            </div>
            <div className="text-slate-800 dark:text-slate-200 text-base sm:text-lg leading-relaxed whitespace-pre-line space-y-4">
              {data.simpleVersion}
            </div>
          </div>

          {/* Section-by-section breakdown accordion */}
          {data.sections && data.sections.length > 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                Section Breakdown: Original vs Plain Language
              </h3>
              <div className="space-y-4">
                {data.sections.map((section, idx) => {
                  const sectionKey = `${section.id || 'sec'}-${idx}`;
                  const isExpanded = expandedSectionId === section.id;
                  return (
                    <div
                      key={sectionKey}
                      className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden"
                    >
                      <button
                        onClick={() => setExpandedSectionId(isExpanded ? null : section.id)}
                        className="w-full p-4 bg-slate-50 dark:bg-slate-900 flex items-center justify-between text-left hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
                        aria-expanded={isExpanded}
                      >
                        <span className="font-bold text-sm text-slate-900 dark:text-white">
                          {section.heading}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-slate-500" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-500" />
                        )}
                      </button>

                      {isExpanded && (
                        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4 bg-white dark:bg-slate-800">
                          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                              Original Text
                            </h4>
                            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-mono">
                              {section.originalText}
                            </p>
                          </div>
                          <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
                              Simplified Interpretation
                            </h4>
                            <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                              {section.simplifiedText}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB PANEL 3: IMPORTANT INFORMATION (Deadlines, Requirements, Warnings) */}
      {activeTab === 'important' && (
        <div
          role="tabpanel"
          id="panel-important"
          aria-labelledby="tab-important"
          className="space-y-6 animate-fade-in"
        >
          {/* Deadlines Section */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" aria-hidden="true" />
              <span>Critical Deadlines & Timelines</span>
            </h3>
            {data.deadlines.length === 0 ? (
              <p className="text-sm text-slate-500">Not specified in the document.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {data.deadlines.map((dl, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-blue-50/60 dark:bg-slate-900 border border-blue-200 dark:border-slate-700 relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-black px-2.5 py-0.5 rounded bg-blue-600 text-white">
                        {dl.date}
                      </span>
                      {dl.time && (
                        <span className="text-xs font-medium text-slate-500">
                          {dl.time}
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white mb-1">
                      {dl.task}
                    </h4>
                    {dl.consequences && (
                      <p className="text-xs text-red-600 dark:text-red-400 font-semibold mt-2">
                        ⚠️ Impact: {dl.consequences}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Warnings & Requirements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Warnings */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-red-600 dark:text-red-400 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" aria-hidden="true" />
                <span>Warnings & Contingencies</span>
              </h3>
              {data.warnings.length === 0 ? (
                <p className="text-sm text-slate-500">No critical warnings stated.</p>
              ) : (
                <ul className="space-y-3">
                  {data.warnings.map((w, idx) => (
                    <li
                      key={idx}
                      className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs font-semibold text-red-900 dark:text-red-200 leading-relaxed"
                    >
                      {w}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Requirements */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" aria-hidden="true" />
                <span>Mandatory Requirements</span>
              </h3>
              {data.requirements.length === 0 ? (
                <p className="text-sm text-slate-500">None explicitly listed.</p>
              ) : (
                <ul className="space-y-2.5">
                  {data.requirements.map((r, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-xs font-medium text-slate-800 dark:text-slate-200"
                    >
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Key Contacts & People */}
          {data.keyPeople.length > 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" aria-hidden="true" />
                <span>Important People & Contacts</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {data.keyPeople.map((person, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                  >
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {person.name}
                    </h4>
                    {person.role && (
                      <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                        {person.role}
                      </p>
                    )}
                    {person.contact && (
                      <p className="text-xs text-slate-500 mt-2 font-mono break-all">
                        {person.contact}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key Terms Definition */}
          {data.keyTerms.length > 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-purple-600" aria-hidden="true" />
                <span>Jargon & Key Terms Explained Simply</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {data.keyTerms.map((term, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-purple-50/40 dark:bg-slate-900 border border-purple-200 dark:border-slate-700"
                  >
                    <span className="font-bold text-xs text-purple-900 dark:text-purple-300">
                      {term.term}
                    </span>
                    <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
                      {term.definition}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB PANEL 4: SCREEN READER VIEW */}
      {activeTab === 'screen_reader' && (
        <div
          role="tabpanel"
          id="panel-screen_reader"
          aria-labelledby="tab-screen_reader"
          className="space-y-6 animate-fade-in"
        >
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Code className="w-5 h-5 text-emerald-600" aria-hidden="true" />
                  <span>Semantic Screen Reader Format</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Audited with strict WCAG AAA semantic hierarchy, ARIA landmarks, and high contrast.
                </p>
              </div>
              <button
                onClick={() => copyToClipboard(data.screenReaderHtml, 'html')}
                className="px-3 py-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 font-bold text-xs hover:bg-emerald-200 transition-colors flex items-center gap-1.5"
              >
                {copiedType === 'html' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy Semantic HTML</span>
              </button>
            </div>

            {/* Rendered HTML Sandbox View */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 prose dark:prose-invert max-w-none text-slate-900 dark:text-white">
              <div dangerouslySetInnerHTML={{ __html: data.screenReaderHtml }} />
            </div>

            {/* Accessibility Notes */}
            {data.accessibilityNotes && data.accessibilityNotes.length > 0 && (
              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Applied Accessibility Enhancements
                </h4>
                <div className="flex flex-wrap gap-2">
                  {data.accessibilityNotes.map((note, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800 text-xs font-medium"
                    >
                      ✓ {note}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB PANEL 5: IMAGES & FIGURES */}
      {activeTab === 'images' && (
        <div
          role="tabpanel"
          id="panel-images"
          aria-labelledby="tab-images"
          className="space-y-6 animate-fade-in"
        >
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-pink-600" aria-hidden="true" />
              <span>Sensory Image & Stamp Descriptions</span>
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Official documents often feature visual elements like seals, signatures, and charts. Here are screen reader descriptions:
            </p>

            {data.imageDescriptions.length === 0 ? (
              <p className="text-sm text-slate-500">No visual stamps or figures detected.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {data.imageDescriptions.map((img, idx) => (
                  <div
                    key={`${img.id || 'img'}-${idx}`}
                    className="p-5 rounded-2xl bg-pink-50/50 dark:bg-slate-900 border border-pink-200 dark:border-slate-700"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2.5 py-0.5 rounded bg-pink-600 text-white font-bold text-[10px] uppercase">
                        {img.type}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                      {img.title}
                    </h4>
                    <div className="mt-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Alt Text:
                      </span>
                      <p className="text-xs font-mono bg-white dark:bg-slate-800 p-2 rounded border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 mt-1">
                        "{img.altText}"
                      </p>
                    </div>
                    <div className="mt-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Detailed Sensory Description:
                      </span>
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mt-1">
                        {img.detailedDescription}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB PANEL 6: TEXT-TO-SPEECH AUDIO */}
      {activeTab === 'audio' && (
        <div
          role="tabpanel"
          id="panel-audio"
          aria-labelledby="tab-audio"
          className="space-y-6 animate-fade-in"
        >
          <TTSPlayer documentData={data} />
        </div>
      )}
    </section>
  );
};
