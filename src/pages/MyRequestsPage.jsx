import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StatusBadge, RiskBadge, Modal, ApprovalTimeline, EmptyState } from '../components/common';
import { mockRequests } from '../data/mockData';
import { FileText, Search, ExternalLink } from 'lucide-react';

const filterOptions = ['all', 'open', 'pending_approval', 'approved', 'rejected', 'closed'];
const filterLabels = {
  all: 'All', open: 'Open', pending_approval: 'Pending',
  approved: 'Approved', rejected: 'Rejected', closed: 'Closed',
};

export default function MyRequestsPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);

  const filteredRequests = mockRequests.filter((r) => {
    const matchesFilter = filter === 'all' || r.status === filter;
    const matchesSearch = !search ||
      r.tcode.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-[22px] font-medium text-text-primary">My requests</h1>
        <p className="text-[13px] text-text-muted mt-1">Track and manage your SAP authorization requests</p>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-[12px] border border-border p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex flex-wrap gap-1.5 flex-1">
            {filterOptions.map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-all ${
                  filter === f ? 'bg-accent text-white' : 'bg-surface text-text-secondary hover:bg-surface/80'
                }`}>
                {filterLabels[f]}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search T-Code or Request ID"
              className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-accent/30 placeholder:text-text-muted" />
          </div>
        </div>
      </div>

      {/* Table */}
      {filteredRequests.length === 0 ? (
        <EmptyState icon={FileText} title="No requests found"
          message="No requests match your current filters. Raise your first authorization request."
          actionLabel="Raise new request" onAction={() => navigate('/raise-request')} />
      ) : (
        <div className="bg-card rounded-[12px] border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-5 py-3 text-left text-[12px] text-text-muted">Request ID</th>
                  <th className="px-5 py-3 text-left text-[12px] text-text-muted">T-Code</th>
                  <th className="px-5 py-3 text-left text-[12px] text-text-muted hidden sm:table-cell">System</th>
                  <th className="px-5 py-3 text-left text-[12px] text-text-muted hidden md:table-cell">Submitted</th>
                  <th className="px-5 py-3 text-left text-[12px] text-text-muted">Status</th>
                  <th className="px-5 py-3 text-left text-[12px] text-text-muted hidden sm:table-cell">Risk</th>
                  <th className="px-5 py-3 text-left text-[12px] text-text-muted">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((req) => (
                  <tr key={req.id} className="border-b border-border hover:bg-surface/50 transition-colors">
                    <td className="px-5 py-3 font-mono text-[13px] text-text-primary">{req.id}</td>
                    <td className="px-5 py-3">
                      <span className="font-mono text-[13px] text-accent">{req.tcode}</span>
                      <p className="text-[12px] text-text-muted mt-0.5">{req.tcodeDesc}</p>
                    </td>
                    <td className="px-5 py-3 font-mono text-[13px] text-text-muted hidden sm:table-cell">{req.sapSystem}</td>
                    <td className="px-5 py-3 text-[13px] text-text-muted hidden md:table-cell">
                      {new Date(req.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-5 py-3"><StatusBadge status={req.status} /></td>
                    <td className="px-5 py-3 hidden sm:table-cell"><RiskBadge level={req.risk} /></td>
                    <td className="px-5 py-3">
                      <button onClick={() => setSelectedRequest(req)}
                        className="inline-flex items-center gap-1 text-[13px] text-accent hover:underline">
                        View <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <Modal isOpen={!!selectedRequest} onClose={() => setSelectedRequest(null)}
        title={`Request ${selectedRequest?.id}`} size="lg">
        {selectedRequest && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { label: 'Requester', value: selectedRequest.employeeName },
                { label: 'Department', value: selectedRequest.department },
                { label: 'T-Code', value: `${selectedRequest.tcode} — ${selectedRequest.tcodeDesc}`, mono: true },
                { label: 'System / Priority', value: `${selectedRequest.sapSystem} · ${selectedRequest.priority}` },
              ].map((item) => (
                <div key={item.label} className="bg-surface rounded-lg p-3">
                  <p className="text-[12px] text-text-muted">{item.label}</p>
                  <p className={`font-medium text-text-primary mt-0.5 ${item.mono ? 'font-mono text-[13px] text-accent' : ''}`}>{item.value}</p>
                </div>
              ))}
            </div>

            <div className="text-sm">
              <p className="text-[12px] text-text-muted mb-1">Description</p>
              <p className="text-text-secondary">{selectedRequest.description}</p>
            </div>

            {selectedRequest.aiAnalysis && (
              <div>
                <p className="text-[12px] text-text-muted mb-2">AI recommendation</p>
                <div className="bg-accent-bg/30 border-l-[3px] border-l-accent rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="text-[12px] text-text-muted">Object: <span className="font-mono text-text-primary">{selectedRequest.aiAnalysis.object}</span></span>
                    <span className="text-[12px] text-text-muted">Field: <span className="font-mono text-text-primary">{selectedRequest.aiAnalysis.field}</span></span>
                    <RiskBadge level={selectedRequest.aiAnalysis.risk} />
                  </div>
                  <p className="text-text-secondary">{selectedRequest.aiAnalysis.businessMeaning}</p>
                  <p className="text-[12px] text-text-muted">
                    Role: <span className="font-mono text-accent">{selectedRequest.aiAnalysis.recommendedRole}</span>
                    {' · '}Grant: <span className="font-medium text-text-primary">{selectedRequest.aiAnalysis.shouldGrant}</span>
                  </p>
                  <p className="text-[12px] text-text-muted italic">{selectedRequest.aiAnalysis.remarks}</p>
                </div>
              </div>
            )}

            <div>
              <p className="text-[12px] text-text-muted mb-3">Approval progress</p>
              <ApprovalTimeline steps={selectedRequest.approvalHistory} />
            </div>

            {selectedRequest.approvalHistory.filter(s => s.comment).length > 0 && (
              <div>
                <p className="text-[12px] text-text-muted mb-2">Comments</p>
                <div className="space-y-2">
                  {selectedRequest.approvalHistory.filter(s => s.comment).map((s, i) => (
                    <div key={i} className="bg-surface rounded-lg p-3 text-sm">
                      <p className="text-[12px] text-text-muted">{s.step} — {s.by}</p>
                      <p className="text-text-secondary mt-0.5">{s.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
