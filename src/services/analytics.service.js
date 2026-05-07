<<<<<<< HEAD
import { USE_MOCK } from "../config/env";
import apiClient from "../lib/apiClient";
import { mockAnalytics } from "../mock/analytics.mock";

/* ANALYTICS SERVICE — GET /analytics  GET /analytics/health-score */
const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));
const mock = {
  getAll: async () => {
    await delay();
    return mockAnalytics();
  },
};
const api = { getAll: () => apiClient.get("/analytics") };
=======
import { USE_MOCK } from '../config/env';
import apiClient from '../lib/apiClient';
import { mockAnalytics } from '../mock/analytics.mock';

/* ANALYTICS SERVICE — GET /analytics  GET /analytics/health-score */
const delay = (ms = 400) => new Promise(r => setTimeout(r, ms));
const mock = { getAll: async () => { await delay(); return mockAnalytics(); } };
const api  = { getAll: () => apiClient.get('/analytics') };
>>>>>>> main
export const analyticsService = USE_MOCK ? mock : api;
