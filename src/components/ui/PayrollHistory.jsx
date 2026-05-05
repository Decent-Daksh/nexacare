import { Download, Eye, TrendingUp, DollarSign } from 'lucide-react';
import { usePayrollHistory } from '../../hooks/useStaffDetail';
import LoadingSpinner from './LoadingSpinner';
import ErrorState from './ErrorState';
import Badge from './Badge';

export default function PayrollHistory({
  staffId,
  onViewDetail,
}) {
  const { payroll, loading, error, refetch, downloadSlip } = usePayrollHistory(staffId);

  if (loading) return <LoadingSpinner label="Loading payroll history..." />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  const handleDownload = async (payrollId) => {
    try {
      await downloadSlip(payrollId);
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  const totalEarnings = payroll.reduce((sum, p) => sum + (p.totalEarnings || 0), 0);
  const totalDeductions = payroll.reduce((sum, p) => sum + (p.totalDeductions || 0), 0);
  const totalNetSalary = payroll.reduce((sum, p) => sum + (p.netSalary || 0), 0);

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="border border-border rounded-lg p-3 bg-surface">
          <p className="text-xs text-muted-foreground mb-1">Total Earnings</p>
          <p className="text-lg font-bold text-[var(--success)]">
            ₹{(totalEarnings / 100000).toFixed(1)}L
          </p>
        </div>
        <div className="border border-border rounded-lg p-3 bg-surface">
          <p className="text-xs text-muted-foreground mb-1">Total Deductions</p>
          <p className="text-lg font-bold text-[var(--danger)]">
            ₹{(totalDeductions / 100000).toFixed(1)}L
          </p>
        </div>
        <div className="border border-border rounded-lg p-3 bg-surface">
          <p className="text-xs text-muted-foreground mb-1">Net Salary</p>
          <p className="text-lg font-bold text-[var(--brand)]">
            ₹{(totalNetSalary / 100000).toFixed(1)}L
          </p>
        </div>
      </div>

      {/* Payroll Table */}
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface text-xs text-muted-foreground uppercase tracking-wide">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Month</th>
                <th className="text-right px-4 py-3 font-medium">Earnings</th>
                <th className="text-right px-4 py-3 font-medium">Deductions</th>
                <th className="text-right px-4 py-3 font-medium">Net Salary</th>
                <th className="text-center px-4 py-3 font-medium">Status</th>
                <th className="text-center px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payroll.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-muted-foreground">
                    No payroll records found
                  </td>
                </tr>
              ) : (
                payroll.map((record, idx) => (
                  <tr
                    key={record.id}
                    className={`border-t border-border hover:bg-surface transition-colors ${
                      idx % 2 ? 'bg-surface/40' : ''
                    }`}
                  >
                    <td className="px-4 py-3 font-medium text-foreground">
                      {new Date(record.month + '-01').toLocaleDateString('en-IN', {
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="text-right px-4 py-3 text-[var(--success)]">
                      ₹{record.totalEarnings?.toLocaleString()}
                    </td>
                    <td className="text-right px-4 py-3 text-[var(--danger)]">
                      ₹{record.totalDeductions?.toLocaleString()}
                    </td>
                    <td className="text-right px-4 py-3 font-semibold text-foreground">
                      ₹{record.netSalary?.toLocaleString()}
                    </td>
                    <td className="text-center px-4 py-3">
                      <Badge
                        variant={record.status === 'paid' ? 'success' : 'warning'}
                      >
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="text-center px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => onViewDetail?.(record.id)}
                          className="p-2 hover:bg-background rounded-lg transition text-muted-foreground hover:text-foreground"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleDownload(record.id)}
                          className="p-2 hover:bg-background rounded-lg transition text-muted-foreground hover:text-foreground"
                          title="Download Slip"
                        >
                          <Download size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
