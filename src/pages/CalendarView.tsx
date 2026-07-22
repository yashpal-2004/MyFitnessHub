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
  Pencil,
  X,
  Activity
} from 'lucide-react';
import type { Workout } from '../types';
import { EXERCISES } from '../constants/exercises';
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
  const adjustedFirstDayIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
  const totalDays = new Date(year, month + 1, 0).getDate();

  const daysArray: (number | null)[] = [];
  for (let i = 0; i < adjustedFirstDayIndex; i++) daysArray.push(null);
  for (let i = 1; i <= totalDays; i++) daysArray.push(i);

  const workoutsByDate = workouts.reduce((map, w) => {
    if (!map[w.date]) map[w.date] = [];
    map[w.date].push(w);
    return map;
  }, {} as Record<string, Workout[]>);

  const todayStr = new Date().toISOString().split('T')[0];

  const monthWorkouts = workouts.filter(w => {
    const d = new Date(w.date);
    return d.getMonth() === month && d.getFullYear() === year;
  });

  const monthWorkoutsCount = monthWorkouts.length;
  const monthExercisesCount = monthWorkouts.reduce((sum, w) => sum + (w.exercises?.length || 0), 0);

  const monthActiveDates = new Set(monthWorkouts.map(w => w.date));
  const activeDaysCount = monthActiveDates.size;

  let missedDaysCount = 0;
  for (let d = 1; d <= totalDays; d++) {
    const dateObj = new Date(year, month, d);
    const yyyy = dateObj.getFullYear();
    const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
    const dd = String(dateObj.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;
    const isSunday = dateObj.getDay() === 0;

    if (dateStr < todayStr && !isSunday && (!workoutsByDate[dateStr] || workoutsByDate[dateStr].length === 0)) {
      missedDaysCount++;
    }
  }

  const getDayClass = (day: number | null, dateStr: string, isSunday: boolean) => {
    if (!day) return 'invisible';
    const isSelected = dateStr === selectedDateStr;
    const hasWorkout = workoutsByDate[dateStr]?.length > 0;

    let cls = 'h-9 w-9 sm:h-11 sm:w-11 rounded-full flex flex-col items-center justify-center font-bold text-xs sm:text-sm transition-all duration-150 relative border ';
    if (isSelected) {
      cls += 'shadow-neu-inset bg-[#d8dce2] text-primary-700 border-slate-300/40 ';
    } else if (hasWorkout) {
      cls += 'bg-[#e0eaf5] text-primary-600 shadow-neu-outset-sm border-white/60 hover:bg-[#d6e3f0] ';
    } else if (isSunday) {
      cls += 'bg-slate-200/40 text-slate-400 border-dashed border-slate-300 hover:bg-slate-200/60 ';
    } else {
      cls += 'text-slate-700 hover:shadow-neu-outset-sm hover:bg-[#ebedf0] border-transparent ';
    }
    return cls;
  };

  const selectedDayWorkouts = workoutsByDate[selectedDateStr] || [];

  return (
    <AnimatedPage>
      <div className="space-y-4 md:space-y-8">
        <div>
          <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Workout Calendar
          </h1>
          <p className="text-slate-500 text-xs md:text-sm font-medium hidden sm:block mt-0.5">
            Review past trainings, frequency logs, and daily details.
          </p>
        </div>

        {/* Top Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
          <div className="neu-card p-3 md:p-5 flex items-center gap-2.5 md:gap-4">
            <div className="p-2 md:p-2.5 shadow-neu-inset bg-[#e8ebf0] text-primary-500 rounded-xl flex-shrink-0">
              <Dumbbell className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[9px] md:text-xs font-semibold text-slate-400 block uppercase tracking-wider truncate">Sessions</span>
              <span className="text-xs md:text-xl font-extrabold text-slate-800 truncate">{monthWorkoutsCount} logged</span>
            </div>
          </div>

          <div className="neu-card p-3 md:p-5 flex items-center gap-2.5 md:gap-4">
            <div className="p-2 md:p-2.5 shadow-neu-inset bg-[#e8ebf0] text-emerald-500 rounded-xl flex-shrink-0">
              <Flame className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[9px] md:text-xs font-semibold text-slate-400 block uppercase tracking-wider truncate">Active Days</span>
              <span className="text-xs md:text-xl font-extrabold text-slate-800 truncate">{activeDaysCount} active</span>
            </div>
          </div>

          <div className="neu-card p-3 md:p-5 flex items-center gap-2.5 md:gap-4">
            <div className="p-2 md:p-2.5 shadow-neu-inset bg-[#e8ebf0] text-rose-500 rounded-xl flex-shrink-0">
              <X className="w-4 h-4 md:w-5 md:h-5 stroke-[2.5]" />
            </div>
            <div className="min-w-0">
              <span className="text-[9px] md:text-xs font-semibold text-slate-400 block uppercase tracking-wider truncate">Missed Days</span>
              <span className="text-xs md:text-xl font-extrabold text-rose-600 truncate">{missedDaysCount} absent</span>
            </div>
          </div>

          <div className="neu-card p-3 md:p-5 flex items-center gap-2.5 md:gap-4">
            <div className="p-2 md:p-2.5 shadow-neu-inset bg-[#e8ebf0] text-orange-500 rounded-xl flex-shrink-0">
              <Activity className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[9px] md:text-xs font-semibold text-slate-400 block uppercase tracking-wider truncate">Total Exercises</span>
              <span className="text-xs md:text-xl font-extrabold text-slate-800 truncate">{monthExercisesCount} completed</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
          {/* Calendar Widget */}
          <div className="lg:col-span-2 glass-card p-4 md:p-6 shadow-neu-outset border border-white/60">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h2 className="font-bold text-slate-800 text-base md:text-lg">
                {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </h2>
              <div className="flex items-center gap-1.5">
                <button onClick={prevMonth} className="skeuo-btn-light p-1.5 md:p-2 rounded-xl text-slate-500">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button onClick={nextMonth} className="skeuo-btn-light p-1.5 md:p-2 rounded-xl text-slate-500">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 text-center gap-1 md:gap-2 mb-1 md:mb-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                <span key={d} className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">{d}</span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1 md:gap-2 text-center">
              {daysArray.map((day, idx) => {
                const dateStr = day
                  ? `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                  : '';
                const todayStr = new Date().toISOString().split('T')[0];
                const dayWorkouts = day ? (workoutsByDate[dateStr] || []) : [];
                const hasWorkout = dayWorkouts.length > 0;
                const totalExercises = dayWorkouts.reduce((sum, w) => sum + (w.exercises?.length || 0), 0);
                const isSunday = idx % 7 === 6;
                const isPastDay = Boolean(dateStr && dateStr < todayStr);
                const isAbsent = isPastDay && !hasWorkout && !isSunday;

                return (
                  <div key={idx} className="flex justify-center items-center">
                    {day ? (
                      <button
                        onClick={() => setSelectedDateStr(dateStr)}
                        className={getDayClass(day, dateStr, isSunday)}
                      >
                        <span className="leading-tight">{day}</span>
                        {isSunday && !hasWorkout && (
                          <span className="text-[7px] leading-[7px] text-slate-400 font-extrabold uppercase mt-0.5 tracking-tighter">REST</span>
                        )}
                        {hasWorkout && (
                          totalExercises === 4 ? (
                            <span className="absolute top-1 right-1 w-2 h-2 bg-primary-500 rounded-full ring-2 ring-white" />
                          ) : totalExercises > 4 ? (
                            <span className="absolute -top-1 -right-1 text-[8px] font-black text-white bg-emerald-500 rounded-full w-4 h-4 flex items-center justify-center shadow-sm ring-2 ring-white">
                              {totalExercises}
                            </span>
                          ) : (
                            <span className="absolute -top-1 -right-1 text-[8px] font-black text-white bg-rose-500 rounded-full w-4 h-4 flex items-center justify-center shadow-sm ring-2 ring-white">
                              {totalExercises}
                            </span>
                          )
                        )}
                        {isAbsent && (
                          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-sm ring-2 ring-white" title="Absent / No Workout">
                            <X className="w-2.5 h-2.5 stroke-[3]" />
                          </span>
                        )}
                      </button>
                    ) : (
                      <div className="h-9 w-9 sm:h-11 sm:w-11" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Calendar Legend */}
            <div className="mt-5 pt-4 border-t border-slate-200/50 flex flex-wrap items-center justify-around gap-2 text-[10px] md:text-xs font-semibold text-slate-500">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-primary-500 rounded-full ring-2 ring-white" />
                <span>4 Exercises (Standard)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[8px] font-black text-white bg-emerald-500 rounded-full w-4 h-4 flex items-center justify-center shadow-sm">5+</span>
                <span>&gt; 4 Exercises (Green)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[8px] font-black text-white bg-rose-500 rounded-full w-4 h-4 flex items-center justify-center shadow-sm">&lt;4</span>
                <span>&lt; 4 Exercises (Red)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-sm">
                  <X className="w-2.5 h-2.5 stroke-[3]" />
                </span>
                <span>Absent (Missed Day)</span>
              </div>
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
          <h4 className="font-extrabold text-slate-800 text-sm">{workout.name}</h4>
          <div className="flex flex-wrap items-center gap-3 text-slate-400 text-[10px] font-bold mt-1 uppercase">
            <span className="flex items-center gap-0.5">
              <Clock className="w-3.5 h-3.5" /> {workout.durationMinutes} min
            </span>
            <span>&middot;</span>
            <span>{workout.exercises.length} Exercises</span>
            <span>&middot;</span>
            <span title="Total Volume">Vol: {totalVolume.toLocaleString()} kg</span>
          </div>
          {breakdownString && (
            <p className="text-[10px] text-slate-500 mt-1.5 font-semibold">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[8px] mr-1">Breakdown:</span>
              {breakdownString}
            </p>
          )}
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

      <div className="space-y-4">
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
                      <span key={setIdx} className="neu-card-inset text-slate-600 text-[10px] font-semibold px-2 py-1 border-none">
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

export default CalendarView;
