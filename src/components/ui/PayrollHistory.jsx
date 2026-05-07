import { useState, useEffect } from "react";
import {
  Download,
  Eye,
  TrendingUp,
  DollarSign,
  Calculator,
  FileText,
  Receipt,
  AlertCircle,
} from "lucide-react";
import { usePayrollHistory } from "../../hooks/useStaffDetail";
import LoadingSpinner from "./LoadingSpinner";
import ErrorState from "./ErrorState";
import Badge from "./Badge";
import Modal from "./Modal";
import { formatINR } from "../../lib/format";

export default function PayrollDashboard({ staffId, onViewDetail }) {
  const [selectedPayroll, setSelectedPayroll] = useState(null);
  const [showPayslipModal, setShowPayslipModal] = useState(false);
  const [showCalculationModal, setShowCalculationModal] = useState(false);
  const { payroll, loading, error, refetch, downloadSlip } = usePayrollHistory(staffId);

  // Mock enhanced payroll data with GST and tax calculations
  const [enhancedPayroll, setEnhancedPayroll] = useState([]);

  useEffect(() => {
    if (payroll.length > 0) {
      const enhanced = payroll.map((record) => ({
        ...record,
        earnings: {
          basic: record.totalEarnings * 0.4,
          hra: record.totalEarnings * 0.2,
          conveyance: record.totalEarnings * 0.05,
          medical: record.totalEarnings * 0.05,
          lta: record.totalEarnings * 0.1,
          special: record.totalEarnings * 0.1,
          overtime: record.totalEarnings * 0.1,
        },
        deductions: {
          pf: record.totalEarnings * 0.12,
          professionalTax: 235,
          tds: record.totalEarnings * 0.05,
          insurance: 1500,
          loan: 2000,
        },
        taxes: {
          cgst: record.totalEarnings * 0.09,
          sgst: record.totalEarnings * 0.09,
          igst: 0,
          totalGST: record.totalEarnings * 0.18,
        },
      }));
      setEnhancedPayroll(enhanced);
    }
  }, [payroll]);

  if (loading) return <LoadingSpinner label="Loading payroll dashboard..." />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  const handleDownload = async (payrollId) => {
    try {
      await downloadSlip(payrollId);
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  const generatePayslipPDF = (payrollRecord) => {
    // Mock PDF generation - in real implementation, use a PDF library
    const payslipContent = `
NEXACARE HOSPITAL
PAYSLIP - ${payrollRecord.month}

Employee Details:
Name: Staff Member
Employee ID: ${staffId}
Department: Medical
Designation: Doctor

Salary Period: ${payrollRecord.month}

EARNINGS:
Basic Salary: ${formatINR(payrollRecord.earnings?.basic || 0)}
HRA: ${formatINR(payrollRecord.earnings?.hra || 0)}
Conveyance: ${formatINR(payrollRecord.earnings?.conveyance || 0)}
Medical Allowance: ${formatINR(payrollRecord.earnings?.medical || 0)}
LTA: ${formatINR(payrollRecord.earnings?.lta || 0)}
Special Allowance: ${formatINR(payrollRecord.earnings?.special || 0)}
Overtime: ${formatINR(payrollRecord.earnings?.overtime || 0)}

Total Earnings: ${formatINR(payrollRecord.totalEarnings || 0)}

DEDUCTIONS:
Provident Fund: ${formatINR(payrollRecord.deductions?.pf || 0)}
Professional Tax: ${formatINR(payrollRecord.deductions?.professionalTax || 0)}
TDS: ${formatINR(payrollRecord.deductions?.tds || 0)}
Insurance: ${formatINR(payrollRecord.deductions?.insurance || 0)}
Loan Repayment: ${formatINR(payrollRecord.deductions?.loan || 0)}

Total Deductions: ${formatINR(payrollRecord.totalDeductions || 0)}

TAXES (GST):
CGST (9%): ${formatINR(payrollRecord.taxes?.cgst || 0)}
SGST (9%): ${formatINR(payrollRecord.taxes?.sgst || 0)}
IGST (0%): ${formatINR(payrollRecord.taxes?.igst || 0)}
Total GST: ${formatINR(payrollRecord.taxes?.totalGST || 0)}

NET SALARY: ${formatINR(payrollRecord.netSalary || 0)}

This is a computer generated payslip.
Generated on: ${new Date().toLocaleDateString()}
    `;

    // Create and download PDF (mock implementation)
    const blob = new Blob([payslipContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `payslip-${payrollRecord.month}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const totalEarnings = enhancedPayroll.reduce((sum, p) => sum + (p.totalEarnings || 0), 0);
  const totalDeductions = enhancedPayroll.reduce((sum, p) => sum + (p.totalDeductions || 0), 0);
  const totalNetSalary = enhancedPayroll.reduce((sum, p) => sum + (p.netSalary || 0), 0);
  const totalGST = enhancedPayroll.reduce((sum, p) => sum + (p.taxes?.totalGST || 0), 0);

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={16} className="text-[var(--success)]" />
            <div className="text-xs text-muted-foreground">Total Earnings</div>
          </div>
          <div className="text-2xl font-bold text-[var(--success)]">{formatINR(totalEarnings)}</div>
          <div className="text-xs text-muted-foreground mt-1">{enhancedPayroll.length} months</div>
        </div>

        <div className="bg-surface rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle size={16} className="text-[var(--danger)]" />
            <div className="text-xs text-muted-foreground">Total Deductions</div>
          </div>
          <div className="text-2xl font-bold text-[var(--danger)]">
            {formatINR(totalDeductions)}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Avg: {formatINR(totalDeductions / enhancedPayroll.length)}
          </div>
        </div>

        <div className="bg-surface rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calculator size={16} className="text-[var(--brand)]" />
            <div className="text-xs text-muted-foreground">GST Paid</div>
          </div>
          <div className="text-2xl font-bold text-[var(--brand)]">{formatINR(totalGST)}</div>
          <div className="text-xs text-muted-foreground mt-1">CGST + SGST</div>
        </div>

        <div className="bg-surface rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-[var(--info)]" />
            <div className="text-xs text-muted-foreground">Net Salary</div>
          </div>
          <div className="text-2xl font-bold text-[var(--info)]">{formatINR(totalNetSalary)}</div>
          <div className="text-xs text-muted-foreground mt-1">After all deductions</div>
        </div>
      </div>

      {/* Payroll Table */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="font-display font-semibold">Monthly Payroll Breakdown</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Detailed earnings, deductions and tax calculations
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface text-xs text-muted-foreground uppercase tracking-wide">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Month</th>
                <th className="text-right px-4 py-3 font-medium">Earnings</th>
                <th className="text-right px-4 py-3 font-medium">Deductions</th>
                <th className="text-right px-4 py-3 font-medium">GST</th>
                <th className="text-right px-4 py-3 font-medium">Net Salary</th>
                <th className="text-center px-4 py-3 font-medium">Status</th>
                <th className="text-center px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {enhancedPayroll.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-muted-foreground">
                    No payroll records found
                  </td>
                </tr>
              ) : (
                enhancedPayroll.map((record, idx) => (
                  <tr
                    key={record.id}
                    className={`border-t border-border hover:bg-surface transition-colors ${
                      idx % 2 ? "bg-surface/40" : ""
                    }`}
                  >
                    <td className="px-4 py-3 font-medium text-foreground">
                      {new Date(record.month + "-01").toLocaleDateString("en-IN", {
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="text-right px-4 py-3 text-[var(--success)]">
                      {formatINR(record.totalEarnings)}
                    </td>
                    <td className="text-right px-4 py-3 text-[var(--danger)]">
                      {formatINR(record.totalDeductions)}
                    </td>
                    <td className="text-right px-4 py-3 text-[var(--brand)]">
                      {formatINR(record.taxes?.totalGST || 0)}
                    </td>
                    <td className="text-right px-4 py-3 font-semibold text-foreground">
                      {formatINR(record.netSalary)}
                    </td>
                    <td className="text-center px-4 py-3">
                      <Badge variant={record.status === "paid" ? "success" : "warning"}>
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="text-center px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => {
                            setSelectedPayroll(record);
                            setShowCalculationModal(true);
                          }}
                          className="p-2 hover:bg-background rounded-lg transition text-muted-foreground hover:text-foreground"
                          title="View Calculations"
                        >
                          <Calculator size={14} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedPayroll(record);
                            setShowPayslipModal(true);
                          }}
                          className="p-2 hover:bg-background rounded-lg transition text-muted-foreground hover:text-foreground"
                          title="View Payslip"
                        >
                          <Receipt size={14} />
                        </button>
                        <button
                          onClick={() => generatePayslipPDF(record)}
                          className="p-2 hover:bg-background rounded-lg transition text-muted-foreground hover:text-foreground"
                          title="Download PDF"
                        >
                          <Download size={14} />
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

      {/* Calculation Modal */}
      <Modal
        open={showCalculationModal}
        onClose={() => {
          setShowCalculationModal(false);
          setSelectedPayroll(null);
        }}
        title={`Payroll Calculations - ${selectedPayroll?.month || ""}`}
        width="max-w-2xl"
      >
        {selectedPayroll && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Earnings Breakdown */}
              <div>
                <h4 className="font-medium mb-3 text-[var(--success)]">Earnings Breakdown</h4>
                <div className="space-y-2">
                  {Object.entries(selectedPayroll.earnings || {}).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                      <span className="font-medium">{formatINR(value)}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Total Earnings</span>
                    <span>{formatINR(selectedPayroll.totalEarnings)}</span>
                  </div>
                </div>
              </div>

              {/* Deductions Breakdown */}
              <div>
                <h4 className="font-medium mb-3 text-[var(--danger)]">Deductions Breakdown</h4>
                <div className="space-y-2">
                  {Object.entries(selectedPayroll.deductions || {}).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                      <span className="font-medium">{formatINR(value)}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Total Deductions</span>
                    <span>{formatINR(selectedPayroll.totalDeductions)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tax Calculations */}
            <div>
              <h4 className="font-medium mb-3 text-[var(--brand)]">GST Calculations</h4>
              <div className="bg-surface rounded-lg p-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-xs text-muted-foreground">CGST (9%)</div>
                    <div className="font-semibold">
                      {formatINR(selectedPayroll.taxes?.cgst || 0)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">SGST (9%)</div>
                    <div className="font-semibold">
                      {formatINR(selectedPayroll.taxes?.sgst || 0)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">IGST (0%)</div>
                    <div className="font-semibold">
                      {formatINR(selectedPayroll.taxes?.igst || 0)}
                    </div>
                  </div>
                </div>
                <div className="border-t mt-4 pt-4 flex justify-between font-semibold">
                  <span>Total GST</span>
                  <span>{formatINR(selectedPayroll.taxes?.totalGST || 0)}</span>
                </div>
              </div>
            </div>

            {/* Final Calculation */}
            <div className="bg-[var(--brand)]/10 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Net Salary</span>
                <span className="text-xl font-bold text-[var(--brand)]">
                  {formatINR(selectedPayroll.netSalary)}
                </span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">Earnings - Deductions - GST</div>
            </div>
          </div>
        )}
      </Modal>

      {/* Payslip Modal */}
      <Modal
        open={showPayslipModal}
        onClose={() => {
          setShowPayslipModal(false);
          setSelectedPayroll(null);
        }}
        title={`Payslip Preview - ${selectedPayroll?.month || ""}`}
        width="max-w-2xl"
      >
        {selectedPayroll && (
          <div className="space-y-4">
            <div className="border rounded-lg p-6 bg-white text-black">
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold">NEXACARE HOSPITAL</h1>
                <p className="text-sm text-gray-600">Salary Slip - {selectedPayroll.month}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                <div>
                  <p>
                    <strong>Employee Name:</strong> Staff Member
                  </p>
                  <p>
                    <strong>Employee ID:</strong> {staffId}
                  </p>
                  <p>
                    <strong>Department:</strong> Medical
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Designation:</strong> Doctor
                  </p>
                  <p>
                    <strong>Pay Period:</strong> {selectedPayroll.month}
                  </p>
                  <p>
                    <strong>Payment Date:</strong> 01-{selectedPayroll.month.split("-")[1]}-
                    {selectedPayroll.month.split("-")[0]}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold mb-2">Earnings</h3>
                  <div className="space-y-1 text-sm">
                    {Object.entries(selectedPayroll.earnings || {}).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                        <span>{formatINR(value)}</span>
                      </div>
                    ))}
                    <div className="border-t pt-1 flex justify-between font-semibold">
                      <span>Total Earnings</span>
                      <span>{formatINR(selectedPayroll.totalEarnings)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Deductions</h3>
                  <div className="space-y-1 text-sm">
                    {Object.entries(selectedPayroll.deductions || {}).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                        <span>{formatINR(value)}</span>
                      </div>
                    ))}
                    <div className="border-t pt-1 flex justify-between font-semibold">
                      <span>Total Deductions</span>
                      <span>{formatINR(selectedPayroll.totalDeductions)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold mb-2">Tax Calculations (GST)</h3>
                <div className="grid grid-cols-3 gap-4 text-center text-sm">
                  <div>
                    <div className="text-gray-600">CGST (9%)</div>
                    <div className="font-semibold">
                      {formatINR(selectedPayroll.taxes?.cgst || 0)}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600">SGST (9%)</div>
                    <div className="font-semibold">
                      {formatINR(selectedPayroll.taxes?.sgst || 0)}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600">Total GST</div>
                    <div className="font-semibold">
                      {formatINR(selectedPayroll.taxes?.totalGST || 0)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Net Salary</span>
                  <span>{formatINR(selectedPayroll.netSalary)}</span>
                </div>
              </div>

              <div className="text-center text-xs text-gray-500 mt-6">
                This is a computer generated payslip. Generated on {new Date().toLocaleDateString()}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => generatePayslipPDF(selectedPayroll)}
                className="flex-1 px-4 py-2 bg-[var(--brand)] text-white rounded-lg text-sm font-medium hover:bg-[var(--brand-hover)]"
              >
                <Download size={14} className="inline mr-2" />
                Download PDF
              </button>
              <button
                onClick={() => {
                  setShowPayslipModal(false);
                  setSelectedPayroll(null);
                }}
                className="px-4 py-2 bg-surface border border-border rounded-lg text-sm hover:bg-surface-alt"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
