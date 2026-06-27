import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockNotifications } from '../data/mockData';
import {
  Bell,
  CheckCircle,
  XCircle,
  Clock,
  Cog,
  AlertTriangle,
  CheckCheck,
  ExternalLink,
} from 'lucide-react';

const typeConfig = {
  approved: { icon: CheckCircle, color: 'text-success-text', bg: 'bg-success-bg' },
  rejected: { icon: XCircle, color: 'text-danger-text', bg: 'bg-danger-bg' },
  pending:  { icon: Clock, color: 'text-warning-text', bg: 'bg-warning-bg' },
  robot:    { icon: Cog, color: 'text-accent', bg: 'bg-accent-bg' },
  sod:      { icon: AlertTriangle, color: 'text-danger-text', bg: 'bg-danger-bg' },
};

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(mockNotifications);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-medium text-text-primary">Notifications</h1>
          <p className="text-[13px] text-text-muted mt-1">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-[13px] font-medium text-text-secondary hover:bg-surface transition-colors"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all read
          </button>
        )}
      </div>

      <div className="bg-card rounded-[12px] border border-border overflow-hidden">
        {notifications.map((n, idx) => {
          const config = typeConfig[n.type] || typeConfig.approved;
          const Icon = config.icon;
          return (
            <div
              key={n.id}
              onClick={() => navigate(n.link)}
              className={`flex items-start gap-4 px-5 py-4 cursor-pointer hover:bg-surface/50 transition-colors ${
                idx < notifications.length - 1 ? 'border-b border-border' : ''
              } ${!n.read ? 'bg-accent-bg/30' : ''}`}
            >
              <div className={`w-10 h-10 rounded-full ${config.bg} flex items-center justify-center shrink-0`}>
                <Icon className={`w-5 h-5 ${config.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-medium text-text-primary">{n.title}</span>
                  {!n.read && <span className="w-2 h-2 bg-accent rounded-full shrink-0" />}
                </div>
                <p className="text-[13px] text-text-secondary mt-0.5 line-clamp-2">{n.message}</p>
                <p className="text-[11px] text-text-muted mt-1.5">
                  {new Date(n.timestamp).toLocaleString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              <ExternalLink className="w-4 h-4 text-text-muted shrink-0 mt-1" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
