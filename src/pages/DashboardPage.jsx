import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { StatusBadge, RiskBadge } from '../components/common';
import { mockRequests, riskSummaryData, resolutionTimeData } from '../data/mockData';
import {
  FileText, Clock, CheckCircle2, AlertTriangle, Plus, ArrowRight,
} from 'lucide-react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const kpis = [
    { label: 'Open requests', value: 3, icon: FileText, color: 'text-accent' },
    { label: 'Pending approvals', value: 4, icon: Clock, color: 'text-warning' },
    { label: 'Approved this month', value: 12, icon: CheckCircle2, color: 'text-success' },
    { label: 'High risk alerts', value: 5, icon: AlertTriangle, color: 'text-danger' },
  ];

  const recentActivity = mockRequests.slice(0, 5);

  return (
    <div className="space-y-5">
      {/* Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-medium text-text-primary">
            Welcome, {user?.name?.split(' ')[0]}
          </h1>
          <p className="text-[13px] text-text-muted mt-0.5">
            {user?.department} · {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        {/* Single primary action button */}
        <button
          onClick={() => navigate('/raise-request')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent/90 text-white font-medium rounded-lg transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Raise new request
        </button>
      </div>

      {/* KPI Cards — bg-surface, no border, ambient stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="bg-surface rounded-[12px] p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[13px] text-text-muted">{kpi.label}</p>
                <p className="text-2xl font-medium text-text-primary mt-1">{kpi.value}</p>
              </div>
              <kpi.icon className={`w-[18px] h-[18px] ${kpi.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Risk Donut */}
        <div className="bg-card rounded-[12px] border border-border p-5">
          <h2 className="text-[15px] font-medium text-text-secondary mb-4">Authorization risk summary</h2>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskSummaryData}
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={2}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                >
                  {riskSummaryData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.fill} stroke="none" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: '1px solid #E5E9F0', fontSize: '12px', boxShadow: 'none' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-5 mt-1">
            {riskSummaryData.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5 text-[12px] text-text-muted">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.fill }} />
                {d.name} ({d.value})
              </div>
            ))}
          </div>
        </div>

        {/* Resolution Time */}
        <div className="bg-card rounded-[12px] border border-border p-5">
          <h2 className="text-[15px] font-medium text-text-secondary mb-4">Avg. resolution time (days)</h2>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={resolutionTimeData} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="department" tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--color-card)', borderRadius: '8px', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)', fontSize: '12px', boxShadow: 'none' }} />
                <Bar dataKey="avgDays" fill="var(--color-accent)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-card rounded-[12px] border border-border">
        <div className="flex items-center justify-between px-5 py-3 border-b border-border">
          <h2 className="text-[15px] font-medium text-text-secondary">Recent activity</h2>
          <button
            onClick={() => navigate('/my-requests')}
            className="text-[13px] text-accent hover:underline flex items-center gap-1"
          >
            View all <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div>
          {recentActivity.map((req, idx) => (
            <div key={req.id} className={`flex items-center justify-between px-5 py-3 ${idx < recentActivity.length - 1 ? 'border-b border-border' : ''} hover:bg-surface/50 transition-colors`}>
              <div className="flex items-center gap-3 min-w-0">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-text-primary">{req.id}</span>
                    <span className="text-[13px] font-mono text-text-muted">{req.tcode}</span>
                  </div>
                  <p className="text-[12px] text-text-muted mt-0.5">{req.tcodeDesc} · {req.sapSystem}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <RiskBadge level={req.risk} />
                <StatusBadge status={req.status} />
                <span className="text-[11px] text-text-muted hidden sm:block">
                  {new Date(req.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
