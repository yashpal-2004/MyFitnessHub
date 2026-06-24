import React, { useState, useEffect } from 'react';
import { useFitnessStore } from '../store/useFitnessStore';
import { AnimatedPage } from '../components/AnimatedPage';
import { 
  Search, 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Clipboard, 
  Pencil, 
  Trash2,
  Dumbbell
} from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Workout } from '../types';
import { EXERCISES } from '../constants/exercises';
import { WorkoutEditPage } from './WorkoutEditPage';

export const WorkoutHistory: React.FC = () => {
  const { initialize, workouts, deleteWorkout, isLoading } = useFitnessStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const handleDeleteWorkout = async (id: string, name: string) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      await deleteWorkout(id);
    } catch (err: any) {
      alert(`Failed to delete: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  // Filter workouts by name or categories
  const filteredWorkouts = workouts.filter(w => 
    w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (w.categories && w.categories.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  return (
    <AnimatedPage>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="p-2.5 hover:bg-slate-200/50 rounded-full text-slate-500 transition-colors shadow-sm bg-white border border-slate-200/40"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Workout History</h1>
            <p className="text-slate-500 text-sm">Review and manage all your past logged workouts chronologically.</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search workouts by name or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full neu-input-search !pl-10 focus:ring-1 focus:ring-primary-500/20"
          />
        </div>

        {/* Content list */}
        {isLoading && workouts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-semibold text-slate-400">Loading workouts...</span>
          </div>
        ) : filteredWorkouts.length === 0 ? (
          <div className="text-center py-12 neu-card">
            <p className="text-slate-500 text-sm font-medium">
              {searchQuery ? 'No matching workouts found.' : 'No workouts logged yet.'}
            </p>
            {!searchQuery && (
              <Link 
                to="/log" 
                className="inline-flex items-center gap-1.5 text-primary-500 font-semibold text-sm mt-3 hover:underline"
              >
                Log your first workout now
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredWorkouts.map((workout) => (
              <div key={workout.id} className="neu-card p-6">
                <WorkoutHistoryCard
                  workout={workout}
                  deletingId={deletingId}
                  onDelete={handleDeleteWorkout}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </AnimatedPage>
  );
};

interface WorkoutHistoryCardProps {
  workout: Workout;
  deletingId: string | null;
  onDelete: (id: string, name: string) => void;
}

const WorkoutHistoryCard: React.FC<WorkoutHistoryCardProps> = ({ workout, deletingId, onDelete }) => {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <div className="fixed inset-0 bg-[#f0f2f5] z-[60] overflow-y-auto p-4 md:p-8">
        <WorkoutEditPage workout={workout} onClose={() => setEditing(false)} />
      </div>
    );
  }

  const totalVolume = workout.exercises.reduce((t, e) => t + e.sets.reduce((sVol, s) => sVol + (Number(s.weight || 0) * Number(s.reps || 0)), 0), 0);

  const categoryVolumes = workout.exercises.reduce((acc, ex) => {
    const globalEx = EXERCISES.find(e => e.id === ex.exerciseId);
    const category = globalEx ? globalEx.category : 'Other';
    const volume = ex.sets.reduce((sum, s) => sum + (Number(s.weight || 0) * Number(s.reps || 0)), 0);
    acc[category] = (acc[category] || 0) + volume;
    return acc;
  }, {} as Record<string, number>);

  const breakdownString = Object.entries(categoryVolumes)
    .map(([cat, vol]) => `${cat}: ${vol.toLocaleString()} kg`)
    .join(' · ');

  const groupedExercises = workout.exercises.reduce((groups, ex) => {
    const globalEx = EXERCISES.find(e => e.id === ex.exerciseId);
    const category = globalEx ? globalEx.category : 'Other';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(ex);
    return groups;
  }, {} as Record<string, typeof workout.exercises>);

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h4 className="font-extrabold text-slate-800 text-lg">{workout.name}</h4>
          <div className="flex flex-wrap items-center gap-2 mt-1.5">
            <div className="flex items-center gap-1 text-slate-450 text-xs font-bold uppercase">
              <Calendar className="w-3.5 h-3.5" />
              <span>{workout.date}</span>
            </div>
            <span className="text-slate-300">&middot;</span>
            <div className="flex items-center gap-1 text-slate-455 text-xs font-bold uppercase">
              <Clock className="w-3.5 h-3.5" />
              <span>{workout.durationMinutes} min</span>
            </div>
            <span className="text-slate-300">&middot;</span>
            <div className="flex items-center gap-1 text-slate-455 text-xs font-bold uppercase">
              <Dumbbell className="w-3.5 h-3.5" />
              <span>{workout.exercises.length} Exercises</span>
            </div>
            <span className="text-slate-300">&middot;</span>
            <div className="flex items-center gap-1 text-slate-455 text-xs font-bold uppercase" title="Total Volume">
              <span className="text-[10px] font-semibold text-slate-400">Vol:</span>
              <span>{totalVolume.toLocaleString()} kg</span>
            </div>
          </div>
          {breakdownString && (
            <p className="text-[11px] text-slate-500 mt-2 font-semibold">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px] mr-1.5">Volume breakdown:</span>
              {breakdownString}
            </p>
          )}
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => setEditing(true)}
            className="p-2 text-primary-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
            title="Edit workout"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(workout.id, workout.name)}
            disabled={deletingId === workout.id}
            className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all disabled:opacity-50"
            title="Delete workout"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {workout.notes && (
        <p className="text-xs text-slate-500 neu-card-inset p-3.5 flex items-start gap-1.5">
          <Clipboard className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
          <span>{workout.notes}</span>
        </p>
      )}

      <div className="space-y-4 pt-2">
        {Object.entries(groupedExercises).map(([category, exercises]) => (
          <div key={category} className="space-y-2">
            <h5 className="text-[10px] font-black text-primary-600 uppercase tracking-wider bg-primary-50/50 border border-primary-100/50 px-2 py-0.5 rounded-md w-fit">
              {category}
            </h5>
            <div className="space-y-3 pl-3 border-l border-slate-200/60">
              {exercises.map((ex, exIdx) => (
                <div key={exIdx} className="pt-0.5 first:pt-0">
                  <h6 className="font-bold text-xs text-slate-700">{ex.exerciseName}</h6>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {ex.sets.map((set, setIdx) => (
                      <span key={setIdx} className="neu-card-inset text-slate-600 text-[10px] font-semibold px-2.5 py-1 border-none">
                        Set {setIdx + 1}: {set.weight}kg × {set.reps}{set.rpe ? ` (RPE ${set.rpe})` : ''}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
