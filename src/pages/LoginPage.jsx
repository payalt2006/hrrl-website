import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, LogIn, Building2 } from 'lucide-react';
import HRRLLogo from '../components/HRRLLogo';

export default function LoginPage() {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('employee');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const roles = [
    { value: 'employee', label: 'Employee', desc: 'Raise & track requests' },
    { value: 'manager', label: 'Manager', desc: 'Approve requests' },
    { value: 'sap_admin', label: 'SAP Admin', desc: 'Full system access' },
    { value: 'auditor', label: 'Auditor', desc: 'Audit & compliance' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(employeeId || 'DEMO', password || 'demo123', role);
      navigate('/dashboard');
    } catch {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-[400px]">
        {/* Logo */}
        <div className="text-center mb-8 flex flex-col items-center">
          <HRRLLogo size={72} />
          <p className="text-text-secondary text-sm mt-4">SAP Authorization Self-Service Portal</p>
        </div>

        {/* Card */}
        <div className="bg-card rounded-[12px] border border-border p-6">
          <h2 className="text-[15px] font-medium text-text-primary mb-5">Sign in</h2>

          {error && (
            <div className="mb-4 px-3 py-2.5 rounded-lg bg-danger-bg border-l-[3px] border-l-danger text-danger-text text-[13px]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[13px] text-text-muted mb-1.5">Employee ID</label>
              <input
                type="text"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                placeholder="e.g. EMP001"
                className="w-full px-3 py-2.5 bg-card border border-border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent/30 focus:border-accent/30 transition-all"
              />
            </div>

            <div>
              <label className="block text-[13px] text-text-muted mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full px-3 py-2.5 bg-card border border-border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent/30 focus:border-accent/30 transition-all pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Role selector */}
            <div>
              <label className="block text-[13px] text-text-muted mb-2">Demo role</label>
              <div className="grid grid-cols-2 gap-2">
                {roles.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    className={`px-3 py-2 rounded-lg border text-left transition-all text-[13px] ${
                      role === r.value
                        ? 'bg-accent-bg border-accent/20 text-accent'
                        : 'bg-card border-border text-text-secondary hover:bg-surface'
                    }`}
                  >
                    <span className="font-medium block text-[13px]">{r.label}</span>
                    <span className="text-[11px] text-text-muted">{r.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Primary action — the ONE accent button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-accent hover:bg-accent/90 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Sign in
                </>
              )}
            </button>

            {/* Ghost button */}
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full py-2.5 bg-card hover:bg-surface text-text-secondary font-medium rounded-lg border border-border transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <Building2 className="w-4 h-4" />
              Sign in with SSO / Active Directory
            </button>
          </form>
        </div>

        <p className="text-center text-text-muted text-[11px] mt-5">
          © 2026 HPCL Rajasthan Refinery Ltd. All rights reserved.
        </p>
      </div>
    </div>
  );
}
