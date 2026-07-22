import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { AnimatePresence } from 'framer-motion';
import { EXERCISES } from './constants/exercises';

// Lazy loading pages for improved performance
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ExerciseLibrary = lazy(() => import('./pages/ExerciseLibrary'));
const WorkoutLogger = lazy(() => import('./pages/WorkoutLogger'));
const WeightTracker = lazy(() => import('./pages/WeightTracker'));
const CalendarView = lazy(() => import('./pages/CalendarView'));
const Analytics = lazy(() => import('./pages/Analytics'));
const RecordsPage = lazy(() => import('./pages/RecordsPage').then(m => ({ default: m.RecordsPage })));
const WorkoutHistory = lazy(() => import('./pages/WorkoutHistory').then(m => ({ default: m.WorkoutHistory })));
const MuscleGroupsPage = lazy(() => import('./pages/MuscleGroupsPage').then(m => ({ default: m.MuscleGroupsPage })));
const ExerciseDetailPage = lazy(() => import('./pages/ExerciseDetailPage').then(m => ({ default: m.ExerciseDetailPage })));

const LoadingFallback = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
    <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
    <span className="text-xs font-semibold text-slate-400">Loading your hub...</span>
  </div>
);

function App() {
  useEffect(() => {
    // Preload lazy pages after initial load to make entire app available offline instantly
    const preloadPages = [
      () => import('./pages/Dashboard'),
      () => import('./pages/ExerciseLibrary'),
      () => import('./pages/WorkoutLogger'),
      () => import('./pages/WeightTracker'),
      () => import('./pages/CalendarView'),
      () => import('./pages/Analytics'),
      () => import('./pages/RecordsPage'),
      () => import('./pages/WorkoutHistory'),
      () => import('./pages/MuscleGroupsPage')
    ];

    setTimeout(() => {
      preloadPages.forEach(p => p().catch(() => {}));
    }, 2000);

    // Preload all exercise illustrations to sync into service worker cache
    setTimeout(() => {
      const exerciseImages = EXERCISES.map(ex => ex.image).filter(Boolean);
      exerciseImages.forEach(src => {
        const img = new Image();
        img.src = src;
      });
    }, 4500);
  }, []);

  return (
    <BrowserRouter>
      <Layout>
        <Suspense fallback={<LoadingFallback />}>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/exercises" element={<ExerciseLibrary />} />
              <Route path="/log" element={<WorkoutLogger />} />
              <Route path="/weight" element={<WeightTracker />} />
              <Route path="/calendar" element={<CalendarView />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/records" element={<RecordsPage />} />
              <Route path="/history" element={<WorkoutHistory />} />
              <Route path="/anatomy" element={<MuscleGroupsPage />} />
              <Route path="/exercise/:exerciseId" element={<ExerciseDetailPage />} />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
