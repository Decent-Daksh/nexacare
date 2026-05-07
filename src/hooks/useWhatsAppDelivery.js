import { useState, useCallback, useEffect } from "react";
import { whatsappService } from "../services/whatsapp.service";

export function useWhatsAppDelivery() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendDocument = useCallback(async (patientId, documentId, documentType, recipientPhone) => {
    setLoading(true);
    setError(null);
    try {
      const result = await whatsappService.sendDocument(
        patientId,
        documentId,
        documentType,
        recipientPhone,
      );
      return result;
    } catch (err) {
      const errorMsg = err.message || "Failed to send document";
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const sendPrescription = useCallback(async (patientId, prescriptionId, recipientPhone) => {
    setLoading(true);
    setError(null);
    try {
      const result = await whatsappService.sendPrescription(
        patientId,
        prescriptionId,
        recipientPhone,
      );
      return result;
    } catch (err) {
      setError(err.message || "Failed to send prescription");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const sendLabReport = useCallback(async (patientId, reportId, recipientPhone) => {
    setLoading(true);
    setError(null);
    try {
      const result = await whatsappService.sendLabReport(patientId, reportId, recipientPhone);
      return result;
    } catch (err) {
      setError(err.message || "Failed to send lab report");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const sendMedicalCertificate = useCallback(async (patientId, certificateId, recipientPhone) => {
    setLoading(true);
    setError(null);
    try {
      const result = await whatsappService.sendMedicalCertificate(
        patientId,
        certificateId,
        recipientPhone,
      );
      return result;
    } catch (err) {
      setError(err.message || "Failed to send medical certificate");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    sendDocument,
    sendPrescription,
    sendLabReport,
    sendMedicalCertificate,
  };
}

export function useWhatsAppDeliveryLog(patientId) {
  const [deliveryLog, setDeliveryLog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    if (!patientId) {
      setDeliveryLog([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await whatsappService.getDeliveryLog(patientId);
      setDeliveryLog(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to fetch delivery log");
      setDeliveryLog([]);
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return {
    deliveryLog,
    loading,
    error,
    refetch: fetch,
  };
}

export function useWhatsAppPhoneNumbers(patientId) {
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    if (!patientId) {
      setPhoneNumbers([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await whatsappService.getPatientPhoneNumbers(patientId);
      setPhoneNumbers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to fetch phone numbers");
      setPhoneNumbers([]);
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const addPhone = useCallback(
    async (phoneNumber, label = "Other") => {
      try {
        const newPhone = await whatsappService.addPhoneNumber(patientId, phoneNumber, label);
        setPhoneNumbers((prev) => [...prev, newPhone]);
        return newPhone;
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    [patientId],
  );

  const verifyPhone = useCallback(
    async (phoneNumber) => {
      try {
        const result = await whatsappService.verifyPhoneNumber(patientId, phoneNumber);
        if (result.verified) {
          setPhoneNumbers((prev) =>
            prev.map((p) => (p.number === phoneNumber ? { ...p, isVerified: true } : p)),
          );
        }
        return result;
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    [patientId],
  );

  return {
    phoneNumbers,
    loading,
    error,
    refetch: fetch,
    addPhone,
    verifyPhone,
  };
}
