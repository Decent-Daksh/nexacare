/* Analytics shape: { kpis, healthScore, charts } */
export const mockAnalytics = () => ({
  kpis: {
    totalPatients: 4218,
    activeAppointments: 38,
    monthlyRevenue: 564000,
    avgWaitMin: 11,
  },
  healthScore: 86,
  charts: {
    revenueTrend: [
<<<<<<< HEAD
      { day: "Mon", value: 82000 },
      { day: "Tue", value: 91000 },
      { day: "Wed", value: 78000 },
      { day: "Thu", value: 104000 },
      { day: "Fri", value: 96000 },
      { day: "Sat", value: 113000 },
      { day: "Sun", value: 42000 },
    ],
    patientFlow: [
      { hour: "9 AM", visits: 8 },
      { hour: "10 AM", visits: 14 },
      { hour: "11 AM", visits: 16 },
      { hour: "12 PM", visits: 11 },
      { hour: "3 PM", visits: 9 },
      { hour: "4 PM", visits: 13 },
      { hour: "5 PM", visits: 18 },
      { hour: "6 PM", visits: 12 },
    ],
    departmentMix: [
      { name: "General Med", value: 42 },
      { name: "Cardiology", value: 18 },
      { name: "Paediatrics", value: 16 },
      { name: "Gynaecology", value: 14 },
      { name: "Orthopaedics", value: 10 },
    ],
    satisfaction: [
      { week: "W1", score: 4.4 },
      { week: "W2", score: 4.5 },
      { week: "W3", score: 4.6 },
      { week: "W4", score: 4.7 },
=======
      { day: 'Mon', value: 82000 }, { day: 'Tue', value: 91000 },
      { day: 'Wed', value: 78000 }, { day: 'Thu', value: 104000 },
      { day: 'Fri', value: 96000 }, { day: 'Sat', value: 113000 },
      { day: 'Sun', value: 42000 },
    ],
    patientFlow: [
      { hour: '9 AM', visits: 8 }, { hour: '10 AM', visits: 14 },
      { hour: '11 AM', visits: 16 }, { hour: '12 PM', visits: 11 },
      { hour: '3 PM', visits: 9 }, { hour: '4 PM', visits: 13 },
      { hour: '5 PM', visits: 18 }, { hour: '6 PM', visits: 12 },
    ],
    departmentMix: [
      { name: 'General Med', value: 42 },
      { name: 'Cardiology', value: 18 },
      { name: 'Paediatrics', value: 16 },
      { name: 'Gynaecology', value: 14 },
      { name: 'Orthopaedics', value: 10 },
    ],
    satisfaction: [
      { week: 'W1', score: 4.4 }, { week: 'W2', score: 4.5 },
      { week: 'W3', score: 4.6 }, { week: 'W4', score: 4.7 },
>>>>>>> main
    ],
  },
});
