import { useState, useEffect, useCallback } from 'react';
import { pharmacyService } from '../services/pharmacy.service';

export function usePharmacy() {
  const [stock, setStock] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [reorderQueue, setReorderQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const r = await pharmacyService.getAll();
      setStock(r.stock); setAlerts(r.alerts); setReorderQueue(r.reorderQueue);
    } catch (e) { setError(e.message); } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const dispense = async (p) => pharmacyService.dispense(p);

  return { stock, alerts, reorderQueue, loading, error, refetch: fetch, dispense };
}
