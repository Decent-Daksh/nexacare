import { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import { useSelfAttendance } from '../hooks/useSelfAttendance';
import StatCard from '../components/ui/StatCard';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorState from '../components/ui/ErrorState';
import { 
  LogIn, LogOut, Clock, CalendarDays, Flame, CheckCircle2, 
  AlertCircle, XCircle, Timer, TrendingUp, ChevronDown, 
  History, Sun, Sunset 
} from 'lucide-react';

const STAFF_MAP = [
  { staffId: 'S-01', name: 'Dr. Priya Sharma', role: 'Senior Physician' },
  { staffId: 'S-02', name: 'Dr. Arjun Mehta', role: 'General Physician' },
  { staffId: 'S-03', name: 'Nurse Reena Joshi', role: 'Head Nurse' },
  { staffId: 'S-04', name: 'Pharmacist Karan Bhatt', role: 'Pharmacist' },
  { staffId: 'S-05', name: 'Front Desk Anya Roy', role: 'Receptionist' },
  { staffId: 'S-06', name: 'Tech Manish Yadav', role: 'Lab Technician' },
];

export default function AttendancePortal() {
  const [activeStaffId, setActiveStaffId] = useState('S-01');
  const [showSwitcher, setShowSwitcher] = useState(false);
  const [liveTime, setLiveTime] = useState(new Date());
  const { showToast } = useToast();

  useEffect(() => {
    const t = setInterval(() => setLiveTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const { todayRecord, log, stats, loading, actionLoading, error, refetch, checkIn, checkOut } = useSelfAttendance(activeStaffId);

  const activeStaff = STAFF_MAP.find(s => s.staffId === activeStaffId);

  const statusConfig = {
    Present: { variant: 'success', icon: CheckCircle2, dot: 'bg-[var(--success)]' },
    Late: { variant: 'warning', icon: AlertCircle, dot: 'bg-[var(--warning)]' },
    Absent: { variant: 'danger', icon: XCircle, dot: 'bg-[var(--danger)]' },
    Leave: { variant: 'info', icon: CalendarDays, dot: 'bg-[var(--info)]' },
    'Half Day': { variant: 'brand', icon: Timer, dot: 'bg-[var(--brand)]' },
  };

  if (loading) return <LoadingSpinner label="Loading Portal..." />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4">
      {/* Header with Switcher */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">My Attendance</h1>
          <p className="text-sm text-muted-foreground mt-1">Check in and view your stats.</p>
        </div>
        <div className="relative">
          <button onClick={() => setShowSwitcher(!showSwitcher)} className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-lg text-sm">
            <Avatar name={activeStaff?.name || 'User'} size={22} />
            <span className="font-medium">{activeStaff?.name}</span>
            <ChevronDown size={14} />
          </button>
          {showSwitcher && (
            <div className="absolute right-0 mt-1 bg-card border border-border rounded-xl shadow-xl z-20 py-1 w-48">
              {STAFF_MAP.map(s => (
                <button 
                  key={s.staffId} 
                  onClick={() => { setActiveStaffId(s.staffId); setShowSwitcher(false); }} 
                  className="w-full px-4 py-2 text-sm text-left hover:bg-surface-alt"
                >
                  {s.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Action Card */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm overflow-hidden">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <div className="text-4xl font-mono font-bold text-[var(--brand-active)]">
              {liveTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
            <p className="text-muted-foreground">{liveTime.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
          </div>
          <div className="flex flex-col items-center gap-4">
            {!todayRecord?.checkIn ? (
              <button onClick={checkIn} disabled={actionLoading} className="w-32 h-32 rounded-full bg-gradient-to-br from-[var(--brand)] to-[var(--ai)] text-white shadow-lg flex flex-col items-center justify-center gap-1 hover:scale-105 transition-all">
                <LogIn size={28} /> <span className="font-semibold text-sm">Check In</span>
              </button>
            ) : !todayRecord?.checkOut ? (
              <button onClick={checkOut} disabled={actionLoading} className="w-32 h-32 rounded-full border-4 border-[var(--danger)] text-[var(--danger)] flex flex-col items-center justify-center gap-1 hover:bg-red-50 transition-all">
                <LogOut size={28} /> <span className="font-semibold text-sm">Check Out</span>
              </button>
            ) : (
              <div className="w-32 h-32 rounded-full bg-secondary border-4 border-[var(--success)] text-[var(--success)] flex flex-col items-center justify-center">
                <CheckCircle2 size={32} /> <span className="text-xs mt-1 font-bold uppercase">Shift Done</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stat Cards Section - Guarded against null stats */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard icon={CheckCircle2} label="Present" value={stats.present} accent="brand" />
          <StatCard icon={Flame} label="Streak" value={`${stats.streak} days`} accent="ai" />
          <StatCard icon={Clock} label="Avg Hours" value={`${stats.avgHours}h`} accent="info" />
          <StatCard icon={TrendingUp} label="Total Hours" value={stats.totalHours} accent="warn" />
        </div>
      )}

      {/* Calendar Section */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
        <h3 className="font-display font-semibold mb-4">Monthly Overview</h3>
        <MonthCalendar log={log || []} statusConfig={statusConfig} />
      </div>
    </div>
  );
}

function MonthCalendar({ log = [], statusConfig }) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const offset = firstDay === 0 ? 6 : firstDay - 1;

  const cells = [...Array(offset).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  
  // Safe map conversion
  const logMap = log && log.length > 0 
    ? Object.fromEntries(log.map(r => [r.date, r])) 
    : {};

  return (
    <div className="grid grid-cols-7 gap-1">
      {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(d => (
        <div key={d} className="text-center text-[10px] font-bold text-muted-foreground py-1">{d}</div>
      ))}
      {cells.map((day, idx) => {
        if (!day) return <div key={idx} />;
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const record = logMap[dateStr];
        const isToday = day === today.getDate();
        const color = record ? statusConfig[record.status]?.dot : 'bg-surface';
        
        return (
          <div key={idx} className={`aspect-square rounded-lg border border-border flex flex-col items-center justify-center relative ${isToday ? 'ring-2 ring-[var(--brand)]' : ''}`}>
            <span className="text-xs font-medium">{day}</span>
            {record && <div className={`w-1.5 h-1.5 rounded-full mt-1 ${color}`} />}
          </div>
        );
      })}
    </div>
  );
}