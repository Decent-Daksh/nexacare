<<<<<<< HEAD
import { USE_MOCK } from "../config/env";
import apiClient from "../lib/apiClient";
import { mockPharmacy } from "../mock/pharmacy.mock";
=======
import { USE_MOCK } from '../config/env';
import apiClient from '../lib/apiClient';
import { mockPharmacy } from '../mock/pharmacy.mock';
>>>>>>> main

/*
 * PHARMACY SERVICE
 * GET /pharmacy/stock  GET /pharmacy/alerts  GET /pharmacy/reorders
 * POST /pharmacy/dispense  POST /pharmacy/reorders
 */
<<<<<<< HEAD
const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));
const mock = {
  getAll: async () => {
    await delay();
    return mockPharmacy();
  },
  dispense: async (payload) => {
    await delay();
    return { id: "DSP-" + Date.now(), ...payload };
  },
};
const api = {
  getAll: () => apiClient.get("/pharmacy"),
  dispense: (payload) => apiClient.post("/pharmacy/dispense", payload),
=======
const delay = (ms = 400) => new Promise(r => setTimeout(r, ms));
const mock = {
  getAll:   async () => { await delay(); return mockPharmacy(); },
  dispense: async (payload) => { await delay(); return { id: 'DSP-' + Date.now(), ...payload }; },
};
const api = {
  getAll:   () => apiClient.get('/pharmacy'),
  dispense: (payload) => apiClient.post('/pharmacy/dispense', payload),
>>>>>>> main
};
export const pharmacyService = USE_MOCK ? mock : api;
