import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Sparkles,
  Pill,
  IndianRupee,
  Megaphone,
  BarChart3,
  Video,
  UserCog,
  Settings,
  Activity,
  X,
} from "lucide-react";
import AIBadge from "../ui/AIBadge";

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "patients", label: "Patient Hub", icon: Users },
  { id: "appointments", label: "Appointments", icon: CalendarDays },
  { id: "copilot", label: "AI Co-Pilot", icon: Sparkles, ai: true },
  { id: "pharmiq", label: "PharmIQ", icon: Pill },
  { id: "revenue", label: "Revenue Engine", icon: IndianRupee },
  { id: "crm", label: "CRM & Outreach", icon: Megaphone },
  { id: "analytics", label: "Analytics Hub", icon: BarChart3 },
  { id: "tele", label: "TeleConsult", icon: Video },
  { id: "staff", label: "Staff Command", icon: UserCog },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ active, onNavigate, mobileOpen, onCloseMobile }) {
  return (
    <>
      {mobileOpen && (
        <div onClick={onCloseMobile} className="fixed inset-0 bg-black/40 z-40 md:hidden" />
      )}
      <aside
        className={`fixed md:sticky top-0 h-screen w-60 bg-sidebar border-r border-sidebar-border z-50 flex flex-col transition-transform duration-200 ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="px-5 h-[60px] flex items-center justify-between border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[var(--brand)] to-[var(--ai)] flex items-center justify-center text-white">
              <Activity size={16} />
            </div>
            <div>
              <div className="font-display font-bold text-sm tracking-tight">NexaCare</div>
              <div className="text-[10px] text-muted-foreground -mt-0.5">Care+ OS</div>
            </div>
          </div>
          <button onClick={onCloseMobile} className="md:hidden p-1 rounded hover:bg-surface-alt">
            <X size={18} />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          {NAV.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onCloseMobile?.();
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
                  isActive
                    ? "bg-secondary text-[var(--brand-active)]"
                    : "text-foreground/70 hover:bg-surface-alt hover:text-foreground"
                }`}
              >
                <Icon size={17} className={isActive ? "text-[var(--brand)]" : ""} />
                <span className="flex-1 text-left">{item.label}</span>
                {item.ai && <AIBadge label="AI" />}
              </button>
            );
          })}
        </nav>
        <div className="p-3 border-t border-sidebar-border">
          <div className="rounded-lg bg-secondary p-3">
            <div className="text-xs font-semibold text-[var(--brand-active)]">Sunrise Clinic</div>
            <div className="text-[11px] text-muted-foreground mt-0.5">Growth Plan • v1.0</div>
          </div>
        </div>
      </aside>
    </>
  );
}
