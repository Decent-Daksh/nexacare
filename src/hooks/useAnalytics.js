<<<<<<< HEAD
import { useState, useEffect, useCallback } from "react";
import { analyticsService } from "../services/analytics.service";
=======
import { useState, useEffect, useCallback } from 'react';
import { analyticsService } from '../services/analytics.service';
>>>>>>> main

export function useAnalytics() {
  const [kpis, setKpis] = useState(null);
  const [healthScore, setHealthScore] = useState(0);
  const [charts, setCharts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
<<<<<<< HEAD
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
=======
    setLoading(true); setError(null);
    try {
      const r = await analyticsService.getAll();
      setKpis(r.kpis); setHealthScore(r.healthScore); setCharts(r.charts);
    } catch (e) { setError(e.message); } finally { setLoading(false); }
  }, []);
  useEffect(() => { fetch(); }, [fetch]);
>>>>>>> main
  return { kpis, healthScore, charts, loading, error, refetch: fetch };
}
