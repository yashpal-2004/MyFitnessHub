import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { EXERCISES } from '../constants/exercises';
import type { Exercise } from '../types';
import { AnimatedPage } from '../components/AnimatedPage';
import { Search, Info, AlertTriangle } from 'lucide-react';
import { useFitnessStore } from '../store/useFitnessStore';
import { toGymMuscleName } from '../utils/muscleMapper';

const getMuscleGroupImageUrl = (category: string) => {
  const mapping: Record<string, string> = {
    'Chest': '/exercises/muscle-chest.svg',
    'Back': '/exercises/muscle-back.svg',
    'Legs': '/exercises/muscle-legs.svg',
    'Shoulders': '/exercises/muscle-shoulders.svg',
    'Biceps': '/exercises/muscle-biceps.svg',
    'Triceps': '/exercises/muscle-triceps.svg'
  };
  return mapping[category] || '/exercises/muscle-chest.svg';
};

export const ExerciseLibrary: React.FC = () => {
  const location = useLocation();
  const initialCategory = (location.state as any)?.category || 'Chest';
  const initialSearch = (location.state as any)?.search || '';

  const categories = ['Chest', 'Back', 'Legs', 'Shoulders', 'Biceps', 'Triceps'] as const;
  const [selectedCategory, setSelectedCategory] = useState<typeof categories[number]>(initialCategory);
  const [selectedMuscle, setSelectedMuscle] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  // Sync state with location state
  useEffect(() => {
    if (location.state) {
      const state = location.state as { category?: typeof categories[number]; search?: string };
      if (state.category) {
        setSelectedCategory(state.category);
      }
      if (state.search !== undefined) {
        // If the search matches a gym muscle name, set it as active muscle filter
        const matchedMuscle = Array.from(new Set(EXERCISES.map(ex => toGymMuscleName(ex.primaryMuscle))))
          .find(m => m.toLowerCase() === state.search?.toLowerCase());
        
        if (matchedMuscle) {
          setSelectedMuscle(matchedMuscle);
          setSearchQuery('');
        } else {
          setSearchQuery(state.search);
          setSelectedMuscle('All');
        }
      }
    }
  }, [location.state]);

  const { workouts, personalRecords, initialize } = useFitnessStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  const exerciseStats = React.useMemo(() => {
    const stats: Record<string, { count: number; lastDate: string }> = {};
    const sortedWorkouts = [...workouts].sort((a, b) => a.date.localeCompare(b.date));
    for (const workout of sortedWorkouts) {
      for (const ex of workout.exercises) {
        if (!stats[ex.exerciseId]) {
          stats[ex.exerciseId] = { count: 0, lastDate: '' };
        }
        stats[ex.exerciseId].count += 1;
        stats[ex.exerciseId].lastDate = workout.date;
      }
    }
    return stats;
  }, [workouts]);

  const exercisePrs = React.useMemo(() => {
    const prMap: Record<string, { weight?: typeof personalRecords[0]; volume?: typeof personalRecords[0] }> = {};
    personalRecords.forEach(pr => {
      if (!prMap[pr.exerciseId]) {
        prMap[pr.exerciseId] = {};
      }
      if (pr.type === 'weight') {
        prMap[pr.exerciseId].weight = pr;
      } else if (pr.type === 'volume') {
        prMap[pr.exerciseId].volume = pr;
      }
    });
    return prMap;
  }, [personalRecords]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedCategory, selectedExercise]);

  // Dynamically compute list of muscles in selectedCategory
  const categoryMusclesList = React.useMemo(() => {
    const muscles = new Set<string>();
    EXERCISES.forEach(ex => {
      if (ex.category === selectedCategory) {
        muscles.add(toGymMuscleName(ex.primaryMuscle));
      }
    });
    return Array.from(muscles).sort();
  }, [selectedCategory]);

  // Compute exercise counts for each muscle in selectedCategory
  const muscleCounts = React.useMemo(() => {
    const counts: Record<string, number> = { All: 0 };
    EXERCISES.forEach(ex => {
      if (ex.category === selectedCategory) {
        const gymMuscle = toGymMuscleName(ex.primaryMuscle);
        counts.All = (counts.All || 0) + 1;
        counts[gymMuscle] = (counts[gymMuscle] || 0) + 1;
      }
    });
    return counts;
  }, [selectedCategory]);

  // Filter exercises by category, muscle, and search query
  const filteredExercises = EXERCISES.filter(ex => {
    const gymMuscle = toGymMuscleName(ex.primaryMuscle);
    const matchesCategory = ex.category === selectedCategory;
    const matchesMuscle = selectedMuscle === 'All' || gymMuscle === selectedMuscle;
    const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gymMuscle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesMuscle && matchesSearch;
  });

  // Group filtered exercises by primaryMuscle (using gym-friendly names)
  const groupedFilteredExercises = React.useMemo(() => {
    const groups: Record<string, typeof filteredExercises> = {};
    filteredExercises.forEach(ex => {
      const muscle = toGymMuscleName(ex.primaryMuscle);
      if (!groups[muscle]) {
        groups[muscle] = [];
      }
      groups[muscle].push(ex);
    });
    return groups;
  }, [filteredExercises]);

  const getDifficultyBadgeColor = (difficulty: Exercise['difficulty']) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Intermediate': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Advanced': return 'bg-rose-50 text-rose-700 border-rose-100';
      default: return 'bg-slate-50 text-slate-700';
    }
  };

  if (selectedExercise) {
    return (
      <AnimatedPage>
        <div className="space-y-6">
          {/* Back button */}
          <div>
            <button
              onClick={() => setSelectedExercise(null)}
              className="skeuo-btn-light px-4 py-2.5 text-sm flex items-center gap-1.5 shadow-sm"
            >
              &larr; Back to Library
            </button>
          </div>

          <div className="neu-card p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Exercise Image and Target Muscle */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Exercise Illustration</h3>
                  <div className="aspect-square neu-card-inset overflow-hidden flex items-center justify-center p-4">
                    <img 
                      src={selectedExercise.image} 
                      alt={selectedExercise.name} 
                      className="max-h-full max-w-full object-contain rounded-xl"
                    />
                  </div>
                </div>

                <div className="border-t border-slate-200/40 pt-6">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Muscle Target Group ({selectedExercise.category})</h4>
                  <div className="h-56 neu-card-inset p-4 flex items-center justify-center">
                    <img 
                      src={getMuscleGroupImageUrl(selectedExercise.category)} 
                      alt={`${selectedExercise.category} Muscle Target`} 
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                </div>
              </div>

              {/* Details Content */}
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-bold text-primary-500 uppercase tracking-widest">{selectedExercise.category}</span>
                  <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">{selectedExercise.name}</h2>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="text-xs neu-card-inset px-3 py-1.5 font-semibold border-none">
                      Equipment: {selectedExercise.equipment}
                    </span>
                    <span className={`text-xs px-3 py-1.5 rounded-lg font-semibold border ${getDifficultyBadgeColor(selectedExercise.difficulty)}`}>
                      Difficulty: {selectedExercise.difficulty}
                    </span>
                    {exerciseStats[selectedExercise.id]?.count > 0 && (
                      <>
                        <span className="text-xs px-3 py-1.5 rounded-lg font-semibold bg-primary-50 text-primary-700 border border-primary-100">
                          Logged: {exerciseStats[selectedExercise.id].count}x
                        </span>
                        <span className="text-xs px-3 py-1.5 rounded-lg font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                          Last Done: {exerciseStats[selectedExercise.id].lastDate}
                        </span>
                      </>
                    )}
                    {exercisePrs[selectedExercise.id]?.weight && (
                      <span className="text-xs px-3 py-1.5 rounded-lg font-semibold bg-gradient-to-b from-yellow-400 to-yellow-600 text-white border border-yellow-500/50 flex items-center gap-1 shadow-sm">
                        PR: {exercisePrs[selectedExercise.id].weight.value} kg
                      </span>
                    )}
                    {exercisePrs[selectedExercise.id]?.volume && (
                      <span className="text-xs px-3 py-1.5 rounded-lg font-semibold bg-gradient-to-b from-orange-400 to-orange-600 text-white border border-orange-500/50 flex items-center gap-1 shadow-sm">
                        Vol PR: {exercisePrs[selectedExercise.id].volume.value} vol
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                    Instructions
                  </h4>
                  <ol className="space-y-3 list-decimal list-inside text-sm text-slate-600">
                    {selectedExercise.instructions.map((inst, index) => (
                      <li key={index} className="leading-relaxed pl-1">
                        <span className="font-medium text-slate-700">{inst}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {selectedExercise.commonMistakes && selectedExercise.commonMistakes.length > 0 && (
                  <div className="bg-rose-50/50 border border-rose-100/60 rounded-2xl p-5">
                    <h4 className="text-sm font-bold text-rose-800 mb-2 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4" />
                      Common Mistakes
                    </h4>
                    <ul className="space-y-2 list-disc list-inside text-xs text-rose-700">
                      {selectedExercise.commonMistakes.map((mistake, index) => (
                        <li key={index} className="leading-relaxed pl-1">
                          {mistake}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Exercise Library
          </h1>
          <p className="text-slate-500 mt-1 font-medium">
            Explore workouts, proper forms, and target muscle anatomies.
          </p>
        </div>

        {/* Search and Filter Row */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
          {/* Tabs */}
          <div className="neu-card-inset flex gap-1.5 p-1.5 overflow-x-auto scrollbar-none max-w-full md:max-w-3xl">
            {categories.map((cat) => {
              const total = EXERCISES.filter(ex => ex.category === cat).length;
              const filtered = EXERCISES.filter(ex => 
                ex.category === cat && 
                (ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                 toGymMuscleName(ex.primaryMuscle).toLowerCase().includes(searchQuery.toLowerCase()))
              ).length;

              const countText = searchQuery ? `${filtered}/${total}` : `${total}`;

              return (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setSelectedMuscle('All');
                  }}
                  className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-150 whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'shadow-neu-inset bg-[#d8dce2] text-primary-700'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-[#ebedf0]/50'
                  }`}
                >
                  {cat} <span className="text-xs opacity-60 ml-1">({countText})</span>
                </button>
              );
            })}
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search exercise or muscle..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full neu-input-search focus:ring-1 focus:ring-primary-500/20"
            />
          </div>
        </div>

        {/* Muscle Filter Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1 -mt-4">
          <button
            onClick={() => setSelectedMuscle('All')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
              selectedMuscle === 'All'
                ? 'shadow-neu-inset bg-[#d8dce2] text-slate-850 border-slate-350/50'
                : 'glass-card border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            All Muscles <span className="text-[10px] opacity-60 ml-0.5">({muscleCounts.All})</span>
          </button>
          {categoryMusclesList.map((muscle) => (
            <button
              key={muscle}
              onClick={() => setSelectedMuscle(muscle)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border whitespace-nowrap ${
                selectedMuscle === muscle
                  ? 'shadow-neu-inset bg-[#d8dce2] text-slate-850 border-slate-350/50'
                  : 'glass-card border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {muscle} <span className="text-[10px] opacity-60 ml-0.5">({muscleCounts[muscle] || 0})</span>
            </button>
          ))}
        </div>

        {/* Exercises Grid */}
        {filteredExercises.length === 0 ? (
          <div className="text-center py-16 neu-card p-8">
            <p className="text-slate-450 font-medium">No exercises found matching your query.</p>
          </div>
        ) : (
          <div className="space-y-10">
            {Object.entries(groupedFilteredExercises).map(([muscle, exercises]) => (
              <div key={muscle} className="space-y-4">
                {/* Muscle target sub-heading */}
                <div className="flex items-center gap-3">
                  <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest bg-[#e2e6eb] shadow-neu-inset px-3.5 py-1.5 rounded-xl border border-slate-200/50">
                    {muscle}
                  </h2>
                  <div className="h-[2px] bg-slate-250/30 flex-1 rounded-full shadow-sm" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{exercises.length} {exercises.length === 1 ? 'exercise' : 'exercises'}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {exercises.map((ex) => (
                    <div
                      key={ex.id}
                      onClick={() => setSelectedExercise(ex)}
                      className="neu-card p-5 hover:scale-[1.01] transition-all duration-150 cursor-pointer flex flex-col justify-between group"
                    >
                      <div>
                        {/* Exercise image preview */}
                        <div className="aspect-[4/3] neu-card-inset mb-4 flex items-center justify-center overflow-hidden relative">
                          <img 
                            src={ex.image} 
                            alt={ex.name} 
                            className="w-full h-full object-contain p-2 group-hover:scale-[1.03] transition-all duration-300"
                            loading="lazy"
                          />
                        </div>

                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-bold text-slate-800 group-hover:text-primary-500 transition-colors leading-snug">
                            {ex.name}
                          </h3>
                          <span className={`text-[10px] font-bold px-2 py-1 rounded-md border ${getDifficultyBadgeColor(ex.difficulty)}`}>
                            {ex.difficulty}
                          </span>
                        </div>

                        <div className="mt-4 space-y-1.5 border-t border-slate-200/40 pt-3">
                          <div className="flex items-center gap-1.5 text-xs">
                            <span className="text-slate-400 font-medium w-28">Primary Muscle:</span>
                            <span className="text-slate-700 font-semibold">{toGymMuscleName(ex.primaryMuscle)}</span>
                          </div>
                          {ex.secondaryMuscles.length > 0 && (
                            <div className="flex items-start gap-1.5 text-xs">
                              <span className="text-slate-400 font-medium w-28">Secondary:</span>
                              <span className="text-slate-600 font-medium flex-1">
                                {ex.secondaryMuscles.join(', ')}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center gap-1.5 text-xs">
                            <span className="text-slate-400 font-medium w-28">Equipment:</span>
                            <span className="text-slate-600 font-medium">{ex.equipment}</span>
                          </div>
                          {exerciseStats[ex.id]?.count > 0 && (
                            <>
                              <div className="flex items-center gap-1.5 text-xs">
                                <span className="text-slate-400 font-medium w-28">Logged:</span>
                                <span className="text-primary-600 font-semibold">{exerciseStats[ex.id].count}x</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-xs">
                                <span className="text-slate-400 font-medium w-28">Last Done:</span>
                                <span className="text-primary-600 font-semibold">{exerciseStats[ex.id].lastDate}</span>
                              </div>
                            </>
                          )}
                          {exercisePrs[ex.id]?.weight && (
                            <div className="flex items-center gap-1.5 text-xs">
                              <span className="text-slate-400 font-medium w-28">Best Weight:</span>
                              <span className="text-yellow-600 font-extrabold">{exercisePrs[ex.id].weight.value} kg</span>
                            </div>
                          )}
                          {exercisePrs[ex.id]?.volume && (
                            <div className="flex items-center gap-1.5 text-xs">
                              <span className="text-slate-400 font-medium w-28">Best Volume:</span>
                              <span className="text-orange-600 font-extrabold">{exercisePrs[ex.id].volume.value} vol</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-5 pt-3 border-t border-slate-200/40 flex items-center justify-between text-xs font-bold text-primary-550">
                        <span>View execution steps</span>
                        <Info className="w-4 h-4 text-primary-500" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AnimatedPage>
  );
};
export default ExerciseLibrary;
