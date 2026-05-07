import { useState } from "react";
import { MessageCircle, Phone, AlertCircle, CheckCircle, Plus } from "lucide-react";
import { useWhatsAppPhoneNumbers } from "../../hooks/useWhatsAppDelivery";
import LoadingSpinner from "./LoadingSpinner";

export default function WhatsAppDeliveryModal({
  open,
  onClose,
  patientId,
  documentType,
  documentId,
  documentName,
  onSendSuccess,
  onSendError,
}) {
  const [step, setStep] = useState("phone"); // phone, confirm, sent
  const [selectedPhone, setSelectedPhone] = useState(null);
  const [newPhone, setNewPhone] = useState("");
  const [showAddPhone, setShowAddPhone] = useState(false);
  const [sending, setSending] = useState(false);
  const [newPhoneLabel, setNewPhoneLabel] = useState("Other");

  const { phoneNumbers, loading, addPhone } = useWhatsAppPhoneNumbers(patientId);

  if (!open) return null;

  const handleSendViaPhone = async (phone) => {
    setSelectedPhone(phone);
    setStep("confirm");
  };

  const handleConfirmSend = async () => {
    setSending(true);
    try {
      // Simulate sending
      await new Promise((r) => setTimeout(r, 1500));
      onSendSuccess?.({
        documentType,
        recipientPhone: selectedPhone.number,
        documentName,
      });
      setStep("sent");
      setTimeout(() => {
        onClose();
        setStep("phone");
        setSelectedPhone(null);
      }, 2000);
    } catch (err) {
      onSendError?.(err);
      setSending(false);
    }
  };

  const handleAddNewPhone = async () => {
    if (!newPhone) return;
    setSending(true);
    try {
      const addedPhone = await addPhone(newPhone, newPhoneLabel);
      setSelectedPhone(addedPhone);
      setNewPhone("");
      setShowAddPhone(false);
      setStep("confirm");
    } catch (err) {
      console.error("Failed to add phone:", err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background rounded-xl shadow-2xl w-full max-w-md p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2">
          <MessageCircle size={20} className="text-[var(--ai)]" />
          <div>
            <h2 className="text-lg font-semibold text-foreground">Send via WhatsApp</h2>
            <p className="text-xs text-muted-foreground">{documentName}</p>
          </div>
        </div>

        {/* Phone Selection Step */}
        {step === "phone" && (
          <div className="space-y-4">
            {loading ? (
              <LoadingSpinner />
            ) : (
              <>
                {phoneNumbers.length > 0 && (
                  <>
                    <p className="text-sm text-muted-foreground">Select recipient phone number:</p>
                    <div className="space-y-2">
                      {phoneNumbers.map((phone) => (
                        <button
                          key={phone.id}
                          onClick={() => handleSendViaPhone(phone)}
                          className="w-full flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-surface transition-colors text-left"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-sm text-foreground">{phone.number}</p>
                            <p className="text-xs text-muted-foreground">{phone.label}</p>
                          </div>
                          {phone.isVerified && (
                            <CheckCircle size={16} className="text-[var(--success)]" />
                          )}
                        </button>
                      ))}
                    </div>
                  </>
                )}

                <button
                  onClick={() => setShowAddPhone(!showAddPhone)}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-dashed border-border text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Plus size={16} />
                  Add New Phone Number
                </button>

                {showAddPhone && (
                  <div className="space-y-3 p-3 bg-surface rounded-lg">
                    <input
                      type="tel"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      placeholder="+91-9876543210"
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
                    />
                    <select
                      value={newPhoneLabel}
                      onChange={(e) => setNewPhoneLabel(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
                    >
                      <option>Personal</option>
                      <option>Alternate</option>
                      <option>Work</option>
                      <option>Other</option>
                    </select>
                    <div className="flex gap-2">
                      <button
                        onClick={handleAddNewPhone}
                        disabled={sending || !newPhone}
                        className="flex-1 px-3 py-2 bg-[var(--brand)] text-white rounded-lg text-sm font-medium hover:bg-[var(--brand-hover)] disabled:opacity-50 transition"
                      >
                        Add & Send
                      </button>
                      <button
                        onClick={() => {
                          setShowAddPhone(false);
                          setNewPhone("");
                        }}
                        className="flex-1 px-3 py-2 bg-surface text-foreground rounded-lg text-sm font-medium hover:bg-surface-alt border border-border transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Confirmation Step */}
        {step === "confirm" && selectedPhone && (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-surface border border-border space-y-2">
              <p className="text-sm text-muted-foreground">Recipient:</p>
              <p className="font-semibold text-foreground">{selectedPhone.number}</p>
              <p className="text-xs text-muted-foreground">{selectedPhone.label}</p>
            </div>

            <div className="p-4 rounded-lg bg-ai-soft border border-[color-mix(in_oklab,var(--ai)_30%,transparent)] space-y-2">
              <p className="text-sm text-muted-foreground">Document:</p>
              <p className="font-semibold text-foreground">{documentName}</p>
              <p className="text-xs text-muted-foreground capitalize">
                {documentType.replace("_", " ")}
              </p>
            </div>

            <div className="text-xs text-muted-foreground bg-surface p-3 rounded-lg">
              <p className="flex gap-2">
                <AlertCircle size={14} className="mt-0.5" />
                The document will be sent via WhatsApp as a secure file attachment.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleConfirmSend}
                disabled={sending}
                className="flex-1 px-3 py-2 bg-[var(--ai)] text-white rounded-lg text-sm font-medium hover:bg-[var(--ai-hover)] disabled:opacity-50 transition flex items-center justify-center gap-2"
              >
                {sending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <MessageCircle size={16} />
                    Send Document
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setStep("phone");
                  setSelectedPhone(null);
                }}
                disabled={sending}
                className="flex-1 px-3 py-2 bg-surface text-foreground rounded-lg text-sm font-medium hover:bg-surface-alt border border-border disabled:opacity-50 transition"
              >
                Back
              </button>
            </div>
          </div>
        )}

        {/* Sent Step */}
        {step === "sent" && (
          <div className="text-center py-6 space-y-3">
            <div className="flex justify-center">
              <CheckCircle size={48} className="text-[var(--success)] animate-bounce" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Sent Successfully!</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {documentName} has been sent to {selectedPhone?.number}
              </p>
            </div>
          </div>
        )}

        {/* Close Button */}
        {step !== "sent" && (
          <button
            onClick={onClose}
            disabled={sending}
            className="w-full px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition"
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
}
