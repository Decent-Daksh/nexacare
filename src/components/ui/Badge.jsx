<<<<<<< HEAD
export default function Badge({ children, variant = "default", className = "" }) {
  const styles = {
    default: "bg-surface-alt text-foreground",
    success: "bg-[color-mix(in_oklab,var(--success)_15%,white)] text-[var(--success)]",
    danger: "bg-[color-mix(in_oklab,var(--danger)_15%,white)] text-[var(--danger)]",
    warning: "bg-[color-mix(in_oklab,var(--warning)_18%,white)] text-[oklch(0.55_0.15_75)]",
    info: "bg-info-soft text-[var(--info)]",
    brand: "bg-secondary text-[var(--brand-active)]",
    ai: "bg-ai-soft text-[var(--ai)]",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] uppercase font-semibold tracking-wide ${styles[variant] || styles.default} ${className}`}
    >
=======
export default function Badge({ children, variant = 'default', className = '' }) {
  const styles = {
    default: 'bg-surface-alt text-foreground',
    success: 'bg-[color-mix(in_oklab,var(--success)_15%,white)] text-[var(--success)]',
    danger:  'bg-[color-mix(in_oklab,var(--danger)_15%,white)] text-[var(--danger)]',
    warning: 'bg-[color-mix(in_oklab,var(--warning)_18%,white)] text-[oklch(0.55_0.15_75)]',
    info:    'bg-info-soft text-[var(--info)]',
    brand:   'bg-secondary text-[var(--brand-active)]',
    ai:      'bg-ai-soft text-[var(--ai)]',
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] uppercase font-semibold tracking-wide ${styles[variant] || styles.default} ${className}`}>
>>>>>>> main
      {children}
    </span>
  );
}
