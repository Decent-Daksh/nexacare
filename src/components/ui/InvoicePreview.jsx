import { X, Download, Share2, Printer, ArrowLeft } from "lucide-react";
import { useInvoiceDetail } from "../../hooks/usePatientInvoices";
import LoadingSpinner from "./LoadingSpinner";
import ErrorState from "./ErrorState";

export default function InvoicePreview({ invoiceId, onClose, onDownload, onShare }) {
  const { invoice, loading, error, refetch } = useInvoiceDetail(invoiceId);

  if (loading) return <LoadingSpinner label="Loading invoice..." />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;
  if (!invoice) return <ErrorState message="Invoice not found" />;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface rounded-lg transition"
            aria-label="Close"
          >
            <ArrowLeft size={20} className="text-foreground" />
          </button>
          <div>
            <h2 className="text-lg font-semibold text-foreground">{invoice.invoiceNumber}</h2>
            <p className="text-sm text-muted-foreground">Invoice Details</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            className="p-2 hover:bg-surface rounded-lg transition"
            title="Print"
          >
            <Printer size={20} className="text-foreground" />
          </button>
          <button
            onClick={() => onDownload?.(invoiceId)}
            className="p-2 hover:bg-surface rounded-lg transition"
            title="Download"
          >
            <Download size={20} className="text-foreground" />
          </button>
          <button
            onClick={() => onShare?.(invoiceId)}
            className="p-2 hover:bg-surface rounded-lg transition"
            title="Share"
          >
            <Share2 size={20} className="text-foreground" />
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface rounded-lg transition"
            aria-label="Close"
          >
            <X size={20} className="text-foreground" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto bg-surface rounded-xl border border-border p-8">
          {/* Invoice Header */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">CLINIC</h3>
              <p className="font-semibold text-foreground">{invoice.clinic.name}</p>
              <p className="text-sm text-muted-foreground">{invoice.clinic.address}</p>
              <p className="text-sm text-muted-foreground">{invoice.clinic.phone}</p>
              <p className="text-sm text-muted-foreground">{invoice.clinic.email}</p>
              <p className="text-xs text-muted-foreground mt-2">
                Reg: {invoice.clinic.registrationNo}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground mb-1">INVOICE #</p>
              <p className="text-2xl font-bold text-[var(--brand)] mb-4">{invoice.invoiceNumber}</p>
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold">Date:</span>{" "}
                {new Date(invoice.date).toLocaleDateString("en-IN")}
              </p>
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold">Due:</span>{" "}
                {new Date(invoice.dueDate).toLocaleDateString("en-IN")}
              </p>
              <div className="mt-4">
                <span
                  className={`px-3 py-1 rounded text-sm font-semibold text-white ${
                    invoice.status === "paid"
                      ? "bg-[var(--success)]"
                      : invoice.status === "pending"
                        ? "bg-[var(--warning)]"
                        : "bg-[var(--danger)]"
                  }`}
                >
                  {invoice.status.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Patient & Doctor Info */}
          <div className="grid grid-cols-2 gap-8 mb-8 pb-8 border-b border-border">
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground mb-2">PATIENT</h4>
              <p className="font-semibold text-foreground">{invoice.patient.name}</p>
              <p className="text-sm text-muted-foreground">{invoice.patient.phone}</p>
              <p className="text-sm text-muted-foreground">{invoice.patient.email}</p>
              <p className="text-sm text-muted-foreground">{invoice.patient.address}</p>
              <p className="text-xs text-muted-foreground mt-2">
                ABHA ID: {invoice.patient.abhaId}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground mb-2">PHYSICIAN</h4>
              <p className="font-semibold text-foreground">{invoice.doctor.name}</p>
              <p className="text-sm text-muted-foreground">{invoice.doctor.specialization}</p>
              <p className="text-xs text-muted-foreground mt-2">
                License: {invoice.doctor.license}
              </p>
            </div>
          </div>

          {/* Items Table */}
          <table className="w-full mb-8">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 text-sm font-semibold text-muted-foreground">
                  Description
                </th>
                <th className="text-right py-3 text-sm font-semibold text-muted-foreground">Qty</th>
                <th className="text-right py-3 text-sm font-semibold text-muted-foreground">
                  Unit Price
                </th>
                <th className="text-right py-3 text-sm font-semibold text-muted-foreground">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, idx) => (
                <tr key={idx} className="border-b border-border/50">
                  <td className="py-3 text-sm text-foreground">{item.description}</td>
                  <td className="text-right py-3 text-sm text-foreground">{item.quantity}</td>
                  <td className="text-right py-3 text-sm text-foreground">₹{item.unitPrice}</td>
                  <td className="text-right py-3 text-sm font-semibold text-foreground">
                    ₹{item.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Summary */}
          <div className="flex justify-end mb-8">
            <div className="w-full max-w-xs">
              <div className="flex justify-between py-2 text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">₹{invoice.summary.subtotal}</span>
              </div>
              <div className="flex justify-between py-2 text-sm">
                <span className="text-muted-foreground">Tax (10%)</span>
                <span className="text-foreground">₹{invoice.summary.tax}</span>
              </div>
              {invoice.summary.discount > 0 && (
                <div className="flex justify-between py-2 text-sm">
                  <span className="text-muted-foreground">Discount</span>
                  <span className="text-[var(--success)]">-₹{invoice.summary.discount}</span>
                </div>
              )}
              <div className="flex justify-between py-3 px-4 rounded-lg bg-[var(--brand)]/5 border border-[var(--brand)]">
                <span className="font-semibold text-foreground">Total</span>
                <span className="font-bold text-[var(--brand)] text-lg">
                  ₹{invoice.summary.total}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          {invoice.payment && (
            <div className="mb-8 pb-8 border-b border-border">
              <h4 className="text-sm font-semibold text-muted-foreground mb-3">PAYMENT DETAILS</h4>
              <div className="text-sm text-foreground space-y-1">
                <p>
                  <span className="text-muted-foreground">Method:</span> {invoice.payment.method}
                </p>
                <p>
                  <span className="text-muted-foreground">Transaction ID:</span>{" "}
                  {invoice.payment.transactionId}
                </p>
                {invoice.payment.paidDate && (
                  <p>
                    <span className="text-muted-foreground">Paid on:</span>{" "}
                    {new Date(invoice.payment.paidDate).toLocaleDateString("en-IN")}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Notes */}
          {invoice.notes && (
            <div className="text-center text-xs text-muted-foreground italic">{invoice.notes}</div>
          )}
        </div>
      </div>
    </div>
  );
}
