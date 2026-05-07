<<<<<<< HEAD
import { useState, useEffect, useCallback } from "react";
import { appointmentService } from "../services/appointment.service";
=======
import { useState, useEffect, useCallback } from 'react';
import { appointmentService } from '../services/appointment.service';
>>>>>>> main

export function useAppointments(params = {}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const key = JSON.stringify(params);

  const fetch = useCallback(async () => {
<<<<<<< HEAD
    setLoading(true);
    setError(null);
    try {
      setData(await appointmentService.getAll(JSON.parse(key)));
    } catch (e) {
      setError(e.message || "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  }, [key]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const createAppointment = async (p) => {
    const a = await appointmentService.create(p);
    setData((prev) => [a, ...prev]);
=======
    setLoading(true); setError(null);
    try { setData(await appointmentService.getAll(JSON.parse(key))); }
    catch (e) { setError(e.message || 'Failed to load appointments'); }
    finally { setLoading(false); }
  }, [key]);

  useEffect(() => { fetch(); }, [fetch]);

  const createAppointment = async (p) => {
    const a = await appointmentService.create(p);
    setData(prev => [a, ...prev]);
>>>>>>> main
    return a;
  };
  const updateAppointment = async (id, p) => {
    const u = await appointmentService.update(id, p);
<<<<<<< HEAD
    setData((prev) => prev.map((x) => (x.id === id ? { ...x, ...u } : x)));
=======
    setData(prev => prev.map(x => x.id === id ? { ...x, ...u } : x));
>>>>>>> main
    return u;
  };

  return { data, loading, error, refetch: fetch, createAppointment, updateAppointment };
}
