import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFitnessStore } from '../store/useFitnessStore';
import { AnimatedPage } from '../components/AnimatedPage';
import {
  ArrowLeft,
  Trophy,
  Calendar,
  Dumbbell,
  TrendingUp,
  Hash,
  Layers,
  RotateCcw,
  Award,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useState } from 'react';
import { EXERCISES } from '../constants/exercises';

/* ─────────────────────────────────────────────
   SVG weight-over-time line chart (no deps)
───────────────────────────────────────────── */
interface ChartPoint {
  date: string;
  value: number;
}

const LineChart: React.FC<{ points: ChartPoint[]; label: string; color: string }> = ({
  points,
  label,
  color,
}) => {
  const W = 520;
  const H = 160;
  const PAD = { top: 16, right: 16, bottom: 32, left: 40 };

  if (points.length < 2) {
    return (
      <div className="flex items-center justify-center h-[160px] text-slate-400 text-xs font-medium">
        Need at least 2 sessions to show a trend.
      </div>
    );
  }

  const values = points.map((p) => p.value);
  const minV = Math.min(...values);
  const maxV = Math.max(...values);
  const range = maxV - minV || 1;

  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  const toX = (i: number) => PAD.left + (i / (points.length - 1)) * innerW;
  const toY = (v: number) => PAD.top + innerH - ((v - minV) / range) * innerH;

  const pathD = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${toX(i).toFixed(1)} ${toY(p.value).toFixed(1)}`)
    .join(' ');

  const areaD =
    pathD +
    ` L ${toX(points.length - 1).toFixed(1)} ${(PAD.top + innerH).toFixed(1)}` +
    ` L ${toX(0).toFixed(1)} ${(PAD.top + innerH).toFixed(1)} Z`;

  // Y-axis ticks
  const ticks = [minV, minV + range / 2, maxV].map((v) => ({
    v: Math.round(v),
    y: toY(v),
  }));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: H }}>
      <defs>
        <linearGradient id={`grad-${label}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {/* Grid lines */}
      {ticks.map((t) => (
        <line
          key={t.v}
          x1={PAD.left}
          x2={W - PAD.right}
          y1={t.y}
          y2={t.y}
          stroke="#e2e8f0"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
      ))}

      {/* Y-axis labels */}
      {ticks.map((t) => (
        <text
          key={`label-${t.v}`}
          x={PAD.left - 6}
          y={t.y + 4}
          textAnchor="end"
          fontSize="9"
          fill="#94a3b8"
          fontWeight="600"
        >
          {t.v}
        </text>
      ))}

      {/* Area fill */}
      <path d={areaD} fill={`url(#grad-${label})`} />

      {/* Line */}
      <path d={pathD} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Dots */}
      {points.map((p, i) => (
        <circle
          key={i}
          cx={toX(i)}
          cy={toY(p.value)}
          r="4"
          fill="white"
          stroke={color}
          strokeWidth="2.5"
        />
      ))}

      {/* X-axis date labels — show first, middle, last */}
      {[0, Math.floor((points.length - 1) / 2), points.length - 1]
        .filter((v, i, a) => a.indexOf(v) === i)
        .map((i) => (
          <text
            key={`x-${i}`}
            x={toX(i)}
            y={H - 6}
            textAnchor="middle"
            fontSize="8"
            fill="#94a3b8"
            fontWeight="600"
          >
            {points[i].date}
          </text>
        ))}
    </svg>
  );
};

/* ─────────────────────────────────────────────
   Session card (collapsible)
───────────────────────────────────────────── */
interface SessionData {
  workoutId: string;
  workoutName: string;
  date: string;
  sets: { weight: number; reps: number }[];
  sessionMaxWeight: number;
  sessionVolume: number;
  isWeightPR: boolean;
  isVolumePR: boolean;
  weightGainFromStart?: number;
}

const SessionCard: React.FC<{ session: SessionData; index: number; total: number }> = ({
  session,
  index,
  total,
}) => {
  const [open, setOpen] = useState(false);
  const isLatest = index === 0;
  const isFirst = index === total - 1;
  const isBottom = index === total - 1;

  return (
    <div className="relative flex gap-3">
      {/* Timeline spine */}
      <div className="flex flex-col items-center">
        <div
          className={`w-3 h-3 rounded-full border-2 mt-1 shrink-0 z-10 ${
            session.isWeightPR || session.isVolumePR
              ? 'bg-yellow-400 border-yellow-500'
              : isLatest
              ? 'bg-primary-500 border-primary-600'
              : 'bg-slate-300 border-slate-400'
          }`}
        />
        {!isBottom && <div className="w-0.5 flex-1 bg-slate-200 mt-1" />}
      </div>

      {/* Card */}
      <div
        className={`flex-1 mb-3 glass-card border border-white/60 shadow-neu-outset overflow-hidden transition-all duration-200 ${
          session.isWeightPR || session.isVolumePR ? 'border-yellow-300/60' : ''
        }`}
      >
        <button
          onClick={() => setOpen((o) => !o)}
          className="w-full flex items-center justify-between p-4 text-left"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-slate-800 text-sm">{session.date}</span>
                {(session.isWeightPR || session.isVolumePR) && (
                  <span className="inline-flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-black text-[9px] px-2 py-0.5 rounded-full">
                    <Trophy className="w-2.5 h-2.5" /> PR
                  </span>
                )}
                {isLatest && (
                  <span className="inline-flex items-center gap-1 bg-primary-50 text-primary-700 border border-primary-200 font-bold text-[9px] px-2 py-0.5 rounded-full">
                    Latest
                  </span>
                )}
                {isFirst && !isLatest && (
                  <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[9px] px-2 py-0.5 rounded-full">
                    First
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 font-medium mt-0.5 truncate">{session.workoutName}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0 ml-2">
            <div className="text-right">
              <div className="flex items-center justify-end gap-1.5">
                <span className="block text-xs sm:text-sm font-bold text-slate-800">{session.sessionMaxWeight} kg</span>
                {(session.weightGainFromStart ?? 0) > 0 && (
                  <span className="inline-flex items-center text-[9px] font-black px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    +{session.weightGainFromStart} kg
                  </span>
                )}
              </div>
              <span className="block text-[10px] text-slate-400 font-medium">{session.sets.length} sets</span>
            </div>
            {open ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </div>
        </button>

        {open && (
          <div className="px-4 pb-4 border-t border-slate-100">
            <div className="mt-3 space-y-1.5">
              {session.sets.map((set, si) => {
                const vol = set.weight * set.reps;
                return (
                  <div
                    key={si}
                    className="flex items-center justify-between text-xs py-1.5 px-3 rounded-lg bg-slate-50 border border-slate-100"
                  >
                    <span className="text-slate-400 font-bold uppercase text-[10px]">Set {si + 1}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-extrabold text-slate-800">
                        {set.weight} kg × {set.reps} reps
                      </span>
                      <span className="text-slate-400 font-medium">{vol} vol</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 flex justify-between text-[10px] font-bold text-slate-500 uppercase">
              <span>Session Volume</span>
              <span className="text-slate-700">{session.sessionVolume}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Main Page
───────────────────────────────────────────── */
export const ExerciseDetailPage: React.FC = () => {
  const { exerciseId } = useParams<{ exerciseId: string }>();
  const navigate = useNavigate();
  const { workouts, personalRecords, initialize, isLoading } = useFitnessStore();
  const [imageError, setImageError] = useState(false);

  React.useEffect(() => {
    initialize();
  }, [initialize]);

  const exerciseDetails = useMemo(() => {
    return EXERCISES.find((e) => e.id === exerciseId);
  }, [exerciseId]);

  const imageSrc = exerciseDetails?.image || `/exercises/${exerciseId}.png`;

  // Collect all sessions for this exercise, sorted oldest → newest
  const sessions: SessionData[] = useMemo(() => {
    const result: SessionData[] = [];

    const sorted = [...workouts].sort((a, b) => a.date.localeCompare(b.date));

    // Build PR timeline to flag sessions
    let runningMaxWeight = 0;
    let runningMaxVolume = 0;

    for (const workout of sorted) {
      for (const ex of workout.exercises) {
        if (ex.exerciseId !== exerciseId) continue;

        const maxWeight = ex.sets.reduce((m, s) => (s.weight > m ? s.weight : m), 0);
        const volume = ex.sets.reduce((s, set) => s + set.weight * set.reps, 0);
        const maxVolumeSet = ex.sets.reduce((m, s) => {
          const v = s.weight * s.reps;
          return v > m ? v : m;
        }, 0);

        const isWeightPR = maxWeight > runningMaxWeight;
        const isVolumePR = maxVolumeSet > runningMaxVolume;

        if (isWeightPR) runningMaxWeight = maxWeight;
        if (isVolumePR) runningMaxVolume = maxVolumeSet;

        result.push({
          workoutId: workout.id,
          workoutName: workout.name,
          date: workout.date,
          sets: ex.sets.map((s) => ({ weight: s.weight, reps: s.reps })),
          sessionMaxWeight: maxWeight,
          sessionVolume: volume,
          isWeightPR,
          isVolumePR,
        });
      }
    }

    const initialWeight = result[0]?.sessionMaxWeight ?? 0;
    return result.map((sess) => ({
      ...sess,
      weightGainFromStart: sess.sessionMaxWeight - initialWeight,
    }));
  }, [workouts, exerciseId]);

  const exerciseName =
    exerciseDetails?.name ||
    (sessions[0]
      ? workouts
          .flatMap((w) => w.exercises)
          .find((e) => e.exerciseId === exerciseId)?.exerciseName
      : '') ||
    exerciseId?.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') ||
    'Exercise Details';

  // Summary stats
  const totalSets = sessions.reduce((s, sess) => s + sess.sets.length, 0);
  const totalReps = sessions.reduce(
    (s, sess) => s + sess.sets.reduce((r, set) => r + set.reps, 0),
    0
  );
  const maxWeight = sessions.reduce((m, s) => (s.sessionMaxWeight > m ? s.sessionMaxWeight : m), 0);
  const maxVolume = sessions.reduce((m, s) => (s.sessionVolume > m ? s.sessionVolume : m), 0);

  // Weight gain calculations
  const firstSessionMaxWeight = sessions[0]?.sessionMaxWeight ?? 0;
  const latestSessionMaxWeight = sessions[sessions.length - 1]?.sessionMaxWeight ?? 0;
  const totalWeightGain = latestSessionMaxWeight - firstSessionMaxWeight;

  // Chart data — max weight per session
  const weightChartPoints: ChartPoint[] = sessions.map((s) => ({
    date: s.date,
    value: s.sessionMaxWeight,
  }));

  const volumeChartPoints: ChartPoint[] = sessions.map((s) => ({
    date: s.date,
    value: s.sessionVolume,
  }));

  // PR data from store
  const weightPr = personalRecords.find(
    (pr) => pr.exerciseId === exerciseId && pr.type === 'weight'
  );
  const volumePr = personalRecords.find(
    (pr) => pr.exerciseId === exerciseId && pr.type === 'volume'
  );

  const handleBack = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (window.history.length > 1 && window.history.state?.idx > 0) {
      navigate(-1);
    } else {
      navigate('/exercises');
    }
  };

  if (isLoading) {
    return (
      <AnimatedPage>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
          <div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-slate-400">Loading exercise history...</span>
        </div>
      </AnimatedPage>
    );
  }

  if (sessions.length === 0) {
    return (
      <AnimatedPage>
        <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6 pb-24 sm:pb-12">
          <div className="glass-card p-3.5 sm:p-6 border border-white/60 shadow-neu-outset flex items-center gap-3 sm:gap-5">
            <button
              type="button"
              onClick={handleBack}
              className="p-2 sm:p-2.5 hover:bg-slate-200/50 active:scale-95 rounded-full text-slate-500 transition-all shadow-sm bg-white border border-slate-200/40 shrink-0 relative z-20 cursor-pointer"
              title="Go Back"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 pointer-events-none" />
            </button>

            {/* Exercise Photo */}
            <div className="w-16 h-16 sm:w-28 sm:h-28 rounded-xl sm:rounded-2xl bg-white/90 border border-slate-200/60 p-1.5 sm:p-2 shrink-0 flex items-center justify-center neu-card-inset overflow-hidden shadow-inner">
              {!imageError ? (
                <img
                  src={imageSrc}
                  alt={exerciseName}
                  className="max-h-full max-w-full object-contain rounded-lg sm:rounded-xl"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-400 gap-1 p-1 text-center">
                  <Dumbbell className="w-6 h-6 sm:w-8 sm:h-8 stroke-[1.5]" />
                  <span className="text-[9px] font-semibold">No Image</span>
                </div>
              )}
            </div>

            <div className="space-y-1 min-w-0 flex-1">
              <h1 className="text-lg sm:text-2xl font-extrabold text-slate-900 leading-tight truncate">{exerciseName}</h1>
              <p className="text-slate-400 text-xs sm:text-sm font-medium">
                No sessions logged yet.
              </p>
            </div>
          </div>
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <div className="max-w-6xl xl:max-w-7xl mx-auto space-y-4 sm:space-y-6 pb-24 sm:pb-12">

        {/* Header */}
        <div className="glass-card p-3.5 sm:p-6 border border-white/60 shadow-neu-outset flex items-center gap-3 sm:gap-5">
          <button
            type="button"
            onClick={handleBack}
            className="p-2 sm:p-2.5 hover:bg-slate-200/50 active:scale-95 rounded-full text-slate-500 transition-all shadow-sm bg-white border border-slate-200/40 shrink-0 relative z-20 cursor-pointer"
            title="Go Back"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 pointer-events-none" />
          </button>

          {/* Exercise Photo */}
          <div className="w-16 h-16 sm:w-28 sm:h-28 rounded-xl sm:rounded-2xl bg-white/90 border border-slate-200/60 p-1.5 sm:p-2 shrink-0 flex items-center justify-center neu-card-inset overflow-hidden shadow-inner">
            {!imageError ? (
              <img
                src={imageSrc}
                alt={exerciseName}
                className="max-h-full max-w-full object-contain rounded-lg sm:rounded-xl"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-400 gap-1 p-1 text-center">
                <Dumbbell className="w-6 h-6 sm:w-8 sm:h-8 stroke-[1.5]" />
                <span className="text-[9px] font-semibold">No Image</span>
              </div>
            )}
          </div>

          {/* Title & Metadata */}
          <div className="flex-1 min-w-0 space-y-1 sm:space-y-1.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              {exerciseDetails?.category && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-primary-50 text-primary-600 border border-primary-100">
                  {exerciseDetails.category}
                </span>
              )}
              {exerciseDetails?.primaryMuscle && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {exerciseDetails.primaryMuscle}
                </span>
              )}
              {exerciseDetails?.equipment && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                  {exerciseDetails.equipment}
                </span>
              )}
            </div>

            <h1 className="text-lg sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-tight truncate sm:whitespace-normal">
              {exerciseName}
            </h1>

            <p className="text-slate-400 text-xs sm:text-sm font-medium flex items-center gap-2 flex-wrap">
              <span>{sessions.length} session{sessions.length !== 1 ? 's' : ''} · Progress history</span>
              {sessions.length > 1 && (
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  totalWeightGain > 0 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                    : totalWeightGain < 0 
                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                }`}>
                  <TrendingUp className="w-3 h-3" />
                  {totalWeightGain >= 0 ? `+${totalWeightGain} kg` : `${totalWeightGain} kg`} Gain
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Responsive Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          
          {/* Main Left Column (Charts & Session History Timeline) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-4 sm:space-y-6">

            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
              {/* Weight over time chart */}
              <div className="glass-card p-3.5 sm:p-5 border border-white/60 shadow-neu-outset">
                <h3 className="font-extrabold text-slate-800 text-xs sm:text-sm mb-0.5 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary-500" />
                  Max Weight per Session (kg)
                </h3>
                <p className="text-[9px] sm:text-[10px] text-slate-400 font-medium mb-2">Trend from first to latest session</p>
                <LineChart points={weightChartPoints} label="weight" color="#6366f1" />
              </div>

              {/* Volume over time chart */}
              <div className="glass-card p-3.5 sm:p-5 border border-white/60 shadow-neu-outset">
                <h3 className="font-extrabold text-slate-800 text-xs sm:text-sm mb-0.5 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-500" />
                  Session Volume (kg × reps)
                </h3>
                <p className="text-[9px] sm:text-[10px] text-slate-400 font-medium mb-2">Total volume lifted per session</p>
                <LineChart points={volumeChartPoints} label="volume" color="#f97316" />
              </div>
            </div>

            {/* Session timeline */}
            <div>
              <h3 className="font-extrabold text-slate-800 text-sm sm:text-base mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-500" />
                Session Timeline
                <span className="text-slate-400 font-medium text-xs">· tap to expand</span>
              </h3>
              <div>
                {[...sessions].reverse().map((session, i) => (
                  <SessionCard
                    key={`${session.workoutId}-${session.date}`}
                    session={session}
                    index={i}
                    total={sessions.length}
                  />
                ))}
              </div>
            </div>

          </div>

          {/* Sidebar Right Column (PRs, Stats & Form Guide) */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-4 sm:space-y-6">

            {/* PR Badges */}
            {(weightPr || volumePr) && (
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {weightPr && (
                  <div className="flex items-center gap-2 sm:gap-3 bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-300/60 rounded-xl sm:rounded-2xl p-2.5 sm:px-4 sm:py-3 shadow-sm">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-gradient-to-b from-yellow-400 to-yellow-600 flex items-center justify-center shadow-sm shrink-0">
                      <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-[9px] sm:text-[10px] font-bold text-yellow-700 uppercase tracking-wide truncate">Weight PR</p>
                        <span className="text-[8px] sm:text-[10px] text-yellow-600 font-medium truncate">{weightPr.date}</span>
                      </div>
                      <p className="text-sm sm:text-lg font-black text-yellow-800 leading-tight">{weightPr.value} kg</p>
                    </div>
                  </div>
                )}
                {volumePr && (
                  <div className="flex items-center gap-2 sm:gap-3 bg-gradient-to-br from-orange-50 to-red-50 border border-orange-300/60 rounded-xl sm:rounded-2xl p-2.5 sm:px-4 sm:py-3 shadow-sm">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-gradient-to-b from-orange-400 to-orange-600 flex items-center justify-center shadow-sm shrink-0">
                      <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-[9px] sm:text-[10px] font-bold text-orange-700 uppercase tracking-wide truncate">Volume PR</p>
                        <span className="text-[8px] sm:text-[10px] text-orange-600 font-medium truncate">{volumePr.date}</span>
                      </div>
                      <p className="text-sm sm:text-lg font-black text-orange-800 leading-tight">{volumePr.value} vol</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Summary stats */}
            <div>
              <h3 className="font-extrabold text-slate-800 text-xs sm:text-sm mb-2.5 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-primary-500" />
                Exercise Statistics
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-3">
                {[
                  { icon: Hash, label: 'Sessions', value: sessions.length, color: 'text-primary-600', bg: 'bg-primary-50', border: 'border-primary-100' },
                  { 
                    icon: TrendingUp, 
                    label: 'Weight Gain', 
                    value: totalWeightGain >= 0 ? `+${totalWeightGain} kg` : `${totalWeightGain} kg`, 
                    color: totalWeightGain > 0 ? 'text-emerald-600' : totalWeightGain < 0 ? 'text-rose-600' : 'text-slate-600', 
                    bg: totalWeightGain > 0 ? 'bg-emerald-50' : totalWeightGain < 0 ? 'bg-rose-50' : 'bg-slate-50', 
                    border: totalWeightGain > 0 ? 'border-emerald-100' : totalWeightGain < 0 ? 'border-rose-100' : 'border-slate-200', 
                    sub: sessions.length > 1 ? `${firstSessionMaxWeight}kg → ${latestSessionMaxWeight}kg` : 'Baseline' 
                  },
                  { icon: Layers, label: 'Sets', value: totalSets, color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-100' },
                  { icon: RotateCcw, label: 'Reps', value: totalReps, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
                  { icon: Dumbbell, label: 'Max Weight', value: `${maxWeight} kg`, color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-100' },
                  { icon: TrendingUp, label: 'Max Volume', value: maxVolume, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100' },
                ].map(({ icon: Icon, label, value, color, bg, border, sub }) => (
                  <div key={label} className="glass-card p-2.5 sm:p-3.5 border border-white/60 shadow-neu-outset min-w-0">
                    <div className={`inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-md sm:rounded-lg ${bg} border ${border} mb-1`}>
                      <Icon className={`w-3.5 h-3.5 ${color}`} />
                    </div>
                    <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wide truncate">{label}</p>
                    <p className={`text-sm sm:text-base font-black ${color} leading-tight truncate`}>{value}</p>
                    {sub && <p className="text-[8px] sm:text-[9px] text-slate-400 font-medium truncate">{sub}</p>}
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </AnimatedPage>
  );
};

export default ExerciseDetailPage;
