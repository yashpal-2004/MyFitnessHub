export interface Exercise {
  id: string;
  name: string;
  category: 'Chest' | 'Triceps' | 'Biceps' | 'Shoulders' | 'Back' | 'Legs';
  primaryMuscle: string;
  secondaryMuscles: string[];
  equipment: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  instructions: string[];
  commonMistakes: string[];
  image: string;
}

export interface SetLog {
  reps: number;
  weight: number;
  rpe?: number;
}

export interface ExerciseLog {
  exerciseId: string;
  exerciseName: string;
  sets: SetLog[];
  notes?: string;
}

export interface Workout {
  id: string;
  clientId: string;
  name: string;
  date: string; // ISO String or YYYY-MM-DD
  durationMinutes: number;
  exercises: ExerciseLog[];
  notes?: string;
}

export interface BodyWeight {
  id: string;
  clientId: string;
  weight: number;
  date: string; // YYYY-MM-DD
  notes?: string;
}

export interface PersonalRecord {
  id: string;
  clientId: string;
  exerciseId: string;
  exerciseName: string;
  value: number; // Max weight or volume
  type: 'weight' | 'volume';
  date: string;
}
