<<<<<<< HEAD
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function StatCard({
  icon: Icon,
  label,
  value,
  delta,
  deltaType = "up",
  accent = "brand",
  sublabel,
}) {
  const accents = {
    brand: "text-[var(--brand)] bg-secondary",
    ai: "text-[var(--ai)] bg-ai-soft",
    info: "text-[var(--info)] bg-info-soft",
    warn: "text-[oklch(0.55_0.15_75)] bg-[color-mix(in_oklab,var(--warning)_18%,white)]",
=======
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function StatCard({ icon: Icon, label, value, delta, deltaType = 'up', accent = 'brand', sublabel }) {
  const accents = {
    brand: 'text-[var(--brand)] bg-secondary',
    ai:    'text-[var(--ai)] bg-ai-soft',
    info:  'text-[var(--info)] bg-info-soft',
    warn:  'text-[oklch(0.55_0.15_75)] bg-[color-mix(in_oklab,var(--warning)_18%,white)]',
>>>>>>> main
  };
  return (
    <div className="card-lift bg-card rounded-xl border border-border p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs text-muted-foreground font-medium">{label}</div>
          <div className="mt-2 text-2xl font-display font-semibold text-foreground">{value}</div>
          {sublabel && <div className="text-xs text-muted-foreground mt-1">{sublabel}</div>}
        </div>
        {Icon && (
<<<<<<< HEAD
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${accents[accent]}`}
          >
=======
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${accents[accent]}`}>
>>>>>>> main
            <Icon size={18} />
          </div>
        )}
      </div>
      {delta !== undefined && (
<<<<<<< HEAD
        <div
          className={`mt-3 inline-flex items-center gap-1 text-xs font-medium ${deltaType === "up" ? "text-[var(--success)]" : "text-[var(--danger)]"}`}
        >
          {deltaType === "up" ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
=======
        <div className={`mt-3 inline-flex items-center gap-1 text-xs font-medium ${deltaType === 'up' ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
          {deltaType === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
>>>>>>> main
          {delta}
        </div>
      )}
    </div>
  );
}
