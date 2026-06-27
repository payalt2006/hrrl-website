import { useNavigate } from 'react-router-dom';
import { ShieldOff, ArrowLeft } from 'lucide-react';

export default function AccessDeniedPage() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-20 h-20 rounded-2xl bg-red-50 flex items-center justify-center mb-6">
        <ShieldOff className="w-10 h-10 text-red-400" />
      </div>
      <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Access Denied</h1>
      <p className="text-sm text-slate-500 max-w-sm mb-6">
        You don't have permission to access this page. Contact your SAP administrator if you believe this is an error.
      </p>
      <button
        onClick={() => navigate('/dashboard')}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1B3A6B] text-white font-semibold rounded-xl text-sm hover:bg-[#15305a] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>
    </div>
  );
}
