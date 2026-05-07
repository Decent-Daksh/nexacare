import { useRef, useState } from "react";
import { Send, Smile, BookOpen } from "lucide-react";
import {
  useWhatsAppConversation,
  useWhatsAppMessageTemplates,
} from "../../hooks/useWhatsAppCommunication";
import LoadingSpinner from "./LoadingSpinner";
import ErrorState from "./ErrorState";

export default function WhatsAppThread({ conversationId, onClose }) {
  const [messageText, setMessageText] = useState("");
  const [showTemplates, setShowTemplates] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const inputRef = useRef(null);

  const { messages, loading, error, refetch, sendMessage, useTemplate, messagesEndRef } =
    useWhatsAppConversation(conversationId);
  const { templates } = useWhatsAppMessageTemplates();

  if (loading) return <LoadingSpinner label="Loading conversation..." />;
  if (error && messages.length === 0) return <ErrorState message={error} onRetry={refetch} />;

  const handleSendMessage = async () => {
    if (!messageText.trim() || sendingMessage) return;

    setSendingMessage(true);
    try {
      await sendMessage(messageText);
      setMessageText("");
      inputRef.current?.focus();
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleUseTemplate = async (templateId) => {
    setSendingMessage(true);
    try {
      await useTemplate(templateId, { patientName: "John Doe" });
      setShowTemplates(false);
    } catch (err) {
      console.error("Failed to use template:", err);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const groupedMessages = messages.reduce((groups, msg) => {
    const date = new Date(msg.timestamp).toLocaleDateString("en-IN");
    if (!groups[date]) groups[date] = [];
    groups[date].push(msg);
    return groups;
  }, {});

  return (
    <div className="h-full flex flex-col bg-surface">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {Object.entries(groupedMessages).map(([date, dayMessages]) => (
          <div key={date}>
            {/* Date Separator */}
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-border" />
              <p className="text-xs text-muted-foreground px-2">{date}</p>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Messages */}
            <div className="space-y-2">
              {dayMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.author === "doctor" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md rounded-lg px-4 py-2 ${
                      msg.author === "doctor"
                        ? "bg-[var(--brand)] text-white"
                        : "bg-background border border-border text-foreground"
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <p
                      className={`text-xs mt-1 ${
                        msg.author === "doctor" ? "text-white/70" : "text-muted-foreground"
                      }`}
                    >
                      {new Date(msg.timestamp).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Template Library */}
      {showTemplates && (
        <div className="border-t border-border bg-background p-3 max-h-48 overflow-y-auto">
          <div className="space-y-2">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => handleUseTemplate(template.id)}
                disabled={sendingMessage}
                className="w-full text-left p-3 rounded-lg border border-border hover:bg-surface transition-colors disabled:opacity-50"
              >
                <p className="font-medium text-sm text-foreground">{template.name}</p>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{template.text}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Message Composer */}
      <div className="border-t border-border p-3 bg-background space-y-2">
        <div className="flex gap-2">
          <textarea
            ref={inputRef}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            disabled={sendingMessage}
            rows={1}
            className="flex-1 px-3 py-2 rounded-lg border border-border bg-surface text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-[var(--brand)] disabled:opacity-50"
          />
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            disabled={sendingMessage}
            className="p-2 rounded-lg border border-border hover:bg-surface transition-colors disabled:opacity-50"
            title="Use template"
          >
            <BookOpen size={18} className="text-foreground" />
          </button>
          <button
            onClick={handleSendMessage}
            disabled={sendingMessage || !messageText.trim()}
            className="p-2 rounded-lg bg-[var(--brand)] hover:bg-[var(--brand-hover)] transition-colors disabled:opacity-50"
          >
            <Send size={18} className={sendingMessage ? "animate-pulse" : ""} color="white" />
          </button>
        </div>
        <p className="text-xs text-muted-foreground">💡 Tip: Press Shift+Enter for new line</p>
      </div>
    </div>
  );
}
