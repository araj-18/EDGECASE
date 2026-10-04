export interface ImportantInfoItem {
  category: 'deadline' | 'requirement' | 'warning' | 'contact' | 'instruction' | 'general';
  label: string;
  detail: string;
  urgent?: boolean;
}

export interface SectionItem {
  id: string;
  heading: string;
  level: number;
  originalText: string;
  simplifiedText: string;
  keyPoints?: string[];
}

export interface ImageDescriptionItem {
  id: string;
  type: 'chart' | 'diagram' | 'signature' | 'stamp' | 'photo' | 'figure' | 'icon';
  title: string;
  altText: string;
  detailedDescription: string;
}

export interface DocumentAnalysisResult {
  title: string;
  documentType: string;
  pageCount: number;
  wordCount: number;
  readingTimeMinutes: number;
  summary: string;
  quickTakeaways: string[];
  simpleVersion: string;
  gradeLevel: string;
  importantInformation: ImportantInfoItem[];
  deadlines: Array<{ task: string; date: string; time?: string; consequences?: string }>;
  requirements: string[];
  warnings: string[];
  keyPeople: Array<{ name: string; role?: string; contact?: string }>;
  keyTerms: Array<{ term: string; definition: string }>;
  sections: SectionItem[];
  imageDescriptions: ImageDescriptionItem[];
  accessibilityNotes: string[];
  screenReaderHtml: string;
  metadata: {
    processedAt: string;
    ocrUsed: boolean;
    ocrConfidence?: number;
    aiProvider: string;
    aiModel: string;
    isDemoMode: boolean;
    statusMessage?: string;
  };
}

export interface ProviderStatus {
  provider: string;
  model: string;
  configured: boolean;
  isDemoMode: boolean;
  supportedFormats: string[];
  statusMessage: string;
}

export type AccessibilityProfile =
  | 'auto'
  | 'simple'
  | 'screen_reader'
  | 'low_vision'
  | 'audio_first'
  | 'dyslexia'
  | 'standard';

export interface AccessibilitySettings {
  profile: AccessibilityProfile;
  fontSize: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  lineSpacing: 'normal' | 'relaxed' | 'loose';
  theme: 'light' | 'dark' | 'high-contrast';
  dyslexiaFont: boolean;
  reducedMotion: boolean;
  speechRate: number;
  selectedVoiceURI: string;
}
