import { useState } from 'react';
import { StatusBadge, RiskBadge, Modal, ApprovalTimeline, EmptyState } from '../components/common';
import { mockRequests } from '../data/mockData';
import { useToast } from '../context/ToastContext';
import {
  CheckSquare, Check, X, MessageSquare, Clock, User, AlertTriangle,
} from 'lucide-react';

export default function ApprovalsPage() {
  const { addToast } = useToast();
  const [tab, setTab] = useState('pending_mine');
  const [actionModal, setActionModal] = useState(null);
  const [comment, setComment] = useState('');

  const pendingRequests = mockRequests.filter((r) => r.status === 'pending_approval');
  const recentlyDecided = mockRequests.filter((r) => r.status === 'approved' || r.status === 'rejected');

  const displayRequests = tab === 'recently_decided' ? recentlyDecided : pendingRequests;

  const handleAction = () => {
    if (!comment.trim()) {
      addToast('Please add a comment before proceeding.', 'error');
      return;
    }
    // TODO: Connect to approval API
    if (actionModal.action === 'approve') {
      addToast(`Request ${actionModal.request.id} approved successfully.`, 'success');
    } else if (actionModal.action === 'reject') {
      addToast(`Request ${actionModal.request.id} rejected.`, 'warning');
    } else {
      addToast(`Information requested from ${actionModal.request.employeeName}.`, 'success');
    }
    setActionModal(null);
    setComment('');
  };

  const tabs = [
    { id: 'pending_mine', label: 'Pending mine', count: pendingRequests.length },
    { id: 'all_pending', label: 'All pending', count: pendingRequests.length },
    { id: 'recently_decided', label: 'Recently decided', count: recentlyDecided.length },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-[22px] font-medium text-text-primary">Approval workflow</h1>
        <p className="text-[13px] text-text-muted mt-1">Review and act on pending authorization requests</p>
      </div>

      {/* Tabs */}
      <div className="bg-card rounded-[12px] border border-border">
        <div className="flex border-b border-border">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-3 text-[13px] transition-colors ${
                tab === t.id
                  ? 'border-b-2 border-accent text-accent font-medium'
                  : 'border-b-2 border-transparent text-text-secondary hover:text-text-primary'
              }`}
            >
              {t.label}
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                tab === t.id ? 'bg-accent-bg text-accent' : 'bg-surface text-text-muted'
              }`}>
                {t.count}
              </span>
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="p-4 space-y-4">
          {displayRequests.length === 0 ? (
            <EmptyState
              icon={CheckSquare}
              title="All caught up!"
              message="There are no pending approvals at this time."
            />
          ) : (
            displayRequests.map((req) => (
              <div key={req.id} className="border border-border rounded-[12px] p-5 hover:bg-surface/30 transition-colors bg-card">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  {/* Left info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-full bg-surface flex items-center justify-center shrink-0 border border-border">
                        <User className="w-4 h-4 text-text-muted" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[14px] font-medium text-text-primary">{req.employeeName}</span>
                          <span className="text-[12px] font-mono text-text-muted">{req.employeeId}</span>
                          <StatusBadge status={req.status} />
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-[13px] text-text-secondary">
                          <span className="font-mono text-accent">{req.tcode}</span>
                          <span className="text-border">•</span>
                          <span>{req.tcodeDesc}</span>
                          <span className="text-border">•</span>
                          <span className="font-mono text-text-muted">{req.sapSystem}</span>
                        </div>
                      </div>
                    </div>

                    {/* AI Recommendation summary */}
                    {req.aiAnalysis && (
                      <div className="flex items-center gap-3 px-3 py-2 bg-accent-bg rounded-lg border-l-[3px] border-l-accent text-[12px] text-text-secondary">
                        <span className="font-medium text-accent">AI:</span>
                        <span>Role: <span className="font-mono text-text-primary">{req.aiAnalysis.recommendedRole}</span></span>
                        <span className="text-border">•</span>
                        <span>Grant: <span className="font-medium text-text-primary">{req.aiAnalysis.shouldGrant}</span></span>
                        <RiskBadge level={req.aiAnalysis.risk} />
                      </div>
                    )}

                    {/* Timeline */}
                    <div className="pt-1">
                      <ApprovalTimeline steps={req.approvalHistory} />
                    </div>
                  </div>

                  {/* Action buttons — Ghost/Outline style in list */}
                  {req.status === 'pending_approval' && (
                    <div className="flex lg:flex-col gap-2 shrink-0">
                      <button
                        onClick={() => setActionModal({ request: req, action: 'approve' })}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-card hover:bg-success-bg border border-border hover:border-success-text text-text-secondary hover:text-success-text text-[13px] font-medium rounded-lg transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Approve
                      </button>
                      <button
                        onClick={() => setActionModal({ request: req, action: 'reject' })}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-card hover:bg-danger-bg border border-border hover:border-danger-text text-text-secondary hover:text-danger-text text-[13px] font-medium rounded-lg transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                        Reject
                      </button>
                      <button
                        onClick={() => setActionModal({ request: req, action: 'info' })}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-card hover:bg-surface border border-border text-text-secondary text-[13px] font-medium rounded-lg transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        Request info
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Action Modal */}
      <Modal
        isOpen={!!actionModal}
        onClose={() => { setActionModal(null); setComment(''); }}
        title={
          actionModal?.action === 'approve' ? 'Approve request' :
          actionModal?.action === 'reject' ? 'Reject request' :
          'Request information'
        }
        footer={
          <>
            <button
              onClick={() => { setActionModal(null); setComment(''); }}
              className="px-4 py-2 text-[13px] font-medium text-text-secondary hover:text-text-primary"
            >
              Cancel
            </button>
            <button
              onClick={handleAction}
              className="px-5 py-2 text-[13px] font-medium rounded-lg text-white bg-accent hover:bg-accent/90 transition-colors"
            >
              {actionModal?.action === 'approve' ? 'Confirm approve' :
               actionModal?.action === 'reject' ? 'Confirm reject' :
               'Send request'}
            </button>
          </>
        }
      >
        {actionModal && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-surface rounded-lg">
              <div>
                <p className="text-[14px] font-medium text-text-primary">{actionModal.request.id}</p>
                <p className="text-[12px] text-text-muted">
                  {actionModal.request.employeeName} — <span className="font-mono">{actionModal.request.tcode}</span> ({actionModal.request.sapSystem})
                </p>
              </div>
              <RiskBadge level={actionModal.request.risk} />
            </div>

            {actionModal.action === 'reject' && actionModal.request.risk === 'HIGH' && (
              <div className="flex items-start gap-2 px-3 py-2 bg-danger-bg rounded-lg border-l-[3px] border-l-danger">
                <AlertTriangle className="w-4 h-4 text-danger-text mt-0.5 shrink-0" />
                <p className="text-[12px] text-danger-text">This is a high-risk request. Please provide detailed justification for rejection.</p>
              </div>
            )}

            <div>
              <label className="block text-[13px] text-text-muted mb-1.5">Comments *</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                placeholder="Enter your comments..."
                className="w-full px-3 py-2.5 bg-card border border-border rounded-lg text-[13px] text-text-primary focus:outline-none focus:ring-1 focus:ring-accent/30 placeholder:text-text-muted resize-none"
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
