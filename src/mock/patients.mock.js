/*
 * Mock shape mirrors API response: { id, abhaId, name, age, gender, phone, bloodGroup,
 * conditions[], riskLevel, lastVisit, doctor, allergies[], noShowCount }
 */
const PATIENTS = [
  { id: 'P-1001', abhaId: '91-1234-5678-9012', name: 'Rajesh Kumar', age: 54, gender: 'Male', phone: '+91-9876543210', bloodGroup: 'B+', conditions: ['Hypertension', 'Type 2 Diabetes'], riskLevel: 'High', lastVisit: '2026-04-18', doctor: 'Dr. Priya Sharma', allergies: ['Penicillin'], noShowCount: 1 },
  { id: 'P-1002', abhaId: '91-2345-6789-0123', name: 'Anita Verma', age: 38, gender: 'Female', phone: '+91-9876501234', bloodGroup: 'O+', conditions: ['Asthma'], riskLevel: 'Low', lastVisit: '2026-04-22', doctor: 'Dr. Arjun Mehta', allergies: [], noShowCount: 0 },
  { id: 'P-1003', abhaId: '91-3456-7890-1234', name: 'Mohammed Iqbal', age: 62, gender: 'Male', phone: '+91-9123456780', bloodGroup: 'A-', conditions: ['Coronary Artery Disease'], riskLevel: 'High', lastVisit: '2026-03-29', doctor: 'Dr. Priya Sharma', allergies: ['Sulfa'], noShowCount: 2 },
  { id: 'P-1004', abhaId: '91-4567-8901-2345', name: 'Sneha Pillai', age: 29, gender: 'Female', phone: '+91-9012345678', bloodGroup: 'AB+', conditions: ['PCOS'], riskLevel: 'Medium', lastVisit: '2026-04-30', doctor: 'Dr. Arjun Mehta', allergies: [], noShowCount: 0 },
  { id: 'P-1005', abhaId: '91-5678-9012-3456', name: 'Vikram Singh', age: 47, gender: 'Male', phone: '+91-9988776655', bloodGroup: 'O-', conditions: ['Lower Back Pain'], riskLevel: 'Low', lastVisit: '2026-05-01', doctor: 'Dr. Priya Sharma', allergies: [], noShowCount: 0 },
  { id: 'P-1006', abhaId: '91-6789-0123-4567', name: 'Lakshmi Iyer', age: 71, gender: 'Female', phone: '+91-9871122334', bloodGroup: 'B-', conditions: ['Osteoarthritis', 'Hypothyroid'], riskLevel: 'Medium', lastVisit: '2026-04-12', doctor: 'Dr. Arjun Mehta', allergies: ['Aspirin'], noShowCount: 1 },
  { id: 'P-1007', abhaId: '91-7890-1234-5678', name: 'Aarav Khanna', age: 8, gender: 'Male', phone: '+91-9871234567', bloodGroup: 'A+', conditions: ['Allergic Rhinitis'], riskLevel: 'Low', lastVisit: '2026-05-02', doctor: 'Dr. Arjun Mehta', allergies: ['Dust'], noShowCount: 0 },
  { id: 'P-1008', abhaId: '91-8901-2345-6789', name: 'Fatima Sheikh', age: 33, gender: 'Female', phone: '+91-9870098765', bloodGroup: 'O+', conditions: ['Anemia'], riskLevel: 'Medium', lastVisit: '2026-04-25', doctor: 'Dr. Priya Sharma', allergies: [], noShowCount: 0 },
];

export const mockPatients = (params = {}) => {
  let list = [...PATIENTS];
  if (params.search) {
    const q = params.search.toLowerCase();
    list = list.filter(p => p.name.toLowerCase().includes(q) || p.abhaId.includes(params.search));
  }
  if (params.riskLevel) list = list.filter(p => p.riskLevel === params.riskLevel);
  return list;
};

export const mockPatientById = (id) => PATIENTS.find(p => p.id === id) || null;

export const mockPatientRiskScore = (id) => ({
  patientId: id,
  score: 74,
  factors: ['Missed last 2 appointments', 'HbA1c trending up', 'No refill in 45 days'],
  updatedAt: new Date().toISOString(),
});
