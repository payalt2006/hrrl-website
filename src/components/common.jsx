import { CheckCircle, XCircle, AlertTriangle, Clock, MinusCircle, X } from 'lucide-react';

const statusConfig = {
  approved:         { label: 'Approved',         bg: 'bg-success-bg',  text: 'text-success-text', dot: 'bg-success' },
  pending_approval: { label: 'Pending Approval', bg: 'bg-warning-bg',  text: 'text-warning-text', dot: 'bg-warning' },
  rejected:         { label: 'Rejected',         bg: 'bg-danger-bg',   text: 'text-danger-text',  dot: 'bg-danger' },
  open:             { label: 'Open',             bg: 'bg-accent-bg',   text: 'text-accent',       dot: 'bg-accent' },
  closed:           { label: 'Closed',           bg: 'bg-surface',     text: 'text-text-muted',   dot: 'bg-text-muted' },
};

export function StatusBadge({ status }) {
  const c = statusConfig[status] || statusConfig.open;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

const riskConfig = {
  HIGH:   { bg: 'bg-danger-bg',  text: 'text-danger-text' },
  MEDIUM: { bg: 'bg-warning-bg', text: 'text-warning-text' },
  LOW:    { bg: 'bg-success-bg', text: 'text-success-text' },
};

export function RiskBadge({ level }) {
  const c = riskConfig[level] || riskConfig.LOW;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-medium ${c.bg} ${c.text}`}>
      {level}
    </span>
  );
}

export function LoadingSpinner({ text = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-border border-t-accent rounded-full animate-spin" />
      </div>
      <p className="text-sm text-text-secondary">{text}</p>
    </div>
  );
}

export function EmptyState({ icon: Icon, title, message, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {Icon && (
        <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center mb-4">
          <Icon className="w-5 h-5 text-text-muted" />
        </div>
      )}
      <h3 className="text-sm font-medium text-text-primary mb-1">{title}</h3>
      <p className="text-sm text-text-secondary mb-6 text-center max-w-sm">{message}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export function Modal({ isOpen, onClose, title, children, footer, size = 'md' }) {
  if (!isOpen) return null;
  const sizeClass = size === 'lg' ? 'max-w-2xl' : size === 'xl' ? 'max-w-4xl' : 'max-w-lg';
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className={`relative bg-card rounded-[12px] border border-border w-full ${sizeClass} max-h-[85vh] flex flex-col animate-in`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="text-[15px] font-medium text-text-primary">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-surface rounded-lg transition-colors">
            <X className="w-4 h-4 text-text-muted" />
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-4 flex-1">{children}</div>
        {footer && <div className="px-5 py-3 border-t border-border flex justify-end gap-3">{footer}</div>}
      </div>
    </div>
  );
}

export function ApprovalTimeline({ steps }) {
  return (
    <div className="flex items-center w-full gap-0">
      {steps.map((step, idx) => {
        const isLast = idx === steps.length - 1;
        const statusIcon = step.status === 'completed' ? (
          <CheckCircle className="w-[18px] h-[18px] text-success" />
        ) : step.status === 'in_progress' ? (
          <Clock className="w-[18px] h-[18px] text-warning" />
        ) : step.status === 'skipped' ? (
          <MinusCircle className="w-[18px] h-[18px] text-text-muted" />
        ) : (
          <div className="w-[18px] h-[18px] rounded-full border-2 border-border" />
        );

        return (
          <div key={idx} className={`flex items-center ${isLast ? '' : 'flex-1'}`}>
            <div className="flex flex-col items-center gap-1 min-w-[80px]">
              {statusIcon}
              <span className="text-xs text-text-secondary text-center leading-tight">{step.step}</span>
              {step.by && <span className="text-[10px] text-text-muted">{step.by}</span>}
              {step.at && (
                <span className="text-[10px] text-text-muted">
                  {new Date(step.at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </span>
              )}
            </div>
            {!isLast && (
              <div className={`flex-1 h-px mx-1 ${step.status === 'completed' ? 'bg-success/40' : 'bg-border'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export function Toast({ toasts, removeToast }) {
  const typeStyles = {
    success: 'border-l-success bg-success-bg text-success-text',
    error:   'border-l-danger bg-danger-bg text-danger-text',
    warning: 'border-l-warning bg-warning-bg text-warning-text',
  };
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-[12px] border border-border border-l-[3px] text-sm min-w-[300px] animate-slide-in bg-card ${typeStyles[toast.type] || typeStyles.success}`}
        >
          <span className="flex-1">{toast.message}</span>
          <button onClick={() => removeToast(toast.id)} className="p-0.5 hover:opacity-70">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
