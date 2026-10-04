import React from 'react';
import {
  X,
  Sliders,
  Type,
  Eye,
  Volume2,
  Sparkles,
  RotateCcw,
  Check
} from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';
import { AccessibilityProfile } from '../types';

interface AccessibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccessibilityModal: React.FC<AccessibilityModalProps> = ({ isOpen, onClose }) => {
  const { settings, updateSettings, applyProfile, resetSettings } = useAccessibility();

  if (!isOpen) return null;

  const profiles: Array<{ id: AccessibilityProfile; label: string; desc: string }> = [
    { id: 'standard', label: 'Standard', desc: 'Default modern accessible design' },
    { id: 'simple', label: 'Simple Language', desc: 'Prioritizes plain English and clean reading' },
    { id: 'low_vision', label: 'Low Vision', desc: 'Large high-contrast text and bold borders' },
    { id: 'dyslexia', label: 'Dyslexia Friendly', desc: 'Weighted typography and generous letter spacing' },
    { id: 'audio_first', label: 'Audio First', desc: 'Optimized for spoken document review' },
    { id: 'screen_reader', label: 'Screen Reader', desc: 'Optimized for NVDA, JAWS & VoiceOver' }
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="accessibility-settings-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div className="relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-2xl w-full p-6 sm:p-8 shadow-2xl animate-fade-in text-slate-900 dark:text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
              <Sliders className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2 id="accessibility-settings-title" className="text-xl font-bold">
                Accessibility Profiles & Preferences
              </h2>
              <p className="text-xs text-slate-500">
                Customize your sensory, visual, and cognitive reading environment.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            aria-label="Close accessibility settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profiles Section (Section 19) */}
        <div className="py-5 border-b border-slate-200 dark:border-slate-800">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Select Accessibility Profile (1-Click Optimization):
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {profiles.map((p) => {
              const isSelected = settings.profile === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => applyProfile(p.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 ring-2 ring-blue-500'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">
                      {p.label}
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug line-clamp-2">
                    {p.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Detailed Controls (Section 21) */}
        <div className="py-5 space-y-4">
          {/* Font Size */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-bold block">Text Font Size</span>
              <span className="text-xs text-slate-500">Scale interface and document text</span>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              {(['sm', 'md', 'lg', 'xl'] as const).map((sz) => (
                <button
                  key={sz}
                  onClick={() => updateSettings({ fontSize: sz })}
                  className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition-all ${
                    settings.fontSize === sz
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Line Spacing */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-bold block">Line Spacing</span>
              <span className="text-xs text-slate-500">Expands line distance for cognitive ease</span>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              {(['normal', 'relaxed', 'loose'] as const).map((sp) => (
                <button
                  key={sp}
                  onClick={() => updateSettings({ lineSpacing: sp })}
                  className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all ${
                    settings.lineSpacing === sp
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {sp}
                </button>
              ))}
            </div>
          </div>

          {/* Contrast & Theme */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-bold block">Color Theme</span>
              <span className="text-xs text-slate-500">Light, Dark, or High Contrast Mode</span>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              {(['light', 'dark', 'high-contrast'] as const).map((th) => (
                <button
                  key={th}
                  onClick={() => updateSettings({ theme: th })}
                  className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all ${
                    settings.theme === th
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {th === 'high-contrast' ? 'High Contrast' : th}
                </button>
              ))}
            </div>
          </div>

          {/* Dyslexia Typography Toggle */}
          <div className="flex items-center justify-between pt-2">
            <div>
              <span className="text-sm font-bold block">Dyslexia-Friendly Spacing</span>
              <span className="text-xs text-slate-500">Increased character & word kerning</span>
            </div>
            <button
              onClick={() => updateSettings({ dyslexiaFont: !settings.dyslexiaFont })}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                settings.dyslexiaFont ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
              aria-label="Toggle dyslexia font"
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform transform ${
                  settings.dyslexiaFont ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Reduced Motion Toggle */}
          <div className="flex items-center justify-between pt-2">
            <div>
              <span className="text-sm font-bold block">Reduced Motion</span>
              <span className="text-xs text-slate-500">Disables animations and transitions</span>
            </div>
            <button
              onClick={() => updateSettings({ reducedMotion: !settings.reducedMotion })}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                settings.reducedMotion ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
              aria-label="Toggle reduced motion"
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform transform ${
                  settings.reducedMotion ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={resetSettings}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Defaults</span>
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};
