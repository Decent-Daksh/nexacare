import { useState, useCallback, useEffect, useRef } from "react";
import { whatsappCommunicationService } from "../services/whatsappCommunication.service";

export function useWhatsAppConversationList(patientId) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    if (!patientId) {
      setConversations([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await whatsappCommunicationService.getConversationList(patientId);
      setConversations(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to fetch conversations");
      setConversations([]);
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return {
    conversations,
    loading,
    error,
    refetch: fetch,
  };
}

export function useWhatsAppConversation(conversationId) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const fetch = useCallback(async () => {
    if (!conversationId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await whatsappCommunicationService.getConversation(conversationId);
      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to fetch conversation");
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(
    async (text) => {
      if (!conversationId || !text.trim()) return;

      try {
        const newMessage = await whatsappCommunicationService.sendMessage(conversationId, text);
        setMessages((prev) => [...prev, newMessage]);
        return newMessage;
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    [conversationId],
  );

  const useTemplate = useCallback(
    async (templateId, variables = {}) => {
      if (!conversationId) return;

      try {
        const newMessage = await whatsappCommunicationService.useTemplate(
          conversationId,
          templateId,
          variables,
        );
        setMessages((prev) => [...prev, newMessage]);
        return newMessage;
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    [conversationId],
  );

  return {
    messages,
    loading,
    error,
    refetch: fetch,
    sendMessage,
    useTemplate,
    messagesEndRef,
  };
}

export function useWhatsAppMessageTemplates() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await whatsappCommunicationService.getMessageTemplates();
      setTemplates(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to fetch templates");
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return {
    templates,
    loading,
    error,
    refetch: fetch,
  };
}
