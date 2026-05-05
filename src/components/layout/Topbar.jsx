import { Bell, Search, Menu } from 'lucide-react';
import Avatar from '../ui/Avatar';
import { useAuth } from '../../context/AuthContext';

export default function Topbar({ onOpenMobile }) {
  const { user, clinicInfo } = useAuth();
  return (
    <header className="sticky top-0 z-30 h-[60px] bg-card/80 backdrop-blur border-b border-border flex items-center px-4 md:px-6 gap-4">
      <button onClick={onOpenMobile} className="md:hidden p-1.5 rounded-md hover:bg-surface-alt"><Menu size={20} /></button>
      <div className="flex items-center gap-2 text-sm">
        <span className="font-display font-semibold">NexaCare</span>
        <span className="text-muted-foreground">|</span>
        <span className="text-muted-foreground hidden sm:inline">{clinicInfo?.name}, {clinicInfo?.location}</span>
      </div>
      <div className="ml-auto flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 bg-surface-alt rounded-lg px-3 py-1.5 w-72">
          <Search size={14} className="text-muted-foreground" />
          <input placeholder="Search patients, invoices, drugs…" className="bg-transparent text-sm outline-none flex-1 placeholder:text-muted-foreground" />
        </div>
        <button className="relative p-2 rounded-lg hover:bg-surface-alt">
          <Bell size={18} />
          <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[var(--danger)] text-white text-[9px] flex items-center justify-center font-semibold">3</span>
        </button>
        <div className="flex items-center gap-2 pl-3 border-l border-border">
          <Avatar name={user?.name} size={32} />
          <div className="hidden sm:block">
            <div className="text-xs font-semibold leading-tight">{user?.name}</div>
            <div className="text-[10px] text-muted-foreground">{user?.role}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
