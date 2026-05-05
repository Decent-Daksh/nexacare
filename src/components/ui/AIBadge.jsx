import { Sparkles } from 'lucide-react';
export default function AIBadge({ label = 'AI', className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] uppercase font-semibold tracking-wide bg-ai-soft text-[var(--ai)] border border-[color-mix(in_oklab,var(--ai)_30%,transparent)] ${className}`}>
      <Sparkles size={10} /> {label}
    </span>
  );
}
