import { X } from 'lucide-react';
import { useEffect } from 'react';

export default function SlidePanel({ open, onClose, title, children, width = 'max-w-md' }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <>
      <div onClick={onClose} className={`fixed inset-0 bg-black/30 z-40 transition-opacity ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} />
      <aside className={`fixed top-0 right-0 h-full w-full ${width} bg-card border-l border-border shadow-2xl z-50 transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="font-display font-semibold text-base">{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-md hover:bg-surface-alt"><X size={18} /></button>
        </div>
        <div className="overflow-y-auto h-[calc(100%-60px)] p-5">{children}</div>
      </aside>
    </>
  );
}
