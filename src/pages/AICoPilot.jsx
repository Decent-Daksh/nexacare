import { useEffect, useState } from "react";
import {
  Mic,
  Square,
  FileText,
  Stethoscope,
  Pill,
  Sparkles,
  RotateCcw,
  MessageCircle,
  Send,
  User,
} from "lucide-react";
import AIBadge from "../components/ui/AIBadge";
import Tabs from "../components/ui/Tabs";
import Badge from "../components/ui/Badge";
import Modal from "../components/ui/Modal";
import EditablePrescriptionForm from "../components/ui/EditablePrescriptionForm";
import { useCoPilot } from "../hooks/useCoPilot";
import { usePatients } from "../hooks/usePatients";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { useToast } from "../context/ToastContext";

const SAMPLE = `Patient came in with persistent dry cough for the past 5 days. Reports mild fever and fatigue. No chest pain. Has history of seasonal allergies. On examination throat appears mildly red, chest is clear. Vitals stable.`;

export default function AICoPilot() {
  const [tab, setTab] = useState("soap");
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState(SAMPLE);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [patientSearch, setPatientSearch] = useState("");
  const [currentPrescription, setCurrentPrescription] = useState({
    medicines: [{ drug: "", dose: "", frequency: "", duration: "" }],
    notes: "",
  });
  const [selectedPatient, setSelectedPatient] = useState(null);

  const { soap, diagnosis, prescription, loading, error, generateSOAP } = useCoPilot();
  const { showToast } = useToast();
  const { data: patients, loading: patientLoading } = usePatients({
    search: patientSearch,
    riskLevel: "",
  });

  // Sync AI generated prescription to the editable form state
  useEffect(() => {
    if (prescription && prescription.length > 0) {
      setCurrentPrescription({
        medicines: prescription.map((item) => ({
          drug: item.drug || item.name || "",
          dose: item.dose || "",
          frequency: item.frequency || "",
          duration: item.duration || "",
        })),
        notes: "Review and adjust before sharing with the patient.",
      });
    }
  }, [prescription, selectedPatient?.id]);

  // Auto-select first patient from search results if none selected
  useEffect(() => {
    if (!selectedPatient && patients && patients.length > 0) {
      setSelectedPatient(patients[0]);
    }
  }, [patients]);

  const sendPrescriptionViaWhatsApp = (patient) => {
    const rx = currentPrescription?.medicines?.length
      ? currentPrescription
      : { medicines: prescription };

    if (!rx || !rx.medicines || rx.medicines.length === 0) {
      showToast("Please generate and edit a prescription first", "error");
      return;
    }
    
    // Logic for constructing the WhatsApp URL or API call would go here
    console.log("Sending prescription to:", patient.phone);
    showToast(`Prescription sent successfully to ${patient.name}`, "success");
    setShowWhatsAppModal(false);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-display font-bold flex items-center gap-2">
          AI Co-Pilot <AIBadge />
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Live consultation transcription with AI-drafted SOAP notes, differential Dx and
          prescription suggestions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left Column: Recording and Transcript */}
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div>
              <h3 className="font-display font-semibold">Live Transcript</h3>
              <p className="text-xs text-muted-foreground">Auto-captured from in-room mic</p>
            </div>
            <button
              onClick={() => setRecording(!recording)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                recording
                  ? "bg-[var(--danger)] text-white"
                  : "bg-[var(--brand)] text-white hover:bg-[var(--brand-hover)]"
              }`}
            >
              {recording ? (
                <>
                  <Square size={14} /> Stop
                </>
              ) : (
                <>
                  <Mic size={14} /> Record
                </>
              )}
            </button>
          </div>
          <div className="p-5">
            {recording && (
              <div className="flex items-center gap-2 text-xs text-[var(--danger)] mb-3">
                <span className="w-2 h-2 rounded-full bg-[var(--danger)] animate-pulse"></span>
                Recording • 02:14
              </div>
            )}
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              className="w-full h-72 bg-surface rounded-lg p-4 text-sm outline-none resize-none border border-border focus:border-[var(--brand)] transition-colors"
            />
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => generateSOAP(transcript)}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-[var(--ai)] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <Sparkles size={14} />
                Generate AI Notes
              </button>
              <button
                onClick={() => setTranscript(SAMPLE)}
                className="px-3 py-2 bg-surface border border-border rounded-lg text-sm hover:bg-surface-alt transition-colors"
              >
                <RotateCcw size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: AI Output and Patient Linking */}
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden border-l-4 border-l-[var(--ai)]">
          <div className="px-5 pt-4">
            <div className="flex items-center gap-2 mb-3">
              <AIBadge label="AI Output" />
              <span className="text-xs text-muted-foreground">Always review before saving</span>
            </div>
            <Tabs
              active={tab}
              onChange={setTab}
              tabs={[
                { value: "soap", label: "SOAP Notes" },
                { value: "dx", label: "Diagnosis" },
                { value: "rx", label: "Prescription" },
              ]}
            />
            
            {/* Patient Search Bar (From HEAD) */}
            <div className="mt-4 rounded-xl border border-border bg-surface px-4 py-3 text-sm">
              <div className="flex flex-col gap-2">
                <div className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">Link Patient</div>
                <input
                  value={patientSearch}
                  onChange={(e) => setPatientSearch(e.target.value)}
                  placeholder="Search patient by name or ABHA..."
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-[var(--brand)]"
                />
              </div>
            </div>
          </div>

          <div className="p-5 min-h-[420px]">
            {loading && <LoadingSpinner label="AI thinking..." />}
            
            {!loading && soap && tab === "soap" && (
              <div className="space-y-4 text-sm">
                {[
                  { k: "Subjective", v: soap.subjective, icon: FileText },
                  { k: "Objective", v: soap.objective, icon: Stethoscope },
                  { k: "Assessment", v: soap.assessment, icon: Sparkles },
                  { k: "Plan", v: soap.plan, icon: Pill },
                ].map((s) => (
                  <div key={s.k}>
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase text-[var(--brand-active)] mb-1">
                      <s.icon size={12} /> {s.k}
                    </div>
                    <div className="text-foreground bg-surface rounded-lg p-3 leading-relaxed border border-border/50">
                      {s.v}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && diagnosis.length > 0 && tab === "dx" && (
              <div className="space-y-3">
                {diagnosis.map((d) => (
                  <div key={d.code} className="bg-surface rounded-lg p-3 border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="text-xs font-mono text-muted-foreground">{d.code}</div>
                        <div className="font-medium text-sm">{d.label}</div>
                      </div>
                      <Badge variant={d.confidence > 0.6 ? "success" : "warning"}>
                        {(d.confidence * 100).toFixed(0)}%
                      </Badge>
                    </div>
                    <div className="h-1.5 bg-border rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[var(--ai)]"
                        style={{ width: `${d.confidence * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && prescription.length > 0 && tab === "rx" && (
              <div className="space-y-4">
                <EditablePrescriptionForm
                  value={currentPrescription}
                  onChange={setCurrentPrescription}
                  patientId={selectedPatient?.id}
                />
                <div className="flex flex-col gap-2 sm:flex-row">
                  <button
                    onClick={() => selectedPatient ? setShowWhatsAppModal(true) : showToast("Please select a patient", "error")}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                  >
                    <MessageCircle size={14} /> Send WhatsApp
                  </button>
                  <button
                    onClick={() => showToast("Prescription saved to EHR", "success")}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-[var(--brand)] text-white rounded-lg text-sm font-medium hover:bg-[var(--brand-hover)] transition-colors"
                  >
                    <Send size={14} /> Save to Records
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* WhatsApp Modal (From HEAD) */}
      <Modal
        open={showWhatsAppModal}
        onClose={() => setShowWhatsAppModal(false)}
        title="Send Prescription"
        width="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Confirm patient details before sending via WhatsApp.</p>
          {selectedPatient && (
            <div className="p-4 border border-[var(--brand)] bg-[var(--brand)]/5 rounded-lg">
              <div className="font-bold text-sm">{selectedPatient.name}</div>
              <div className="text-xs text-muted-foreground">{selectedPatient.phone}</div>
            </div>
          )}
          <button
            onClick={() => sendPrescriptionViaWhatsApp(selectedPatient)}
            className="w-full py-2 bg-green-600 text-white rounded-lg font-medium"
          >
            Confirm & Send
          </button>
        </div>
      </Modal>
    </div>
  );
}