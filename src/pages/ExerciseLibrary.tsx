import React, { useState } from 'react';
import { EXERCISES } from '../constants/exercises';
import type { Exercise } from '../types';
import { AnimatedPage } from '../components/AnimatedPage';
import { Search, Info, AlertTriangle } from 'lucide-react';

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
  const categories = ['Chest', 'Back', 'Legs', 'Shoulders', 'Biceps', 'Triceps'] as const;
  const [selectedCategory, setSelectedCategory] = useState<typeof categories[number]>('Chest');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedCategory, selectedExercise]);

  // Filter exercises by category and search query
  const filteredExercises = EXERCISES.filter(ex => {
    const matchesCategory = ex.category === selectedCategory;
    const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.primaryMuscle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
          <div className="neu-card-inset flex gap-1.5 p-1.5 overflow-x-auto scrollbar-none max-w-full md:max-w-xl">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setSearchQuery('');
                }}
                className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-150 whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'shadow-neu-inset bg-[#d8dce2] text-primary-700'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-[#ebedf0]/50'
                }`}
              >
                {cat}
              </button>
            ))}
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

        {/* Exercises Grid */}
        {filteredExercises.length === 0 ? (
          <div className="text-center py-16 neu-card p-8">
            <p className="text-slate-450 font-medium">No exercises found matching your query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExercises.map((ex) => (
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
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-all duration-300"
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
                      <span className="text-slate-700 font-semibold">{ex.primaryMuscle}</span>
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
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-200/40 flex items-center justify-between text-xs font-bold text-primary-550">
                  <span>View execution steps</span>
                  <Info className="w-4 h-4 text-primary-500" />
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
