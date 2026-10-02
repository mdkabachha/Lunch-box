import React, { useState } from 'react';
import { DialogueLine } from '../types/dialogue';
import { ttsService } from '../services/ttsService';
import { Sparkles, Play, Volume2, BookOpen, Wand2 } from 'lucide-react';

interface DialogueCreatorProps {
  onLoadCustomDialogue: (lines: DialogueLine[]) => void;
}

const PRESET_TOPICS = [
  { id: 'fruits', label: 'ताजे फल और हरी सब्जियां (Fruits & Veggies)' },
  { id: 'hydration', label: 'पानी पीने का महत्व (Hydration & Water)' },
  { id: 'milk', label: 'दूध और मजबूत हड्डियां (Milk & Strong Bones)' },
  { id: 'breakfast', label: 'सुबह का नाश्ता क्यों जरूरी है (Morning Breakfast)' },
];

export const DialogueCreator: React.FC<DialogueCreatorProps> = ({
  onLoadCustomDialogue,
}) => {
  const [topic, setTopic] = useState(PRESET_TOPICS[0].label);
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<any>(null);
  const [isPlayingLineId, setIsPlayingLineId] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGeneratedResult(null);

    try {
      const res = await fetch('/api/generate-dialogue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          customPrompt,
        }),
      });

      if (!res.ok) throw new Error('Generation failed');
      const data = await res.json();
      setGeneratedResult(data);
    } catch (err) {
      console.error(err);
      alert('संवाद बनाने में त्रुटि हुई। कृपया पुनः प्रयास करें।');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePlayLine = (speaker: string, text: string, id: string) => {
    setIsPlayingLineId(id);
    const voiceName = speaker === 'Tillu' ? 'Puck' : 'Kore';
    ttsService.speak(
      {
        text,
        speaker,
        voiceName,
        style: `${speaker} young Indian schoolgirl speaking enthusiastically`,
      },
      () => setIsPlayingLineId(id),
      () => setIsPlayingLineId(null),
      () => setIsPlayingLineId(null)
    );
  };

  const handleApplyToStage = () => {
    if (!generatedResult || !Array.isArray(generatedResult.lines)) return;

    const newDialogueLines: DialogueLine[] = [
      {
        id: 'new-intro-1',
        stage: 'intro',
        speaker: 'Keerthana (Tillu)',
        characterRole: 'Tillu',
        actorName: 'कीर्तना (कक्षा 4)',
        hindi: `नमस्ते! आज हमारा नया विषय है: "${generatedResult.title || topic}"!`,
        hinglish: `Namaste! Aaj hamara naya topic hai: "${generatedResult.title || topic}"!`,
        english: `Hello! Today our topic is: "${generatedResult.title || topic}"!`,
        pose: 'facing_front',
        voiceName: 'Puck',
        audioStyle: 'Enthusiastic student announcing new presentation topic',
      },
      ...generatedResult.lines.map((item: any, idx: number) => ({
        id: `new-line-${idx}`,
        stage: 'dialogue' as const,
        speaker: item.speaker === 'Tillu' ? ('Keerthana (Tillu)' as const) : ('Tejaswi (Millu)' as const),
        characterRole: item.speaker === 'Tillu' ? ('Tillu' as const) : ('Millu' as const),
        actorName: item.speaker === 'Tillu' ? 'कीर्तना (टिल्लू)' : 'तेजस्वी (मिल्लू)',
        hindi: item.hindi,
        hinglish: item.hinglish || '',
        english: item.english || '',
        pose: 'facing_partner' as const,
        voiceName: (item.speaker === 'Tillu' ? 'Puck' : 'Kore') as any,
        audioStyle: 'Expressive school child',
        learningFact: item.foodFact,
      })),
      {
        id: 'new-conclusion-1',
        stage: 'conclusion',
        speaker: 'Both',
        characterRole: 'Both',
        actorName: 'कीर्तना और तेजस्वी',
        hindi: 'थैंक यू! Thank You! 🙏',
        hinglish: 'Thank You! (Namaste)',
        english: 'Thank You! (With folded hands)',
        pose: 'namaste',
        voiceName: 'Kore',
        audioStyle: 'Respectful student sign-off',
      },
    ];

    onLoadCustomDialogue(newDialogueLines);
  };

  return (
    <div className="space-y-6">
      {/* Creator Card */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-5">
        <div>
          <div className="flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-amber-600" />
            <h3 className="text-base font-bold text-stone-900">
              नया Duo Dialogue बनाएं (Create New School Dialogue)
            </h3>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Gemini 3.8 Flash की सहायता से टिल्लू और मिल्लू के लिए किसी भी नए पौष्टिक विषय पर 4-लाइन का नया संवाद लिखें और Gemini 3.8 Flash TTS से बुलवाएं!
          </p>
        </div>

        {/* Preset Topics */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-stone-700">
            लोकप्रिय विषय चुनें (Preset Topics):
          </label>
          <div className="flex flex-wrap gap-2">
            {PRESET_TOPICS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTopic(t.label)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  topic === t.label
                    ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Input */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-stone-700">
            या अपनी पसंद का विषय या निर्देश लिखें (Custom Instructions):
          </label>
          <input
            type="text"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="जैसे: टिल्लू को सेब पसंद है और मिल्लू को केला पसंद है..."
            className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-stone-800"
          />
        </div>

        {/* Action Button */}
        <div>
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center gap-2 px-5 py-2.5 bg-stone-900 hover:bg-stone-800 disabled:opacity-40 text-white rounded-xl text-xs font-bold shadow-md transition-all active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{isGenerating ? 'संवाद लिखा जा रहा है...' : 'संवाद तैयार करें (Generate Dialogue)'}</span>
          </button>
        </div>
      </div>

      {/* Generated Results Card */}
      {generatedResult && (
        <div className="bg-white border-2 border-emerald-500/50 rounded-2xl p-6 shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
            <div>
              <span className="text-xs font-mono text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded">
                तैयार Duo Dialogue
              </span>
              <h4 className="text-base font-bold text-stone-900 mt-1">
                {generatedResult.title || topic}
              </h4>
            </div>

            <button
              onClick={handleApplyToStage}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>मंच पर चलाएं (Load on School Stage)</span>
            </button>
          </div>

          {/* Generated Dialogue Lines */}
          <div className="space-y-3">
            {generatedResult.lines?.map((line: any, idx: number) => {
              const lineKey = `gen-${idx}`;
              const isPlaying = isPlayingLineId === lineKey;

              return (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border flex items-center justify-between ${
                    line.speaker === 'Tillu'
                      ? 'bg-amber-50/50 border-amber-200'
                      : 'bg-emerald-50/50 border-emerald-200'
                  }`}
                >
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-stone-900">
                      {line.speaker === 'Tillu' ? 'कीर्तना (टिल्लू)' : 'तेजस्वी (मिल्लू)'}
                    </span>
                    <p className="text-sm font-semibold text-stone-900 leading-snug">
                      {line.hindi}
                    </p>
                    <p className="text-xs text-stone-500 italic">
                      {line.english}
                    </p>
                  </div>

                  <button
                    onClick={() => handlePlayLine(line.speaker, line.hindi, lineKey)}
                    className="p-2 rounded-lg bg-white hover:bg-stone-100 text-stone-800 shadow-xs border border-stone-200"
                    title="Gemini 3.8 Flash TTS से सुनें"
                  >
                    <Volume2
                      className={`w-4 h-4 ${
                        isPlaying ? 'text-emerald-600 animate-pulse' : ''
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Key Lesson */}
          {generatedResult.healthyLesson && (
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>सीख (Takeaway):</strong> {generatedResult.healthyLesson}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
