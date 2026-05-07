/* TeleConsult shape: { sessions[] } */
export const mockTeleConsult = () => ({
  sessions: [
    {
      id: "TC-01",
      patientName: "Anita Verma",
      doctor: "Dr. Arjun Mehta",
      scheduled: "2026-05-04 14:00",
      duration: "20 min",
      status: "Live",
    },
    {
      id: "TC-02",
      patientName: "Sneha Pillai",
      doctor: "Dr. Priya Sharma",
      scheduled: "2026-05-04 15:30",
      duration: "15 min",
      status: "Upcoming",
    },
    {
      id: "TC-03",
      patientName: "Aarav Khanna",
      doctor: "Dr. Arjun Mehta",
      scheduled: "2026-05-04 16:00",
      duration: "20 min",
      status: "Upcoming",
    },
    {
      id: "TC-04",
      patientName: "Vikram Singh",
      doctor: "Dr. Priya Sharma",
      scheduled: "2026-05-03 11:00",
      duration: "18 min",
      status: "Completed",
    },
    {
      id: "TC-05",
      patientName: "Lakshmi Iyer",
      doctor: "Dr. Arjun Mehta",
      scheduled: "2026-05-03 09:30",
      duration: "22 min",
      status: "Completed",
    },
  ],
});
