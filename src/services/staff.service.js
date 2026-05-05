import { USE_MOCK } from '../config/env';
import apiClient from '../lib/apiClient';
import { mockStaff } from '../mock/staff.mock';

/* STAFF SERVICE — GET /staff  GET /shifts  GET /attendance */
const delay = (ms = 400) => new Promise(r => setTimeout(r, ms));
const mock = { getAll: async () => { await delay(); return mockStaff(); } };
const api  = { getAll: () => apiClient.get('/staff') };
export const staffService = USE_MOCK ? mock : api;
