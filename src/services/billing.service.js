import { USE_MOCK } from "../config/env";
import apiClient from "../lib/apiClient";
import { generateMockInvoices, generateMockInvoiceDetail } from "../mock/invoices.mock";

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

// Mock implementation
const mock = {
  getPatientInvoices: async (patientId, filters = {}) => {
    await delay();
    const invoices = generateMockInvoices(patientId);

    // Apply filters
    let filtered = invoices;

    if (filters.status) {
      filtered = filtered.filter((inv) => inv.status === filters.status);
    }

    if (filters.search) {
      const term = filters.search.toLowerCase();
      filtered = filtered.filter(
        (inv) =>
          inv.invoiceNumber.toLowerCase().includes(term) ||
          inv.consultationType.toLowerCase().includes(term),
      );
    }

    if (filters.dateFrom) {
      filtered = filtered.filter((inv) => inv.date >= filters.dateFrom);
    }

    if (filters.dateTo) {
      filtered = filtered.filter((inv) => inv.date <= filters.dateTo);
    }

    return filtered;
  },

  getInvoiceDetail: async (invoiceId) => {
    await delay();
    return generateMockInvoiceDetail(invoiceId);
  },

  downloadInvoice: async (invoiceId) => {
    await delay();
    // Simulate PDF generation
    return {
      success: true,
      url: `/invoices/${invoiceId}.pdf`,
      fileName: `invoice-${invoiceId}.pdf`,
    };
  },

  shareInvoice: async (invoiceId, method = "email", recipient = null) => {
    await delay();
    return {
      success: true,
      message: `Invoice shared via ${method}`,
      method,
      recipient,
    };
  },

  generateInvoice: async (patientId, consultationData) => {
    await delay();
    const id = `INV-${patientId}-${Date.now()}`;
    return {
      id,
      invoiceNumber: `INV-${String(Math.floor(Math.random() * 1000000)).padStart(6, "0")}`,
      ...consultationData,
      status: "draft",
    };
  },
};

// Real API implementation
const api = {
  getPatientInvoices: (patientId, filters = {}) =>
    apiClient.get(`/patients/${patientId}/invoices`, { params: filters }),

  getInvoiceDetail: (invoiceId) => apiClient.get(`/invoices/${invoiceId}`),

  downloadInvoice: (invoiceId) =>
    apiClient.get(`/invoices/${invoiceId}/download`, { responseType: "blob" }),

  shareInvoice: (invoiceId, method = "email", recipient = null) =>
    apiClient.post(`/invoices/${invoiceId}/share`, { method, recipient }),

  generateInvoice: (patientId, consultationData) =>
    apiClient.post(`/patients/${patientId}/invoices`, consultationData),
};

export const billingService = USE_MOCK ? mock : api;
