import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Dumbbell, 
  LayoutDashboard, 
  Calendar, 
  LineChart, 
  Scale, 
  PlusCircle,
  WifiOff,
  RefreshCw
} from 'lucide-react';
import { useFitnessStore } from '../store/useFitnessStore';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { isOnline, syncStatus, lastSynced, pendingActions, triggerSync } = useFitnessStore();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/exercises', label: 'Exercises', icon: Dumbbell },
    { path: '/log', label: 'Log Workout', icon: PlusCircle, highlight: true },
    { path: '/calendar', label: 'Calendar', icon: Calendar },
    { path: '/weight', label: 'Weight', icon: Scale },
    { path: '/analytics', label: 'Analytics', icon: LineChart },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f0f2f5] text-slate-900 pb-20 md:pb-0">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 glass-card m-4 p-6 sticky top-4 h-[calc(100vh-2rem)] shadow-neu-outset z-40">
        <div className="flex items-center gap-3 mb-5">
          <div className="bg-gradient-to-b from-orange-400 to-orange-500 text-white p-2.5 rounded-xl shadow-skeuo-button border border-orange-500/80">
            <Dumbbell className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-800 m-0">MyFitnessHub</h1>
            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Performance Hub</span>
          </div>
        </div>

        {/* Sync Indicator */}
        <div className="mb-6 px-3.5 py-2.5 bg-slate-100/50 rounded-xl border border-slate-200/40 text-xs">
          <div className="flex items-center justify-between font-semibold">
            <span className="text-slate-450 uppercase text-[9px] tracking-wider">Status</span>
            <div className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-full ${
                !isOnline ? 'bg-rose-500' : syncStatus === 'syncing' ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'
              }`} />
              <span className="text-slate-655 font-bold">
                {!isOnline ? 'Offline' : syncStatus === 'syncing' ? 'Syncing' : 'Online'}
              </span>
            </div>
          </div>
          <div className="mt-2 text-[10px] text-slate-500/90 font-medium flex items-center justify-between">
            <span>
              {pendingActions.length > 0 
                ? `${pendingActions.length} edits pending` 
                : lastSynced 
                  ? `Synced: ${lastSynced}` 
                  : 'Up to date'}
            </span>
            {isOnline && pendingActions.length > 0 && (
              <button 
                onClick={triggerSync}
                className="text-primary-550 hover:underline flex items-center gap-0.5"
                title="Sync now"
              >
                <RefreshCw className="w-2.5 h-2.5" />
                Sync
              </button>
            )}
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.path === '/' 
              ? location.pathname === '/' 
              : location.pathname.startsWith(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-150 ${
                  isActive
                    ? 'shadow-neu-inset bg-[#e3e6eb] text-primary-600 border border-slate-300/40'
                    : 'text-slate-500 hover:shadow-neu-outset-sm hover:bg-[#f3f5f8] hover:text-slate-800 border border-transparent'
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'text-primary-500 scale-105' : 'text-slate-400'}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full overflow-x-hidden space-y-4">
        {/* Mobile Status Bar */}
        {!isOnline && (
          <div className="md:hidden flex items-center justify-between gap-2 px-4 py-2 bg-rose-50 border border-rose-100 text-rose-700 text-xs font-bold rounded-xl shadow-sm">
            <span className="flex items-center gap-1.5">
              <WifiOff className="w-4 h-4" />
              Running Offline Mode
            </span>
            {pendingActions.length > 0 && (
              <span>{pendingActions.length} changes queued</span>
            )}
          </div>
        )}
        {isOnline && syncStatus === 'syncing' && (
          <div className="md:hidden flex items-center gap-1.5 px-4 py-2 bg-amber-50 border border-amber-100 text-amber-700 text-xs font-bold rounded-xl shadow-sm">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            Synchronizing data with cloud...
          </div>
        )}
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass-card rounded-t-2xl rounded-b-none border-t border-white/50 flex items-center justify-around py-3 px-3 z-50 shadow-lg">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.path === '/' 
            ? location.pathname === '/' 
            : location.pathname.startsWith(item.path);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-150 ${
                isActive
                  ? 'shadow-neu-inset bg-[#e3e6eb] text-primary-600 px-3 py-1.5'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-primary-500' : 'text-slate-400'}`} />
              <span className="text-[9px] font-semibold">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
export default Layout;
