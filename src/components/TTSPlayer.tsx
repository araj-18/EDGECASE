import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  Square,
  Volume2,
  VolumeX,
  FastForward,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { speechService, SpeechPlaybackState, SpeechVoiceOption } from '../services/speech';
import { DocumentAnalysisResult } from '../types';

interface TTSPlayerProps {
  documentData: DocumentAnalysisResult;
}

export const TTSPlayer: React.FC<TTSPlayerProps> = ({ documentData }) => {
  const [playbackState, setPlaybackState] = useState<SpeechPlaybackState>('idle');
  const [rate, setRate] = useState<number>(1.0);
  const [voices, setVoices] = useState<SpeechVoiceOption[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [selectedScope, setSelectedScope] = useState<'summary' | 'simple' | 'important' | 'full'>('summary');

  useEffect(() => {
    const unsub = speechService.onStateChange((st) => setPlaybackState(st));
    const loadedVoices = speechService.getVoices();
    setVoices(loadedVoices);
    if (loadedVoices.length > 0 && !selectedVoice) {
      const defaultVoice = loadedVoices.find((v) => v.default) || loadedVoices[0];
      setSelectedVoice(defaultVoice.voiceURI);
    }
    return () => {
      unsub();
      speechService.stop();
    };
  }, []);

  const getTextForScope = (): string => {
    switch (selectedScope) {
      case 'summary':
        return `Document Summary for ${documentData.title}. ${documentData.summary}. Key Takeaways: ${documentData.quickTakeaways.join('. ')}`;
      case 'simple':
        return `Simple Plain-Language Version: ${documentData.simpleVersion}`;
      case 'important': {
        const deadlines = documentData.deadlines.map((d) => `${d.task}: due ${d.date}. ${d.consequences || ''}`).join('. ');
        const warnings = documentData.warnings.join('. ');
        const requirements = documentData.requirements.join('. ');
        return `Important Information for ${documentData.title}. Deadlines: ${deadlines}. Warnings: ${warnings}. Requirements: ${requirements}.`;
      }
      case 'full':
      default: {
        const sectionsText = documentData.sections.map((s) => `${s.heading}. ${s.simplifiedText}`).join('. ');
        return `${documentData.title}. Summary: ${documentData.summary}. Content: ${sectionsText}`;
      }
    }
  };

  const handlePlay = () => {
    if (playbackState === 'paused') {
      speechService.resume();
    } else {
      const textToRead = getTextForScope();
      speechService.speak(textToRead, {
        rate,
        voiceURI: selectedVoice
      });
    }
  };

  const handlePause = () => {
    speechService.pause();
  };

  const handleStop = () => {
    speechService.stop();
  };

  const handleRateChange = (newRate: number) => {
    setRate(newRate);
    if (playbackState === 'playing') {
      // Re-trigger speech with updated rate
      const textToRead = getTextForScope();
      speechService.speak(textToRead, {
        rate: newRate,
        voiceURI: selectedVoice
      });
    }
  };

  return (
    <div
      role="region"
      aria-label="Text-to-Speech audio reader"
      className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/60 text-purple-600 dark:text-purple-300 flex items-center justify-center">
            <Volume2 className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Accessible Text-to-Speech Player
            </h3>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
              Listen to the document synthesized using native Web Speech
            </p>
          </div>
        </div>

        {/* Playback status pill */}
        <div className="flex items-center gap-2">
          {playbackState === 'playing' && (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold animate-pulse">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              Speaking Active
            </span>
          )}
          {playbackState === 'paused' && (
            <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-xs font-bold">
              Paused
            </span>
          )}
          {playbackState === 'idle' && (
            <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium">
              Ready to Play
            </span>
          )}
        </div>
      </div>

      {/* Scope Selector */}
      <div className="py-4">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
          Select Content to Read Aloud:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { id: 'summary', label: 'Summary & Takeaways' },
            { id: 'simple', label: 'Simple Plain Version' },
            { id: 'important', label: 'Deadlines & Warnings' },
            { id: 'full', label: 'Entire Document' }
          ].map((scope) => (
            <button
              key={scope.id}
              onClick={() => {
                if (playbackState === 'playing') speechService.stop();
                setSelectedScope(scope.id as any);
              }}
              className={`px-3 py-2 text-xs font-bold rounded-lg border text-left transition-all ${
                selectedScope === scope.id
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {scope.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Playback Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          {playbackState === 'playing' ? (
            <button
              onClick={handlePause}
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm flex items-center gap-2 shadow-sm transition-all"
              aria-label="Pause spoken audio"
            >
              <Pause className="w-4 h-4" aria-hidden="true" />
              <span>Pause</span>
            </button>
          ) : (
            <button
              onClick={handlePlay}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center gap-2 shadow-sm transition-all"
              aria-label="Play spoken audio"
            >
              <Play className="w-4 h-4 fill-white" aria-hidden="true" />
              <span>{playbackState === 'paused' ? 'Resume' : 'Play Audio'}</span>
            </button>
          )}

          <button
            onClick={handleStop}
            disabled={playbackState === 'idle'}
            className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-40 text-slate-700 dark:text-slate-200 font-bold text-sm flex items-center gap-1.5 transition-all"
            aria-label="Stop audio"
          >
            <Square className="w-4 h-4" aria-hidden="true" />
            <span>Stop</span>
          </button>
        </div>

        {/* Speed Controls (0.75x, 1x, 1.25x, 1.5x, 2x) */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 px-2">
            Speed:
          </span>
          {[0.75, 1.0, 1.25, 1.5, 2.0].map((s) => (
            <button
              key={s}
              onClick={() => handleRateChange(s)}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                rate === s
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              aria-label={`Playback speed ${s} times normal`}
            >
              {s}x
            </button>
          ))}
        </div>

        {/* Voice Selection */}
        {voices.length > 0 && (
          <div className="flex items-center gap-2">
            <label htmlFor="tts-voice" className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Voice:
            </label>
            <select
              id="tts-voice"
              value={selectedVoice}
              onChange={(e) => {
                setSelectedVoice(e.target.value);
                if (playbackState === 'playing') {
                  const textToRead = getTextForScope();
                  speechService.speak(textToRead, {
                    rate,
                    voiceURI: e.target.value
                  });
                }
              }}
              className="text-xs font-medium bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 max-w-[160px] truncate"
            >
              {voices.map((v, idx) => (
                <option key={`${v.voiceURI || v.name}-${idx}`} value={v.voiceURI}>
                  {v.name} ({v.lang})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
};
