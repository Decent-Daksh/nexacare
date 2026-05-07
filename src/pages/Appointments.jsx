import { useState } from "react";
import { LayoutGrid, List, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { useAppointments } from "../hooks/useAppointments";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ErrorState from "../components/ui/ErrorState";
import Badge from "../components/ui/Badge";
import Avatar from "../components/ui/Avatar";
import { useToast } from "../context/ToastContext";

const HOURS = ["09:00", "10:00", "11:00", "12:00", "15:00", "16:00", "17:00"];
const DAYS = [
  { key: "2026-05-04", label: "Mon 4" },
  { key: "2026-05-05", label: "Tue 5" },
  { key: "2026-05-06", label: "Wed 6" },
  { key: "2026-05-07", label: "Thu 7" },
  { key: "2026-05-08", label: "Fri 8" },
  { key: "2026-05-09", label: "Sat 9" },
];

export default function Appointments() {
  const [view, setView] = useState("week");
  const { data, loading, error, refetch, createAppointment } = useAppointments();
  const { showToast } = useToast();

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  const find = (date, hour) =>
    data.find((a) => a.date === date && a.time.startsWith(hour.split(":")[0]));

  const book = async () => {
    await createAppointment({
      patientName: "Walk-in Patient",
      doctor: "Dr. Arjun Mehta",
      date: "2026-05-04",
      time: "17:30",
      type: "Consultation",
      noShowRisk: "Low",
    });
    showToast("Appointment booked", "success");
  };

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-display font-bold">Appointments</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Live schedule with AI no-show risk scoring.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-surface rounded-lg p-1 border border-border">
            <button
              onClick={() => setView("week")}
              className={`px-3 py-1.5 text-xs font-medium rounded-md flex items-center gap-1.5 ${view === "week" ? "bg-card shadow-sm" : "text-muted-foreground"}`}
            >
              <LayoutGrid size={13} />
              Week
            </button>
            <button
              onClick={() => setView("list")}
              className={`px-3 py-1.5 text-xs font-medium rounded-md flex items-center gap-1.5 ${view === "list" ? "bg-card shadow-sm" : "text-muted-foreground"}`}
            >
              <List size={13} />
              List
            </button>
          </div>
          <button
            onClick={book}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--brand)] text-white rounded-lg text-sm font-medium hover:bg-[var(--brand-hover)]"
          >
            <Plus size={16} />
            New
          </button>
        </div>
      </div>

      {view === "week" ? (
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="font-medium text-sm">Week of May 4 – May 9, 2026</div>
            <div className="flex gap-1">
              <button className="p-1.5 rounded-md hover:bg-surface-alt">
                <ChevronLeft size={16} />
              </button>
              <button className="p-1.5 rounded-md hover:bg-surface-alt">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <div
              className="min-w-[800px] grid"
              style={{ gridTemplateColumns: "70px repeat(6, 1fr)" }}
            >
              <div></div>
              {DAYS.map((d) => (
                <div
                  key={d.key}
                  className="px-3 py-2 text-xs font-semibold text-center border-l border-border bg-surface"
                >
                  {d.label}
                </div>
              ))}
              {HOURS.map((h) => (
                <>
                  <div
                    key={`h-${h}`}
                    className="px-3 py-3 text-xs text-muted-foreground text-right border-t border-border"
                  >
                    {h}
                  </div>
                  {DAYS.map((d) => {
                    const appt = find(d.key, h);
                    return (
                      <div
                        key={`${d.key}-${h}`}
                        className="border-t border-l border-border min-h-[60px] p-1.5"
                      >
                        {appt && (
                          <div
                            className={`rounded-lg p-2 text-[11px] ${
                              appt.noShowRisk === "High"
                                ? "bg-[color-mix(in_oklab,var(--danger)_12%,white)] border-l-2 border-l-[var(--danger)]"
                                : "bg-secondary border-l-2 border-l-[var(--brand)]"
                            }`}
                          >
                            <div className="font-semibold truncate">{appt.patientName}</div>
                            <div className="text-muted-foreground truncate">{appt.type}</div>
                            {appt.noShowRisk === "High" && (
                              <div className="mt-1">
                                <Badge variant="danger">{appt.noShowRisk} risk</Badge>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface text-xs text-muted-foreground uppercase">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Time</th>
                <th className="text-left px-4 py-3 font-medium">Patient</th>
                <th className="text-left px-4 py-3 font-medium">Doctor</th>
                <th className="text-left px-4 py-3 font-medium">Type</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium">No-show Risk</th>
              </tr>
            </thead>
            <tbody>
              {data.map((a, i) => (
                <tr key={a.id} className={`hover:bg-surface-alt ${i % 2 ? "bg-surface/40" : ""}`}>
                  <td className="px-4 py-3 font-mono text-xs">
                    {a.date} {a.time}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Avatar name={a.patientName} size={28} />
                      {a.patientName}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{a.doctor}</td>
                  <td className="px-4 py-3">{a.type}</td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={
                        a.status === "Confirmed"
                          ? "success"
                          : a.status === "In-Progress"
                            ? "info"
                            : "warning"
                      }
                    >
                      {a.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={
                        a.noShowRisk === "High"
                          ? "danger"
                          : a.noShowRisk === "Medium"
                            ? "warning"
                            : "success"
                      }
                    >
                      {a.noShowRisk}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
