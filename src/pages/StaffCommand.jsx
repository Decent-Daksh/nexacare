import { UserCog, Users, Calendar, IndianRupee } from "lucide-react";
import { useState } from "react";
import { useStaff } from "../hooks/useStaff";
import { useStaffDetail } from "../hooks/useStaffDetail";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ErrorState from "../components/ui/ErrorState";
import StatCard from "../components/ui/StatCard";
import Badge from "../components/ui/Badge";
import Avatar from "../components/ui/Avatar";
import SlidePanel from "../components/ui/SlidePanel";
import DocumentVault from "../components/ui/DocumentVault";
import PayrollHistory from "../components/ui/PayrollHistory";
import PerformanceTimeline from "../components/ui/PerformanceTimeline";
import DailyAttendance from "../components/staff/DailyAttendance"; // From main
import { formatINR } from "../lib/format";

const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

const shiftStyle = (s) => {
  if (s === "Off") return "bg-surface text-muted-foreground";
  if (s === "Morning") return "bg-[color-mix(in_oklab,var(--info)_18%,white)] text-[var(--info)]";
  if (s === "Evening") return "bg-[color-mix(in_oklab,var(--ai)_18%,white)] text-[var(--ai)]";
  if (s === "Half") return "bg-[color-mix(in_oklab,var(--warning)_18%,white)] text-[oklch(0.55_0.15_75)]";
  return "bg-secondary text-[var(--brand-active)]";
};

export default function StaffCommand() {
  const [selectedStaffId, setSelectedStaffId] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  
  const { staff, shifts, attendance, loading, error, refetch } = useStaff();
  const { staff: staffDetail } = useStaffDetail(selectedStaffId);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  const totalPayroll = staff.reduce((s, p) => s + p.salary, 0);
  const attMap = Object.fromEntries(attendance.map((a) => [a.staffId, a]));
  const shiftMap = Object.fromEntries(shifts.map((s) => [s.staffId, s]));

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-display font-bold">Staff Command</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Roster, shift planning, attendance and payroll.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Staff" value={staff.length} accent="brand" />
        <StatCard icon={Calendar} label="On Shift Today" value={staff.length - 1} accent="info" />
        <StatCard icon={UserCog} label="Avg Attendance" value="94%" accent="brand" />
        <StatCard icon={IndianRupee} label="Monthly Payroll" value={formatINR(totalPayroll)} accent="ai" />
      </div>

      {/* Integration: DailyAttendance component from the 'main' branch */}
      <DailyAttendance staff={staff} />

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="font-display font-semibold">Roster</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface text-xs text-muted-foreground uppercase">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Staff</th>
                <th className="text-left px-4 py-3 font-medium">Role</th>
                <th className="text-left px-4 py-3 font-medium">Phone</th>
                <th className="text-right px-4 py-3 font-medium">Salary</th>
                <th className="text-left px-4 py-3 font-medium">Joined</th>
                <th className="text-left px-4 py-3 font-medium">Attendance</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((p, i) => {
                const a = attMap[p.id];
                const pct = a ? Math.round((a.present / (a.present + a.absent + a.leave)) * 100) : 0;
                return (
                  <tr
                    key={p.id}
                    onClick={() => setSelectedStaffId(p.id)}
                    className={`cursor-pointer hover:bg-surface-alt transition-colors ${i % 2 ? "bg-surface/40" : ""}`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={p.name} size={34} />
                        <div className="font-medium">{p.name}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{p.role}</td>
                    <td className="px-4 py-3 font-mono text-xs">{p.phone}</td>
                    <td className="px-4 py-3 text-right font-mono">{formatINR(p.salary)}</td>
                    <td className="px-4 py-3 text-xs">{p.joined}</td>
                    <td className="px-4 py-3">
                      <Badge variant={pct >= 95 ? "success" : pct >= 85 ? "info" : "warning"}>
                        {pct}%
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Weekly Shift Grid */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="font-display font-semibold">Weekly shift grid</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface text-xs text-muted-foreground uppercase">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Staff</th>
                {DAYS.map((d) => (
                  <th key={d} className="px-2 py-3 font-medium text-center">
                    {d.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {staff.map((p, i) => {
                const sh = shiftMap[p.id] || {};
                return (
                  <tr key={p.id} className={`${i % 2 ? "bg-surface/40" : ""}`}>
                    <td className="px-4 py-2 font-medium">{p.name}</td>
                    {DAYS.map((d) => (
                      <td key={d} className="px-2 py-2 text-center">
                        <span className={`inline-block px-2 py-1 rounded-md text-[10px] font-semibold ${shiftStyle(sh[d])}`}>
                          {sh[d] || "—"}
                        </span>
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed SlidePanel from HEAD */}
      <SlidePanel
        open={!!selectedStaffId}
        onClose={() => {
          setSelectedStaffId(null);
          setActiveTab("profile");
        }}
        title={staffDetail?.name || "Staff Profile"}
        width="max-w-2xl"
      >
        {staffDetail && (
          <div className="space-y-5">
            <div className="flex gap-1 border-b border-border overflow-x-auto">
              {["profile", "documents", "payroll", "performance"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors capitalize ${
                    activeTab === tab ? "border-[var(--brand)] text-[var(--brand)]" : "border-transparent text-muted-foreground"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === "profile" && (
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <Avatar name={staffDetail.name} size={64} />
                  <div>
                    <h2 className="text-lg font-semibold">{staffDetail.name}</h2>
                    <p className="text-sm text-muted-foreground">{staffDetail.role}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-surface rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">Email</p>
                    <p className="font-medium text-sm break-all">{staffDetail.email}</p>
                  </div>
                  <div className="bg-surface rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">Phone</p>
                    <p className="font-medium text-sm">{staffDetail.phone}</p>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === "documents" && <DocumentVault staffId={selectedStaffId} />}
            {activeTab === "payroll" && <PayrollHistory staffId={selectedStaffId} />}
            {activeTab === "performance" && <PerformanceTimeline staffId={selectedStaffId} />}
          </div>
        )}
      </SlidePanel>
    </div>
  );
}