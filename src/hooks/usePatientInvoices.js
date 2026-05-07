import { useState, useEffect, useCallback } from "react";
import { billingService } from "../services/billing.service";

export function usePatientInvoices(patientId, filters = {}) {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const key = JSON.stringify({ patientId, filters });

  const fetch = useCallback(async () => {
    if (!patientId) {
      setInvoices([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await billingService.getPatientInvoices(patientId, filters);
      setInvoices(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to fetch invoices");
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  }, [key, patientId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const downloadInvoice = useCallback(async (invoiceId) => {
    try {
      const result = await billingService.downloadInvoice(invoiceId);
      // Trigger browser download
      if (result.url) {
        const link = document.createElement("a");
        link.href = result.url;
        link.download = result.fileName || `invoice-${invoiceId}.pdf`;
        link.click();
      }
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const shareInvoice = useCallback(async (invoiceId, method, recipient) => {
    try {
      const result = await billingService.shareInvoice(invoiceId, method, recipient);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const refetch = fetch;

  return {
    invoices,
    loading,
    error,
    refetch,
    downloadInvoice,
    shareInvoice,
  };
}

export function useInvoiceDetail(invoiceId) {
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    if (!invoiceId) {
      setInvoice(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await billingService.getInvoiceDetail(invoiceId);
      setInvoice(data);
    } catch (err) {
      setError(err.message);
      setInvoice(null);
    } finally {
      setLoading(false);
    }
  }, [invoiceId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return {
    invoice,
    loading,
    error,
    refetch: fetch,
  };
}
