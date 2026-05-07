import { useState, useEffect, useCallback } from 'react';
import  staffService  from '../services/staff.service';

export function useSelfAttendance(staffId) {
  const [todayRecord, setTodayRecord] = useState(null);
  const [log, setLog] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    if (!staffId) return;
    setLoading(true);
    try {
      const [today, history, monthStats] = await Promise.all([
        staffService.getTodayRecord(staffId),
        staffService.getSelfLog(staffId),
        staffService.getMonthlyStats(staffId),
      ]);
      setTodayRecord(today);
      setLog(history);
      setStats(monthStats);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [staffId]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const checkIn = async () => {
    setActionLoading(true);
    try {
      const record = await staffService.checkIn(staffId);
      setTodayRecord(record);
      setLog(prev => [record, ...prev]);
      return record;
    } finally {
      setActionLoading(false);
    }
  };

  const checkOut = async () => {
    setActionLoading(true);
    try {
      const update = await staffService.checkOut(staffId);
      const updated = { ...todayRecord, ...update };
      setTodayRecord(updated);
      setLog(prev => prev.map(r => r.date === updated.date ? updated : r));
      return updated;
    } finally {
      setActionLoading(false);
    }
  };

  return { todayRecord, log, stats, loading, actionLoading, error, checkIn, checkOut, refetch: fetchAll };
}