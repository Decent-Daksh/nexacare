import { useState, useCallback, useEffect } from "react";
import { staffService } from "../services/staff.service";

export function useStaffDetail(staffId) {
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    if (!staffId) {
      setStaff(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await staffService.getStaffDetail(staffId);
      setStaff(data);
    } catch (err) {
      setError(err.message || "Failed to fetch staff detail");
      setStaff(null);
    } finally {
      setLoading(false);
    }
  }, [staffId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return {
    staff,
    loading,
    error,
    refetch: fetch,
  };
}

export function useStaffDocuments(staffId) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    if (!staffId) {
      setDocuments([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await staffService.getStaffDocuments(staffId);
      setDocuments(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to fetch documents");
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  }, [staffId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const uploadDocument = useCallback(
    async (file, documentType, expiryDate = null) => {
      try {
        const newDoc = await staffService.uploadDocument(staffId, file, documentType, expiryDate);
        setDocuments((prev) => [newDoc, ...prev]);
        return newDoc;
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    [staffId],
  );

  const deleteDocument = useCallback(async (documentId) => {
    try {
      await staffService.deleteDocument(documentId);
      setDocuments((prev) => prev.filter((d) => d.id !== documentId));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  return {
    documents,
    loading,
    error,
    refetch: fetch,
    uploadDocument,
    deleteDocument,
  };
}

export function usePayrollHistory(staffId, months = 12) {
  const [payroll, setPayroll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    if (!staffId) {
      setPayroll([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await staffService.getPayrollHistory(staffId, months);
      setPayroll(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to fetch payroll history");
      setPayroll([]);
    } finally {
      setLoading(false);
    }
  }, [staffId, months]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const downloadSlip = useCallback(async (payrollId) => {
    try {
      const result = await staffService.downloadPayrollSlip(payrollId);
      if (result.url) {
        const link = document.createElement("a");
        link.href = result.url;
        link.download = result.fileName;
        link.click();
      }
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  return {
    payroll,
    loading,
    error,
    refetch: fetch,
    downloadSlip,
  };
}

export function usePerformanceTimeline(staffId) {
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    if (!staffId) {
      setTimeline([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await staffService.getPerformanceTimeline(staffId);
      setTimeline(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to fetch performance timeline");
      setTimeline([]);
    } finally {
      setLoading(false);
    }
  }, [staffId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return {
    timeline,
    loading,
    error,
    refetch: fetch,
  };
}
