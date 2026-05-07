import { useState, useEffect, useCallback } from "react";
import { analyticsService } from "../services/analytics.service";

export function useAnalytics() {
  const [kpis, setKpis] = useState(null);
  const [healthScore, setHealthScore] = useState(0);
  const [charts, setCharts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await analyticsService.getAll();
      setKpis(r.kpis);
      setHealthScore(r.healthScore);
      setCharts(r.charts);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetch();
  }, [fetch]);
  return { kpis, healthScore, charts, loading, error, refetch: fetch };
}
