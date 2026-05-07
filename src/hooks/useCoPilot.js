import { useState } from "react";
import { copilotService } from "../services/copilot.service";

export function useCoPilot() {
  const [soap, setSoap] = useState(null);
  const [diagnosis, setDiagnosis] = useState([]);
  const [prescription, setPrescription] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateSOAP = async (transcript) => {
    setLoading(true);
    setError(null);
    try {
      const [s, d, r] = await Promise.all([
        copilotService.generateSOAP({ transcript }),
        copilotService.suggestDiagnosis({ transcript }),
        copilotService.suggestPrescription({ transcript }),
      ]);
      setSoap(s);
      setDiagnosis(d);
      setPrescription(r);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return { soap, diagnosis, prescription, loading, error, generateSOAP };
}
