<<<<<<< HEAD
import { USE_MOCK } from "../config/env";
import apiClient from "../lib/apiClient";
import { mockAppointments, mockAvailableSlots } from "../mock/appointments.mock";
=======
import { USE_MOCK } from '../config/env';
import apiClient from '../lib/apiClient';
import { mockAppointments, mockAvailableSlots } from '../mock/appointments.mock';
>>>>>>> main

/*
 * APPOINTMENT SERVICE
 * GET /appointments (?date=&doctorId=&status=)  POST /appointments
 * PUT /appointments/:id  DELETE /appointments/:id
 * GET /slots/available (?doctorId=&date=)
 */

<<<<<<< HEAD
const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

const mock = {
  getAll: async (p) => {
    await delay();
    return mockAppointments(p);
  },
  getSlots: async () => {
    await delay();
    return mockAvailableSlots();
  },
  create: async (payload) => {
    await delay(500);
    return { id: "APT-" + Date.now(), status: "Confirmed", ...payload };
  },
  update: async (id, p) => {
    await delay();
    return { id, ...p };
  },
  cancel: async (id) => {
    await delay();
    return { id, status: "Cancelled" };
  },
};
const api = {
  getAll: (p) => apiClient.get("/appointments", { params: p }),
  getSlots: (p) => apiClient.get("/slots/available", { params: p }),
  create: (payload) => apiClient.post("/appointments", payload),
  update: (id, p) => apiClient.put(`/appointments/${id}`, p),
  cancel: (id) => apiClient.delete(`/appointments/${id}`),
=======
const delay = (ms = 400) => new Promise(r => setTimeout(r, ms));

const mock = {
  getAll:    async (p)        => { await delay(); return mockAppointments(p); },
  getSlots:  async ()         => { await delay(); return mockAvailableSlots(); },
  create:    async (payload)  => { await delay(500); return { id: 'APT-' + Date.now(), status: 'Confirmed', ...payload }; },
  update:    async (id, p)    => { await delay(); return { id, ...p }; },
  cancel:    async (id)       => { await delay(); return { id, status: 'Cancelled' }; },
};
const api = {
  getAll:    (p)        => apiClient.get('/appointments', { params: p }),
  getSlots:  (p)        => apiClient.get('/slots/available', { params: p }),
  create:    (payload)  => apiClient.post('/appointments', payload),
  update:    (id, p)    => apiClient.put(`/appointments/${id}`, p),
  cancel:    (id)       => apiClient.delete(`/appointments/${id}`),
>>>>>>> main
};

export const appointmentService = USE_MOCK ? mock : api;
