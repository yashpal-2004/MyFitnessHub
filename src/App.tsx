import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { AnimatePresence } from 'framer-motion';

// Lazy loading pages for improved performance
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ExerciseLibrary = lazy(() => import('./pages/ExerciseLibrary'));
const WorkoutLogger = lazy(() => import('./pages/WorkoutLogger'));
const WeightTracker = lazy(() => import('./pages/WeightTracker'));
const CalendarView = lazy(() => import('./pages/CalendarView'));
const Analytics = lazy(() => import('./pages/Analytics'));
const RecordsPage = lazy(() => import('./pages/RecordsPage').then(m => ({ default: m.RecordsPage })));

const LoadingFallback = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
    <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
    <span className="text-xs font-semibold text-slate-400">Loading your hub...</span>
  </div>
);

function App() {
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
            </Routes>
          </AnimatePresence>
        </Suspense>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
