import { Settings, Database, Bell, Lock, Building2 } from "lucide-react";

export default function SettingsPage() {
  const items = [
    { 
      icon: Building2, 
      title: "Clinic Profile", 
      desc: "Name, location, branding, working hours" 
    },
    { 
      icon: Lock, 
      title: "Security & Access", 
      desc: "Roles, permissions, audit logs" 
    },
    { 
      icon: Bell, 
      title: "Notifications", 
      desc: "Email, SMS and WhatsApp preferences" 
    },
    { 
      icon: Database, 
      title: "Integrations", 
      desc: "ABDM, payment gateways, lab vendors" 
    },
    { 
      icon: Settings, 
      title: "System", 
      desc: "Backups, exports, theme" 
    },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-display font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configure your clinic, integrations and preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((it) => (
          <div
            key={it.title}
            className="card-lift bg-card border border-border rounded-xl p-5 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-secondary text-[var(--brand)] flex items-center justify-center mb-3">
              <it.icon size={18} />
            </div>
            <div className="font-display font-semibold">{it.title}</div>
            <div className="text-xs text-muted-foreground mt-1">{it.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}