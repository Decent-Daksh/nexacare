<<<<<<< HEAD
import { IndianRupee, FileText, TrendingUp, ShieldCheck } from "lucide-react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import { useRevenue } from "../hooks/useRevenue";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ErrorState from "../components/ui/ErrorState";
import StatCard from "../components/ui/StatCard";
import Badge from "../components/ui/Badge";
import { formatINR } from "../lib/format";
=======
import { IndianRupee, FileText, TrendingUp, ShieldCheck } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { useRevenue } from '../hooks/useRevenue';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorState from '../components/ui/ErrorState';
import StatCard from '../components/ui/StatCard';
import Badge from '../components/ui/Badge';
import { formatINR } from '../lib/format';
>>>>>>> main

export default function RevenueEngine() {
  const { invoices, claims, forecast, loading, error, refetch } = useRevenue();

<<<<<<< HEAD
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  const collected = invoices.filter((i) => i.status === "Paid").reduce((s, i) => s + i.amount, 0);
  const pending = invoices.filter((i) => i.status !== "Paid").reduce((s, i) => s + i.amount, 0);
  const claimAmt = claims.reduce((s, c) => s + c.amount, 0);
=======
  if (loading) return <LoadingSpinner/>;
  if (error) return <ErrorState message={error} onRetry={refetch}/>;

  const collected = invoices.filter(i => i.status === 'Paid').reduce((s,i) => s + i.amount, 0);
  const pending   = invoices.filter(i => i.status !== 'Paid').reduce((s,i) => s + i.amount, 0);
  const claimAmt  = claims.reduce((s,c) => s + c.amount, 0);
>>>>>>> main

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-display font-bold">Revenue Engine</h1>
<<<<<<< HEAD
        <p className="text-sm text-muted-foreground mt-1">
          Invoices, insurance claims and AI revenue forecasting.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={IndianRupee}
          label="Collected (MTD)"
          value={formatINR(collected)}
          delta="+12%"
          accent="brand"
        />
        <StatCard icon={FileText} label="Outstanding" value={formatINR(pending)} accent="warn" />
        <StatCard
          icon={ShieldCheck}
          label="Claims in flight"
          value={formatINR(claimAmt)}
          accent="info"
        />
        <StatCard
          icon={TrendingUp}
          label="Forecast (Jun)"
          value={formatINR(612000)}
          delta="+8.5%"
          accent="ai"
        />
=======
        <p className="text-sm text-muted-foreground mt-1">Invoices, insurance claims and AI revenue forecasting.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={IndianRupee} label="Collected (MTD)" value={formatINR(collected)} delta="+12%" accent="brand"/>
        <StatCard icon={FileText}    label="Outstanding"     value={formatINR(pending)} accent="warn"/>
        <StatCard icon={ShieldCheck} label="Claims in flight" value={formatINR(claimAmt)} accent="info"/>
        <StatCard icon={TrendingUp}  label="Forecast (Jun)"  value={formatINR(612000)} delta="+8.5%" accent="ai"/>
>>>>>>> main
      </div>

      <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
        <h3 className="font-display font-semibold mb-1">Revenue forecast</h3>
        <p className="text-xs text-muted-foreground mb-3">Actuals vs ML projection</p>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={forecast}>
<<<<<<< HEAD
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={11} />
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
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line
                type="monotone"
                dataKey="revenue"
                name="Actual"
                stroke="var(--brand)"
                strokeWidth={2.5}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="forecast"
                name="Forecast"
                stroke="var(--ai)"
                strokeWidth={2.5}
                strokeDasharray="5 5"
                dot={{ r: 3 }}
              />
=======
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false}/>
              <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={11}/>
              <YAxis stroke="var(--muted-foreground)" fontSize={11} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`}/>
              <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, fontSize: 12 }} formatter={(v) => formatINR(v)}/>
              <Legend wrapperStyle={{ fontSize: 12 }}/>
              <Line type="monotone" dataKey="revenue" name="Actual" stroke="var(--brand)" strokeWidth={2.5} dot={{ r: 3 }}/>
              <Line type="monotone" dataKey="forecast" name="Forecast" stroke="var(--ai)" strokeWidth={2.5} strokeDasharray="5 5" dot={{ r: 3 }}/>
>>>>>>> main
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
<<<<<<< HEAD
          <div className="px-5 py-4 border-b border-border">
            <h3 className="font-display font-semibold">Recent invoices</h3>
          </div>
=======
          <div className="px-5 py-4 border-b border-border"><h3 className="font-display font-semibold">Recent invoices</h3></div>
>>>>>>> main
          <table className="w-full text-sm">
            <thead className="bg-surface text-xs text-muted-foreground uppercase">
              <tr>
                <th className="text-left px-4 py-2 font-medium">Invoice</th>
                <th className="text-left px-4 py-2 font-medium">Patient</th>
                <th className="text-right px-4 py-2 font-medium">Amount</th>
                <th className="text-left px-4 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv, i) => (
<<<<<<< HEAD
                <tr key={inv.id} className={`hover:bg-surface-alt ${i % 2 ? "bg-surface/40" : ""}`}>
                  <td className="px-4 py-2 font-mono text-xs">{inv.id}</td>
                  <td className="px-4 py-2">{inv.patientName}</td>
                  <td className="px-4 py-2 text-right font-mono">{formatINR(inv.amount)}</td>
                  <td className="px-4 py-2">
                    <Badge
                      variant={
                        inv.status === "Paid"
                          ? "success"
                          : inv.status === "Pending"
                            ? "warning"
                            : "danger"
                      }
                    >
                      {inv.status}
                    </Badge>
                  </td>
=======
                <tr key={inv.id} className={`hover:bg-surface-alt ${i % 2 ? 'bg-surface/40' : ''}`}>
                  <td className="px-4 py-2 font-mono text-xs">{inv.id}</td>
                  <td className="px-4 py-2">{inv.patientName}</td>
                  <td className="px-4 py-2 text-right font-mono">{formatINR(inv.amount)}</td>
                  <td className="px-4 py-2"><Badge variant={inv.status === 'Paid' ? 'success' : inv.status === 'Pending' ? 'warning' : 'danger'}>{inv.status}</Badge></td>
>>>>>>> main
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
<<<<<<< HEAD
          <div className="px-5 py-4 border-b border-border">
            <h3 className="font-display font-semibold">Insurance claims</h3>
          </div>
          <div className="divide-y divide-border">
            {claims.map((c) => (
=======
          <div className="px-5 py-4 border-b border-border"><h3 className="font-display font-semibold">Insurance claims</h3></div>
          <div className="divide-y divide-border">
            {claims.map(c => (
>>>>>>> main
              <div key={c.id} className="p-4 flex items-center justify-between gap-3">
                <div>
                  <div className="font-mono text-xs text-muted-foreground">{c.id}</div>
                  <div className="font-medium text-sm">{c.patientName}</div>
<<<<<<< HEAD
                  <div className="text-xs text-muted-foreground">
                    {c.insurer} • {c.submittedOn}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-semibold">{formatINR(c.amount)}</div>
                  <Badge
                    variant={
                      c.status === "Approved"
                        ? "success"
                        : c.status === "Rejected"
                          ? "danger"
                          : "warning"
                    }
                  >
                    {c.status}
                  </Badge>
=======
                  <div className="text-xs text-muted-foreground">{c.insurer} • {c.submittedOn}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-semibold">{formatINR(c.amount)}</div>
                  <Badge variant={c.status === 'Approved' ? 'success' : c.status === 'Rejected' ? 'danger' : 'warning'}>{c.status}</Badge>
>>>>>>> main
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
