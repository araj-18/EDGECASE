import React from 'react';
import { FileText, ShieldCheck, Heart, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer
      role="contentinfo"
      className="mt-20 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-12 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                ACCESS<span className="text-blue-600 dark:text-blue-400">AI</span>
              </span>
              <p className="text-xs text-slate-500 font-medium">
                Make Every Document Accessible.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>WCAG 2.2 AAA Compliant</span>
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Provider-Agnostic AI Architecture</span>
            </span>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 ACCESSAI Document Accessibility Platform. Built for real-world inclusive access.</p>
          <p>Strict privacy: Uploaded documents and API credentials are kept strictly private.</p>
        </div>
      </div>
    </footer>
  );
};
