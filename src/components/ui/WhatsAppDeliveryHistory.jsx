import { MessageCircle, CheckCircle, AlertCircle, RotateCcw, Copy } from 'lucide-react';
import { useWhatsAppDeliveryLog } from '../../hooks/useWhatsAppDelivery';
import LoadingSpinner from './LoadingSpinner';
import ErrorState from './ErrorState';
import Badge from './Badge';

export default function WhatsAppDeliveryHistory({
  patientId,
  onResend,
  limit = 10,
}) {
  const { deliveryLog, loading, error, refetch } = useWhatsAppDeliveryLog(patientId);

  if (loading) return <LoadingSpinner label="Loading delivery history..." />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  const recentDeliveries = deliveryLog.slice(0, limit);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle size={16} className="text-[var(--success)]" />;
      case 'read':
        return <CheckCircle size={16} className="text-[var(--brand)]" />;
      case 'failed':
        return <AlertCircle size={16} className="text-[var(--danger)]" />;
      default:
        return <MessageCircle size={16} className="text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      delivered: 'success',
      read: 'brand',
      failed: 'danger',
      queued: 'warning',
    };
    return variants[status] || 'info';
  };

  const formatTime = (date) => {
    const d = new Date(date);
    return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (d.toDateString() === today.toDateString()) return 'Today';
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-3">
      {recentDeliveries.length === 0 ? (
        <div className="text-center py-8">
          <MessageCircle size={32} className="mx-auto text-muted-foreground/50 mb-2" />
          <p className="text-muted-foreground text-sm">No delivery history</p>
        </div>
      ) : (
        <div className="space-y-2">
          {recentDeliveries.map((delivery, idx) => (
            <div
              key={delivery.id}
              className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-surface transition-colors"
            >
              <div className="mt-1 flex-shrink-0">
                {getStatusIcon(delivery.status)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-sm text-foreground capitalize">
                      {delivery.documentType.replace('_', ' ')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {delivery.patientPhone}
                    </p>
                  </div>
                  <Badge variant={getStatusBadge(delivery.status)}>
                    {delivery.status.charAt(0).toUpperCase() + delivery.status.slice(1)}
                  </Badge>
                </div>

                <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{formatDate(delivery.deliveredAt)}</span>
                  <span>{formatTime(delivery.deliveredAt)}</span>
                  {delivery.readAt && (
                    <span className="text-[var(--brand)]">
                      Read at {formatTime(delivery.readAt)}
                    </span>
                  )}
                </div>

                {delivery.failureReason && (
                  <p className="mt-2 text-xs text-[var(--danger)]">
                    {delivery.failureReason}
                  </p>
                )}
              </div>

              <div className="flex gap-1 flex-shrink-0">
                {delivery.status === 'failed' && (
                  <button
                    onClick={() => onResend?.(delivery.id, delivery.patientPhone)}
                    className="p-2 hover:bg-surface rounded-lg transition text-muted-foreground hover:text-foreground"
                    title="Resend"
                  >
                    <RotateCcw size={14} />
                  </button>
                )}
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(delivery.messageId);
                  }}
                  className="p-2 hover:bg-surface rounded-lg transition text-muted-foreground hover:text-foreground"
                  title="Copy Message ID"
                >
                  <Copy size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {deliveryLog.length > limit && (
        <button className="w-full text-center px-3 py-2 text-sm text-[var(--brand)] hover:text-[var(--brand-hover)] font-medium">
          View All Deliveries ({deliveryLog.length})
        </button>
      )}
    </div>
  );
}
