import { useState } from 'react';
import { mockPortalUsers, mockRobotExecutions, mockExecutionLogs, defaultAISystemPrompt } from '../data/mockData';
import { useToast } from '../context/ToastContext';
import {
  Users, Bot, Activity, FileText, Search, Save, RefreshCw, CheckCircle, XCircle, Clock, AlertTriangle,
} from 'lucide-react';

export default function AdminPage() {
  const { addToast } = useToast();
  const [tab, setTab] = useState('users');
  const [aiPrompt, setAiPrompt] = useState(defaultAISystemPrompt);
  const [searchUsers, setSearchUsers] = useState('');

  const tabs = [
    { id: 'users', label: 'User management', icon: Users },
    { id: 'ai_config', label: 'AI configuration', icon: Bot },
    { id: 'uipath', label: 'UiPath monitor', icon: Activity },
    { id: 'logs', label: 'Execution logs', icon: FileText },
  ];

  const filteredUsers = mockPortalUsers.filter(
    (u) =>
      !searchUsers ||
      u.name.toLowerCase().includes(searchUsers.toLowerCase()) ||
      u.id.toLowerCase().includes(searchUsers.toLowerCase())
  );

  const robotStatusIcon = (status) => {
    switch (status) {
      case 'Completed': return <CheckCircle className="w-3.5 h-3.5 text-success" />;
      case 'Running': return <RefreshCw className="w-3.5 h-3.5 text-accent animate-spin" />;
      case 'Failed': return <XCircle className="w-3.5 h-3.5 text-danger" />;
      default: return <Clock className="w-3.5 h-3.5 text-text-muted" />;
    }
  };

  const robotStatusBadge = (status) => {
    const colors = {
      Completed: 'bg-success-bg text-success-text',
      Running: 'bg-accent-bg text-accent',
      Failed: 'bg-danger-bg text-danger-text',
    };
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status] || 'bg-surface text-text-muted'}`}>
        {robotStatusIcon(status)}
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-[22px] font-medium text-text-primary">Admin panel</h1>
        <p className="text-[13px] text-text-muted mt-1">System configuration and monitoring</p>
      </div>

      <div className="bg-card rounded-[12px] border border-border overflow-hidden">
        {/* Tabs */}
        <div className="flex overflow-x-auto border-b border-border">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-3 text-[13px] transition-colors whitespace-nowrap ${
                tab === t.id
                  ? 'border-b-2 border-accent text-accent font-medium'
                  : 'border-b-2 border-transparent text-text-secondary hover:text-text-primary'
              }`}
            >
              <t.icon className="w-[16px] h-[16px]" />
              {t.label}
            </button>
          ))}
        </div>

        <div className="p-4">
          {/* User Management */}
          {tab === 'users' && (
            <div className="space-y-4">
              <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="text"
                  value={searchUsers}
                  onChange={(e) => setSearchUsers(e.target.value)}
                  placeholder="Search users..."
                  className="w-full pl-9 pr-3 py-2 text-[13px] border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-accent/30 placeholder:text-text-muted bg-card"
                />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-[13px]">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-5 py-3 text-left font-normal text-text-muted">ID</th>
                      <th className="px-5 py-3 text-left font-normal text-text-muted">Name</th>
                      <th className="px-5 py-3 text-left font-normal text-text-muted">Email</th>
                      <th className="px-5 py-3 text-left font-normal text-text-muted">Department</th>
                      <th className="px-5 py-3 text-left font-normal text-text-muted">Role</th>
                      <th className="px-5 py-3 text-left font-normal text-text-muted">Status</th>
                      <th className="px-5 py-3 text-left font-normal text-text-muted">Last login</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="border-b border-border hover:bg-surface/50 transition-colors">
                        <td className="px-5 py-3 font-mono text-text-primary">{u.id}</td>
                        <td className="px-5 py-3 font-medium text-text-primary">{u.name}</td>
                        <td className="px-5 py-3 text-text-secondary">{u.email}</td>
                        <td className="px-5 py-3 text-text-secondary">{u.department}</td>
                        <td className="px-5 py-3">
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-accent-bg text-accent capitalize">
                            {u.role.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                            u.status === 'Active' ? 'bg-success-bg text-success-text' : 'bg-surface text-text-muted'
                          }`}>{u.status}</span>
                        </td>
                        <td className="px-5 py-3 text-[12px] text-text-muted">
                          {new Date(u.lastLogin).toLocaleString('en-IN', {
                            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* AI Config */}
          {tab === 'ai_config' && (
            <div className="space-y-4 max-w-2xl">
              <div>
                <h3 className="text-[14px] font-medium text-text-primary mb-1">AI System Prompt</h3>
                <p className="text-[13px] text-text-muted mb-3">
                  This prompt is sent as system context to the AI model for all authorization analysis.
                </p>
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  rows={16}
                  className="w-full px-4 py-3 border border-border rounded-lg text-[13px] font-mono text-text-primary focus:outline-none focus:ring-1 focus:ring-accent/30 resize-y bg-surface"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => addToast('AI system prompt saved successfully.', 'success')}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Save changes
                </button>
                <button
                  onClick={() => setAiPrompt(defaultAISystemPrompt)}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2 bg-card border border-border text-text-secondary rounded-lg text-sm font-medium hover:bg-surface transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reset to default
                </button>
              </div>
            </div>
          )}

          {/* UiPath Monitor */}
          {tab === 'uipath' && (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-[13px]">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-5 py-3 text-left font-normal text-text-muted">Robot ID</th>
                      <th className="px-5 py-3 text-left font-normal text-text-muted">Name</th>
                      <th className="px-5 py-3 text-left font-normal text-text-muted">Status</th>
                      <th className="px-5 py-3 text-left font-normal text-text-muted">Started</th>
                      <th className="px-5 py-3 text-left font-normal text-text-muted">Duration</th>
                      <th className="px-5 py-3 text-left font-normal text-text-muted">Records</th>
                      <th className="px-5 py-3 text-left font-normal text-text-muted">Triggered by</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockRobotExecutions.map((r) => (
                      <tr key={r.id} className="border-b border-border hover:bg-surface/50 transition-colors">
                        <td className="px-5 py-3 font-mono text-text-primary">{r.id}</td>
                        <td className="px-5 py-3 font-medium text-text-primary">{r.name}</td>
                        <td className="px-5 py-3">{robotStatusBadge(r.status)}</td>
                        <td className="px-5 py-3 text-[12px] text-text-muted">
                          {new Date(r.startedAt).toLocaleString('en-IN', {
                            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                          })}
                        </td>
                        <td className="px-5 py-3 text-text-secondary font-mono text-[12px]">{r.duration || '—'}</td>
                        <td className="px-5 py-3 text-text-secondary">{r.recordsProcessed}</td>
                        <td className="px-5 py-3 text-[12px] text-text-muted">{r.triggeredBy}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Failed robot details */}
              {mockRobotExecutions.filter(r => r.error).map((r) => (
                <div key={r.id} className="flex items-start gap-3 px-4 py-3 bg-danger-bg border-l-[3px] border-l-danger rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-danger-text shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[13px] font-medium text-danger-text">{r.name} — Failed</p>
                    <p className="text-[12px] text-danger-text mt-0.5">{r.error}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Execution Logs */}
          {tab === 'logs' && (
            <div className="bg-surface rounded-lg border border-border p-4 font-mono text-[12px] overflow-x-auto max-h-[500px] overflow-y-auto space-y-1">
              {mockExecutionLogs.map((log, idx) => (
                <div key={idx} className="flex gap-3 py-0.5">
                  <span className="text-text-muted shrink-0">[{log.timestamp.split('T')[1]}]</span>
                  <span className={`shrink-0 min-w-[50px] ${
                    log.level === 'ERROR' ? 'text-danger' :
                    log.level === 'WARN' ? 'text-warning' :
                    'text-success'
                  }`}>[{log.level}]</span>
                  <span className="text-text-secondary">{log.message}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
