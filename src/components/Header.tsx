import React from 'react';
import { AppTab, LanguageMode } from '../types/dialogue';
import { BookOpen, Sparkles, Utensils, MessageSquare, Mic, Volume2 } from 'lucide-react';

interface HeaderProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  languageMode: LanguageMode;
  setLanguageMode: (mode: LanguageMode) => void;
  playbackSpeed: number;
  setPlaybackSpeed: (speed: number) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  languageMode,
  setLanguageMode,
  playbackSpeed,
  setPlaybackSpeed,
}) => {
  return (
    <header className="border-b border-stone-200/90 bg-white/95 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Top Branding Row */}
        <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100">
          <div className="flex items-center gap-3">
            {/* School Emblem / Tiffin Icon */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-white flex items-center justify-center shadow-md font-bold text-lg">
              🏫
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight font-serif">
                  Duo Dialogue: टिल्लू और मिल्लू
                </h1>
                <span className="text-stone-300">·</span>
                <span className="text-xs font-mono font-medium text-emerald-700">
                  Healthy Food
                </span>
              </div>
              {/* Unboxed Metadata with Typographic Separator */}
              <div className="flex items-center gap-2 text-xs text-stone-500 mt-0.5">
                <span>कीर्तना & तेजस्वी (कक्षा 4)</span>
                <span aria-hidden="true">·</span>
                <span>Gemini 3.8 Flash TTS Voice</span>
                <span aria-hidden="true">·</span>
                <span>स्कूल संवाद प्रस्तुति</span>
              </div>
            </div>
          </div>

          {/* Quick Settings: Language & Speed */}
          <div className="flex items-center gap-3">
            {/* Language Segmented Control */}
            <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg text-xs font-medium">
              <button
                onClick={() => setLanguageMode('all')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  languageMode === 'all'
                    ? 'bg-white text-stone-900 shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                title="सभी भाषाएं दिखाएं"
              >
                सभी (All)
              </button>
              <button
                onClick={() => setLanguageMode('hindi')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  languageMode === 'hindi'
                    ? 'bg-white text-stone-900 shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                title="केवल हिंदी"
              >
                हिंदी
              </button>
              <button
                onClick={() => setLanguageMode('hinglish')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  languageMode === 'hinglish'
                    ? 'bg-white text-stone-900 shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                title="Hinglish Transliteration"
              >
                Hinglish
              </button>
              <button
                onClick={() => setLanguageMode('english')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  languageMode === 'english'
                    ? 'bg-white text-stone-900 shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                title="English Translation"
              >
                English
              </button>
            </div>

            {/* Speed Selector */}
            <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg text-xs font-mono font-medium hidden md:flex">
              <span className="px-1 text-stone-400 text-[10px]">गति:</span>
              {[0.8, 1.0, 1.2].map((spd) => (
                <button
                  key={spd}
                  onClick={() => setPlaybackSpeed(spd)}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    playbackSpeed === spd
                      ? 'bg-white text-stone-900 font-bold shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-1 overflow-x-auto py-2 -mx-1 scrollbar-none">
          <button
            onClick={() => setActiveTab('stage')}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all shrink-0 ${
              activeTab === 'stage'
                ? 'bg-stone-900 text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100'
            }`}
          >
            <span>🎭</span>
            <span>मंच प्रस्तुति (Stage View)</span>
          </button>

          <button
            onClick={() => setActiveTab('script')}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all shrink-0 ${
              activeTab === 'script'
                ? 'bg-stone-900 text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>पूरा संवाद स्क्रिप्ट (Full Script)</span>
          </button>

          <button
            onClick={() => setActiveTab('roleplay')}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all shrink-0 ${
              activeTab === 'roleplay'
                ? 'bg-stone-900 text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>रोलप्ले अभ्यास (Practice Mode)</span>
          </button>

          <button
            onClick={() => setActiveTab('lunchbox')}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all shrink-0 ${
              activeTab === 'lunchbox'
                ? 'bg-stone-900 text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>लंचबॉक्स पोषण (Healthy Food)</span>
          </button>

          <button
            onClick={() => setActiveTab('creator')}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all shrink-0 ${
              activeTab === 'creator'
                ? 'bg-stone-900 text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>नया संवाद बनाएं (AI Creator)</span>
          </button>
        </div>
      </div>
    </header>
  );
};
