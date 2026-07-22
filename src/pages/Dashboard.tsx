import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Trophy, 
  Activity, 
  Flame, 
  Scale, 
  Calendar, 
  TrendingUp, 
  Sparkles, 
  Plus, 
  ChevronRight,
  Wifi
} from 'lucide-react';
import { useFitnessStore } from '../store/useFitnessStore';
import { AnimatedPage } from '../components/AnimatedPage';
import { EXERCISES } from '../constants/exercises';

const routeLabels: Record<string, string> = {
  '/': 'Dashboard',
  '/exercises': 'Exercises',
  '/anatomy': 'Anatomy',
  '/history': 'History',
  '/calendar': 'Calendar',
  '/weight': 'Weight',
  '/analytics': 'Analytics',
  '/log': 'Log Workout',
  '/records': 'PR Records'
};

export const Dashboard: React.FC = () => {
  const { 
    initialize, 
    workouts, 
    bodyWeights, 
    personalRecords, 
    isLoading 
  } = useFitnessStore();

  const [offlineStatus, setOfflineStatus] = useState<{
    isAvailable: boolean;
    percentage: number;
    cachedPages: string[];
    missingPages: string[];
    totalImages: number;
    cachedImages: number;
  }>({
    isAvailable: false,
    percentage: 0,
    cachedPages: [],
    missingPages: ['/', '/exercises', '/anatomy', '/history', '/calendar', '/weight', '/analytics', '/log', '/records'],
    totalImages: 0,
    cachedImages: 0
  });

  useEffect(() => {
    const checkOfflineStatus = async () => {
      try {
        if ('caches' in window) {
          const cacheNames = await caches.keys();
          const pwaCacheName = cacheNames.find(name => name.includes('myfitnesshub'));
          
          const coreRoutes = [
            '/',
            '/exercises',
            '/anatomy',
            '/history',
            '/calendar',
            '/weight',
            '/analytics',
            '/log',
            '/records'
          ];

          if (pwaCacheName) {
            const cache = await caches.open(pwaCacheName);
            const cachedRequests = await cache.keys();
            const cachedUrls = cachedRequests.map(req => new URL(req.url).pathname);

            const isShellCached = cachedUrls.includes('/') || 
                                  cachedUrls.includes('/index.html') || 
                                  cachedUrls.some(url => url.endsWith('.js') || url.endsWith('.css'));

            const exerciseImages = EXERCISES.map(ex => ex.image).filter(Boolean);
            const totalImagesCount = exerciseImages.length;
            const cachedImagesCount = exerciseImages.filter(img => 
              cachedUrls.some(url => url.endsWith(img))
            ).length;

            let percent = 0;
            if (isShellCached) {
              percent += 70;
            }
            if (totalImagesCount > 0) {
              percent += Math.round((cachedImagesCount / totalImagesCount) * 30);
            } else {
              percent += 30;
            }

            setOfflineStatus({
              isAvailable: isShellCached,
              percentage: percent,
              cachedPages: isShellCached ? coreRoutes : [],
              missingPages: isShellCached ? [] : coreRoutes,
              totalImages: totalImagesCount,
              cachedImages: cachedImagesCount
            });
          } else {
            setOfflineStatus({
              isAvailable: false,
              percentage: 0,
              cachedPages: [],
              missingPages: coreRoutes,
              totalImages: 0,
              cachedImages: 0
            });
          }
        }
      } catch (err) {
        console.error('Error checking offline status:', err);
      }
    };

    checkOfflineStatus();
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // Calculations
  const totalWorkouts = workouts.length;
  const currentWeight = bodyWeights.length > 0 ? bodyWeights[0].weight : null;
  const groupedPrs = React.useMemo(() => {
    const groups: Record<string, {
      exerciseId: string;
      exerciseName: string;
      weightPr?: typeof personalRecords[0];
      volumePr?: typeof personalRecords[0];
      latestDate: string;
    }> = {};

    personalRecords.forEach(pr => {
      if (!groups[pr.exerciseId]) {
        groups[pr.exerciseId] = {
          exerciseId: pr.exerciseId,
          exerciseName: pr.exerciseName,
          latestDate: pr.date
        };
      }
      if (pr.type === 'weight') {
        groups[pr.exerciseId].weightPr = pr;
      } else if (pr.type === 'volume') {
        groups[pr.exerciseId].volumePr = pr;
      }
      if (pr.date > groups[pr.exerciseId].latestDate) {
        groups[pr.exerciseId].latestDate = pr.date;
      }
    });

    return Object.values(groups);
  }, [personalRecords]);

  const totalPrs = groupedPrs.length;

  const uniqueExercisesTrackedCount = React.useMemo(() => {
    const ids = new Set<string>();
    workouts.forEach(w => {
      w.exercises.forEach(ex => {
        ids.add(ex.exerciseId);
      });
    });
    return ids.size;
  }, [workouts]);

  const totalSetsCompleted = React.useMemo(() => {
    let sets = 0;
    workouts.forEach(w => {
      w.exercises.forEach(ex => {
        sets += ex.sets.length;
      });
    });
    return sets;
  }, [workouts]);

  // Today's Date
  const todayStr = new Date().toISOString().split('T')[0];
  const todayWorkout = workouts.find(w => w.date === todayStr);

  // Workouts in the current week starting from Monday
  const getMondayDateString = () => {
    const today = new Date();
    const day = today.getDay();
    const diff = day === 0 ? 6 : day - 1;
    const monday = new Date(today);
    monday.setDate(today.getDate() - diff);
    const yyyy = monday.getFullYear();
    const mm = String(monday.getMonth() + 1).padStart(2, '0');
    const dd = String(monday.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };
  const mondayStr = getMondayDateString();
  const weeklyWorkouts = workouts.filter(w => w.date >= mondayStr).length;

  // Workouts in current calendar month
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyWorkouts = workouts.filter(w => {
    const d = new Date(w.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  }).length;

  // Stat card animation
  const containerVariants = {
    show: {
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 300,
        damping: 24
      }
    }
  };

  return (
    <AnimatedPage>
      <div className="space-y-4 md:space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Welcome back
            </h1>
            <p className="text-slate-500 text-xs md:text-sm font-medium hidden sm:block mt-0.5">
              Here is your fitness hub performance for today.
            </p>
          </div>
          <Link
            to="/log"
            className="inline-flex items-center justify-center gap-1.5 skeuo-btn-orange text-white px-3.5 py-2 text-xs font-bold md:text-sm md:px-5 md:py-3 rounded-full md:rounded-xl shadow-skeuo-button whitespace-nowrap flex-shrink-0"
          >
            <Plus className="w-4 h-4 md:w-5 md:h-5 stroke-[2.5]" />
            <span>Log Workout</span>
          </Link>
        </div>

        {/* Loading skeleton */}
        {isLoading && workouts.length === 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 neu-card" />
            ))}
          </div>
        ) : (
          /* Stats Grid */
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4"
          >
            <Link 
              to="/history"
              className="neu-card p-4 md:p-5 flex flex-col justify-between relative overflow-hidden group hover:scale-[1.01] transition-all duration-150 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs md:text-sm font-semibold text-slate-400">Total Workouts</span>
                <div className="p-2 md:p-2.5 shadow-neu-inset bg-[#e8ebf0] text-primary-500 rounded-xl">
                  <Activity className="w-4 h-4 md:w-5 md:h-5" />
                </div>
              </div>
              <div className="mt-2 md:mt-4">
                <span className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">{totalWorkouts}</span>
                <span className="text-[10px] md:text-xs text-slate-400 block mt-0.5 md:mt-1">All time logged</span>
              </div>
            </Link>

            <motion.div variants={cardVariants} className="neu-card p-4 md:p-5 flex flex-col justify-between relative overflow-hidden group hover:scale-[1.01] transition-all duration-150">
              <div className="flex items-center justify-between">
                <span className="text-xs md:text-sm font-semibold text-slate-400">Current Weight</span>
                <div className="p-2 md:p-2.5 shadow-neu-inset bg-[#e8ebf0] text-orange-500 rounded-xl">
                  <Scale className="w-4 h-4 md:w-5 md:h-5" />
                </div>
              </div>
              <div className="mt-2 md:mt-4">
                <span className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">
                  {currentWeight ? `${currentWeight} kg` : '--'}
                </span>
                <span className="text-[10px] md:text-xs text-slate-400 block mt-0.5 md:mt-1">Latest scale entry</span>
              </div>
            </motion.div>

            <Link 
              to="/records"
              state={{ tab: 'prs' }}
              className="neu-card p-4 md:p-5 flex flex-col justify-between relative overflow-hidden group hover:scale-[1.01] transition-all duration-150 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs md:text-sm font-semibold text-slate-400">Personal Records</span>
                <div className="p-2 md:p-2.5 shadow-neu-inset bg-[#e8ebf0] text-yellow-655 rounded-xl">
                  <Trophy className="w-4 h-4 md:w-5 md:h-5 text-yellow-500" />
                </div>
              </div>
              <div className="mt-2 md:mt-4">
                <span className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">{totalPrs}</span>
                <span className="text-[10px] md:text-xs text-slate-400 block mt-0.5 md:mt-1">Exercises mastered</span>
              </div>
            </Link>

            <Link 
              to="/records"
              state={{ tab: 'tracked' }}
              className="neu-card p-4 md:p-5 flex flex-col justify-between relative overflow-hidden group hover:scale-[1.01] transition-all duration-150 cursor-pointer text-left"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs md:text-sm font-semibold text-slate-400">Exercises Tracked</span>
                <div className="p-2 md:p-2.5 shadow-neu-inset bg-[#e8ebf0] text-emerald-650 rounded-xl">
                  <Flame className="w-4 h-4 md:w-5 md:h-5" />
                </div>
              </div>
              <div className="mt-2 md:mt-4">
                <span className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">{uniqueExercisesTrackedCount}</span>
                <span className="text-[10px] md:text-xs text-slate-400 block mt-0.5 md:mt-1 truncate">{totalSetsCompleted} sets logged</span>
              </div>
            </Link>
          </motion.div>
        )}

        {/* Dashboard Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
          {/* Main Left Panels */}
          <div className="lg:col-span-2 space-y-4 md:space-y-8">
            {/* Today's Status Card */}
            <div className="neu-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary-500" />
                  Today's Status
                </h2>
                <span className="text-xs font-semibold text-slate-400">{todayStr}</span>
              </div>

               {todayWorkout ? (
                <div className="neu-card-inset p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-800">{todayWorkout.name}</h3>
                    {todayWorkout.categories && todayWorkout.categories.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1 mb-1">
                        {todayWorkout.categories.map((cat) => (
                          <span key={cat} className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-primary-50 text-primary-600 border border-primary-100 uppercase tracking-wider">
                            {cat}
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-slate-500 mt-1">
                      Completed: {todayWorkout.exercises.length} Exercises in {todayWorkout.durationMinutes} min
                    </p>
                  </div>
                  <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-skeuo-button border border-emerald-600/30">
                    Done
                  </span>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-500 text-sm font-medium">No workout logged for today yet.</p>
                  <Link 
                    to="/log" 
                    className="inline-flex items-center gap-1.5 text-primary-500 font-semibold text-sm mt-3 hover:underline"
                  >
                    Start logging now <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div className="neu-card p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary-500" />
                Recent Workouts
              </h2>

              {workouts.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <p className="text-sm">You haven't logged any workouts yet.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-200/50">
                  {workouts.slice(0, 4).map((workout) => (
                    <div key={workout.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">{workout.name}</h4>
                        {workout.categories && workout.categories.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1 mb-1">
                            {workout.categories.map((cat) => (
                              <span key={cat} className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-primary-50 text-primary-600 border border-primary-100 uppercase tracking-wider">
                                {cat}
                              </span>
                            ))}
                          </div>
                        )}
                        <p className="text-xs text-slate-400 mt-0.5">
                          {workout.date} &middot; {workout.durationMinutes} min &middot; {workout.exercises.length} Exercises
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-1.5 max-w-[180px] justify-end">
                        {workout.exercises.slice(0, 3).map((ex, idx) => (
                          <span key={idx} className="neu-card-inset text-slate-600 text-[10px] px-2.5 py-1 font-semibold text-center border-none">
                            {ex.exerciseName.split(' ')[0]}
                          </span>
                        ))}
                        {workout.exercises.length > 3 && (
                          <span className="text-[10px] text-slate-400 font-semibold px-1 align-middle self-center">
                            +{workout.exercises.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar Panels */}
          <div className="space-y-8">
            {/* Offline Availability Card */}
            <div className="glass-card p-6 shadow-neu-outset border border-white/60">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Wifi className="w-5 h-5 text-primary-500" />
                Offline Availability
              </h2>

              <div className="space-y-4">
                <div className="neu-card-inset p-4 flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block">App Caching Status</span>
                    <div className="flex items-baseline gap-1.5 mt-1">
                      <span className="text-3xl font-extrabold text-slate-800">{offlineStatus.percentage}%</span>
                      <span className="text-slate-400 text-xs font-semibold">Offline Ready</span>
                    </div>
                  </div>
                  {/* Progress ring/circle */}
                  <div className="relative w-14 h-14 flex items-center justify-center flex-shrink-0">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="28"
                        cy="28"
                        r="24"
                        stroke="#e2e8f0"
                        strokeWidth="4"
                        fill="transparent"
                      />
                      <circle
                        cx="28"
                        cy="28"
                        r="24"
                        stroke="#f97316"
                        strokeWidth="4"
                        fill="transparent"
                        strokeDasharray={2 * Math.PI * 24}
                        strokeDashoffset={2 * Math.PI * 24 * (1 - offlineStatus.percentage / 100)}
                        className="transition-all duration-500 ease-out"
                      />
                    </svg>
                    <span className="absolute text-[10px] font-extrabold text-slate-700">
                      {offlineStatus.percentage}%
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block px-1">Pages Offline Status</span>
                  <div className="grid grid-cols-2 gap-2">
                    {offlineStatus.cachedPages.map(page => (
                      <div key={page} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-100 text-[10px] font-bold text-emerald-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {routeLabels[page] || page}
                      </div>
                    ))}
                    {offlineStatus.missingPages.map(page => (
                      <div key={page} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-rose-50 border border-rose-100 text-[10px] font-bold text-rose-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        {routeLabels[page] || page}
                      </div>
                    ))}
                  </div>
                </div>

                {offlineStatus.totalImages > offlineStatus.cachedImages && (
                  <div className="pt-2 border-t border-slate-200/50 flex flex-col gap-1 text-[10px] text-slate-500 font-semibold">
                    <div className="flex justify-between items-center text-slate-450">
                      <span>Exercise Illustrations Cache:</span>
                      <span className="font-bold text-slate-700">{offlineStatus.cachedImages} / {offlineStatus.totalImages}</span>
                    </div>
                    <div className="flex justify-between items-center text-amber-600 font-bold bg-amber-50/50 border border-amber-100/50 rounded-lg px-2 py-1.5 mt-0.5">
                      <span>Pending offline sync:</span>
                      <span>{offlineStatus.totalImages - offlineStatus.cachedImages} illustrations left</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Metrics & Badges */}
            <div className="glass-card p-6 shadow-neu-outset border border-white/60">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-500" />
                Goals & Frequency
              </h2>

              <div className="space-y-4">
                <div className="neu-card-inset p-4">
                  <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block">Weekly Frequency</span>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-2xl font-extrabold text-slate-800">{weeklyWorkouts}</span>
                    <span className="text-slate-400 text-xs font-semibold">workouts this week</span>
                  </div>
                  <div className="w-full bg-slate-300/50 h-2.5 rounded-full mt-3 overflow-hidden shadow-inner">
                    <div 
                      className="bg-primary-500 h-full rounded-full transition-all duration-500 shadow-skeuo-button"
                      style={{ width: `${Math.min((weeklyWorkouts / 6) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-450 mt-1.5 block">Goal: 6 workouts per week</span>
                </div>

                <div className="neu-card-inset p-4">
                  <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block">Monthly Total</span>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-2xl font-extrabold text-slate-800">{monthlyWorkouts}</span>
                    <span className="text-slate-400 text-xs font-semibold">workouts in {new Date().toLocaleString('default', { month: 'long' })}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};
export default Dashboard;
