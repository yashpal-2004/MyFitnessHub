import React, { useState } from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { EXERCISES } from '../constants/exercises';
import { useFitnessStore } from '../store/useFitnessStore';
import { AnimatedPage } from '../components/AnimatedPage';
import { toGymMuscleName } from '../utils/muscleMapper';
import { 
  Trash2, 
  Plus, 
  PlusCircle, 
  Save, 
  Search, 
  Dumbbell, 
  Clock, 
  Check
} from 'lucide-react';

interface WorkoutFormInput {
  name: string;
  date: string;
  durationMinutes: number;
  notes?: string;
  categories: string[];
  exercises: {
    exerciseId: string;
    exerciseName: string;
    sets: {
      reps: number;
      weight: number;
      rpe?: number | string;
    }[];
    notes?: string;
  }[];
}

export const WorkoutLogger: React.FC = () => {
  const navigate = useNavigate();
  const { addWorkout, isLoading, workouts, archivedExerciseIds } = useFitnessStore();
  const [exerciseSearch, setExerciseSearch] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedMuscle, setSelectedMuscle] = useState<string>('All');
  const [tempSelectedExercises, setTempSelectedExercises] = useState<{ id: string; name: string }[]>([]);
  const [hideLogged, setHideLogged] = useState(false);

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

  const categories = ['Chest', 'Back', 'Legs', 'Shoulders', 'Biceps', 'Triceps'] as const;

  // Initialize react-hook-form
  const { register, control, handleSubmit, watch, setValue } = useForm<WorkoutFormInput>({
    defaultValues: {
      name: '',
      date: new Date().toISOString().split('T')[0],
      durationMinutes: 45,
      exercises: [],
      categories: [],
    }
  });

  const watchedCategories = watch('categories');
  const watchedDate = watch('date');

  React.useEffect(() => {
    const catsStr = watchedCategories && watchedCategories.length > 0
      ? `${watchedCategories.join(' & ')} Day`
      : 'Workout';
    
    let dateStr = '';
    if (watchedDate) {
      const [year, month, day] = watchedDate.split('-').map(Number);
      if (year && month && day) {
        const dateObj = new Date(year, month - 1, day);
        dateStr = dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
      }
    }
    
    if (!dateStr) {
      dateStr = new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    }

    setValue('name', `${catsStr} - ${dateStr}`);
  }, [watchedCategories, watchedDate, setValue]);

  const { fields: exerciseFields, append: appendExercise, remove: removeExercise } = useFieldArray({
    control,
    name: 'exercises'
  });

  const onSubmit = async (data: WorkoutFormInput) => {
    if (data.exercises.length === 0) {
      alert('Please add at least one exercise to your workout.');
      return;
    }
    
    // Format and add
    const formattedWorkout = {
      name: data.name,
      date: data.date,
      durationMinutes: Number(data.durationMinutes),
      notes: data.notes || '',
      categories: data.categories || [],
      exercises: data.exercises.map(ex => {
        const exerciseLog: any = {
          exerciseId: ex.exerciseId,
          exerciseName: ex.exerciseName,
          sets: ex.sets.map(s => {
            const setObj: any = {
              reps: Number(s.reps),
              weight: Number(s.weight),
            };
            // Omit RPE if empty or undefined to prevent Firebase write failures
            if (s.rpe !== undefined && s.rpe !== null && s.rpe !== '' && !isNaN(Number(s.rpe))) {
              setObj.rpe = Number(s.rpe);
            }
            return setObj;
          })
        };
        if (ex.notes) {
          exerciseLog.notes = ex.notes;
        }
        return exerciseLog;
      })
    };

    try {
      await addWorkout(formattedWorkout);
      navigate('/');
    } catch (err: any) {
      alert(`Failed to save workout to Firebase: ${err.message || err}`);
    }
  };

  // Dynamically compute list of muscles in selectedCategories
  const modalMusclesList = React.useMemo(() => {
    const muscles = new Set<string>();
    EXERCISES.forEach(ex => {
      if (archivedExerciseIds?.includes(ex.id)) return;
      if (hideLogged && exerciseStats[ex.id]?.count > 0) return;
      if (selectedCategories.length === 0 || selectedCategories.includes(ex.category)) {
        muscles.add(toGymMuscleName(ex.primaryMuscle));
      }
    });
    return Array.from(muscles).sort();
  }, [selectedCategories, archivedExerciseIds, hideLogged, exerciseStats]);

  // Compute exercise counts for each muscle in selectedCategories
  const modalMuscleCounts = React.useMemo(() => {
    const counts: Record<string, number> = { All: 0 };
    EXERCISES.forEach(ex => {
      if (archivedExerciseIds?.includes(ex.id)) return;
      if (hideLogged && exerciseStats[ex.id]?.count > 0) return;
      if (selectedCategories.length === 0 || selectedCategories.includes(ex.category)) {
        const gymMuscle = toGymMuscleName(ex.primaryMuscle);
        counts.All = (counts.All || 0) + 1;
        counts[gymMuscle] = (counts[gymMuscle] || 0) + 1;
      }
    });
    return counts;
  }, [selectedCategories, archivedExerciseIds, hideLogged, exerciseStats]);

  // Filter exercises for selector (excluding already added exercises and archived exercises)
  const addedExerciseIds = exerciseFields.map(field => field.exerciseId);

  const categoryCounts = React.useMemo(() => {
    const counts: Record<string, number> = { All: 0 };
    EXERCISES.forEach(ex => {
      const isAdded = addedExerciseIds.includes(ex.id);
      const isArchived = archivedExerciseIds?.includes(ex.id);
      const isLogged = exerciseStats[ex.id]?.count > 0;
      if (!isAdded && !isArchived && !(hideLogged && isLogged)) {
        counts.All = (counts.All || 0) + 1;
        counts[ex.category] = (counts[ex.category] || 0) + 1;
      }
    });
    return counts;
  }, [addedExerciseIds, archivedExerciseIds, hideLogged, exerciseStats]);

  const filteredExercisesList = EXERCISES.filter(ex => {
    const isAdded = addedExerciseIds.includes(ex.id);
    const isArchived = archivedExerciseIds?.includes(ex.id);
    const isLogged = exerciseStats[ex.id]?.count > 0;
    if (hideLogged && isLogged) return false;

    const matchesSearch = ex.name.toLowerCase().includes(exerciseSearch.toLowerCase()) || 
                          toGymMuscleName(ex.primaryMuscle).toLowerCase().includes(exerciseSearch.toLowerCase()) ||
                          ex.category.toLowerCase().includes(exerciseSearch.toLowerCase());
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(ex.category);
    const matchesMuscle = selectedMuscle === 'All' || toGymMuscleName(ex.primaryMuscle) === selectedMuscle;
    return !isAdded && !isArchived && matchesSearch && matchesCategory && matchesMuscle;
  });

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => {
      const next = prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat];
      setSelectedMuscle('All');
      return next;
    });
  };

  const toggleTempExercise = (id: string, name: string) => {
    setTempSelectedExercises(prev => 
      prev.some(x => x.id === id) ? prev.filter(x => x.id !== id) : [...prev, { id, name }]
    );
  };

  return (
    <AnimatedPage>
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Log Workout
          </h1>
          <p className="text-slate-500 mt-1 font-medium">
            Record your sets, reps, and weights to track progress.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Main Info */}
          <div className="neu-card p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Workout Name
                </label>
                <input
                  type="text"
                  {...register('name', { required: true })}
                  className="w-full neu-input focus:ring-1 focus:ring-primary-500/20"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Workout Date
                </label>
                <input
                  type="date"
                  {...register('date', { required: true })}
                  className="w-full neu-input focus:ring-1 focus:ring-primary-500/20"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Duration (min)
                </label>
                <input
                  type="number"
                  {...register('durationMinutes', { required: true, valueAsNumber: true })}
                  className="w-full neu-input focus:ring-1 focus:ring-primary-500/20 text-center"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2 flex items-center gap-1">
                <Dumbbell className="w-3.5 h-3.5 text-slate-400" />
                Target Muscle Categories (Select multiple)
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => {
                  const isChecked = watch('categories')?.includes(cat) || false;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        const current = watch('categories') || [];
                        const next = current.includes(cat)
                          ? current.filter((c) => c !== cat)
                          : [...current, cat];
                        setValue('categories', next);
                      }}
                      className={`text-xs px-3.5 py-2 rounded-xl border font-bold transition-all flex items-center gap-1.5 ${
                        isChecked
                          ? 'bg-primary-500 border-primary-600 text-white shadow-md'
                          : 'bg-[#e8ebf0] border-slate-350/20 text-slate-600 hover:bg-slate-200/50 shadow-sm'
                      }`}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Exercises List */}
          <div className="space-y-6">
            {exerciseFields.map((field, index) => (
              <ExerciseRow
                key={field.id}
                control={control}
                index={index}
                exerciseId={field.exerciseId}
                exerciseName={field.exerciseName}
                onRemove={() => removeExercise(index)}
                register={register}
                setValue={setValue}
              />
            ))}
          </div>

          {/* Add Exercise Trigger Button */}
          <button
            type="button"
            onClick={() => {
              setTempSelectedExercises([]);
              setSelectedCategories(watch('categories') || []);
              setExerciseSearch('');
              setShowSearchModal(true);
            }}
            className="w-full py-4 border-2 border-dashed border-slate-300 rounded-2xl hover:border-primary-500 hover:text-primary-500 transition-all font-semibold text-slate-500 flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-5 h-5" />
            Add Exercise
          </button>

          {/* Submit Action */}
          <div className="pt-4 border-t border-slate-200/60 flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center justify-center gap-2 skeuo-btn-orange text-white px-6 py-3.5 rounded-xl disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {isLoading ? 'Saving...' : 'Finish Workout'}
            </button>
          </div>
        </form>

        {/* Exercise Selector Modal */}
        {showSearchModal && (
          <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="glass-card w-full max-w-lg shadow-2xl relative max-h-[75vh] md:max-h-[85vh] flex flex-col border border-white/60">
              <div className="p-6 border-b border-slate-200/50 flex items-center justify-between">
                <h3 className="font-extrabold text-slate-800 text-lg">Select Exercise</h3>
                <button
                  type="button"
                  onClick={() => setShowSearchModal(false)}
                  className="p-1.5 hover:bg-slate-200/50 rounded-full text-slate-450 transition-colors"
                >
                  &times;
                </button>
              </div>

              <div className="p-4 border-b border-slate-200/30 space-y-4">
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search exercises..."
                    value={exerciseSearch}
                    onChange={(e) => setExerciseSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-250 bg-white/60 focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-450 outline-none transition-all duration-200 text-slate-800 placeholder-slate-400 text-sm shadow-sm"
                  />
                </div>

                <div className="flex items-center justify-between px-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-600 select-none">
                    <input
                      type="checkbox"
                      checked={hideLogged}
                      onChange={(e) => setHideLogged(e.target.checked)}
                      className="rounded border-slate-300 text-primary-500 focus:ring-primary-500/20 w-4 h-4"
                    />
                    Hide logged exercises
                  </label>
                </div>
                
                {/* Category Selection Filter */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block px-1">
                    Filter by Categories
                  </label>
                  <div className="flex flex-row flex-nowrap items-center gap-1.5 overflow-x-auto scrollbar-none py-1 w-full min-w-0">
                    <button
                      type="button"
                      onClick={() => setSelectedCategories([])}
                      className={`text-xs px-3 py-1.5 rounded-xl border font-semibold transition-all duration-150 whitespace-nowrap ${
                        selectedCategories.length === 0
                          ? 'bg-primary-500 border-primary-600 text-white shadow-sm'
                          : 'bg-white/80 border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      All ({categoryCounts.All || 0})
                    </button>
                    {categories.map(cat => {
                      const isSelected = selectedCategories.includes(cat);
                      const count = categoryCounts[cat] || 0;
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => toggleCategory(cat)}
                          className={`text-xs px-3 py-1.5 rounded-xl border font-semibold transition-all duration-150 whitespace-nowrap ${
                            isSelected 
                              ? 'bg-primary-500 border-primary-600 text-white shadow-sm'
                              : 'bg-white/80 border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {cat} ({count})
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Muscle Part Filter */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block px-1">
                    Filter by Muscle Part
                  </label>
                  <div className="flex flex-row flex-nowrap items-center gap-1.5 overflow-x-auto scrollbar-none py-1 w-full min-w-0">
                    <button
                      type="button"
                      onClick={() => setSelectedMuscle('All')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border whitespace-nowrap ${
                        selectedMuscle === 'All'
                          ? 'bg-slate-700 border-slate-800 text-white shadow-sm'
                          : 'bg-white/80 border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      All Muscles <span className="text-[9px] opacity-75 ml-0.5">({modalMuscleCounts.All})</span>
                    </button>
                    {modalMusclesList.map((muscle) => (
                      <button
                        key={muscle}
                        type="button"
                        onClick={() => setSelectedMuscle(muscle)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border whitespace-nowrap ${
                          selectedMuscle === muscle
                            ? 'bg-slate-700 border-slate-800 text-white shadow-sm'
                            : 'bg-white/80 border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {muscle} <span className="text-[9px] opacity-75 ml-0.5">({modalMuscleCounts[muscle] || 0})</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {filteredExercisesList.map((ex) => {
                  const isChecked = tempSelectedExercises.some(x => x.id === ex.id);
                  return (
                    <div
                      key={ex.id}
                      onClick={() => toggleTempExercise(ex.id, ex.name)}
                      className={`w-full text-left px-4 py-3 hover:bg-white rounded-xl border transition-all duration-150 flex items-center justify-between gap-3 cursor-pointer ${
                        isChecked 
                          ? 'bg-primary-50/50 border-primary-200 shadow-sm' 
                          : 'bg-white/40 border-transparent hover:border-slate-200/60 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 flex-1 min-w-0">
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors flex-shrink-0 ${
                          isChecked 
                            ? 'bg-primary-500 border-primary-600 text-white' 
                            : 'border-slate-300 bg-white'
                        }`}>
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        {ex.image ? (
                          <div className="w-12 h-12 rounded-xl bg-white flex-shrink-0 overflow-hidden border border-slate-250/50 flex items-center justify-center p-1">
                            <img
                              src={ex.image}
                              alt={ex.name}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-slate-100 flex-shrink-0 flex items-center justify-center text-slate-400 border border-slate-250/50">
                            <Dumbbell className="w-5 h-5" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <h4 className="font-semibold text-slate-800 text-sm truncate">{ex.name}</h4>
                          <p className="text-xs text-slate-500 mt-0.5 font-medium truncate">
                            {ex.category} &middot; {toGymMuscleName(ex.primaryMuscle)}
                            {exerciseStats[ex.id]?.count > 0 && (
                              <span className="text-primary-600 font-semibold">
                                {` · Logged ${exerciseStats[ex.id].count}x`}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Actions to Add Exercises */}
              <div className="p-4 border-t border-slate-200/45 flex justify-end gap-2 bg-slate-50/50 rounded-b-2xl">
                <button
                  type="button"
                  onClick={() => setShowSearchModal(false)}
                  className="skeuo-btn-light px-4 py-2 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    tempSelectedExercises.forEach(ex => {
                      // Find the most recent workout that has this exercise
                      const sortedWorkouts = [...workouts].sort((a, b) => b.date.localeCompare(a.date));
                      const lastWorkout = sortedWorkouts.find(w => w.exercises.some(e => e.exerciseId === ex.id));
                      const lastLog = lastWorkout?.exercises.find(e => e.exerciseId === ex.id);

                      const defaultSets = lastLog?.sets && lastLog.sets.length > 0
                        ? lastLog.sets.map(s => ({
                            reps: s.reps,
                            weight: s.weight,
                            rpe: (typeof s.rpe === 'number' && !isNaN(s.rpe)) ? s.rpe : 8
                          }))
                        : [{ reps: 10, weight: 20, rpe: 8 }];

                      appendExercise({
                        exerciseId: ex.id,
                        exerciseName: ex.name,
                        sets: defaultSets,
                        notes: ''
                      });
                    });
                    setShowSearchModal(false);
                  }}
                  disabled={tempSelectedExercises.length === 0}
                  className="skeuo-btn-orange px-5 py-2 text-xs text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Selected ({tempSelectedExercises.length})
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AnimatedPage>
  );
};

// Nested Exercise sets list manager
interface ExerciseRowProps {
  control: any;
  index: number;
  exerciseId: string;
  exerciseName: string;
  onRemove: () => void;
  register: any;
  setValue: any;
}

const getComparison = (current: { weight?: number; reps?: number } | undefined, previous: { weight: number; reps: number } | undefined) => {
  if (!current || !previous) return null;
  const curW = Number(current.weight) || 0;
  const curR = Number(current.reps) || 0;
  const prevW = Number(previous.weight) || 0;
  const prevR = Number(previous.reps) || 0;

  if (curW === 0 || curR === 0 || prevW === 0 || prevR === 0) return null;

  if (curW > prevW) {
    const diff = (curW - prevW).toFixed(1).replace(/\.0$/, '');
    return { text: `+${diff} kg`, type: 'improvement' as const };
  } else if (curW < prevW) {
    const diff = (prevW - curW).toFixed(1).replace(/\.0$/, '');
    return { text: `-${diff} kg`, type: 'decrease' as const };
  } else if (curW === prevW && curR > prevR) {
    const diff = curR - prevR;
    return { text: `+${diff} rep${diff > 1 ? 's' : ''}`, type: 'improvement' as const };
  } else if (curW === prevW && curR < prevR) {
    const diff = prevR - curR;
    return { text: `-${diff} rep${diff > 1 ? 's' : ''}`, type: 'decrease' as const };
  } else if (curW * curR > prevW * prevR) {
    return { text: '🔥 Better Vol', type: 'improvement' as const };
  } else if (curW * curR < prevW * prevR) {
    return { text: '📉 Lower Vol', type: 'decrease' as const };
  }
  return null;
};

const ExerciseRow: React.FC<ExerciseRowProps> = ({ control, index, exerciseId, exerciseName, onRemove, register, setValue }) => {
  const { fields: setFields, append: appendSet, remove: removeSet } = useFieldArray({
    control,
    name: `exercises.${index}.sets`
  });
  const { workouts } = useFitnessStore();

  const watchedSets = useWatch({
    control,
    name: `exercises.${index}.sets`
  });

  // Find the most recent workout that has this exercise
  const lastWorkoutWithExercise = React.useMemo(() => {
    const sorted = [...workouts].sort((a, b) => b.date.localeCompare(a.date));
    return sorted.find(w => w.exercises.some(ex => ex.exerciseId === exerciseId));
  }, [workouts, exerciseId]);

  const lastExerciseLog = React.useMemo(() => {
    if (!lastWorkoutWithExercise) return null;
    return lastWorkoutWithExercise.exercises.find(ex => ex.exerciseId === exerciseId);
  }, [lastWorkoutWithExercise, exerciseId]);

  const overallSummary = React.useMemo(() => {
    if (!lastExerciseLog) return null;
    const currentTotalVolume = watchedSets?.reduce((sum: number, s: any) => sum + (Number(s?.weight) || 0) * (Number(s?.reps) || 0), 0) || 0;
    const previousTotalVolume = lastExerciseLog.sets.reduce((sum: number, s: any) => sum + (Number(s?.weight) || 0) * (Number(s?.reps) || 0), 0) || 0;

    const currentMaxWeight = watchedSets?.reduce((max: number, s: any) => Math.max(max, Number(s?.weight) || 0), 0) || 0;
    const previousMaxWeight = lastExerciseLog.sets.reduce((max: number, s: any) => Math.max(max, Number(s?.weight) || 0), 0) || 0;

    const currentTotalReps = watchedSets?.reduce((sum: number, s: any) => sum + (Number(s?.reps) || 0), 0) || 0;
    const previousTotalReps = lastExerciseLog.sets.reduce((sum: number, s: any) => sum + (Number(s?.reps) || 0), 0) || 0;

    if (currentTotalVolume === 0) return null;

    const volDiff = currentTotalVolume - previousTotalVolume;
    const maxWDiff = currentMaxWeight - previousMaxWeight;
    const repsDiff = currentTotalReps - previousTotalReps;

    const formatDiff = (diff: number, unit: string) => {
      if (diff === 0) return { text: `0 ${unit}`, type: 'neutral' as const };
      const sign = diff > 0 ? '+' : '';
      const textVal = diff.toFixed(1).replace(/\.0$/, '');
      return {
        text: `${sign}${textVal} ${unit}`,
        type: diff > 0 ? ('improvement' as const) : ('decrease' as const)
      };
    };

    const formatRepDiff = (diff: number) => {
      if (diff === 0) return { text: `0 reps`, type: 'neutral' as const };
      const sign = diff > 0 ? '+' : '';
      return {
        text: `${sign}${diff} rep${Math.abs(diff) !== 1 ? 's' : ''}`,
        type: diff > 0 ? ('improvement' as const) : ('decrease' as const)
      };
    };

    return {
      volume: {
        current: currentTotalVolume,
        previous: previousTotalVolume,
        diff: formatDiff(volDiff, 'kg')
      },
      maxWeight: {
        current: currentMaxWeight,
        previous: previousMaxWeight,
        diff: formatDiff(maxWDiff, 'kg')
      },
      reps: {
        current: currentTotalReps,
        previous: previousTotalReps,
        diff: formatRepDiff(repsDiff)
      }
    };
  }, [watchedSets, lastExerciseLog]);

  const exerciseDetails = React.useMemo(() => {
    return EXERCISES.find(ex => ex.id === exerciseId);
  }, [exerciseId]);

  const handleCopyLastSets = () => {
    if (!lastExerciseLog) return;
    const mappedSets = lastExerciseLog.sets.map(s => ({
      reps: s.reps,
      weight: s.weight,
      rpe: (typeof s.rpe === 'number' && !isNaN(s.rpe)) ? s.rpe : 8
    }));
    setValue(`exercises.${index}.sets`, mappedSets);
  };

  return (
    <div className="neu-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 shadow-neu-inset bg-[#e8ebf0] text-primary-500 rounded-lg flex-shrink-0">
            <Dumbbell className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-slate-800 text-base">{exerciseName}</h3>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="text-rose-500 hover:bg-rose-50 p-2 rounded-lg transition-all"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {(exerciseDetails?.image || lastExerciseLog) && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
          {/* Image column */}
          {exerciseDetails?.image && (
            <div className={`${lastExerciseLog ? 'md:col-span-4' : 'md:col-span-12'} bg-slate-100/30 rounded-2xl border border-slate-200/30 flex items-center justify-center p-4`}>
              <div className="w-full aspect-square max-w-[150px] bg-white rounded-2xl flex items-center justify-center p-3 border border-slate-200/60 overflow-hidden shadow-neu-inset">
                <img
                  src={exerciseDetails.image}
                  alt={exerciseName}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          )}

          {/* Stats column (Previous sets & Overall Change) */}
          {lastExerciseLog && (
            <div className={`${exerciseDetails?.image ? 'md:col-span-8' : 'md:col-span-12'} p-4 rounded-xl bg-slate-100/60 border border-slate-200/50 flex flex-col justify-between gap-3`}>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    Previous sets ({lastWorkoutWithExercise?.date ? new Date(lastWorkoutWithExercise.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : ''})
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyLastSets}
                    className="text-primary-650 hover:text-primary-750 font-bold text-[10px] hover:underline"
                  >
                    Copy Last Sets
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {lastExerciseLog.sets.map((set, sIdx) => (
                    <div key={sIdx} className="bg-white/80 px-2.5 py-1.5 rounded-lg border border-slate-200 shadow-sm font-semibold text-xs text-slate-700">
                      <span className="text-[10px] text-slate-400 font-bold uppercase mr-1">Set {sIdx + 1}:</span>
                      {set.weight} kg × {set.reps}
                      {set.rpe ? ` (RPE ${set.rpe})` : ''}
                    </div>
                  ))}
                </div>
              </div>

              {overallSummary && (
                <div className="pt-2.5 border-t border-slate-250/50 space-y-1.5">
                  <div className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    Overall Change:
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-white/50 p-2 rounded-lg border border-slate-200/60 flex flex-col items-center">
                      <span className="text-[9px] font-bold text-slate-400 uppercase">Volume</span>
                      <span className="text-xs font-bold text-slate-800">
                        {overallSummary.volume.current.toLocaleString()} kg
                      </span>
                      <span className={`text-[9px] font-extrabold mt-0.5 ${
                        overallSummary.volume.diff.type === 'improvement'
                          ? 'text-emerald-600'
                          : overallSummary.volume.diff.type === 'decrease'
                          ? 'text-rose-600'
                          : 'text-slate-450'
                      }`}>
                        {overallSummary.volume.diff.text}
                      </span>
                    </div>
                    <div className="bg-white/50 p-2 rounded-lg border border-slate-200/60 flex flex-col items-center">
                      <span className="text-[9px] font-bold text-slate-400 uppercase">Max Weight</span>
                      <span className="text-xs font-bold text-slate-800">
                        {overallSummary.maxWeight.current} kg
                      </span>
                      <span className={`text-[9px] font-extrabold mt-0.5 ${
                        overallSummary.maxWeight.diff.type === 'improvement'
                          ? 'text-emerald-600'
                          : overallSummary.maxWeight.diff.type === 'decrease'
                          ? 'text-rose-600'
                          : 'text-slate-450'
                      }`}>
                        {overallSummary.maxWeight.diff.text}
                      </span>
                    </div>
                    <div className="bg-white/50 p-2 rounded-lg border border-slate-200/60 flex flex-col items-center">
                      <span className="text-[9px] font-bold text-slate-400 uppercase">Total Reps</span>
                      <span className="text-xs font-bold text-slate-800">
                        {overallSummary.reps.current}
                      </span>
                      <span className={`text-[9px] font-extrabold mt-0.5 ${
                        overallSummary.reps.diff.type === 'improvement'
                          ? 'text-emerald-600'
                          : overallSummary.reps.diff.type === 'decrease'
                          ? 'text-rose-600'
                          : 'text-slate-450'
                      }`}>
                        {overallSummary.reps.diff.text}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="space-y-2">
        <div className="grid grid-cols-12 gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">
          <span className="col-span-2 text-center">Set</span>
          <span className="col-span-4 text-center">Weight (kg)</span>
          <span className="col-span-4 text-center">Reps</span>
          <span className="col-span-2 text-center">RPE</span>
        </div>

        {setFields.map((setField, setIndex) => {
          const currentSet = watchedSets?.[setIndex];
          const previousSet = lastExerciseLog?.sets?.[setIndex];
          const comparison = getComparison(currentSet, previousSet);

          return (
            <div key={setField.id} className="space-y-1">
              <div className="grid grid-cols-12 gap-2 items-center">
                <span className="col-span-2 text-center text-xs font-bold text-slate-500 shadow-neu-inset bg-[#e3e6eb] py-2 rounded-lg border border-slate-200/50">
                  {setIndex + 1}
                </span>
                <input
                  type="number"
                  step="any"
                  {...register(`exercises.${index}.sets.${setIndex}.weight`, { required: true, valueAsNumber: true })}
                  className="col-span-4 neu-input py-2 text-center text-sm font-semibold focus:ring-1 focus:ring-primary-500/20"
                />
                <input
                  type="number"
                  {...register(`exercises.${index}.sets.${setIndex}.reps`, { required: true, valueAsNumber: true })}
                  className="col-span-4 neu-input py-2 text-center text-sm font-semibold focus:ring-1 focus:ring-primary-500/20"
                />
                <input
                  type="number"
                  placeholder="RPE"
                  {...register(`exercises.${index}.sets.${setIndex}.rpe`, { valueAsNumber: true })}
                  className="col-span-2 neu-input py-2 text-center text-sm font-semibold focus:ring-1 focus:ring-primary-500/20 placeholder:text-slate-350"
                />
              </div>
              {comparison && (
                <div className="flex justify-end px-2">
                  <span className={`text-[9px] font-bold border rounded-md px-1.5 py-0.5 flex items-center gap-0.5 shadow-sm ${
                    comparison.type === 'improvement'
                      ? 'text-emerald-650 bg-emerald-50 border-emerald-250/30 animate-pulse'
                      : 'text-rose-650 bg-rose-50 border-rose-250/30'
                  }`}>
                    {comparison.text}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex gap-2 justify-between pt-2">
        <button
          type="button"
          onClick={() => appendSet({ reps: 10, weight: 20, rpe: 8 })}
          className="skeuo-btn-light text-xs font-semibold px-4 py-2 flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" /> Add Set
        </button>

        {setFields.length > 1 && (
          <button
            type="button"
            onClick={() => removeSet(setFields.length - 1)}
            className="text-xs font-bold text-slate-400 hover:text-rose-500 transition-colors self-center px-2 py-1"
          >
            Remove Last Set
          </button>
        )}
      </div>
    </div>
  );
};
export default WorkoutLogger;
