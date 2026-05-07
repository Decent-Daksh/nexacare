export default function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex gap-1 border-b border-border">
      {tabs.map((t) => (
        <button
          key={t.value}
          onClick={() => onChange(t.value)}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
            active === t.value
              ? "border-[var(--brand)] text-[var(--brand-active)]"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          {t.label}
          {t.count !== undefined && (
            <span className="ml-2 text-xs bg-surface-alt px-1.5 py-0.5 rounded-full">
              {t.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
