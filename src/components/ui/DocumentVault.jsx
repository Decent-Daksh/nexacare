import { Download, FileText, Calendar, CheckCircle, AlertCircle, Trash2 } from 'lucide-react';
import { useStaffDocuments } from '../../hooks/useStaffDetail';
import LoadingSpinner from './LoadingSpinner';
import ErrorState from './ErrorState';
import Badge from './Badge';

export default function DocumentVault({
  staffId,
  onUpload,
}) {
  const { documents, loading, error, refetch, deleteDocument } = useStaffDocuments(staffId);

  if (loading) return <LoadingSpinner label="Loading documents..." />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  const categories = {
    identity: 'Identity Documents',
    professional: 'Professional Credentials',
    certification: 'Certifications',
    tax: 'Tax Documents',
    legal: 'Legal Documents',
  };

  const groupedByCategory = documents.reduce((acc, doc) => {
    const cat = doc.category || 'other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(doc);
    return acc;
  }, {});

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified':
        return <CheckCircle size={16} className="text-[var(--success)]" />;
      case 'expiring_soon':
        return <AlertCircle size={16} className="text-[var(--warning)]" />;
      case 'expired':
        return <AlertCircle size={16} className="text-[var(--danger)]" />;
      default:
        return <FileText size={16} className="text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      {Object.entries(categories).map(([catKey, catName]) => {
        const docs = groupedByCategory[catKey] || [];
        if (docs.length === 0) return null;

        return (
          <div key={catKey}>
            <h3 className="text-sm font-semibold text-foreground mb-3">{catName}</h3>
            <div className="space-y-2">
              {docs.map(doc => (
                <div
                  key={doc.id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-surface transition-colors"
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {getStatusIcon(doc.status)}
                  </div>

                  <div className="flex-1">
                    <p className="font-medium text-sm text-foreground">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Uploaded {new Date(doc.uploadedAt).toLocaleDateString('en-IN')}
                    </p>
                    {doc.expiryDate && (
                      <p className={`text-xs mt-1 ${
                        doc.status === 'expiring_soon'
                          ? 'text-[var(--warning)]'
                          : doc.status === 'expired'
                          ? 'text-[var(--danger)]'
                          : 'text-muted-foreground'
                      }`}>
                        Expires: {new Date(doc.expiryDate).toLocaleDateString('en-IN')}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge variant={doc.status === 'verified' ? 'success' : doc.status === 'expiring_soon' ? 'warning' : 'info'}>
                      {doc.status.replace('_', ' ')}
                    </Badge>
                    <button
                      onClick={() => deleteDocument(doc.id)}
                      className="p-2 hover:bg-surface rounded-lg transition text-muted-foreground hover:text-foreground"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {documents.length === 0 && (
        <div className="text-center py-8">
          <FileText size={32} className="mx-auto text-muted-foreground/50 mb-2" />
          <p className="text-muted-foreground text-sm">No documents uploaded yet</p>
        </div>
      )}

      {/* Upload button */}
      <div className="pt-4 border-t border-border">
        <button
          onClick={onUpload}
          className="w-full px-4 py-2 rounded-lg border border-border hover:bg-surface transition-colors text-sm font-medium text-foreground"
        >
          + Add Document
        </button>
      </div>
    </div>
  );
}
