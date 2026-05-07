/* Appointment shape: { id, patientId, patientName, doctor, date, time, type, status, noShowRisk } */
<<<<<<< HEAD
const TODAY = "2026-05-04";
const APPTS = [
  {
    id: "APT-201",
    patientId: "P-1001",
    patientName: "Rajesh Kumar",
    doctor: "Dr. Priya Sharma",
    date: TODAY,
    time: "09:00",
    type: "Follow-up",
    status: "Confirmed",
    noShowRisk: "High",
  },
  {
    id: "APT-202",
    patientId: "P-1004",
    patientName: "Sneha Pillai",
    doctor: "Dr. Arjun Mehta",
    date: TODAY,
    time: "09:30",
    type: "Consultation",
    status: "Confirmed",
    noShowRisk: "Low",
  },
  {
    id: "APT-203",
    patientId: "P-1002",
    patientName: "Anita Verma",
    doctor: "Dr. Arjun Mehta",
    date: TODAY,
    time: "10:00",
    type: "Consultation",
    status: "In-Progress",
    noShowRisk: "Low",
  },
  {
    id: "APT-204",
    patientId: "P-1003",
    patientName: "Mohammed Iqbal",
    doctor: "Dr. Priya Sharma",
    date: TODAY,
    time: "10:30",
    type: "Review",
    status: "Waiting",
    noShowRisk: "Medium",
  },
  {
    id: "APT-205",
    patientId: "P-1006",
    patientName: "Lakshmi Iyer",
    doctor: "Dr. Arjun Mehta",
    date: TODAY,
    time: "11:15",
    type: "Follow-up",
    status: "Confirmed",
    noShowRisk: "Medium",
  },
  {
    id: "APT-206",
    patientId: "P-1005",
    patientName: "Vikram Singh",
    doctor: "Dr. Priya Sharma",
    date: TODAY,
    time: "12:00",
    type: "Consultation",
    status: "Confirmed",
    noShowRisk: "Low",
  },
  {
    id: "APT-207",
    patientId: "P-1008",
    patientName: "Fatima Sheikh",
    doctor: "Dr. Priya Sharma",
    date: "2026-05-05",
    time: "09:30",
    type: "Consultation",
    status: "Confirmed",
    noShowRisk: "Low",
  },
  {
    id: "APT-208",
    patientId: "P-1007",
    patientName: "Aarav Khanna",
    doctor: "Dr. Arjun Mehta",
    date: "2026-05-05",
    time: "10:00",
    type: "Pediatric",
    status: "Confirmed",
    noShowRisk: "Low",
  },
  {
    id: "APT-209",
    patientId: "P-1003",
    patientName: "Mohammed Iqbal",
    doctor: "Dr. Priya Sharma",
    date: "2026-05-06",
    time: "11:00",
    type: "Cardiac Review",
    status: "Confirmed",
    noShowRisk: "High",
  },
=======
const TODAY = '2026-05-04';
const APPTS = [
  { id: 'APT-201', patientId: 'P-1001', patientName: 'Rajesh Kumar', doctor: 'Dr. Priya Sharma', date: TODAY, time: '09:00', type: 'Follow-up', status: 'Confirmed', noShowRisk: 'High' },
  { id: 'APT-202', patientId: 'P-1004', patientName: 'Sneha Pillai',  doctor: 'Dr. Arjun Mehta',  date: TODAY, time: '09:30', type: 'Consultation', status: 'Confirmed', noShowRisk: 'Low' },
  { id: 'APT-203', patientId: 'P-1002', patientName: 'Anita Verma',   doctor: 'Dr. Arjun Mehta',  date: TODAY, time: '10:00', type: 'Consultation', status: 'In-Progress', noShowRisk: 'Low' },
  { id: 'APT-204', patientId: 'P-1003', patientName: 'Mohammed Iqbal',doctor: 'Dr. Priya Sharma', date: TODAY, time: '10:30', type: 'Review', status: 'Waiting', noShowRisk: 'Medium' },
  { id: 'APT-205', patientId: 'P-1006', patientName: 'Lakshmi Iyer',  doctor: 'Dr. Arjun Mehta',  date: TODAY, time: '11:15', type: 'Follow-up', status: 'Confirmed', noShowRisk: 'Medium' },
  { id: 'APT-206', patientId: 'P-1005', patientName: 'Vikram Singh',  doctor: 'Dr. Priya Sharma', date: TODAY, time: '12:00', type: 'Consultation', status: 'Confirmed', noShowRisk: 'Low' },
  { id: 'APT-207', patientId: 'P-1008', patientName: 'Fatima Sheikh', doctor: 'Dr. Priya Sharma', date: '2026-05-05', time: '09:30', type: 'Consultation', status: 'Confirmed', noShowRisk: 'Low' },
  { id: 'APT-208', patientId: 'P-1007', patientName: 'Aarav Khanna',  doctor: 'Dr. Arjun Mehta',  date: '2026-05-05', time: '10:00', type: 'Pediatric', status: 'Confirmed', noShowRisk: 'Low' },
  { id: 'APT-209', patientId: 'P-1003', patientName: 'Mohammed Iqbal',doctor: 'Dr. Priya Sharma', date: '2026-05-06', time: '11:00', type: 'Cardiac Review', status: 'Confirmed', noShowRisk: 'High' },
>>>>>>> main
];

export const mockAppointments = (params = {}) => {
  let list = [...APPTS];
<<<<<<< HEAD
  if (params.date) list = list.filter((a) => a.date === params.date);
  if (params.status) list = list.filter((a) => a.status === params.status);
=======
  if (params.date) list = list.filter(a => a.date === params.date);
  if (params.status) list = list.filter(a => a.status === params.status);
>>>>>>> main
  return list;
};

export const mockAvailableSlots = () => [
<<<<<<< HEAD
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
=======
  '09:00','09:30','10:00','10:30','11:00','11:30','12:00','15:00','15:30','16:00','16:30','17:00'
>>>>>>> main
];
