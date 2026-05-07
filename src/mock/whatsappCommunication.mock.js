export function generateMockWhatsAppConversation(patientId) {
  const now = new Date();
  const messages = [];

  // Generate sample conversation messages
  const sampleMessages = [
    { author: "patient", text: "Hi doctor, how are you?" },
    { author: "doctor", text: "Hello! I'm doing well. How can I help you today?" },
    { author: "patient", text: "My blood pressure has been high lately" },
    {
      author: "doctor",
      text: "Let's schedule an appointment to check. Are you free tomorrow at 3 PM?",
    },
    { author: "patient", text: "Yes, that works for me" },
    { author: "doctor", text: "Great! Appointment confirmed. Please arrive 10 minutes early." },
    { author: "patient", text: "Thank you, doctor" },
  ];

  sampleMessages.forEach((msg, idx) => {
    const date = new Date(now);
    date.setMinutes(date.getMinutes() - (sampleMessages.length - idx) * 15);

    messages.push({
      id: `MSG-${patientId}-${idx}`,
      conversationId: `CONV-${patientId}-main`,
      author: msg.author,
      authorName: msg.author === "doctor" ? "Dr. Priya Sharma" : "Patient",
      authorPhone: msg.author === "doctor" ? "+91-9876543210" : "+91-9123456789",
      text: msg.text,
      timestamp: date.toISOString(),
      status: "read",
      type: "text",
    });
  });

  return messages;
}

export function generateMockWhatsAppConversationList(patientId) {
  const now = new Date();

  return [
    {
      id: `CONV-${patientId}-main`,
      patientId,
      patientName: "John Doe",
      patientPhone: "+91-9123456789",
      doctorName: "Dr. Priya Sharma",
      doctorPhone: "+91-9876543210",
      lastMessage: "Great! Appointment confirmed. Please arrive 10 minutes early.",
      lastMessageTime: now.toISOString(),
      lastMessageAuthor: "doctor",
      unreadCount: 0,
      messageCount: 15,
      createdAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
}

export function generateMockMessageTemplates() {
  return [
    {
      id: "template-1",
      name: "Appointment Confirmation",
      text: "Hi {patientName}, your appointment has been confirmed for {date} at {time}. Please arrive 10 minutes early.",
      category: "appointments",
    },
    {
      id: "template-2",
      name: "Follow-up Check",
      text: "Hi {patientName}, how are you feeling after the consultation? Please let me know if you have any concerns.",
      category: "follow-up",
    },
    {
      id: "template-3",
      name: "Medication Reminder",
      text: "Hi {patientName}, don't forget to take your medications as prescribed. Stay healthy!",
      category: "reminders",
    },
    {
      id: "template-4",
      name: "Lab Test Reminder",
      text: "Hi {patientName}, it's time for your {testName}. Please visit the lab at your earliest convenience.",
      category: "reminders",
    },
    {
      id: "template-5",
      name: "Health Tips",
      text: "Hi {patientName}, here's a health tip for you: {tip}. Take care!",
      category: "health-tips",
    },
  ];
}
