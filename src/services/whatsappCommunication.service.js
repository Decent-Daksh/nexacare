import { USE_MOCK } from '../config/env';
import apiClient from '../lib/apiClient';
import {
  generateMockWhatsAppConversation,
  generateMockWhatsAppConversationList,
  generateMockMessageTemplates,
} from '../mock/whatsappCommunication.mock';

const delay = (ms = 400) => new Promise(r => setTimeout(r, ms));

// Mock implementation
const mock = {
  getConversationList: async (patientId) => {
    await delay();
    return generateMockWhatsAppConversationList(patientId);
  },

  getConversation: async (conversationId) => {
    await delay();
    return generateMockWhatsAppConversation(conversationId.split('-')[1]);
  },

  sendMessage: async (conversationId, message) => {
    await delay();
    return {
      id: `MSG-${Date.now()}`,
      conversationId,
      author: 'doctor',
      text: message,
      timestamp: new Date().toISOString(),
      status: 'sent',
      type: 'text',
    };
  },

  getMessageTemplates: async () => {
    await delay();
    return generateMockMessageTemplates();
  },

  useTemplate: async (conversationId, templateId, variables = {}) => {
    await delay();
    const templates = generateMockMessageTemplates();
    const template = templates.find(t => t.id === templateId);

    if (!template) throw new Error('Template not found');

    let text = template.text;
    Object.entries(variables).forEach(([key, value]) => {
      text = text.replace(`{${key}}`, value);
    });

    return {
      id: `MSG-${Date.now()}`,
      conversationId,
      author: 'doctor',
      text,
      timestamp: new Date().toISOString(),
      status: 'sent',
      type: 'text',
    };
  },

  markAsRead: async (conversationId) => {
    await delay();
    return { success: true };
  },

  createConversation: async (patientId, patientPhone, patientName) => {
    await delay();
    return {
      id: `CONV-${patientId}-${Date.now()}`,
      patientId,
      patientName,
      patientPhone,
      lastMessage: 'Conversation started',
      lastMessageTime: new Date().toISOString(),
      unreadCount: 0,
      messageCount: 1,
      createdAt: new Date().toISOString(),
    };
  },

  deleteConversation: async (conversationId) => {
    await delay();
    return { success: true };
  },

  archiveConversation: async (conversationId) => {
    await delay();
    return { success: true };
  },
};

// Real API implementation
const api = {
  getConversationList: (patientId) =>
    apiClient.get(`/patients/${patientId}/whatsapp-conversations`),

  getConversation: (conversationId) =>
    apiClient.get(`/whatsapp-conversations/${conversationId}`),

  sendMessage: (conversationId, message) =>
    apiClient.post(`/whatsapp-conversations/${conversationId}/messages`, {
      message,
    }),

  getMessageTemplates: () =>
    apiClient.get('/whatsapp-message-templates'),

  useTemplate: (conversationId, templateId, variables) =>
    apiClient.post(`/whatsapp-conversations/${conversationId}/send-template`, {
      templateId,
      variables,
    }),

  markAsRead: (conversationId) =>
    apiClient.put(`/whatsapp-conversations/${conversationId}/mark-read`),

  createConversation: (patientId, patientPhone, patientName) =>
    apiClient.post('/whatsapp-conversations', {
      patientId,
      patientPhone,
      patientName,
    }),

  deleteConversation: (conversationId) =>
    apiClient.delete(`/whatsapp-conversations/${conversationId}`),

  archiveConversation: (conversationId) =>
    apiClient.put(`/whatsapp-conversations/${conversationId}/archive`),
};

export const whatsappCommunicationService = USE_MOCK ? mock : api;
