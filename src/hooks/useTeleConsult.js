<<<<<<< HEAD
import { useState, useEffect, useCallback } from "react";
import { teleconsultService } from "../services/teleconsult.service";
=======
import { useState, useEffect, useCallback } from 'react';
import { teleconsultService } from '../services/teleconsult.service';
>>>>>>> main

export function useTeleConsult() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
<<<<<<< HEAD
    setLoading(true);
    setError(null);
    try {
      const r = await teleconsultService.getAll();
      setSessions(r.sessions);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetch();
  }, [fetch]);

  const createSession = async (p) => {
    const s = await teleconsultService.create(p);
    setSessions((prev) => [s, ...prev]);
=======
    setLoading(true); setError(null);
    try { const r = await teleconsultService.getAll(); setSessions(r.sessions); }
    catch (e) { setError(e.message); } finally { setLoading(false); }
  }, []);
  useEffect(() => { fetch(); }, [fetch]);

  const createSession = async (p) => {
    const s = await teleconsultService.create(p);
    setSessions(prev => [s, ...prev]);
>>>>>>> main
    return s;
  };
  const endSession = async (id) => {
    const s = await teleconsultService.end(id);
<<<<<<< HEAD
    setSessions((prev) => prev.map((x) => (x.id === id ? { ...x, ...s } : x)));
=======
    setSessions(prev => prev.map(x => x.id === id ? { ...x, ...s } : x));
>>>>>>> main
  };
  return { sessions, loading, error, refetch: fetch, createSession, endSession };
}
