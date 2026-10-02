import React from 'react';
import { DialogueLine, LanguageMode } from '../types/dialogue';
import { Volume2, Play, CheckCircle2, BookOpen, Utensils } from 'lucide-react';

interface DialogueScriptProps {
  lines: DialogueLine[];
  currentLineId: string;
  isPlaying: boolean;
  languageMode: LanguageMode;
  onPlayLine: (line: DialogueLine) => void;
  onSelectLine: (index: number) => void;
}

export const DialogueScript: React.FC<DialogueScriptProps> = ({
  lines,
  currentLineId,
  isPlaying,
  languageMode,
  onPlayLine,
  onSelectLine,
}) => {
  const introLines = lines.filter((l) => l.stage === 'intro');
  const dialogueLines = lines.filter((l) => l.stage === 'dialogue');
  const conclusionLines = lines.filter((l) => l.stage === 'conclusion');

  const renderSection = (
    title: string,
    subtitle: string,
    sectionLines: DialogueLine[],
    accentColor: string
  ) => (
    <div className="space-y-3">
      {/* Section Header */}
      <div className="flex items-center gap-2 pb-1 border-b border-stone-200">
        <h3 className="text-sm font-bold text-stone-800 tracking-wide uppercase font-mono">
          {title}
        </h3>
        <span className="text-stone-300">·</span>
        <span className="text-xs text-stone-500">{subtitle}</span>
      </div>

      {/* Lines Grid */}
      <div className="space-y-3">
        {sectionLines.map((line) => {
          const isSelected = line.id === currentLineId;
          const isLineActive = isSelected && isPlaying;
          const isTillu = line.characterRole === 'Tillu';
          const isMillu = line.characterRole === 'Millu';

          const indexInAll = lines.findIndex((l) => l.id === line.id);

          return (
            <div
              key={line.id}
              onClick={() => onSelectLine(indexInAll)}
              className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
                isSelected
                  ? 'bg-amber-50/70 border-amber-400 ring-2 ring-amber-400/30 shadow-md'
                  : 'bg-white border-stone-200/80 hover:border-stone-300 hover:shadow-sm'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {/* Speaker Avatar Icon */}
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs text-white shadow-sm ${
                      isTillu
                        ? 'bg-rose-600'
                        : isMillu
                        ? 'bg-emerald-600'
                        : 'bg-amber-600'
                    }`}
                  >
                    {isTillu ? 'ट' : isMillu ? 'म' : '🙏'}
                  </div>

                  <div>
                    <span className="text-xs font-bold text-stone-900">
                      {line.speaker}
                    </span>
                    <span className="text-stone-400 text-xs mx-1.5">·</span>
                    <span className="text-[11px] text-stone-500">
                      {line.actorName}
                    </span>
                  </div>
                </div>

                {/* Audio Trigger with Gemini 3.8 Flash TTS */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPlayLine(line);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm active:scale-95 ${
                    isLineActive
                      ? 'bg-emerald-600 text-white animate-pulse'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700 hover:text-stone-950'
                  }`}
                  title="Gemini 3.8 Flash TTS से सुनें"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{isLineActive ? 'सुन रहे हैं...' : 'आवाज़ सुनें (Audio)'}</span>
                </button>
              </div>

              {/* Spoken Text in Hindi, Hinglish, English */}
              <div className="space-y-1 pl-9">
                {(languageMode === 'all' || languageMode === 'hindi') && (
                  <p className="text-base font-semibold text-stone-900 leading-snug">
                    {line.hindi}
                  </p>
                )}

                {(languageMode === 'all' || languageMode === 'hinglish') && (
                  <p className="text-xs font-mono text-stone-600">
                    "{line.hinglish}"
                  </p>
                )}

                {(languageMode === 'all' || languageMode === 'english') && (
                  <p className="text-xs text-stone-500 italic">
                    {line.english}
                  </p>
                )}
              </div>

              {/* Extra details (Learning Fact / Teacher Guidance) */}
              {(line.learningFact || line.teacherNote) && (
                <div className="mt-3 pl-9 pt-2 border-t border-stone-100 flex flex-wrap items-center gap-3 text-[11px]">
                  {line.learningFact && (
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                      <Utensils className="w-3 h-3" />
                      <span>{line.learningFact}</span>
                    </span>
                  )}
                  {line.teacherNote && (
                    <span className="text-stone-500 italic">
                      {line.teacherNote}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Intro Section */}
      {renderSection(
        '1. परिचय (Introduction)',
        'कीर्तना (Tillu) और तेजस्वी (Millu) का मंच परिचय व विषय की घोषणा',
        introLines,
        'amber'
      )}

      {/* Main Dialogue Section */}
      {renderSection(
        '2. मुख्य संवाद (Main Dialogue)',
        'लंचबॉक्स: चपाती vs इडली-चटनी और पौष्टिक भोजन की ताकत',
        dialogueLines,
        'emerald'
      )}

      {/* Conclusion Section */}
      {renderSection(
        '3. समापन (Conclusion)',
        'हाथ जोड़कर धन्यवाद प्रस्तुति',
        conclusionLines,
        'rose'
      )}
    </div>
  );
};
