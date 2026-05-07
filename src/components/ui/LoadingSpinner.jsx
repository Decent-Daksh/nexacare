import { Loader2 } from "lucide-react";
export default function LoadingSpinner({ label = "Loading…" }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
      <Loader2 size={28} className="animate-spin text-[var(--brand)]" />
      <div className="mt-3 text-sm">{label}</div>
    </div>
  );
}
