import { useState, useEffect } from "react";
import { Clock, CheckCircle, AlertCircle, XCircle, Filter, Search } from "lucide-react";
import Badge from "./Badge";
import { formatINR } from "../../lib/format";

const CLAIM_STATUSES = {
  submitted: { label: "Submitted", color: "warning", icon: Clock },
  in_review: { label: "In Review", color: "info", icon: AlertCircle },
  approved: { label: "Approved", color: "success", icon: CheckCircle },
  paid: { label: "Paid", color: "success", icon: CheckCircle },
  rejected: { label: "Rejected", color: "danger", icon: XCircle },
};

export default function InsuranceClaimTracker({ patientId }) {
  const [claims, setClaims] = useState([]);
  const [filteredClaims, setFilteredClaims] = useState([]);
  const [tpaFilter, setTpaFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockClaims = [
      {
        id: "CLM001",
        invoiceId: "INV001",
        amount: 2500,
        status: "submitted",
        tpa: "Star Health",
        submittedDate: "2024-05-01",
        patientName: "John Doe",
        diagnosis: "Hypertension Consultation",
        processingTime: "2 days",
      },
      {
        id: "CLM002",
        invoiceId: "INV002",
        amount: 1800,
        status: "in_review",
        tpa: "ICICI Lombard",
        submittedDate: "2024-04-28",
        patientName: "Jane Smith",
        diagnosis: "Diabetes Checkup",
        processingTime: "5 days",
      },
      {
        id: "CLM003",
        invoiceId: "INV003",
        amount: 3200,
        status: "approved",
        tpa: "HDFC ERGO",
        submittedDate: "2024-04-25",
        patientName: "Mike Johnson",
        diagnosis: "Cardiac Consultation",
        processingTime: "7 days",
      },
      {
        id: "CLM004",
        invoiceId: "INV004",
        amount: 1500,
        status: "paid",
        tpa: "Star Health",
        submittedDate: "2024-04-20",
        patientName: "Sarah Wilson",
        diagnosis: "General Consultation",
        processingTime: "10 days",
      },
    ];

    setTimeout(() => {
      setClaims(mockClaims);
      setFilteredClaims(mockClaims);
      setLoading(false);
    }, 1000);
  }, [patientId]);

  // Filter claims based on TPA, status, and search term
  useEffect(() => {
    let filtered = claims;

    if (tpaFilter) {
      filtered = filtered.filter((claim) => claim.tpa === tpaFilter);
    }

    if (statusFilter) {
      filtered = filtered.filter((claim) => claim.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (claim) =>
          claim.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          claim.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
          claim.id.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    setFilteredClaims(filtered);
  }, [claims, tpaFilter, statusFilter, searchTerm]);

  const getTPAs = () => {
    return [...new Set(claims.map((claim) => claim.tpa))];
  };

  const getClaimsByStatus = (status) => {
    return filteredClaims.filter((claim) => claim.status === status);
  };

  const moveClaim = (claimId, newStatus) => {
    setClaims((prev) =>
      prev.map((claim) => (claim.id === claimId ? { ...claim, status: newStatus } : claim)),
    );
  };

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
        <h2 className="text-xl font-semibold">Insurance Claim Tracker</h2>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock size={14} />
          <span>Avg. Processing: 7 days</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex-1 min-w-64">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="Search claims..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
            />
          </div>
        </div>

        <select
          value={tpaFilter}
          onChange={(e) => setTpaFilter(e.target.value)}
          className="px-4 py-2 rounded-lg border border-border bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
        >
          <option value="">All TPAs</option>
          {getTPAs().map((tpa) => (
            <option key={tpa} value={tpa}>
              {tpa}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 rounded-lg border border-border bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
        >
          <option value="">All Status</option>
          {Object.entries(CLAIM_STATUSES).map(([key, config]) => (
            <option key={key} value={key}>
              {config.label}
            </option>
          ))}
        </select>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(CLAIM_STATUSES).map(([statusKey, statusConfig]) => {
          const statusClaims = getClaimsByStatus(statusKey);
          const StatusIcon = statusConfig.icon;

          return (
            <div key={statusKey} className="bg-surface rounded-lg p-4 min-h-96">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <StatusIcon size={16} className={`text-[var(--${statusConfig.color})]`} />
                  <h3 className="font-medium text-sm">{statusConfig.label}</h3>
                </div>
                <Badge variant={statusConfig.color}>{statusClaims.length}</Badge>
              </div>

              <div className="space-y-3">
                {statusClaims.map((claim) => (
                  <div
                    key={claim.id}
                    className="bg-card border border-border rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => {
                      /* Open claim details */
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-medium text-sm">{claim.patientName}</div>
                        <div className="text-xs text-muted-foreground">{claim.id}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-sm">{formatINR(claim.amount)}</div>
                        <div className="text-xs text-muted-foreground">{claim.processingTime}</div>
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground mb-2">{claim.diagnosis}</div>

                    <div className="flex items-center justify-between">
                      <Badge variant="info" className="text-xs">
                        {claim.tpa}
                      </Badge>
                      <div className="text-xs text-muted-foreground">
                        {new Date(claim.submittedDate).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Status change buttons for demo */}
                    <div className="flex gap-1 mt-3">
                      {Object.entries(CLAIM_STATUSES)
                        .filter(([key]) => key !== statusKey)
                        .slice(0, 2) // Show only next 2 possible statuses
                        .map(([nextKey, nextConfig]) => (
                          <button
                            key={nextKey}
                            onClick={(e) => {
                              e.stopPropagation();
                              moveClaim(claim.id, nextKey);
                            }}
                            className="flex-1 px-2 py-1 bg-[var(--brand)] text-white rounded text-xs hover:bg-[var(--brand-hover)]"
                          >
                            → {nextConfig.label}
                          </button>
                        ))}
                    </div>
                  </div>
                ))}

                {statusClaims.length === 0 && (
                  <div className="text-center text-muted-foreground py-8 text-sm">
                    No claims in {statusConfig.label.toLowerCase()}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface rounded-lg p-4">
          <div className="text-xs text-muted-foreground mb-1">Total Claims</div>
          <div className="text-2xl font-bold">{claims.length}</div>
        </div>
        <div className="bg-surface rounded-lg p-4">
          <div className="text-xs text-muted-foreground mb-1">Approved Amount</div>
          <div className="text-2xl font-bold text-[var(--success)]">
            {formatINR(
              claims
                .filter((c) => c.status === "approved" || c.status === "paid")
                .reduce((sum, c) => sum + c.amount, 0),
            )}
          </div>
        </div>
        <div className="bg-surface rounded-lg p-4">
          <div className="text-xs text-muted-foreground mb-1">Pending Review</div>
          <div className="text-2xl font-bold text-[var(--warning)]">
            {claims.filter((c) => c.status === "submitted" || c.status === "in_review").length}
          </div>
        </div>
        <div className="bg-surface rounded-lg p-4">
          <div className="text-xs text-muted-foreground mb-1">Avg Processing Time</div>
          <div className="text-2xl font-bold">7 days</div>
        </div>
      </div>
    </div>
  );
}
