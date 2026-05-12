import { useState, useEffect } from "react";
import {
  Clock,
  AlertTriangle,
  MessageCircle,
  Phone,
  Mail,
  Calendar,
  IndianRupee,
} from "lucide-react";
import Badge from "./Badge";
import { useCurrency } from '../../context/CurrencyContext';

const NUDGE_TYPES = {
  reminder: { label: "Payment Reminder", color: "info", icon: MessageCircle },
  followup: { label: "Follow-up Call", color: "warning", icon: Phone },
  escalation: { label: "Escalation Notice", color: "danger", icon: AlertTriangle },
  legal: { label: "Legal Notice", color: "danger", icon: AlertTriangle },
};

const ESCALATION_PATH = [
  { days: 7, action: "reminder", message: "Friendly payment reminder" },
  { days: 14, action: "followup", message: "Follow-up call to patient" },
  { days: 21, action: "escalation", message: "Formal escalation notice" },
  { days: 30, action: "legal", message: "Legal notice preparation" },
];

export default function OutstandingCollections() {
  const [outstandingInvoices, setOutstandingInvoices] = useState([]);
  const [nudges, setNudges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const { formatAmount } = useCurrency();
  // Mock data - replace with actual API call
  useEffect(() => {
    const mockInvoices = [
      {
        id: "INV001",
        patientName: "John Doe",
        patientPhone: "+91-9876543210",
        amount: 2500,
        dueDate: "2024-04-25",
        daysOverdue: 11,
        lastContact: "2024-05-02",
        status: "overdue",
        services: ["Consultation", "Blood Test"],
        insuranceClaim: false,
      },
      {
        id: "INV002",
        patientName: "Jane Smith",
        patientPhone: "+91-8765432109",
        amount: 1800,
        dueDate: "2024-05-01",
        daysOverdue: 5,
        lastContact: "2024-05-04",
        status: "pending",
        services: ["Diabetes Consultation"],
        insuranceClaim: true,
      },
      {
        id: "INV003",
        patientName: "Mike Johnson",
        patientPhone: "+91-7654321098",
        amount: 3200,
        dueDate: "2024-04-20",
        daysOverdue: 16,
        lastContact: "2024-04-28",
        status: "overdue",
        services: ["Cardiac Consultation", "ECG"],
        insuranceClaim: false,
      },
      {
        id: "INV004",
        patientName: "Sarah Wilson",
        patientPhone: "+91-6543210987",
        amount: 1500,
        dueDate: "2024-05-05",
        daysOverdue: 1,
        lastContact: null,
        status: "pending",
        services: ["General Consultation"],
        insuranceClaim: false,
      },
    ];

    const mockNudges = [
      {
        id: "NUDGE001",
        invoiceId: "INV001",
        type: "followup",
        scheduledDate: "2024-05-07",
        status: "scheduled",
        message: "Payment reminder for outstanding invoice",
      },
      {
        id: "NUDGE002",
        invoiceId: "INV003",
        type: "escalation",
        scheduledDate: "2024-05-08",
        status: "scheduled",
        message: "Formal notice for overdue payment",
      },
    ];

    setTimeout(() => {
      setOutstandingInvoices(mockInvoices);
      setNudges(mockNudges);
      setLoading(false);
    }, 1000);
  }, []);

  const getNextNudge = (daysOverdue) => {
    return (
      ESCALATION_PATH.find((step) => daysOverdue <= step.days) ||
      ESCALATION_PATH[ESCALATION_PATH.length - 1]
    );
  };

  const getTotalOutstanding = () => {
    return outstandingInvoices.reduce((sum, inv) => sum + inv.amount, 0);
  };

  const getOverdueAmount = () => {
    return outstandingInvoices
      .filter((inv) => inv.status === "overdue")
      .reduce((sum, inv) => sum + inv.amount, 0);
  };

  const sendNudge = (invoice, nudgeType) => {
    // Mock nudge sending
    const newNudge = {
      id: `NUDGE${Date.now()}`,
      invoiceId: invoice.id,
      type: nudgeType,
      scheduledDate: new Date().toISOString().split("T")[0],
      status: "sent",
      message: `${NUDGE_TYPES[nudgeType].label} sent to ${invoice.patientName}`,
    };

    setNudges((prev) => [...prev, newNudge]);

    // Update last contact
    setOutstandingInvoices((prev) =>
      prev.map((inv) =>
        inv.id === invoice.id
          ? { ...inv, lastContact: new Date().toISOString().split("T")[0] }
          : inv,
      ),
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--brand)]"></div>
      </div>
    );
  }

  const totalOutstanding = getTotalOutstanding();
  const overdueAmount = getOverdueAmount();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Outstanding Collections</h2>
        <div className="flex items-center gap-4 text-sm">
          <div className="text-right">
            <div className="font-semibold">{formatAmount(totalOutstanding)}</div>
            <div className="text-xs text-muted-foreground">Total Outstanding</div>
          </div>
          <div className="text-right">
            <div className="font-semibold text-[var(--danger)]">{formatAmount(overdueAmount)}</div>
            <div className="text-xs text-muted-foreground">Overdue</div>
          </div>
        </div>
      </div>

      {/* Escalation Timeline */}
      <div className="bg-card border border-border rounded-xl shadow-sm p-6">
        <h3 className="font-display font-semibold mb-4">Automated Nudge Timeline</h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {ESCALATION_PATH.map((step, index) => {
            const NudgeIcon = NUDGE_TYPES[step.action].icon;
            return (
              <div key={step.days} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                      index === 0
                        ? "bg-[var(--info)]"
                        : index === 1
                          ? "bg-[var(--warning)]"
                          : "bg-[var(--danger)]"
                    } text-white`}
                  >
                    <NudgeIcon size={20} />
                  </div>
                  <div className="font-medium text-sm">{step.days} Days</div>
                  <div className="text-xs text-muted-foreground mt-1">{step.message}</div>
                </div>
                {index < ESCALATION_PATH.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-full w-full h-0.5 bg-border -translate-x-6"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Outstanding Invoices */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="font-display font-semibold">Outstanding Invoices</h3>
          <p className="text-xs text-muted-foreground mt-1">Automated collection management</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface text-xs text-muted-foreground uppercase tracking-wide">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Patient</th>
                <th className="text-left px-4 py-3 font-medium">Invoice</th>
                <th className="text-right px-4 py-3 font-medium">Amount</th>
                <th className="text-left px-4 py-3 font-medium">Due Date</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium">Next Action</th>
                <th className="text-left px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {outstandingInvoices.map((invoice, i) => {
                const nextNudge = getNextNudge(invoice.daysOverdue);
                const NudgeIcon = NUDGE_TYPES[nextNudge.action].icon;

                return (
                  <tr
                    key={invoice.id}
                    className={`cursor-pointer hover:bg-surface-alt transition-colors ${i % 2 ? "bg-surface/40" : ""}`}
                    onClick={() => setSelectedInvoice(invoice)}
                  >
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-medium">{invoice.patientName}</div>
                        <div className="text-xs text-muted-foreground">{invoice.patientPhone}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-medium">{invoice.id}</div>
                        <div className="text-xs text-muted-foreground">
                          {invoice.services.join(", ")}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="font-medium">{formatAmount(invoice.amount)}</div>
                      {invoice.insuranceClaim && (
                        <Badge variant="info" className="text-xs mt-1">
                          Insurance
                        </Badge>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm">{invoice.dueDate}</div>
                      <div className="text-xs text-muted-foreground">
                        {invoice.daysOverdue} days overdue
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={invoice.status === "overdue" ? "danger" : "warning"}>
                        {invoice.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <NudgeIcon
                          size={14}
                          className={`text-[var(--${NUDGE_TYPES[nextNudge.action].color})]`}
                        />
                        <div>
                          <div className="text-sm font-medium">{nextNudge.message}</div>
                          <div className="text-xs text-muted-foreground">
                            Due in {nextNudge.days - invoice.daysOverdue} days
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            sendNudge(invoice, "reminder");
                          }}
                          className="px-2 py-1 bg-[var(--info)] text-white rounded text-xs hover:bg-[var(--info-hover)]"
                        >
                          <MessageCircle size={12} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            sendNudge(invoice, "followup");
                          }}
                          className="px-2 py-1 bg-[var(--warning)] text-white rounded text-xs hover:bg-[var(--warning-hover)]"
                        >
                          <Phone size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Nudges */}
      <div className="bg-card border border-border rounded-xl shadow-sm p-6">
        <h3 className="font-display font-semibold mb-4">Recent Nudges & Communications</h3>

        <div className="space-y-3">
          {nudges
            .slice(-5)
            .reverse()
            .map((nudge) => {
              const NudgeIcon = NUDGE_TYPES[nudge.type].icon;
              const invoice = outstandingInvoices.find((inv) => inv.id === nudge.invoiceId);

              return (
                <div key={nudge.id} className="flex items-start gap-3 p-3 bg-surface rounded-lg">
                  <NudgeIcon
                    size={16}
                    className={`text-[var(--${NUDGE_TYPES[nudge.type].color})] mt-0.5`}
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-sm">{NUDGE_TYPES[nudge.type].label}</div>
                      <Badge variant={nudge.status === "sent" ? "success" : "info"}>
                        {nudge.status}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {invoice?.patientName} • {nudge.scheduledDate}
                    </div>
                    <div className="text-xs text-muted-foreground">{nudge.message}</div>
                  </div>
                </div>
              );
            })}

          {nudges.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <MessageCircle size={24} className="mx-auto mb-2 opacity-50" />
              <p>No nudges sent yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
