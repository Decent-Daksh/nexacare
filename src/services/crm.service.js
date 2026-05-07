<<<<<<< HEAD
import { USE_MOCK } from "../config/env";
import apiClient from "../lib/apiClient";
import { mockCRM } from "../mock/crm.mock";

/* CRM SERVICE — GET /crm  POST /crm/campaigns  POST /crm/campaigns/:id/send */
const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));
const mock = {
  getAll: async () => {
    await delay();
    return mockCRM();
  },
  createCampaign: async (p) => {
    await delay();
    return { id: "C-" + Date.now(), status: "Draft", ...p };
  },
};
const api = {
  getAll: () => apiClient.get("/crm"),
  createCampaign: (p) => apiClient.post("/crm/campaigns", p),
=======
import { USE_MOCK } from '../config/env';
import apiClient from '../lib/apiClient';
import { mockCRM } from '../mock/crm.mock';

/* CRM SERVICE — GET /crm  POST /crm/campaigns  POST /crm/campaigns/:id/send */
const delay = (ms = 400) => new Promise(r => setTimeout(r, ms));
const mock = {
  getAll: async () => { await delay(); return mockCRM(); },
  createCampaign: async (p) => { await delay(); return { id: 'C-' + Date.now(), status: 'Draft', ...p }; },
};
const api = {
  getAll: () => apiClient.get('/crm'),
  createCampaign: (p) => apiClient.post('/crm/campaigns', p),
>>>>>>> main
};
export const crmService = USE_MOCK ? mock : api;
