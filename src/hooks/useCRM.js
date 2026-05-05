import { useState, useEffect, useCallback } from 'react';
import { crmService } from '../services/crm.service';

export function useCRM() {
  const [campaigns, setCampaigns] = useState([]);
  const [recallQueue, setRecallQueue] = useState([]);
  const [npsData, setNpsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const r = await crmService.getAll();
      setCampaigns(r.campaigns); setRecallQueue(r.recallQueue); setNpsData(r.npsData);
    } catch (e) { setError(e.message); } finally { setLoading(false); }
  }, []);
  useEffect(() => { fetch(); }, [fetch]);
  return { campaigns, recallQueue, npsData, loading, error, refetch: fetch };
}
