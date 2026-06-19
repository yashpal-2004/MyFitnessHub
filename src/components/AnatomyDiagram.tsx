import React from 'react';

interface AnatomyDiagramProps {
  primaryMuscle: string;
  secondaryMuscles: string[];
  view?: 'front' | 'back' | 'both';
}

export const AnatomyDiagram: React.FC<AnatomyDiagramProps> = ({
  primaryMuscle,
  secondaryMuscles,
  view = 'both'
}) => {
  const normalize = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, '');

  const getMuscleColor = (muscleNames: string[]) => {
    const isPrimary = muscleNames.some(m => normalize(primaryMuscle).includes(normalize(m)) || normalize(m).includes(normalize(primaryMuscle)));
    if (isPrimary) return '#ef4444'; // Red-500

    const isSecondary = secondaryMuscles.some(sec => 
      muscleNames.some(m => normalize(sec).includes(normalize(m)) || normalize(m).includes(normalize(sec)))
    );
    if (isSecondary) return '#f97316'; // Orange-500

    return '#f1f5f9'; // Slate-100 (inactive)
  };

  const renderFront = () => (
    <svg viewBox="0 0 200 400" className="w-full h-full max-h-[300px] select-none" xmlns="http://www.w3.org/2000/svg">
      {/* Head */}
      <circle cx="100" cy="40" r="18" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" />
      {/* Neck */}
      <rect x="94" y="58" width="12" height="15" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" />
      
      {/* Chest */}
      <path 
        d="M80 73 C85 70, 115 70, 120 73 C125 90, 120 110, 100 115 C80 110, 75 90, 80 73 Z" 
        fill={getMuscleColor(['chest', 'pectoralis', 'pecc'])} 
        stroke="#94a3b8" 
        strokeWidth="1.5" 
      />
      {/* Left Shoulder */}
      <path 
        d="M78 73 C70 75, 63 85, 68 95 C72 100, 80 92, 80 82 Z" 
        fill={getMuscleColor(['shoulders', 'deltoid', 'anterior deltoids'])} 
        stroke="#94a3b8" 
        strokeWidth="1.5" 
      />
      {/* Right Shoulder */}
      <path 
        d="M122 73 C130 75, 137 85, 132 95 C128 100, 120 92, 120 82 Z" 
        fill={getMuscleColor(['shoulders', 'deltoid', 'anterior deltoids'])} 
        stroke="#94a3b8" 
        strokeWidth="1.5" 
      />

      {/* Abdominals / Core */}
      <path 
        d="M82 113 L118 113 L114 170 L86 170 Z" 
        fill={getMuscleColor(['core', 'abs', 'abdominals'])} 
        stroke="#94a3b8" 
        strokeWidth="1.5" 
      />

      {/* Left Bicep */}
      <path 
        d="M66 96 C62 105, 58 115, 62 125 C66 127, 71 120, 71 110 Z" 
        fill={getMuscleColor(['biceps', 'bicep'])} 
        stroke="#94a3b8" 
        strokeWidth="1.5" 
      />
      {/* Right Bicep */}
      <path 
        d="M134 96 C138 105, 142 115, 138 125 C134 127, 129 120, 129 110 Z" 
        fill={getMuscleColor(['biceps', 'bicep'])} 
        stroke="#94a3b8" 
        strokeWidth="1.5" 
      />

      {/* Forearms */}
      <path 
        d="M62 126 C57 140, 52 155, 57 165 L64 165 C68 150, 71 138, 70 126 Z" 
        fill={getMuscleColor(['forearms', 'brachioradialis'])} 
        stroke="#94a3b8" 
        strokeWidth="1.5" 
      />
      <path 
        d="M138 126 C143 140, 148 155, 143 165 L136 165 C132 150, 129 138, 130 126 Z" 
        fill={getMuscleColor(['forearms', 'brachioradialis'])} 
        stroke="#94a3b8" 
        strokeWidth="1.5" 
      />

      {/* Left Quad */}
      <path 
        d="M84 172 C78 200, 78 235, 84 260 C90 262, 98 250, 98 215 Z" 
        fill={getMuscleColor(['legs', 'quadriceps', 'quads', 'quad'])} 
        stroke="#94a3b8" 
        strokeWidth="1.5" 
      />
      {/* Right Quad */}
      <path 
        d="M116 172 C122 200, 122 235, 116 260 C110 262, 102 250, 102 215 Z" 
        fill={getMuscleColor(['legs', 'quadriceps', 'quads', 'quad'])} 
        stroke="#94a3b8" 
        strokeWidth="1.5" 
      />

      {/* Hip Flexors / Adductors */}
      <path 
        d="M98 171 L102 171 L102 215 L98 215 Z" 
        fill={getMuscleColor(['hip flexors', 'adductors', 'legs'])} 
        stroke="#94a3b8" 
        strokeWidth="1.5" 
      />

      {/* Calves (Front representation) */}
      <path 
        d="M82 272 C78 290, 78 315, 84 340 L88 340 C90 315, 92 290, 90 272 Z" 
        fill={getMuscleColor(['calves', 'legs'])} 
        stroke="#94a3b8" 
        strokeWidth="1.5" 
      />
      <path 
        d="M118 272 C122 290, 122 315, 116 340 L112 340 C110 315, 108 290, 110 272 Z" 
        fill={getMuscleColor(['calves', 'legs'])} 
        stroke="#94a3b8" 
        strokeWidth="1.5" 
      />
    </svg>
  );

  const renderBack = () => (
    <svg viewBox="0 0 200 400" className="w-full h-full max-h-[300px] select-none" xmlns="http://www.w3.org/2000/svg">
      {/* Head */}
      <circle cx="100" cy="40" r="18" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" />
      {/* Neck */}
      <rect x="94" y="58" width="12" height="15" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" />

      {/* Traps */}
      <path 
        d="M85 70 C92 60, 108 60, 115 70 C120 78, 110 88, 100 92 C90 88, 80 78, 85 70 Z" 
        fill={getMuscleColor(['trapezius', 'traps', 'back'])} 
        stroke="#94a3b8" 
        strokeWidth="1.5" 
      />

      {/* Upper Back / Lats */}
      <path 
        d="M80 88 C85 85, 115 85, 120 88 C126 115, 115 145, 100 152 C85 145, 74 115, 80 88 Z" 
        fill={getMuscleColor(['back', 'latissimus', 'lats', 'rhomboids'])} 
        stroke="#94a3b8" 
        strokeWidth="1.5" 
      />

      {/* Lower Back */}
      <path 
        d="M88 152 C92 148, 108 148, 112 152 L108 175 L92 175 Z" 
        fill={getMuscleColor(['lower back', 'erector spinae', 'back'])} 
        stroke="#94a3b8" 
        strokeWidth="1.5" 
      />

      {/* Rear Deltoids */}
      <path 
        d="M76 85 C70 88, 66 96, 70 102 C74 100, 78 92, 78 88 Z" 
        fill={getMuscleColor(['shoulders', 'rear deltoids', 'delts'])} 
        stroke="#94a3b8" 
        strokeWidth="1.5" 
      />
      <path 
        d="M124 85 C130 88, 134 96, 130 102 C126 100, 122 92, 122 88 Z" 
        fill={getMuscleColor(['shoulders', 'rear deltoids', 'delts'])} 
        stroke="#94a3b8" 
        strokeWidth="1.5" 
      />

      {/* Triceps */}
      <path 
        d="M66 102 C61 112, 59 122, 63 130 L69 122 C70 112, 71 104, 70 102 Z" 
        fill={getMuscleColor(['triceps'])} 
        stroke="#94a3b8" 
        strokeWidth="1.5" 
      />
      <path 
        d="M134 102 C139 112, 141 122, 137 130 L131 122 C130 112, 129 104, 130 102 Z" 
        fill={getMuscleColor(['triceps'])} 
        stroke="#94a3b8" 
        strokeWidth="1.5" 
      />

      {/* Glutes */}
      <path 
        d="M84 176 C76 182, 76 205, 86 215 C92 215, 98 200, 98 178 Z" 
        fill={getMuscleColor(['glutes', 'gluteus maximus', 'gluteus medius', 'legs'])} 
        stroke="#94a3b8" 
        strokeWidth="1.5" 
      />
      <path 
        d="M116 176 C124 182, 124 205, 114 215 C108 215, 102 200, 102 178 Z" 
        fill={getMuscleColor(['glutes', 'gluteus maximus', 'gluteus medius', 'legs'])} 
        stroke="#94a3b8" 
        strokeWidth="1.5" 
      />

      {/* Hamstrings */}
      <path 
        d="M84 216 C78 235, 78 255, 84 270 C90 270, 98 255, 98 220 Z" 
        fill={getMuscleColor(['legs', 'hamstrings'])} 
        stroke="#94a3b8" 
        strokeWidth="1.5" 
      />
      <path 
        d="M116 216 C122 235, 122 255, 116 270 C110 270, 102 255, 102 220 Z" 
        fill={getMuscleColor(['legs', 'hamstrings'])} 
        stroke="#94a3b8" 
        strokeWidth="1.5" 
      />

      {/* Calves */}
      <path 
        d="M82 272 C76 290, 76 315, 84 338 L88 338 C91 315, 91 290, 90 272 Z" 
        fill={getMuscleColor(['calves', 'legs'])} 
        stroke="#94a3b8" 
        strokeWidth="1.5" 
      />
      <path 
        d="M118 272 C124 290, 124 315, 116 338 L112 338 C109 315, 109 290, 110 272 Z" 
        fill={getMuscleColor(['calves', 'legs'])} 
        stroke="#94a3b8" 
        strokeWidth="1.5" 
      />
    </svg>
  );

  return (
    <div className="flex items-center justify-center gap-6 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
      {(view === 'front' || view === 'both') && (
        <div className="flex flex-col items-center">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium mb-1">Front</span>
          <div className="w-[120px] h-[220px] bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center p-2">
            {renderFront()}
          </div>
        </div>
      )}
      {(view === 'back' || view === 'both') && (
        <div className="flex flex-col items-center">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium mb-1">Back</span>
          <div className="w-[120px] h-[220px] bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center p-2">
            {renderBack()}
          </div>
        </div>
      )}
    </div>
  );
};
export default AnatomyDiagram;
