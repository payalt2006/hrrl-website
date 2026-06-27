import { useState } from 'react';
import { mockSodAlerts, mockAccessHistory, mockRoleAssignments } from '../data/mockData';
import { RiskBadge, StatusBadge } from '../components/common';
import {
  ShieldCheck, AlertTriangle, History, Download, Search, Filter, Key,
} from 'lucide-react';

export default function AuditPage() {
  const [tab, setTab] = useState('sod_alerts');
  const [search, setSearch] = useState('');

  const tabs = [
    { id: 'sod_alerts', label: 'SoD Conflicts', icon: AlertTriangle, count: mockSodAlerts.length },
    { id: 'access_history', label: 'Access History', icon: History },
    { id: 'role_assignments', label: 'Role Assignments', icon: Key },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-medium text-text-primary">Audit & compliance</h1>
          <p className="text-[13px] text-text-muted mt-1">Monitor SoD conflicts and access history logs</p>
        </div>
        {/* Ghost button for utility action */}
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border text-text-secondary hover:bg-surface rounded-lg transition-colors text-[13px] font-medium">
          <Download className="w-[18px] h-[18px]" />
          Export CSV
        </button>
      </div>

      {/* Main container */}
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
              {t.count !== undefined && (
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ml-1 ${
                  tab === t.id ? 'bg-danger-bg text-danger-text' : 'bg-surface text-text-muted'
                }`}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-3 justify-between items-center bg-surface/30">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ID, User, or Role..."
              className="w-full pl-9 pr-3 py-2 text-[13px] border border-border rounded-lg bg-card focus:outline-none focus:ring-1 focus:ring-accent/30 placeholder:text-text-muted"
            />
          </div>
          <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-card border border-border text-text-secondary hover:bg-surface rounded-lg transition-colors text-[13px]">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>

        {/* Content */}
        <div className="overflow-x-auto">
          {tab === 'sod_alerts' && (
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-5 py-3 text-left font-normal text-text-muted">ID</th>
                  <th className="px-5 py-3 text-left font-normal text-text-muted">User</th>
                  <th className="px-5 py-3 text-left font-normal text-text-muted">Conflicting Roles / T-Codes</th>
                  <th className="px-5 py-3 text-left font-normal text-text-muted">Risk</th>
                  <th className="px-5 py-3 text-left font-normal text-text-muted">Detected On</th>
                  <th className="px-5 py-3 text-left font-normal text-text-muted">Status</th>
                </tr>
              </thead>
              <tbody>
                {mockSodAlerts.map((alert) => (
                  <tr key={alert.id} className="border-b border-border hover:bg-surface/50 transition-colors">
                    <td className="px-5 py-3 font-mono text-text-primary">{alert.id}</td>
                    <td className="px-5 py-3">
                      <p className="font-medium text-text-primary">{alert.employeeName}</p>
                      <p className="text-[11px] text-text-muted">{alert.department}</p>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        {alert.conflict.split(' + ').map((c, i, arr) => (
                          <span key={i} className="inline-flex items-center gap-1">
                            <span className="font-mono text-accent">{c}</span>
                            {i < arr.length - 1 && <span className="text-text-muted">+</span>}
                          </span>
                        ))}
                      </div>
                      <p className="text-[12px] text-text-secondary mt-1">{alert.description}</p>
                    </td>
                    <td className="px-5 py-3"><RiskBadge level={alert.risk} /></td>
                    <td className="px-5 py-3 text-text-muted">
                      {new Date(alert.detectedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
                        alert.status === 'open' ? 'bg-danger-bg text-danger-text' : 'bg-surface text-text-muted'
                      }`}>
                        {alert.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {tab === 'access_history' && (
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-5 py-3 text-left font-normal text-text-muted">Employee ID</th>
                  <th className="px-5 py-3 text-left font-normal text-text-muted">User</th>
                  <th className="px-5 py-3 text-left font-normal text-text-muted">Role Granted</th>
                  <th className="px-5 py-3 text-left font-normal text-text-muted">T-Code</th>
                  <th className="px-5 py-3 text-left font-normal text-text-muted">Assigned On</th>
                  <th className="px-5 py-3 text-left font-normal text-text-muted">Status</th>
                </tr>
              </thead>
              <tbody>
                {mockAccessHistory.map((h, idx) => (
                  <tr key={idx} className="border-b border-border hover:bg-surface/50 transition-colors">
                    <td className="px-5 py-3 font-mono text-text-primary">{h.employeeId}</td>
                    <td className="px-5 py-3 font-medium text-text-primary">{h.name}</td>
                    <td className="px-5 py-3 font-mono text-accent">{h.role}</td>
                    <td className="px-5 py-3 font-mono text-text-secondary">{h.tcode}</td>
                    <td className="px-5 py-3 text-text-muted">
                      {new Date(h.assignedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
                        h.status === 'Active' ? 'bg-success-bg text-success-text' : 'bg-surface text-text-muted'
                      }`}>
                        {h.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {tab === 'role_assignments' && (
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-5 py-3 text-left font-normal text-text-muted">Role Name</th>
                  <th className="px-5 py-3 text-left font-normal text-text-muted">Description</th>
                  <th className="px-5 py-3 text-left font-normal text-text-muted">Users Assigned</th>
                  <th className="px-5 py-3 text-left font-normal text-text-muted">Last Reviewed</th>
                  <th className="px-5 py-3 text-left font-normal text-text-muted">Owner</th>
                </tr>
              </thead>
              <tbody>
                {mockRoleAssignments.map((r, idx) => (
                  <tr key={idx} className="border-b border-border hover:bg-surface/50 transition-colors">
                    <td className="px-5 py-3 font-mono text-accent">{r.role}</td>
                    <td className="px-5 py-3 text-text-secondary">{r.description}</td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-surface border border-border text-[11px] font-medium text-text-primary">
                        {r.userCount}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-text-muted">
                      {new Date(r.lastReviewed).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </td>
                    <td className="px-5 py-3 text-text-secondary">{r.owner}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
