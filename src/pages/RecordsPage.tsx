import React, { useState, useEffect } from 'react';
import { useFitnessStore } from '../store/useFitnessStore';
import { AnimatedPage } from '../components/AnimatedPage';
import { Trophy, Flame, Search, ArrowLeft, Calendar, Scale, Hash } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const RecordsPage: React.FC = () => {
  const { initialize, workouts, personalRecords, isLoading } = useFitnessStore();
  const location = useLocation();
  const initialTab = (location.state as any)?.tab || 'prs';
  const [activeTab, setActiveTab] = useState<'prs' | 'tracked'>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    initialize();
  }, [initialize]);

  // Aggregate stats for tracked exercises
  const getTrackedExerciseStats = () => {
    const exerciseStatsMap: Record<string, {
      exerciseName: string;
      setsCount: number;
      totalReps: number;
      maxWeight: number;
      lastLogged: string;
      timesLogged: number;
    }> = {};

    workouts.forEach(w => {
      w.exercises.forEach(ex => {
        const setsCount = ex.sets.length;
        const totalReps = ex.sets.reduce((sum, s) => sum + s.reps, 0);
        const maxWeight = ex.sets.reduce((max, s) => s.weight > max ? s.weight : max, 0);
        
        if (!exerciseStatsMap[ex.exerciseId]) {
          exerciseStatsMap[ex.exerciseId] = {
            exerciseName: ex.exerciseName,
            setsCount,
            totalReps,
            maxWeight,
            lastLogged: w.date,
            timesLogged: 1
          };
        } else {
          const current = exerciseStatsMap[ex.exerciseId];
          current.setsCount += setsCount;
          current.totalReps += totalReps;
          current.timesLogged += 1;
          if (maxWeight > current.maxWeight) {
            current.maxWeight = maxWeight;
          }
          if (new Date(w.date) > new Date(current.lastLogged)) {
            current.lastLogged = w.date;
          }
        }
      });
    });

    return Object.entries(exerciseStatsMap).map(([id, stats]) => ({
      id,
      ...stats
    }));
  };

  // Count times logged per exercise (for PR cards)
  const exerciseTimesLoggedMap = React.useMemo(() => {
    const map: Record<string, number> = {};
    workouts.forEach(w => {
      w.exercises.forEach(ex => {
        map[ex.exerciseId] = (map[ex.exerciseId] ?? 0) + 1;
      });
    });
    return map;
  }, [workouts]);

  const trackedExercises = getTrackedExerciseStats();

  // Group personal records by exercise
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

  // Filter personal records
  const filteredPrs = groupedPrs.filter(pr => 
    pr.exerciseName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter tracked exercises
  const filteredTracked = trackedExercises.filter(ex => 
    ex.exerciseName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AnimatedPage>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="p-2.5 hover:bg-slate-200/50 rounded-full text-slate-500 transition-colors shadow-sm bg-white border border-slate-200/40"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Records & Achievements</h1>
            <p className="text-slate-500 text-sm">View your personal bests and overall tracked exercise stats.</p>
          </div>
        </div>

        {/* Tabs navigation */}
        <div className="neu-card p-1.5 flex gap-2">
          <button
            onClick={() => {
              setActiveTab('prs');
              setSearchQuery('');
            }}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all duration-150 flex items-center justify-center gap-2 ${
              activeTab === 'prs'
                ? 'shadow-neu-inset bg-[#e3e6eb] text-primary-600 border border-slate-300/40'
                : 'text-slate-500 hover:bg-[#f3f5f8] hover:text-slate-800'
            }`}
          >
            <Trophy className={`w-4 h-4 ${activeTab === 'prs' ? 'text-yellow-500' : 'text-slate-400'}`} />
            Personal Records ({groupedPrs.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('tracked');
              setSearchQuery('');
            }}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all duration-150 flex items-center justify-center gap-2 ${
              activeTab === 'tracked'
                ? 'shadow-neu-inset bg-[#e3e6eb] text-primary-600 border border-slate-300/40'
                : 'text-slate-500 hover:bg-[#f3f5f8] hover:text-slate-800'
            }`}
          >
            <Flame className={`w-4 h-4 ${activeTab === 'tracked' ? 'text-emerald-500' : 'text-slate-400'}`} />
            Tracked Exercises ({trackedExercises.length})
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder={activeTab === 'prs' ? 'Search personal records...' : 'Search tracked exercises...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full neu-input-search !pl-10 focus:ring-1 focus:ring-primary-500/20"
          />
        </div>

        {/* Content list */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-semibold text-slate-400">Loading details...</span>
          </div>
        ) : activeTab === 'prs' ? (
          /* Personal Records Tab */
          filteredPrs.length === 0 ? (
            <div className="text-center py-12 neu-card">
              <p className="text-slate-500 text-sm font-medium">
                {searchQuery ? 'No matching personal records found.' : 'No personal records logged yet.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPrs.map((pr) => (
                <Link
                  key={pr.exerciseId}
                  to={`/exercise/${pr.exerciseId}`}
                  className="glass-card p-5 shadow-neu-outset border border-white/60 flex items-center justify-between group hover:scale-[1.01] hover:ring-2 hover:ring-primary-300/50 transition-all duration-150 cursor-pointer"
                >
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-base">{pr.exerciseName}</h4>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 font-medium">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Last PR: {pr.latestDate}</span>
                    </div>
                    <span className="inline-flex items-center gap-1 mt-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px] px-2 py-0.5 rounded-full">
                      <Hash className="w-2.5 h-2.5" />
                      Logged {exerciseTimesLoggedMap[pr.exerciseId] ?? 0} time{(exerciseTimesLoggedMap[pr.exerciseId] ?? 0) !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {pr.weightPr && (
                      <span className="bg-gradient-to-b from-yellow-400 to-yellow-600 text-white font-black text-xs px-3 py-1.5 rounded-xl shadow-skeuo-button border border-yellow-500/50">
                        {pr.weightPr.value} kg
                      </span>
                    )}
                    {pr.volumePr && (
                      <span className="bg-gradient-to-b from-orange-400 to-orange-600 text-white font-black text-xs px-3 py-1.5 rounded-xl shadow-skeuo-button border border-orange-500/50">
                        {pr.volumePr.value} vol
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )
        ) : (
          /* Tracked Exercises Tab */
          filteredTracked.length === 0 ? (
            <div className="text-center py-12 neu-card">
              <p className="text-slate-500 text-sm font-medium">
                {searchQuery ? 'No matching exercises found.' : 'No exercises tracked yet.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTracked.map((ex) => (
                <Link
                  key={ex.id}
                  to={`/exercise/${ex.id}`}
                  className="glass-card p-5 shadow-neu-outset border border-white/60 flex flex-col justify-between hover:scale-[1.01] hover:ring-2 hover:ring-primary-300/50 transition-all duration-150 cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-base">{ex.exerciseName}</h4>
                      <span className="inline-flex items-center gap-1 mt-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px] px-2 py-0.5 rounded-full">
                        <Hash className="w-2.5 h-2.5" />
                        Logged {ex.timesLogged} time{ex.timesLogged !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <span className="bg-primary-50 text-primary-600 font-extrabold text-xs px-2.5 py-1.5 rounded-lg border border-primary-100 flex items-center gap-1 shrink-0">
                      <Scale className="w-3 h-3" /> Max: {ex.maxWeight} kg
                    </span>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200/40 grid grid-cols-4 gap-2 text-center text-xs">
                    <div>
                      <span className="text-slate-400 font-bold uppercase text-[9px] block">Sessions</span>
                      <span className="text-slate-800 font-extrabold text-sm">{ex.timesLogged}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold uppercase text-[9px] block">Sets</span>
                      <span className="text-slate-800 font-extrabold text-sm">{ex.setsCount}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold uppercase text-[9px] block">Total Reps</span>
                      <span className="text-slate-800 font-extrabold text-sm">{ex.totalReps}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold uppercase text-[9px] block">Last Logged</span>
                      <span className="text-slate-850 font-bold">{ex.lastLogged}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )
        )}
      </div>
    </AnimatedPage>
  );
};

export default RecordsPage;
