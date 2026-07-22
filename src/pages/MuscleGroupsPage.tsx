import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { EXERCISES } from '../constants/exercises';
import { useFitnessStore } from '../store/useFitnessStore';
import { AnimatedPage } from '../components/AnimatedPage';
import { Activity, ChevronRight, ArrowLeft, Info, Flame, ShieldCheck, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { toGymMuscleName } from '../utils/muscleMapper';

const getCategoryFrontImageUrl = (category: string) => {
  const mapping: Record<string, string> = {
    'Chest': '/exercises/muscle-chest.svg',
    'Back': '/exercises/muscle-chest.svg',
    'Legs': '/exercises/muscle-legs.svg',
    'Shoulders': '/exercises/muscle-shoulders.svg',
    'Biceps': '/exercises/muscle-biceps.svg',
    'Triceps': '/exercises/muscle-biceps.svg'
  };
  return mapping[category] || '/exercises/muscle-chest.svg';
};

const getCategoryBackImageUrl = (category: string) => {
  const mapping: Record<string, string> = {
    'Chest': '/exercises/muscle-back.svg',
    'Back': '/exercises/muscle-back.svg',
    'Legs': '/exercises/muscle-back.svg',
    'Shoulders': '/exercises/muscle-back.svg',
    'Biceps': '/exercises/muscle-triceps.svg',
    'Triceps': '/exercises/muscle-triceps.svg'
  };
  return mapping[category] || '/exercises/muscle-back.svg';
};

// Anatomy Coordinates and label Y position mapping for viewBox="0 0 300 530"
const ANATOMY_COORDINATES: Record<string, Record<string, { 
  coords: { 
    x: number; 
    y: number; 
    view: 'front' | 'back' | 'side';
    labelX?: number;
    labelY?: number;
    textAnchor?: 'start' | 'end' | 'middle';
  }[]; 
  labelY: number; 
  dir?: 'in' | 'out'; 
}>> = {
  Chest: {
    'Middle Chest': { coords: [{ x: 122, y: 148, view: 'front' }, { x: 178, y: 148, view: 'front' }], labelY: 150, dir: 'out' },
    'Upper Chest': { coords: [{ x: 128, y: 135, view: 'front' }, { x: 172, y: 135, view: 'front' }], labelY: 100, dir: 'out' },
    'Lower Chest': { coords: [{ x: 122, y: 160, view: 'front' }, { x: 178, y: 160, view: 'front' }], labelY: 200, dir: 'out' }
  },
  Shoulders: {
    'Side Delts': { 
      coords: [
        { x: 74, y: 136, view: 'front', labelX: 40, labelY: 145, textAnchor: 'end' }, 
        { x: 226, y: 136, view: 'front', labelX: 260, labelY: 145, textAnchor: 'start' },
        { x: 74, y: 136, view: 'back', labelX: 40, labelY: 130, textAnchor: 'end' }, 
        { x: 226, y: 136, view: 'back', labelX: 260, labelY: 130, textAnchor: 'start' },
        { x: 141, y: 154, view: 'side', labelX: 85, labelY: 170, textAnchor: 'end' }
      ], 
      labelY: 170, 
      dir: 'out' 
    },
    'Front Delts': { 
      coords: [
        { x: 92, y: 132, view: 'front', labelX: 55, labelY: 105, textAnchor: 'end' }, 
        { x: 208, y: 132, view: 'front', labelX: 245, labelY: 105, textAnchor: 'start' },
        { x: 124, y: 155, view: 'side', labelX: 85, labelY: 120, textAnchor: 'end' }
      ], 
      labelY: 120, 
      dir: 'in' 
    },
    'Rear Delts': { 
      coords: [
        { x: 82, y: 140, view: 'back', labelX: 45, labelY: 165, textAnchor: 'end' }, 
        { x: 218, y: 140, view: 'back', labelX: 255, labelY: 165, textAnchor: 'start' },
        { x: 159, y: 155, view: 'side', labelX: 215, labelY: 120, textAnchor: 'start' }
      ], 
      labelY: 220, 
      dir: 'in' 
    },
    'Traps': { 
      coords: [
        { x: 132, y: 105, view: 'front', labelX: 95, labelY: 80, textAnchor: 'end' }, 
        { x: 168, y: 105, view: 'front', labelX: 205, labelY: 80, textAnchor: 'start' },
        { x: 132, y: 105, view: 'back', labelX: 95, labelY: 80, textAnchor: 'end' }, 
        { x: 168, y: 105, view: 'back', labelX: 205, labelY: 80, textAnchor: 'start' }
      ], 
      labelY: 70, 
      dir: 'out' 
    }
  },
  Biceps: {
    'Biceps': { coords: [{ x: 72, y: 178, view: 'front' }, { x: 228, y: 178, view: 'front' }], labelY: 185, dir: 'out' },
    'Forearms': { coords: [{ x: 62, y: 220, view: 'front' }, { x: 238, y: 220, view: 'front' }], labelY: 250, dir: 'out' }
  },
  Triceps: {
    'Triceps': { coords: [{ x: 72, y: 178, view: 'back' }, { x: 228, y: 178, view: 'back' }], labelY: 185, dir: 'out' }
  },
  Back: {
    'Lats': { coords: [{ x: 115, y: 215, view: 'back' }, { x: 185, y: 215, view: 'back' }], labelY: 215, dir: 'out' },
    'Upper Back': { coords: [{ x: 150, y: 148, view: 'back' }], labelY: 130, dir: 'out' },
    'Lower Back': { coords: [{ x: 150, y: 255, view: 'back' }], labelY: 270, dir: 'out' }
  },
  Legs: {
    'Quads': { coords: [{ x: 120, y: 315, view: 'front' }, { x: 180, y: 315, view: 'front' }], labelY: 295, dir: 'out' },
    'Hamstrings': { coords: [{ x: 122, y: 345, view: 'back' }, { x: 178, y: 345, view: 'back' }], labelY: 385, dir: 'out' },
    'Glutes': { coords: [{ x: 125, y: 275, view: 'back' }, { x: 175, y: 275, view: 'back' }], labelY: 245, dir: 'out' },
    'Calves': { coords: [{ x: 112, y: 425, view: 'back' }, { x: 188, y: 425, view: 'back' }], labelY: 450, dir: 'out' },
    'Inner Thighs': { coords: [{ x: 135, y: 325, view: 'front' }, { x: 165, y: 325, view: 'front' }], labelY: 340, dir: 'in' }
  }
};

const hasCategorySideView = (category: string) => {
  return category === 'Shoulders';
};

const getCategorySideImageUrl = (category: string) => {
  if (category === 'Shoulders') {
    return '/exercises/muscle-shoulders-side.svg';
  }
  return '';
};

export const MuscleGroupsPage: React.FC = () => {
  const navigate = useNavigate();
  const { workouts, initialize } = useFitnessStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  const categories = ['Chest', 'Back', 'Legs', 'Shoulders', 'Biceps', 'Triceps'] as const;
  const [hoveredMuscle, setHoveredMuscle] = useState<{ category: string; muscle: string } | null>(null);
  const [selectedCategoryDetail, setSelectedCategoryDetail] = useState<typeof categories[number] | null>(null);
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly'>('weekly');

  const isMonthly = timeframe === 'monthly';

  // Sets calculation per muscle category based on selected timeframe (7 days vs 30 days)
  const muscleVolume = useMemo(() => {
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - (isMonthly ? 30 : 7));
    const dateThreshold = daysAgo.toISOString().split('T')[0];

    const categorySets: Record<string, number> = {
      Chest: 0,
      Back: 0,
      Legs: 0,
      Shoulders: 0,
      Biceps: 0,
      Triceps: 0,
    };

    workouts.forEach((w) => {
      if (w.date >= dateThreshold) {
        w.exercises.forEach((ex) => {
          const fullEx = EXERCISES.find((e) => e.id === ex.exerciseId);
          if (fullEx && categorySets[fullEx.category] !== undefined) {
            categorySets[fullEx.category] += ex.sets.length;
          }
        });
      }
    });

    return categorySets;
  }, [workouts, isMonthly]);

  const getHypertrophyZone = (sets: number) => {
    const minOpt = isMonthly ? 40 : 10;
    const maxOpt = isMonthly ? 80 : 20;

    if (sets < minOpt) {
      return {
        zone: 'Maintenance Zone',
        badgeBg: 'bg-slate-100 text-slate-700 border-slate-200',
        progressBarBg: 'bg-slate-400',
        textColor: 'text-slate-600',
        icon: Info,
        label: `<${minOpt} sets`,
        maxOpt,
      };
    } else if (sets <= maxOpt) {
      return {
        zone: 'Optimal Hypertrophy',
        badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200 font-bold',
        progressBarBg: 'bg-emerald-500',
        textColor: 'text-emerald-600',
        icon: CheckCircle2,
        label: `${minOpt}–${maxOpt} sets (Optimal)`,
        maxOpt,
      };
    } else {
      return {
        zone: 'Over-Training Risk',
        badgeBg: 'bg-amber-50 text-amber-700 border-amber-200 font-bold',
        progressBarBg: 'bg-amber-500',
        textColor: 'text-amber-600',
        icon: AlertTriangle,
        label: `>${maxOpt} sets (High Fatigue)`,
        maxOpt,
      };
    }
  };

  // Dynamically group targeted muscles by category from the EXERCISES list
  const categoryMuscles = useMemo(() => {
    const mapping: Record<string, Set<string>> = {
      Chest: new Set(),
      Back: new Set(),
      Legs: new Set(),
      Shoulders: new Set(),
      Biceps: new Set(),
      Triceps: new Set()
    };
    
    EXERCISES.forEach(ex => {
      if (mapping[ex.category]) {
        mapping[ex.category].add(toGymMuscleName(ex.primaryMuscle));
      }
    });

    return Object.fromEntries(
      Object.entries(mapping).map(([cat, set]) => [cat, Array.from(set)])
    );
  }, []);

  const handleCategoryClick = (category: typeof categories[number]) => {
    setSelectedCategoryDetail(category);
  };

  const handleMuscleClick = (category: string, muscle: string) => {
    navigate('/exercises', { state: { category, search: muscle } });
  };

  const getCoordinatesData = (category: string, muscle: string) => {
    return ANATOMY_COORDINATES[category]?.[muscle] || { coords: [], labelY: 200, dir: 'out' as const };
  };

  const renderMusclePointers = (view: 'front' | 'back' | 'side', muscles: string[]) => {
    return muscles.flatMap((muscle) => {
      const data = getCoordinatesData(selectedCategoryDetail!, muscle);
      const isHovered = hoveredMuscle?.muscle === muscle;
      const isInnerDir = data.dir === 'in';

      return data.coords
        .filter((c) => c.view === view)
        .map((coord, idx) => {
          const isLeftSide = coord.x < 150;
          const lineEndX = coord.labelX !== undefined ? coord.labelX : (isInnerDir ? (!isLeftSide ? coord.x - 25 : coord.x + 25) : (isLeftSide ? coord.x - 25 : coord.x + 25));
          const lineEndY = coord.labelY !== undefined ? coord.labelY : coord.y - 15;

          let textAnchor: 'start' | 'end' | 'middle' = 'start';
          if (coord.textAnchor) {
            textAnchor = coord.textAnchor;
          } else {
            const pointLeft = coord.labelX !== undefined ? (coord.labelX < coord.x) : (isInnerDir ? !isLeftSide : isLeftSide);
            textAnchor = pointLeft ? 'end' : 'start';
          }
          const textAnchorX = textAnchor === 'end' ? lineEndX - 4 : (textAnchor === 'start' ? lineEndX + 4 : lineEndX);

          return (
            <g key={`${muscle}-${idx}-${view}`} className="transition-all duration-200">
              <line
                x1={coord.x}
                y1={coord.y}
                x2={lineEndX}
                y2={lineEndY}
                stroke={isHovered ? '#f97316' : '#cbd5e1'}
                strokeWidth={isHovered ? 2.5 : 1}
                strokeDasharray={isHovered ? 'none' : '3 3'}
                className="transition-colors duration-150"
              />
              <circle
                cx={coord.x}
                cy={coord.y}
                r={isHovered ? 8 : 4.5}
                fill={isHovered ? '#f97316' : '#94a3b8'}
                stroke="#fff"
                strokeWidth={1.5}
                className="transition-all duration-150"
              />
              <text
                x={textAnchorX}
                y={lineEndY + 3}
                textAnchor={textAnchor}
                fill={isHovered ? '#ea580c' : '#475569'}
                fontSize={9}
                fontWeight={isHovered ? '900' : '700'}
                className="transition-colors duration-150 font-sans tracking-wide uppercase"
              >
                {muscle}
              </text>
            </g>
          );
        });
    });
  };

  if (selectedCategoryDetail) {
    const muscles = categoryMuscles[selectedCategoryDetail] || [];
    
    return (
      <AnimatedPage>
        <div className="space-y-6">
          {/* Back button */}
          <div>
            <button
              onClick={() => setSelectedCategoryDetail(null)}
              className="skeuo-btn-light px-4 py-2.5 text-sm flex items-center gap-1.5 shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Anatomy Map
            </button>
          </div>

          <div className="neu-card p-6 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Detailed labeled body map illustrations */}
              <div className="lg:col-span-7 flex flex-col justify-center">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                  {selectedCategoryDetail} Anatomy Diagram (Front, Side & Back Views)
                </h3>
                <div className={`grid ${hasCategorySideView(selectedCategoryDetail) ? 'grid-cols-3 gap-6' : 'grid-cols-2 gap-6 aspect-[4/3]'} md:h-[550px] neu-card-inset p-4 relative overflow-hidden rounded-2xl bg-white/40`}>
                  {/* Front View */}
                  <div className="flex flex-col items-center justify-center relative h-full w-full border-r border-slate-200/40 px-8">
                    <span className="absolute top-2 left-2 text-[9px] font-black text-slate-400 uppercase tracking-wider bg-slate-100/80 px-2 py-0.5 rounded-md shadow-sm z-10">Front View</span>
                    
                    {/* Centered aspect-ratio wrapper matching the SVG aspect ratio */}
                    <div className="relative w-full max-h-full aspect-[300/530] flex items-center justify-center">
                      <img
                        src={getCategoryFrontImageUrl(selectedCategoryDetail)}
                        alt={`${selectedCategoryDetail} Front Muscle Anatomy`}
                        className="w-full h-full object-contain"
                      />
                      
                      {/* SVG overlay for Front */}
                      <svg 
                        viewBox="0 0 300 530" 
                        className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-visible animate-fade-in"
                      >
                        {renderMusclePointers('front', muscles)}
                      </svg>
                    </div>
                  </div>

                  {/* Side View (Conditional) */}
                  {hasCategorySideView(selectedCategoryDetail) && (
                    <div className="flex flex-col items-center justify-center relative h-full w-full border-r border-slate-200/40 px-8">
                      <span className="absolute top-2 left-2 text-[9px] font-black text-slate-400 uppercase tracking-wider bg-slate-100/80 px-2 py-0.5 rounded-md shadow-sm z-10">Side View</span>
                      
                      <div className="relative w-full max-h-full aspect-[300/530] flex items-center justify-center">
                        <img
                          src={getCategorySideImageUrl(selectedCategoryDetail)}
                          alt={`${selectedCategoryDetail} Side Muscle Anatomy`}
                          className="w-full h-full object-contain"
                        />
                        
                        {/* SVG overlay for Side */}
                        <svg 
                          viewBox="0 0 300 530" 
                          className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-visible animate-fade-in"
                        >
                          {renderMusclePointers('side', muscles)}
                        </svg>
                      </div>
                    </div>
                  )}

                  {/* Back View */}
                  <div className="flex flex-col items-center justify-center relative h-full w-full px-8">
                    <span className="absolute top-2 right-2 text-[9px] font-black text-slate-400 uppercase tracking-wider bg-slate-100/80 px-2 py-0.5 rounded-md shadow-sm z-10">Back View</span>
                    
                    {/* Centered aspect-ratio wrapper matching the SVG aspect ratio */}
                    <div className="relative w-full max-h-full aspect-[300/530] flex items-center justify-center">
                      <img
                        src={getCategoryBackImageUrl(selectedCategoryDetail)}
                        alt={`${selectedCategoryDetail} Back Muscle Anatomy`}
                        className="w-full h-full object-contain"
                      />
                      
                      {/* SVG overlay for Back */}
                      <svg 
                        viewBox="0 0 300 530" 
                        className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-visible animate-fade-in"
                      >
                        {renderMusclePointers('back', muscles)}
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar list of muscles for explore */}
              <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
                <div>
                  <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    {selectedCategoryDetail} Muscles
                  </h2>
                  <p className="text-slate-500 text-sm mt-1.5 font-medium leading-relaxed">
                    Hover over each target muscle to highlight its position on the body map diagram, and click to view exercises targeting it.
                  </p>

                  <div className="mt-8 space-y-3.5">
                    {muscles.map((muscle) => {
                      const isHovered = hoveredMuscle?.muscle === muscle;
                      
                      return (
                        <div
                          key={muscle}
                          onMouseEnter={() => setHoveredMuscle({ category: selectedCategoryDetail, muscle })}
                          onMouseLeave={() => setHoveredMuscle(null)}
                          onClick={() => handleMuscleClick(selectedCategoryDetail, muscle)}
                          className={`p-4 rounded-xl flex items-center justify-between transition-all duration-150 border cursor-pointer ${
                            isHovered
                              ? 'shadow-neu-inset bg-[#e3e6eb] border-orange-400/50 scale-[1.01]'
                              : 'glass-card shadow-neu-outset border-transparent hover:border-slate-300/40'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-2 shadow-neu-inset rounded-lg transition-colors ${
                              isHovered ? 'bg-[#d0d4dc] text-orange-500' : 'bg-[#e8ebf0] text-slate-400'
                            }`}>
                              <Activity className="w-4 h-4" />
                            </div>
                            <span className={`font-bold text-sm ${isHovered ? 'text-slate-800' : 'text-slate-700'}`}>
                              {muscle}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-1.5 text-xs font-bold text-primary-550 opacity-80 group-hover:opacity-100">
                            <span>Explore</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-slate-100/50 border border-slate-200/40 rounded-2xl p-5 mt-6 flex items-start gap-3">
                  <Info className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    Each muscle part above links directly to corresponding exercises like weight logs and volume personal records (PRs) in the Exercise Library.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <div className="space-y-4 sm:space-y-8 pb-24">
        {/* Header */}
        <div className="space-y-0.5">
          <h1 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Muscle Anatomy Map
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm font-medium">
            Explore primary muscle targets, set volume, and hypertrophy zones.
          </p>
        </div>

        {/* Weekly/Monthly Hypertrophy Zones Status Banner */}
        <div className="glass-card p-3 sm:p-5 border border-white/60 shadow-neu-outset space-y-2.5 sm:space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/40 pb-2.5 sm:pb-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2.5 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 shrink-0">
                <Flame className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="font-extrabold text-slate-800 text-xs sm:text-base leading-tight truncate">
                  {isMonthly ? 'Monthly Hypertrophy (30 Days)' : 'Weekly Hypertrophy (7 Days)'}
                </h3>
                <p className="text-slate-400 text-[10px] sm:text-xs font-medium truncate">
                  {isMonthly ? 'Target: 40–80 sets / month' : 'Target: 10–20 sets / week'}
                </p>
              </div>
            </div>

            {/* Timeframe Toggle Buttons & Legend */}
            <div className="flex items-center justify-between sm:justify-end gap-2 flex-wrap">
              <div className="neu-card-inset p-0.5 sm:p-1 flex items-center gap-0.5 sm:gap-1 rounded-xl bg-slate-200/60">
                <button
                  type="button"
                  onClick={() => setTimeframe('weekly')}
                  className={`px-2.5 py-1 text-[10px] sm:text-xs font-bold rounded-lg transition-all ${
                    timeframe === 'weekly'
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Weekly
                </button>
                <button
                  type="button"
                  onClick={() => setTimeframe('monthly')}
                  className={`px-2.5 py-1 text-[10px] sm:text-xs font-bold rounded-lg transition-all ${
                    timeframe === 'monthly'
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Monthly
                </button>
              </div>

              <div className="flex items-center gap-1.5 text-[9px] sm:text-xs font-semibold">
                <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full border border-slate-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" /> Maint. (&lt;{isMonthly ? '40' : '10'})
                </span>
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full border border-emerald-200 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Optimal ({isMonthly ? '40-80' : '10-20'})
                </span>
                <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full border border-amber-200 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> High (&gt;{isMonthly ? '80' : '20'})
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
            {categories.map((cat) => {
              const sets = muscleVolume[cat] || 0;
              const status = getHypertrophyZone(sets);
              const IconComp = status.icon;

              return (
                <div key={cat} className="p-2 sm:p-3 bg-white/60 rounded-xl border border-slate-200/50 space-y-1 neu-card-inset">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-800 text-[11px] sm:text-xs truncate">{cat}</span>
                    <span className={`text-[10px] sm:text-[11px] font-black ${status.textColor} shrink-0`}>{sets} sets</span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full h-1 sm:h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${status.progressBarBg} transition-all duration-300`}
                      style={{ width: `${Math.min(100, (sets / status.maxOpt) * 100)}%` }}
                    />
                  </div>

                  <div className="flex items-center gap-1 min-w-0">
                    <IconComp className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${status.textColor} shrink-0`} />
                    <span className="text-[8px] sm:text-[9px] font-bold truncate text-slate-500">{status.zone}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const muscles = categoryMuscles[cat] || [];
            const setsCount = muscleVolume[cat] || 0;
            const status = getHypertrophyZone(setsCount);
            
            return (
              <div
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className="glass-card p-6 shadow-neu-outset border border-white/60 hover:scale-[1.01] transition-transform duration-150 cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-xl font-extrabold text-slate-800 group-hover:text-primary-500 transition-colors">
                        {cat}
                      </span>
                      <span className="block text-[11px] font-semibold text-slate-400 mt-0.5">
                        {setsCount} sets logged ({isMonthly ? 'last 30 days' : 'last 7 days'})
                      </span>
                    </div>

                    <span className={`inline-flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-full border ${status.badgeBg}`}>
                      {status.zone}
                    </span>
                  </div>

                  {/* Visual Progress Bar for Hypertrophy Goal */}
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mb-4">
                    <div
                      className={`h-full ${status.progressBarBg} transition-all duration-300`}
                      style={{ width: `${Math.min(100, (setsCount / status.maxOpt) * 100)}%` }}
                    />
                  </div>

                  {/* Muscle anatomy illustration */}
                  <div className="h-56 neu-card-inset p-4 flex items-center justify-center mb-6 overflow-hidden rounded-2xl bg-white/40 relative">
                    <img
                      src={getCategoryFrontImageUrl(cat)}
                      alt={`${cat} Muscle Target Map`}
                      className="max-h-full max-w-full object-contain group-hover:scale-[1.03] transition-transform duration-300"
                    />

                    {/* Anatomy highlight locator pulse overlay */}
                    {hoveredMuscle?.category === cat && (
                      <svg 
                        viewBox="0 0 300 530" 
                        className="absolute inset-0 w-full h-full pointer-events-none select-none"
                      >
                        {getCoordinatesData(cat, hoveredMuscle.muscle).coords.map((coord, idx) => (
                          <g key={idx}>
                            {/* Outer pulsing beacon ring */}
                            <circle
                              cx={coord.x}
                              cy={coord.y}
                              r={24}
                              fill="none"
                              stroke="#f97316"
                              strokeWidth={3}
                              className="animate-ping"
                              style={{ transformOrigin: `${coord.x}px ${coord.y}px` }}
                            />
                            {/* Inner locator base circle */}
                            <circle
                              cx={coord.x}
                              cy={coord.y}
                              r={10}
                              fill="#f97316"
                              fillOpacity={0.85}
                              stroke="#fff"
                              strokeWidth={2}
                            />
                            <circle
                              cx={coord.x}
                              cy={coord.y}
                              r={3.5}
                              fill="#fff"
                            />
                          </g>
                        ))}
                      </svg>
                    )}
                  </div>

                  {/* Muscle parts list */}
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                      Target Muscles
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {muscles.map((muscle) => (
                        <button
                          key={muscle}
                          onMouseEnter={() => setHoveredMuscle({ category: cat, muscle })}
                          onMouseLeave={() => setHoveredMuscle(null)}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMuscleClick(cat, muscle);
                          }}
                          className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-200/50 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-100 border border-transparent transition-all"
                        >
                          {muscle}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-200/40 flex items-center justify-between text-xs font-bold text-primary-550">
                  <span>View Details</span>
                  <ChevronRight className="w-4 h-4 text-primary-500 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AnimatedPage>
  );
};

export default MuscleGroupsPage;
