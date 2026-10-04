import React, { useState, useEffect } from 'react';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { SkipLink } from './components/SkipLink';
import { Header } from './components/Header';
import { HeroLanding } from './components/HeroLanding';
import { UploadSection } from './components/UploadSection';
import { ResultsDashboard } from './components/ResultsDashboard';
import { AccessibilityModal } from './components/AccessibilityModal';
import { ProviderStatusModal } from './components/ProviderStatusModal';
import { HowItWorksModal } from './components/HowItWorksModal';
import { Footer } from './components/Footer';
import { DocumentAnalysisResult } from './types';
import { ApiService } from './services/api';

export default function App() {
  const [analysisResult, setAnalysisResult] = useState<DocumentAnalysisResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProviderStatusOpen, setIsProviderStatusOpen] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);

  // Keyboard shortcut support: Esc to close modals, Alt+A for accessibility settings
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSettingsOpen(false);
        setIsProviderStatusOpen(false);
        setIsHowItWorksOpen(false);
      }
      if (e.altKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        setIsSettingsOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const scrollToUpload = () => {
    const uploadEl = document.getElementById('upload-section');
    if (uploadEl) {
      uploadEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLaunchDemo = async () => {
    setIsProcessing(true);
    try {
      const demoData = await ApiService.getDemoData('Apex_University_Admission_Fall2026.pdf');
      setAnalysisResult(demoData);
      setTimeout(() => {
        const resultsEl = document.getElementById('results-section');
        if (resultsEl) {
          resultsEl.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } catch (err) {
      console.warn('Demo fetch failed', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleProcessComplete = (result: DocumentAnalysisResult) => {
    setAnalysisResult(result);
    setTimeout(() => {
      const resultsEl = document.getElementById('results-section');
      if (resultsEl) {
        resultsEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 150);
  };

  const handleReset = () => {
    setAnalysisResult(null);
    scrollToUpload();
  };

  return (
    <AccessibilityProvider>
      <div className="min-h-screen flex flex-col bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors">
        {/* Skip to Content Link (Section 22) */}
        <SkipLink />

        {/* Top Navigation Bar */}
        <Header
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
          onOpenProviderStatus={() => setIsProviderStatusOpen(true)}
          onScrollToUpload={scrollToUpload}
        />

        {/* Main Content Landmark */}
        <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
          {/* Hero Section */}
          <HeroLanding
            onUploadClick={scrollToUpload}
            onDemoClick={handleLaunchDemo}
          />

          {/* Upload and Document Processing Section */}
          <UploadSection
            onProcessComplete={handleProcessComplete}
            isProcessing={isProcessing}
            setIsProcessing={setIsProcessing}
          />

          {/* Results Dashboard (When document analysis exists) */}
          {analysisResult && (
            <ResultsDashboard
              data={analysisResult}
              onReset={handleReset}
            />
          )}
        </main>

        {/* Accessible Modals */}
        <AccessibilityModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        />

        <ProviderStatusModal
          isOpen={isProviderStatusOpen}
          onClose={() => setIsProviderStatusOpen(false)}
        />

        <HowItWorksModal
          isOpen={isHowItWorksOpen}
          onClose={() => setIsHowItWorksOpen(false)}
        />

        {/* Semantic Footer */}
        <Footer />
      </div>
    </AccessibilityProvider>
  );
}
