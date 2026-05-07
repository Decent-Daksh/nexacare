import { useState } from "react";
import { Pill, AlertTriangle, ShoppingCart, Search } from "lucide-react";
import { usePharmacy } from "../hooks/usePharmacy";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ErrorState from "../components/ui/ErrorState";
import Badge from "../components/ui/Badge";
import Tabs from "../components/ui/Tabs";
import StatCard from "../components/ui/StatCard";
import { formatINR } from "../lib/format";

export default function PharmIQ() {
  const [tab, setTab] = useState("stock");
  const [q, setQ] = useState("");
  const { stock, alerts, reorderQueue, loading, error, refetch } = usePharmacy();

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  const filtered = stock.filter((s) => s.name.toLowerCase().includes(q.toLowerCase()));
  const lowStock = stock.filter((s) => s.stock < s.reorderLevel).length;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-display font-bold">PharmIQ</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Smart pharmacy inventory with expiry & reorder intelligence.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Pill} label="SKUs Tracked" value={stock.length} accent="brand" />
        <StatCard icon={AlertTriangle} label="Active Alerts" value={alerts.length} accent="warn" />
        <StatCard
          icon={ShoppingCart}
          label="Reorders Pending"
          value={reorderQueue.length}
          accent="info"
        />
        <StatCard icon={Pill} label="Below Reorder" value={lowStock} accent="warn" />
      </div>

      <Tabs
        active={tab}
        onChange={setTab}
        tabs={[
          { value: "stock", label: "Inventory", count: stock.length },
          { value: "alerts", label: "Alerts", count: alerts.length },
          { value: "reorders", label: "Reorder Queue", count: reorderQueue.length },
        ]}
      />

      {tab === "stock" && (
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-xl p-3 flex items-center gap-2">
            <Search size={15} className="text-muted-foreground ml-2" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search drugs…"
              className="bg-transparent outline-none text-sm flex-1"
            />
          </div>
          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-surface text-xs text-muted-foreground uppercase">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Drug</th>
                  <th className="text-left px-4 py-3 font-medium">SKU</th>
                  <th className="text-right px-4 py-3 font-medium">Stock</th>
                  <th className="text-left px-4 py-3 font-medium">Expiry</th>
                  <th className="text-left px-4 py-3 font-medium">Supplier</th>
                  <th className="text-right px-4 py-3 font-medium">Price</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, i) => (
                  <tr key={s.id} className={`hover:bg-surface-alt ${i % 2 ? "bg-surface/40" : ""}`}>
                    <td className="px-4 py-3">
                      <div className="font-medium">{s.name}</div>
                      <div className="text-xs text-muted-foreground">Batch {s.batch}</div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">{s.sku}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="font-semibold">{s.stock}</div>
                      {s.stock < s.reorderLevel && <Badge variant="danger">Low</Badge>}
                    </td>
                    <td className="px-4 py-3 text-xs">{s.expiry}</td>
                    <td className="px-4 py-3 text-muted-foreground">{s.supplier}</td>
                    <td className="px-4 py-3 text-right font-mono">{formatINR(s.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "alerts" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {alerts.map((a) => (
            <div
              key={a.id}
              className="bg-card border border-border rounded-xl p-4 border-l-4 border-l-[var(--warning)] flex items-start gap-3"
            >
              <div className="w-10 h-10 rounded-lg bg-[color-mix(in_oklab,var(--warning)_18%,white)] text-[oklch(0.55_0.15_75)] flex items-center justify-center">
                <AlertTriangle size={16} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="warning">{a.kind}</Badge>
                </div>
                <div className="font-medium text-sm">{a.drug}</div>
                <div className="text-xs text-muted-foreground">{a.detail}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "reorders" && (
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface text-xs text-muted-foreground uppercase">
              <tr>
                <th className="text-left px-4 py-3 font-medium">PO ID</th>
                <th className="text-left px-4 py-3 font-medium">Drug</th>
                <th className="text-right px-4 py-3 font-medium">Qty</th>
                <th className="text-left px-4 py-3 font-medium">Supplier</th>
                <th className="text-left px-4 py-3 font-medium">ETA</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {reorderQueue.map((r, i) => (
                <tr key={r.id} className={`hover:bg-surface-alt ${i % 2 ? "bg-surface/40" : ""}`}>
                  <td className="px-4 py-3 font-mono text-xs">{r.id}</td>
                  <td className="px-4 py-3 font-medium">{r.drug}</td>
                  <td className="px-4 py-3 text-right">{r.quantity}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.supplier}</td>
                  <td className="px-4 py-3 text-xs">{r.eta}</td>
                  <td className="px-4 py-3">
                    <Badge variant={r.status === "Approved" ? "success" : "warning"}>
                      {r.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
