import { useState, useEffect, useCallback } from "react";
import { staffService } from "../services/staff.service";

export function useStaff() {
  const [staff, setStaff] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await staffService.getAll();
      setStaff(r.staff);
      setShifts(r.shifts);
      setAttendance(r.attendance);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetch();
  }, [fetch]);
  return { staff, shifts, attendance, loading, error, refetch: fetch };
}
