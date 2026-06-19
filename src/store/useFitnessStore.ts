import { create } from 'zustand';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  doc, 
  updateDoc
} from 'firebase/firestore';
import { db } from '../firebase/config';
import type { Workout, BodyWeight, PersonalRecord } from '../types';

interface FitnessState {
  clientId: string;
  workouts: Workout[];
  bodyWeights: BodyWeight[];
  personalRecords: PersonalRecord[];
  isLoading: boolean;
  isInitialLoaded: boolean;
  error: string | null;
  
  initialize: () => Promise<void>;
  addWorkout: (workout: Omit<Workout, 'id' | 'clientId'>) => Promise<void>;
  editWorkout: (id: string, updates: Omit<Workout, 'id' | 'clientId'>) => Promise<void>;
  deleteWorkout: (id: string) => Promise<void>;
  addWeight: (weight: number, date: string, notes?: string) => Promise<void>;
  editWeight: (id: string, weight: number, date: string, notes?: string) => Promise<void>;
  deleteWeight: (id: string) => Promise<void>;
}

// Generate or fetch unique Client ID for guest session partitioning
const getOrCreateClientId = (): string => {
  return 'global_guest_user';
};

export const useFitnessStore = create<FitnessState>((set, get) => ({
  clientId: getOrCreateClientId(),
  workouts: [],
  bodyWeights: [],
  personalRecords: [],
  isLoading: false,
  isInitialLoaded: false,
  error: null,

  initialize: async () => {
    if (get().isInitialLoaded) return;
    set({ isLoading: true, error: null });
    try {
      const cId = get().clientId;
      
      // Fetch Workouts
      const workoutsRef = collection(db, 'workouts');
      const qWorkouts = query(workoutsRef, where('clientId', '==', cId));
      const querySnapWorkouts = await getDocs(qWorkouts);
      const workouts: Workout[] = [];
      querySnapWorkouts.forEach((doc) => {
        workouts.push({ id: doc.id, ...doc.data() } as Workout);
      });
      // Sort locally in memory to avoid needing a Firestore composite index
      workouts.sort((a, b) => b.date.localeCompare(a.date));

      // Fetch Weights
      const weightsRef = collection(db, 'bodyWeights');
      const qWeights = query(weightsRef, where('clientId', '==', cId));
      const querySnapWeights = await getDocs(qWeights);
      const bodyWeights: BodyWeight[] = [];
      querySnapWeights.forEach((doc) => {
        bodyWeights.push({ id: doc.id, ...doc.data() } as BodyWeight);
      });
      // Sort locally in memory to avoid needing a Firestore composite index
      bodyWeights.sort((a, b) => b.date.localeCompare(a.date));

      // Fetch Personal Records
      const prsRef = collection(db, 'personalRecords');
      const qPrs = query(prsRef, where('clientId', '==', cId));
      const querySnapPrs = await getDocs(qPrs);
      const personalRecords: PersonalRecord[] = [];
      querySnapPrs.forEach((doc) => {
        personalRecords.push({ id: doc.id, ...doc.data() } as PersonalRecord);
      });

      set({ workouts, bodyWeights, personalRecords, isInitialLoaded: true, isLoading: false });
    } catch (err: any) {
      console.error("Initialization error: ", err);
      set({ error: err.message || 'Failed to fetch data from Firestore', isLoading: false });
    }
  },

  addWorkout: async (workoutData) => {
    set({ isLoading: true, error: null });
    try {
      const cId = get().clientId;
      const fullWorkout = {
        ...workoutData,
        clientId: cId,
      };

      const docRef = await addDoc(collection(db, 'workouts'), fullWorkout);
      const newWorkout: Workout = { id: docRef.id, ...fullWorkout };

      // Evaluate PRs automatically
      const currentPrs = [...get().personalRecords];
      const newPrsToSave: Omit<PersonalRecord, 'id'>[] = [];

      for (const log of workoutData.exercises) {
        let maxWeight = 0;
        let maxVolume = 0;
        
        for (const setItem of log.sets) {
          if (setItem.weight > maxWeight) maxWeight = setItem.weight;
          const vol = setItem.weight * setItem.reps;
          if (vol > maxVolume) maxVolume = vol;
        }

        // Check Max Weight PR
        const existingWeightPr = currentPrs.find(p => p.exerciseId === log.exerciseId && p.type === 'weight');
        if (!existingWeightPr || maxWeight > existingWeightPr.value) {
          newPrsToSave.push({
            clientId: cId,
            exerciseId: log.exerciseId,
            exerciseName: log.exerciseName,
            value: maxWeight,
            type: 'weight',
            date: workoutData.date
          });
        }

        // Check Max Volume PR
        const existingVolPr = currentPrs.find(p => p.exerciseId === log.exerciseId && p.type === 'volume');
        if (!existingVolPr || maxVolume > existingVolPr.value) {
          newPrsToSave.push({
            clientId: cId,
            exerciseId: log.exerciseId,
            exerciseName: log.exerciseName,
            value: maxVolume,
            type: 'volume',
            date: workoutData.date
          });
        }
      }

      // Save new PRs to Firestore
      const savedPrs: PersonalRecord[] = [];
      for (const pr of newPrsToSave) {
        // Delete older PR of the same type if it exists to maintain only the highest PR
        const existing = currentPrs.find(p => p.exerciseId === pr.exerciseId && p.type === pr.type);
        if (existing) {
          await deleteDoc(doc(db, 'personalRecords', existing.id));
        }

        const prRef = await addDoc(collection(db, 'personalRecords'), pr);
        savedPrs.push({ id: prRef.id, ...pr });
      }

      // Re-fetch Personal Records
      const updatedPrs = [
        ...currentPrs.filter(p => !newPrsToSave.some(np => np.exerciseId === p.exerciseId && np.type === p.type)),
        ...savedPrs
      ];

      set(state => ({
        workouts: [newWorkout, ...state.workouts],
        personalRecords: updatedPrs,
        isLoading: false
      }));
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err; // rethrow to allow UI form to handle it
    }
  },

  deleteWorkout: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await deleteDoc(doc(db, 'workouts', id));
      set(state => ({
        workouts: state.workouts.filter(w => w.id !== id),
        isLoading: false
      }));
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  editWorkout: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const cId = get().clientId;
      const docRef = doc(db, 'workouts', id);
      await updateDoc(docRef, { ...updates, clientId: cId });

      set(state => ({
        workouts: state.workouts.map(w =>
          w.id === id ? { ...w, ...updates } : w
        ).sort((a, b) => b.date.localeCompare(a.date)),
        isLoading: false
      }));
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  addWeight: async (weight, date, notes = '') => {
    set({ isLoading: true, error: null });
    try {
      const cId = get().clientId;
      const weightData = { clientId: cId, weight, date, notes };
      
      const docRef = await addDoc(collection(db, 'bodyWeights'), weightData);
      const newWeight: BodyWeight = { id: docRef.id, ...weightData };

      set(state => ({
        bodyWeights: [newWeight, ...state.bodyWeights].sort((a, b) => b.date.localeCompare(a.date)),
        isLoading: false
      }));
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  editWeight: async (id, weight, date, notes = '') => {
    set({ isLoading: true, error: null });
    try {
      const docRef = doc(db, 'bodyWeights', id);
      await updateDoc(docRef, { weight, date, notes });

      set(state => ({
        bodyWeights: state.bodyWeights.map(w => w.id === id ? { ...w, weight, date, notes } : w)
          .sort((a, b) => b.date.localeCompare(a.date)),
        isLoading: false
      }));
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  deleteWeight: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await deleteDoc(doc(db, 'bodyWeights', id));
      set(state => ({
        bodyWeights: state.bodyWeights.filter(w => w.id !== id),
        isLoading: false
      }));
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },
}));


