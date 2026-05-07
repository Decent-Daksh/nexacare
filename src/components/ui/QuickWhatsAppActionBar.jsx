import { MessageCircle, Plus } from "lucide-react";

export default function QuickWhatsAppActionBar({
  onSendPrescription,
  onSendLabReport,
  onSendMedicalCertificate,
  onSendPharmacyConfirmation,
  className = "",
}) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      <button
        onClick={onSendPrescription}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-surface transition-colors group"
        title="Send Prescription via WhatsApp"
      >
        <MessageCircle size={16} className="text-[var(--ai)]" />
        <span className="hidden sm:inline">Send Rx</span>
      </button>

      <button
        onClick={onSendLabReport}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-surface transition-colors"
        title="Send Lab Report via WhatsApp"
      >
        <MessageCircle size={16} className="text-[var(--ai)]" />
        <span className="hidden sm:inline">Send Report</span>
      </button>

      <button
        onClick={onSendMedicalCertificate}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-surface transition-colors"
        title="Send Medical Certificate via WhatsApp"
      >
        <MessageCircle size={16} className="text-[var(--ai)]" />
        <span className="hidden sm:inline">Send Cert</span>
      </button>

      {onSendPharmacyConfirmation && (
        <button
          onClick={onSendPharmacyConfirmation}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-surface transition-colors"
          title="Send Pharmacy Confirmation via WhatsApp"
        >
          <MessageCircle size={16} className="text-[var(--ai)]" />
          <span className="hidden sm:inline">Send Confirmation</span>
        </button>
      )}
    </div>
  );
}
