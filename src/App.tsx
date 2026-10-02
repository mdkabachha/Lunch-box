import React, { useState, useEffect, useRef } from 'react';
import { DUO_DIALOGUE_LINES } from './data/dialogueData';
import { DialogueLine, LanguageMode, AppTab } from './types/dialogue';
import { ttsService } from './services/ttsService';
import { Header } from './components/Header';
import { StageView } from './components/StageView';
import { DialogueScript } from './components/DialogueScript';
import { RoleplayMode } from './components/RoleplayMode';
import { LunchboxGame } from './components/LunchboxGame';
import { DialogueCreator } from './components/DialogueCreator';

export default function App() {
  const [lines, setLines] = useState<DialogueLine[]>(DUO_DIALOGUE_LINES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullPlaybackActive, setIsFullPlaybackActive] = useState(false);
  const [activeTab, setActiveTab] = useState<AppTab>('stage');
  const [languageMode, setLanguageMode] = useState<LanguageMode>('all');
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);

  const fullPlaybackRef = useRef(false);
  fullPlaybackRef.current = isFullPlaybackActive;

  const currentLine = lines[currentIndex] || lines[0];

  useEffect(() => {
    ttsService.setPlaybackRate(playbackSpeed);
  }, [playbackSpeed]);

  const handlePlayLine = (line: DialogueLine, isPartOfFull = false) => {
    const targetIdx = lines.findIndex((l) => l.id === line.id);
    if (targetIdx !== -1) {
      setCurrentIndex(targetIdx);
    }

    setIsPlaying(true);

    ttsService.speak(
      {
        text: line.hindi,
        speaker: line.characterRole,
        voiceName: line.voiceName,
        style: line.audioStyle,
      },
      () => {
        setIsPlaying(true);
      },
      () => {
        setIsPlaying(false);

        // If part of full dialogue playback, automatically advance to next line
        if (isPartOfFull && fullPlaybackRef.current) {
          const nextIdx = targetIdx + 1;
          if (nextIdx < lines.length) {
            // Small pause between student dialogue turns (500ms)
            setTimeout(() => {
              if (fullPlaybackRef.current) {
                setCurrentIndex(nextIdx);
                handlePlayLine(lines[nextIdx], true);
              }
            }, 600);
          } else {
            setIsFullPlaybackActive(false);
          }
        }
      },
      (err) => {
        console.warn('Speech error:', err);
        setIsPlaying(false);
        if (isPartOfFull) setIsFullPlaybackActive(false);
      }
    );
  };

  const handlePlayFull = () => {
    setIsFullPlaybackActive(true);
    setCurrentIndex(0);
    handlePlayLine(lines[0], true);
  };

  const handleStopPlayback = () => {
    ttsService.stop();
    setIsPlaying(false);
    setIsFullPlaybackActive(false);
  };

  const handleNextLine = () => {
    handleStopPlayback();
    if (currentIndex < lines.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevLine = () => {
    handleStopPlayback();
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSelectIndex = (idx: number) => {
    handleStopPlayback();
    setCurrentIndex(idx);
  };

  const handleLoadCustomDialogue = (newLines: DialogueLine[]) => {
    handleStopPlayback();
    setLines(newLines);
    setCurrentIndex(0);
    setActiveTab('stage');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f5] text-stone-900 selection:bg-amber-200">
      {/* Header with Navigation and Language Mode Controls */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          handleStopPlayback();
          setActiveTab(tab);
        }}
        languageMode={languageMode}
        setLanguageMode={setLanguageMode}
        playbackSpeed={playbackSpeed}
        setPlaybackSpeed={setPlaybackSpeed}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === 'stage' && (
          <StageView
            currentLine={currentLine}
            allLines={lines}
            currentIndex={currentIndex}
            isPlaying={isPlaying}
            isFullPlaybackActive={isFullPlaybackActive}
            languageMode={languageMode}
            onPlayLine={(line) => handlePlayLine(line, false)}
            onPlayFull={handlePlayFull}
            onStopPlayback={handleStopPlayback}
            onSelectIndex={handleSelectIndex}
            onNextLine={handleNextLine}
            onPrevLine={handlePrevLine}
          />
        )}

        {activeTab === 'script' && (
          <DialogueScript
            lines={lines}
            currentLineId={currentLine.id}
            isPlaying={isPlaying}
            languageMode={languageMode}
            onPlayLine={(line) => handlePlayLine(line, false)}
            onSelectLine={(idx) => {
              setCurrentIndex(idx);
              setActiveTab('stage');
            }}
          />
        )}

        {activeTab === 'roleplay' && <RoleplayMode lines={lines} />}

        {activeTab === 'lunchbox' && <LunchboxGame />}

        {activeTab === 'creator' && (
          <DialogueCreator onLoadCustomDialogue={handleLoadCustomDialogue} />
        )}
      </main>

      {/* Classroom Footer */}
      <footer className="border-t border-stone-200/80 bg-white py-6 mt-12 text-xs text-stone-500">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span>🏫 स्कूल गतिविधि (School Activity)</span>
            <span aria-hidden="true">·</span>
            <span>Duo Dialogue: "Talking about Healthy Food"</span>
          </div>

          <div className="flex items-center gap-3 text-stone-400">
            <span>कीर्तना (Tillu) & तेजस्वी (Millu) · कक्षा 4</span>
            <span aria-hidden="true">·</span>
            <span>Gemini 3.8 Flash TTS</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
