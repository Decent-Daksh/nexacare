import { useState } from "react";
import { MessageCircle, MessageSquare, Send, Pill, FileText, Plus } from "lucide-react";
import { useWhatsAppConversationList } from "../../hooks/useWhatsAppCommunication";
import LoadingSpinner from "./LoadingSpinner";
import ErrorState from "./ErrorState";
import Avatar from "./Avatar";
import Modal from "./Modal";
import Badge from "./Badge";
import { Button } from "./button";

export default function WhatsAppConversationHub({ patientId, onSelectConversation }) {
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const { conversations, loading, error, refetch } = useWhatsAppConversationList(patientId);

  // Mock prescription data - replace with actual API call
  const prescriptions = [
    {
      id: "RX001",
      date: "2024-05-06",
      doctor: "Dr. Priya Sharma",
      medicines: [
        {
          name: "Paracetamol 500mg",
          dosage: "1 tablet",
          frequency: "3 times daily",
          duration: "5 days",
        },
        {
          name: "Amoxicillin 250mg",
          dosage: "1 capsule",
          frequency: "2 times daily",
          duration: "7 days",
        },
      ],
      notes: "Take with food. Complete full course.",
    },
    {
      id: "RX002",
      date: "2024-04-28",
      doctor: "Dr. Rajesh Kumar",
      medicines: [
        {
          name: "Metformin 500mg",
          dosage: "1 tablet",
          frequency: "2 times daily",
          duration: "30 days",
        },
      ],
      notes: "Monitor blood sugar levels regularly.",
    },
  ];

  const sendPrescription = (prescription) => {
    // Mock WhatsApp sending - replace with actual WhatsApp API integration
    const message = `*🩺 NexaCare Prescription*

*Prescription ID:* ${prescription.id}
*Date:* ${prescription.date}
*Doctor:* ${prescription.doctor}

*Medicines:*
${prescription.medicines
  .map(
    (med) =>
      `• ${med.name}
   Dosage: ${med.dosage}
   Frequency: ${med.frequency}
   Duration: ${med.duration}`,
  )
  .join("\n\n")}

*Notes:* ${prescription.notes}

*Instructions:*
• Take medicines as prescribed
• Complete the full course
• Report any side effects immediately
• Follow up after ${prescription.medicines[0]?.duration || "course completion"}

_NexaCare - Your Health, Our Priority_`;

    // Here you would integrate with WhatsApp Business API
    console.log("Sending prescription via WhatsApp:", message);

    setShowPrescriptionModal(false);
    setSelectedPrescription(null);
    // Show success toast
    alert("Prescription sent successfully via WhatsApp!");
  };

  if (loading) return <LoadingSpinner label="Loading conversations..." />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-IN");
  };

  return (
    <div className="space-y-4">
      {/* Prescription Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => setShowPrescriptionModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
        >
          <Pill size={14} />
          Send Prescription
        </button>
      </div>

      {/* Conversations List */}
      {conversations.length === 0 ? (
        <div className="text-center py-8">
          <MessageCircle size={32} className="mx-auto text-muted-foreground/50 mb-2" />
          <p className="text-muted-foreground text-sm">No conversations yet</p>
          <p className="text-xs text-muted-foreground mt-1">
            Start a conversation with this patient
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => onSelectConversation?.(conv.id)}
              className="w-full text-left p-4 rounded-lg border border-border hover:bg-surface transition-colors"
            >
              <div className="flex items-start gap-3">
                <Avatar name={conv.doctorName} size={40} />

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-sm text-foreground">{conv.doctorName}</p>
                      <p className="text-xs text-muted-foreground">{conv.messageCount} messages</p>
                    </div>
                    <p className="text-xs text-muted-foreground flex-shrink-0">
                      {formatTime(conv.lastMessageTime)}
                    </p>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                    {conv.lastMessageAuthor === "doctor" ? (
                      <>
                        <Send size={12} className="inline mr-1" />
                        {conv.lastMessage}
                      </>
                    ) : (
                      <>
                        <MessageSquare size={12} className="inline mr-1" />
                        {conv.lastMessage}
                      </>
                    )}
                  </p>

                  {conv.unreadCount > 0 && (
                    <div className="mt-2">
                      <span className="inline-block px-2 py-0.5 rounded-full bg-[var(--brand)] text-white text-xs font-semibold">
                        {conv.unreadCount} unread
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Prescription Selection Modal */}
      <Modal
        open={showPrescriptionModal}
        onClose={() => {
          setShowPrescriptionModal(false);
          setSelectedPrescription(null);
        }}
        title="Send Prescription via WhatsApp"
        width="max-w-lg"
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Select a prescription to send to the patient via WhatsApp
          </p>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {prescriptions.map((rx) => (
              <div
                key={rx.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedPrescription?.id === rx.id
                    ? "border-[var(--brand)] bg-[var(--brand)]/5"
                    : "border-border hover:bg-surface"
                }`}
                onClick={() => setSelectedPrescription(rx)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Pill size={16} className="text-[var(--brand)]" />
                    <span className="font-medium text-sm">{rx.id}</span>
                  </div>
                  <Badge variant="info">{rx.date}</Badge>
                </div>

                <div className="text-xs text-muted-foreground mb-2">Dr. {rx.doctor}</div>

                <div className="space-y-1">
                  {rx.medicines.slice(0, 2).map((med, idx) => (
                    <div key={idx} className="text-xs text-foreground">
                      • {med.name} - {med.dosage} {med.frequency}
                    </div>
                  ))}
                  {rx.medicines.length > 2 && (
                    <div className="text-xs text-muted-foreground">
                      +{rx.medicines.length - 2} more medicines
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {selectedPrescription && (
            <div className="flex gap-2 pt-4 border-t">
              <Button
                onClick={() => sendPrescription(selectedPrescription)}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <Send size={14} className="mr-2" />
                Send via WhatsApp
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowPrescriptionModal(false);
                  setSelectedPrescription(null);
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
