import { useState, useEffect, useCallback } from 'react';
import { revenueService } from '../services/revenue.service';

export function useRevenue() {
  const [invoices, setInvoices] = useState([]);
  const [claims, setClaims] = useState([]);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const r = await revenueService.getAll();
      setInvoices(r.invoices); setClaims(r.claims); setForecast(r.forecast);
    } catch (e) { setError(e.message); } finally { setLoading(false); }
  }, []);
  useEffect(() => { fetch(); }, [fetch]);

  const createInvoice = async (p) => {
    const inv = await revenueService.createInvoice(p);
    setInvoices(prev => [inv, ...prev]);
    return inv;
  };

  return { invoices, claims, forecast, loading, error, refetch: fetch, createInvoice };
}
