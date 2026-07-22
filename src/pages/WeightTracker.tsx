import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { useFitnessStore } from '../store/useFitnessStore';
import { AnimatedPage } from '../components/AnimatedPage';
import { 
  Plus, 
  Scale, 
  Trash2, 
  Edit2, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  Activity 
} from 'lucide-react';
import type { BodyWeight } from '../types';

interface WeightFormInput {
  weight: number;
  date: string;
  notes?: string;
}

export const WeightTracker: React.FC = () => {
  const { 
    initialize, 
    bodyWeights, 
    addWeight, 
    editWeight, 
    deleteWeight, 
    isLoading 
  } = useFitnessStore();

  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly'>('weekly');
  const [editingEntry, setEditingEntry] = useState<BodyWeight | null>(null);

  const { register, handleSubmit, reset, setValue } = useForm<WeightFormInput>({
    defaultValues: {
      weight: 70,
      date: new Date().toISOString().split('T')[0],
      notes: ''
    }
  });

  useEffect(() => {
    initialize();
  }, [initialize]);

  // Default the weight input to the most recent logged weight once bodyWeights load
  useEffect(() => {
    if (bodyWeights.length > 0 && !editingEntry) {
      setValue('weight', bodyWeights[0].weight);
    }
  }, [bodyWeights, setValue, editingEntry]);

  // Calculations for trend analysis
  const recentWeights = [...bodyWeights].reverse(); // oldest to newest for charts
  
  const getChartData = () => {
    const limit = timeframe === 'weekly' ? 7 : 30;
    return recentWeights.slice(-limit).map(w => ({
      date: new Date(w.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      weight: w.weight
    }));
  };

  const getWeightChange = () => {
    if (bodyWeights.length < 2) return { value: 0, trend: 'stable' };
    const latest = bodyWeights[0].weight;
    const previous = bodyWeights[1].weight;
    const diff = latest - previous;
    return {
      value: Math.abs(Number(diff.toFixed(1))),
      trend: diff > 0 ? 'up' : diff < 0 ? 'down' : 'stable'
    };
  };

  const weightChange = getWeightChange();
  const latestWeight = bodyWeights.length > 0 ? bodyWeights[0].weight : null;

  const onSubmit = async (data: WeightFormInput) => {
    const enteredWeight = Number(data.weight);
    if (editingEntry) {
      await editWeight(editingEntry.id, enteredWeight, data.date, data.notes);
      setEditingEntry(null);
    } else {
      await addWeight(enteredWeight, data.date, data.notes);
    }
    reset({
      weight: enteredWeight,
      date: new Date().toISOString().split('T')[0],
      notes: ''
    });
  };

  const handleEdit = (entry: BodyWeight) => {
    setEditingEntry(entry);
    setValue('weight', entry.weight);
    setValue('date', entry.date);
    setValue('notes', entry.notes || '');
  };

  return (
    <AnimatedPage>
      <div className="space-y-4 md:space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Weight Tracker
          </h1>
          <p className="text-slate-500 text-xs md:text-sm font-medium hidden sm:block mt-0.5">
            Monitor and analyze your body weight progress over time.
          </p>
        </div>

        {/* Top summary metrics */}
        <div className="grid grid-cols-3 gap-2 md:gap-6">
          <div className="neu-card p-2.5 md:p-6 flex flex-col md:flex-row items-center justify-center md:justify-start text-center md:text-left gap-1 md:gap-4">
            <div className="p-1.5 md:p-3 shadow-neu-inset bg-[#e8ebf0] text-primary-500 rounded-xl md:rounded-2xl flex-shrink-0">
              <Scale className="w-4 h-4 md:w-6 md:h-6" />
            </div>
            <div className="min-w-0">
              <span className="text-[9px] md:text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                <span className="md:hidden">Latest</span>
                <span className="hidden md:inline">Latest Weight</span>
              </span>
              <span className="text-xs md:text-2xl font-extrabold text-slate-800 block whitespace-nowrap">
                {latestWeight ? `${latestWeight} kg` : '--'}
              </span>
            </div>
          </div>

          <div className="neu-card p-2.5 md:p-6 flex flex-col md:flex-row items-center justify-center md:justify-start text-center md:text-left gap-1 md:gap-4">
            <div className={`p-1.5 md:p-3 shadow-neu-inset bg-[#e8ebf0] rounded-xl md:rounded-2xl flex-shrink-0 ${
              weightChange.trend === 'down' 
                ? 'text-emerald-600' 
                : weightChange.trend === 'up' 
                  ? 'text-rose-600' 
                  : 'text-slate-500'
            }`}>
              {weightChange.trend === 'down' ? (
                <TrendingDown className="w-4 h-4 md:w-6 md:h-6" />
              ) : weightChange.trend === 'up' ? (
                <TrendingUp className="w-4 h-4 md:w-6 md:h-6" />
              ) : (
                <Activity className="w-4 h-4 md:w-6 md:h-6" />
              )}
            </div>
            <div className="min-w-0">
              <span className="text-[9px] md:text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                <span className="md:hidden">Change</span>
                <span className="hidden md:inline">Recent Change</span>
              </span>
              <span className="text-xs md:text-2xl font-extrabold text-slate-800 block whitespace-nowrap">
                {weightChange.value > 0 ? `${weightChange.trend === 'up' ? '+' : '-'}${weightChange.value} kg` : 'Stable'}
              </span>
            </div>
          </div>

          <div className="neu-card p-2.5 md:p-6 flex flex-col md:flex-row items-center justify-center md:justify-start text-center md:text-left gap-1 md:gap-4">
            <div className="p-1.5 md:p-3 shadow-neu-inset bg-[#e8ebf0] text-indigo-500 rounded-xl md:rounded-2xl flex-shrink-0">
              <Calendar className="w-4 h-4 md:w-6 md:h-6" />
            </div>
            <div className="min-w-0">
              <span className="text-[9px] md:text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                <span className="md:hidden">Logs</span>
                <span className="hidden md:inline">Logs Registered</span>
              </span>
              <span className="text-xs md:text-2xl font-extrabold text-slate-800 block whitespace-nowrap">
                {bodyWeights.length} <span className="hidden md:inline">logs</span>
              </span>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="glass-card p-4 md:p-6 shadow-neu-outset border border-white/60">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-base md:text-lg font-bold text-slate-800">Weight Trend</h2>
            <div className="neu-card-inset p-1 flex gap-1">
              <button
                onClick={() => setTimeframe('weekly')}
                className={`px-2.5 py-1 md:px-3.5 md:py-1.5 rounded-lg text-[10px] md:text-xs font-bold transition-all ${
                  timeframe === 'weekly' 
                    ? 'shadow-neu-inset bg-[#d8dce2] text-primary-700' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                7 Entries
              </button>
              <button
                onClick={() => setTimeframe('monthly')}
                className={`px-2.5 py-1 md:px-3.5 md:py-1.5 rounded-lg text-[10px] md:text-xs font-bold transition-all ${
                  timeframe === 'monthly' 
                    ? 'shadow-neu-inset bg-[#d8dce2] text-primary-700' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                30 Entries
              </button>
            </div>
          </div>

          <div className="h-56 md:h-72 w-full">
            {bodyWeights.length === 0 ? (
              <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
                Add weight logs below to visualize trends.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={getChartData()} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="weightColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.01}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#94a3b8" 
                    fontSize={11}
                    tickLine={false}
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke="#94a3b8" 
                    fontSize={11} 
                    domain={['dataMin - 2', 'dataMax + 2']} 
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: 'none', 
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="#0ea5e9" 
                    strokeWidth={2.5}
                    fillOpacity={1} 
                    fill="url(#weightColor)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Logger and Logs Table split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
          {/* Add / Edit Form */}
          <div className="neu-card p-4 md:p-6 h-fit">
            <h3 className="font-bold text-slate-800 text-base mb-4">
              {editingEntry ? 'Edit Entry' : 'Log Weight'}
            </h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  {...register('weight', { required: true, valueAsNumber: true })}
                  className="w-full neu-input font-semibold focus:ring-1 focus:ring-primary-500/20"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Date
                </label>
                <input
                  type="date"
                  {...register('date', { required: true })}
                  className="w-full neu-input font-semibold focus:ring-1 focus:ring-primary-500/20"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Notes (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Morning, fasted, post-workout..."
                  {...register('notes')}
                  className="w-full neu-input focus:ring-1 focus:ring-primary-500/20"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 inline-flex items-center justify-center gap-2 skeuo-btn-orange text-white py-2.5 rounded-xl disabled:opacity-50 text-sm font-bold shadow-skeuo-button"
                >
                  <Plus className="w-4 h-4" />
                  {editingEntry ? 'Update' : 'Add Log'}
                </button>
                {editingEntry && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingEntry(null);
                      reset();
                    }}
                    className="skeuo-btn-light px-4 py-2.5 text-sm"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Logs List */}
          <div className="lg:col-span-2 glass-card p-4 md:p-6 shadow-neu-outset border border-white/60">
            <h3 className="font-bold text-slate-800 text-base mb-4">Past Logs</h3>

            {bodyWeights.length === 0 ? (
              <div className="text-center py-12 text-slate-450 text-sm font-medium">
                No entries saved yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200/50 text-[10px] font-bold text-slate-450 uppercase tracking-wider">
                      <th className="pb-3">Date</th>
                      <th className="pb-3">Weight</th>
                      <th className="pb-3">Notes</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/30 text-sm">
                    {bodyWeights.map((w) => (
                      <tr key={w.id} className="hover:bg-slate-100/50 transition-colors">
                        <td className="py-3.5 font-bold text-slate-700">{w.date}</td>
                        <td className="py-3.5 font-extrabold text-slate-800">{w.weight} kg</td>
                        <td className="py-3.5 text-slate-450 text-xs truncate max-w-[150px]">{w.notes || '-'}</td>
                        <td className="py-3.5 text-right">
                          <div className="inline-flex gap-1.5">
                            <button
                              onClick={() => handleEdit(w)}
                              className="p-1.5 text-slate-400 hover:text-primary-500 hover:bg-slate-200/50 rounded-lg transition-all"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteWeight(w.id)}
                              className="p-1.5 text-slate-450 hover:text-rose-500 hover:bg-slate-200/50 rounded-lg transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};
export default WeightTracker;
