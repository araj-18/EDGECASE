import React, { useEffect, useState } from 'react';
import {
  X,
  Cpu,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  RefreshCw,
  Terminal,
  ExternalLink
} from 'lucide-react';
import { ApiService } from '../services/api';
import { ProviderStatus } from '../types';

interface ProviderStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProviderStatusModal: React.FC<ProviderStatusModalProps> = ({ isOpen, onClose }) => {
  const [status, setStatus] = useState<ProviderStatus | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const data = await ApiService.getProviderStatus();
      setStatus(data);
    } catch (e) {
      console.warn('Could not fetch provider status', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="provider-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div className="relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-2xl w-full p-6 sm:p-8 shadow-2xl animate-fade-in text-slate-900 dark:text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
              <Cpu className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2 id="provider-modal-title" className="text-xl font-bold">
                Google Gemini 3.5 Flash Integration
              </h2>
              <p className="text-xs text-slate-500">
                Dedicated multimodal document processing with Google GenAI SDK
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            aria-label="Close provider modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Provider Status Card */}
        <div className="py-5 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Live Backend Status (Endpoint: /api/provider)
            </span>
            <button
              onClick={fetchStatus}
              disabled={loading}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>

          {status ? (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Active Provider Engine:
                </span>
                <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  {status.provider}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Active Model:
                </span>
                <code className="text-xs font-mono bg-white dark:bg-slate-900 px-2 py-1 rounded border border-slate-200 dark:border-slate-700">
                  {status.model}
                </code>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Integration State:
                </span>
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    status.isDemoMode
                      ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200'
                      : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200'
                  }`}
                >
                  {status.isDemoMode ? 'Demo Mode Active' : 'Live AI Connected'}
                </span>
              </div>

              <p className="text-xs text-slate-500 pt-2 border-t border-slate-200 dark:border-slate-700">
                {status.statusMessage}
              </p>
            </div>
          ) : (
            <div className="text-sm text-slate-500">Checking provider connection...</div>
          )}
        </div>

        {/* Dedicated Gemini 3.5 Flash Configuration Guide */}
        <div className="py-5 space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
            Dedicated Gemini Configuration
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            ACCESSAI is exclusively integrated with Google Gemini 3.5 Flash for high-speed multimodal document accessibility analysis:
          </p>

          <div className="p-4 rounded-xl bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto space-y-1">
            <div className="text-slate-400"># Google Gemini 3.5 Flash</div>
            <div><span className="text-blue-400">AI_PROVIDER</span>="gemini"</div>
            <div><span className="text-blue-400">AI_MODEL</span>="gemini-3.5-flash"</div>
            <div><span className="text-blue-400">GEMINI_API_KEY</span>="AIzaSy..."</div>
          </div>

          <div className="flex items-center gap-2 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-xs text-blue-900 dark:text-blue-200">
            <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
            <span>
              Zero-leakage security: API keys are stored exclusively in server environment variables and never returned via the API.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
