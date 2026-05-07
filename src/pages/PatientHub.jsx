import { useState, useEffect } from "react";
import { Search, Plus, Phone, Calendar, AlertTriangle, Sparkles, X } from "lucide-react";
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
  const [search, setSearch] = useState("");
  const [risk, setRisk] = useState("");
  const [selected, setSelected] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [activeInvoiceTab, setActiveInvoiceTab] = useState("list");
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [prescriptionDraft, setPrescriptionDraft] = useState({
    medicines: [
      {
        drug: "Paracetamol 500mg",
        dose: "1 tablet",
        frequency: "3 times daily",
        duration: "5 days",
      },
    ],
    notes: "Take medicines exactly as prescribed. Review patient response in follow-up.",
  });
  const { data, loading, error, refetch, createPatient } = usePatients({ search, riskLevel: risk });
  const { showToast } = useToast();

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

  useEffect(() => {
    if (!selected) return;
    setPrescriptionDraft(
      selected.prescription || {
        medicines: [
          {
            drug: "Paracetamol 500mg",
            dose: "1 tablet",
            frequency: "3 times daily",
            duration: "5 days",
          },
        ],
        notes: "Take medicines exactly as prescribed. Review patient response in follow-up.",
      },
    );
  }, [selected?.id]);

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
                  risk === r
                    ? "bg-[var(--brand)] text-white"
                    : "bg-surface text-foreground hover:bg-surface-alt"
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
                          <div className="text-xs text-muted-foreground">
                            {p.age}y • {p.gender} • {p.bloodGroup}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">{p.abhaId}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {p.conditions.slice(0, 2).map((c) => (
                          <Badge key={c} variant="info">
                            {c}
                          </Badge>
                        ))}
                        {p.conditions.length > 2 && <Badge>+{p.conditions.length - 2}</Badge>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={
                          p.riskLevel === "High"
                            ? "danger"
                            : p.riskLevel === "Medium"
                              ? "warning"
                              : "success"
                        }
                      >
                        {p.riskLevel}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{p.lastVisit}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{p.doctor}</td>
                  </tr>
                ))}
                {data.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center text-muted-foreground py-12">
                      No patients match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <SlidePanel
        open={!!selected}
        onClose={() => {
          setSelected(null);
          setActiveTab("profile");
          setActiveInvoiceTab("list");
          setSelectedConversation(null);
        }}
        title={selected?.name || "Patient Profile"}
        width="max-w-2xl"
      >
        {selected && (
          <div className="space-y-5">
            {/* Tabs */}
            <div className="flex gap-1 border-b border-border overflow-x-auto">
              <button
                onClick={() => setActiveTab("profile")}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === "profile"
                    ? "border-[var(--brand)] text-[var(--brand)]"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveTab("invoices")}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === "invoices"
                    ? "border-[var(--brand)] text-[var(--brand)]"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                Invoices
              </button>
              <button
                onClick={() => setActiveTab("whatsapp")}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === "whatsapp"
                    ? "border-[var(--brand)] text-[var(--brand)]"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                WhatsApp
              </button>
            </div>

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <Avatar name={selected.name} size={56} />
                  <div>
                    <div className="font-display font-semibold text-lg">{selected.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {selected.age}y • {selected.gender} • {selected.bloodGroup}
                    </div>
                    <div className="text-xs font-mono text-muted-foreground mt-0.5">
                      {selected.abhaId}
                    </div>
                  </div>
                </div>

                <div className="rounded-xl p-4 bg-ai-soft border border-[color-mix(in_oklab,var(--ai)_30%,transparent)]">
                  <div className="flex items-center gap-2 mb-2">
                    <AIBadge label="Risk Score" />
                    <span className="text-xs text-muted-foreground">Updated just now</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <div className="text-3xl font-display font-bold text-[var(--ai)]">74</div>
                    <div className="text-xs text-muted-foreground">
                      /100 — {selected.riskLevel} risk
                    </div>
                  </div>
                  <ul className="mt-3 space-y-1.5 text-xs text-foreground">
                    <li className="flex gap-2">
                      <Sparkles size={12} className="text-[var(--ai)] mt-0.5" />
                      Missed last 2 appointments
                    </li>
                    <li className="flex gap-2">
                      <Sparkles size={12} className="text-[var(--ai)] mt-0.5" />
                      HbA1c trending up
                    </li>
                    <li className="flex gap-2">
                      <Sparkles size={12} className="text-[var(--ai)] mt-0.5" />
                      No prescription refill in 45 days
                    </li>
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-surface rounded-lg p-3">
                    <div className="text-xs text-muted-foreground">Phone</div>
                    <div className="font-medium flex items-center gap-1.5">
                      <Phone size={12} />
                      {selected.phone}
                    </div>
                  </div>
                  <div className="bg-surface rounded-lg p-3">
                    <div className="text-xs text-muted-foreground">Last Visit</div>
                    <div className="font-medium flex items-center gap-1.5">
                      <Calendar size={12} />
                      {selected.lastVisit}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-xs font-semibold uppercase text-muted-foreground mb-2">
                    Conditions
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selected.conditions.length > 0 ? (
                      selected.conditions.map((c) => (
                        <Badge key={c} variant="info">
                          {c}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground">None recorded</span>
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase text-muted-foreground mb-2">
                    Allergies
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selected.allergies.length > 0 ? (
                      selected.allergies.map((c) => (
                        <Badge key={c} variant="danger">
                          <AlertTriangle size={10} />
                          {c}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground">None known</span>
                    )}
                  </div>
                </div>

                <div className="rounded-3xl border border-border bg-surface p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
                    <div>
                      <div className="text-sm font-semibold">Editable Prescription</div>
                      <div className="text-xs text-muted-foreground">
                        Add, remove or update medicines before saving or sharing.
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={savePatientPrescription}
                        className="inline-flex items-center justify-center rounded-lg bg-[var(--brand)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--brand-hover)] transition-colors"
                      >
                        Save Prescription
                      </button>
                      <button
                        onClick={() =>
                          showToast(`Prescription ready to share with ${selected.name}`, "success")
                        }
                        className="inline-flex items-center justify-center rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground hover:bg-surface-alt transition-colors"
                      >
                        Share via WhatsApp
                      </button>
                    </div>
                  </div>
                  <EditablePrescriptionForm
                    value={prescriptionDraft}
                    onChange={setPrescriptionDraft}
                    patientId={selected?.id}
                  />
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 px-3 py-2 bg-[var(--brand)] text-white rounded-lg text-sm font-medium hover:bg-[var(--brand-hover)]">
                    Book Appointment
                  </button>
                  <button className="flex-1 px-3 py-2 bg-surface text-foreground rounded-lg text-sm font-medium hover:bg-surface-alt border border-border">
                    View Records
                  </button>
                </div>
              </div>
            )}

            {/* Invoices Tab */}
            {activeTab === "invoices" && (
              <div className="space-y-6">
                {/* Invoice Management Tabs */}
                <div className="flex gap-1 border-b border-border overflow-x-auto">
                  <button
                    onClick={() => setActiveInvoiceTab("list")}
                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                      activeInvoiceTab === "list"
                        ? "border-[var(--brand)] text-[var(--brand)]"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Invoice List
                  </button>
                  <button
                    onClick={() => setActiveInvoiceTab("generator")}
                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                      activeInvoiceTab === "generator"
                        ? "border-[var(--brand)] text-[var(--brand)]"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Generate Invoice
                  </button>
                  <button
                    onClick={() => setActiveInvoiceTab("claims")}
                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                      activeInvoiceTab === "claims"
                        ? "border-[var(--brand)] text-[var(--brand)]"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Insurance Claims
                  </button>
                  <button
                    onClick={() => setActiveInvoiceTab("payments")}
                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                      activeInvoiceTab === "payments"
                        ? "border-[var(--brand)] text-[var(--brand)]"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Payment Reconciliation
                  </button>
                  <button
                    onClick={() => setActiveInvoiceTab("forecast")}
                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                      activeInvoiceTab === "forecast"
                        ? "border-[var(--brand)] text-[var(--brand)]"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Revenue Forecast
                  </button>
                  <button
                    onClick={() => setActiveInvoiceTab("collections")}
                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                      activeInvoiceTab === "collections"
                        ? "border-[var(--brand)] text-[var(--brand)]"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Collections
                  </button>
                  <button
                    onClick={() => setActiveInvoiceTab("pl")}
                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                      activeInvoiceTab === "pl"
                        ? "border-[var(--brand)] text-[var(--brand)]"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    P&L Dashboard
                  </button>
                </div>

                {/* Invoice Sub-tabs Content */}
                {activeInvoiceTab === "list" && (
                  <InvoiceList
                    patientId={selected.id}
                    onViewInvoice={setSelectedInvoice}
                    onDownloadInvoice={(id) =>
                      showToast(`Invoice downloaded successfully`, "success")
                    }
                    onShareInvoice={(id) => showToast(`Invoice shared via email`, "success")}
                  />
                )}

                {activeInvoiceTab === "generator" && (
                  <InvoiceGenerator
                    patientId={selected.id}
                    onClose={() => setActiveInvoiceTab("list")}
                    onSave={(invoiceData) => {
                      showToast("Invoice generated successfully", "success");
                      setActiveInvoiceTab("list");
                    }}
                  />
                )}

                {activeInvoiceTab === "claims" && <InsuranceClaimTracker patientId={selected.id} />}

                {activeInvoiceTab === "payments" && <PaymentReconciliation />}

                {activeInvoiceTab === "forecast" && <RevenueForecast />}

                {activeInvoiceTab === "collections" && <OutstandingCollections />}

                {activeInvoiceTab === "pl" && <PLDashboard />}
              </div>
            )}

            {/* WhatsApp Tab */}
            {activeTab === "whatsapp" && (
              <WhatsAppConversationHub
                patientId={selected.id}
                onSelectConversation={setSelectedConversation}
              />
            )}
          </div>
        )}
      </SlidePanel>

      {/* Invoice Preview Modal */}
      <Modal
        open={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        title=""
        width="max-w-4xl"
        className="max-h-screen overflow-y-auto"
      >
        {selectedInvoice && (
          <InvoicePreview
            invoiceId={selectedInvoice}
            onClose={() => setSelectedInvoice(null)}
            onDownload={() => showToast("Invoice downloaded", "success")}
            onShare={() => showToast("Invoice shared", "success")}
          />
        )}
      </Modal>

      {/* WhatsApp Thread Modal */}
      <Modal
        open={!!selectedConversation}
        onClose={() => setSelectedConversation(null)}
        title=""
        width="max-w-2xl"
        className="h-[80vh]"
      >
        {selectedConversation && (
          <WhatsAppThread
            conversationId={selectedConversation}
            onClose={() => setSelectedConversation(null)}
          />
        )}
      </Modal>
    </div>
  );
}
