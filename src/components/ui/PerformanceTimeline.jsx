import { Award, TrendingUp, BookOpen, Star } from "lucide-react";
import { usePerformanceTimeline } from "../../hooks/useStaffDetail";
import LoadingSpinner from "./LoadingSpinner";
import ErrorState from "./ErrorState";

export default function PerformanceTimeline({ staffId }) {
  const { timeline, loading, error, refetch } = usePerformanceTimeline(staffId);

  if (loading) return <LoadingSpinner label="Loading performance data..." />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  const getTypeIcon = (type) => {
    switch (type) {
      case "performance_review":
        return <TrendingUp size={18} className="text-[var(--ai)]" />;
      case "achievement":
        return <Award size={18} className="text-[var(--success)]" />;
      case "training":
        return <BookOpen size={18} className="text-[var(--info)]" />;
      default:
        return <Star size={18} className="text-[var(--brand)]" />;
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-4">
      {timeline.length === 0 ? (
        <div className="text-center py-8">
          <Star size={32} className="mx-auto text-muted-foreground/50 mb-2" />
          <p className="text-muted-foreground text-sm">No performance records yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {timeline.map((event, idx) => (
            <div key={event.id} className="flex gap-4">
              {/* Timeline line */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-surface border-2 border-[var(--brand)] flex items-center justify-center flex-shrink-0">
                  {getTypeIcon(event.type)}
                </div>
                {idx < timeline.length - 1 && <div className="w-0.5 h-12 bg-border my-2" />}
              </div>

              {/* Content */}
              <div className="flex-1 pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-sm text-foreground">{event.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatDate(event.date)} • {event.reviewer}
                    </p>
                  </div>
                  {event.rating && (
                    <div className="flex items-center gap-1 bg-[var(--ai)]/10 px-3 py-1 rounded-full">
                      <Star size={14} className="text-[var(--ai)] fill-[var(--ai)]" />
                      <span className="text-sm font-semibold text-[var(--ai)]">
                        {event.rating}/5
                      </span>
                    </div>
                  )}
                </div>

                {event.comments && (
                  <p className="text-sm text-foreground mt-2 p-3 rounded-lg bg-surface border border-border">
                    {event.comments}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
