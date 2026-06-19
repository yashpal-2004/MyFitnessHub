import React, { useState, useEffect } from 'react';
import { useFitnessStore } from '../store/useFitnessStore';
import { AnimatedPage } from '../components/AnimatedPage';
import { 
  ChevronLeft, 
  ChevronRight, 
  Dumbbell, 
  Clock, 
  Clipboard, 
  Flame, 
  Calendar as CalendarIcon,
  Trash2,
  Pencil
} from 'lucide-react';
import type { Workout } from '../types';
import { WorkoutEditPage } from './WorkoutEditPage';

export const CalendarView: React.FC = () => {
  const { initialize, workouts, deleteWorkout } = useFitnessStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  useEffect(() => {
    initialize();
  }, [initialize]);

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const daysArray: (number | null)[] = [];
  for (let i = 0; i < firstDayIndex; i++) daysArray.push(null);
  for (let i = 1; i <= totalDays; i++) daysArray.push(i);

  const workoutsByDate = workouts.reduce((map, w) => {
    if (!map[w.date]) map[w.date] = [];
    map[w.date].push(w);
    return map;
  }, {} as Record<string, Workout[]>);

  const monthWorkoutsCount = workouts.filter(w => {
    const d = new Date(w.date);
    return d.getMonth() === month && d.getFullYear() === year;
  }).length;

  const monthActiveDays = Object.keys(workoutsByDate).filter(dateStr => {
    const d = new Date(dateStr);
    return d.getMonth() === month && d.getFullYear() === year;
  }).length;

  const getDayClass = (day: number | null, dateStr: string) => {
    if (!day) return 'invisible';
    const isSelected = dateStr === selectedDateStr;
    const hasWorkout = workoutsByDate[dateStr]?.length > 0;

    let cls = 'h-11 w-11 rounded-full flex flex-col items-center justify-center font-bold text-sm transition-all duration-150 relative border ';
    if (isSelected) {
      cls += 'shadow-neu-inset bg-[#d8dce2] text-primary-700 border-slate-300/40 ';
    } else if (hasWorkout) {
      cls += 'bg-[#e0eaf5] text-primary-600 shadow-neu-outset-sm border-white/60 hover:bg-[#d6e3f0] ';
    } else {
      cls += 'text-slate-700 hover:shadow-neu-outset-sm hover:bg-[#ebedf0] border-transparent ';
    }
    return cls;
  };

  const selectedDayWorkouts = workoutsByDate[selectedDateStr] || [];

  return (
    <AnimatedPage>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Workout Calendar
          </h1>
          <p className="text-slate-500 mt-1 font-medium">
            Review past trainings, frequency logs, and daily details.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="neu-card p-5 flex items-center gap-4">
            <div className="p-3 shadow-neu-inset bg-[#e8ebf0] text-primary-500 rounded-xl">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">Workouts (This Month)</span>
              <span className="text-xl font-extrabold text-slate-800">{monthWorkoutsCount} sessions</span>
            </div>
          </div>

          <div className="neu-card p-5 flex items-center gap-4">
            <div className="p-3 shadow-neu-inset bg-[#e8ebf0] text-orange-500 rounded-xl">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">Active Training Days</span>
              <span className="text-xl font-extrabold text-slate-800">{monthActiveDays} active / {totalDays - monthActiveDays} rest</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar Widget */}
          <div className="lg:col-span-2 glass-card p-6 shadow-neu-outset border border-white/60">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-slate-800 text-lg">
                {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </h2>
              <div className="flex items-center gap-1.5">
                <button onClick={prevMonth} className="skeuo-btn-light p-2 rounded-xl text-slate-500">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button onClick={nextMonth} className="skeuo-btn-light p-2 rounded-xl text-slate-500">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 text-center gap-2 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <span key={d} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{d}</span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2 text-center">
              {daysArray.map((day, idx) => {
                const dateStr = day
                  ? `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                  : '';
                const hasWorkout = day ? workoutsByDate[dateStr]?.length > 0 : false;

                return (
                  <div key={idx} className="flex justify-center items-center">
                    {day ? (
                      <button
                        onClick={() => setSelectedDateStr(dateStr)}
                        className={getDayClass(day, dateStr)}
                      >
                        {day}
                        {hasWorkout && dateStr !== selectedDateStr && (
                          <span className="absolute bottom-1 w-1.5 h-1.5 bg-primary-500 rounded-full" />
                        )}
                      </button>
                    ) : (
                      <div className="h-11 w-11" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detail Panel */}
          <div className="neu-card p-6 h-fit">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-200/50 pb-3">
              <CalendarIcon className="w-5 h-5 text-primary-500" />
              <h3 className="font-bold text-slate-800 text-sm">
                Details for {selectedDateStr}
              </h3>
            </div>

            {selectedDayWorkouts.length === 0 ? (
              <div className="text-center py-10 text-slate-450 text-xs font-medium">
                <p>No workouts logged for this day.</p>
                <p className="mt-1">Enjoy your rest and recovery!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {selectedDayWorkouts.map((workout) => (
                  <WorkoutDetailCard
                    key={workout.id}
                    workout={workout}
                    deletingId={deletingId}
                    onDelete={handleDeleteWorkout}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

// ---- Workout Detail Card with inline Edit toggle ----
interface WorkoutDetailCardProps {
  workout: Workout;
  deletingId: string | null;
  onDelete: (id: string, name: string) => void;
}

const WorkoutDetailCard: React.FC<WorkoutDetailCardProps> = ({ workout, deletingId, onDelete }) => {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <div className="fixed inset-0 bg-[#f0f2f5] z-40 overflow-y-auto p-4 md:p-8">
        <WorkoutEditPage workout={workout} onClose={() => setEditing(false)} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h4 className="font-extrabold text-slate-800 text-sm">{workout.name}</h4>
          <div className="flex items-center gap-3 text-slate-400 text-[10px] font-bold mt-1 uppercase">
            <span className="flex items-center gap-0.5">
              <Clock className="w-3.5 h-3.5" /> {workout.durationMinutes} min
            </span>
            <span>&middot;</span>
            <span>{workout.exercises.length} Exercises</span>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => setEditing(true)}
            className="p-1.5 text-primary-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
            title="Edit workout"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(workout.id, workout.name)}
            disabled={deletingId === workout.id}
            className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all disabled:opacity-50"
            title="Delete workout"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {workout.notes && (
        <p className="text-xs text-slate-500 neu-card-inset p-3 flex items-start gap-1">
          <Clipboard className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
          <span>{workout.notes}</span>
        </p>
      )}

      <div className="space-y-3">
        {workout.exercises.map((ex, exIdx) => (
          <div key={exIdx} className="border-t border-slate-200/40 pt-2.5">
            <h5 className="font-bold text-xs text-slate-700">{ex.exerciseName}</h5>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {ex.sets.map((set, setIdx) => (
                <span key={setIdx} className="neu-card-inset text-slate-600 text-[10px] font-semibold px-2 py-1 border-none">
                  Set {setIdx + 1}: {set.weight}kg × {set.reps}{set.rpe ? ` (RPE ${set.rpe})` : ''}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarView;
