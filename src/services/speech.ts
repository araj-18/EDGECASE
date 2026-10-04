export interface SpeechVoiceOption {
  name: string;
  lang: string;
  voiceURI: string;
  default: boolean;
}

export type SpeechPlaybackState = 'idle' | 'playing' | 'paused' | 'stopped';

class SpeechService {
  private utterance: SpeechSynthesisUtterance | null = null;
  private voices: SpeechVoiceOption[] = [];
  private stateChangeListeners: ((state: SpeechPlaybackState) => void)[] = [];
  private currentState: SpeechPlaybackState = 'idle';

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.loadVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const rawVoices = window.speechSynthesis.getVoices();
    const seen = new Set<string>();
    const uniqueVoices: SpeechVoiceOption[] = [];

    for (let i = 0; i < rawVoices.length; i++) {
      const v = rawVoices[i];
      const key = `${v.voiceURI || v.name}__${v.lang}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueVoices.push({
          name: v.name,
          lang: v.lang,
          voiceURI: v.voiceURI || `${v.name}-${v.lang}-${i}`,
          default: v.default
        });
      }
    }

    this.voices = uniqueVoices;
  }

  public getVoices(): SpeechVoiceOption[] {
    if (this.voices.length === 0) {
      this.loadVoices();
    }
    return this.voices;
  }

  public getState(): SpeechPlaybackState {
    return this.currentState;
  }

  private setState(state: SpeechPlaybackState) {
    this.currentState = state;
    this.stateChangeListeners.forEach((listener) => listener(state));
  }

  public onStateChange(listener: (state: SpeechPlaybackState) => void): () => void {
    this.stateChangeListeners.push(listener);
    return () => {
      this.stateChangeListeners = this.stateChangeListeners.filter((l) => l !== listener);
    };
  }

  public speak(
    text: string,
    options: {
      rate?: number;
      pitch?: number;
      voiceURI?: string;
      onEnd?: () => void;
      onError?: (err: any) => void;
    } = {}
  ) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('SpeechSynthesis is not supported on this browser.');
      return;
    }

    // Cancel any active utterance
    window.speechSynthesis.cancel();

    // Clean markdown/HTML tags from speech input
    const cleanText = text
      .replace(/<[^>]+>/g, ' ')
      .replace(/[*#_`[\]]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = options.rate ?? 1.0;
    utterance.pitch = options.pitch ?? 1.0;

    if (options.voiceURI) {
      const allVoices = window.speechSynthesis.getVoices();
      const matched = allVoices.find((v) => v.voiceURI === options.voiceURI);
      if (matched) {
        utterance.voice = matched;
      }
    }

    utterance.onstart = () => {
      this.setState('playing');
    };

    utterance.onpause = () => {
      this.setState('paused');
    };

    utterance.onresume = () => {
      this.setState('playing');
    };

    utterance.onend = () => {
      this.setState('idle');
      this.utterance = null;
      if (options.onEnd) options.onEnd();
    };

    utterance.onerror = (e) => {
      // Don't flag error on manual cancel
      if (e.error !== 'canceled' && e.error !== 'interrupted') {
        console.warn('Speech synthesis notice:', e.error);
        if (options.onError) options.onError(e);
      }
      this.setState('idle');
      this.utterance = null;
    };

    this.utterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  public pause() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.pause();
        this.setState('paused');
      }
    }
  }

  public resume() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        this.setState('playing');
      }
    }
  }

  public stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.setState('idle');
      this.utterance = null;
    }
  }
}

export const speechService = new SpeechService();
