import React, { useState } from 'react';
import {
  FileText,
  Settings,
  Eye,
  Type,
  Sun,
  Moon,
  Menu,
  X,
  HelpCircle,
  Cpu,
  Layers
} from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';

interface HeaderProps {
  onOpenSettings: () => void;
  onOpenHowItWorks: () => void;
  onOpenProviderStatus: () => void;
  onScrollToUpload: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSettings,
  onOpenHowItWorks,
  onOpenProviderStatus,
  onScrollToUpload
}) => {
  const { settings, updateSettings } = useAccessibility();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleContrast = () => {
    if (settings.theme === 'high-contrast') {
      updateSettings({ theme: 'light' });
    } else {
      updateSettings({ theme: 'high-contrast' });
    }
  };

  const toggleDyslexia = () => {
    updateSettings({ dyslexiaFont: !settings.dyslexiaFont });
  };

  const toggleTheme = () => {
    if (settings.theme === 'dark') {
      updateSettings({ theme: 'light' });
    } else {
      updateSettings({ theme: 'dark' });
    }
  };

  return (
    <header
      role="banner"
      className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors shadow-xs"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Slogan */}
          <div className="flex items-center gap-3">
            <a
              href="#"
              className="flex items-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-lg p-1 group"
              aria-label="ACCESSAI Home - Make Every Document Accessible"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black tracking-tight text-xl shadow-md group-hover:bg-blue-700 transition-all">
                <FileText className="w-6 h-6" aria-hidden="true" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                  ACCESS<span className="text-blue-600 dark:text-blue-400">AI</span>
                </span>
                <span className="text-xs text-slate-700 dark:text-slate-300 font-bold hidden sm:inline">
                  Universal Document Accessibility
                </span>
              </div>
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <nav
            role="navigation"
            aria-label="Main Navigation"
            className="hidden md:flex items-center space-x-1 lg:space-x-2"
          >
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 rounded-md transition-colors"
            >
              Home
            </button>
            <button
              onClick={onOpenHowItWorks}
              className="px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 rounded-md transition-colors flex items-center gap-1.5"
            >
              <HelpCircle className="w-4 h-4 text-blue-500" aria-hidden="true" />
              How It Works
            </button>
            <button
              onClick={onScrollToUpload}
              className="px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 rounded-md transition-colors"
            >
              Upload
            </button>
            <button
              onClick={onOpenProviderStatus}
              className="px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 rounded-md transition-colors flex items-center gap-1.5"
              aria-label="View AI Provider Architecture status"
            >
              <Cpu className="w-4 h-4 text-emerald-500" aria-hidden="true" />
              AI Engine
            </button>
          </nav>

          {/* Accessibility Quick Controls & Settings */}
          <div className="hidden sm:flex items-center gap-2">
            {/* High Contrast Toggle */}
            <button
              onClick={toggleContrast}
              className={`p-2 rounded-lg text-sm font-medium border transition-all flex items-center gap-1.5 ${
                settings.theme === 'high-contrast'
                  ? 'bg-yellow-300 text-black border-yellow-400 ring-2 ring-yellow-400 font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
              title="Toggle High Contrast Mode"
              aria-label={`Toggle high contrast mode (currently ${
                settings.theme === 'high-contrast' ? 'active' : 'inactive'
              })`}
            >
              <Eye className="w-4 h-4" aria-hidden="true" />
              <span className="text-xs font-semibold">Contrast</span>
            </button>

            {/* Dyslexia Font Toggle */}
            <button
              onClick={toggleDyslexia}
              className={`p-2 rounded-lg text-sm font-medium border transition-all flex items-center gap-1.5 ${
                settings.dyslexiaFont
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200 border-blue-400 ring-2 ring-blue-400 font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
              title="Toggle Dyslexia-Friendly Spacing"
              aria-label={`Toggle dyslexia friendly typography (currently ${
                settings.dyslexiaFont ? 'active' : 'inactive'
              })`}
            >
              <Type className="w-4 h-4" aria-hidden="true" />
              <span className="text-xs font-semibold">Dyslexia</span>
            </button>

            {/* Light / Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              title="Toggle Dark Mode"
              aria-label={`Toggle dark mode (currently ${settings.theme === 'dark' ? 'dark' : 'light'})`}
            >
              {settings.theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" aria-hidden="true" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" aria-hidden="true" />
              )}
            </button>

            {/* Full Accessibility Settings Modal Trigger */}
            <button
              onClick={onOpenSettings}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-xs"
              aria-label="Open Accessibility Profiles and Display Preferences"
            >
              <Settings className="w-4 h-4" aria-hidden="true" />
              <span>Accessibility</span>
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-lg bg-blue-600 text-white"
              aria-label="Accessibility settings"
            >
              <Settings className="w-5 h-5" aria-hidden="true" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 space-y-3">
          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 font-medium text-slate-800 dark:text-slate-200"
          >
            Home
          </button>
          <button
            onClick={() => {
              onScrollToUpload();
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 font-medium text-slate-800 dark:text-slate-200"
          >
            Upload Document
          </button>
          <button
            onClick={() => {
              onOpenHowItWorks();
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 font-medium text-slate-800 dark:text-slate-200"
          >
            How It Works
          </button>
          <button
            onClick={() => {
              onOpenProviderStatus();
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 font-medium text-slate-800 dark:text-slate-200"
          >
            AI Architecture & Engine
          </button>
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Quick Accessibility</span>
            <div className="flex gap-2">
              <button
                onClick={toggleContrast}
                className="p-2 border rounded-md text-xs font-bold"
                aria-label="Toggle contrast"
              >
                Contrast
              </button>
              <button
                onClick={toggleDyslexia}
                className="p-2 border rounded-md text-xs font-bold"
                aria-label="Toggle dyslexia font"
              >
                Dyslexia
              </button>
              <button
                onClick={toggleTheme}
                className="p-2 border rounded-md text-xs"
                aria-label="Toggle dark/light theme"
              >
                {settings.theme === 'dark' ? '☀️' : '🌙'}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
