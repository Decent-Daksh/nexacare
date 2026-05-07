import { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, XCircle, Info, AlertTriangle } from "lucide-react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "info") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3200);
  }, []);

  const iconFor = (type) => {
    if (type === "success") return <CheckCircle2 size={18} className="text-[var(--success)]" />;
    if (type === "error") return <XCircle size={18} className="text-[var(--danger)]" />;
    if (type === "warning") return <AlertTriangle size={18} className="text-[var(--warning)]" />;
    return <Info size={18} className="text-[var(--info)]" />;
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="flex items-start gap-3 bg-white border border-border shadow-lg rounded-xl px-4 py-3 min-w-[260px] max-w-sm animate-in fade-in slide-in-from-right-4"
          >
            {iconFor(t.type)}
            <div className="text-sm text-foreground">{t.message}</div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
