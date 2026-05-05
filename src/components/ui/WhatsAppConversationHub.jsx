import { MessageCircle, MessageSquare, Send } from 'lucide-react';
import { useWhatsAppConversationList } from '../../hooks/useWhatsAppCommunication';
import LoadingSpinner from './LoadingSpinner';
import ErrorState from './ErrorState';
import Avatar from './Avatar';

export default function WhatsAppConversationHub({
  patientId,
  onSelectConversation,
}) {
  const { conversations, loading, error, refetch } = useWhatsAppConversationList(patientId);

  if (loading) return <LoadingSpinner label="Loading conversations..." />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-IN');
  };

  return (
    <div className="space-y-3">
      {conversations.length === 0 ? (
        <div className="text-center py-8">
          <MessageCircle size={32} className="mx-auto text-muted-foreground/50 mb-2" />
          <p className="text-muted-foreground text-sm">No conversations yet</p>
          <p className="text-xs text-muted-foreground mt-1">
            Start a conversation with this patient
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => onSelectConversation?.(conv.id)}
              className="w-full text-left p-4 rounded-lg border border-border hover:bg-surface transition-colors"
            >
              <div className="flex items-start gap-3">
                <Avatar name={conv.doctorName} size={40} />

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-sm text-foreground">
                        {conv.doctorName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {conv.messageCount} messages
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground flex-shrink-0">
                      {formatTime(conv.lastMessageTime)}
                    </p>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                    {conv.lastMessageAuthor === 'doctor' ? (
                      <>
                        <Send size={12} className="inline mr-1" />
                        {conv.lastMessage}
                      </>
                    ) : (
                      <>
                        <MessageSquare size={12} className="inline mr-1" />
                        {conv.lastMessage}
                      </>
                    )}
                  </p>

                  {conv.unreadCount > 0 && (
                    <div className="mt-2">
                      <span className="inline-block px-2 py-0.5 rounded-full bg-[var(--brand)] text-white text-xs font-semibold">
                        {conv.unreadCount} unread
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
