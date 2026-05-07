<<<<<<< HEAD
import { useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { useAnalytics } from "../hooks/useAnalytics";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ErrorState from "../components/ui/ErrorState";
import StatCard from "../components/ui/StatCard";
import { Users, IndianRupee, Activity, Clock } from "lucide-react";
import { formatINR } from "../lib/format";

const COLORS = [
  "var(--brand)",
  "var(--ai)",
  "var(--info)",
  "oklch(0.7 0.15 30)",
  "oklch(0.65 0.16 300)",
];

export default function AnalyticsHub() {
  const [range, setRange] = useState("30d");
  const { kpis, healthScore, charts, loading, error, refetch } = useAnalytics();

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  const dash = 440 * (1 - healthScore / 100);
=======
import { useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useAnalytics } from '../hooks/useAnalytics';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorState from '../components/ui/ErrorState';
import StatCard from '../components/ui/StatCard';
import { Users, IndianRupee, Activity, Clock } from 'lucide-react';
import { formatINR } from '../lib/format';

const COLORS = ['var(--brand)', 'var(--ai)', 'var(--info)', 'oklch(0.7 0.15 30)', 'oklch(0.65 0.16 300)'];

export default function AnalyticsHub() {
  const [range, setRange] = useState('30d');
  const { kpis, healthScore, charts, loading, error, refetch } = useAnalytics();

  if (loading) return <LoadingSpinner/>;
  if (error) return <ErrorState message={error} onRetry={refetch}/>;

  const dash = (440 * (1 - healthScore/100));
>>>>>>> main

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-display font-bold">Analytics Hub</h1>
<<<<<<< HEAD
          <p className="text-sm text-muted-foreground mt-1">
            Operational, financial and clinical KPIs in one place.
          </p>
        </div>
        <div className="flex bg-surface rounded-lg p-1 border border-border">
          {["7d", "30d", "90d", "YTD"].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md ${range === r ? "bg-card shadow-sm" : "text-muted-foreground"}`}
            >
              {r}
            </button>
=======
          <p className="text-sm text-muted-foreground mt-1">Operational, financial and clinical KPIs in one place.</p>
        </div>
        <div className="flex bg-surface rounded-lg p-1 border border-border">
          {['7d','30d','90d','YTD'].map(r => (
            <button key={r} onClick={() => setRange(r)} className={`px-3 py-1.5 text-xs font-medium rounded-md ${range === r ? 'bg-card shadow-sm' : 'text-muted-foreground'}`}>{r}</button>
>>>>>>> main
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col items-center justify-center border-l-4 border-l-[var(--ai)]">
<<<<<<< HEAD
          <div className="text-xs uppercase font-semibold text-muted-foreground mb-2">
            Clinic Health Score
          </div>
          <div className="relative w-40 h-40">
            <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90">
              <circle cx="80" cy="80" r="70" fill="none" stroke="var(--border)" strokeWidth="14" />
              <circle
                cx="80"
                cy="80"
                r="70"
                fill="none"
                stroke="var(--brand)"
                strokeWidth="14"
                strokeLinecap="round"
                strokeDasharray="440"
                strokeDashoffset={dash}
              />
=======
          <div className="text-xs uppercase font-semibold text-muted-foreground mb-2">Clinic Health Score</div>
          <div className="relative w-40 h-40">
            <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90">
              <circle cx="80" cy="80" r="70" fill="none" stroke="var(--border)" strokeWidth="14"/>
              <circle cx="80" cy="80" r="70" fill="none" stroke="var(--brand)" strokeWidth="14" strokeLinecap="round" strokeDasharray="440" strokeDashoffset={dash}/>
>>>>>>> main
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-4xl font-display font-bold">{healthScore}</div>
              <div className="text-xs text-muted-foreground">/ 100</div>
            </div>
          </div>
          <div className="text-xs text-[var(--success)] font-medium mt-3">Excellent</div>
        </div>

        <div className="lg:col-span-2 grid grid-cols-2 gap-3">
<<<<<<< HEAD
          <StatCard
            icon={Users}
            label="Active Patients"
            value={kpis.totalPatients.toLocaleString("en-IN")}
            delta="+4.2%"
            accent="brand"
          />
          <StatCard
            icon={IndianRupee}
            label="MTD Revenue"
            value={formatINR(kpis.monthlyRevenue)}
            delta="+12%"
            accent="info"
          />
          <StatCard
            icon={Activity}
            label="Today's Appts"
            value={kpis.activeAppointments}
            delta="+5"
            accent="brand"
          />
          <StatCard
            icon={Clock}
            label="Avg Wait"
            value={`${kpis.avgWaitMin} min`}
            delta="-3 min"
            accent="ai"
          />
=======
          <StatCard icon={Users}        label="Active Patients" value={kpis.totalPatients.toLocaleString('en-IN')} delta="+4.2%" accent="brand"/>
          <StatCard icon={IndianRupee}  label="MTD Revenue"     value={formatINR(kpis.monthlyRevenue)} delta="+12%" accent="info"/>
          <StatCard icon={Activity}     label="Today's Appts"   value={kpis.activeAppointments} delta="+5" accent="brand"/>
          <StatCard icon={Clock}        label="Avg Wait"        value={`${kpis.avgWaitMin} min`} delta="-3 min" accent="ai"/>
>>>>>>> main
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <h3 className="font-display font-semibold mb-3">Daily revenue</h3>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.revenueTrend}>
<<<<<<< HEAD
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
                <Bar dataKey="value" fill="var(--brand)" radius={[8, 8, 0, 0]} />
=======
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false}/>
                <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={11}/>
                <YAxis stroke="var(--muted-foreground)" fontSize={11} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`}/>
                <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, fontSize: 12 }} formatter={(v) => formatINR(v)}/>
                <Bar dataKey="value" fill="var(--brand)" radius={[8,8,0,0]}/>
>>>>>>> main
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <h3 className="font-display font-semibold mb-3">Patient flow</h3>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={charts.patientFlow}>
<<<<<<< HEAD
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
=======
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false}/>
                <XAxis dataKey="hour" stroke="var(--muted-foreground)" fontSize={11}/>
                <YAxis stroke="var(--muted-foreground)" fontSize={11}/>
                <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, fontSize: 12 }}/>
                <Line type="monotone" dataKey="visits" stroke="var(--ai)" strokeWidth={2.5} dot={{ r: 3 }}/>
>>>>>>> main
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <h3 className="font-display font-semibold mb-3">Department mix</h3>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
<<<<<<< HEAD
                <Pie
                  data={charts.departmentMix}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={85}
                  paddingAngle={2}
                >
                  {charts.departmentMix.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
=======
                <Pie data={charts.departmentMix} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85} paddingAngle={2}>
                  {charts.departmentMix.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]}/>)}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, fontSize: 12 }}/>
>>>>>>> main
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-1.5 mt-2 text-xs">
            {charts.departmentMix.map((d, i) => (
<<<<<<< HEAD
              <div key={d.name} className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: COLORS[i % COLORS.length] }}
                ></span>
                {d.name} <span className="text-muted-foreground ml-auto">{d.value}%</span>
              </div>
=======
              <div key={d.name} className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full" style={{background: COLORS[i%COLORS.length]}}></span>{d.name} <span className="text-muted-foreground ml-auto">{d.value}%</span></div>
>>>>>>> main
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <h3 className="font-display font-semibold mb-3">Patient satisfaction (avg / 5)</h3>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={charts.satisfaction}>
<<<<<<< HEAD
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="week" stroke="var(--muted-foreground)" fontSize={11} />
                <YAxis domain={[4, 5]} stroke="var(--muted-foreground)" fontSize={11} />
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
                  dataKey="score"
                  stroke="var(--info)"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
=======
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false}/>
                <XAxis dataKey="week" stroke="var(--muted-foreground)" fontSize={11}/>
                <YAxis domain={[4, 5]} stroke="var(--muted-foreground)" fontSize={11}/>
                <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, fontSize: 12 }}/>
                <Line type="monotone" dataKey="score" stroke="var(--info)" strokeWidth={2.5} dot={{ r: 4 }}/>
>>>>>>> main
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
