import React from 'react';

interface StudentCharacterProps {
  name: string;
  role: 'Tillu' | 'Millu';
  className4: string;
  isSpeaking: boolean;
  pose: 'facing_front' | 'facing_partner' | 'showing_tiffin' | 'namaste' | 'encouraging';
  activeFood?: 'chapati' | 'idli_chutney';
  position: 'left' | 'right';
  onClick?: () => void;
}

export const StudentCharacter: React.FC<StudentCharacterProps> = ({
  name,
  role,
  className4,
  isSpeaking,
  pose,
  activeFood,
  position,
  onClick,
}) => {
  // Flip angle for facing partner:
  // Tillu (left) looks towards right (partner)
  // Millu (right) looks towards left (partner)
  const isFacingPartner = pose === 'facing_partner';
  const isShowingTiffin = pose === 'showing_tiffin';
  const isNamaste = pose === 'namaste';

  const tieColor = role === 'Tillu' ? '#e11d48' : '#ea580c'; // red vs orange-red
  const badgeColor = role === 'Tillu' ? '#2563eb' : '#059669'; // blue vs emerald

  return (
    <div
      onClick={onClick}
      className={`relative flex flex-col items-center select-none transition-transform duration-500 cursor-pointer group ${
        isSpeaking ? 'scale-105' : 'hover:scale-[1.02]'
      }`}
    >
      {/* Speech Spotlight / Aura */}
      {isSpeaking && (
        <div className="absolute -inset-4 bg-amber-400/20 blur-xl rounded-full animate-pulse pointer-events-none" />
      )}

      {/* Floating Role Name Tag Above Head */}
      <div className="mb-2 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-900/80 backdrop-blur-md text-amber-200 border border-amber-300/30 rounded-lg shadow-md text-xs font-semibold tracking-wide">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
          <span>{name}</span>
          <span className="text-amber-100/60 text-[10px]">({role})</span>
        </div>
        <p className="text-[11px] text-amber-200/80 font-medium mt-0.5">{className4}</p>
      </div>

      {/* SVG Character Model */}
      <div className="relative w-44 h-72 sm:w-52 sm:h-80 transition-all duration-300">
        <svg
          viewBox="0 0 200 320"
          className="w-full h-full drop-shadow-xl"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={`skinGrad-${role}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f7c89f" />
              <stop offset="100%" stopColor="#eab588" />
            </linearGradient>
            <linearGradient id={`uniformGrad-${role}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1e3a8a" />
              <stop offset="100%" stopColor="#172554" />
            </linearGradient>
            <linearGradient id={`tiffinSteel`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f1f5f9" />
              <stop offset="50%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#94a3b8" />
            </linearGradient>
          </defs>

          {/* Shadow on floor */}
          <ellipse cx="100" cy="305" rx="55" ry="10" fill="#000000" opacity="0.25" />

          {/* Legs & School Shoes */}
          <g id="legs">
            {/* Left leg & shoe */}
            <rect x="74" y="240" width="16" height="48" fill="#eab588" rx="4" />
            {/* White school socks */}
            <rect x="74" y="268" width="16" height="18" fill="#ffffff" rx="2" />
            <rect x="74" y="271" width="16" height="2" fill="#1e3a8a" />
            {/* Black shiny school shoe */}
            <path
              d="M70,286 Q80,286 92,286 Q96,290 94,297 Q90,300 68,300 Q66,295 70,286 Z"
              fill="#0f172a"
            />
            <ellipse cx="78" cy="289" rx="3" ry="1.5" fill="#64748b" />

            {/* Right leg & shoe */}
            <rect x="110" y="240" width="16" height="48" fill="#eab588" rx="4" />
            {/* White school socks */}
            <rect x="110" y="268" width="16" height="18" fill="#ffffff" rx="2" />
            <rect x="110" y="271" width="16" height="2" fill="#1e3a8a" />
            {/* Black shiny school shoe */}
            <path
              d="M106,286 Q116,286 128,286 Q132,290 130,297 Q126,300 104,300 Q102,295 106,286 Z"
              fill="#0f172a"
            />
            <ellipse cx="114" cy="289" rx="3" ry="1.5" fill="#64748b" />
          </g>

          {/* School Uniform Pinafore / Skirt */}
          <g id="skirt">
            <path
              d="M60,165 L140,165 L152,242 Q100,248 48,242 Z"
              fill={`url(#uniformGrad-${role})`}
            />
            {/* Skirt pleats */}
            <line x1="78" y1="165" x2="72" y2="243" stroke="#0f172a" strokeWidth="1.5" opacity="0.4" />
            <line x1="100" y1="165" x2="100" y2="245" stroke="#0f172a" strokeWidth="1.5" opacity="0.4" />
            <line x1="122" y1="165" x2="128" y2="243" stroke="#0f172a" strokeWidth="1.5" opacity="0.4" />
            {/* School belt */}
            <rect x="58" y="162" width="84" height="8" fill="#0f172a" rx="2" />
            <rect x="94" y="160" width="12" height="12" fill="#e2e8f0" stroke="#64748b" strokeWidth="1.5" rx="1" />
          </g>

          {/* White Shirt Torso & Pinafore Straps */}
          <g id="torso">
            {/* White shirt body */}
            <path d="M68,110 L132,110 L140,164 L60,164 Z" fill="#ffffff" />
            {/* Navy straps of pinafore */}
            <rect x="74" y="112" width="12" height="52" fill={`url(#uniformGrad-${role})`} />
            <rect x="114" y="112" width="12" height="52" fill={`url(#uniformGrad-${role})`} />

            {/* School Tie */}
            <path d="M96,114 L104,114 L106,146 L100,154 L94,146 Z" fill={tieColor} />
            <polygon points="95,112 105,112 103,117 97,117" fill="#9f1239" />
            {/* Tie stripes */}
            <line x1="96" y1="124" x2="104" y2="128" stroke="#ffffff" strokeWidth="1.5" />
            <line x1="96" y1="134" x2="104" y2="138" stroke="#ffffff" strokeWidth="1.5" />

            {/* School ID Badge */}
            <rect x="116" y="128" width="14" height="18" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.8" rx="2" />
            <rect x="118" y="130" width="10" height="4" fill={badgeColor} />
            <line x1="118" y1="137" x2="126" y2="137" stroke="#94a3b8" strokeWidth="1" />
            <line x1="118" y1="141" x2="124" y2="141" stroke="#94a3b8" strokeWidth="1" />
          </g>

          {/* White Shirt Collar */}
          <g id="collar">
            <polygon points="98,114 74,106 88,118" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.8" />
            <polygon points="102,114 126,106 112,118" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.8" />
          </g>

          {/* Arms & Hands according to pose */}
          <g id="arms">
            {isNamaste ? (
              // Folded hands in Namaste 🙏 at chest
              <g className="transition-all duration-300">
                {/* Left arm bending inward */}
                <path
                  d="M68,116 Q52,140 88,142"
                  stroke={`url(#skinGrad-${role})`}
                  strokeWidth="14"
                  strokeLinecap="round"
                  fill="none"
                />
                {/* Right arm bending inward */}
                <path
                  d="M132,116 Q148,140 112,142"
                  stroke={`url(#skinGrad-${role})`}
                  strokeWidth="14"
                  strokeLinecap="round"
                  fill="none"
                />
                {/* White shirt sleeves */}
                <ellipse cx="68" cy="118" rx="8" ry="7" fill="#ffffff" />
                <ellipse cx="132" cy="118" rx="8" ry="7" fill="#ffffff" />
                {/* Namaste hands joined at center */}
                <g transform="translate(100, 138)">
                  <ellipse cx="-4" cy="0" rx="6" ry="10" fill="#f7c89f" transform="rotate(-15)" />
                  <ellipse cx="4" cy="0" rx="6" ry="10" fill="#f7c89f" transform="rotate(15)" />
                  <line x1="0" y1="-8" x2="0" y2="8" stroke="#eab588" strokeWidth="1" />
                </g>
              </g>
            ) : isShowingTiffin ? (
              // Holding up lunchbox proudly
              <g className="transition-all duration-300">
                {/* Left arm holding side of tiffin */}
                <path
                  d="M68,116 Q56,150 78,160"
                  stroke={`url(#skinGrad-${role})`}
                  strokeWidth="13"
                  strokeLinecap="round"
                  fill="none"
                />
                {/* Right arm holding other side */}
                <path
                  d="M132,116 Q144,150 122,160"
                  stroke={`url(#skinGrad-${role})`}
                  strokeWidth="13"
                  strokeLinecap="round"
                  fill="none"
                />
                <ellipse cx="68" cy="118" rx="8" ry="7" fill="#ffffff" />
                <ellipse cx="132" cy="118" rx="8" ry="7" fill="#ffffff" />

                {/* Hand clasps on tiffin */}
                <circle cx="78" cy="160" r="7" fill="#f7c89f" />
                <circle cx="122" cy="160" r="7" fill="#f7c89f" />

                {/* The Tiffin Box in hands */}
                <g transform="translate(100, 168)">
                  {/* Steel lunch box body */}
                  <rect x="-35" y="-12" width="70" height="24" rx="10" fill="url(#tiffinSteel)" stroke="#64748b" strokeWidth="1.5" />
                  <ellipse cx="0" cy="-12" rx="35" ry="8" fill="#e2e8f0" stroke="#64748b" strokeWidth="1.5" />

                  {/* Inside food reveal */}
                  {role === 'Tillu' ? (
                    // Golden Chapatis in box
                    <g>
                      <ellipse cx="-8" cy="-12" rx="18" ry="7" fill="#d97706" />
                      <ellipse cx="-8" cy="-13" rx="17" ry="6" fill="#fef3c7" stroke="#b45309" strokeWidth="0.8" />
                      <circle cx="-12" cy="-14" r="1.5" fill="#b45309" opacity="0.6" />
                      <circle cx="-5" cy="-12" r="1.8" fill="#b45309" opacity="0.6" />
                      <ellipse cx="10" cy="-12" rx="16" ry="6" fill="#fde68a" stroke="#b45309" strokeWidth="0.8" />
                      <circle cx="12" cy="-12" r="1.5" fill="#b45309" opacity="0.6" />
                      {/* Gentle steam curls */}
                      <path d="M-8,-20 Q-12,-26 -8,-32" stroke="#ffffff" strokeWidth="1.5" fill="none" opacity="0.7" strokeLinecap="round" />
                      <path d="M6,-22 Q2,-28 6,-34" stroke="#ffffff" strokeWidth="1.5" fill="none" opacity="0.7" strokeLinecap="round" />
                    </g>
                  ) : (
                    // Fluffy white Idlis + Green Chutney
                    <g>
                      {/* Idli 1 */}
                      <ellipse cx="-14" cy="-12" rx="12" ry="7" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
                      <ellipse cx="-14" cy="-13" rx="10" ry="5.5" fill="#ffffff" />
                      {/* Idli 2 */}
                      <ellipse cx="0" cy="-13" rx="12" ry="7" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
                      <ellipse cx="0" cy="-14" rx="10" ry="5.5" fill="#ffffff" />
                      {/* Green Coconut Chutney bowl */}
                      <ellipse cx="18" cy="-11" rx="9" ry="5.5" fill="#16a34a" stroke="#15803d" strokeWidth="1" />
                      <circle cx="17" cy="-11" r="1" fill="#14532d" />
                      <circle cx="20" cy="-12" r="0.8" fill="#14532d" />
                      {/* Steam */}
                      <path d="M-6,-22 Q-2,-28 -6,-34" stroke="#ffffff" strokeWidth="1.5" fill="none" opacity="0.7" strokeLinecap="round" />
                    </g>
                  )}
                </g>
              </g>
            ) : isFacingPartner ? (
              // Expressive conversational gestures
              <g className="transition-all duration-300">
                {position === 'left' ? (
                  // Tillu gesturing right towards Millu
                  <>
                    <path
                      d="M68,116 Q58,145 66,160"
                      stroke={`url(#skinGrad-${role})`}
                      strokeWidth="12"
                      strokeLinecap="round"
                      fill="none"
                    />
                    <circle cx="66" cy="160" r="6" fill="#f7c89f" />
                    <path
                      d="M132,116 Q150,135 156,125"
                      stroke={`url(#skinGrad-${role})`}
                      strokeWidth="12"
                      strokeLinecap="round"
                      fill="none"
                    />
                    <circle cx="156" cy="125" r="6" fill="#f7c89f" />
                  </>
                ) : (
                  // Millu gesturing left towards Tillu
                  <>
                    <path
                      d="M68,116 Q50,135 44,125"
                      stroke={`url(#skinGrad-${role})`}
                      strokeWidth="12"
                      strokeLinecap="round"
                      fill="none"
                    />
                    <circle cx="44" cy="125" r="6" fill="#f7c89f" />
                    <path
                      d="M132,116 Q142,145 134,160"
                      stroke={`url(#skinGrad-${role})`}
                      strokeWidth="12"
                      strokeLinecap="round"
                      fill="none"
                    />
                    <circle cx="134" cy="160" r="6" fill="#f7c89f" />
                  </>
                )}
                <ellipse cx="68" cy="118" rx="8" ry="7" fill="#ffffff" />
                <ellipse cx="132" cy="118" rx="8" ry="7" fill="#ffffff" />
              </g>
            ) : (
              // Default polite standing pose with arms at sides
              <g>
                <path
                  d="M68,116 Q56,140 62,170"
                  stroke={`url(#skinGrad-${role})`}
                  strokeWidth="12"
                  strokeLinecap="round"
                  fill="none"
                />
                <circle cx="62" cy="170" r="6" fill="#f7c89f" />
                <path
                  d="M132,116 Q144,140 138,170"
                  stroke={`url(#skinGrad-${role})`}
                  strokeWidth="12"
                  strokeLinecap="round"
                  fill="none"
                />
                <circle cx="138" cy="170" r="6" fill="#f7c89f" />
                <ellipse cx="68" cy="118" rx="8" ry="7" fill="#ffffff" />
                <ellipse cx="132" cy="118" rx="8" ry="7" fill="#ffffff" />
              </g>
            )}
          </g>

          {/* Neck */}
          <rect x="92" y="96" width="16" height="18" fill={`url(#skinGrad-${role})`} rx="4" />

          {/* Head & Hair */}
          <g
            id="head"
            style={{
              transform: isFacingPartner
                ? position === 'left'
                  ? 'rotate(8deg) translate(2px, -2px)'
                  : 'rotate(-8deg) translate(-2px, -2px)'
                : 'none',
              transformOrigin: '100px 90px',
              transition: 'transform 0.4s ease',
            }}
          >
            {/* Back Hair & Braids (Two Plaits) */}
            <g id="braids">
              {/* Left braid */}
              <path
                d="M72,70 Q50,90 54,140"
                stroke="#1e1b18"
                strokeWidth="12"
                strokeLinecap="round"
                fill="none"
              />
              {/* Left ribbon */}
              <circle cx="54" cy="136" r="6" fill="#e11d48" />
              <polygon points="54,136 46,144 58,144" fill="#be123c" />

              {/* Right braid */}
              <path
                d="M128,70 Q150,90 146,140"
                stroke="#1e1b18"
                strokeWidth="12"
                strokeLinecap="round"
                fill="none"
              />
              {/* Right ribbon */}
              <circle cx="146" cy="136" r="6" fill="#e11d48" />
              <polygon points="146,136 138,144 154,144" fill="#be123c" />
            </g>

            {/* Face base */}
            <path
              d="M72,62 Q100,56 128,62 Q136,88 126,104 Q100,116 74,104 Q64,88 72,62 Z"
              fill={`url(#skinGrad-${role})`}
            />

            {/* Cute ears with tiny red stud earrings */}
            <ellipse cx="69" cy="80" rx="5" ry="7" fill="#f7c89f" />
            <circle cx="68" cy="82" r="2" fill="#e11d48" />
            <ellipse cx="131" cy="80" rx="5" ry="7" fill="#f7c89f" />
            <circle cx="132" cy="82" r="2" fill="#e11d48" />

            {/* Front Hair Bangs / Parting */}
            <path
              d="M68,64 Q100,48 132,64 Q132,74 122,76 Q100,64 78,76 Q68,74 68,64 Z"
              fill="#1e1b18"
            />
            {/* Center hair parting line */}
            <line x1="100" y1="52" x2="100" y2="66" stroke="#000000" strokeWidth="1.2" opacity="0.6" />

            {/* Cheerful Eyes */}
            <g id="eyes">
              {/* Left eye */}
              <ellipse cx="86" cy="80" rx="5" ry="6" fill="#0f172a" />
              <circle cx="84.5" cy="78" r="2" fill="#ffffff" />
              <circle cx="87.5" cy="81" r="1" fill="#ffffff" opacity="0.8" />
              {/* Left eyebrow */}
              <path d="M80,72 Q86,69 92,72" stroke="#1e1b18" strokeWidth="1.8" fill="none" strokeLinecap="round" />

              {/* Right eye */}
              <ellipse cx="114" cy="80" rx="5" ry="6" fill="#0f172a" />
              <circle cx="112.5" cy="78" r="2" fill="#ffffff" />
              <circle cx="115.5" cy="81" r="1" fill="#ffffff" opacity="0.8" />
              {/* Right eyebrow */}
              <path d="M108,72 Q114,69 120,72" stroke="#1e1b18" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            </g>

            {/* Rosy Cheeks */}
            <circle cx="78" cy="87" r="5" fill="#f43f5e" opacity="0.3" />
            <circle cx="122" cy="87" r="5" fill="#f43f5e" opacity="0.3" />

            {/* Nose */}
            <path d="M99,82 Q100,86 102,86" stroke="#c28b60" strokeWidth="1.4" fill="none" strokeLinecap="round" />

            {/* Small red bindi or tilak dot on forehead */}
            <circle cx="100" cy="72" r="1.4" fill="#dc2626" />

            {/* Mouth (Animates when speaking!) */}
            <g id="mouth">
              {isSpeaking ? (
                // Open speaking mouth
                <g className="animate-pulse">
                  <path
                    d="M93,93 Q100,102 107,93 Z"
                    fill="#991b1b"
                    stroke="#7f1d1d"
                    strokeWidth="1"
                  />
                  <rect x="96" y="93" width="8" height="2" fill="#ffffff" rx="1" />
                  <ellipse cx="100" cy="98" rx="4" ry="2" fill="#f87171" />
                </g>
              ) : (
                // Sweet friendly smile
                <path
                  d="M93,92 Q100,98 107,92"
                  stroke="#881337"
                  strokeWidth="2.2"
                  fill="none"
                  strokeLinecap="round"
                />
              )}
            </g>
          </g>
        </svg>

        {/* Tiffin Indicator Callout when mentioned */}
        {activeFood && isShowingTiffin && (
          <div
            className={`absolute -bottom-3 ${
              position === 'left' ? 'left-2' : 'right-2'
            } bg-amber-100 border border-amber-300 px-2.5 py-1 rounded-md shadow-lg text-[11px] font-bold text-amber-900 animate-bounce flex items-center gap-1.5`}
          >
            <span>{activeFood === 'chapati' ? '🫓' : '🥟'}</span>
            <span>{activeFood === 'chapati' ? 'चपाती (Chapatis)' : 'इडली व चटनी'}</span>
          </div>
        )}
      </div>

      {/* Stage Shadow & Click to Listen hint */}
      <span className="text-[10px] text-amber-300/60 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
        क्लिक करके सुनें (Click to hear)
      </span>
    </div>
  );
};
