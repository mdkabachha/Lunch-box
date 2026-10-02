import React from 'react';
import { DialogueLine, LanguageMode } from '../types/dialogue';
import { StudentCharacter } from './StudentCharacter';
import { TeacherPrompter } from './TeacherPrompter';
import { Volume2, Play, Pause, SkipForward, SkipBack, RotateCcw, Sparkles } from 'lucide-react';

interface StageViewProps {
  currentLine: DialogueLine;
  allLines: DialogueLine[];
  currentIndex: number;
  isPlaying: boolean;
  isFullPlaybackActive: boolean;
  languageMode: LanguageMode;
  onPlayLine: (line: DialogueLine) => void;
  onPlayFull: () => void;
  onStopPlayback: () => void;
  onSelectIndex: (index: number) => void;
  onNextLine: () => void;
  onPrevLine: () => void;
}

export const StageView: React.FC<StageViewProps> = ({
  currentLine,
  allLines,
  currentIndex,
  isPlaying,
  isFullPlaybackActive,
  languageMode,
  onPlayLine,
  onPlayFull,
  onStopPlayback,
  onSelectIndex,
  onNextLine,
  onPrevLine,
}) => {
  const isTilluSpeaking =
    isPlaying && (currentLine.characterRole === 'Tillu' || currentLine.characterRole === 'Both');
  const isMilluSpeaking =
    isPlaying && (currentLine.characterRole === 'Millu' || currentLine.characterRole === 'Both');

  // Pose determination
  const tilluPose = currentLine.characterRole === 'Both'
    ? 'namaste'
    : currentLine.pose === 'showing_tiffin' && currentLine.characterRole === 'Tillu'
    ? 'showing_tiffin'
    : currentLine.pose;

  const milluPose = currentLine.characterRole === 'Both'
    ? 'namaste'
    : currentLine.pose === 'showing_tiffin' && currentLine.characterRole === 'Millu'
    ? 'showing_tiffin'
    : currentLine.pose;

  return (
    <div className="flex flex-col gap-5">
      {/* The School Stage Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-stone-900 via-stone-850 to-stone-950 border border-stone-800 shadow-2xl text-stone-100">
        {/* Top Classroom Stage Border with Curtain Accents */}
        <div className="relative h-4 bg-gradient-to-r from-red-800 via-rose-700 to-red-800 flex items-center justify-between px-6 border-b border-red-950">
          <div className="w-8 h-2 bg-amber-400/40 rounded-full" />
          <span className="text-[10px] tracking-widest text-amber-200/90 uppercase font-mono">
            ★ Primary School Assembly Stage · Class 4 ★
          </span>
          <div className="w-8 h-2 bg-amber-400/40 rounded-full" />
        </div>

        {/* Stage Interior (Blackboard + Characters) */}
        <div className="relative px-4 sm:px-8 pt-6 pb-2">
          {/* Spotlight Cone Background */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-amber-900/5 to-transparent pointer-events-none" />

          {/* Classroom Blackboard Backdrop */}
          <div className="relative mx-auto max-w-2xl bg-[#1b3022] rounded-xl border-4 border-[#8B5A2B] p-4 sm:p-5 shadow-inner mb-6 text-stone-100 font-sans">
            {/* Wooden frame corner screws */}
            <div className="absolute top-1 left-1 w-2 h-2 rounded-full bg-amber-800/80" />
            <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-800/80" />
            <div className="absolute bottom-1 left-1 w-2 h-2 rounded-full bg-amber-800/80" />
            <div className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-amber-800/80" />

            {/* Blackboard Chalk Dust & Texture */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-emerald-800/60 pb-2 mb-2 gap-2">
              <div className="flex items-center gap-2">
                <span className="text-amber-300 text-xs font-mono tracking-wider uppercase">
                  Duo Dialogue Activity
                </span>
                <span className="text-emerald-600">·</span>
                <span className="text-emerald-300 text-xs">कक्षा 4 (Class 4)</span>
              </div>
              <div className="text-[11px] text-emerald-200/70 font-mono">
                Topic: Talking about Healthy Food
              </div>
            </div>

            <div className="text-center py-1">
              <h2 className="text-base sm:text-lg font-bold text-amber-100 tracking-wide font-serif">
                "टिल्लू और मिल्लू: पौष्टिक भोजन की बातचीत"
              </h2>
              <div className="flex items-center justify-center gap-3 text-xs text-emerald-200/90 mt-1">
                <span>कीर्तना (टिल्लू)</span>
                <span className="text-emerald-500">↔</span>
                <span>तेजस्वी (मिल्लू)</span>
              </div>
            </div>

            {/* Chalk Doodles */}
            <div className="flex items-center justify-between text-[11px] text-emerald-300/60 pt-2 border-t border-emerald-800/40">
              <span className="flex items-center gap-1">
                <span>🌾</span> <span>गेहूं की चपाती</span>
              </span>
              <span className="italic text-emerald-400/80 font-mono text-[10px]">
                "हेल्दी फूड हमें मजबूत बनाता है!"
              </span>
              <span className="flex items-center gap-1">
                <span>🥟</span> <span>भाप की इडली व चटनी</span>
              </span>
            </div>
          </div>

          {/* Active Speech Balloon Callout */}
          <div className="relative mx-auto max-w-xl mb-6 z-10">
            <div
              className={`p-4 rounded-xl border shadow-xl transition-all duration-300 ${
                currentLine.characterRole === 'Tillu'
                  ? 'bg-amber-950/90 border-amber-500/40 text-amber-50'
                  : currentLine.characterRole === 'Millu'
                  ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-50'
                  : 'bg-stone-900/95 border-amber-400/50 text-white'
              }`}
            >
              {/* Speaker Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      isPlaying ? 'bg-emerald-400 animate-ping' : 'bg-stone-500'
                    }`}
                  />
                  <span className="font-semibold text-xs text-amber-300">
                    {currentLine.speaker}
                  </span>
                  <span className="text-stone-400 text-xs">·</span>
                  <span className="text-stone-300 text-[11px]">
                    Line {currentIndex + 1} of {allLines.length}
                  </span>
                </div>

                <button
                  onClick={() => onPlayLine(currentLine)}
                  className="flex items-center gap-1.5 px-3 py-1 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-lg text-xs font-semibold shadow transition-all active:scale-95"
                  title="Gemini 3.8 Flash TTS से सुनें"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{isPlaying ? 'दोबारा सुनें (Hear)' : 'बोलें (Listen)'}</span>
                </button>
              </div>

              {/* Spoken Lines with Translations */}
              <div className="space-y-1.5">
                {(languageMode === 'all' || languageMode === 'hindi') && (
                  <p className="text-base sm:text-xl font-bold text-white tracking-wide leading-relaxed">
                    {currentLine.hindi}
                  </p>
                )}

                {(languageMode === 'all' || languageMode === 'hinglish') && (
                  <p className="text-xs sm:text-sm text-amber-200/90 font-mono">
                    "{currentLine.hinglish}"
                  </p>
                )}

                {(languageMode === 'all' || languageMode === 'english') && (
                  <p className="text-xs text-stone-300 italic">
                    {currentLine.english}
                  </p>
                )}
              </div>

              {/* Nutrition Insight Tag */}
              {currentLine.learningFact && (
                <div className="mt-3 pt-2 border-t border-white/10 flex items-center gap-2 text-[11px] text-amber-200">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{currentLine.learningFact}</span>
                </div>
              )}
            </div>
          </div>

          {/* Characters on Wooden Floor Stage */}
          <div className="relative flex items-end justify-around px-4 pb-4 pt-2">
            {/* Keerthana as Tillu (Left) */}
            <StudentCharacter
              name="कीर्तना (Keerthana)"
              role="Tillu"
              className4="Class 4 · Tillu"
              isSpeaking={isTilluSpeaking}
              pose={tilluPose}
              activeFood={currentLine.activeFood === 'chapati' ? 'chapati' : undefined}
              position="left"
              onClick={() => {
                const tilluLine = allLines.find(
                  (l, idx) => idx >= currentIndex && l.characterRole === 'Tillu'
                ) || currentLine;
                onPlayLine(tilluLine);
              }}
            />

            {/* Center Stage Divider / Props Area */}
            <div className="flex flex-col items-center justify-center pb-8 text-center max-w-[140px] hidden sm:flex">
              <div className="w-12 h-1 bg-amber-500/30 rounded-full mb-3" />
              <div className="text-[11px] text-stone-400 uppercase tracking-widest font-mono">
                Duo Scene
              </div>
              <p className="text-[10px] text-amber-200/70 mt-1">
                {currentLine.stage === 'intro'
                  ? 'मंच परिचय'
                  : currentLine.stage === 'dialogue'
                  ? 'लंचबॉक्स बातचीत'
                  : 'समापन व धन्यवाद'}
              </p>
            </div>

            {/* Tejaswi as Millu (Right) */}
            <StudentCharacter
              name="तेजस्वी (Tejaswi)"
              role="Millu"
              className4="Class 4 · Millu"
              isSpeaking={isMilluSpeaking}
              pose={milluPose}
              activeFood={currentLine.activeFood === 'idli_chutney' ? 'idli_chutney' : undefined}
              position="right"
              onClick={() => {
                const milluLine = allLines.find(
                  (l, idx) => idx >= currentIndex && l.characterRole === 'Millu'
                ) || currentLine;
                onPlayLine(milluLine);
              }}
            />
          </div>

          {/* Wooden Stage Floor Plank Graphic */}
          <div className="h-6 bg-gradient-to-r from-[#5a381e] via-[#784d28] to-[#5a381e] border-t-2 border-[#8B5A2B] -mx-8 shadow-inner flex items-center justify-around px-8">
            <div className="w-20 h-0.5 bg-black/20" />
            <div className="w-32 h-0.5 bg-black/20" />
            <div className="w-24 h-0.5 bg-black/20" />
          </div>
        </div>

        {/* Stage Bottom Controls Bar */}
        <div className="bg-stone-900 border-t border-stone-800 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          {/* Main Duo Performance Play Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={isFullPlaybackActive ? onStopPlayback : onPlayFull}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-xs transition-all shadow-md active:scale-95 ${
                isFullPlaybackActive
                  ? 'bg-rose-600 hover:bg-rose-500 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              {isFullPlaybackActive ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>रोकें (Pause Performance)</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>पूरी प्रस्तुति चलाएं (Full Duo Dialogue)</span>
                </>
              )}
            </button>

            {/* Replay Line Button */}
            <button
              onClick={() => onPlayLine(currentLine)}
              className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors text-xs flex items-center gap-1 border border-stone-700"
              title="यह संवाद दोबारा सुनें"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">रीप्ले</span>
            </button>
          </div>

          {/* Step Navigation Controls */}
          <div className="flex items-center gap-2">
            <button
              disabled={currentIndex <= 0}
              onClick={onPrevLine}
              className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 disabled:opacity-30 disabled:pointer-events-none text-stone-200 transition-colors border border-stone-700"
              title="पिछला संवाद"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            {/* Line Pill Buttons */}
            <div className="flex items-center gap-1">
              {allLines.map((line, idx) => (
                <button
                  key={line.id}
                  onClick={() => onSelectIndex(idx)}
                  className={`w-7 h-7 rounded-md text-[11px] font-mono font-medium transition-all ${
                    idx === currentIndex
                      ? 'bg-amber-400 text-stone-950 font-bold scale-110 shadow'
                      : 'bg-stone-800 text-stone-400 hover:text-white hover:bg-stone-700'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

            <button
              disabled={currentIndex >= allLines.length - 1}
              onClick={onNextLine}
              className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 disabled:opacity-30 disabled:pointer-events-none text-stone-200 transition-colors border border-stone-700"
              title="अगला संवाद"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Teacher's Prompter Guide Bar */}
      <TeacherPrompter
        currentTeacherNote={currentLine.teacherNote}
        stageName={
          currentLine.stage === 'intro'
            ? 'परिचय (Introduction)'
            : currentLine.stage === 'dialogue'
            ? 'संवाद (Dialogue)'
            : 'समापन (Conclusion)'
        }
      />
    </div>
  );
};
