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

export function generateMockStaffDetail(staffId) {
  return {
    id: staffId,
    name: 'Dr. Priya Sharma',
    role: 'Senior Doctor',
    department: 'General Medicine',
    email: 'priya.sharma@nexacare.com',
    phone: '+91-9876543210',
    joiningDate: '2021-06-15',
    status: 'active',
    licenseNumber: 'MCI-123456',
    licenseExpiry: '2026-12-31',
    specialization: ['General Medicine', 'Internal Medicine'],
    avatar: 'PS',
    bio: 'Senior physician with 8+ years of experience in general medicine.',
    address: '123 Medical Street, City, State 123456',
    emergencyContact: {
      name: 'John Sharma',
      relationship: 'Spouse',
      phone: '+91-9876543211',
    },
  };
}

export function generateMockStaffDocuments(staffId) {
  const now = new Date();
  return [
    {
      id: `DOC-${staffId}-1`,
      staffId,
      type: 'aadhar',
      name: 'Aadhar Card',
      fileName: 'aadhar_priya_sharma.pdf',
      uploadedAt: new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000).toISOString(),
      expiryDate: null,
      status: 'verified',
      category: 'identity',
    },
    {
      id: `DOC-${staffId}-2`,
      staffId,
      type: 'pan',
      name: 'PAN Card',
      fileName: 'pan_priya_sharma.pdf',
      uploadedAt: new Date(now.getTime() - 300 * 24 * 60 * 60 * 1000).toISOString(),
      expiryDate: null,
      status: 'verified',
      category: 'tax',
    },
    {
      id: `DOC-${staffId}-3`,
      staffId,
      type: 'license',
      name: 'Medical License',
      fileName: 'medical_license.pdf',
      uploadedAt: new Date(now.getTime() - 200 * 24 * 60 * 60 * 1000).toISOString(),
      expiryDate: '2026-12-31',
      status: 'verified',
      category: 'professional',
    },
    {
      id: `DOC-${staffId}-4`,
      staffId,
      type: 'degree',
      name: 'Medical Degree',
      fileName: 'mbbs_degree.pdf',
      uploadedAt: new Date(now.getTime() - 250 * 24 * 60 * 60 * 1000).toISOString(),
      expiryDate: null,
      status: 'verified',
      category: 'professional',
    },
    {
      id: `DOC-${staffId}-5`,
      staffId,
      type: 'certificate',
      name: 'CPR Certification',
      fileName: 'cpr_certificate.pdf',
      uploadedAt: new Date(now.getTime() - 100 * 24 * 60 * 60 * 1000).toISOString(),
      expiryDate: '2025-12-31',
      status: 'expiring_soon',
      category: 'certification',
    },
    {
      id: `DOC-${staffId}-6`,
      staffId,
      type: 'contract',
      name: 'Employment Contract',
      fileName: 'employment_contract.pdf',
      uploadedAt: new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000).toISOString(),
      expiryDate: null,
      status: 'verified',
      category: 'legal',
    },
  ];
}

export function generateMockPayrollHistory(staffId, months = 12) {
  const now = new Date();
  const payroll = [];

  for (let i = 0; i < months; i++) {
    const date = new Date(now);
    date.setMonth(date.getMonth() - i);

    payroll.push({
      id: `PAYROLL-${staffId}-${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
      staffId,
      month: date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0'),
      baseSalary: 100000,
      allowances: {
        dearness: 5000,
        medical: 2000,
        transport: 3000,
      },
      deductions: {
        provident_fund: 12000,
        tax: 8000,
        health_insurance: 1500,
      },
      bonuses: i === 0 ? 0 : Math.random() < 0.3 ? 50000 : 0,
      totalEarnings: 100000 + 10000 + (Math.random() < 0.3 ? 50000 : 0),
      totalDeductions: 21500,
      netSalary: 100000 + 10000 - 21500 + (Math.random() < 0.3 ? 50000 : 0),
      status: i === 0 ? 'pending' : 'paid',
      paidDate: i === 0 ? null : new Date(date.getFullYear(), date.getMonth() + 1, 5).toISOString().split('T')[0],
    });
  }

  return payroll;
}

export function generateMockPerformanceTimeline(staffId) {
  return [
    {
      id: `PERF-${staffId}-1`,
      date: '2025-04-20',
      type: 'performance_review',
      title: 'Quarterly Performance Review',
      rating: 4.5,
      comments: 'Excellent patient care and punctuality. Great team player.',
      reviewer: 'Dr. Rajesh Kumar',
    },
    {
      id: `PERF-${staffId}-2`,
      date: '2025-03-10',
      type: 'achievement',
      title: 'Employee of the Month',
      rating: null,
      comments: 'Awarded for exceptional performance and patient satisfaction.',
      reviewer: 'HR Department',
    },
    {
      id: `PERF-${staffId}-3`,
      date: '2025-01-15',
      type: 'training',
      title: 'Advanced Diagnostics Workshop',
      rating: null,
      comments: 'Completed advanced diagnostics training successfully.',
      reviewer: 'Training Department',
    },
  ];
}
