import { useEffect, useMemo, useState } from 'react';
import { CalendarCheck2, Check, X, Plane, Save, RotateCcw } from 'lucide-react';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';

const STATUSES = [
  { key: 'present', label: 'Present', icon: Check, variant: 'success' },
  { key: 'absent',  label: 'Absent',  icon: X,     variant: 'danger'  },
  { key: 'leave',   label: 'Leave',   icon: Plane, variant: 'warning' },
];

const STORAGE_KEY = 'nexacare_daily_attendance';

const today = () => new Date().toISOString().slice(0, 10);

const loadAll = () => {
  if (typeof window === 'undefined') return {};
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
  catch { return {}; }
};

const saveAll = (data) => {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
};

export default function DailyAttendance({ staff = [] }) {
  const [date, setDate] = useState(today());
  const [all, setAll] = useState(() => loadAll());
  const [savedAt, setSavedAt] = useState(null);

  // Hydrate from localStorage on the client (in case of SSR mismatch)
  useEffect(() => { setAll(loadAll()); }, []);

  const dayMap = all[date] || {};

  const setStatus = (staffId, status) => {
    const next = { ...all, [date]: { ...(all[date] || {}), [staffId]: status } };
    setAll(next);
    saveAll(next);
    setSavedAt(new Date());
  };

  const markAll = (status) => {
    const dayNext = {};
    staff.forEach(s => { dayNext[s.id] = status; });
    const next = { ...all, [date]: dayNext };
    setAll(next);
    saveAll(next);
    setSavedAt(new Date());
  };

  const clearDay = () => {
    const next = { ...all };
    delete next[date];
    setAll(next);
    saveAll(next);
    setSavedAt(new Date());
  };

  const summary = useMemo(() => {
    const s = { present: 0, absent: 0, leave: 0, unmarked: 0 };
    staff.forEach(p => {
      const v = dayMap[p.id];
      if (v && s[v] != null) s[v] += 1;
      else s.unmarked += 1;
    });
    return s;
  }, [dayMap, staff]);

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <CalendarCheck2 size={18} className="text-[var(--brand)]" />
          <h3 className="font-display font-semibold">Daily Attendance</h3>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="date"
            value={date}
            max={today()}
            onChange={(e) => setDate(e.target.value || today())}
            className="px-3 py-1.5 text-sm rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/30"
          />
          <button
            onClick={() => markAll('present')}
            className="px-3 py-1.5 text-xs font-medium rounded-md bg-secondary text-[var(--brand-active)] hover:bg-secondary/80 inline-flex items-center gap-1"
          >
            <Save size={13}/> Mark all present
          </button>
          <button
            onClick={clearDay}
            className="px-3 py-1.5 text-xs font-medium rounded-md border border-border hover:bg-surface-alt inline-flex items-center gap-1"
          >
            <RotateCcw size={13}/> Clear
          </button>
        </div>
      </div>

      <div className="px-5 py-3 border-b border-border flex flex-wrap gap-2 text-xs">
        <Badge variant="success">Present {summary.present}</Badge>
        <Badge variant="danger">Absent {summary.absent}</Badge>
        <Badge variant="warning">Leave {summary.leave}</Badge>
        <Badge variant="info">Unmarked {summary.unmarked}</Badge>
        {savedAt && (
          <span className="ml-auto text-muted-foreground">
            Saved {savedAt.toLocaleTimeString()}
          </span>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-surface text-xs text-muted-foreground uppercase">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Staff</th>
              <th className="text-left px-4 py-3 font-medium">Role</th>
              <th className="text-center px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((p, i) => {
              const current = dayMap[p.id];
              return (
                <tr key={p.id} className={`hover:bg-surface-alt ${i % 2 ? 'bg-surface/40' : ''}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={p.name} size={32}/>
                      <div className="font-medium">{p.name}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{p.role}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1.5">
                      {STATUSES.map(st => {
                        const Icon = st.icon;
                        const active = current === st.key;
                        return (
                          <button
                            key={st.key}
                            onClick={() => setStatus(p.id, active ? null : st.key)}
                            className={`px-2.5 py-1 rounded-md text-xs font-medium inline-flex items-center gap-1 border transition-colors ${
                              active
                                ? st.key === 'present'
                                  ? 'bg-[color-mix(in_oklab,var(--success)_18%,white)] text-[var(--success)] border-[color-mix(in_oklab,var(--success)_30%,transparent)]'
                                  : st.key === 'absent'
                                  ? 'bg-[color-mix(in_oklab,var(--danger)_18%,white)] text-[var(--danger)] border-[color-mix(in_oklab,var(--danger)_30%,transparent)]'
                                  : 'bg-[color-mix(in_oklab,var(--warning)_18%,white)] text-[oklch(0.55_0.15_75)] border-[color-mix(in_oklab,var(--warning)_30%,transparent)]'
                                : 'bg-background text-muted-foreground border-border hover:bg-surface-alt'
                            }`}
                            title={active ? `Unmark ${st.label}` : `Mark ${st.label}`}
                          >
                            <Icon size={12}/> {st.label}
                          </button>
                        );
                      })}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
