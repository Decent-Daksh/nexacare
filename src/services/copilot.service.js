import { USE_MOCK } from "../config/env";
import apiClient from "../lib/apiClient";

/* COPILOT SERVICE — POST /copilot/soap  POST /copilot/diagnosis  POST /copilot/prescription */
const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

const mockSOAP = {
  subjective:
    "Patient reports persistent dry cough for 5 days, mild fever (99.4°F) and fatigue. No chest pain. History of seasonal allergies.",
  objective:
    "BP 128/82 mmHg, HR 84 bpm, SpO₂ 98%, Temp 99.1°F. Throat mildly erythematous. Chest auscultation clear bilaterally.",
  assessment:
    "Likely viral upper respiratory tract infection. Differential: early bronchitis, allergic rhinitis flare.",
  plan: "Symptomatic management. Hydration, rest, paracetamol PRN. Re-evaluate in 72 hrs if symptoms persist.",
};
const mockDx = [
  { code: "J06.9", label: "Acute upper respiratory infection", confidence: 0.82 },
  { code: "J20.9", label: "Acute bronchitis, unspecified", confidence: 0.41 },
  { code: "J30.9", label: "Allergic rhinitis", confidence: 0.28 },
];
const mockRx = [
  { drug: "Paracetamol 650mg", dose: "1 tab", frequency: "TDS", duration: "5 days" },
  { drug: "Levocetirizine 5mg", dose: "1 tab", frequency: "OD", duration: "5 days" },
  { drug: "Cough syrup (Dextromethorphan)", dose: "5 ml", frequency: "TDS", duration: "5 days" },
];

const mock = {
  generateSOAP: async () => {
    await delay(800);
    return mockSOAP;
  },
  suggestDiagnosis: async () => {
    await delay(700);
    return mockDx;
  },
  suggestPrescription: async () => {
    await delay(700);
    return mockRx;
  },
};
const api = {
  generateSOAP: (p) => apiClient.post("/copilot/soap", p),
  suggestDiagnosis: (p) => apiClient.post("/copilot/diagnosis", p),
  suggestPrescription: (p) => apiClient.post("/copilot/prescription", p),
};
export const copilotService = USE_MOCK ? mock : api;
