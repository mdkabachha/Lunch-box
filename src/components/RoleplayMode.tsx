import React, { useState, useEffect } from 'react';
import { DialogueLine } from '../types/dialogue';
import { ttsService } from '../services/ttsService';
import { Mic, MicOff, Volume2, Sparkles, Award, Play, RotateCcw, CheckCircle } from 'lucide-react';

interface RoleplayModeProps {
  lines: DialogueLine[];
}

export const RoleplayMode: React.FC<RoleplayModeProps> = ({ lines }) => {
  // Only roleplay through the main dialogue & intro
  const roleplayLines = lines.filter((l) => l.characterRole !== 'Teacher');

  const [selectedRole, setSelectedRole] = useState<'Tillu' | 'Millu'>('Tillu');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedSpokenText, setRecordedSpokenText] = useState('');
  const [isPartnerSpeaking, setIsPartnerSpeaking] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [starsWon, setStarsWon] = useState(0);

  const activeLine = roleplayLines[currentStepIndex];
  const isUserTurn =
    activeLine?.characterRole === selectedRole || activeLine?.characterRole === 'Both';
  const partnerRole = selectedRole === 'Tillu' ? 'Millu' : 'Tillu';

  // Automatically trigger AI partner speech when it's partner's turn
  useEffect(() => {
    if (!activeLine) return;

    if (!isUserTurn && !isPartnerSpeaking) {
      handlePlayPartnerLine();
    }
  }, [currentStepIndex, selectedRole]);

  const handlePlayPartnerLine = () => {
    if (!activeLine) return;
    setIsPartnerSpeaking(true);

    ttsService.speak(
      {
        text: activeLine.hindi,
        speaker: activeLine.characterRole,
        voiceName: activeLine.voiceName,
        style: activeLine.audioStyle,
      },
      () => setIsPartnerSpeaking(true),
      () => {
        setIsPartnerSpeaking(false);
        // Advance to user's turn
        if (!completedSteps.includes(currentStepIndex)) {
          setCompletedSteps((prev) => [...prev, currentStepIndex]);
        }
        if (currentStepIndex < roleplayLines.length - 1) {
          setCurrentStepIndex((prev) => prev + 1);
        }
      },
      () => setIsPartnerSpeaking(false)
    );
  };

  const handleUserSubmit = () => {
    // Reward star and move to next turn
    if (!completedSteps.includes(currentStepIndex)) {
      setCompletedSteps((prev) => [...prev, currentStepIndex]);
      setStarsWon((prev) => prev + 1);
    }
    setRecordedSpokenText('');
    setIsRecording(false);

    if (currentStepIndex < roleplayLines.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handleReset = () => {
    ttsService.stop();
    setCurrentStepIndex(0);
    setCompletedSteps([]);
    setStarsWon(0);
    setRecordedSpokenText('');
    setIsRecording(false);
    setIsPartnerSpeaking(false);
  };

  const startVoiceInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Your browser does not support Speech Recognition. You can click "मैंने बोल दिया" directly!');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'hi-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setIsRecording(true);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setRecordedSpokenText(transcript);
        setIsRecording(false);
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
    } catch (e) {
      setIsRecording(false);
    }
  };

  const isCompleted = currentStepIndex >= roleplayLines.length - 1 && completedSteps.length >= roleplayLines.length - 1;

  return (
    <div className="space-y-6">
      {/* Role Picker Banner */}
      <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-stone-900">
              रोलप्ले अभ्यास (Interactive Duo Practice)
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              अपनी भूमिका चुनें। AI साथी दूसरी भूमिका निभाएगा, और आप अपनी बारी पर बोलें!
            </p>
          </div>

          {/* Role Selector Buttons */}
          <div className="flex items-center gap-2 p-1 bg-stone-100 rounded-xl">
            <button
              onClick={() => {
                setSelectedRole('Tillu');
                handleReset();
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedRole === 'Tillu'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              मैं टिल्लू (Tillu) बनूँगा 🫓
            </button>
            <button
              onClick={() => {
                setSelectedRole('Millu');
                handleReset();
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedRole === 'Millu'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              मैं मिल्लू (Millu) बनूँगा 🥟
            </button>
          </div>
        </div>

        {/* Progress & Star Counter */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-stone-100 text-xs text-stone-600">
          <div className="flex items-center gap-2">
            <span>प्रगति (Progress):</span>
            <div className="w-36 h-2 bg-stone-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-400 transition-all duration-300"
                style={{
                  width: `${(completedSteps.length / roleplayLines.length) * 100}%`,
                }}
              />
            </div>
            <span className="font-mono text-[11px] text-stone-500">
              {completedSteps.length}/{roleplayLines.length}
            </span>
          </div>

          <div className="flex items-center gap-1 text-amber-600 font-bold">
            <Sparkles className="w-4 h-4 fill-current" />
            <span>{starsWon} स्टार्स जीते</span>
          </div>
        </div>
      </div>

      {/* Active Roleplay Arena */}
      {isCompleted ? (
        <div className="bg-gradient-to-br from-amber-500/10 via-emerald-500/10 to-teal-500/10 border-2 border-emerald-400 rounded-2xl p-8 text-center space-y-4 shadow-lg">
          <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto text-2xl shadow-lg animate-bounce">
            🏆
          </div>
          <h4 className="text-xl font-bold text-stone-900">
            शानदार प्रस्तुति! (Wonderful Duo Performance!)
          </h4>
          <p className="text-sm text-stone-600 max-w-md mx-auto">
            आपने "{selectedRole}" की भूमिका बहुत अच्छे से निभाई! शिक्षिका और पूरी क्लास ने आपकी तालियों से तारीफ की है! 👏
          </p>
          <div className="pt-2">
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold shadow-md active:scale-95 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>दोबारा अभ्यास करें (Practice Again)</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-md space-y-6">
          {/* Turn Indicator */}
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <span
                className={`w-3 h-3 rounded-full ${
                  isUserTurn ? 'bg-amber-500 animate-ping' : 'bg-emerald-500'
                }`}
              />
              <span className="text-sm font-bold text-stone-900">
                {isUserTurn ? `आपकी बारी (${selectedRole})` : `AI साथी बोल रहा है (${partnerRole})`}
              </span>
            </div>

            <span className="text-xs text-stone-400 font-mono">
              संवाद {currentStepIndex + 1} / {roleplayLines.length}
            </span>
          </div>

          {/* Current Dialogue Card */}
          <div
            className={`p-6 rounded-2xl border-2 transition-all ${
              isUserTurn
                ? 'bg-amber-50/60 border-amber-400/80 shadow-inner'
                : 'bg-emerald-50/60 border-emerald-400/80'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-stone-800">
                  {activeLine?.speaker}
                </span>
                <span className="text-xs text-stone-400">·</span>
                <span className="text-xs text-stone-500">
                  {activeLine?.actorName}
                </span>
              </div>

              {!isUserTurn && (
                <button
                  onClick={handlePlayPartnerLine}
                  className="flex items-center gap-1.5 px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-500"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{isPartnerSpeaking ? 'बोल रहे हैं...' : 'फिर से सुनें'}</span>
                </button>
              )}
            </div>

            {/* Prompt Text */}
            <div className="space-y-2">
              <p className="text-xl sm:text-2xl font-bold text-stone-900 tracking-wide leading-relaxed">
                {activeLine?.hindi}
              </p>
              <p className="text-sm font-mono text-stone-600">
                "{activeLine?.hinglish}"
              </p>
              <p className="text-xs text-stone-500 italic">
                {activeLine?.english}
              </p>
            </div>

            {/* User Interaction Controls */}
            {isUserTurn && (
              <div className="mt-6 pt-4 border-t border-amber-200/80 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {/* Mic Button */}
                  <button
                    onClick={startVoiceInput}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 ${
                      isRecording
                        ? 'bg-rose-600 text-white animate-pulse'
                        : 'bg-amber-500 hover:bg-amber-400 text-stone-950'
                    }`}
                  >
                    {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    <span>{isRecording ? 'सुन रहे हैं... (Listening)' : 'माइक में बोलें (Speak)'}</span>
                  </button>

                  {/* Model TTS audio sample for user reference */}
                  <button
                    onClick={() =>
                      ttsService.speak({
                        text: activeLine.hindi,
                        speaker: activeLine.characterRole,
                        voiceName: activeLine.voiceName,
                      })
                    }
                    className="p-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs flex items-center gap-1"
                    title="सुनें कि कैसे बोलना है"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span className="hidden sm:inline">उच्चारण सुनें (Sample)</span>
                  </button>
                </div>

                {/* Spoken transcript or confirmation */}
                <button
                  onClick={handleUserSubmit}
                  className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md transition-all active:scale-95"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>मैंने बोल दिया! (Next Turn)</span>
                </button>
              </div>
            )}

            {/* Transcript if captured via microphone */}
            {recordedSpokenText && (
              <div className="mt-3 p-3 bg-white rounded-lg border border-amber-200 text-xs text-stone-700">
                <span className="font-semibold text-emerald-700">आपकी आवाज़ (Recognized): </span>
                <span>"{recordedSpokenText}"</span>
              </div>
            )}
          </div>

          {/* Quick Step Navigator */}
          <div className="flex items-center justify-between text-xs text-stone-500">
            <button
              disabled={currentStepIndex <= 0}
              onClick={() => setCurrentStepIndex((prev) => prev - 1)}
              className="px-3 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 disabled:opacity-30 disabled:pointer-events-none"
            >
              ← पिछला संवाद
            </button>

            <button
              onClick={handleReset}
              className="px-3 py-1.5 rounded-lg text-stone-500 hover:text-stone-900"
            >
              रीसेट करें (Reset)
            </button>

            <button
              disabled={currentStepIndex >= roleplayLines.length - 1}
              onClick={() => setCurrentStepIndex((prev) => prev + 1)}
              className="px-3 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 disabled:opacity-30 disabled:pointer-events-none"
            >
              अगला संवाद →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
