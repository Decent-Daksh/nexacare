import { USE_MOCK } from '../config/env';
import apiClient from '../lib/apiClient';
import { mockRevenue } from '../mock/revenue.mock';

/*
 * REVENUE SERVICE
 * GET /revenue (invoices+claims+forecast)  POST /invoices  PUT /claims/:id
 */
const delay = (ms = 400) => new Promise(r => setTimeout(r, ms));
const mock = {
  getAll:        async () => { await delay(); return mockRevenue(); },
  createInvoice: async (p) => { await delay(); return { id: 'INV-' + Date.now(), status: 'Pending', ...p }; },
};
const api = {
  getAll:        () => apiClient.get('/revenue'),
  createInvoice: (p) => apiClient.post('/invoices', p),
};
export const revenueService = USE_MOCK ? mock : api;
