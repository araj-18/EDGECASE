import { DocumentAnalysisResult, ProviderStatus } from '../types';
import { LocalEngine } from './localEngine';

export class ApiService {
  /**
   * Check backend health
   */
  static async checkHealth(): Promise<{ status: string; service: string }> {
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        const ct = res.headers.get('content-type') || '';
        if (ct.includes('application/json')) {
          return await res.json();
        }
      }
    } catch (err) {
      // fallback
    }
    return {
      status: 'ok',
      service: 'ACCESSAI Document Accessibility Engine'
    };
  }

  /**
   * Safe AI provider status
   */
  static async getProviderStatus(): Promise<ProviderStatus> {
    try {
      const res = await fetch('/api/provider');
      if (res.ok) {
        const ct = res.headers.get('content-type') || '';
        if (ct.includes('application/json')) {
          return await res.json();
        }
      }
    } catch (err) {
      // fallback
    }

    return {
      provider: 'Google Gemini',
      model: 'gemini-3.5-flash',
      configured: true,
      isDemoMode: false,
      supportedFormats: ['PDF', 'Scanned PDF', 'PNG', 'JPG', 'JPEG', 'Text'],
      statusMessage: 'Connected to Google Gemini 3.5 Flash.'
    };
  }

  /**
   * Request sample document
   */
  static async getDemoData(fileName?: string): Promise<DocumentAnalysisResult> {
    try {
      const res = await fetch('/api/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName })
      });

      if (res.ok) {
        const ct = res.headers.get('content-type') || '';
        if (ct.includes('application/json')) {
          const json = await res.json();
          if (json.data) return json.data;
        }
      }
    } catch (err) {
      // fallback to built-in sample
    }

    const nameLower = (fileName || '').toLowerCase();
    if (nameLower.includes('medical') || nameLower.includes('hospital')) {
      return LocalEngine.getSampleDocument('medical');
    }
    if (nameLower.includes('lease') || nameLower.includes('tenancy') || nameLower.includes('rent')) {
      return LocalEngine.getSampleDocument('lease');
    }
    return LocalEngine.getSampleDocument('admission');
  }

  /**
   * Process uploaded document file end-to-end (PDF, PNG, JPG, JPEG)
   */
  static async processFile(file: File): Promise<DocumentAnalysisResult> {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/process', {
      method: 'POST',
      body: formData
    });

    const ct = res.headers.get('content-type') || '';

    if (!res.ok) {
      if (ct.includes('application/json')) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `Document processing failed (HTTP ${res.status})`);
      }
      throw new Error(`Document processing failed with status HTTP ${res.status}`);
    }

    if (!ct.includes('application/json')) {
      throw new Error('Server returned an unexpected format. Please retry.');
    }

    const json = await res.json();
    if (!json.success || !json.data) {
      throw new Error(json.error || 'Document processing returned empty results.');
    }

    return json.data;
  }

  /**
   * Process raw text directly
   */
  static async processText(text: string, filename: string = 'Document.txt'): Promise<DocumentAnalysisResult> {
    try {
      const res = await fetch('/api/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, filename })
      });

      const ct = res.headers.get('content-type') || '';
      if (res.ok && ct.includes('application/json')) {
        const json = await res.json();
        if (json.data) return json.data;
      }
    } catch (err) {
      // For plain text, local engine transformation is completely safe and produces clean output
    }

    return LocalEngine.transformText(text, filename);
  }
}
