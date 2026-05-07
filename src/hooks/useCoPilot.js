<<<<<<< HEAD
import { useState } from "react";
import { copilotService } from "../services/copilot.service";
=======
import { useState } from 'react';
import { copilotService } from '../services/copilot.service';
>>>>>>> main

export function useCoPilot() {
  const [soap, setSoap] = useState(null);
  const [diagnosis, setDiagnosis] = useState([]);
  const [prescription, setPrescription] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateSOAP = async (transcript) => {
<<<<<<< HEAD
    setLoading(true);
    setError(null);
=======
    setLoading(true); setError(null);
>>>>>>> main
    try {
      const [s, d, r] = await Promise.all([
        copilotService.generateSOAP({ transcript }),
        copilotService.suggestDiagnosis({ transcript }),
        copilotService.suggestPrescription({ transcript }),
      ]);
<<<<<<< HEAD
      setSoap(s);
      setDiagnosis(d);
      setPrescription(r);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
=======
      setSoap(s); setDiagnosis(d); setPrescription(r);
    } catch (e) { setError(e.message); } finally { setLoading(false); }
>>>>>>> main
  };

  return { soap, diagnosis, prescription, loading, error, generateSOAP };
}
