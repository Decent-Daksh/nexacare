import { USE_MOCK } from "../config/env";
import apiClient from "../lib/apiClient";
import {
  generateMockWhatsAppDeliveryLog,
  generateMockDocumentTemplates,
  generateMockPhoneNumbers,
} from "../mock/whatsapp.mock";

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

// Mock implementation
const mock = {
  sendDocument: async (patientId, documentId, documentType, recipientPhone) => {
    await delay();
    return {
      success: true,
      messageId: `MSG-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      status: "queued",
      sentAt: new Date().toISOString(),
      recipientPhone,
      documentType,
    };
  },

  sendPrescription: async (patientId, prescriptionId, recipientPhone) => {
    await delay();
    return {
      success: true,
      messageId: `MSG-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      status: "queued",
      documentType: "prescription",
      recipientPhone,
      message: "Your prescription has been sent via WhatsApp",
    };
  },

  sendLabReport: async (patientId, reportId, recipientPhone) => {
    await delay();
    return {
      success: true,
      messageId: `MSG-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      status: "queued",
      documentType: "lab_report",
      recipientPhone,
    };
  },

  sendMedicalCertificate: async (patientId, certificateId, recipientPhone) => {
    await delay();
    return {
      success: true,
      messageId: `MSG-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      status: "queued",
      documentType: "medical_certificate",
      recipientPhone,
    };
  },

  sendPharmacyDispenseConfirmation: async (prescriptionId, dispensedItems, recipientPhone) => {
    await delay();
    return {
      success: true,
      messageId: `MSG-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      status: "queued",
      documentType: "pharmacy_dispense",
      recipientPhone,
    };
  },

  getDeliveryLog: async (patientId) => {
    await delay();
    return generateMockWhatsAppDeliveryLog(patientId);
  },

  getDocumentTemplates: async () => {
    await delay();
    return generateMockDocumentTemplates();
  },

  getPatientPhoneNumbers: async (patientId) => {
    await delay();
    return generateMockPhoneNumbers(patientId);
  },

  verifyPhoneNumber: async (patientId, phoneNumber) => {
    await delay();
    return {
      success: true,
      verified: true,
      phoneNumber,
      verificationCode: "123456",
    };
  },

  addPhoneNumber: async (patientId, phoneNumber, label = "Other") => {
    await delay();
    return {
      id: `phone-${Date.now()}`,
      number: phoneNumber,
      label,
      isVerified: false,
      isPrimary: false,
      addedAt: new Date().toISOString().split("T")[0],
    };
  },

  getDeliveryStatus: async (messageId) => {
    await delay();
    return {
      messageId,
      status: "read",
      sentAt: new Date().toISOString(),
      deliveredAt: new Date().toISOString(),
      readAt: new Date().toISOString(),
    };
  },

  resendDocument: async (deliveryLogId, recipientPhone) => {
    await delay();
    return {
      success: true,
      messageId: `MSG-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      status: "queued",
    };
  },
};

// Real API implementation
const api = {
  sendDocument: (patientId, documentId, documentType, recipientPhone) =>
    apiClient.post("/whatsapp/send-document", {
      patientId,
      documentId,
      documentType,
      recipientPhone,
    }),

  sendPrescription: (patientId, prescriptionId, recipientPhone) =>
    apiClient.post("/whatsapp/send-prescription", {
      patientId,
      prescriptionId,
      recipientPhone,
    }),

  sendLabReport: (patientId, reportId, recipientPhone) =>
    apiClient.post("/whatsapp/send-lab-report", {
      patientId,
      reportId,
      recipientPhone,
    }),

  sendMedicalCertificate: (patientId, certificateId, recipientPhone) =>
    apiClient.post("/whatsapp/send-medical-certificate", {
      patientId,
      certificateId,
      recipientPhone,
    }),

  sendPharmacyDispenseConfirmation: (prescriptionId, dispensedItems, recipientPhone) =>
    apiClient.post("/whatsapp/send-pharmacy-confirmation", {
      prescriptionId,
      dispensedItems,
      recipientPhone,
    }),

  getDeliveryLog: (patientId) => apiClient.get(`/whatsapp/delivery-log/${patientId}`),

  getDocumentTemplates: () => apiClient.get("/whatsapp/document-templates"),

  getPatientPhoneNumbers: (patientId) => apiClient.get(`/patients/${patientId}/whatsapp-phones`),

  verifyPhoneNumber: (patientId, phoneNumber) =>
    apiClient.post(`/patients/${patientId}/verify-phone`, { phoneNumber }),

  addPhoneNumber: (patientId, phoneNumber, label) =>
    apiClient.post(`/patients/${patientId}/add-phone`, { phoneNumber, label }),

  getDeliveryStatus: (messageId) => apiClient.get(`/whatsapp/delivery-status/${messageId}`),

  resendDocument: (deliveryLogId, recipientPhone) =>
    apiClient.post(`/whatsapp/resend-document/${deliveryLogId}`, { recipientPhone }),
};

export const whatsappService = USE_MOCK ? mock : api;
