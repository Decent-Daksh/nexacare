import { useState, useEffect } from "react";
import { Video, Mic, MicOff, VideoOff, PhoneOff, Sparkles, Users } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "../lib/auth";
import { useTeleConsult } from "../hooks/useTeleConsult";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ErrorState from "../components/ui/ErrorState";
import Badge from "../components/ui/Badge";
import Avatar from "../components/ui/Avatar";
import AIBadge from "../components/ui/AIBadge";

export default function TeleConsult() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { sessions, loading, error, refetch, endSession } = useTeleConsult();
  
  const [muted, setMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);

  // Role check: Redirect managers to unauthorized page immediately
  useEffect(() => {
    if (user && user.role === "manager") {
      navigate({ to: "/unauthorized" });
    }
  }, [user, navigate]);

  const live = sessions.find((s) => s.status === "Live");

  // Prevent rendering content for managers before the redirect occurs
  if (loading || (user && user.role === "manager")) return <LoadingSpinner />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-display font-bold">TeleConsult</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Secure video consultations with in-call AI assistance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="aspect-video bg-gradient-to-br from-[oklch(0.25_0.04_250)] to-[oklch(0.15_0.04_250)] relative flex items-center justify-center">
            {live ? (
              <>
                <div className="text-white text-center">
                  <Avatar name={live.patientName} size={80} />
                  <div className="mt-3 font-semibold">{live.patientName}</div>
                  <div className="text-xs opacity-70">in call • 04:32</div>
                </div>
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <Badge variant="danger">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span> Live
                  </Badge>
                </div>
                <div className="absolute bottom-3 right-3 w-32 aspect-video bg-[oklch(0.2_0.04_250)] rounded-lg border border-white/20 flex items-center justify-center text-white text-xs">
                  You (Dr. Priya)
                </div>
              </>
            ) : (
              <div className="text-white/70 text-center text-sm">
                <Video size={32} className="mx-auto mb-2" />
                No active call
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-center gap-3 py-4 bg-card border-t border-border">
            <button
              onClick={() => setMuted(!muted)}
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors ${
                muted ? "bg-[var(--danger)] text-white" : "bg-surface-alt"
              }`}
            >
              {muted ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
            <button
              onClick={() => setCamOff(!camOff)}
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors ${
                camOff ? "bg-[var(--danger)] text-white" : "bg-surface-alt"
              }`}
            >
              {camOff ? <VideoOff size={18} /> : <Video size={18} />}
            </button>
            <button
              onClick={() => live && endSession(live.id)}
              className="px-5 h-11 rounded-full bg-[var(--danger)] text-white inline-flex items-center gap-2 font-medium text-sm hover:opacity-90 transition-opacity"
            >
              <PhoneOff size={16} />
              End
            </button>
          </div>
        </div>

        {/* AI Assistant Sidebar */}
        <div className="bg-card border border-border rounded-xl shadow-sm border-l-4 border-l-[var(--ai)] p-5">
          <div className="flex items-center gap-2 mb-3">
            <AIBadge />
            <h3 className="font-display font-semibold">In-call assistant</h3>
          </div>
          <div className="space-y-4 text-sm">
            <div className="bg-ai-soft rounded-lg p-3">
              <div className="text-xs font-semibold text-[var(--ai)] mb-1">Live transcript</div>
              <p className="text-xs leading-relaxed italic">
                "…cough has been worse at night for the past week. No fever today but I felt warm yesterday…"
              </p>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase text-muted-foreground mb-1.5">
                Suggested questions
              </div>
              <ul className="space-y-2 text-xs">
                <li className="flex gap-2">
                  <Sparkles size={12} className="text-[var(--ai)] mt-0.5" />
                  Any colored sputum or blood?
                </li>
                <li className="flex gap-2">
                  <Sparkles size={12} className="text-[var(--ai)] mt-0.5" />
                  Recent travel or sick contacts?
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Sessions Table */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center gap-2">
          <Users size={16} />
          <h3 className="font-display font-semibold">Recent Sessions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface text-xs text-muted-foreground uppercase">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Session</th>
                <th className="text-left px-4 py-3 font-medium">Patient</th>
                <th className="text-left px-4 py-3 font-medium">Doctor</th>
                <th className="text-left px-4 py-3 font-medium text-nowrap">Scheduled</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((s, i) => (
                <tr key={s.id} className={`hover:bg-surface-alt transition-colors ${i % 2 ? "bg-surface/40" : ""}`}>
                  <td className="px-4 py-3 font-mono text-xs">{s.id}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Avatar name={s.patientName} size={28} />
                      {s.patientName}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{s.doctor}</td>
                  <td className="px-4 py-3 text-xs">{s.scheduled}</td>
                  <td className="px-4 py-3">
                    <Badge variant={s.status === "Live" ? "danger" : s.status === "Upcoming" ? "info" : "success"}>
                      {s.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}