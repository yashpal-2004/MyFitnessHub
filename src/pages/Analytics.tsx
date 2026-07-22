import React, { useEffect } from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  CartesianGrid 
} from 'recharts';
import { useFitnessStore } from '../store/useFitnessStore';
import { AnimatedPage } from '../components/AnimatedPage';
import { EXERCISES } from '../constants/exercises';
import { 
  LineChart as ChartIcon, 
  Calendar, 
  Target, 
  Flame,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
  Dumbbell,
  Trophy,
  Activity
} from 'lucide-react';

export const Analytics: React.FC = () => {
  const { initialize, workouts, bodyWeights, personalRecords } = useFitnessStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  // COLOR PALETTE FOR GRAPHS
  const COLORS = ['#0ea5e9', '#f97316', '#3b82f6', '#10b981', '#6366f1', '#ec4899'];

  // Calculate stats
  // 1. Volume by muscle group
  const getVolumeByMuscleGroup = () => {
    const volumeMap: Record<string, number> = {
      Chest: 0, Back: 0, Legs: 0, Shoulders: 0, Biceps: 0, Triceps: 0
    };

    workouts.forEach(w => {
      w.exercises.forEach(ex => {
        const fullEx = EXERCISES.find(e => e.id === ex.exerciseId);
        if (fullEx) {
          const totalVol = ex.sets.reduce((sum, s) => sum + (s.weight * s.reps), 0);
          volumeMap[fullEx.category] = (volumeMap[fullEx.category] || 0) + totalVol;
        }
      });
    });

    return Object.entries(volumeMap).map(([name, value]) => ({ name, value }));
  };

  // 2. Workouts monthly frequency
  const getWorkoutsFrequency = () => {
    // Last 6 months
    const frequencyData: Record<string, number> = {};
    const today = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const key = d.toLocaleString('default', { month: 'short' });
      frequencyData[key] = 0;
    }

    workouts.forEach(w => {
      const date = new Date(w.date);
      const key = date.toLocaleString('default', { month: 'short' });
      if (key in frequencyData) {
        frequencyData[key] += 1;
      }
    });

    return Object.entries(frequencyData).map(([name, value]) => ({ name, value }));
  };

  // 3. Exercise distribution by muscle category
  const getCategoryDistribution = () => {
    const counts: Record<string, number> = {};
    workouts.forEach(w => {
      w.exercises.forEach(ex => {
        const fullEx = EXERCISES.find(e => e.id === ex.exerciseId);
        if (fullEx) {
          counts[fullEx.category] = (counts[fullEx.category] || 0) + 1;
        }
      });
    });

    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  };

  // 4. Weight Trend Analysis
  const getWeightTrend = () => {
    return [...bodyWeights].reverse().map(w => ({
      date: new Date(w.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      weight: w.weight
    }));
  };

  // Month-over-Month calculation
  const momStats = React.useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const prevDate = new Date(currentYear, currentMonth - 1, 1);
    const prevYear = prevDate.getFullYear();
    const prevMonth = prevDate.getMonth();

    const thisMonthName = now.toLocaleString('default', { month: 'short' });
    const lastMonthName = prevDate.toLocaleString('default', { month: 'short' });

    let thisMonthVol = 0;
    let thisMonthWkCount = 0;
    let thisMonthSetCount = 0;

    let lastMonthVol = 0;
    let lastMonthWkCount = 0;
    let lastMonthSetCount = 0;

    workouts.forEach((w) => {
      const d = new Date(w.date);
      const y = d.getFullYear();
      const m = d.getMonth();

      const workoutVol = w.exercises.reduce(
        (acc, ex) => acc + ex.sets.reduce((s, set) => s + set.weight * set.reps, 0),
        0
      );
      const workoutSets = w.exercises.reduce((acc, ex) => acc + ex.sets.length, 0);

      if (y === currentYear && m === currentMonth) {
        thisMonthWkCount += 1;
        thisMonthVol += workoutVol;
        thisMonthSetCount += workoutSets;
      } else if (y === prevYear && m === prevMonth) {
        lastMonthWkCount += 1;
        lastMonthVol += workoutVol;
        lastMonthSetCount += workoutSets;
      }
    });

    let thisMonthPrs = 0;
    let lastMonthPrs = 0;

    personalRecords.forEach((pr) => {
      if (pr.date) {
        const d = new Date(pr.date);
        const y = d.getFullYear();
        const m = d.getMonth();
        if (y === currentYear && m === currentMonth) thisMonthPrs += 1;
        else if (y === prevYear && m === prevMonth) lastMonthPrs += 1;
      }
    });

    const getDiff = (curr: number, prev: number) => {
      if (prev === 0) return curr > 0 ? { pct: 100, isUp: true } : { pct: 0, isUp: true };
      const diff = Math.round(((curr - prev) / prev) * 100);
      return { pct: Math.abs(diff), isUp: diff >= 0 };
    };

    return {
      thisMonthName,
      lastMonthName,
      vol: { thisM: thisMonthVol, lastM: lastMonthVol, diff: getDiff(thisMonthVol, lastMonthVol) },
      workouts: { thisM: thisMonthWkCount, lastM: lastMonthWkCount, diff: getDiff(thisMonthWkCount, lastMonthWkCount) },
      sets: { thisM: thisMonthSetCount, lastM: lastMonthSetCount, diff: getDiff(thisMonthSetCount, lastMonthSetCount) },
      prs: { thisM: thisMonthPrs, lastM: lastMonthPrs, diff: getDiff(thisMonthPrs, lastMonthPrs) },
    };
  }, [workouts, personalRecords]);

  const volumeData = getVolumeByMuscleGroup();
  const freqData = getWorkoutsFrequency();
  const distData = getCategoryDistribution();
  const weightData = getWeightTrend();

  // Find most trained muscle group
  const mostTrainedMuscle = distData.length > 0 
    ? [...distData].sort((a, b) => b.value - a.value)[0].name 
    : 'No data yet';

  const uniquePrCount = new Set(personalRecords.map(pr => pr.exerciseId)).size;

  return (
    <AnimatedPage>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Analytics & Insights
          </h1>
          <p className="text-slate-500 mt-1 font-medium">
            Detailed stats of your workout volume, frequency, and weight logs.
          </p>
        </div>

        {/* Overview cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="neu-card p-6 flex items-center gap-4">
            <div className="p-3 shadow-neu-inset bg-[#e8ebf0] text-primary-500 rounded-2xl">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">Most Trained Muscle</span>
              <span className="text-xl font-extrabold text-slate-800">{mostTrainedMuscle}</span>
            </div>
          </div>

          <div className="neu-card p-6 flex items-center gap-4">
            <div className="p-3 shadow-neu-inset bg-[#e8ebf0] text-orange-500 rounded-2xl">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">PRs Achieved</span>
              <span className="text-xl font-extrabold text-slate-800">{uniquePrCount} records</span>
            </div>
          </div>

          <div className="neu-card p-6 flex items-center gap-4">
            <div className="p-3 shadow-neu-inset bg-[#e8ebf0] text-indigo-500 rounded-2xl">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">Workouts Logged</span>
              <span className="text-xl font-extrabold text-slate-800">{workouts.length} total sessions</span>
            </div>
          </div>
        </div>

        {/* Month-over-Month Comparison Card */}
        <div className="glass-card p-6 shadow-neu-outset border border-white/60 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/40 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 shadow-neu-inset bg-[#e8ebf0] text-primary-500 rounded-xl">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-800 text-lg">Month-over-Month Workout Comparison</h3>
                <p className="text-slate-400 text-xs font-medium">Comparing performance: {momStats.thisMonthName} vs. {momStats.lastMonthName}</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 bg-primary-50 text-primary-600 border border-primary-100 rounded-full">
              <Calendar className="w-3.5 h-3.5" />
              {momStats.thisMonthName} (Current) vs {momStats.lastMonthName} (Previous)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
            {[
              {
                label: 'Total Volume Lifted',
                thisVal: `${momStats.vol.thisM.toLocaleString()} kg`,
                lastVal: `${momStats.vol.lastM.toLocaleString()} kg`,
                diff: momStats.vol.diff,
                icon: Dumbbell,
                color: 'text-primary-500',
              },
              {
                label: 'Workout Sessions',
                thisVal: `${momStats.workouts.thisM} sessions`,
                lastVal: `${momStats.workouts.lastM} sessions`,
                diff: momStats.workouts.diff,
                icon: Calendar,
                color: 'text-violet-500',
              },
              {
                label: 'Total Sets Logged',
                thisVal: `${momStats.sets.thisM} sets`,
                lastVal: `${momStats.sets.lastM} sets`,
                diff: momStats.sets.diff,
                icon: Layers,
                color: 'text-emerald-500',
              },
              {
                label: 'New PRs Broken',
                thisVal: `${momStats.prs.thisM} PRs`,
                lastVal: `${momStats.prs.lastM} PRs`,
                diff: momStats.prs.diff,
                icon: Trophy,
                color: 'text-amber-500',
              },
            ].map(({ label, thisVal, lastVal, diff, icon: Icon, color }) => (
              <div key={label} className="p-4 bg-white/70 rounded-2xl border border-slate-200/60 shadow-sm space-y-2 neu-card-inset">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${color}`} />
                    <span className="text-xs font-bold text-slate-500">{label}</span>
                  </div>
                  <span
                    className={`inline-flex items-center gap-0.5 text-[10px] font-black px-2 py-0.5 rounded-full ${
                      diff.isUp
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {diff.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {diff.isUp ? `+${diff.pct}%` : `-${diff.pct}%`}
                  </span>
                </div>

                <div className="pt-1">
                  <p className="text-xl font-black text-slate-900 leading-tight">{thisVal}</p>
                  <p className="text-[10px] font-semibold text-slate-400 mt-0.5">
                    Prev ({momStats.lastMonthName}): {lastVal}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Muscle Training Distribution */}
          <div className="glass-card p-6 shadow-neu-outset border border-white/60 flex flex-col justify-between">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-2 shadow-neu-inset bg-[#e8ebf0] text-emerald-500 rounded-xl">
                <Target className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">Target Balance (Exercise Frequency)</h3>
            </div>
            <div className="h-64 w-full flex items-center justify-center">
              {distData.length === 0 ? (
                <span className="text-slate-450 text-xs font-semibold">No balance data logged.</span>
              ) : (
                <div className="w-full h-full flex flex-col md:flex-row items-center justify-center gap-6">
                  <div className="w-44 h-44">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={distData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={70}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {distData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                    {distData.map((entry, index) => (
                      <div key={entry.name} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                        <span className="text-slate-500 font-semibold">{entry.name} ({entry.value})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Workout Volume by Muscle Group */}
          <div className="glass-card p-6 shadow-neu-outset border border-white/60 flex flex-col justify-between">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-2 shadow-neu-inset bg-[#e8ebf0] text-primary-500 rounded-xl">
                <ChartIcon className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">Volume by Muscle Group (kg)</h3>
            </div>
            <div className="h-64 w-full">
              {workouts.length === 0 ? (
                <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">No volume data logged.</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={volumeData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" fontSize={11} stroke="#94a3b8" tickLine={false} axisLine={false} />
                    <YAxis fontSize={11} stroke="#94a3b8" tickLine={false} axisLine={false} />
                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                    <Bar dataKey="value" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Monthly Workouts Frequency */}
          <div className="glass-card p-6 shadow-neu-outset border border-white/60 flex flex-col justify-between">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-2 shadow-neu-inset bg-[#e8ebf0] text-indigo-500 rounded-xl">
                <Calendar className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">Workout Frequency (Last 6 Months)</h3>
            </div>
            <div className="h-64 w-full">
              {workouts.length === 0 ? (
                <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">No frequency data.</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={freqData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" fontSize={11} stroke="#94a3b8" tickLine={false} axisLine={false} />
                    <YAxis fontSize={11} stroke="#94a3b8" tickLine={false} axisLine={false} />
                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                    <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Weight Trend Progress */}
          <div className="glass-card p-6 shadow-neu-outset border border-white/60 flex flex-col justify-between">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-2 shadow-neu-inset bg-[#e8ebf0] text-sky-500 rounded-xl">
                <ChartIcon className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">Body Weight Trend (kg)</h3>
            </div>
            <div className="h-64 w-full">
              {bodyWeights.length === 0 ? (
                <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-medium">Add weights to generate charts.</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weightData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="date" fontSize={11} stroke="#94a3b8" tickLine={false} axisLine={false} />
                    <YAxis fontSize={11} stroke="#94a3b8" tickLine={false} axisLine={false} domain={['dataMin - 1', 'dataMax + 1']} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                    <Line type="monotone" dataKey="weight" stroke="#0ea5e9" strokeWidth={2.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};
export default Analytics;
