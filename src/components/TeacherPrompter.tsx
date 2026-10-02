import React from 'react';
import { Volume2, Award, Heart } from 'lucide-react';

interface TeacherPrompterProps {
  currentTeacherNote?: string;
  stageName: string;
}

export const TeacherPrompter: React.FC<TeacherPrompterProps> = ({
  currentTeacherNote,
  stageName,
}) => {
  return (
    <div className="bg-stone-900/90 border border-emerald-500/30 rounded-xl p-3.5 shadow-lg backdrop-blur-sm flex items-start gap-3">
      {/* Teacher Avatar Icon */}
      <div className="relative shrink-0 w-11 h-11 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white shadow-md">
        <svg
          viewBox="0 0 40 40"
          className="w-8 h-8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Saree & spectacles teacher figure */}
          <circle cx="20" cy="14" r="7" fill="#f7c89f" />
          <path d="M13,12 Q20,7 27,12 Q27,16 25,16 Q20,13 15,16 Z" fill="#1e1b18" />
          <circle cx="17" cy="14" r="2.2" stroke="#0f172a" strokeWidth="0.8" fill="none" />
          <circle cx="23" cy="14" r="2.2" stroke="#0f172a" strokeWidth="0.8" fill="none" />
          <line x1="19.2" y1="14" x2="20.8" y2="14" stroke="#0f172a" strokeWidth="0.8" />
          {/* Smile */}
          <path d="M18,17 Q20,19 22,17" stroke="#991b1b" strokeWidth="0.8" fill="none" />
          {/* Red bindi */}
          <circle cx="20" cy="11.5" r="0.8" fill="#dc2626" />
          {/* Saree drape */}
          <path d="M11,32 Q13,22 20,22 Q27,22 29,32 Z" fill="#047857" />
          <path d="M13,24 L27,32" stroke="#fbbf24" strokeWidth="1.5" />
        </svg>
        <span className="absolute -bottom-1 -right-1 bg-amber-400 text-stone-950 p-0.5 rounded-full text-[9px]">
          <Heart className="w-2.5 h-2.5 fill-current" />
        </span>
      </div>

      {/* Prompter Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between text-xs text-emerald-300 font-medium mb-1">
          <span className="flex items-center gap-1.5">
            <span>शिक्षिका का प्रोत्साहन (Teacher's Guide)</span>
            <span className="text-stone-400">·</span>
            <span className="text-stone-300 text-[11px]">{stageName}</span>
          </span>
          <span className="text-[10px] text-stone-400 italic">Background Guide</span>
        </div>
        <p className="text-xs text-emerald-100 font-medium leading-relaxed">
          {currentTeacherNote || 'शाबाश बच्चियों! बहुत सुंदर प्रस्तुति दे रही हो।'}
        </p>
      </div>
    </div>
  );
};
