import { AlertTriangle, RefreshCw } from 'lucide-react';
export default function ErrorState({ message = 'Something went wrong', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-12 h-12 rounded-full bg-[color-mix(in_oklab,var(--danger)_15%,white)] flex items-center justify-center text-[var(--danger)]">
        <AlertTriangle size={20} />
      </div>
      <div className="mt-3 font-medium">{message}</div>
      {onRetry && (
        <button onClick={onRetry} className="mt-4 inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg bg-[var(--brand)] text-white hover:bg-[var(--brand-hover)]">
          <RefreshCw size={14} /> Try again
        </button>
      )}
    </div>
  );
}
