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
  X
} from 'lucide-react';
import { useFitnessStore } from '../store/useFitnessStore';
import { AnimatedPage } from '../components/AnimatedPage';

export const Dashboard: React.FC = () => {
  const { 
    initialize, 
    workouts, 
    bodyWeights, 
    personalRecords, 
    isLoading 
  } = useFitnessStore();

  const [showAllPrs, setShowAllPrs] = useState(false);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // Calculations
  const totalWorkouts = workouts.length;
  const currentWeight = bodyWeights.length > 0 ? bodyWeights[0].weight : null;
  const totalPrs = personalRecords.length;

  const totalExercisesLogged = workouts.reduce((total, w) => {
    return total + w.exercises.length;
  }, 0);

  // Today's Date
  const todayStr = new Date().toISOString().split('T')[0];
  const todayWorkout = workouts.find(w => w.date === todayStr);

  // Workouts in the last 7 days (Weekly frequency)
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const weeklyWorkouts = workouts.filter(w => new Date(w.date) >= oneWeekAgo).length;

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
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Welcome back
            </h1>
            <p className="text-slate-500 mt-1 font-medium">
              Here is your fitness hub performance for today.
            </p>
          </div>
          <Link
            to="/log"
            className="inline-flex items-center justify-center gap-2 skeuo-btn-orange text-white px-5 py-3 rounded-xl w-full md:w-auto"
          >
            <Plus className="w-5 h-5" />
            Log New Workout
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
            className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <motion.div 
              variants={cardVariants} 
              onClick={() => { if (personalRecords.length > 0) setShowAllPrs(true); }}
              className="neu-card p-5 flex flex-col justify-between relative overflow-hidden group hover:scale-[1.01] transition-all duration-150 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-400">Total Workouts</span>
                <div className="p-2.5 shadow-neu-inset bg-[#e8ebf0] text-primary-500 rounded-xl">
                  <Activity className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-extrabold text-slate-800 tracking-tight">{totalWorkouts}</span>
                <span className="text-xs text-slate-400 block mt-1">All time logged</span>
              </div>
            </motion.div>

            <motion.div variants={cardVariants} className="neu-card p-5 flex flex-col justify-between relative overflow-hidden group hover:scale-[1.01] transition-all duration-150">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-400">Current Weight</span>
                <div className="p-2.5 shadow-neu-inset bg-[#e8ebf0] text-orange-500 rounded-xl">
                  <Scale className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-extrabold text-slate-800 tracking-tight">
                  {currentWeight ? `${currentWeight} kg` : '--'}
                </span>
                <span className="text-xs text-slate-400 block mt-1">Latest scale entry</span>
              </div>
            </motion.div>

            <Link 
              to="/records"
              state={{ tab: 'prs' }}
              className="neu-card p-5 flex flex-col justify-between relative overflow-hidden group hover:scale-[1.01] transition-all duration-150 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-400">Personal Records</span>
                <div className="p-2.5 shadow-neu-inset bg-[#e8ebf0] text-yellow-655 rounded-xl">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-extrabold text-slate-800 tracking-tight">{totalPrs}</span>
                <span className="text-xs text-slate-400 block mt-1">Exercises mastered</span>
              </div>
            </Link>

            <Link 
              to="/records"
              state={{ tab: 'tracked' }}
              className="neu-card p-5 flex flex-col justify-between relative overflow-hidden group hover:scale-[1.01] transition-all duration-150 cursor-pointer text-left"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-400">Exercises Tracked</span>
                <div className="p-2.5 shadow-neu-inset bg-[#e8ebf0] text-emerald-650 rounded-xl">
                  <Flame className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-extrabold text-slate-800 tracking-tight">{totalExercisesLogged}</span>
                <span className="text-xs text-slate-400 block mt-1">Individual sets completed</span>
              </div>
            </Link>
          </motion.div>
        )}

        {/* Dashboard Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Left Panels */}
          <div className="lg:col-span-2 space-y-8">
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

            {/* Top Personal Record */}
            <div className="glass-card p-6 shadow-neu-outset border border-white/60">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  Recent PRs
                </h2>
                {personalRecords.length > 0 && (
                  <button
                    onClick={() => setShowAllPrs(true)}
                    className="text-xs font-bold text-primary-500 hover:text-primary-600 transition-colors"
                  >
                    View All
                  </button>
                )}
              </div>

              {personalRecords.length === 0 ? (
                <div className="text-center py-6 text-slate-455 text-xs font-medium">
                  <p>PRs will show up here as you lift heavier weight.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {personalRecords.slice(0, 3).map((pr) => (
                    <div key={pr.id} className="flex items-center justify-between p-3 neu-card-inset">
                      <div>
                        <h4 className="font-bold text-slate-800 text-xs">{pr.exerciseName}</h4>
                        <span className="text-[10px] text-slate-450">{pr.date}</span>
                      </div>
                      <span className="bg-gradient-to-b from-yellow-400 to-yellow-600 text-white font-extrabold text-xs px-2.5 py-1 rounded-lg shadow-skeuo-button border border-yellow-500/50">
                        {pr.value} {pr.type === 'weight' ? 'kg' : 'vol'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* View All PRs Modal */}
      {showAllPrs && (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card w-full max-w-lg shadow-2xl relative max-h-[80vh] flex flex-col border border-white/60 p-0">
            <div className="p-6 border-b border-slate-200/50 flex items-center justify-between">
              <h3 className="font-extrabold text-slate-800 text-lg flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                All Personal Records
              </h3>
              <button
                type="button"
                onClick={() => setShowAllPrs(false)}
                className="p-1.5 hover:bg-slate-200/50 rounded-full text-slate-450 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-slate-200/30 p-4 space-y-3">
              {personalRecords.map((pr) => (
                <div key={pr.id} className="flex items-center justify-between p-3.5 neu-card-inset first:mt-0">
                  <div>
                    <h4 className="font-bold text-slate-850 text-sm">{pr.exerciseName}</h4>
                    <span className="text-xs text-slate-400 font-medium block mt-0.5">Achieved on: {pr.date}</span>
                  </div>
                  <span className="bg-gradient-to-b from-yellow-400 to-yellow-600 text-white font-extrabold text-sm px-3.5 py-1.5 rounded-xl shadow-skeuo-button border border-yellow-500/50">
                    {pr.value} {pr.type === 'weight' ? 'kg' : 'vol'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </AnimatedPage>
  );
};
export default Dashboard;
