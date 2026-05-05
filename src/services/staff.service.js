import { USE_MOCK } from '../config/env';
import apiClient from '../lib/apiClient';
import {
  mockStaff,
  generateMockStaffDetail,
  generateMockStaffDocuments,
  generateMockPayrollHistory,
  generateMockPerformanceTimeline,
} from '../mock/staff.mock';

/* STAFF SERVICE — GET /staff  GET /shifts  GET /attendance */
const delay = (ms = 400) => new Promise(r => setTimeout(r, ms));

const mock = {
  getAll: async () => {
    await delay();
    return mockStaff();
  },

  getStaffDetail: async (staffId) => {
    await delay();
    return generateMockStaffDetail(staffId);
  },

  getStaffDocuments: async (staffId) => {
    await delay();
    return generateMockStaffDocuments(staffId);
  },

  getPayrollHistory: async (staffId, months = 12) => {
    await delay();
    return generateMockPayrollHistory(staffId, months);
  },

  getPayrollDetail: async (payrollId) => {
    await delay();
    const [, staffId, year, month] = payrollId.split('-');
    const payrolls = generateMockPayrollHistory(staffId, 12);
    return payrolls.find(p => p.id === payrollId);
  },

  getPerformanceTimeline: async (staffId) => {
    await delay();
    return generateMockPerformanceTimeline(staffId);
  },

  uploadDocument: async (staffId, file, documentType, expiryDate = null) => {
    await delay();
    return {
      id: `DOC-${staffId}-${Date.now()}`,
      staffId,
      type: documentType,
      name: file.name,
      fileName: file.name,
      uploadedAt: new Date().toISOString(),
      expiryDate,
      status: 'pending_verification',
      category: documentType,
    };
  },

  verifyDocument: async (documentId) => {
    await delay();
    return {
      success: true,
      documentId,
      verifiedAt: new Date().toISOString(),
      status: 'verified',
    };
  },

  deleteDocument: async (documentId) => {
    await delay();
    return { success: true };
  },

  downloadPayrollSlip: async (payrollId) => {
    await delay();
    return {
      success: true,
      url: `/payroll/${payrollId}.pdf`,
      fileName: `payroll_slip_${payrollId}.pdf`,
    };
  },
};

const api = {
  getAll: () => apiClient.get('/staff'),

  getStaffDetail: (staffId) => apiClient.get(`/staff/${staffId}`),

  getStaffDocuments: (staffId) => apiClient.get(`/staff/${staffId}/documents`),

  getPayrollHistory: (staffId, months = 12) =>
    apiClient.get(`/staff/${staffId}/payroll`, { params: { months } }),

  getPayrollDetail: (payrollId) => apiClient.get(`/payroll/${payrollId}`),

  getPerformanceTimeline: (staffId) =>
    apiClient.get(`/staff/${staffId}/performance`),

  uploadDocument: (staffId, file, documentType, expiryDate) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', documentType);
    if (expiryDate) formData.append('expiryDate', expiryDate);

    return apiClient.post(`/staff/${staffId}/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  verifyDocument: (documentId) =>
    apiClient.post(`/documents/${documentId}/verify`),

  deleteDocument: (documentId) =>
    apiClient.delete(`/documents/${documentId}`),

  downloadPayrollSlip: (payrollId) =>
    apiClient.get(`/payroll/${payrollId}/download`, { responseType: 'blob' }),
};

export const staffService = USE_MOCK ? mock : api;
