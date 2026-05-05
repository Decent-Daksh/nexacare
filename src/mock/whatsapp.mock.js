export function generateMockWhatsAppDeliveryLog(patientId, limit = 20) {
  const deliveryTypes = ['prescription', 'lab_report', 'medical_certificate', 'discharge_summary', 'appointment_reminder'];
  const statuses = ['delivered', 'read', 'failed'];
  
  const logs = [];
  const now = new Date();

  for (let i = 0; i < limit; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));

    logs.push({
      id: `DELIVERY-${patientId}-${i + 1}`,
      patientId,
      patientPhone: '+91-9876543210',
      patientName: 'John Doe',
      documentType: deliveryTypes[Math.floor(Math.random() * deliveryTypes.length)],
      documentId: `DOC-${Date.now()}-${i}`,
      documentName: `Document ${i + 1}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      deliveredAt: date.toISOString(),
      readAt: ['read'].includes(statuses[Math.floor(Math.random() * statuses.length)]) ? date.toISOString() : null,
      failureReason: null,
      messageId: `MSG-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    });
  }

  return logs.sort((a, b) => new Date(b.deliveredAt) - new Date(a.deliveredAt));
}

export function generateMockDocumentTemplates() {
  return [
    {
      id: 'template-prescription',
      name: 'Prescription',
      icon: 'pill',
      description: 'Digital prescription with medication details',
      category: 'medical',
    },
    {
      id: 'template-lab-report',
      name: 'Lab Report',
      icon: 'microscope',
      description: 'Laboratory test results and analysis',
      category: 'reports',
    },
    {
      id: 'template-medical-cert',
      name: 'Medical Certificate',
      icon: 'document',
      description: 'Health certificate for official use',
      category: 'certificates',
    },
    {
      id: 'template-discharge',
      name: 'Discharge Summary',
      icon: 'file',
      description: 'Hospital discharge summary and care instructions',
      category: 'reports',
    },
    {
      id: 'template-appointment',
      name: 'Appointment Reminder',
      icon: 'calendar',
      description: 'Upcoming appointment details',
      category: 'reminders',
    },
    {
      id: 'template-follow-up',
      name: 'Follow-up Instructions',
      icon: 'stethoscope',
      description: 'Post-consultation care instructions',
      category: 'instructions',
    },
  ];
}

export function generateMockPhoneNumbers(patientId) {
  return [
    {
      id: 'phone-primary',
      number: '+91-9876543210',
      isVerified: true,
      isPrimary: true,
      addedAt: '2025-01-15',
      label: 'Personal',
    },
    {
      id: 'phone-alternate',
      number: '+91-8765432109',
      isVerified: true,
      isPrimary: false,
      addedAt: '2025-02-20',
      label: 'Alternate',
    },
  ];
}
