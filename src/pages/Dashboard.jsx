import {
  Users,
  CalendarDays,
  IndianRupee,
  Activity,
  Sparkles,
  ArrowRight,
  Bot,
  ClockAlert,
  MessageSquare,
  Bell,
  Stethoscope,
  FileText,
  Pill,
  ShieldCheck,
  BarChart3,
  Workflow,
  RefreshCcw,
} from "lucide-react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";
import StatCard from "../components/ui/StatCard";
import AIBadge from "../components/ui/AIBadge";
import Badge from "../components/ui/Badge";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ErrorState from "../components/ui/ErrorState";
import { useAnalytics } from "../hooks/useAnalytics";
import { useAppointments } from "../hooks/useAppointments";
import { formatINR } from "../lib/format";
import Avatar from "../components/ui/Avatar";

const AUTOMATIONS = [
  { name: "No-show Predictor", icon: ClockAlert, desc: "ML scores upcoming appointments" },
  { name: "WhatsApp Recall", icon: MessageSquare, desc: "Auto-reach overdue patients" },
  { name: "Smart Reorder", icon: Pill, desc: "Reorders low-stock drugs" },
  { name: "Insurance Claim Filer", icon: FileText, desc: "Auto-files cashless claims" },
  { name: "SOAP Auto-Draft", icon: Stethoscope, desc: "From in-call transcript" },
  { name: "Daily Digest", icon: Bell, desc: "Owner email at 9 PM" },
  { name: "NPS Pulse", icon: BarChart3, desc: "Post-visit feedback collector" },
  { name: "Compliance Sentinel", icon: ShieldCheck, desc: "NDHM/ABDM audit checks" },
  { name: "Birthday Greetings", icon: Sparkles, desc: "Personalised messages" },
  { name: "Refill Reminder", icon: RefreshCcw, desc: "3-day pre-finish nudge" },
  { name: "Risk Cohort Builder", icon: Workflow, desc: "Auto-segments chronic patients" },
  { name: "AI Triage Bot", icon: Bot, desc: "24/7 symptom checker" },
];

export default function Dashboard() {
  const { kpis, charts, loading, error, refetch } = useAnalytics();
  const { data: appts } = useAppointments({ date: "2026-05-04" });

  if (loading) return <LoadingSpinner label="Loading dashboard…" />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-display font-bold">Good morning, Dr. Priya 👋</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Here's a snapshot of Sunrise Clinic, Dehradun — Monday, May 4, 2026.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-card border border-border rounded-lg px-3 py-1.5">
          <span className="w-2 h-2 rounded-full bg-[var(--success)]"></span> All systems healthy
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label="Active Patients"
          value={kpis.totalPatients.toLocaleString("en-IN")}
          delta="+4.2% MoM"
          accent="brand"
        />
        <StatCard
          icon={CalendarDays}
          label="Today's Bookings"
          value={appts.length}
          delta="+2 vs yest."
          accent="info"
          sublabel="6 confirmed, 1 walk-in"
        />
        <StatCard
          icon={IndianRupee}
          label="MTD Revenue"
          value={formatINR(kpis.monthlyRevenue)}
          delta="+12.4% MoM"
          accent="brand"
        />
        <StatCard
          icon={Activity}
          label="Avg Wait Time"
          value={`${kpis.avgWaitMin} min`}
          delta="-3 min vs last wk"
          accent="ai"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-semibold">Revenue this week</h3>
              <p className="text-xs text-muted-foreground">Daily collections, all payment modes</p>
            </div>
            <Badge variant="brand">+18.6%</Badge>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.revenueTrend}>
                <defs>
                  <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--brand)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--brand)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={11} />
                <YAxis
                  stroke="var(--muted-foreground)"
                  fontSize={11}
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                  formatter={(v) => formatINR(v)}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="var(--brand)"
                  strokeWidth={2.5}
                  fill="url(#grad1)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-sm border-l-4 border-l-[var(--ai)]">
          <div className="flex items-center gap-2 mb-3">
            <AIBadge />
            <h3 className="font-display font-semibold">AI Insights</h3>
          </div>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-3">
              <Sparkles size={14} className="text-[var(--ai)] mt-1 shrink-0" />
              <span>
                <strong>3 patients</strong> have ≥70% no-show risk today — auto-reminders queued.
              </span>
            </li>
            <li className="flex gap-3">
              <Sparkles size={14} className="text-[var(--ai)] mt-1 shrink-0" />
              <span>
                Insulin Glargine stock will deplete in <strong>4 days</strong>. Reorder PO-502
                ready.
              </span>
            </li>
            <li className="flex gap-3">
              <Sparkles size={14} className="text-[var(--ai)] mt-1 shrink-0" />
              <span>
                Diabetes recall cohort: <strong>47 booked</strong> — conversion 33%.
              </span>
            </li>
            <li className="flex gap-3">
              <Sparkles size={14} className="text-[var(--ai)] mt-1 shrink-0" />
              <span>
                HbA1c trend warning for <strong>P-1001 Rajesh Kumar</strong>.
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold">Today's appointments</h3>
            <button className="text-xs text-[var(--brand-active)] inline-flex items-center gap-1 hover:gap-2 transition-all">
              View all <ArrowRight size={12} />
            </button>
          </div>
          <div className="space-y-2">
            {appts.slice(0, 6).map((a) => (
              <div
                key={a.id}
                className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-surface-alt transition-colors"
              >
                <div className="w-12 text-center">
                  <div className="text-xs text-muted-foreground">{a.time.split(":")[0]}h</div>
                  <div className="text-xs font-mono">{a.time.split(":")[1]}</div>
                </div>
                <Avatar name={a.patientName} size={34} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{a.patientName}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {a.type} • {a.doctor}
                  </div>
                </div>
                <Badge
                  variant={
                    a.status === "In-Progress"
                      ? "info"
                      : a.status === "Waiting"
                        ? "warning"
                        : "success"
                  }
                >
                  {a.status}
                </Badge>
                {a.noShowRisk === "High" && <Badge variant="danger">No-show {a.noShowRisk}</Badge>}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <h3 className="font-display font-semibold mb-3">Patient flow</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={charts.patientFlow}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="hour" stroke="var(--muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="visits"
                  stroke="var(--ai)"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-display font-semibold flex items-center gap-2">
              Automation Suite <AIBadge label="12 active" />
            </h3>
            <p className="text-xs text-muted-foreground">
              One-click intelligent workflows running in background
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {AUTOMATIONS.map((a) => {
            const Icon = a.icon;
            return (
              <div
                key={a.name}
                className="card-lift bg-surface rounded-xl border border-border p-3 cursor-pointer"
              >
                <div className="w-9 h-9 rounded-lg bg-ai-soft text-[var(--ai)] flex items-center justify-center mb-2">
                  <Icon size={16} />
                </div>
                <div className="text-xs font-semibold leading-tight">{a.name}</div>
                <div className="text-[10px] text-muted-foreground mt-1 leading-tight">{a.desc}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
