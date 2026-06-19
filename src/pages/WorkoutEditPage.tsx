import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useFitnessStore } from '../store/useFitnessStore';
import { AnimatedPage } from '../components/AnimatedPage';
import type { Workout } from '../types';
import { EXERCISES } from '../constants/exercises';
import {
  Trash2,
  Plus,
  PlusCircle,
  Save,
  Search,
  Dumbbell,
  Clock,
  Clipboard,
  X,
  ArrowLeft,
} from 'lucide-react';

interface WorkoutFormInput {
  name: string;
  durationMinutes: number;
  notes?: string;
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

interface WorkoutEditPageProps {
  workout: Workout;
  onClose: () => void;
}

export const WorkoutEditPage: React.FC<WorkoutEditPageProps> = ({ workout, onClose }) => {
  const { editWorkout } = useFitnessStore();
  const [exerciseSearch, setExerciseSearch] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const { register, control, handleSubmit } = useForm<WorkoutFormInput>({
    defaultValues: {
      name: workout.name,
      durationMinutes: workout.durationMinutes,
      notes: workout.notes || '',
      exercises: workout.exercises.map(ex => ({
        exerciseId: ex.exerciseId,
        exerciseName: ex.exerciseName,
        notes: ex.notes || '',
        sets: ex.sets.map(s => ({
          reps: s.reps,
          weight: s.weight,
          rpe: s.rpe ?? '',
        })),
      })),
    },
  });

  const { fields: exerciseFields, append: appendExercise, remove: removeExercise } = useFieldArray({
    control,
    name: 'exercises',
  });

  const filteredExercisesList = EXERCISES.filter(ex =>
    ex.name.toLowerCase().includes(exerciseSearch.toLowerCase()) ||
    ex.category.toLowerCase().includes(exerciseSearch.toLowerCase())
  );

  const handleSelectExercise = (exerciseId: string, exerciseName: string) => {
    appendExercise({ exerciseId, exerciseName, sets: [{ reps: 10, weight: 20, rpe: '' }], notes: '' });
    setShowSearchModal(false);
    setExerciseSearch('');
  };

  const onSubmit = async (data: WorkoutFormInput) => {
    if (data.exercises.length === 0) {
      alert('Please keep at least one exercise.');
      return;
    }
    setSaving(true);
    try {
      const updates = {
        name: data.name,
        date: workout.date,
        durationMinutes: Number(data.durationMinutes),
        notes: data.notes || '',
        clientId: workout.clientId,
        exercises: data.exercises.map(ex => {
          const exerciseLog: any = {
            exerciseId: ex.exerciseId,
            exerciseName: ex.exerciseName,
            sets: ex.sets.map(s => {
              const setObj: any = { reps: Number(s.reps), weight: Number(s.weight) };
              if (s.rpe !== undefined && s.rpe !== null && s.rpe !== '' && !isNaN(Number(s.rpe))) {
                setObj.rpe = Number(s.rpe);
              }
              return setObj;
            }),
          };
          if (ex.notes) exerciseLog.notes = ex.notes;
          return exerciseLog;
        }),
      };
      await editWorkout(workout.id, updates);
      onClose();
    } catch (err: any) {
      alert(`Failed to save: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatedPage>
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="skeuo-btn-light p-2.5 rounded-xl text-slate-500"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Edit Workout
            </h1>
            <p className="text-slate-500 mt-0.5 font-medium text-sm">
              Logged on {workout.date}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Main Info */}
          <div className="neu-card p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
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
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                <Clipboard className="w-3.5 h-3.5 text-slate-400" />
                Notes (Optional)
              </label>
              <textarea
                placeholder="Anything notable about this workout session?"
                {...register('notes')}
                rows={2}
                className="w-full neu-input focus:ring-1 focus:ring-primary-500/20 resize-none"
              />
            </div>
          </div>

          {/* Exercises */}
          <div className="space-y-6">
            {exerciseFields.map((field, index) => (
              <ExerciseRow
                key={field.id}
                control={control}
                index={index}
                exerciseName={field.exerciseName}
                onRemove={() => removeExercise(index)}
                register={register}
              />
            ))}
          </div>

          {/* Add Exercise */}
          <button
            type="button"
            onClick={() => setShowSearchModal(true)}
            className="w-full py-4 border-2 border-dashed border-slate-300 rounded-2xl hover:border-primary-500 hover:text-primary-500 transition-all font-semibold text-slate-500 flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-5 h-5" />
            Add Exercise
          </button>

          {/* Save */}
          <div className="pt-4 border-t border-slate-200/60 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="skeuo-btn-light px-5 py-3 rounded-xl text-slate-600 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 skeuo-btn-orange text-white px-6 py-3 rounded-xl disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>

        {/* Exercise Selector Modal */}
        {showSearchModal && (
          <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="glass-card w-full max-w-lg shadow-2xl relative max-h-[80vh] flex flex-col border border-white/60">
              <div className="p-6 border-b border-slate-200/50 flex items-center justify-between">
                <h3 className="font-extrabold text-slate-800 text-lg">Select Exercise</h3>
                <button
                  type="button"
                  onClick={() => setShowSearchModal(false)}
                  className="p-1.5 hover:bg-slate-200/50 rounded-full text-slate-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4 border-b border-slate-200/30 relative">
                <Search className="absolute left-7 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search exercises..."
                  value={exerciseSearch}
                  onChange={e => setExerciseSearch(e.target.value)}
                  className="w-full neu-input-search focus:ring-1 focus:ring-primary-500/20"
                />
              </div>
              <div className="flex-1 overflow-y-auto divide-y divide-slate-200/30 p-2">
                {filteredExercisesList.map(ex => (
                  <button
                    key={ex.id}
                    type="button"
                    onClick={() => handleSelectExercise(ex.id, ex.name)}
                    className="w-full text-left px-4 py-3 hover:bg-slate-100/50 rounded-xl transition-colors flex items-center justify-between"
                  >
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">{ex.name}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{ex.category} &middot; {ex.primaryMuscle}</p>
                    </div>
                    <Plus className="w-4 h-4 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </AnimatedPage>
  );
};

// Reusable nested sets manager (same pattern as WorkoutLogger)
interface ExerciseRowProps {
  control: any;
  index: number;
  exerciseName: string;
  onRemove: () => void;
  register: any;
}

const ExerciseRow: React.FC<ExerciseRowProps> = ({ control, index, exerciseName, onRemove, register }) => {
  const { fields: setFields, append: appendSet, remove: removeSet } = useFieldArray({
    control,
    name: `exercises.${index}.sets`,
  });

  return (
    <div className="neu-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 shadow-neu-inset bg-[#e8ebf0] text-primary-500 rounded-lg">
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

      <div className="space-y-2">
        <div className="grid grid-cols-12 gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">
          <span className="col-span-2 text-center">Set</span>
          <span className="col-span-4 text-center">Weight (kg)</span>
          <span className="col-span-4 text-center">Reps</span>
          <span className="col-span-2 text-center">RPE</span>
        </div>

        {setFields.map((setField, setIndex) => (
          <div key={setField.id} className="grid grid-cols-12 gap-2 items-center">
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
              placeholder="—"
              {...register(`exercises.${index}.sets.${setIndex}.rpe`)}
              className="col-span-2 neu-input py-2 text-center text-sm font-semibold focus:ring-1 focus:ring-primary-500/20 placeholder:text-slate-350"
            />
          </div>
        ))}
      </div>

      <div className="flex gap-2 justify-between pt-2">
        <button
          type="button"
          onClick={() => appendSet({ reps: 10, weight: 20, rpe: '' })}
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

export default WorkoutEditPage;
