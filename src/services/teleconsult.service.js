<<<<<<< HEAD
import { USE_MOCK } from "../config/env";
import apiClient from "../lib/apiClient";
import { mockTeleConsult } from "../mock/teleconsult.mock";

/* TELECONSULT SERVICE — GET /tele/sessions  POST /tele/sessions  POST /tele/sessions/:id/end */
const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));
const mock = {
  getAll: async () => {
    await delay();
    return mockTeleConsult();
  },
  create: async (p) => {
    await delay();
    return { id: "TC-" + Date.now(), status: "Live", ...p };
  },
  end: async (id) => {
    await delay();
    return { id, status: "Completed" };
  },
};
const api = {
  getAll: () => apiClient.get("/tele/sessions"),
  create: (p) => apiClient.post("/tele/sessions", p),
  end: (id) => apiClient.post(`/tele/sessions/${id}/end`),
=======
import { USE_MOCK } from '../config/env';
import apiClient from '../lib/apiClient';
import { mockTeleConsult } from '../mock/teleconsult.mock';

/* TELECONSULT SERVICE — GET /tele/sessions  POST /tele/sessions  POST /tele/sessions/:id/end */
const delay = (ms = 400) => new Promise(r => setTimeout(r, ms));
const mock = {
  getAll: async () => { await delay(); return mockTeleConsult(); },
  create: async (p) => { await delay(); return { id: 'TC-' + Date.now(), status: 'Live', ...p }; },
  end:    async (id) => { await delay(); return { id, status: 'Completed' }; },
};
const api = {
  getAll: () => apiClient.get('/tele/sessions'),
  create: (p) => apiClient.post('/tele/sessions', p),
  end:    (id) => apiClient.post(`/tele/sessions/${id}/end`),
>>>>>>> main
};
export const teleconsultService = USE_MOCK ? mock : api;
