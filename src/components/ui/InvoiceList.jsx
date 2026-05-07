import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { usePatientInvoices } from "../../hooks/usePatientInvoices";
import InvoiceCard from "./InvoiceCard";
import LoadingSpinner from "./LoadingSpinner";
import ErrorState from "./ErrorState";

export default function InvoiceList({
  patientId,
  onViewInvoice,
  onDownloadInvoice,
  onShareInvoice,
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const filters = {
    status: statusFilter || undefined,
    search: search || undefined,
  };

  const { invoices, loading, error, refetch, downloadInvoice, shareInvoice } = usePatientInvoices(
    patientId,
    filters,
  );

  const handleDownload = async (invoiceId) => {
    setIsLoading(true);
    try {
      await downloadInvoice(invoiceId);
      onDownloadInvoice?.(invoiceId);
    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async (invoiceId) => {
    setIsLoading(true);
    try {
      await shareInvoice(invoiceId, "email");
      onShareInvoice?.(invoiceId);
    } catch (err) {
      console.error("Share failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading && invoices.length === 0) {
    return <LoadingSpinner label="Loading invoices..." />;
  }

  if (error && invoices.length === 0) {
    return <ErrorState message={error} onRetry={refetch} />;
  }

  const stats = {
    total: invoices.length,
    paid: invoices.filter((i) => i.status === "paid").length,
    pending: invoices.filter((i) => i.status === "pending").length,
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="border border-border rounded-lg p-4">
          <p className="text-xs text-muted-foreground mb-1">Total Invoices</p>
          <p className="text-2xl font-bold text-foreground">{stats.total}</p>
        </div>
        <div className="border border-border rounded-lg p-4">
          <p className="text-xs text-muted-foreground mb-1">Paid</p>
          <p className="text-2xl font-bold text-[var(--success)]">{stats.paid}</p>
        </div>
        <div className="border border-border rounded-lg p-4">
          <p className="text-xs text-muted-foreground mb-1">Pending</p>
          <p className="text-2xl font-bold text-[var(--warning)]">{stats.pending}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 items-center flex-wrap">
        <div className="flex-1 min-w-xs">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="Search invoice number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-surface text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
            />
          </div>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 rounded-lg border border-border bg-surface text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
        >
          <option value="">All Status</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>

      {/* Invoice List */}
      {invoices.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-2">No invoices found</p>
          <p className="text-xs text-muted-foreground">
            {search || statusFilter ? "Try adjusting your filters" : "Invoices will appear here"}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {invoices.map((invoice) => (
            <InvoiceCard
              key={invoice.id}
              invoice={invoice}
              onView={onViewInvoice}
              onDownload={handleDownload}
              onShare={handleShare}
              isLoading={isLoading}
            />
          ))}
        </div>
      )}
    </div>
  );
}
