export function generateMockInvoices(patientId) {
  const invoices = [];
  const now = new Date();

  // Generate 6 sample invoices for the past 6 months
  for (let i = 0; i < 6; i++) {
    const date = new Date(now);
    date.setMonth(date.getMonth() - i);

    invoices.push({
      id: `INV-${patientId}-${1001 + i}`,
      patientId,
      patientName: "John Doe",
      invoiceNumber: `INV-${String(1001 + i).padStart(6, "0")}`,
      date: date.toISOString().split("T")[0],
      amount: Math.floor(Math.random() * 5000) + 1000,
      consultationFee: 500,
      testsFee: Math.floor(Math.random() * 2000),
      medicinesFee: Math.floor(Math.random() * 1500),
      other: Math.floor(Math.random() * 500),
      taxAmount: Math.floor(Math.random() * 500),
      discount: Math.floor(Math.random() * 200),
      status: i === 0 ? "paid" : i < 2 ? "pending" : "paid",
      paymentMethod: i === 0 ? "card" : i === 1 ? null : "upi",
      dueDate: new Date(date.getTime() + 15 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      consultationType: ["General", "Follow-up", "Specialist"][Math.floor(Math.random() * 3)],
      clinic: "Nexacare Clinic - Main Branch",
      doctorName: ["Dr. Priya Sharma", "Dr. Rajesh Kumar", "Dr. Ananya Verma"][
        Math.floor(Math.random() * 3)
      ],
    });
  }

  return invoices;
}

export function generateMockInvoiceDetail(invoiceId) {
  return {
    id: invoiceId,
    invoiceNumber: `INV-001234`,
    date: "2025-04-15",
    dueDate: "2025-04-30",
    status: "paid",
    patient: {
      name: "John Doe",
      phone: "+91-9876543210",
      email: "john@example.com",
      address: "123 Main St, New York, NY 10001",
      abhaId: "ABHA-123456789",
    },
    clinic: {
      name: "Nexacare Clinic - Main Branch",
      address: "456 Medical Plaza, New York, NY 10002",
      phone: "+1-800-NEXACARE",
      email: "billing@nexacare.com",
      registrationNo: "REG-2022-001",
    },
    doctor: {
      name: "Dr. Priya Sharma",
      license: "MCI-123456",
      specialization: "General Practitioner",
    },
    items: [
      {
        description: "Consultation - General",
        quantity: 1,
        unitPrice: 500,
        amount: 500,
      },
      {
        description: "Blood Test (CBC, Thyroid Panel)",
        quantity: 1,
        unitPrice: 1200,
        amount: 1200,
      },
      {
        description: "Prescribed Medicines",
        quantity: 1,
        unitPrice: 800,
        amount: 800,
      },
      {
        description: "ECG Report",
        quantity: 1,
        unitPrice: 400,
        amount: 400,
      },
    ],
    summary: {
      subtotal: 2900,
      tax: 290,
      discount: 100,
      total: 3090,
    },
    payment: {
      method: "UPI",
      transactionId: "UPI-TXN-20250415-001234",
      paidDate: "2025-04-16",
      paidAmount: 3090,
    },
    notes: "Thank you for choosing Nexacare. Please retain this invoice for your records.",
  };
}
