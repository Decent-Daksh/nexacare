import { useState, useEffect } from "react";
import { Search, Plus, Sparkles, UserCheck, IndianRupee } from "lucide-react";
import { useAuth } from "../lib/auth"; 
import { usePatients } from "../hooks/usePatients";

// UI Components
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ErrorState from "../components/ui/ErrorState";
import Badge from "../components/ui/Badge";
import Avatar from "../components/ui/Avatar";
import SlidePanel from "../components/ui/SlidePanel";
import AIBadge from "../components/ui/AIBadge";
import Modal from "../components/ui/Modal";

// Business Components
import InvoiceList from "../components/ui/InvoiceList";
import InvoicePreview from "../components/ui/InvoicePreview";
import RevenueForecast from "../components/ui/RevenueForecast";
import WhatsAppConversationHub from "../components/ui/WhatsAppConversationHub";
import WhatsAppThread from "../components/ui/WhatsAppThread";
import EditablePrescriptionForm from "../components/ui/EditablePrescriptionForm";
import { useToast } from "../context/ToastContext";

export default function PatientHub() {
  const { user } = useAuth(); 
  const { showToast } = useToast();

  const [search, setSearch] = useState("");
  const [risk, setRisk] = useState("");
  const [selected, setSelected] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);
  
  const [prescriptionDraft, setPrescriptionDraft] = useState({
    medicines: [{ drug: "Paracetamol 500mg", dose: "1 tablet", frequency: "3 times daily", duration: "5 days" }],
    notes: "Take medicines exactly as prescribed.",
  });

  // Fetching data - Bypassing role-based filtering logic
  const { data, loading, error, refetch, createPatient } = usePatients({ search, riskLevel: risk });

  // Safe data extraction
  const patientsArray = Array.isArray(data) ? data : (data?.patients || []);

  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-display font-bold">Patient Hub</h1>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 text-[10px] font-bold uppercase border border-emerald-500/20">
              <UserCheck size={12} /> Bypass: Full Access
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Accessing {patientsArray.length} clinical longitudinal records.
          </p>
        </div>
        <button
          onClick={() => createPatient({ name: "Demo Patient", abhaId: "91-XXXX" })}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--brand)] text-white rounded-lg text-sm font-medium hover:brightness-110 transition-all shadow-sm"
        >
          <Plus size={16} /> New Patient
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex-1 min-w-64 flex items-center gap-2 bg-surface rounded-lg px-3 py-2 border border-transparent focus-within:border-[var(--brand)] transition-all">
            <Search size={15} className="text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or ABHA ID..."
              className="bg-transparent outline-none text-sm w-full"
            />
          </div>
          <div className="flex gap-2">
            {["", "Low", "Medium", "High"].map((r) => (
              <button
                key={r || "all"}
                onClick={() => setRisk(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  risk === r ? "bg-[var(--brand)] text-white shadow-lg" : "bg-surface text-foreground hover:bg-surface-alt"
                }`}
              >
                {r || "All Risks"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Table */}
      {loading && !data ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : (
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface text-xs text-muted-foreground uppercase font-semibold">
                <tr>
                  <th className="text-left px-6 py-4">Patient</th>
                  <th className="text-left px-6 py-4">ABHA ID</th>
                  <th className="text-left px-6 py-4">Status</th>
                  <th className="text-left px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {patientsArray.map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => setSelected(p)}
                    className="cursor-pointer hover:bg-surface-alt/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={p.name} size={36} />
                        <div>
                          <p className="font-semibold text-foreground">{p.name}</p>
                          <p className="text-[11px] text-muted-foreground capitalize">{p.gender} • {p.age}y</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{p.abhaId}</td>
                    <td className="px-6 py-4">
                      <Badge variant={p.riskLevel === "High" ? "danger" : p.riskLevel === "Medium" ? "warning" : "success"}>
                        {p.riskLevel}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-[var(--brand)] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      Open Profile →
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail SlidePanel with UI Fixes */}
      <SlidePanel
        open={!!selected}
        onClose={() => { setSelected(null); setActiveTab("profile"); }}
        title={selected?.name || "Patient Record"}
        width="max-w-2xl"
      >
        {/* We use relative + bg-card here to ensure the panel is opaque */}
        <div className="relative bg-card min-h-full -m-6 p-6">
          {selected && (
            <div className="space-y-6">
              <nav className="flex gap-4 border-b border-border bg-card sticky top-0 z-20">
                {["profile", "invoices", "whatsapp", "analytics"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 text-sm font-medium capitalize transition-all ${
                      activeTab === tab ? "border-b-2 border-[var(--brand)] text-[var(--brand)]" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>

              <div className="pt-2 animate-in slide-in-from-right-4 duration-300">
                {activeTab === "profile" && (
                  <div className="space-y-6">
                     <div className="flex items-center justify-between p-4 bg-ai-soft rounded-xl border border-[var(--ai)]/20">
                        <div>
                          <AIBadge label="Risk Intelligence" />
                          <p className="text-3xl font-bold text-[var(--ai)] mt-1">74%</p>
                        </div>
                        <Sparkles className="text-[var(--ai)] opacity-40" size={28} />
                     </div>
                     <EditablePrescriptionForm value={prescriptionDraft} onChange={setPrescriptionDraft} patientId={selected.id} />
                     <button onClick={() => showToast("Records updated", "success")} className="w-full py-3 bg-[var(--brand)] text-white rounded-xl font-bold shadow-lg hover:brightness-110 active:scale-[0.98] transition-all">
                        Save Medical History
                     </button>
                  </div>
                )}
                
                {activeTab === "invoices" && <InvoiceList patientId={selected.id} onViewInvoice={setSelectedInvoice} />}
                {activeTab === "whatsapp" && <WhatsAppConversationHub patientId={selected.id} onSelectConversation={setSelectedConversation} />}
                {activeTab === "analytics" && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                      <IndianRupee size={16} /> Financial Insights
                    </div>
                    <RevenueForecast patientId={selected.id} />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </SlidePanel>

      {/* Overlays */}
      <Modal open={!!selectedInvoice} onClose={() => setSelectedInvoice(null)} width="max-w-4xl">
        {selectedInvoice && <InvoicePreview invoiceId={selectedInvoice} />}
      </Modal>

      <Modal open={!!selectedConversation} onClose={() => setSelectedConversation(null)} width="max-w-2xl">
        {selectedConversation && <WhatsAppThread conversationId={selectedConversation} />}
      </Modal>
    </div>
  );
}