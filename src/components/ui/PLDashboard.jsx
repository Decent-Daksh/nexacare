import { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Stethoscope,
  Pill,
  Activity,
} from "lucide-react";
import Badge from "./Badge";
import { useCurrency } from '../../context/CurrencyContext';

export default function PLDashboard() {
  const [plData, setPlData] = useState({});
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [loading, setLoading] = useState(true);
  const { formatAmount } = useCurrency();

  // Mock P&L data - replace with actual API call
  useEffect(() => {
    const mockData = {
      month: {
        revenue: {
          consultations: 285000,
          procedures: 125000,
          pharmacy: 45000,
          insurance: 95000,
          total: 550000,
        },
        costs: {
          staff: 180000,
          supplies: 35000,
          rent: 25000,
          utilities: 12000,
          marketing: 15000,
          insurance: 8000,
          total: 275000,
        },
        margins: {
          gross: 275000,
          net: 225000,
          percentage: 40.9,
        },
      },
      quarter: {
        revenue: {
          consultations: 825000,
          procedures: 375000,
          pharmacy: 125000,
          insurance: 275000,
          total: 1600000,
        },
        costs: {
          staff: 520000,
          supplies: 105000,
          rent: 75000,
          utilities: 36000,
          marketing: 45000,
          insurance: 24000,
          total: 805000,
        },
        margins: {
          gross: 795000,
          net: 655000,
          percentage: 40.9,
        },
      },
    };

    setTimeout(() => {
      setPlData(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  const getCurrentData = () => plData[selectedPeriod] || {};

  const getServiceBreakdown = () => {
    const data = getCurrentData();
    if (!data.revenue) return [];

    const totalRevenue = data.revenue.total;
    return [
      {
        name: "Consultations",
        amount: data.revenue.consultations,
        percentage: (data.revenue.consultations / totalRevenue) * 100,
        icon: Stethoscope,
        color: "brand",
      },
      {
        name: "Procedures",
        amount: data.revenue.procedures,
        percentage: (data.revenue.procedures / totalRevenue) * 100,
        icon: Activity,
        color: "success",
      },
      {
        name: "Pharmacy",
        amount: data.revenue.pharmacy,
        percentage: (data.revenue.pharmacy / totalRevenue) * 100,
        icon: Pill,
        color: "warning",
      },
      {
        name: "Insurance Claims",
        amount: data.revenue.insurance,
        percentage: (data.revenue.insurance / totalRevenue) * 100,
        icon: DollarSign,
        color: "info",
      },
    ];
  };

  const getCostBreakdown = () => {
    const data = getCurrentData();
    if (!data.costs) return [];

    const totalCosts = data.costs.total;
    return [
      {
        name: "Staff Salaries",
        amount: data.costs.staff,
        percentage: (data.costs.staff / totalCosts) * 100,
      },
      {
        name: "Medical Supplies",
        amount: data.costs.supplies,
        percentage: (data.costs.supplies / totalCosts) * 100,
      },
      {
        name: "Rent & Utilities",
        amount: data.costs.rent + data.costs.utilities,
        percentage: ((data.costs.rent + data.costs.utilities) / totalCosts) * 100,
      },
      {
        name: "Marketing",
        amount: data.costs.marketing,
        percentage: (data.costs.marketing / totalCosts) * 100,
      },
      {
        name: "Insurance",
        amount: data.costs.insurance,
        percentage: (data.costs.insurance / totalCosts) * 100,
      },
    ];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--brand)]"></div>
      </div>
    );
  }

  const data = getCurrentData();
  const serviceBreakdown = getServiceBreakdown();
  const costBreakdown = getCostBreakdown();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">P&L Dashboard</h2>
        <div className="flex items-center gap-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 rounded-lg border border-border bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
          >
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-[var(--success)]" />
            <div className="text-xs text-muted-foreground">Total Revenue</div>
          </div>
          <div className="text-2xl font-bold text-[var(--success)]">
            {formatAmount(data.revenue?.total || 0)}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            +12.5% from last {selectedPeriod}
          </div>
        </div>

        <div className="bg-surface rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown size={16} className="text-[var(--danger)]" />
            <div className="text-xs text-muted-foreground">Total Costs</div>
          </div>
          <div className="text-2xl font-bold text-[var(--danger)]">
            {formatAmount(data.costs?.total || 0)}
          </div>
          <div className="text-xs text-muted-foreground mt-1">50% of revenue</div>
        </div>

        <div className="bg-surface rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={16} className="text-[var(--brand)]" />
            <div className="text-xs text-muted-foreground">Net Profit</div>
          </div>
          <div className="text-2xl font-bold text-[var(--brand)]">
            {formatAmount(data.margins?.net || 0)}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {data.margins?.percentage.toFixed(1)}% margin
          </div>
        </div>

        <div className="bg-surface rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users size={16} className="text-[var(--info)]" />
            <div className="text-xs text-muted-foreground">Profit per Patient</div>
          </div>
          <div className="text-2xl font-bold text-[var(--info)]">
            {formatAmount(Math.round((data.margins?.net || 0) / 450))} {/* Assuming 450 patients */}
          </div>
          <div className="text-xs text-muted-foreground mt-1">Avg per visit</div>
        </div>
      </div>

      {/* Revenue vs Cost Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Breakdown */}
        <div className="bg-card border border-border rounded-xl shadow-sm p-6">
          <h3 className="font-display font-semibold mb-4">Revenue Breakdown</h3>

          <div className="space-y-4">
            {serviceBreakdown.map((service) => {
              const IconComponent = service.icon;
              return (
                <div key={service.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <IconComponent size={16} className={`text-[var(--${service.color})]`} />
                      <span className="font-medium text-sm">{service.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{formatAmount(service.amount)}</div>
                      <div className="text-xs text-muted-foreground">
                        {service.percentage.toFixed(1)}%
                      </div>
                    </div>
                  </div>

                  <div className="w-full bg-surface rounded-full h-2">
                    <div
                      className={`h-2 bg-[var(--${service.color})] rounded-full`}
                      style={{ width: `${service.percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cost Breakdown */}
        <div className="bg-card border border-border rounded-xl shadow-sm p-6">
          <h3 className="font-display font-semibold mb-4">Cost Breakdown</h3>

          <div className="space-y-4">
            {costBreakdown.map((cost) => (
              <div key={cost.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{cost.name}</span>
                  <div className="text-right">
                    <div className="font-semibold">{formatAmount(cost.amount)}</div>
                    <div className="text-xs text-muted-foreground">
                      {cost.percentage.toFixed(1)}%
                    </div>
                  </div>
                </div>

                <div className="w-full bg-surface rounded-full h-2">
                  <div
                    className="h-2 bg-[var(--danger)] rounded-full"
                    style={{ width: `${cost.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Profitability Analysis */}
      <div className="bg-card border border-border rounded-xl shadow-sm p-6">
        <h3 className="font-display font-semibold mb-4">Service-wise Profitability</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface text-xs text-muted-foreground uppercase tracking-wide">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Service</th>
                <th className="text-right px-4 py-3 font-medium">Revenue</th>
                <th className="text-right px-4 py-3 font-medium">Direct Costs</th>
                <th className="text-right px-4 py-3 font-medium">Contribution</th>
                <th className="text-right px-4 py-3 font-medium">Margin %</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "Cardiology", revenue: 125000, costs: 35000, margin: 65.2 },
                { name: "General Medicine", revenue: 185000, costs: 52000, margin: 71.9 },
                { name: "Orthopedics", revenue: 95000, costs: 28000, margin: 70.5 },
                { name: "Dermatology", revenue: 78000, costs: 22000, margin: 71.8 },
                { name: "Pediatrics", revenue: 87000, costs: 25000, margin: 71.3 },
              ].map((service, i) => {
                const contribution = service.revenue - service.costs;
                const isProfitable = service.margin > 60;

                return (
                  <tr key={service.name} className={`${i % 2 ? "bg-surface/40" : ""}`}>
                    <td className="px-4 py-3 font-medium">{service.name}</td>
                    <td className="px-4 py-3 text-right">{formatAmount(service.revenue)}</td>
                    <td className="px-4 py-3 text-right">{formatAmount(service.costs)}</td>
                    <td className="px-4 py-3 text-right font-medium">{formatAmount(contribution)}</td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={isProfitable ? "text-[var(--success)]" : "text-[var(--danger)]"}
                      >
                        {service.margin}%
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={isProfitable ? "success" : "warning"}>
                        {isProfitable ? "Profitable" : "Low Margin"}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cost Optimization Suggestions */}
      <div className="bg-card border border-border rounded-xl shadow-sm p-6">
        <h3 className="font-display font-semibold mb-4">Cost Optimization Opportunities</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-[color-mix(in_oklab,var(--success)_10%,white)] border border-[var(--success)]/20 rounded-lg">
            <div className="flex items-start gap-3">
              <TrendingUp size={20} className="text-[var(--success)] mt-0.5" />
              <div>
                <div className="font-medium text-sm mb-1">High Margin Services</div>
                <div className="text-xs text-muted-foreground mb-2">
                  General Medicine and Pediatrics showing 70%+ margins
                </div>
                <div className="text-xs text-[var(--success)] font-medium">
                  +₹45,000 potential by focusing on these services
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-[color-mix(in_oklab,var(--warning)_10%,white)] border border-[var(--warning)]/20 rounded-lg">
            <div className="flex items-start gap-3">
              <TrendingDown size={20} className="text-[var(--warning)] mt-0.5" />
              <div>
                <div className="font-medium text-sm mb-1">Cost Reduction Opportunity</div>
                <div className="text-xs text-muted-foreground mb-2">
                  Medical supplies cost increased 15% this month
                </div>
                <div className="text-xs text-[var(--warning)] font-medium">
                  ₹12,000 savings possible with bulk purchasing
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
