/**
 * Speech Service powered by Gemini 3.8 Flash TTS ('gemini-3.8-flash-tts')
 * with resilient browser fallback & audio caching.
 */

interface TTSRequestOptions {
  text: string;
  speaker?: string;
  voiceName?: 'Puck' | 'Kore' | 'Zephyr' | 'Fenrir';
  style?: string;
}

class TTSService {
  private cache: Map<string, string> = new Map();
  private currentAudio: HTMLAudioElement | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private playbackRate: number = 1.0;

  public setPlaybackRate(rate: number) {
    this.playbackRate = rate;
    if (this.currentAudio) {
      this.currentAudio.playbackRate = rate;
    }
  }

  public getPlaybackRate(): number {
    return this.playbackRate;
  }

  public stop() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  private isRateLimited: boolean = false;

  public getIsRateLimited(): boolean {
    return this.isRateLimited;
  }

  /**
   * Request TTS audio from server using gemini-3.8-flash-tts
   */
  public async getAudioUrl(options: TTSRequestOptions): Promise<string> {
    const cacheKey = `${options.voiceName || 'Kore'}-${options.text}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: options.text,
          speaker: options.speaker || 'Tillu',
          voiceName: options.voiceName || 'Kore',
          style: options.style || 'Cheerful young school student',
        }),
      });

      if (!res.ok) {
        throw new Error(`TTS server response error: ${res.status}`);
      }

      const data = await res.json();
      if (data.rateLimited) {
        this.isRateLimited = true;
      }

      if (data.audioData) {
        this.cache.set(cacheKey, data.audioData);
        return data.audioData;
      }
      throw new Error(data.message || 'No audio returned');
    } catch (err) {
      // Quietly allow speak() to invoke fallback without noisy stderr errors
      throw err;
    }
  }

  /**
   * Speak text with Gemini 3.8 Flash TTS, falling back gracefully to Web Speech
   */
  public async speak(
    options: TTSRequestOptions,
    onStart?: () => void,
    onEnded?: () => void,
    onError?: (err: any) => void
  ): Promise<void> {
    this.stop();

    try {
      const audioUrl = await this.getAudioUrl(options);
      const audio = new Audio(audioUrl);
      this.currentAudio = audio;
      audio.playbackRate = this.playbackRate;

      audio.onplay = () => {
        onStart?.();
      };

      audio.onended = () => {
        this.currentAudio = null;
        onEnded?.();
      };

      audio.onerror = () => {
        this.fallbackWebSpeech(options, onStart, onEnded, onError);
      };

      await audio.play();
    } catch {
      // Smoothly transition to Web Speech API fallback
      this.fallbackWebSpeech(options, onStart, onEnded, onError);
    }
  }

  /**
   * Native Web Speech API fallback
   */
  private fallbackWebSpeech(
    options: TTSRequestOptions,
    onStart?: () => void,
    onEnded?: () => void,
    onError?: (err: any) => void
  ) {
    if (!('speechSynthesis' in window)) {
      onError?.(new Error('Speech synthesis not supported in this browser'));
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(options.text);
    this.currentUtterance = utterance;

    // Detect Hindi text vs English
    const hasDevanagari = /[\u0900-\u097F]/.test(options.text);
    utterance.lang = hasDevanagari ? 'hi-IN' : 'en-IN';
    utterance.rate = Math.min(1.2, Math.max(0.7, this.playbackRate * 0.95));
    // Friendly higher pitch for Class 4 schoolgirl character
    utterance.pitch = options.speaker?.includes('Millu') ? 1.3 : 1.25;

    const pickVoiceAndSpeak = () => {
      const voices = window.speechSynthesis.getVoices();
      const matchingVoice = voices.find(
        (v) =>
          (hasDevanagari && v.lang.startsWith('hi')) ||
          (!hasDevanagari && (v.lang === 'en-IN' || v.name.toLowerCase().includes('india')))
      );
      if (matchingVoice) {
        utterance.voice = matchingVoice;
      }

      utterance.onstart = () => {
        onStart?.();
      };

      utterance.onend = () => {
        this.currentUtterance = null;
        onEnded?.();
      };

      utterance.onerror = (ev) => {
        this.currentUtterance = null;
        // On error or speech cancel, call onEnded so sequence flow doesn't freeze
        onEnded?.();
      };

      window.speechSynthesis.speak(utterance);
    };

    const currentVoices = window.speechSynthesis.getVoices();
    if (currentVoices.length > 0) {
      pickVoiceAndSpeak();
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        pickVoiceAndSpeak();
      };
      // Fallback timeout in case onvoiceschanged does not fire
      setTimeout(pickVoiceAndSpeak, 100);
    }
  }
}

export const ttsService = new TTSService();
