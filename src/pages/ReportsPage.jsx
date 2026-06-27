import { useState } from 'react';
import {
  requestVolumeData,
  topTCodesData,
  deptRequestsData,
  resolutionTimeData,
} from '../data/mockData';
import {
  Download,
  Calendar,
  FileText,
  Clock,
  AlertTriangle,
  ShieldCheck,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function ReportsPage() {
  const [dateFrom, setDateFrom] = useState('2026-01-01');
  const [dateTo, setDateTo] = useState('2026-06-30');

  const kpis = [
    { label: 'Total requests', value: 296, icon: FileText, color: 'text-accent' },
    { label: 'Avg resolution days', value: '3.1', icon: Clock, color: 'text-warning' },
    { label: 'SoD conflicts', value: 5, icon: AlertTriangle, color: 'text-danger' },
    { label: 'Roles created', value: 8, icon: ShieldCheck, color: 'text-success' },
  ];

  // Colors based on the design system (accent, success, warning, danger)
  const chartColors = ['#2563EB', '#16A34A', '#D97706', '#DC2626'];

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-medium text-text-primary">Reports & analytics</h1>
          <p className="text-[13px] text-text-muted mt-1">Authorization request analytics and compliance reports</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2 bg-surface border border-border rounded-lg px-3 py-2">
            <Calendar className="w-4 h-4 text-text-muted" />
            <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
              className="text-[13px] bg-transparent text-text-secondary border-none focus:outline-none" />
            <span className="text-text-muted">—</span>
            <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
              className="text-[13px] bg-transparent text-text-secondary border-none focus:outline-none" />
          </div>
          {/* Primary CTA */}
          <button className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors">
            <Download className="w-4 h-4" />
            Generate report
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Request Volume */}
        <div className="bg-card rounded-[12px] border border-border p-5">
          <h2 className="text-[15px] font-medium text-text-secondary mb-4">Request volume (last 6 months)</h2>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={requestVolumeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--color-card)', borderRadius: '8px', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)', fontSize: '12px', boxShadow: 'none' }} />
                <Line type="monotone" dataKey="requests" stroke="#2563EB" strokeWidth={2.5} dot={{ fill: '#2563EB', strokeWidth: 0, r: 4 }} activeDot={{ r: 6, fill: '#D97706' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top T-Codes */}
        <div className="bg-card rounded-[12px] border border-border p-5">
          <h2 className="text-[15px] font-medium text-text-secondary mb-4">Most requested T-Codes (top 10)</h2>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topTCodesData} layout="vertical" barSize={16}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="tcode" tick={{ fontSize: 12, fill: 'var(--color-text-muted)', fontFamily: 'JetBrains Mono, monospace' }} axisLine={false} tickLine={false} width={60} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--color-card)', borderRadius: '8px', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)', fontSize: '12px', boxShadow: 'none' }} />
                <Bar dataKey="count" fill="#2563EB" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Distribution */}
        <div className="bg-card rounded-[12px] border border-border p-5">
          <h2 className="text-[15px] font-medium text-text-secondary mb-4">Department-wise requests</h2>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deptRequestsData}
                  outerRadius={90}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {deptRequestsData.map((entry, idx) => (
                    <Cell key={idx} fill={chartColors[idx % chartColors.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'var(--color-card)', borderRadius: '8px', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)', fontSize: '12px', boxShadow: 'none' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Resolution Time */}
        <div className="bg-card rounded-[12px] border border-border p-5">
          <h2 className="text-[15px] font-medium text-text-secondary mb-4">Avg resolution time by department</h2>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={resolutionTimeData} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="department" tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--color-card)', borderRadius: '8px', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)', fontSize: '12px', boxShadow: 'none' }} />
                <Bar dataKey="avgDays" fill="#16A34A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
