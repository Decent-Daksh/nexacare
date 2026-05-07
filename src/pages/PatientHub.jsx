import { useState, useEffect } from "react";
import { Search, Plus, Phone, Calendar, AlertTriangle, Sparkles, X } from "lucide-react";
import { useNavigate } from "@tanstack/react-router"; // From main
import { useAuth } from "../lib/auth"; // From main
import { usePatients } from "../hooks/usePatients";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ErrorState from "../components/ui/ErrorState";
import Badge from "../components/ui/Badge";
import Avatar from "../components/ui/Avatar";
import SlidePanel from "../components/ui/SlidePanel";
import AIBadge from "../components/ui/AIBadge";
import Tabs from "../components/ui/Tabs";
import InvoiceList from "../components/ui/InvoiceList";
import InvoicePreview from "../components/ui/InvoicePreview";
import InvoiceGenerator from "../components/ui/InvoiceGenerator";
import InsuranceClaimTracker from "../components/ui/InsuranceClaimTracker";
import PaymentReconciliation from "../components/ui/PaymentReconciliation";
import RevenueForecast from "../components/ui/RevenueForecast";
import OutstandingCollections from "../components/ui/OutstandingCollections";
import PLDashboard from "../components/ui/PLDashboard";
import Modal from "../components/ui/Modal";
import WhatsAppConversationHub from "../components/ui/WhatsAppConversationHub";
import WhatsAppThread from "../components/ui/WhatsAppThread";
import EditablePrescriptionForm from "../components/ui/EditablePrescriptionForm";
import { useToast } from "../context/ToastContext";

export default function PatientHub() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Role check from 'main'
  useEffect(() => {
    if (user && user.role === "manager") {
      navigate({ to: "/unauthorized" });
    }
  }, [user, navigate]);

  const [search, setSearch] = useState("");
  const [risk, setRisk] = useState("");
  const [selected, setSelected] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [activeInvoiceTab, setActiveInvoiceTab] = useState("list");
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);
  
  const [prescriptionDraft, setPrescriptionDraft] = useState({
    medicines: [{ drug: "Paracetamol 500mg", dose: "1 tablet", frequency: "3 times daily", duration: "5 days" }],
    notes: "Take medicines exactly as prescribed.",
  });

  const { data, loading, error, refetch, createPatient } = usePatients({ search, riskLevel: risk });

  // Early return from 'main' to prevent flicker for managers
  if (!user || user.role === "manager") return null;

  const addDemo = async () => {
    await createPatient({
      abhaId: "91-0000-0000-" + Math.floor(1000 + Math.random() * 8999),
      name: "New Patient",
      age: 30,
      gender: "Other",
      phone: "+91-9000000000",
      bloodGroup: "O+",
      conditions: [],
      riskLevel: "Low",
      lastVisit: "2026-05-04",
      doctor: "Dr. Priya Sharma",
      allergies: [],
      noShowCount: 0,
    });
    showToast("Patient registered", "success");
  };

  const savePatientPrescription = () => {
    if (!selected) return;
    showToast(`Prescription updated for ${selected.name}`, "success");
  };

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-display font-bold">Patient Hub</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Unified longitudinal records with AI-driven risk stratification.
          </p>
        </div>
        <button
          onClick={addDemo}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--brand)] text-white rounded-lg text-sm font-medium hover:bg-[var(--brand-hover)] transition-colors"
        >
          <Plus size={16} /> New Patient
        </button>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex-1 min-w-64 flex items-center gap-2 bg-surface rounded-lg px-3 py-2">
            <Search size={15} className="text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or ABHA ID…"
              className="bg-transparent outline-none text-sm w-full"
            />
          </div>
          <div className="flex gap-2">
            {["", "Low", "Medium", "High"].map((r) => (
              <button
                key={r || "all"}
                onClick={() => setRisk(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  risk === r ? "bg-[var(--brand)] text-white" : "bg-surface text-foreground hover:bg-surface-alt"
                }`}
              >
                {r || "All Risks"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading && <LoadingSpinner />}
      {error && <ErrorState message={error} onRetry={refetch} />}

      {!loading && !error && (
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface text-xs text-muted-foreground uppercase tracking-wide">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Patient</th>
                  <th className="text-left px-4 py-3 font-medium">ABHA ID</th>
                  <th className="text-left px-4 py-3 font-medium">Conditions</th>
                  <th className="text-left px-4 py-3 font-medium">Risk</th>
                  <th className="text-left px-4 py-3 font-medium">Last Visit</th>
                  <th className="text-left px-4 py-3 font-medium">Doctor</th>
                </tr>
              </thead>
              <tbody>
                {data.map((p, i) => (
                  <tr
                    key={p.id}
                    onClick={() => setSelected(p)}
                    className={`cursor-pointer hover:bg-surface-alt transition-colors ${i % 2 ? "bg-surface/40" : ""}`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={p.name} size={34} />
                        <div>
                          <div className="font-medium">{p.name}</div>
                          <div className="text-xs text-muted-foreground">{p.age}y • {p.gender} • {p.bloodGroup}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">{p.abhaId}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {p.conditions.slice(0, 2).map((c) => (
                          <Badge key={c} variant="info">{c}</Badge>
                        ))}
                        {p.conditions.length > 2 && <Badge>+{p.conditions.length - 2}</Badge>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={p.riskLevel === "High" ? "danger" : p.riskLevel === "Medium" ? "warning" : "success"}>
                        {p.riskLevel}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{p.lastVisit}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{p.doctor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SlidePanel containing the Tabs and Profile content from HEAD */}
      <SlidePanel
        open={!!selected}
        onClose={() => {
          setSelected(null);
          setActiveTab("profile");
        }}
        title={selected?.name || "Patient Profile"}
        width="max-w-2xl"
      >
        {selected && (
          <div className="space-y-5">
            <div className="flex gap-1 border-b border-border overflow-x-auto">
              {["profile", "invoices", "whatsapp"].map((tab) => (
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
                  {/* Detailed profile view with AI Risk Score, conditions, and prescription form */}
                  <div className="flex items-center gap-3">
                    <Avatar name={selected.name} size={56} />
                    <div>
                      <div className="font-display font-semibold text-lg">{selected.name}</div>
                      <div className="text-xs text-muted-foreground">{selected.age}y • {selected.gender}</div>
                    </div>
                  </div>
                  
                  <div className="rounded-xl p-4 bg-ai-soft border border-[color-mix(in_oklab,var(--ai)_30%,transparent)]">
                    <AIBadge label="Risk Score" />
                    <div className="text-3xl font-bold text-[var(--ai)] mt-2">74</div>
                    <p className="text-xs text-muted-foreground">High risk due to missed appointments.</p>
                  </div>

                  <EditablePrescriptionForm
                    value={prescriptionDraft}
                    onChange={setPrescriptionDraft}
                    patientId={selected?.id}
                  />
                  
                  <div className="flex gap-2">
                    <button onClick={savePatientPrescription} className="flex-1 px-3 py-2 bg-[var(--brand)] text-white rounded-lg text-sm font-medium">Save Changes</button>
                  </div>
               </div>
            )}
            
            {activeTab === "invoices" && (
              <InvoiceList patientId={selected.id} onViewInvoice={setSelectedInvoice} />
            )}

            {activeTab === "whatsapp" && (
              <WhatsAppConversationHub patientId={selected.id} onSelectConversation={setSelectedConversation} />
            )}
          </div>
        )}
      </SlidePanel>

      {/* Modals for specific views */}
      <Modal open={!!selectedInvoice} onClose={() => setSelectedInvoice(null)} width="max-w-4xl">
        {selectedInvoice && <InvoicePreview invoiceId={selectedInvoice} />}
      </Modal>

      <Modal open={!!selectedConversation} onClose={() => setSelectedConversation(null)} width="max-w-2xl">
        {selectedConversation && <WhatsAppThread conversationId={selectedConversation} />}
      </Modal>
    </div>
  );
}