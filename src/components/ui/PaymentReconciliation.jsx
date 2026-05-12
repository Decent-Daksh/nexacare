import { useState, useEffect } from "react";
import { CreditCard, CheckCircle, XCircle, AlertTriangle, RefreshCw, Download } from "lucide-react";
import Badge from "./Badge";
import { useCurrency } from '../../context/CurrencyContext';

const PAYMENT_METHODS = {
  upi: { label: "UPI", icon: "💳", color: "success" },
  card: { label: "Card", icon: "💳", color: "info" },
  netbanking: { label: "Net Banking", icon: "🏦", color: "warning" },
  cash: { label: "Cash", icon: "💵", color: "default" },
};

const PAYMENT_STATUS = {
  success: { label: "Success", color: "success", icon: CheckCircle },
  failed: { label: "Failed", color: "danger", icon: XCircle },
  pending: { label: "Pending", color: "warning", icon: AlertTriangle },
  refunded: { label: "Refunded", color: "info", icon: RefreshCw },
};

export default function PaymentReconciliation() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split("T")[0]);
  const [statusFilter, setStatusFilter] = useState("");
  const [methodFilter, setMethodFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const { formatAmount } = useCurrency();

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockTransactions = [
      {
        id: "TXN001",
        invoiceId: "INV001",
        patientName: "John Doe",
        amount: 2500,
        method: "upi",
        status: "success",
        gateway: "PhonePe",
        transactionId: "PP123456789",
        timestamp: "2024-05-06T10:30:00",
        fees: 25,
        settled: true,
      },
      {
        id: "TXN002",
        invoiceId: "INV002",
        patientName: "Jane Smith",
        amount: 1800,
        method: "card",
        status: "pending",
        gateway: "Razorpay",
        transactionId: "RZ987654321",
        timestamp: "2024-05-06T11:15:00",
        fees: 32,
        settled: false,
      },
      {
        id: "TXN003",
        invoiceId: "INV003",
        patientName: "Mike Johnson",
        amount: 3200,
        method: "netbanking",
        status: "failed",
        gateway: "PayU",
        transactionId: "PU456789123",
        timestamp: "2024-05-06T09:45:00",
        fees: 0,
        settled: false,
      },
      {
        id: "TXN004",
        invoiceId: "INV004",
        patientName: "Sarah Wilson",
        amount: 1500,
        method: "cash",
        status: "success",
        gateway: "Manual",
        transactionId: "CASH001",
        timestamp: "2024-05-05T16:20:00",
        fees: 0,
        settled: true,
      },
    ];

    setTimeout(() => {
      setTransactions(mockTransactions);
      setFilteredTransactions(mockTransactions);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter transactions
  useEffect(() => {
    let filtered = transactions;

    if (dateFilter) {
      filtered = filtered.filter((txn) => txn.timestamp.startsWith(dateFilter));
    }

    if (statusFilter) {
      filtered = filtered.filter((txn) => txn.status === statusFilter);
    }

    if (methodFilter) {
      filtered = filtered.filter((txn) => txn.method === methodFilter);
    }

    setFilteredTransactions(filtered);
  }, [transactions, dateFilter, statusFilter, methodFilter]);

  const getSummaryStats = () => {
    const totalAmount = filteredTransactions.reduce((sum, txn) => sum + txn.amount, 0);
    const totalFees = filteredTransactions.reduce((sum, txn) => sum + txn.fees, 0);
    const settledAmount = filteredTransactions
      .filter((txn) => txn.settled)
      .reduce((sum, txn) => sum + txn.amount, 0);
    const pendingAmount = totalAmount - settledAmount;

    return { totalAmount, totalFees, settledAmount, pendingAmount };
  };

  const stats = getSummaryStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--brand)]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Payment Reconciliation</h2>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--brand)] text-white rounded-lg text-sm font-medium hover:bg-[var(--brand-hover)]">
          <Download size={14} />
          Export Report
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface rounded-lg p-4">
          <div className="text-xs text-muted-foreground mb-1">Total Transactions</div>
          <div className="text-2xl font-bold">{filteredTransactions.length}</div>
          <div className="text-xs text-muted-foreground mt-1">{formatAmount(stats.totalAmount)}</div>
        </div>
        <div className="bg-surface rounded-lg p-4">
          <div className="text-xs text-muted-foreground mb-1">Gateway Fees</div>
          <div className="text-2xl font-bold text-[var(--warning)]">
            {formatAmount(stats.totalFees)}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {((stats.totalFees / stats.totalAmount) * 100).toFixed(1)}% avg
          </div>
        </div>
        <div className="bg-surface rounded-lg p-4">
          <div className="text-xs text-muted-foreground mb-1">Settled Amount</div>
          <div className="text-2xl font-bold text-[var(--success)]">
            {formatAmount(stats.settledAmount)}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {((stats.settledAmount / stats.totalAmount) * 100).toFixed(1)}% settled
          </div>
        </div>
        <div className="bg-surface rounded-lg p-4">
          <div className="text-xs text-muted-foreground mb-1">Pending Settlement</div>
          <div className="text-2xl font-bold text-[var(--warning)]">
            {formatAmount(stats.pendingAmount)}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {((stats.pendingAmount / stats.totalAmount) * 100).toFixed(1)}% pending
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-border bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 rounded-lg border border-border bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
          >
            <option value="">All Status</option>
            {Object.entries(PAYMENT_STATUS).map(([key, config]) => (
              <option key={key} value={key}>
                {config.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Payment Method</label>
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="px-4 py-2 rounded-lg border border-border bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
          >
            <option value="">All Methods</option>
            {Object.entries(PAYMENT_METHODS).map(([key, config]) => (
              <option key={key} value={key}>
                {config.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Outstanding Ledger */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="font-display font-semibold">Outstanding Ledger</h3>
          <p className="text-xs text-muted-foreground mt-1">Payments pending settlement</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface text-xs text-muted-foreground uppercase tracking-wide">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Transaction</th>
                <th className="text-left px-4 py-3 font-medium">Patient</th>
                <th className="text-left px-4 py-3 font-medium">Method</th>
                <th className="text-left px-4 py-3 font-medium">Gateway</th>
                <th className="text-right px-4 py-3 font-medium">Amount</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium">Settlement</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((txn, i) => {
                const StatusIcon = PAYMENT_STATUS[txn.status].icon;
                const methodConfig = PAYMENT_METHODS[txn.method];

                return (
                  <tr
                    key={txn.id}
                    className={`cursor-pointer hover:bg-surface-alt transition-colors ${i % 2 ? "bg-surface/40" : ""}`}
                  >
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-medium">{txn.id}</div>
                        <div className="text-xs text-muted-foreground">{txn.transactionId}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-medium">{txn.patientName}</div>
                        <div className="text-xs text-muted-foreground">{txn.invoiceId}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{methodConfig.icon}</span>
                        <span className="text-sm">{methodConfig.label}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="info">{txn.gateway}</Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="font-medium">{formatAmount(txn.amount)}</div>
                      {txn.fees > 0 && (
                        <div className="text-xs text-muted-foreground">
                          Fee: {formatAmount(txn.fees)}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <StatusIcon
                          size={14}
                          className={`text-[var(--${PAYMENT_STATUS[txn.status].color})]`}
                        />
                        <Badge variant={PAYMENT_STATUS[txn.status].color}>
                          {PAYMENT_STATUS[txn.status].label}
                        </Badge>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={txn.settled ? "success" : "warning"}>
                        {txn.settled ? "Settled" : "Pending"}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-2">No transactions found</p>
            <p className="text-xs text-muted-foreground">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
