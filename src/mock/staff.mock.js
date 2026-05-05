/* Staff shape: { staff[], shifts[], attendance[] } */
export const mockStaff = () => ({
  staff: [
    { id: 'S-01', name: 'Dr. Priya Sharma', role: 'Senior Physician', phone: '+91-9810000001', salary: 185000, joined: '2019-06-12' },
    { id: 'S-02', name: 'Dr. Arjun Mehta',  role: 'General Physician', phone: '+91-9810000002', salary: 142000, joined: '2021-02-04' },
    { id: 'S-03', name: 'Nurse Reena Joshi', role: 'Head Nurse',       phone: '+91-9810000003', salary: 48000,  joined: '2020-09-20' },
    { id: 'S-04', name: 'Pharmacist Karan Bhatt', role: 'Pharmacist',  phone: '+91-9810000004', salary: 56000,  joined: '2022-04-15' },
    { id: 'S-05', name: 'Front Desk Anya Roy', role: 'Receptionist',   phone: '+91-9810000005', salary: 32000,  joined: '2023-01-08' },
    { id: 'S-06', name: 'Tech Manish Yadav',   role: 'Lab Technician', phone: '+91-9810000006', salary: 38000,  joined: '2022-11-19' },
  ],
  shifts: [
    { staffId: 'S-01', mon: 'Morning', tue: 'Morning', wed: 'Off',     thu: 'Morning', fri: 'Morning', sat: 'Half', sun: 'Off' },
    { staffId: 'S-02', mon: 'Evening', tue: 'Evening', wed: 'Evening', thu: 'Off',     fri: 'Evening', sat: 'Morning', sun: 'Off' },
    { staffId: 'S-03', mon: 'Full',    tue: 'Full',    wed: 'Full',    thu: 'Full',    fri: 'Off',     sat: 'Full', sun: 'Off' },
    { staffId: 'S-04', mon: 'Full',    tue: 'Full',    wed: 'Off',     thu: 'Full',    fri: 'Full',    sat: 'Half', sun: 'Off' },
    { staffId: 'S-05', mon: 'Morning', tue: 'Morning', wed: 'Morning', thu: 'Morning', fri: 'Morning', sat: 'Half', sun: 'Off' },
    { staffId: 'S-06', mon: 'Full',    tue: 'Off',     wed: 'Full',    thu: 'Full',    fri: 'Full',    sat: 'Off', sun: 'Off' },
  ],
  attendance: [
    { staffId: 'S-01', present: 22, absent: 1, leave: 1 },
    { staffId: 'S-02', present: 21, absent: 0, leave: 3 },
    { staffId: 'S-03', present: 24, absent: 0, leave: 0 },
    { staffId: 'S-04', present: 23, absent: 1, leave: 0 },
    { staffId: 'S-05', present: 22, absent: 2, leave: 0 },
    { staffId: 'S-06', present: 20, absent: 1, leave: 3 },
  ],
});
