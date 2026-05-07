<<<<<<< HEAD
import { useState, useEffect, useCallback } from "react";
import { patientService } from "../services/patient.service";
=======
import { useState, useEffect, useCallback } from 'react';
import { patientService } from '../services/patient.service';
>>>>>>> main

export function usePatients(params = {}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const key = JSON.stringify(params);

  const fetch = useCallback(async () => {
<<<<<<< HEAD
    setLoading(true);
    setError(null);
    try {
      setData(await patientService.getAll(JSON.parse(key)));
    } catch (e) {
      setError(e.message || "Failed to load patients");
    } finally {
      setLoading(false);
    }
  }, [key]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const createPatient = async (payload) => {
    const np = await patientService.create(payload);
    setData((prev) => [np, ...prev]);
=======
    setLoading(true); setError(null);
    try { setData(await patientService.getAll(JSON.parse(key))); }
    catch (e) { setError(e.message || 'Failed to load patients'); }
    finally { setLoading(false); }
  }, [key]);

  useEffect(() => { fetch(); }, [fetch]);

  const createPatient = async (payload) => {
    const np = await patientService.create(payload);
    setData(prev => [np, ...prev]);
>>>>>>> main
    return np;
  };
  const updatePatient = async (id, payload) => {
    const u = await patientService.update(id, payload);
<<<<<<< HEAD
    setData((prev) => prev.map((p) => (p.id === id ? { ...p, ...u } : p)));
=======
    setData(prev => prev.map(p => p.id === id ? { ...p, ...u } : p));
>>>>>>> main
    return u;
  };
  const deletePatient = async (id) => {
    await patientService.delete(id);
<<<<<<< HEAD
    setData((prev) => prev.filter((p) => p.id !== id));
=======
    setData(prev => prev.filter(p => p.id !== id));
>>>>>>> main
  };

  return { data, loading, error, refetch: fetch, createPatient, updatePatient, deletePatient };
}

export function usePatientDetail(id) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (!id) return;
    setLoading(true);
<<<<<<< HEAD
    patientService
      .getById(id)
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
=======
    patientService.getById(id).then(setData).catch(e => setError(e.message)).finally(() => setLoading(false));
>>>>>>> main
  }, [id]);
  return { data, loading, error };
}
