import { USE_MOCK } from "../config/env";
import apiClient from "../lib/apiClient";
import { mockPatients, mockPatientById, mockPatientRiskScore } from "../mock/patients.mock";

/*
 * PATIENT SERVICE — API Endpoints Expected
 * GET    /api/v1/patients                     → list (?search=&riskLevel=&page=&limit=)
 * GET    /api/v1/patients/:id                 → single patient
 * POST   /api/v1/patients                     → create
 * PUT    /api/v1/patients/:id                 → update
 * DELETE /api/v1/patients/:id                 → soft delete
 * GET    /api/v1/patients/:id/risk-score      → ML risk score
 * Auth: Bearer JWT. Envelope: { success, data, meta }
 */

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

const mock = {
  getAll: async (params) => {
    await delay();
    return mockPatients(params);
  },
  getById: async (id) => {
    await delay();
    return mockPatientById(id);
  },
  getRiskScore: async (id) => {
    await delay();
    return mockPatientRiskScore(id);
  },
  create: async (payload) => {
    await delay(600);
    return { id: "P-" + Date.now(), ...payload };
  },
  update: async (id, payload) => {
    await delay();
    return { id, ...payload };
  },
  delete: async (id) => {
    await delay();
    return { success: true, id };
  },
};

const api = {
  getAll: (params) => apiClient.get("/patients", { params }),
  getById: (id) => apiClient.get(`/patients/${id}`),
  getRiskScore: (id) => apiClient.get(`/patients/${id}/risk-score`),
  create: (payload) => apiClient.post("/patients", payload),
  update: (id, payload) => apiClient.put(`/patients/${id}`, payload),
  delete: (id) => apiClient.delete(`/patients/${id}`),
};

export const patientService = USE_MOCK ? mock : api;