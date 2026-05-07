import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Calendar, Target, AlertTriangle } from "lucide-react";
import Badge from "./Badge";
import { formatINR } from "../../lib/format";

export default function RevenueForecast() {
  const [forecastData, setForecastData] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState("30");
  const [loading, setLoading] = useState(true);

  // Mock forecast data - replace with actual API call
  useEffect(() => {
    const mockData = {
      30: [
        { period: "Week 1", actual: 125000, projected: 135000, confidence: 85 },
        { period: "Week 2", actual: 118000, projected: 142000, confidence: 78 },
        { period: "Week 3", actual: 132000, projected: 138000, confidence: 82 },
        { period: "Week 4", actual: 0, projected: 145000, confidence: 75 },
      ],
      60: [
        { period: "Week 1-2", actual: 243000, projected: 277000, confidence: 80 },
        { period: "Week 3-4", actual: 132000, projected: 283000, confidence: 72 },
        { period: "Week 5-6", actual: 0, projected: 295000, confidence: 68 },
        { period: "Week 7-8", actual: 0, projected: 310000, confidence: 65 },
      ],
      90: [
        { period: "Month 1", actual: 375000, projected: 420000, confidence: 75 },
        { period: "Month 2", actual: 0, projected: 445000, confidence: 70 },
        { period: "Month 3", actual: 0, projected: 465000, confidence: 68 },
      ],
    };

    setTimeout(() => {
      setForecastData(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  const getCurrentData = () => forecastData[selectedPeriod] || [];

  const getSummaryStats = () => {
    const data = getCurrentData();
    const totalActual = data.reduce((sum, item) => sum + item.actual, 0);
    const totalProjected = data.reduce((sum, item) => sum + item.projected, 0);
    const avgConfidence = data.reduce((sum, item) => sum + item.confidence, 0) / data.length;

    const growth =
      totalProjected > totalActual ? ((totalProjected - totalActual) / totalActual) * 100 : 0;

    return { totalActual, totalProjected, avgConfidence, growth };
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return "success";
    if (confidence >= 70) return "warning";
    return "danger";
  };

  const getConfidenceLabel = (confidence) => {
    if (confidence >= 80) return "High";
    if (confidence >= 70) return "Medium";
    return "Low";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--brand)]"></div>
      </div>
    );
  }

  const data = getCurrentData();
  const stats = getSummaryStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Revenue Forecast</h2>
        <div className="flex items-center gap-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 rounded-lg border border-border bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
          >
            <option value="30">30 Days</option>
            <option value="60">60 Days</option>
            <option value="90">90 Days</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target size={16} className="text-[var(--brand)]" />
            <div className="text-xs text-muted-foreground">Projected Revenue</div>
          </div>
          <div className="text-2xl font-bold">{formatINR(stats.totalProjected)}</div>
          <div className="flex items-center gap-1 mt-1">
            <TrendingUp size={12} className="text-[var(--success)]" />
            <span className="text-xs text-[var(--success)]">
              +{stats.growth.toFixed(1)}% growth
            </span>
          </div>
        </div>

        <div className="bg-surface rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={16} className="text-[var(--info)]" />
            <div className="text-xs text-muted-foreground">Actual to Date</div>
          </div>
          <div className="text-2xl font-bold">{formatINR(stats.totalActual)}</div>
          <div className="text-xs text-muted-foreground mt-1">
            {((stats.totalActual / stats.totalProjected) * 100).toFixed(1)}% of target
          </div>
        </div>

        <div className="bg-surface rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={16} className="text-[var(--warning)]" />
            <div className="text-xs text-muted-foreground">Avg Confidence</div>
          </div>
          <div className="text-2xl font-bold">{stats.avgConfidence.toFixed(1)}%</div>
          <Badge variant={getConfidenceColor(stats.avgConfidence)} className="mt-1">
            {getConfidenceLabel(stats.avgConfidence)}
          </Badge>
        </div>

        <div className="bg-surface rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-[var(--success)]" />
            <div className="text-xs text-muted-foreground">Growth Potential</div>
          </div>
          <div className="text-2xl font-bold text-[var(--success)]">
            {formatINR(stats.totalProjected - stats.totalActual)}
          </div>
          <div className="text-xs text-muted-foreground mt-1">Additional revenue</div>
        </div>
      </div>

      {/* Forecast Chart */}
      <div className="bg-card border border-border rounded-xl shadow-sm p-6">
        <h3 className="font-display font-semibold mb-4">Revenue Projection Chart</h3>

        <div className="space-y-4">
          {data.map((item, index) => {
            const actualPercentage = item.actual > 0 ? (item.actual / item.projected) * 100 : 0;
            const isProjection = item.actual === 0;

            return (
              <div key={item.period} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-sm">{item.period}</span>
                    {isProjection && (
                      <Badge variant="info" className="text-xs">
                        Projected
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="text-right">
                      <div className="font-medium">{formatINR(item.projected)}</div>
                      <div className="text-xs text-muted-foreground">Target</div>
                    </div>
                    {item.actual > 0 && (
                      <div className="text-right">
                        <div className="font-medium text-[var(--success)]">
                          {formatINR(item.actual)}
                        </div>
                        <div className="text-xs text-muted-foreground">Actual</div>
                      </div>
                    )}
                    <Badge variant={getConfidenceColor(item.confidence)}>{item.confidence}%</Badge>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="relative">
                  <div className="h-3 bg-surface rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--brand)] rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min((item.projected / Math.max(...data.map((d) => d.projected))) * 100, 100)}%`,
                      }}
                    />
                    {item.actual > 0 && (
                      <div
                        className="absolute top-0 left-0 h-full bg-[var(--success)] rounded-full opacity-80"
                        style={{ width: `${actualPercentage}%` }}
                      />
                    )}
                  </div>

                  {/* Confidence Intervals */}
                  <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                    <span>0</span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[var(--brand)]"></span>
                      Target
                    </span>
                    {item.actual > 0 && (
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-[var(--success)]"></span>
                        Actual
                      </span>
                    )}
                    <span>{formatINR(Math.max(...data.map((d) => d.projected)))}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Anomaly Detection */}
      <div className="bg-card border border-border rounded-xl shadow-sm p-6">
        <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
          <AlertTriangle size={16} className="text-[var(--warning)]" />
          Anomaly Detection & Alerts
        </h3>

        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-[color-mix(in_oklab,var(--warning)_10%,white)] border border-[var(--warning)]/20 rounded-lg">
            <AlertTriangle size={16} className="text-[var(--warning)] mt-0.5" />
            <div>
              <div className="font-medium text-sm">Unusual Fee Pattern Detected</div>
              <div className="text-xs text-muted-foreground mt-1">
                Cardiology consultations showing 40% higher than average pricing. Review pricing
                strategy.
              </div>
              <div className="text-xs text-[var(--warning)] mt-1">
                Impact: ₹12,500 potential overcharge
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-[color-mix(in_oklab,var(--danger)_10%,white)] border border-[var(--danger)]/20 rounded-lg">
            <AlertTriangle size={16} className="text-[var(--danger)] mt-0.5" />
            <div>
              <div className="font-medium text-sm">Payment Gateway Issues</div>
              <div className="text-xs text-muted-foreground mt-1">
                15% of UPI transactions failing in the last 24 hours. Check gateway configuration.
              </div>
              <div className="text-xs text-[var(--danger)] mt-1">
                Impact: ₹8,200 pending payments
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-[color-mix(in_oklab,var(--success)_10%,white)] border border-[var(--success)]/20 rounded-lg">
            <TrendingUp size={16} className="text-[var(--success)] mt-0.5" />
            <div>
              <div className="font-medium text-sm">Positive Trend Detected</div>
              <div className="text-xs text-muted-foreground mt-1">
                Preventive care appointments up 25% this month. Excellent growth in wellness
                services.
              </div>
              <div className="text-xs text-[var(--success)] mt-1">Revenue impact: +₹18,500</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
