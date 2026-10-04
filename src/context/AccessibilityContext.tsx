import React, { createContext, useContext, useEffect, useState } from 'react';
import { AccessibilityProfile, AccessibilitySettings } from '../types';

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSettings: (newSettings: Partial<AccessibilitySettings>) => void;
  applyProfile: (profile: AccessibilityProfile) => void;
  resetSettings: () => void;
}

const DEFAULT_SETTINGS: AccessibilitySettings = {
  profile: 'standard',
  fontSize: 'md',
  lineSpacing: 'normal',
  theme: 'light',
  dyslexiaFont: false,
  reducedMotion: false,
  speechRate: 1.0,
  selectedVoiceURI: ''
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    try {
      const saved = localStorage.getItem('accessai_settings');
      if (saved) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Could not read settings from localStorage', e);
    }
    return DEFAULT_SETTINGS;
  });

  const updateSettings = (newSettings: Partial<AccessibilitySettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem('accessai_settings', JSON.stringify(updated));
      } catch (e) {
        console.warn('Could not save settings to localStorage', e);
      }
      return updated;
    });
  };

  const applyProfile = (profile: AccessibilityProfile) => {
    switch (profile) {
      case 'simple':
        updateSettings({
          profile,
          fontSize: 'lg',
          lineSpacing: 'relaxed',
          dyslexiaFont: false
        });
        break;
      case 'screen_reader':
        updateSettings({
          profile,
          fontSize: 'md',
          lineSpacing: 'relaxed',
          theme: 'light'
        });
        break;
      case 'low_vision':
        updateSettings({
          profile,
          fontSize: '2xl',
          lineSpacing: 'loose',
          theme: 'high-contrast'
        });
        break;
      case 'audio_first':
        updateSettings({
          profile,
          fontSize: 'lg',
          speechRate: 1.0
        });
        break;
      case 'dyslexia':
        updateSettings({
          profile,
          fontSize: 'lg',
          lineSpacing: 'loose',
          dyslexiaFont: true,
          theme: 'light'
        });
        break;
      case 'standard':
      case 'auto':
      default:
        updateSettings({
          profile,
          fontSize: 'md',
          lineSpacing: 'normal',
          dyslexiaFont: false
        });
        break;
    }
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    try {
      localStorage.setItem('accessai_settings', JSON.stringify(DEFAULT_SETTINGS));
    } catch (e) {}
  };

  // Sync DOM classes whenever settings change
  useEffect(() => {
    const root = document.documentElement;

    // Theme handling
    root.classList.remove('dark', 'theme-high-contrast');
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else if (settings.theme === 'high-contrast') {
      root.classList.add('theme-high-contrast');
    }

    // Dyslexia font
    if (settings.dyslexiaFont) {
      root.classList.add('font-dyslexia');
    } else {
      root.classList.remove('font-dyslexia');
    }

    // Reduced motion
    if (settings.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }
  }, [settings]);

  return (
    <AccessibilityContext.Provider
      value={{ settings, updateSettings, applyProfile, resetSettings }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
