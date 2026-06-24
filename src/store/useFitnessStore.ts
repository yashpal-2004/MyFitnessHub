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
  archivedExerciseIds: string[];
  
  initialize: () => Promise<void>;
  addWorkout: (workout: Omit<Workout, 'id' | 'clientId'>) => Promise<void>;
  editWorkout: (id: string, updates: Omit<Workout, 'id' | 'clientId'>) => Promise<void>;
  deleteWorkout: (id: string) => Promise<void>;
  addWeight: (weight: number, date: string, notes?: string) => Promise<void>;
  editWeight: (id: string, weight: number, date: string, notes?: string) => Promise<void>;
  deleteWeight: (id: string) => Promise<void>;
  triggerSync: () => Promise<void>;
  setOnlineStatus: (status: boolean) => void;
  syncPrsToFirestore: (newPrs: Omit<PersonalRecord, 'id'>[]) => Promise<void>;
  toggleArchiveExercise: (id: string) => void;
}

const computePersonalRecords = (workouts: Workout[], clientId: string): Omit<PersonalRecord, 'id'>[] => {
  const prs: Record<string, { weight?: Omit<PersonalRecord, 'id'>; volume?: Omit<PersonalRecord, 'id'> }> = {};
  const sorted = [...workouts].sort((a, b) => a.date.localeCompare(b.date));

  for (const workout of sorted) {
    for (const log of workout.exercises) {
      let maxWeight = 0;
      let maxVolume = 0;

      for (const setItem of log.sets) {
        if (setItem.weight > maxWeight) maxWeight = setItem.weight;
        const vol = setItem.weight * setItem.reps;
        if (vol > maxVolume) maxVolume = vol;
      }

      if (!prs[log.exerciseId]) {
        prs[log.exerciseId] = {};
      }

      const currentWeightPr = prs[log.exerciseId].weight;
      if (!currentWeightPr || maxWeight > currentWeightPr.value) {
        prs[log.exerciseId].weight = {
          clientId,
          exerciseId: log.exerciseId,
          exerciseName: log.exerciseName,
          value: maxWeight,
          type: 'weight',
          date: workout.date
        };
      }

      const currentVolumePr = prs[log.exerciseId].volume;
      if (!currentVolumePr || maxVolume > currentVolumePr.value) {
        prs[log.exerciseId].volume = {
          clientId,
          exerciseId: log.exerciseId,
          exerciseName: log.exerciseName,
          value: maxVolume,
          type: 'volume',
          date: workout.date
        };
      }
    }
  }

  const result: Omit<PersonalRecord, 'id'>[] = [];
  for (const exId of Object.keys(prs)) {
    const item = prs[exId];
    if (item.weight && item.weight.value > 0) result.push(item.weight);
    if (item.volume && item.volume.value > 0) result.push(item.volume);
  }
  return result;
};

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
      archivedExerciseIds: [],

      toggleArchiveExercise: (id) => {
        set((state) => ({
          archivedExerciseIds: state.archivedExerciseIds.includes(id)
            ? state.archivedExerciseIds.filter(x => x !== id)
            : [...state.archivedExerciseIds, id]
        }));
      },

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

          // Recalculate personal records to detect and clean up any orphaned/incorrect past DB records
          const computedPrs = computePersonalRecords(workouts, cId);

          set({ 
            workouts, 
            bodyWeights, 
            personalRecords: computedPrs.map(pr => {
              // Try to preserve existing Firestore ID if it matches
              const existing = personalRecords.find(p => p.exerciseId === pr.exerciseId && p.type === pr.type && p.value === pr.value && p.date === pr.date);
              return existing ? existing : { id: 'temp_pr_' + Math.random(), ...pr };
            }), 
            isInitialLoaded: true, 
            isLoading: false,
            lastSynced: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' })
          });

          // Sync computed PRs back to Firestore in case there were orphaned entries
          await get().syncPrsToFirestore(computedPrs);
          
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

        const updatedWorkouts = [newWorkout, ...get().workouts];
        const newPrs = computePersonalRecords(updatedWorkouts, cId);

        // Optimistically add to state
        set({
          workouts: updatedWorkouts,
          personalRecords: newPrs.map(pr => ({ id: 'temp_pr_' + Math.random(), ...pr })),
          isLoading: false
        });

        if (!get().isOnline) {
          // Queue action
          const pendingAction: PendingAction = {
            id: 'act_' + Date.now(),
            type: 'ADD_WORKOUT',
            payload: { tempId, workoutData, newPrsToSave: newPrs },
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

          // Sync PRs to Firestore
          await get().syncPrsToFirestore(newPrs);
        } catch (err: any) {
          console.error("Firestore save failed, queuing for offline sync: ", err);
          const pendingAction: PendingAction = {
            id: 'act_' + Date.now(),
            type: 'ADD_WORKOUT',
            payload: { tempId, workoutData, newPrsToSave: newPrs },
            timestamp: Date.now()
          };
          set(state => ({ pendingActions: [...state.pendingActions, pendingAction] }));
        }
      },

      deleteWorkout: async (id) => {
        set({ isLoading: true, error: null });
        const cId = get().clientId;
        const remainingWorkouts = get().workouts.filter(w => w.id !== id);
        const newPrs = computePersonalRecords(remainingWorkouts, cId);

        // Optimistic delete
        set({
          workouts: remainingWorkouts,
          personalRecords: newPrs.map(pr => ({ id: 'temp_pr_' + Math.random(), ...pr })),
          isLoading: false
        });

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
          await get().syncPrsToFirestore(newPrs);
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
        set({ isLoading: true, error: null });
        const cId = get().clientId;
        const updatedWorkouts = get().workouts.map(w => w.id === id ? { ...w, ...updates } : w)
          .sort((a, b) => b.date.localeCompare(a.date));
        const newPrs = computePersonalRecords(updatedWorkouts, cId);

        // Optimistic edit
        set({
          workouts: updatedWorkouts,
          personalRecords: newPrs.map(pr => ({ id: 'temp_pr_' + Math.random(), ...pr })),
          isLoading: false
        });

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
          const docRef = doc(db, 'workouts', id);
          await updateDoc(docRef, { ...updates, clientId: cId });
          await get().syncPrsToFirestore(newPrs);
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

      syncPrsToFirestore: async (newPrs) => {
        if (!get().isOnline) return;
        try {
          const cId = get().clientId;
          const prsRef = collection(db, 'personalRecords');
          const qPrs = query(prsRef, where('clientId', '==', cId));
          const querySnap = await getDocs(qPrs);
          
          const existingPrs: PersonalRecord[] = [];
          querySnap.forEach((docSnap) => {
            existingPrs.push({ id: docSnap.id, ...docSnap.data() } as PersonalRecord);
          });
          
          const toDelete: PersonalRecord[] = [];
          const matchedIds = new Set<string>();
          
          for (const existing of existingPrs) {
            const matchIndex = newPrs.findIndex((np) => 
              !matchedIds.has(`${np.exerciseId}_${np.type}_${np.value}_${np.date}`) &&
              np.exerciseId === existing.exerciseId &&
              np.type === existing.type &&
              np.value === existing.value &&
              np.date === existing.date
            );
            
            if (matchIndex !== -1) {
              matchedIds.add(`${newPrs[matchIndex].exerciseId}_${newPrs[matchIndex].type}_${newPrs[matchIndex].value}_${newPrs[matchIndex].date}`);
            } else {
              toDelete.push(existing);
            }
          }
          
          const toAdd = newPrs.filter(np => 
            !existingPrs.some(existing => 
              np.exerciseId === existing.exerciseId && 
              np.type === existing.type && 
              np.value === existing.value && 
              np.date === existing.date
            )
          );
          
          await Promise.all(toDelete.map(pr => deleteDoc(doc(db, 'personalRecords', pr.id))));
          
          const addedPrs: PersonalRecord[] = [];
          for (const pr of toAdd) {
            const docRef = await addDoc(collection(db, 'personalRecords'), pr);
            addedPrs.push({ id: docRef.id, ...pr });
          }
          
          const keptPrs = existingPrs.filter(existing => 
            !toDelete.some(td => td.id === existing.id)
          );
          
          set({ personalRecords: [...keptPrs, ...addedPrs] });
        } catch (err) {
          console.error("Failed to sync PRs to Firestore:", err);
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

          const finalPrs = computePersonalRecords(get().workouts, get().clientId);
          await get().syncPrsToFirestore(finalPrs);

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
        archivedExerciseIds: state.archivedExerciseIds,
      }),
    }
  )
);
