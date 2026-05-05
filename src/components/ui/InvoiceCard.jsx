import { Download, Share2, Eye, AlertCircle } from 'lucide-react';
import Badge from './Badge';

export default function InvoiceCard({
  invoice,
  onDownload,
  onShare,
  onView,
  isLoading = false,
}) {
  const statusConfig = {
    paid: { bg: 'bg-[var(--success)]', text: 'text-white', label: 'Paid' },
    pending: { bg: 'bg-[var(--warning)]', text: 'text-white', label: 'Pending' },
    overdue: { bg: 'bg-[var(--danger)]', text: 'text-white', label: 'Overdue' },
  };

  const config = statusConfig[invoice.status] || statusConfig.pending;

  return (
    <div className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-sm text-foreground mb-1">
            {invoice.invoiceNumber}
          </h3>
          <p className="text-xs text-muted-foreground">{invoice.consultationType}</p>
        </div>
        <Badge variant={invoice.status}>
          {config.label}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4 py-3 border-y border-border">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Amount</p>
          <p className="font-semibold text-sm text-foreground">₹{invoice.amount}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Date</p>
          <p className="font-semibold text-sm text-foreground">
            {new Date(invoice.date).toLocaleDateString('en-IN')}
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onView?.(invoice.id)}
          disabled={isLoading}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-surface disabled:opacity-50 transition"
        >
          <Eye size={16} />
          View
        </button>
        <button
          onClick={() => onDownload?.(invoice.id)}
          disabled={isLoading}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-surface disabled:opacity-50 transition"
        >
          <Download size={16} />
          Download
        </button>
        <button
          onClick={() => onShare?.(invoice.id)}
          disabled={isLoading}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-[var(--brand)] text-sm font-medium text-[var(--brand)] hover:bg-[var(--brand)]/5 disabled:opacity-50 transition"
        >
          <Share2 size={16} />
          Share
        </button>
      </div>

      {invoice.status === 'pending' && (
        <div className="mt-3 flex items-center gap-2 p-2 rounded-lg bg-[var(--warning)]/10">
          <AlertCircle size={14} className="text-[var(--warning)]" />
          <p className="text-xs text-[var(--warning)]">
            Due: {new Date(invoice.dueDate).toLocaleDateString('en-IN')}
          </p>
        </div>
      )}
    </div>
  );
}
