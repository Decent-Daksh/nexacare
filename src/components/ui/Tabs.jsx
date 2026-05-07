export default function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex gap-1 border-b border-border">
<<<<<<< HEAD
      {tabs.map((t) => (
=======
      {tabs.map(t => (
>>>>>>> main
        <button
          key={t.value}
          onClick={() => onChange(t.value)}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
            active === t.value
<<<<<<< HEAD
              ? "border-[var(--brand)] text-[var(--brand-active)]"
              : "border-transparent text-muted-foreground hover:text-foreground"
=======
              ? 'border-[var(--brand)] text-[var(--brand-active)]'
              : 'border-transparent text-muted-foreground hover:text-foreground'
>>>>>>> main
          }`}
        >
          {t.label}
          {t.count !== undefined && (
<<<<<<< HEAD
            <span className="ml-2 text-xs bg-surface-alt px-1.5 py-0.5 rounded-full">
              {t.count}
            </span>
=======
            <span className="ml-2 text-xs bg-surface-alt px-1.5 py-0.5 rounded-full">{t.count}</span>
>>>>>>> main
          )}
        </button>
      ))}
    </div>
  );
}
