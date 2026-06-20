import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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

export interface PendingAction {
  id: string;
  type: 'ADD_WORKOUT' | 'EDIT_WORKOUT' | 'DELETE_WORKOUT' | 'ADD_WEIGHT' | 'EDIT_WEIGHT' | 'DELETE_WEIGHT';
  payload: any;
  timestamp: number;
}

interface FitnessState {
  clientId: string;
  workouts: Workout[];
  bodyWeights: BodyWeight[];
  personalRecords: PersonalRecord[];
  isLoading: boolean;
  isInitialLoaded: boolean;
  error: string | null;
  isOnline: boolean;
  syncStatus: 'idle' | 'syncing' | 'error';
  lastSynced: string | null;
  pendingActions: PendingAction[];
  
  initialize: () => Promise<void>;
  addWorkout: (workout: Omit<Workout, 'id' | 'clientId'>) => Promise<void>;
  editWorkout: (id: string, updates: Omit<Workout, 'id' | 'clientId'>) => Promise<void>;
  deleteWorkout: (id: string) => Promise<void>;
  addWeight: (weight: number, date: string, notes?: string) => Promise<void>;
  editWeight: (id: string, weight: number, date: string, notes?: string) => Promise<void>;
  deleteWeight: (id: string) => Promise<void>;
  triggerSync: () => Promise<void>;
  setOnlineStatus: (status: boolean) => void;
}

const getOrCreateClientId = (): string => {
  return 'global_guest_user';
};

export const useFitnessStore = create<FitnessState>()(
  persist(
    (set, get) => ({
      clientId: getOrCreateClientId(),
      workouts: [],
      bodyWeights: [],
      personalRecords: [],
      isLoading: false,
      isInitialLoaded: false,
      error: null,
      isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
      syncStatus: 'idle',
      lastSynced: null,
      pendingActions: [],

      setOnlineStatus: (status) => {
        set({ isOnline: status });
        if (status) {
          get().triggerSync();
        }
      },

      initialize: async () => {
        // Setup listeners
        if (typeof window !== 'undefined' && !(window as any)._fitnessListenersAdded) {
          (window as any)._fitnessListenersAdded = true;
          window.addEventListener('online', () => get().setOnlineStatus(true));
          window.addEventListener('offline', () => get().setOnlineStatus(false));
        }

        if (get().isInitialLoaded && !get().isOnline) return;
        
        set({ isLoading: true, error: null });
        try {
          if (!get().isOnline) {
            set({ isLoading: false, isInitialLoaded: true });
            return;
          }

          const cId = get().clientId;
          
          // Fetch Workouts
          const workoutsRef = collection(db, 'workouts');
          const qWorkouts = query(workoutsRef, where('clientId', '==', cId));
          const querySnapWorkouts = await getDocs(qWorkouts);
          const workouts: Workout[] = [];
          querySnapWorkouts.forEach((doc) => {
            workouts.push({ id: doc.id, ...doc.data() } as Workout);
          });
          workouts.sort((a, b) => b.date.localeCompare(a.date));

          // Fetch Weights
          const weightsRef = collection(db, 'bodyWeights');
          const qWeights = query(weightsRef, where('clientId', '==', cId));
          const querySnapWeights = await getDocs(qWeights);
          const bodyWeights: BodyWeight[] = [];
          querySnapWeights.forEach((doc) => {
            bodyWeights.push({ id: doc.id, ...doc.data() } as BodyWeight);
          });
          bodyWeights.sort((a, b) => b.date.localeCompare(a.date));

          // Fetch Personal Records
          const prsRef = collection(db, 'personalRecords');
          const qPrs = query(prsRef, where('clientId', '==', cId));
          const querySnapPrs = await getDocs(qPrs);
          const personalRecords: PersonalRecord[] = [];
          querySnapPrs.forEach((doc) => {
            personalRecords.push({ id: doc.id, ...doc.data() } as PersonalRecord);
          });

          set({ 
            workouts, 
            bodyWeights, 
            personalRecords, 
            isInitialLoaded: true, 
            isLoading: false,
            lastSynced: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' })
          });
          
          // Trigger sync of any actions queued while offline
          get().triggerSync();
        } catch (err: any) {
          console.error("Initialization error: ", err);
          // Don't fail if we have cached data
          set({ 
            error: get().workouts.length > 0 ? null : (err.message || 'Failed to fetch data'), 
            isLoading: false,
            isInitialLoaded: true 
          });
        }
      },

      addWorkout: async (workoutData) => {
        set({ isLoading: true, error: null });
        const cId = get().clientId;
        const tempId = 'temp_' + Date.now();
        const newWorkout: Workout = { id: tempId, clientId: cId, ...workoutData };

        // Optimistically add to state
        set(state => ({
          workouts: [newWorkout, ...state.workouts],
          isLoading: false
        }));

        // Evaluate Personal Records locally
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

        // Apply PRs locally
        const tempSavedPrs = newPrsToSave.map(pr => ({ id: 'temp_pr_' + Math.random(), ...pr }));
        const updatedPrs = [
          ...currentPrs.filter(p => !newPrsToSave.some(np => np.exerciseId === p.exerciseId && np.type === p.type)),
          ...tempSavedPrs
        ];
        set({ personalRecords: updatedPrs });

        if (!get().isOnline) {
          // Queue action
          const pendingAction: PendingAction = {
            id: 'act_' + Date.now(),
            type: 'ADD_WORKOUT',
            payload: { tempId, workoutData, newPrsToSave },
            timestamp: Date.now()
          };
          set(state => ({ pendingActions: [...state.pendingActions, pendingAction] }));
          return;
        }

        try {
          const fullWorkout = { ...workoutData, clientId: cId };
          const docRef = await addDoc(collection(db, 'workouts'), fullWorkout);
          
          // Replace temp ID with Firestore ID
          set(state => ({
            workouts: state.workouts.map(w => w.id === tempId ? { ...w, id: docRef.id } : w)
          }));

          // Save PRs to Firestore
          const savedPrs: PersonalRecord[] = [];
          for (const pr of newPrsToSave) {
            const existing = currentPrs.find(p => p.exerciseId === pr.exerciseId && p.type === pr.type);
            if (existing) {
              await deleteDoc(doc(db, 'personalRecords', existing.id));
            }
            const prRef = await addDoc(collection(db, 'personalRecords'), pr);
            savedPrs.push({ id: prRef.id, ...pr });
          }

          set({
            personalRecords: [
              ...currentPrs.filter(p => !newPrsToSave.some(np => np.exerciseId === p.exerciseId && np.type === p.type)),
              ...savedPrs
            ]
          });
        } catch (err: any) {
          console.error("Firestore save failed, queuing for offline sync: ", err);
          const pendingAction: PendingAction = {
            id: 'act_' + Date.now(),
            type: 'ADD_WORKOUT',
            payload: { tempId, workoutData, newPrsToSave },
            timestamp: Date.now()
          };
          set(state => ({ pendingActions: [...state.pendingActions, pendingAction] }));
        }
      },

      deleteWorkout: async (id) => {
        // Optimistic delete
        set(state => ({
          workouts: state.workouts.filter(w => w.id !== id),
          isLoading: false
        }));

        if (!get().isOnline || id.startsWith('temp_')) {
          const pendingAction: PendingAction = {
            id: 'act_' + Date.now(),
            type: 'DELETE_WORKOUT',
            payload: { id },
            timestamp: Date.now()
          };
          set(state => ({ pendingActions: [...state.pendingActions, pendingAction] }));
          return;
        }

        try {
          await deleteDoc(doc(db, 'workouts', id));
        } catch (err: any) {
          const pendingAction: PendingAction = {
            id: 'act_' + Date.now(),
            type: 'DELETE_WORKOUT',
            payload: { id },
            timestamp: Date.now()
          };
          set(state => ({ pendingActions: [...state.pendingActions, pendingAction] }));
        }
      },

      editWorkout: async (id, updates) => {
        // Optimistic edit
        set(state => ({
          workouts: state.workouts.map(w => w.id === id ? { ...w, ...updates } : w)
            .sort((a, b) => b.date.localeCompare(a.date)),
          isLoading: false
        }));

        if (!get().isOnline || id.startsWith('temp_')) {
          const pendingAction: PendingAction = {
            id: 'act_' + Date.now(),
            type: 'EDIT_WORKOUT',
            payload: { id, updates },
            timestamp: Date.now()
          };
          set(state => ({ pendingActions: [...state.pendingActions, pendingAction] }));
          return;
        }

        try {
          const cId = get().clientId;
          const docRef = doc(db, 'workouts', id);
          await updateDoc(docRef, { ...updates, clientId: cId });
        } catch (err: any) {
          const pendingAction: PendingAction = {
            id: 'act_' + Date.now(),
            type: 'EDIT_WORKOUT',
            payload: { id, updates },
            timestamp: Date.now()
          };
          set(state => ({ pendingActions: [...state.pendingActions, pendingAction] }));
        }
      },

      addWeight: async (weight, date, notes = '') => {
        const cId = get().clientId;
        const tempId = 'temp_' + Date.now();
        const newWeight: BodyWeight = { id: tempId, clientId: cId, weight, date, notes };

        // Optimistic add
        set(state => ({
          bodyWeights: [newWeight, ...state.bodyWeights].sort((a, b) => b.date.localeCompare(a.date)),
          isLoading: false
        }));

        const weightData = { clientId: cId, weight, date, notes };

        if (!get().isOnline) {
          const pendingAction: PendingAction = {
            id: 'act_' + Date.now(),
            type: 'ADD_WEIGHT',
            payload: { tempId, weightData },
            timestamp: Date.now()
          };
          set(state => ({ pendingActions: [...state.pendingActions, pendingAction] }));
          return;
        }

        try {
          const docRef = await addDoc(collection(db, 'bodyWeights'), weightData);
          set(state => ({
            bodyWeights: state.bodyWeights.map(w => w.id === tempId ? { ...w, id: docRef.id } : w)
          }));
        } catch (err: any) {
          const pendingAction: PendingAction = {
            id: 'act_' + Date.now(),
            type: 'ADD_WEIGHT',
            payload: { tempId, weightData },
            timestamp: Date.now()
          };
          set(state => ({ pendingActions: [...state.pendingActions, pendingAction] }));
        }
      },

      editWeight: async (id, weight, date, notes = '') => {
        // Optimistic edit
        set(state => ({
          bodyWeights: state.bodyWeights.map(w => w.id === id ? { ...w, weight, date, notes } : w)
            .sort((a, b) => b.date.localeCompare(a.date)),
          isLoading: false
        }));

        if (!get().isOnline || id.startsWith('temp_')) {
          const pendingAction: PendingAction = {
            id: 'act_' + Date.now(),
            type: 'EDIT_WEIGHT',
            payload: { id, weight, date, notes },
            timestamp: Date.now()
          };
          set(state => ({ pendingActions: [...state.pendingActions, pendingAction] }));
          return;
        }

        try {
          const docRef = doc(db, 'bodyWeights', id);
          await updateDoc(docRef, { weight, date, notes });
        } catch (err: any) {
          const pendingAction: PendingAction = {
            id: 'act_' + Date.now(),
            type: 'EDIT_WEIGHT',
            payload: { id, weight, date, notes },
            timestamp: Date.now()
          };
          set(state => ({ pendingActions: [...state.pendingActions, pendingAction] }));
        }
      },

      deleteWeight: async (id) => {
        // Optimistic delete
        set(state => ({
          bodyWeights: state.bodyWeights.filter(w => w.id !== id),
          isLoading: false
        }));

        if (!get().isOnline || id.startsWith('temp_')) {
          const pendingAction: PendingAction = {
            id: 'act_' + Date.now(),
            type: 'DELETE_WEIGHT',
            payload: { id },
            timestamp: Date.now()
          };
          set(state => ({ pendingActions: [...state.pendingActions, pendingAction] }));
          return;
        }

        try {
          await deleteDoc(doc(db, 'bodyWeights', id));
        } catch (err: any) {
          const pendingAction: PendingAction = {
            id: 'act_' + Date.now(),
            type: 'DELETE_WEIGHT',
            payload: { id },
            timestamp: Date.now()
          };
          set(state => ({ pendingActions: [...state.pendingActions, pendingAction] }));
        }
      },

      triggerSync: async () => {
        if (!get().isOnline || get().syncStatus === 'syncing') return;
        const actions = get().pendingActions;
        if (actions.length === 0) return;

        set({ syncStatus: 'syncing', error: null });

        const remainingActions = [...actions];
        const idMappings: Record<string, string> = {};

        try {
          while (remainingActions.length > 0) {
            const action = remainingActions[0];
            
            if (action.type === 'ADD_WORKOUT') {
              const { tempId, workoutData, newPrsToSave } = action.payload;
              const fullWorkout = { ...workoutData, clientId: get().clientId };
              const docRef = await addDoc(collection(db, 'workouts'), fullWorkout);
              idMappings[tempId] = docRef.id;

              set(state => ({
                workouts: state.workouts.map(w => w.id === tempId ? { ...w, id: docRef.id } : w)
              }));

              // Save associated PRs
              const savedPrs: PersonalRecord[] = [];
              const currentPrs = get().personalRecords;
              for (const pr of newPrsToSave) {
                const existing = currentPrs.find(p => p.exerciseId === pr.exerciseId && p.type === pr.type);
                if (existing) {
                  await deleteDoc(doc(db, 'personalRecords', existing.id));
                }
                const prRef = await addDoc(collection(db, 'personalRecords'), pr);
                savedPrs.push({ id: prRef.id, ...pr });
              }
              set(state => ({
                personalRecords: [
                  ...state.personalRecords.filter(p => !newPrsToSave.some((np: any) => np.exerciseId === p.exerciseId && np.type === p.type)),
                  ...savedPrs
                ]
              }));
            } 
            else if (action.type === 'EDIT_WORKOUT') {
              const { id, updates } = action.payload;
              const actualId = idMappings[id] || id;
              if (!actualId.startsWith('temp_')) {
                const docRef = doc(db, 'workouts', actualId);
                await updateDoc(docRef, { ...updates, clientId: get().clientId });
              }
            } 
            else if (action.type === 'DELETE_WORKOUT') {
              const { id } = action.payload;
              const actualId = idMappings[id] || id;
              if (!actualId.startsWith('temp_')) {
                await deleteDoc(doc(db, 'workouts', actualId));
              }
            } 
            else if (action.type === 'ADD_WEIGHT') {
              const { tempId, weightData } = action.payload;
              const docRef = await addDoc(collection(db, 'bodyWeights'), weightData);
              idMappings[tempId] = docRef.id;

              set(state => ({
                bodyWeights: state.bodyWeights.map(w => w.id === tempId ? { ...w, id: docRef.id } : w)
              }));
            } 
            else if (action.type === 'EDIT_WEIGHT') {
              const { id, weight, date, notes } = action.payload;
              const actualId = idMappings[id] || id;
              if (!actualId.startsWith('temp_')) {
                const docRef = doc(db, 'bodyWeights', actualId);
                await updateDoc(docRef, { weight, date, notes });
              }
            } 
            else if (action.type === 'DELETE_WEIGHT') {
              const { id } = action.payload;
              const actualId = idMappings[id] || id;
              if (!actualId.startsWith('temp_')) {
                await deleteDoc(doc(db, 'bodyWeights', actualId));
              }
            }

            remainingActions.shift();
            set({ pendingActions: [...remainingActions] });
          }

          set({ 
            syncStatus: 'idle', 
            lastSynced: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            pendingActions: [] 
          });
        } catch (err: any) {
          console.error('Background sync failed:', err);
          set({ syncStatus: 'error', error: err.message || 'Background sync failed' });
        }
      }
    }),
    {
      name: 'myfitnesshub_fitness_store',
      partialize: (state) => ({
        workouts: state.workouts,
        bodyWeights: state.bodyWeights,
        personalRecords: state.personalRecords,
        pendingActions: state.pendingActions,
        lastSynced: state.lastSynced,
      }),
    }
  )
);
