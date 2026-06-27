import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { RiskBadge, LoadingSpinner } from '../components/common';
import { departments } from '../data/mockData';
import {
  CheckCircle2, ArrowLeft, ArrowRight, Sparkles, Send, Image, AlertCircle,
} from 'lucide-react';

const steps = ['Request details', 'AI analysis', 'Confirm & submit'];

export default function RaiseRequestPage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [form, setForm] = useState({
    employeeId: user?.id || '',
    fullName: user?.name || '',
    department: user?.department || '',
    sapSystem: 'PRD',
    tcode: '',
    description: '',
    screenshot: null,
    priority: 'Medium',
  });

  const updateForm = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleStep1Submit = () => {
    if (!form.tcode || !form.description) {
      addToast('Please fill in T-Code and description', 'error');
      return;
    }
    setCurrentStep(1);
    setAnalyzing(true);

    // TODO: Replace with real call to AI backend (Streamlit/Groq API)
    // POST /api/analyze-su53 { tcode: form.tcode, description: form.description, system: form.sapSystem }
    setTimeout(() => {
      setAiResult({
        object: 'M_BEST_BSA',
        field: 'ACTVT',
        missingValue: '01',
        businessMeaning: 'Create Purchase Orders in MM module',
        risk: form.tcode.toUpperCase() === 'SE16N' || form.tcode.toUpperCase() === 'SU01' ? 'HIGH' :
              form.tcode.toUpperCase() === 'FB60' || form.tcode.toUpperCase() === 'PFCG' ? 'MEDIUM' : 'LOW',
        recommendedRole: `Z_${form.department?.toUpperCase().slice(0, 3) || 'GEN'}_${form.tcode.toUpperCase()}`,
        shouldGrant: form.tcode.toUpperCase() === 'SE16N' ? 'No' :
                     form.tcode.toUpperCase() === 'FB60' ? 'Conditional' : 'Yes',
        remarks: form.tcode.toUpperCase() === 'SE16N'
          ? 'HIGH RISK — SE16N provides unrestricted table access. Recommend using standard reports instead.'
          : 'Standard business access for procurement users. Route to MM Lead for approval.',
      });
      setAnalyzing(false);
    }, 2000);
  };

  const handleFinalSubmit = () => {
    // TODO: POST /api/requests { ...form, aiAnalysis: aiResult }
    addToast('Request submitted successfully! Redirecting…', 'success');
    setTimeout(() => navigate('/my-requests'), 1500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div>
        <h1 className="text-[22px] font-medium text-text-primary">Raise authorization request</h1>
        <p className="text-[13px] text-text-muted mt-1">Submit a new SAP authorization request with AI-powered analysis</p>
      </div>

      {/* Step indicator */}
      <div className="bg-card rounded-[12px] border border-border p-4">
        <div className="flex items-center justify-between">
          {steps.map((step, idx) => (
            <div key={step} className="flex items-center flex-1">
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[13px] font-medium transition-all ${
                  idx < currentStep ? 'bg-success-bg text-success-text' :
                  idx === currentStep ? 'bg-accent text-white' :
                  'bg-surface text-text-muted'
                }`}>
                  {idx < currentStep ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                </div>
                <span className={`text-[13px] hidden sm:block ${idx <= currentStep ? 'text-text-primary' : 'text-text-muted'}`}>
                  {step}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div className={`flex-1 h-px mx-3 ${idx < currentStep ? 'bg-success/30' : 'bg-border'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1 */}
      {currentStep === 0 && (
        <div className="bg-card rounded-[12px] border border-border p-5 space-y-4">
          <h2 className="text-[15px] font-medium text-text-secondary">Request details</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] text-text-muted mb-1.5">Employee ID</label>
              <input type="text" value={form.employeeId} readOnly
                className="w-full px-3 py-2.5 bg-surface border border-border rounded-lg text-sm text-text-secondary font-mono" />
            </div>
            <div>
              <label className="block text-[13px] text-text-muted mb-1.5">Full name</label>
              <input type="text" value={form.fullName} onChange={(e) => updateForm('fullName', e.target.value)}
                className="w-full px-3 py-2.5 border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent/30" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] text-text-muted mb-1.5">Department</label>
              <select value={form.department} onChange={(e) => updateForm('department', e.target.value)}
                className="w-full px-3 py-2.5 border border-border rounded-lg text-sm text-text-primary bg-card focus:outline-none focus:ring-1 focus:ring-accent/30">
                {departments.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[13px] text-text-muted mb-1.5">SAP system</label>
              <div className="flex gap-4 mt-1.5">
                {['DEV', 'QAS', 'PRD'].map((sys) => (
                  <label key={sys} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="sapSystem" value={sys} checked={form.sapSystem === sys}
                      onChange={(e) => updateForm('sapSystem', e.target.value)} className="w-4 h-4 text-accent" />
                    <span className={`text-sm font-mono ${form.sapSystem === sys ? 'text-accent' : 'text-text-muted'}`}>{sys}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[13px] text-text-muted mb-1.5">Transaction code (T-Code)</label>
            <input type="text" value={form.tcode} onChange={(e) => updateForm('tcode', e.target.value.toUpperCase())}
              placeholder="e.g. ME21N, FB60, MIRO"
              className="w-full px-3 py-2.5 border border-border rounded-lg text-sm font-mono text-text-primary focus:outline-none focus:ring-1 focus:ring-accent/30 placeholder:text-text-muted" />
            <p className="text-[12px] text-text-muted mt-1">Enter the T-Code that triggered the authorization failure</p>
          </div>

          <div>
            <label className="block text-[13px] text-text-muted mb-1.5">Issue description</label>
            <textarea value={form.description} onChange={(e) => updateForm('description', e.target.value)}
              rows={4} placeholder="Describe the authorization error you encountered…"
              className="w-full px-3 py-2.5 border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent/30 resize-none placeholder:text-text-muted" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] text-text-muted mb-1.5">Screenshot (optional)</label>
              <label className="flex items-center justify-center gap-2 px-4 py-2.5 border border-dashed border-border rounded-lg cursor-pointer hover:bg-surface transition-colors">
                <Image className="w-4 h-4 text-text-muted" />
                <span className="text-sm text-text-muted">{form.screenshot ? form.screenshot.name : 'Upload screenshot'}</span>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => updateForm('screenshot', e.target.files?.[0] || null)} />
              </label>
            </div>
            <div>
              <label className="block text-[13px] text-text-muted mb-1.5">Priority</label>
              <select value={form.priority} onChange={(e) => updateForm('priority', e.target.value)}
                className="w-full px-3 py-2.5 border border-border rounded-lg text-sm text-text-primary bg-card focus:outline-none focus:ring-1 focus:ring-accent/30">
                {['Low', 'Medium', 'High', 'Critical'].map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-1">
            {/* Single primary action */}
            <button onClick={handleStep1Submit}
              className="inline-flex items-center gap-2 px-5 py-2 bg-accent hover:bg-accent/90 text-white font-medium rounded-lg transition-colors text-sm">
              Analyze with AI <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2 */}
      {currentStep === 1 && (
        <div className="bg-card rounded-[12px] border border-border p-5 space-y-4">
          <h2 className="text-[15px] font-medium text-text-secondary flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent" /> AI analysis
          </h2>

          {analyzing ? (
            <LoadingSpinner text="AI is analyzing your authorization failure…" />
          ) : aiResult ? (
            <>
              <div className="bg-surface rounded-[12px] p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: 'Auth object', value: aiResult.object, mono: true },
                    { label: 'Field', value: aiResult.field, mono: true },
                    { label: 'Missing value', value: aiResult.missingValue, mono: true },
                    { label: 'Risk assessment', value: null, badge: true },
                  ].map((item) => (
                    <div key={item.label}>
                      <p className="text-[12px] text-text-muted">{item.label}</p>
                      {item.badge ? (
                        <div className="mt-1"><RiskBadge level={aiResult.risk} /></div>
                      ) : (
                        <p className={`text-sm text-text-primary mt-0.5 ${item.mono ? 'font-mono' : ''}`}>{item.value}</p>
                      )}
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-3">
                  <p className="text-[12px] text-text-muted">Business meaning</p>
                  <p className="text-sm text-text-secondary mt-0.5">{aiResult.businessMeaning}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-border pt-3">
                  <div>
                    <p className="text-[12px] text-text-muted">Recommended role</p>
                    <p className="text-sm font-mono text-accent mt-0.5">{aiResult.recommendedRole}</p>
                  </div>
                  <div>
                    <p className="text-[12px] text-text-muted">Should grant?</p>
                    <span className={`text-sm font-medium ${
                      aiResult.shouldGrant === 'Yes' ? 'text-success-text' :
                      aiResult.shouldGrant === 'No' ? 'text-danger-text' : 'text-warning-text'
                    }`}>{aiResult.shouldGrant}</span>
                  </div>
                </div>

                <div className="border-t border-border pt-3">
                  <p className="text-[12px] text-text-muted">Audit remarks</p>
                  <p className="text-sm text-text-secondary mt-0.5">{aiResult.remarks}</p>
                </div>
              </div>

              <div className="flex items-start gap-2 px-3 py-2.5 bg-accent-bg rounded-lg border-l-[3px] border-l-accent">
                <AlertCircle className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                <p className="text-[13px] text-accent">This is an AI recommendation. Final decision requires manager and SAP Admin approval.</p>
              </div>

              <div className="flex justify-between pt-1">
                <button onClick={() => setCurrentStep(0)}
                  className="inline-flex items-center gap-2 px-4 py-2 text-text-secondary hover:bg-surface rounded-lg border border-border text-sm transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button onClick={() => setCurrentStep(2)}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-accent hover:bg-accent/90 text-white font-medium rounded-lg transition-colors text-sm">
                  Proceed to submit <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : null}
        </div>
      )}

      {/* Step 3 */}
      {currentStep === 2 && (
        <div className="bg-card rounded-[12px] border border-border p-5 space-y-4">
          <h2 className="text-[15px] font-medium text-text-secondary">Confirm & submit</h2>

          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              { label: 'Employee', value: `${form.fullName} (${form.employeeId})` },
              { label: 'Department', value: form.department },
              { label: 'T-Code', value: form.tcode, mono: true },
              { label: 'SAP system', value: form.sapSystem, mono: true },
              { label: 'Priority', value: form.priority },
              { label: 'AI risk', badge: true },
            ].map((item) => (
              <div key={item.label} className="bg-surface rounded-lg p-3">
                <p className="text-[12px] text-text-muted">{item.label}</p>
                {item.badge ? <div className="mt-0.5"><RiskBadge level={aiResult?.risk || 'LOW'} /></div> :
                 <p className={`font-medium text-text-primary mt-0.5 ${item.mono ? 'font-mono text-[13px]' : ''}`}>{item.value}</p>}
              </div>
            ))}
          </div>
          <div className="bg-surface rounded-lg p-3">
            <p className="text-[12px] text-text-muted">AI recommended role</p>
            <p className="font-mono text-[13px] text-accent mt-0.5">{aiResult?.recommendedRole}</p>
          </div>

          <div className="flex justify-between pt-1">
            <button onClick={() => setCurrentStep(1)}
              className="inline-flex items-center gap-2 px-4 py-2 text-text-secondary hover:bg-surface rounded-lg border border-border text-sm transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button onClick={handleFinalSubmit}
              className="inline-flex items-center gap-2 px-5 py-2 bg-accent hover:bg-accent/90 text-white font-medium rounded-lg transition-colors text-sm">
              <Send className="w-4 h-4" /> Submit for approval
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
