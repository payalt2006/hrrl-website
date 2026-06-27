// ═══════════════════════════════════════════════════════════════
// HRRL AI SAP Authorization Portal — Single File MVP
// ═══════════════════════════════════════════════════════════════
import React, { useState, useEffect, useContext, createContext, useReducer, useRef, useCallback, useMemo } from 'react';
import { HashRouter, Routes, Route, Navigate, NavLink, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, ResponsiveContainer, Legend } from 'recharts';
import {
  LayoutDashboard, FilePlus, FileText, Bot, CheckSquare, Shield, BarChart3,
  Settings, Bell, LogOut, Search, ChevronDown, ChevronRight, Menu, X,
  Eye, EyeOff, Mail, Lock, Send, Copy, Upload, Download, AlertTriangle,
  CheckCircle, XCircle, Clock, Info, ArrowRight, Plus, Filter, RefreshCw,
  User, Users, Activity, Loader2, MessageSquare, ExternalLink, ShieldAlert,
  Zap, Play, Square, RotateCcw, FileDown, ChevronLeft, Globe, Key
} from 'lucide-react';

// ─── Constants ───────────────────────────────────────────────
const C = { navy: '#0F2548', orange: '#E8632A', surface: '#F1F5F9', card: '#FFFFFF', border: '#E2E8F0', text: '#0F172A', muted: '#64748B', success: '#16A34A', successBg: '#DCFCE7', warning: '#D97706', warningBg: '#FEF3C7', danger: '#DC2626', dangerBg: '#FEE2E2', info: '#1D4ED8', infoBg: '#EFF6FF' };

const SEED_REQUESTS = [
  { id:"REQ-001",empId:"EMP-1042",name:"Anil Verma",dept:"Finance",system:"PRD",tcode:"ME21N",desc:"Need to create purchase orders for Q3 procurement",priority:"Medium",status:"Pending Approval",risk:"LOW",submittedAt:"2026-06-25T09:30:00",aiAnalysis:{object:"M_BEST_BSA",field:"ACTVT",missingValue:"01",businessMeaning:"Create Purchase Orders in MM module",recommendedRole:"Z_MM_PURCHASE_CREATE",shouldGrant:"Yes",remarks:"Standard MM access for procurement. Approve."},approvalChain:[{step:"Manager",status:"Approved",by:"Suresh Mgr",at:"2026-06-25T11:00:00"},{step:"SAP Admin",status:"Pending",by:null,at:null}]},
  { id:"REQ-002",empId:"EMP-2087",name:"Priya Singh",dept:"IT",system:"PRD",tcode:"SU01",desc:"Need to manage user accounts for onboarding",priority:"High",status:"Rejected",risk:"HIGH",submittedAt:"2026-06-24T14:15:00",aiAnalysis:{object:"S_USER_GRP",field:"ACTVT",missingValue:"02",businessMeaning:"User Master Maintenance - HIGH RISK sensitive T-Code",recommendedRole:"SAP_BASIS_ADMIN",shouldGrant:"No",remarks:"SU01 is a HIGH RISK T-Code. Only SAP Basis admins should have this. Reject."},approvalChain:[{step:"Manager",status:"Rejected",by:"Kavita Mgr",at:"2026-06-24T16:00:00"}]},
  { id:"REQ-003",empId:"EMP-3310",name:"Ravi Mehta",dept:"Stores",system:"QAS",tcode:"MIGO",desc:"Goods receipt for raw material inward",priority:"Low",status:"Approved",risk:"LOW",submittedAt:"2026-06-23T10:00:00",aiAnalysis:{object:"M_MSEG_BWA",field:"BWART",missingValue:"101",businessMeaning:"Goods Receipt against Purchase Order",recommendedRole:"Z_MM_GOODS_RECEIPT",shouldGrant:"Yes",remarks:"Routine warehouse access. Safe to approve."},approvalChain:[{step:"Manager",status:"Approved",by:"Mahesh Mgr",at:"2026-06-23T12:00:00"},{step:"SAP Admin",status:"Approved",by:"Admin Portal",at:"2026-06-23T14:00:00"}]},
  { id:"REQ-004",empId:"EMP-1042",name:"Anil Verma",dept:"Finance",system:"PRD",tcode:"FB60",desc:"Post vendor invoices for accounts payable",priority:"Medium",status:"Open",risk:"MEDIUM",submittedAt:"2026-06-27T08:00:00",aiAnalysis:null,approvalChain:[]},
  { id:"REQ-005",empId:"EMP-4421",name:"Neha Joshi",dept:"Finance",system:"PRD",tcode:"F110",desc:"Run automatic payment program",priority:"Critical",status:"Pending Approval",risk:"HIGH",submittedAt:"2026-06-26T16:30:00",aiAnalysis:{object:"F_BKPF_BUK",field:"ACTVT",missingValue:"02",businessMeaning:"Automatic Payment Run - financial impact",recommendedRole:"Z_FI_PAYMENT_RUN",shouldGrant:"Conditional",remarks:"F110 combined with FB60 creates SoD conflict. Review carefully before granting."},approvalChain:[{step:"Manager",status:"Pending",by:null,at:null}]},
];

const SEED_NOTIFICATIONS = [
  { id:"N1",type:"success",title:"REQ-003 Approved",message:"Your MIGO request has been approved",read:false,at:"2026-06-23T14:00:00",link:"/my-requests" },
  { id:"N2",type:"danger",title:"REQ-002 Rejected",message:"SU01 request rejected — High Risk T-Code",read:false,at:"2026-06-24T16:00:00",link:"/my-requests" },
  { id:"N3",type:"warning",title:"SoD Alert Detected",message:"Conflict: FB60 + F110 assigned to same user",read:false,at:"2026-06-26T17:00:00",link:"/audit" },
  { id:"N4",type:"info",title:"Pending Approval",message:"REQ-001 awaiting your approval",read:true,at:"2026-06-25T11:00:00",link:"/approvals" },
];

const SOD_RULES = [
  { tcodes:["FB60","F110"], risk:"HIGH", rule:"Vendor invoice + Payment run conflict" },
  { tcodes:["SU01","PFCG"], risk:"HIGH", rule:"User create + Role assign conflict" },
  { tcodes:["ME21N","MIRO"], risk:"MEDIUM", rule:"PO create + Invoice verify conflict" },
];

const DEPARTMENTS = ["Finance","HR","Procurement","Operations","IT","Stores"];
const SYSTEMS = ["DEV","QAS","PRD"];

const NAV_ITEMS = [
  { section:"MAIN", items:[
    { path:"/dashboard", label:"Dashboard", icon:LayoutDashboard, roles:["Employee","Manager","SAP Admin","Auditor"] },
    { path:"/raise-request", label:"Raise Request", icon:FilePlus, roles:["Employee","Manager"] },
    { path:"/my-requests", label:"My Requests", icon:FileText, roles:["Employee","Manager","SAP Admin","Auditor"] },
    { path:"/ai-assistant", label:"AI Assistant", icon:Bot, roles:["Employee","Manager","SAP Admin","Auditor"] },
  ]},
  { section:"MANAGEMENT", items:[
    { path:"/approvals", label:"Approvals", icon:CheckSquare, roles:["Manager","SAP Admin"], badge:true },
    { path:"/audit", label:"Audit & Compliance", icon:Shield, roles:["SAP Admin","Auditor"] },
    { path:"/reports", label:"Reports", icon:BarChart3, roles:["SAP Admin","Auditor"] },
  ]},
  { section:"SYSTEM", items:[
    { path:"/admin", label:"Admin Panel", icon:Settings, roles:["SAP Admin"] },
  ]},
];

const DEFAULT_AI_PROMPT = `You are an expert SAP Security and Authorization Consultant with 20+ years experience in SAP Basis, Security, GRC, and Audit working for HPCL HRRL. Answer questions about SAP authorization, T-Codes, roles, SU53 errors, SoD conflicts, and best practices. Be concise, specific, and practical. When mentioning T-Codes, wrap them in backticks. Format your response with clear sections when needed.`;

const ANALYSIS_PROMPT = `You are an expert SAP Security and Authorization Consultant with 20+ years experience in SAP Basis, Security, GRC, and Audit working for HPCL HRRL. Analyze the SAP authorization failure and respond ONLY with a valid JSON object (no markdown, no backticks, no explanation) in exactly this format: {"object":"SAP authorization object name","field":"Authorization field","missingValue":"Missing value","businessMeaning":"Plain English explanation of what this access allows","risk":"HIGH or MEDIUM or LOW","recommendedRole":"Suggested SAP role name","shouldGrant":"Yes or No or Conditional","approver":"Who should approve (Manager / SAP Admin / Security Team)","remarks":"1-2 sentence audit remark explaining the decision"} Use your SAP knowledge to fill all fields accurately. HIGH risk: SE38, SU01, PFCG, SE80, SE16N, SM37, SM59, SPRO, F110, SCC4. MEDIUM risk: FB60, MIRO, VA01, VF01, ME21N (PRD system), SM30. LOW risk: ME21N (DEV/QAS), MIGO, MB51, ME23N, FBL1N, FB03.`;

// ─── Storage Helper ──────────────────────────────────────────
const storage = {
  get: async (key) => { try { if (window.storage?.get) { return await window.storage.get(key); } const v = localStorage.getItem(key); return v ? { value: v } : null; } catch { return null; } },
  set: async (key, value) => { try { if (window.storage?.set) { await window.storage.set(key, value); return; } localStorage.setItem(key, value); } catch(e) { console.error(e); } },
  remove: async (key) => { try { if (window.storage?.remove) { await window.storage.remove(key); return; } localStorage.removeItem(key); } catch(e) { console.error(e); } },
};

// ─── Utilities ───────────────────────────────────────────────
const timeAgo = (iso) => {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'Just now';
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hr ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d} day${d>1?'s':''} ago`;
  return new Date(iso).toLocaleDateString('en-IN', { day:'numeric', month:'short' });
};

const fmtDate = (iso) => iso ? new Date(iso).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }) : '—';
const fmtDateTime = (iso) => iso ? new Date(iso).toLocaleString('en-IN', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' }) : '—';

const callClaude = async (systemPrompt, messages) => {
  const saved = await storage.get('hrrl-claude-key');
  const apiKey = saved?.value;
  if (!apiKey) throw new Error("API_KEY_MISSING");
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 1000, system: systemPrompt, messages }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || "API error");
  return data.content[0].text;
};

const genId = (requests) => {
  const nums = requests.map(r => parseInt(r.id.replace('REQ-',''))).filter(n => !isNaN(n));
  const next = (Math.max(0, ...nums) + 1);
  return `REQ-${String(next).padStart(3,'0')}`;
};

// ─── Auth Context ────────────────────────────────────────────
const AuthContext = createContext();
const useAuth = () => useContext(AuthContext);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const saved = await storage.get('hrrl-session');
      if (saved?.value) { try { setUser(JSON.parse(saved.value)); } catch {} }
      setLoading(false);
    })();
  }, []);

  const login = async (email, password) => {
    if (!email.endsWith('@gmail.com')) throw new Error('Only Gmail accounts (@gmail.com) are authorized to access this portal.');
    if (password.length < 6) throw new Error('Password must be at least 6 characters');
    const prefix = email.split('@')[0].toLowerCase();
    let role = 'Employee';
    if (prefix.includes('admin')) role = 'SAP Admin';
    else if (prefix.includes('audit')) role = 'Auditor';
    else if (prefix.includes('mgr') || prefix.includes('manager')) role = 'Manager';
    const name = prefix.split('.').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    const u = { email, name, role, avatar: name.split(' ').map(w=>w[0]).join('').substring(0,2).toUpperCase() };
    setUser(u);
    await storage.set('hrrl-session', JSON.stringify(u));
    return u;
  };

  const logout = async () => {
    setUser(null);
    await storage.remove('hrrl-session');
  };

  const hasRole = (roles) => user && roles.includes(user.role);
  if (loading) return <div className="flex items-center justify-center h-screen bg-[#F1F5F9]"><Loader2 className="w-8 h-8 text-[#E8632A] animate-spin" /></div>;
  return <AuthContext.Provider value={{ user, login, logout, hasRole }}>{children}</AuthContext.Provider>;
}

// ─── App Context (Reducer) ───────────────────────────────────
const AppContext = createContext();
const useApp = () => useContext(AppContext);

function appReducer(state, action) {
  switch (action.type) {
    case 'INIT': return action.payload;
    case 'ADD_REQUEST': return { ...state, requests: [...state.requests, action.payload] };
    case 'UPDATE_REQUEST': return { ...state, requests: state.requests.map(r => r.id === action.payload.id ? { ...r, ...action.payload.updates } : r) };
    case 'ADD_NOTIFICATION': return { ...state, notifications: [action.payload, ...state.notifications] };
    case 'MARK_NOTIFICATION_READ': return { ...state, notifications: state.notifications.map(n => n.id === action.payload ? { ...n, read: true } : n) };
    case 'MARK_ALL_READ': return { ...state, notifications: state.notifications.map(n => ({ ...n, read: true })) };
    default: return state;
  }
}

function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, { requests: [], notifications: [] });
  const initialized = useRef(false);

  useEffect(() => {
    (async () => {
      const saved = await storage.get('hrrl-app-state');
      if (saved?.value) {
        try { dispatch({ type: 'INIT', payload: JSON.parse(saved.value) }); initialized.current = true; return; } catch {}
      }
      dispatch({ type: 'INIT', payload: { requests: SEED_REQUESTS, notifications: SEED_NOTIFICATIONS } });
      initialized.current = true;
    })();
  }, []);

  useEffect(() => {
    if (initialized.current) { storage.set('hrrl-app-state', JSON.stringify(state)); }
  }, [state]);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

// ─── Toast Context ───────────────────────────────────────────
const ToastContext = createContext();
const useToast = () => useContext(ToastContext);

function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);
  return <ToastContext.Provider value={{ addToast }}>{children}</ToastContext.Provider>;
}

function ToastContainer() {
  // This is placed inside ToastProvider so it can useToast – but we need a different approach.
  // We'll render toasts from within a component inside the provider.
  return null; // Toasts rendered elsewhere
}

// ─── Shared UI Components ────────────────────────────────────
function StatusBadge({ status }) {
  const colors = { 'Open':'bg-[#EFF6FF] text-[#1D4ED8]', 'Pending Approval':'bg-[#FEF3C7] text-[#D97706]', 'Approved':'bg-[#DCFCE7] text-[#16A34A]', 'Rejected':'bg-[#FEE2E2] text-[#DC2626]', 'Closed':'bg-gray-100 text-gray-600', 'Implemented':'bg-purple-100 text-purple-700' };
  return <span className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${colors[status] || 'bg-gray-100 text-gray-600'}`}>{status}</span>;
}

function RiskBadge({ level }) {
  const c = { HIGH:'bg-[#FEE2E2] text-[#DC2626]', MEDIUM:'bg-[#FEF3C7] text-[#D97706]', LOW:'bg-[#DCFCE7] text-[#16A34A]' };
  const icons = { HIGH:'!', MEDIUM:'~', LOW:'✓' };
  return <span className={`px-2 py-0.5 rounded-full text-xs font-semibold inline-flex items-center gap-1 ${c[level]||'bg-gray-100 text-gray-500'}`}><span>{icons[level]||'?'}</span>{level}</span>;
}

function TCodePill({ code }) {
  return <span className="px-2 py-0.5 rounded bg-[#EFF6FF] text-[#0F2548] text-xs font-mono font-semibold">{code}</span>;
}

function SystemBadge({ system }) {
  const c = { PRD:'bg-red-100 text-red-700 border-red-200', QAS:'bg-amber-100 text-amber-700 border-amber-200', DEV:'bg-green-100 text-green-700 border-green-200' };
  return <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${c[system]||'bg-gray-100 text-gray-600 border-gray-200'}`}>{system}</span>;
}

function Modal({ open, onClose, title, children, maxW = 'max-w-lg' }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div className={`relative bg-white rounded-xl shadow-2xl w-full ${maxW} animate-slide-down`} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0]">
          <h3 className="text-lg font-bold text-[#0F172A]">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-[#64748B]" /></button>
        </div>
        <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

function Drawer({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-[440px] bg-white h-full shadow-2xl overflow-y-auto animate-slide-in">
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0]">
          <h3 className="text-lg font-bold text-[#0F172A]">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-[#64748B]" /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function ToastDisplay({ toasts }) {
  return (
    <div className="fixed top-4 right-4 z-[60] space-y-2 pointer-events-none">
      {toasts.map(t => {
        const colors = { success:'border-l-[#16A34A] bg-[#DCFCE7] text-[#166534]', error:'border-l-[#DC2626] bg-[#FEE2E2] text-[#991B1B]', warning:'border-l-[#D97706] bg-[#FEF3C7] text-[#92400E]', info:'border-l-[#1D4ED8] bg-[#EFF6FF] text-[#1E40AF]' };
        const icons = { success:<CheckCircle className="w-4 h-4" />, error:<XCircle className="w-4 h-4" />, warning:<AlertTriangle className="w-4 h-4" />, info:<Info className="w-4 h-4" /> };
        return <div key={t.id} className={`pointer-events-auto flex items-center gap-2 px-4 py-3 rounded-lg border-l-4 shadow-lg text-sm font-medium animate-slide-down ${colors[t.type]||colors.info}`}>{icons[t.type]||icons.info}<span>{t.message}</span></div>;
      })}
    </div>
  );
}

function ApiKeyPrompt({ onSave }) {
  const [key, setKey] = useState('');
  return (
    <div className="p-4 bg-[#FEF3C7] border border-[#D97706] rounded-xl mb-4">
      <div className="flex items-start gap-3">
        <Key className="w-5 h-5 text-[#D97706] shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-[#92400E]">Claude API Key Required</p>
          <p className="text-xs text-[#92400E] mt-1">Enter your Anthropic API key to enable AI features.</p>
          <div className="flex gap-2 mt-2">
            <input type="password" value={key} onChange={e => setKey(e.target.value)} placeholder="sk-ant-..." className="flex-1 px-3 py-1.5 text-sm border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E8632A]/30" />
            <button onClick={() => { if (key.trim()) { storage.set('hrrl-claude-key', key.trim()); onSave(); } }} className="px-4 py-1.5 bg-[#E8632A] text-white text-sm font-medium rounded-lg hover:bg-[#D4561F]">Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AccessDenied() {
  const nav = useNavigate();
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center">
        <ShieldAlert className="w-16 h-16 text-[#DC2626] mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-[#0F172A] mb-2">Access Denied</h2>
        <p className="text-[#64748B] mb-6">You don't have permission to access this page.</p>
        <button onClick={() => nav('/dashboard')} className="px-6 py-2 bg-[#0F2548] text-white rounded-lg font-medium hover:bg-[#1B3A6B]">Back to Dashboard</button>
      </div>
    </div>
  );
}

// ─── Layout Components ───────────────────────────────────────
function Sidebar() {
  const { user, logout } = useAuth();
  const { state } = useApp();
  const nav = useNavigate();
  const loc = useLocation();
  const pendingCount = state.requests.filter(r => r.status === 'Pending Approval').length;

  return (
    <aside className="hidden lg:flex flex-col w-[220px] bg-[#0F2548] text-white h-screen sticky top-0 shrink-0 overflow-y-auto">
      <div className="px-4 py-5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-[#E8632A] rounded-lg flex items-center justify-center">
            <div className="grid grid-cols-2 gap-[2px]"><div className="w-2 h-2 bg-white rounded-sm"/><div className="w-2 h-2 bg-white rounded-sm"/><div className="w-2 h-2 bg-white rounded-sm"/><div className="w-2 h-2 bg-white/40 rounded-sm"/></div>
          </div>
          <div><p className="font-bold text-sm">HRRL Portal</p><p className="text-[10px] text-white/40">SAP Auth Suite</p></div>
        </div>
      </div>
      <nav className="flex-1 py-3 px-2.5 space-y-4">
        {NAV_ITEMS.map(section => {
          const visible = section.items.filter(i => i.roles.includes(user?.role));
          if (!visible.length) return null;
          return (
            <div key={section.section}>
              <p className="px-3 text-[10px] font-bold text-white/30 uppercase tracking-wider mb-1">{section.section}</p>
              {visible.map(item => {
                const active = loc.pathname === item.path;
                return (
                  <NavLink key={item.path} to={item.path} className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] mb-0.5 transition-all relative ${active ? 'bg-[#E8632A]/15 text-white font-medium' : 'text-white/50 hover:text-white/80 hover:bg-white/5'}`}>
                    {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 bg-[#E8632A] rounded-r" />}
                    <item.icon className="w-[18px] h-[18px] shrink-0" />
                    <span className="flex-1">{item.label}</span>
                    {item.badge && pendingCount > 0 && <span className="px-1.5 py-0.5 bg-[#E8632A] text-white text-[10px] font-bold rounded-full min-w-[18px] text-center">{pendingCount}</span>}
                  </NavLink>
                );
              })}
            </div>
          );
        })}
      </nav>
      <div className="px-3 py-3 border-t border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#E8632A] rounded-full flex items-center justify-center text-xs font-bold">{user?.avatar}</div>
          <div className="flex-1 min-w-0"><p className="text-xs font-medium truncate">{user?.name}</p><p className="text-[10px] text-white/40">{user?.role}</p></div>
          <button onClick={() => { logout(); nav('/login'); }} className="p-1.5 hover:bg-white/10 rounded-lg" title="Logout"><LogOut className="w-4 h-4 text-white/50" /></button>
        </div>
      </div>
    </aside>
  );
}

function TopNav({ title, breadcrumb }) {
  const { user, logout } = useAuth();
  const { state } = useApp();
  const nav = useNavigate();
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef(null);
  const unread = state.notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handler = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="h-14 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-4 lg:px-6 sticky top-0 z-20">
      <div className="flex items-center gap-2">
        <div className="lg:hidden w-8 h-8 bg-[#E8632A] rounded-lg flex items-center justify-center mr-2">
          <div className="grid grid-cols-2 gap-[1px]"><div className="w-1.5 h-1.5 bg-white rounded-sm"/><div className="w-1.5 h-1.5 bg-white rounded-sm"/><div className="w-1.5 h-1.5 bg-white rounded-sm"/><div className="w-1.5 h-1.5 bg-white/40 rounded-sm"/></div>
        </div>
        <h1 className="text-lg font-bold text-[#0F172A]">{title}</h1>
        {breadcrumb && <span className="text-[#64748B] text-sm hidden sm:inline">/ {breadcrumb}</span>}
      </div>
      <div className="flex items-center gap-2">
        <SystemBadge system="PRD" />
        <button onClick={() => nav('/notifications')} className="relative p-2 hover:bg-gray-100 rounded-lg">
          <Bell className="w-5 h-5 text-[#64748B]" />
          {unread > 0 && <span className="absolute top-1 right-1 w-4 h-4 bg-[#E8632A] text-white text-[9px] font-bold rounded-full flex items-center justify-center">{unread > 9 ? '9+' : unread}</span>}
        </button>
        <div className="relative" ref={dropRef}>
          <button onClick={() => setDropOpen(!dropOpen)} className="flex items-center gap-2 px-2 py-1 hover:bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-[#E8632A]/10 rounded-full flex items-center justify-center"><span className="text-[#E8632A] text-xs font-bold">{user?.avatar}</span></div>
            <div className="hidden sm:block text-left"><p className="text-sm font-medium text-[#0F172A] leading-tight">{user?.name}</p><p className="text-[10px] text-[#64748B]">{user?.role}</p></div>
            <ChevronDown className="w-3.5 h-3.5 text-[#64748B] hidden sm:block" />
          </button>
          {dropOpen && (
            <div className="absolute right-0 top-11 w-48 bg-white border border-[#E2E8F0] rounded-xl shadow-lg py-1 z-50 animate-fade-in">
              <div className="px-4 py-2 border-b border-[#E2E8F0]"><p className="text-sm font-medium">{user?.name}</p><p className="text-[11px] text-[#64748B]">{user?.email}</p></div>
              <button onClick={() => { setDropOpen(false); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#0F172A] hover:bg-gray-50"><User className="w-4 h-4" />Profile</button>
              <div className="h-px bg-[#E2E8F0]" />
              <button onClick={() => { logout(); nav('/login'); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#DC2626] hover:bg-red-50"><LogOut className="w-4 h-4" />Sign Out</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function MobileNav() {
  const loc = useLocation();
  const items = [
    { path:'/dashboard', icon:LayoutDashboard, label:'Home' },
    { path:'/my-requests', icon:FileText, label:'Requests' },
    { path:'/raise-request', icon:Plus, label:'Raise', special:true },
    { path:'/ai-assistant', icon:Bot, label:'AI' },
    { path:'/notifications', icon:Bell, label:'Alerts' },
  ];
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-14 bg-white border-t border-[#E2E8F0] z-40 flex items-center justify-around px-2">
      {items.map(item => {
        const active = loc.pathname === item.path;
        if (item.special) return (
          <NavLink key={item.path} to={item.path} className="flex flex-col items-center -mt-5">
            <div className="w-12 h-12 bg-[#E8632A] rounded-full flex items-center justify-center shadow-lg border-4 border-[#F1F5F9]"><Plus className="w-6 h-6 text-white" /></div>
            <span className="text-[10px] text-[#E8632A] font-medium mt-0.5">{item.label}</span>
          </NavLink>
        );
        return (
          <NavLink key={item.path} to={item.path} className={`flex flex-col items-center gap-0.5 ${active ? 'text-[#E8632A]' : 'text-[#64748B]'}`}>
            <item.icon className="w-5 h-5" /><span className="text-[10px] font-medium">{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}

function PrivateRoute({ roles }) {
  const { user, hasRole } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !hasRole(roles)) return <AccessDenied />;
  return <Outlet />;
}

function AuthLayout() {
  const { user } = useAuth();
  const loc = useLocation();
  if (!user) return <Navigate to="/login" replace />;
  const pathMap = { '/dashboard':'Dashboard', '/raise-request':'Raise Request', '/my-requests':'My Requests', '/ai-assistant':'AI Assistant', '/approvals':'Approvals', '/audit':'Audit & Compliance', '/reports':'Reports & Analytics', '/admin':'Admin Panel', '/notifications':'Notifications' };
  const title = pathMap[loc.pathname] || 'Dashboard';
  return (
    <div className="flex min-h-screen bg-[#F1F5F9]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopNav title={title} breadcrumb="HPCL HRRL" />
        <main className="flex-1 p-4 lg:p-6 pb-20 lg:pb-6 overflow-y-auto"><Outlet /></main>
      </div>
      <MobileNav />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PAGE: Login
// ═══════════════════════════════════════════════════════════════
function LoginPage() {
  const { user, login } = useAuth();
  const nav = useNavigate();
  const { addToast } = useToast();
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (user) nav('/dashboard'); }, [user]);

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 800)); // Simulate network
      await login(email, pass);
      addToast('Welcome to HRRL Portal!', 'success');
      nav('/dashboard');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F2548] via-[#1B3A6B] to-[#0F2548] flex items-center justify-center p-4">
      <div className="w-full max-w-[420px]">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#E8632A] rounded-2xl mb-4">
            <div className="grid grid-cols-2 gap-1"><div className="w-3 h-3 bg-white rounded"/><div className="w-3 h-3 bg-white rounded"/><div className="w-3 h-3 bg-white rounded"/><div className="w-3 h-3 bg-white/40 rounded"/></div>
          </div>
          <h1 className="text-2xl font-extrabold text-white">HRRL AI SAP Authorization Portal</h1>
          <p className="text-white/50 text-sm mt-1">HPCL HRRL · Secure Enterprise Access</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-2xl">
          <h2 className="text-lg font-bold text-[#0F172A] mb-5">Sign In</h2>
          {error && <div className="mb-4 px-3 py-2.5 rounded-lg bg-[#FEE2E2] border-l-4 border-[#DC2626] text-[#DC2626] text-sm">{error}</div>}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-[#0F172A] mb-1 block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@gmail.com" className="w-full pl-10 pr-3 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E8632A]/30 focus:border-[#E8632A]" onKeyDown={e => e.key === 'Enter' && handleLogin()} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-[#0F172A] mb-1 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                <input type={showPass ? 'text' : 'password'} value={pass} onChange={e => setPass(e.target.value)} placeholder="Min 6 characters" className="w-full pl-10 pr-10 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E8632A]/30 focus:border-[#E8632A]" onKeyDown={e => e.key === 'Enter' && handleLogin()} />
                <button onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2">{showPass ? <EyeOff className="w-4 h-4 text-[#64748B]" /> : <Eye className="w-4 h-4 text-[#64748B]" />}</button>
              </div>
            </div>
            <button onClick={handleLogin} disabled={loading} className="w-full py-2.5 bg-[#E8632A] text-white font-semibold rounded-lg hover:bg-[#D4561F] disabled:opacity-60 flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Authenticating...</> : 'Sign In'}
            </button>
          </div>
          <p className="text-center text-xs text-[#64748B] mt-4">Only @gmail.com accounts are permitted</p>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PAGE: Dashboard
// ═══════════════════════════════════════════════════════════════
function DashboardPage() {
  const { user } = useAuth();
  const { state } = useApp();
  const nav = useNavigate();
  const reqs = state.requests;

  const openCount = reqs.filter(r => r.status === 'Open').length;
  const pendingCount = reqs.filter(r => r.status === 'Pending Approval').length;
  const approvedCount = reqs.filter(r => r.status === 'Approved').length;
  const highRiskCount = reqs.filter(r => r.risk === 'HIGH').length;

  const kpis = [
    { label:'OPEN REQUESTS', value:openCount, color:'#1D4ED8', bg:'#EFF6FF', tag:'Active', tagColor:'text-[#1D4ED8] bg-[#EFF6FF]' },
    { label:'PENDING APPROVAL', value:pendingCount, color:'#D97706', bg:'#FEF3C7', tag:'Needs action', tagColor:'text-[#D97706] bg-[#FEF3C7]' },
    { label:'APPROVED (TOTAL)', value:approvedCount, color:'#16A34A', bg:'#DCFCE7', tag:`${approvedCount} total`, tagColor:'text-[#16A34A] bg-[#DCFCE7]' },
    { label:'HIGH RISK ALERTS', value:highRiskCount, color:'#DC2626', bg:'#FEE2E2', tag:'Review', tagColor:'text-[#DC2626] bg-[#FEE2E2]' },
  ];

  const riskData = [
    { name:'HIGH', count: reqs.filter(r=>r.risk==='HIGH').length, fill:'#DC2626' },
    { name:'MEDIUM', count: reqs.filter(r=>r.risk==='MEDIUM').length, fill:'#D97706' },
    { name:'LOW', count: reqs.filter(r=>r.risk==='LOW').length, fill:'#16A34A' },
  ];
  const totalRisk = riskData.reduce((s,d)=>s+d.count, 0) || 1;

  const recent = [...reqs].sort((a,b) => new Date(b.submittedAt) - new Date(a.submittedAt)).slice(0, 5);
  const activityItems = reqs.flatMap(r => {
    const items = [{ action:'submitted', tcode:r.tcode, time:r.submittedAt, name:r.name, id:r.id, color:'#1D4ED8' }];
    r.approvalChain.forEach(step => {
      if (step.at && step.status !== 'Pending') items.push({ action:`${step.status.toLowerCase()} by ${step.by}`, tcode:r.tcode, time:step.at, name:r.name, id:r.id, color: step.status==='Approved'?'#16A34A':'#DC2626' });
    });
    return items;
  }).sort((a,b) => new Date(b.time) - new Date(a.time)).slice(0, 5);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A]">{greeting}, {user?.name?.split(' ')[0]}</h2>
          <p className="text-sm text-[#64748B]">{new Date().toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long',year:'numeric'})} · HPCL HRRL · PRD</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(k => (
          <div key={k.label} className="bg-white rounded-xl border border-[#E2E8F0] p-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1" style={{background:k.color}} />
            <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1">{k.label}</p>
            <p className="text-3xl font-extrabold text-[#0F172A]">{k.value}</p>
            <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] font-semibold ${k.tagColor}`}>{k.tag}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-[#E2E8F0]">
          <div className="flex items-center justify-between px-5 py-3 border-b border-[#E2E8F0]">
            <h3 className="font-bold text-[#0F172A]">Recent Requests</h3>
            <button onClick={() => nav('/my-requests')} className="text-sm text-[#E8632A] font-medium hover:underline flex items-center gap-1">View All <ArrowRight className="w-3.5 h-3.5" /></button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-[#E2E8F0]">
                <th className="px-4 py-2 text-left text-[#64748B] font-medium text-xs">T-Code</th>
                <th className="px-4 py-2 text-left text-[#64748B] font-medium text-xs">Name</th>
                <th className="px-4 py-2 text-left text-[#64748B] font-medium text-xs hidden sm:table-cell">Dept</th>
                <th className="px-4 py-2 text-left text-[#64748B] font-medium text-xs">Status</th>
                <th className="px-4 py-2 text-left text-[#64748B] font-medium text-xs">Risk</th>
              </tr></thead>
              <tbody>{recent.map(r => (
                <tr key={r.id} className="border-b border-[#E2E8F0]/50 hover:bg-[#F8FAFC]">
                  <td className="px-4 py-2.5"><TCodePill code={r.tcode} /></td>
                  <td className="px-4 py-2.5 text-[#0F172A] font-medium">{r.name}</td>
                  <td className="px-4 py-2.5 text-[#64748B] hidden sm:table-cell">{r.dept}</td>
                  <td className="px-4 py-2.5"><StatusBadge status={r.status} /></td>
                  <td className="px-4 py-2.5"><RiskBadge level={r.risk} /></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-5">
            <h3 className="font-bold text-[#0F172A] mb-4">Risk Distribution</h3>
            <div className="space-y-3">
              {riskData.map(d => (
                <div key={d.name} className="flex items-center gap-3">
                  <span className="text-xs font-bold w-16" style={{color:d.fill}}>{d.name}</span>
                  <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full rounded-full transition-all" style={{width:`${(d.count/totalRisk)*100}%`, background:d.fill}} /></div>
                  <span className="text-xs font-bold text-[#0F172A] w-8 text-right">{d.count}</span>
                  <span className="text-[10px] text-[#64748B] w-8 text-right">{Math.round((d.count/totalRisk)*100)}%</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-5">
            <h3 className="font-bold text-[#0F172A] mb-4">Activity Feed</h3>
            <div className="space-y-3">
              {activityItems.map((a, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0" style={{background:a.color}} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#0F172A]"><span className="font-medium">{a.id}</span> {a.action}</p>
                    <div className="flex items-center gap-2 mt-0.5"><TCodePill code={a.tcode} /><span className="text-[11px] text-[#64748B]">{timeAgo(a.time)}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <button onClick={() => nav('/raise-request')} className="fixed bottom-20 lg:bottom-6 right-6 w-14 h-14 bg-[#E8632A] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#D4561F] z-30">
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PAGE: Raise Request (3-step wizard)
// ═══════════════════════════════════════════════════════════════
function RaiseRequestPage() {
  const { user } = useAuth();
  const { dispatch } = useApp();
  const { state } = useApp();
  const { addToast } = useToast();
  const nav = useNavigate();
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const [needsKey, setNeedsKey] = useState(false);

  const [form, setForm] = useState({ empId:'', name:'', dept:'Finance', system:'PRD', tcode:'', desc:'', priority:'Medium', screenshot:null });
  const [analysis, setAnalysis] = useState(null);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const validateStep1 = () => {
    const e = {};
    if (!form.empId.trim()) e.empId = 'Required';
    if (!form.name.trim()) e.name = 'Required';
    if (!form.tcode.trim()) e.tcode = 'Required';
    if (form.desc.trim().length < 20) e.desc = 'Min 20 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const goStep2 = async () => {
    if (!validateStep1()) return;
    setStep(2);
    setAiLoading(true);
    setAiError('');
    setNeedsKey(false);
    try {
      const result = await callClaude(ANALYSIS_PROMPT, [
        { role:'user', content:`Analyze this SAP authorization failure:\nT-Code: ${form.tcode}\nSAP System: ${form.system}\nDescription: ${form.desc}\nDepartment: ${form.dept}` }
      ]);
      const parsed = JSON.parse(result);
      setAnalysis(parsed);
    } catch (err) {
      if (err.message === 'API_KEY_MISSING') { setNeedsKey(true); }
      else { setAiError(err.message); }
    } finally {
      setAiLoading(false);
    }
  };

  const submitRequest = () => {
    const id = genId(state.requests);
    const newReq = { id, ...form, status: analysis ? 'Pending Approval' : 'Open', risk: analysis?.risk || 'MEDIUM', submittedAt: new Date().toISOString(), aiAnalysis: analysis, approvalChain: analysis ? [{ step:'Manager', status:'Pending', by:null, at:null }] : [] };
    dispatch({ type:'ADD_REQUEST', payload: newReq });
    dispatch({ type:'ADD_NOTIFICATION', payload: { id: 'N'+Date.now(), type:'info', title:`${id} Submitted`, message:`Your ${form.tcode} request has been submitted`, read:false, at:new Date().toISOString(), link:'/my-requests' } });
    addToast(`Request ${id} submitted!`, 'success');
    nav('/my-requests');
  };

  const steps = ['Request Details', 'AI Analysis', 'Confirm & Submit'];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-center gap-2 mb-6">
        {steps.map((s, i) => (
          <React.Fragment key={s}>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${step > i+1 ? 'bg-[#DCFCE7] text-[#16A34A]' : step === i+1 ? 'bg-[#E8632A] text-white' : 'bg-gray-100 text-[#64748B]'}`}>
              {step > i+1 ? <CheckCircle className="w-3.5 h-3.5" /> : <span>{i+1}</span>}
              <span className="hidden sm:inline">{s}</span>
            </div>
            {i < 2 && <ChevronRight className="w-4 h-4 text-[#64748B]" />}
          </React.Fragment>
        ))}
      </div>

      {step === 1 && (
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-4">
          <h3 className="text-lg font-bold text-[#0F172A] mb-2">Request Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-[#0F172A] mb-1 block">Employee ID *</label>
              <input value={form.empId} onChange={e => set('empId', e.target.value)} placeholder="EMP-XXXX" className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E8632A]/30 ${errors.empId ? 'border-red-400' : 'border-[#E2E8F0]'}`} />
              {errors.empId && <p className="text-xs text-red-500 mt-1">{errors.empId}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-[#0F172A] mb-1 block">Full Name *</label>
              <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Full name" className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E8632A]/30 ${errors.name ? 'border-red-400' : 'border-[#E2E8F0]'}`} />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-[#0F172A] mb-1 block">Department</label>
              <select value={form.dept} onChange={e => set('dept', e.target.value)} className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E8632A]/30">
                {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-[#0F172A] mb-1 block">SAP System</label>
              <div className="flex gap-3 mt-1">{SYSTEMS.map(s => (
                <label key={s} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border cursor-pointer text-sm font-medium ${form.system===s ? 'border-[#E8632A] bg-[#E8632A]/5 text-[#E8632A]' : 'border-[#E2E8F0] text-[#64748B]'}`}>
                  <input type="radio" name="system" checked={form.system===s} onChange={() => set('system', s)} className="hidden" />{s}
                </label>
              ))}</div>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-[#0F172A] mb-1 block">Transaction Code (T-Code) *</label>
            <input value={form.tcode} onChange={e => set('tcode', e.target.value.toUpperCase())} placeholder="e.g. ME21N, FB60, MIGO" className={`w-full px-3 py-2 border rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#E8632A]/30 ${errors.tcode ? 'border-red-400' : 'border-[#E2E8F0]'}`} />
            {errors.tcode && <p className="text-xs text-red-500 mt-1">{errors.tcode}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-[#0F172A] mb-1 block">Issue Description *</label>
            <textarea value={form.desc} onChange={e => set('desc', e.target.value)} rows={3} placeholder="Describe the authorization issue (min 20 chars)..." className={`w-full px-3 py-2 border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#E8632A]/30 ${errors.desc ? 'border-red-400' : 'border-[#E2E8F0]'}`} />
            {errors.desc && <p className="text-xs text-red-500 mt-1">{errors.desc}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-[#0F172A] mb-1 block">Priority</label>
            <div className="flex flex-wrap gap-2">
              {[{v:'Low',e:'🟢'},{v:'Medium',e:'🟡'},{v:'High',e:'🔴'},{v:'Critical',e:'🚨'}].map(p => (
                <label key={p.v} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border cursor-pointer text-sm font-medium ${form.priority===p.v ? 'border-[#E8632A] bg-[#E8632A]/5 text-[#E8632A]' : 'border-[#E2E8F0] text-[#64748B]'}`}>
                  <input type="radio" name="priority" checked={form.priority===p.v} onChange={() => set('priority', p.v)} className="hidden" />{p.e} {p.v}
                </label>
              ))}
            </div>
          </div>
          <button onClick={goStep2} className="w-full py-2.5 bg-[#E8632A] text-white font-semibold rounded-lg hover:bg-[#D4561F] flex items-center justify-center gap-2">Next: Get AI Analysis <ArrowRight className="w-4 h-4" /></button>
        </div>
      )}

      {step === 2 && (
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
          {aiLoading && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Loader2 className="w-10 h-10 text-[#E8632A] animate-spin mb-4" />
              <p className="font-bold text-[#0F172A]">AI is analyzing your authorization failure…</p>
              <p className="text-sm text-[#64748B] mt-1">This may take a few seconds</p>
            </div>
          )}
          {needsKey && !aiLoading && (
            <ApiKeyPrompt onSave={() => { setNeedsKey(false); goStep2(); }} />
          )}
          {aiError && !aiLoading && (
            <div className="text-center py-8">
              <XCircle className="w-10 h-10 text-[#DC2626] mx-auto mb-3" />
              <p className="font-bold text-[#0F172A]">AI Analysis Failed</p>
              <p className="text-sm text-[#64748B] mt-1 mb-4">{aiError}</p>
              <button onClick={goStep2} className="px-4 py-2 bg-[#E8632A] text-white rounded-lg text-sm font-medium"><RefreshCw className="w-4 h-4 inline mr-1" />Retry</button>
            </div>
          )}
          {analysis && !aiLoading && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4"><Bot className="w-5 h-5 text-[#E8632A]" /><h3 className="font-bold text-[#0F172A]">AI Authorization Analysis</h3><span className="text-xs text-[#64748B]">· {fmtDateTime(new Date().toISOString())}</span></div>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-[#F8FAFC] rounded-lg p-3"><p className="text-[10px] font-bold text-[#64748B] uppercase mb-1">Object</p><p className="text-sm font-mono font-bold text-[#0F172A]">{analysis.object}</p></div>
                <div className="bg-[#F8FAFC] rounded-lg p-3"><p className="text-[10px] font-bold text-[#64748B] uppercase mb-1">Field</p><p className="text-sm font-mono font-bold text-[#0F172A]">{analysis.field}</p></div>
                <div className="bg-[#F8FAFC] rounded-lg p-3"><p className="text-[10px] font-bold text-[#64748B] uppercase mb-1">Missing Value</p><p className="text-sm font-mono font-bold text-[#0F172A]">{analysis.missingValue}</p></div>
              </div>
              <div className="bg-[#F8FAFC] rounded-lg p-3"><p className="text-[10px] font-bold text-[#64748B] uppercase mb-1">Business Meaning</p><p className="text-sm text-[#0F172A]">{analysis.businessMeaning}</p></div>
              <div className="flex flex-wrap items-center gap-3">
                <RiskBadge level={analysis.risk} />
                <span className="text-sm text-[#64748B]">Recommended Role:</span><TCodePill code={analysis.recommendedRole} />
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${analysis.shouldGrant==='Yes'?'bg-[#DCFCE7] text-[#16A34A]':analysis.shouldGrant==='No'?'bg-[#FEE2E2] text-[#DC2626]':'bg-[#FEF3C7] text-[#D97706]'}`}>
                  {analysis.shouldGrant==='Yes'?'✓':'✗'} {analysis.shouldGrant}
                </span>
              </div>
              <p className="text-sm text-[#64748B] italic">{analysis.remarks}</p>
              <p className="text-xs text-[#64748B] mt-2">⚠️ AI recommendation only. Requires human approval.</p>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setStep(1)} className="flex-1 py-2 border border-[#0F2548] text-[#0F2548] font-medium rounded-lg hover:bg-gray-50"><ChevronLeft className="w-4 h-4 inline mr-1" />Back</button>
                <button onClick={() => setStep(3)} className="flex-1 py-2 bg-[#E8632A] text-white font-semibold rounded-lg hover:bg-[#D4561F]">Proceed to Submit <ArrowRight className="w-4 h-4 inline ml-1" /></button>
              </div>
            </div>
          )}
          {!analysis && !aiLoading && !aiError && !needsKey && (
            <div className="flex gap-3 pt-4">
              <button onClick={() => setStep(1)} className="flex-1 py-2 border border-[#0F2548] text-[#0F2548] font-medium rounded-lg">Back</button>
              <button onClick={() => { setAnalysis(null); setStep(3); }} className="flex-1 py-2 bg-[#E8632A] text-white font-semibold rounded-lg">Skip AI & Submit</button>
            </div>
          )}
        </div>
      )}

      {step === 3 && (
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-4">
          <h3 className="text-lg font-bold text-[#0F172A]">Confirm & Submit</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[['Employee ID', form.empId],['Name', form.name],['Department', form.dept],['SAP System', form.system],['T-Code', form.tcode],['Priority', form.priority]].map(([l,v]) => (
              <div key={l} className="bg-[#F8FAFC] rounded-lg p-3"><p className="text-[10px] font-bold text-[#64748B] uppercase">{l}</p><p className="font-medium text-[#0F172A] mt-0.5">{v}</p></div>
            ))}
          </div>
          <div className="bg-[#F8FAFC] rounded-lg p-3"><p className="text-[10px] font-bold text-[#64748B] uppercase">Description</p><p className="text-sm text-[#0F172A] mt-1">{form.desc}</p></div>
          {analysis && (
            <div className="border border-[#E2E8F0] rounded-lg p-3">
              <p className="text-xs font-bold text-[#64748B] uppercase mb-2">AI Analysis Summary</p>
              <div className="flex flex-wrap gap-2 text-sm"><RiskBadge level={analysis.risk} /><TCodePill code={analysis.recommendedRole} /><span className="text-[#64748B] italic text-xs">{analysis.remarks}</span></div>
            </div>
          )}
          <div className="flex gap-3">
            <button onClick={() => setStep(2)} className="flex-1 py-2 border border-[#0F2548] text-[#0F2548] font-medium rounded-lg">Back</button>
            <button onClick={submitRequest} className="flex-1 py-2.5 bg-[#E8632A] text-white font-bold rounded-lg hover:bg-[#D4561F]">Confirm and Submit Request</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PAGE: My Requests
// ═══════════════════════════════════════════════════════════════
function MyRequestsPage() {
  const { state } = useApp();
  const nav = useNavigate();
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [drawer, setDrawer] = useState(null);

  const filters = ['All','Open','Pending Approval','Approved','Rejected'];
  const filtered = state.requests.filter(r => {
    if (filter !== 'All' && r.status !== filter) return false;
    if (search) {
      const s = search.toLowerCase();
      if (!r.tcode.toLowerCase().includes(s) && !r.id.toLowerCase().includes(s) && !r.name.toLowerCase().includes(s)) return false;
    }
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <h2 className="text-lg font-bold text-[#0F172A]">My Requests</h2>
        <span className="px-2 py-0.5 rounded-full bg-[#EFF6FF] text-[#1D4ED8] text-xs font-bold">{state.requests.length}</span>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-1 overflow-x-auto">
          {filters.map(f => <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${filter===f ? 'bg-[#E8632A] text-white' : 'bg-white border border-[#E2E8F0] text-[#64748B] hover:bg-gray-50'}`}>{f}</button>)}
        </div>
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search ID, T-Code, name..." className="w-full pl-9 pr-3 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E8632A]/30" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <FileText className="w-16 h-16 text-[#E2E8F0] mb-4" />
          <p className="font-bold text-[#0F172A] text-lg">No requests found</p>
          <p className="text-sm text-[#64748B] mt-1 mb-4">Try adjusting your filters or search</p>
          <button onClick={() => nav('/raise-request')} className="px-4 py-2 bg-[#E8632A] text-white rounded-lg text-sm font-medium">Raise your first request →</button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-[#E2E8F0]">
              <th className="px-4 py-3 text-left text-[#64748B] font-medium text-xs">ID</th>
              <th className="px-4 py-3 text-left text-[#64748B] font-medium text-xs">T-Code</th>
              <th className="px-4 py-3 text-left text-[#64748B] font-medium text-xs hidden md:table-cell">System</th>
              <th className="px-4 py-3 text-left text-[#64748B] font-medium text-xs hidden md:table-cell">Dept</th>
              <th className="px-4 py-3 text-left text-[#64748B] font-medium text-xs hidden sm:table-cell">Submitted</th>
              <th className="px-4 py-3 text-left text-[#64748B] font-medium text-xs">Status</th>
              <th className="px-4 py-3 text-left text-[#64748B] font-medium text-xs">Risk</th>
              <th className="px-4 py-3 text-left text-[#64748B] font-medium text-xs">Action</th>
            </tr></thead>
            <tbody>{filtered.map(r => (
              <tr key={r.id} className="border-b border-[#E2E8F0]/50 hover:bg-[#F8FAFC]">
                <td className="px-4 py-3 font-mono font-bold text-[#0F172A] text-xs">{r.id}</td>
                <td className="px-4 py-3"><TCodePill code={r.tcode} /></td>
                <td className="px-4 py-3 hidden md:table-cell"><SystemBadge system={r.system} /></td>
                <td className="px-4 py-3 text-[#64748B] hidden md:table-cell">{r.dept}</td>
                <td className="px-4 py-3 text-[#64748B] text-xs hidden sm:table-cell">{fmtDate(r.submittedAt)}</td>
                <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                <td className="px-4 py-3"><RiskBadge level={r.risk} /></td>
                <td className="px-4 py-3"><button onClick={() => setDrawer(r)} className="text-[#E8632A] text-xs font-medium hover:underline">View</button></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}

      <Drawer open={!!drawer} onClose={() => setDrawer(null)} title={drawer ? `${drawer.id} Details` : ''}>
        {drawer && <RequestDetail req={drawer} />}
      </Drawer>
    </div>
  );
}

function RequestDetail({ req }) {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 flex-wrap"><StatusBadge status={req.status} /><RiskBadge level={req.risk} /><SystemBadge system={req.system} /></div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        {[['Employee ID', req.empId],['Name', req.name],['Department', req.dept],['T-Code', req.tcode],['Priority', req.priority],['Submitted', fmtDateTime(req.submittedAt)]].map(([l,v]) => (
          <div key={l}><p className="text-[10px] font-bold text-[#64748B] uppercase">{l}</p><p className="font-medium text-[#0F172A] mt-0.5">{v}</p></div>
        ))}
      </div>
      <div><p className="text-[10px] font-bold text-[#64748B] uppercase">Description</p><p className="text-sm text-[#0F172A] mt-1">{req.desc}</p></div>

      {req.aiAnalysis && (
        <div className="bg-[#F8FAFC] rounded-lg p-4 space-y-2">
          <p className="text-xs font-bold text-[#64748B] uppercase flex items-center gap-1"><Bot className="w-3.5 h-3.5" />AI Analysis</p>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div><span className="text-[#64748B]">Object:</span><br/><span className="font-mono font-bold">{req.aiAnalysis.object}</span></div>
            <div><span className="text-[#64748B]">Field:</span><br/><span className="font-mono font-bold">{req.aiAnalysis.field}</span></div>
            <div><span className="text-[#64748B]">Missing:</span><br/><span className="font-mono font-bold">{req.aiAnalysis.missingValue}</span></div>
          </div>
          <p className="text-sm text-[#0F172A]">{req.aiAnalysis.businessMeaning}</p>
          <div className="flex items-center gap-2 flex-wrap"><RiskBadge level={req.aiAnalysis.risk || req.risk} /><TCodePill code={req.aiAnalysis.recommendedRole} /></div>
          <p className="text-xs text-[#64748B] italic">{req.aiAnalysis.remarks}</p>
        </div>
      )}

      <div>
        <p className="text-xs font-bold text-[#64748B] uppercase mb-3">Approval Timeline</p>
        <div className="space-y-3">
          <div className="flex items-center gap-3"><div className="w-7 h-7 rounded-full bg-[#DCFCE7] flex items-center justify-center"><CheckCircle className="w-4 h-4 text-[#16A34A]" /></div><div><p className="text-sm font-medium">Submitted</p><p className="text-xs text-[#64748B]">{req.name} · {fmtDateTime(req.submittedAt)}</p></div></div>
          {req.approvalChain.map((step, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center ${step.status==='Approved'?'bg-[#DCFCE7]':step.status==='Rejected'?'bg-[#FEE2E2]':'bg-gray-100 border-2 border-dashed border-[#E2E8F0]'}`}>
                {step.status==='Approved'?<CheckCircle className="w-4 h-4 text-[#16A34A]" />:step.status==='Rejected'?<XCircle className="w-4 h-4 text-[#DC2626]" />:<Clock className="w-4 h-4 text-[#64748B]" />}
              </div>
              <div><p className="text-sm font-medium">{step.step} — {step.status}</p><p className="text-xs text-[#64748B]">{step.by || 'Awaiting'} · {step.at ? fmtDateTime(step.at) : 'Pending'}</p></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PAGE: AI Assistant (Chat)
// ═══════════════════════════════════════════════════════════════
function AIAssistantPage() {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [needsKey, setNeedsKey] = useState(false);
  const messagesEnd = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => messagesEnd.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(scrollToBottom, [activeChat, chats]);

  const currentMessages = activeChat !== null ? (chats[activeChat]?.messages || []) : [];

  const newChat = () => {
    setChats(prev => [...prev, { id: Date.now(), messages: [] }]);
    setActiveChat(chats.length);
  };

  const sendMessage = async (text) => {
    if (!text.trim() || isTyping) return;
    const msg = text.trim();
    setInput('');

    if (activeChat === null) {
      const newChats = [...chats, { id: Date.now(), messages: [{ role:'user', content:msg }] }];
      setChats(newChats);
      setActiveChat(newChats.length - 1);
    } else {
      setChats(prev => prev.map((c, i) => i === activeChat ? { ...c, messages: [...c.messages, { role:'user', content:msg }] } : c));
    }

    setIsTyping(true);
    setNeedsKey(false);
    try {
      const chatIdx = activeChat !== null ? activeChat : chats.length;
      const prevMsgs = activeChat !== null ? chats[activeChat].messages : [];
      const apiMessages = [...prevMsgs, { role:'user', content:msg }].map(m => ({ role: m.role === 'ai' ? 'assistant' : m.role, content: m.content }));

      const savedPrompt = await storage.get('hrrl-ai-prompt');
      const systemPrompt = savedPrompt?.value || DEFAULT_AI_PROMPT;

      const reply = await callClaude(systemPrompt, apiMessages);
      setChats(prev => prev.map((c, i) => i === chatIdx ? { ...c, messages: [...c.messages, { role:'ai', content: reply, time: new Date().toISOString() }] } : c));
    } catch (err) {
      if (err.message === 'API_KEY_MISSING') { setNeedsKey(true); }
      else {
        const chatIdx = activeChat !== null ? activeChat : chats.length;
        setChats(prev => prev.map((c, i) => i === chatIdx ? { ...c, messages: [...c.messages, { role:'ai', content: `❌ Error: ${err.message}. Please try again.`, time: new Date().toISOString() }] } : c));
      }
    } finally {
      setIsTyping(false);
    }
  };

  const copyToClipboard = (text) => { navigator.clipboard.writeText(text); };

  const suggestedPrompts = [
    "Explain SU53 authorization failure",
    "What role covers ME21N in PRD?",
    "Is SE16N high risk access?",
    "Check SoD conflict for FB60 + F110",
  ];

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
      {/* Chat History Sidebar */}
      <div className="hidden md:flex flex-col w-[260px] border-r border-[#E2E8F0] bg-[#F8FAFC]">
        <div className="p-3 border-b border-[#E2E8F0]">
          <button onClick={newChat} className="w-full py-2 bg-[#E8632A] text-white text-sm font-medium rounded-lg hover:bg-[#D4561F] flex items-center justify-center gap-2"><Plus className="w-4 h-4" />New Chat</button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {chats.map((c, i) => (
            <button key={c.id} onClick={() => setActiveChat(i)} className={`w-full text-left px-3 py-2 rounded-lg text-sm truncate ${activeChat===i ? 'bg-[#E8632A]/10 text-[#E8632A] font-medium' : 'text-[#64748B] hover:bg-white'}`}>
              <MessageSquare className="w-3.5 h-3.5 inline mr-1.5" />
              {c.messages[0]?.content?.substring(0, 40) || 'New conversation'}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="px-4 py-3 border-b border-[#E2E8F0] flex items-center justify-between">
          <div className="flex items-center gap-2"><Bot className="w-5 h-5 text-[#E8632A]" /><span className="font-bold text-[#0F172A]">HRRL SAP AI Assistant</span></div>
          <span className="text-[10px] px-2 py-0.5 bg-[#F1F5F9] text-[#64748B] rounded-full font-medium">Powered by Claude</span>
        </div>

        {needsKey && <ApiKeyPrompt onSave={() => setNeedsKey(false)} />}

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {currentMessages.length === 0 && !isTyping && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 bg-[#E8632A]/10 rounded-2xl flex items-center justify-center mb-4"><Bot className="w-8 h-8 text-[#E8632A]" /></div>
              <p className="font-bold text-[#0F172A] text-lg">Ask me anything about SAP Authorization</p>
              <p className="text-sm text-[#64748B] mt-1 mb-6">I can help with T-Codes, roles, SU53 errors, SoD conflicts, and more</p>
              <div className="flex flex-wrap gap-2 justify-center max-w-md">
                {suggestedPrompts.map(p => (
                  <button key={p} onClick={() => sendMessage(p)} className="px-3 py-1.5 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#64748B] hover:border-[#E8632A] hover:text-[#E8632A]">{p}</button>
                ))}
              </div>
            </div>
          )}

          {currentMessages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role==='user' ? 'justify-end' : 'justify-start'}`}>
              {m.role === 'ai' && <div className="w-8 h-8 rounded-full bg-[#0F2548] flex items-center justify-center shrink-0"><Bot className="w-4 h-4 text-white" /></div>}
              <div className={`max-w-[75%] rounded-xl px-4 py-3 ${m.role==='user' ? 'bg-[#0F2548] text-white' : 'bg-[#F8FAFC] border border-[#E2E8F0]'}`}>
                <p className="text-sm whitespace-pre-wrap">{m.content}</p>
                {m.role === 'ai' && (
                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[#E2E8F0]">
                    <button onClick={() => copyToClipboard(m.content)} className="text-[10px] text-[#64748B] hover:text-[#0F172A] flex items-center gap-1"><Copy className="w-3 h-3" />Copy</button>
                    {m.time && <span className="text-[10px] text-[#64748B]">{timeAgo(m.time)}</span>}
                  </div>
                )}
              </div>
              {m.role === 'user' && <div className="w-8 h-8 rounded-full bg-[#E8632A] flex items-center justify-center shrink-0"><span className="text-white text-xs font-bold">{user?.avatar}</span></div>}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-[#0F2548] flex items-center justify-center shrink-0"><Bot className="w-4 h-4 text-white" /></div>
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-3 flex items-center gap-1.5">
                <div className="w-2 h-2 bg-[#64748B] rounded-full typing-dot" />
                <div className="w-2 h-2 bg-[#64748B] rounded-full typing-dot" />
                <div className="w-2 h-2 bg-[#64748B] rounded-full typing-dot" />
              </div>
            </div>
          )}
          <div ref={messagesEnd} />
        </div>

        <div className="p-3 border-t border-[#E2E8F0]">
          <div className="flex items-end gap-2">
            <textarea ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }} rows={1} placeholder="Ask about SAP authorization..." className="flex-1 px-4 py-2.5 border border-[#E2E8F0] rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#E8632A]/30 max-h-24 overflow-y-auto" disabled={isTyping} />
            <button onClick={() => sendMessage(input)} disabled={isTyping || !input.trim()} className="p-2.5 bg-[#E8632A] text-white rounded-lg hover:bg-[#D4561F] disabled:opacity-40"><Send className="w-4 h-4" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PAGE: Approvals
// ═══════════════════════════════════════════════════════════════
function ApprovalsPage() {
  const { user } = useAuth();
  const { state, dispatch } = useApp();
  const { addToast } = useToast();
  const [tab, setTab] = useState('pending');
  const [modal, setModal] = useState(null); // { req, action }
  const [comment, setComment] = useState('');
  const [drawer, setDrawer] = useState(null);

  const pendingForMe = state.requests.filter(r => {
    if (r.status !== 'Pending Approval') return false;
    if (user.role === 'Manager') return r.approvalChain.some(s => s.step === 'Manager' && s.status === 'Pending');
    if (user.role === 'SAP Admin') return r.approvalChain.some(s => s.step === 'SAP Admin' && s.status === 'Pending') && r.approvalChain.some(s => s.step === 'Manager' && s.status === 'Approved');
    return false;
  });

  const recentlyDecided = state.requests.filter(r => {
    return r.approvalChain.some(s => s.by && s.at && (Date.now() - new Date(s.at).getTime()) < 7 * 86400000 && s.status !== 'Pending');
  });

  const handleAction = (action) => {
    if (!comment.trim() && action === 'Reject') return;
    const req = modal.req;
    const now = new Date().toISOString();
    let updatedChain = req.approvalChain.map(s => {
      if (s.status === 'Pending') {
        if ((user.role === 'Manager' && s.step === 'Manager') || (user.role === 'SAP Admin' && s.step === 'SAP Admin')) {
          return { ...s, status: action === 'Approve' ? 'Approved' : 'Rejected', by: user.name, at: now };
        }
      }
      return s;
    });

    let newStatus = req.status;
    if (action === 'Reject') {
      newStatus = 'Rejected';
    } else {
      const allApproved = updatedChain.every(s => s.status === 'Approved');
      if (allApproved) newStatus = 'Approved';
      else {
        const nextPending = updatedChain.find(s => s.status === 'Pending');
        if (!nextPending && user.role === 'Manager') {
          updatedChain = [...updatedChain, { step: 'SAP Admin', status: 'Pending', by: null, at: null }];
        }
      }
    }

    dispatch({ type: 'UPDATE_REQUEST', payload: { id: req.id, updates: { status: newStatus, approvalChain: updatedChain } } });
    dispatch({ type: 'ADD_NOTIFICATION', payload: { id: 'N' + Date.now(), type: action === 'Approve' ? 'success' : 'danger', title: `${req.id} ${action === 'Approve' ? 'Approved' : 'Rejected'}`, message: `${req.tcode} request ${action === 'Approve' ? 'approved' : 'rejected'} by ${user.name}${comment ? ': ' + comment : ''}`, read: false, at: now, link: '/my-requests' } });
    addToast(`${req.id} ${action === 'Approve' ? 'approved' : 'rejected'}`, action === 'Approve' ? 'success' : 'error');
    setModal(null);
    setComment('');
  };

  const renderReqCard = (r) => (
    <div key={r.id} className="bg-white rounded-xl border border-[#E2E8F0] p-4 flex flex-col sm:flex-row gap-4">
      <div className="flex items-center gap-3 sm:w-36 shrink-0">
        <div className="w-10 h-10 rounded-full bg-[#F1F5F9] flex items-center justify-center text-sm font-bold text-[#0F2548]">{r.name.split(' ').map(w=>w[0]).join('')}</div>
        <div><p className="font-medium text-sm text-[#0F172A]">{r.name}</p><p className="text-[10px] text-[#64748B]">{r.dept} · {r.empId}</p></div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1"><TCodePill code={r.tcode} /><SystemBadge system={r.system} /><RiskBadge level={r.risk} /></div>
        <p className="text-sm text-[#0F172A] line-clamp-2">{r.desc}</p>
        {r.aiAnalysis && <p className="text-xs text-[#64748B] mt-1">AI says: <span className={`font-bold ${r.aiAnalysis.shouldGrant==='Yes'?'text-[#16A34A]':r.aiAnalysis.shouldGrant==='No'?'text-[#DC2626]':'text-[#D97706]'}`}>{r.aiAnalysis.shouldGrant}</span> — {r.aiAnalysis.remarks}</p>}
      </div>
      <div className="flex sm:flex-col gap-2 shrink-0">
        <button onClick={() => setModal({ req: r, action: 'Approve' })} className="px-3 py-1.5 bg-[#DCFCE7] text-[#16A34A] text-xs font-bold rounded-lg hover:bg-[#BBF7D0] flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" />Approve</button>
        <button onClick={() => setModal({ req: r, action: 'Reject' })} className="px-3 py-1.5 bg-[#FEE2E2] text-[#DC2626] text-xs font-bold rounded-lg hover:bg-[#FECACA] flex items-center gap-1"><XCircle className="w-3.5 h-3.5" />Reject</button>
        <button onClick={() => setDrawer(r)} className="px-3 py-1.5 bg-[#F1F5F9] text-[#64748B] text-xs font-medium rounded-lg hover:bg-[#E2E8F0] flex items-center gap-1"><Info className="w-3.5 h-3.5" />Info</button>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {[{id:'pending',label:`Pending My Action (${pendingForMe.length})`},{id:'all',label:'All Pending'},{id:'recent',label:'Recently Decided'}].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${tab===t.id?'bg-[#E8632A] text-white':'bg-white border border-[#E2E8F0] text-[#64748B]'}`}>{t.label}</button>
        ))}
      </div>

      <div className="space-y-3">
        {tab === 'pending' && (pendingForMe.length ? pendingForMe.map(renderReqCard) : <p className="text-center text-[#64748B] py-8">No pending approvals for you</p>)}
        {tab === 'all' && (state.requests.filter(r => r.status === 'Pending Approval').length ? state.requests.filter(r => r.status === 'Pending Approval').map(renderReqCard) : <p className="text-center text-[#64748B] py-8">No pending requests</p>)}
        {tab === 'recent' && (
          <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-[#E2E8F0]">
                <th className="px-4 py-3 text-left text-[#64748B] font-medium text-xs">ID</th><th className="px-4 py-3 text-left text-[#64748B] font-medium text-xs">T-Code</th><th className="px-4 py-3 text-left text-[#64748B] font-medium text-xs">Decision</th><th className="px-4 py-3 text-left text-[#64748B] font-medium text-xs">By</th><th className="px-4 py-3 text-left text-[#64748B] font-medium text-xs">When</th>
              </tr></thead>
              <tbody>{recentlyDecided.map(r => {
                const lastStep = [...r.approvalChain].reverse().find(s => s.status !== 'Pending');
                return (
                  <tr key={r.id} className="border-b border-[#E2E8F0]/50">
                    <td className="px-4 py-3 font-mono font-bold text-xs">{r.id}</td>
                    <td className="px-4 py-3"><TCodePill code={r.tcode} /></td>
                    <td className="px-4 py-3"><StatusBadge status={lastStep?.status || r.status} /></td>
                    <td className="px-4 py-3 text-[#64748B]">{lastStep?.by || '—'}</td>
                    <td className="px-4 py-3 text-xs text-[#64748B]">{timeAgo(lastStep?.at)}</td>
                  </tr>
                );
              })}</tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={!!modal} onClose={() => { setModal(null); setComment(''); }} title={modal ? `${modal.action} ${modal.req.id}` : ''}>
        {modal && (
          <div className="space-y-4">
            <div className="flex items-center gap-2"><TCodePill code={modal.req.tcode} /><span className="text-sm">{modal.req.name} — {modal.req.dept}</span></div>
            <div>
              <label className="text-sm font-medium block mb-1">{modal.action === 'Approve' ? 'Approval Notes' : 'Rejection Reason'} {modal.action === 'Reject' && '*'}</label>
              <textarea value={comment} onChange={e => setComment(e.target.value)} rows={3} className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#E8632A]/30" placeholder={modal.action === 'Approve' ? 'Add notes (optional)' : 'Provide reason for rejection (required)'} />
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setModal(null); setComment(''); }} className="flex-1 py-2 border border-[#E2E8F0] rounded-lg text-sm font-medium">Cancel</button>
              <button onClick={() => handleAction(modal.action)} disabled={modal.action === 'Reject' && !comment.trim()} className={`flex-1 py-2 text-white rounded-lg text-sm font-bold disabled:opacity-40 ${modal.action==='Approve'?'bg-[#16A34A] hover:bg-[#15803D]':'bg-[#DC2626] hover:bg-[#B91C1C]'}`}>Confirm {modal.action}</button>
            </div>
          </div>
        )}
      </Modal>
      <Drawer open={!!drawer} onClose={() => setDrawer(null)} title={drawer ? `${drawer.id} Details` : ''}>{drawer && <RequestDetail req={drawer} />}</Drawer>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PAGE: Audit & Compliance
// ═══════════════════════════════════════════════════════════════
function AuditPage() {
  const { state } = useApp();
  const { addToast } = useToast();
  const [tab, setTab] = useState('history');
  const [search, setSearch] = useState('');
  const [drawer, setDrawer] = useState(null);

  const filteredReqs = state.requests.filter(r => {
    if (!search) return true;
    const s = search.toLowerCase();
    return r.empId.toLowerCase().includes(s) || r.name.toLowerCase().includes(s);
  });

  const exportCSV = () => {
    const headers = ['Employee ID','Name','T-Code','System','Risk','Status','Submitted','Decided'];
    const rows = filteredReqs.map(r => {
      const lastStep = [...r.approvalChain].reverse().find(s => s.at);
      return [r.empId, r.name, r.tcode, r.system, r.risk, r.status, fmtDate(r.submittedAt), lastStep ? fmtDate(lastStep.at) : '—'];
    });
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'access_history.csv'; a.click();
    URL.revokeObjectURL(url);
    addToast('CSV exported successfully', 'success');
  };

  const sodAlerts = SOD_RULES.map(rule => {
    const empMap = {};
    state.requests.filter(r => r.status === 'Approved' && rule.tcodes.includes(r.tcode)).forEach(r => {
      if (!empMap[r.empId]) empMap[r.empId] = { name: r.name, empId: r.empId, tcodes: new Set() };
      empMap[r.empId].tcodes.add(r.tcode);
    });
    const conflicts = Object.values(empMap).filter(e => e.tcodes.size >= 2);
    return { ...rule, conflicts };
  }).filter(r => r.conflicts.length > 0);

  const activityLogs = state.requests.flatMap(r => {
    const items = [{ time: r.submittedAt, actor: r.name, action: 'Submitted request', id: r.id, tcode: r.tcode, system: r.system, color: '#1D4ED8' }];
    r.approvalChain.forEach(step => {
      if (step.at) items.push({ time: step.at, actor: step.by, action: `${step.status} (${step.step})`, id: r.id, tcode: r.tcode, system: r.system, color: step.status === 'Approved' ? '#16A34A' : step.status === 'Rejected' ? '#DC2626' : '#D97706' });
    });
    return items;
  }).sort((a, b) => new Date(b.time) - new Date(a.time));

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto">
        {[{id:'history',label:'Access History'},{id:'sod',label:`SoD Alerts (${sodAlerts.reduce((s,r)=>s+r.conflicts.length,0)})`},{id:'logs',label:'Activity Logs'}].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${tab===t.id?'bg-[#E8632A] text-white':'bg-white border border-[#E2E8F0] text-[#64748B]'}`}>{t.label}</button>
        ))}
      </div>

      {tab === 'history' && (
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by Employee ID or name..." className="w-full pl-9 pr-3 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E8632A]/30" />
            </div>
            <button onClick={exportCSV} className="px-4 py-2 bg-[#E8632A] text-white text-sm font-medium rounded-lg hover:bg-[#D4561F] flex items-center gap-2"><Download className="w-4 h-4" />Export CSV</button>
          </div>
          <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-[#E2E8F0]">
                <th className="px-4 py-3 text-left text-[#64748B] font-medium text-xs">Emp ID</th><th className="px-4 py-3 text-left text-[#64748B] font-medium text-xs">Name</th><th className="px-4 py-3 text-left text-[#64748B] font-medium text-xs">T-Code</th><th className="px-4 py-3 text-left text-[#64748B] font-medium text-xs">System</th><th className="px-4 py-3 text-left text-[#64748B] font-medium text-xs">Risk</th><th className="px-4 py-3 text-left text-[#64748B] font-medium text-xs">Status</th><th className="px-4 py-3 text-left text-[#64748B] font-medium text-xs">Submitted</th>
              </tr></thead>
              <tbody>{filteredReqs.map(r => (
                <tr key={r.id} className="border-b border-[#E2E8F0]/50 hover:bg-[#F8FAFC]">
                  <td className="px-4 py-2.5 font-mono text-xs">{r.empId}</td><td className="px-4 py-2.5">{r.name}</td><td className="px-4 py-2.5"><TCodePill code={r.tcode} /></td><td className="px-4 py-2.5"><SystemBadge system={r.system} /></td><td className="px-4 py-2.5"><RiskBadge level={r.risk} /></td><td className="px-4 py-2.5"><StatusBadge status={r.status} /></td><td className="px-4 py-2.5 text-xs text-[#64748B]">{fmtDate(r.submittedAt)}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'sod' && (
        <div className="space-y-3">
          {sodAlerts.length === 0 ? <p className="text-center text-[#64748B] py-8">No SoD conflicts detected</p> : sodAlerts.map((rule, ri) => rule.conflicts.map((conflict, ci) => (
            <div key={`${ri}-${ci}`} className="bg-white rounded-xl border-2 border-[#DC2626]/30 p-4">
              <div className="flex items-center gap-2 mb-2"><ShieldAlert className="w-5 h-5 text-[#DC2626]" /><span className="text-sm font-bold text-[#DC2626]">SoD Conflict Detected</span><RiskBadge level={rule.risk} /></div>
              <p className="text-sm font-medium text-[#0F172A]">{conflict.name} ({conflict.empId})</p>
              <div className="flex items-center gap-2 mt-2">{rule.tcodes.map(t => <TCodePill key={t} code={t} />)}</div>
              <p className="text-sm text-[#64748B] mt-2">{rule.rule}</p>
              <button onClick={() => setDrawer(conflict)} className="mt-3 px-3 py-1.5 text-xs font-medium text-[#E8632A] border border-[#E8632A] rounded-lg hover:bg-[#E8632A]/5">Investigate</button>
            </div>
          )))}
        </div>
      )}

      {tab === 'logs' && (
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 space-y-3 max-h-[600px] overflow-y-auto">
          {activityLogs.map((log, i) => (
            <div key={i} className="flex items-start gap-3 py-2 border-b border-[#E2E8F0]/50 last:border-none">
              <div className="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0" style={{ background: log.color }} />
              <div className="flex-1">
                <p className="text-sm text-[#0F172A]"><span className="font-medium">{log.actor}</span> — {log.action}</p>
                <div className="flex items-center gap-2 mt-1"><span className="font-mono text-xs text-[#64748B]">{log.id}</span><TCodePill code={log.tcode} /><SystemBadge system={log.system} /><span className="text-xs text-[#64748B]">{timeAgo(log.time)}</span></div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Drawer open={!!drawer} onClose={() => setDrawer(null)} title={drawer ? `${drawer.name} - Requests` : ''}>
        {drawer && (
          <div className="space-y-3">
            {state.requests.filter(r => r.empId === drawer.empId).map(r => (
              <div key={r.id} className="bg-[#F8FAFC] rounded-lg p-3 border border-[#E2E8F0]">
                <div className="flex items-center gap-2 mb-1"><span className="font-mono text-xs font-bold">{r.id}</span><TCodePill code={r.tcode} /><StatusBadge status={r.status} /></div>
                <p className="text-sm text-[#64748B]">{r.desc}</p>
              </div>
            ))}
          </div>
        )}
      </Drawer>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PAGE: Reports & Analytics
// ═══════════════════════════════════════════════════════════════
function ReportsPage() {
  const { state } = useApp();
  const { addToast } = useToast();
  const reqs = state.requests;

  const totalReqs = reqs.length;
  const approvedRate = totalReqs ? Math.round((reqs.filter(r=>r.status==='Approved').length / totalReqs) * 100) : 0;
  const highRiskPct = totalReqs ? Math.round((reqs.filter(r=>r.risk==='HIGH').length / totalReqs) * 100) : 0;

  const statusData = ['Open','Pending Approval','Approved','Rejected'].map(s => ({ name:s, count:reqs.filter(r=>r.status===s).length }));
  const statusColors = { 'Open':'#1D4ED8', 'Pending Approval':'#D97706', 'Approved':'#16A34A', 'Rejected':'#DC2626' };

  const tcodeCounts = {};
  reqs.forEach(r => { tcodeCounts[r.tcode] = (tcodeCounts[r.tcode] || 0) + 1; });
  const tcodeData = Object.entries(tcodeCounts).sort((a,b) => b[1] - a[1]).slice(0, 5).map(([t, c]) => ({ name:t, count:c }));

  const deptCounts = {};
  reqs.forEach(r => { deptCounts[r.dept] = (deptCounts[r.dept] || 0) + 1; });
  const deptData = Object.entries(deptCounts).map(([d, c]) => ({ name:d, value:c }));
  const pieColors = ['#0F2548','#E8632A','#1D4ED8','#16A34A','#D97706','#DC2626'];

  const riskData = [
    { name:'HIGH', count:reqs.filter(r=>r.risk==='HIGH').length, fill:'#DC2626' },
    { name:'MEDIUM', count:reqs.filter(r=>r.risk==='MEDIUM').length, fill:'#D97706' },
    { name:'LOW', count:reqs.filter(r=>r.risk==='LOW').length, fill:'#16A34A' },
  ];

  const downloadReport = () => {
    const lines = [
      '═══════════════════════════════════════════════',
      'HPCL HRRL - SAP Authorization Compliance Report',
      '═══════════════════════════════════════════════',
      `Generated: ${new Date().toLocaleString()}`,
      '',
      '── KPIs ──',
      `Total Requests: ${totalReqs}`,
      `Approved Rate: ${approvedRate}%`,
      `High Risk: ${highRiskPct}%`,
      '',
      '── All Requests ──',
      'ID          | T-Code | System | Dept       | Status           | Risk   ',
      '-'.repeat(75),
      ...reqs.map(r => `${r.id.padEnd(11)} | ${r.tcode.padEnd(6)} | ${r.system.padEnd(6)} | ${r.dept.padEnd(10)} | ${r.status.padEnd(16)} | ${r.risk}`),
      '',
      '── End of Report ──',
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `HRRL_Compliance_Report_${new Date().toISOString().split('T')[0]}.txt`; a.click();
    URL.revokeObjectURL(url);
    addToast('Report downloaded', 'success');
  };

  const kpis = [
    { label:'Total Requests', value:totalReqs },
    { label:'Approved Rate', value:`${approvedRate}%` },
    { label:'Avg Resolution', value:'2.4 days' },
    { label:'High Risk', value:`${highRiskPct}%` },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Reports & Analytics</h2>
        <button onClick={downloadReport} className="px-4 py-2 bg-[#E8632A] text-white text-sm font-medium rounded-lg hover:bg-[#D4561F] flex items-center gap-2"><FileDown className="w-4 h-4" />Generate Report</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(k => (
          <div key={k.label} className="bg-white rounded-xl border border-[#E2E8F0] p-4"><p className="text-xs text-[#64748B] font-medium uppercase">{k.label}</p><p className="text-2xl font-extrabold text-[#0F172A] mt-1">{k.value}</p></div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5">
          <h3 className="font-bold text-[#0F172A] mb-4">Request Volume by Status</h3>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" /><XAxis dataKey="name" tick={{ fontSize:11, fill:'#64748B' }} /><YAxis tick={{ fontSize:11, fill:'#64748B' }} /><RTooltip />
                <Bar dataKey="count" radius={[4,4,0,0]}>{statusData.map((d,i) => <Cell key={i} fill={statusColors[d.name]} />)}</Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5">
          <h3 className="font-bold text-[#0F172A] mb-4">Top 5 T-Codes</h3>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tcodeData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} /><XAxis type="number" tick={{ fontSize:11, fill:'#64748B' }} /><YAxis type="category" dataKey="name" tick={{ fontSize:11, fill:'#64748B', fontFamily:'JetBrains Mono' }} width={55} /><RTooltip />
                <Bar dataKey="count" fill="#0F2548" radius={[0,4,4,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5">
          <h3 className="font-bold text-[#0F172A] mb-4">Department Distribution</h3>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={deptData} dataKey="value" cx="50%" cy="50%" outerRadius={85} label={({name,percent})=>`${name} ${(percent*100).toFixed(0)}%`}>
                  {deptData.map((d,i) => <Cell key={i} fill={pieColors[i % pieColors.length]} />)}
                </Pie>
                <RTooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5">
          <h3 className="font-bold text-[#0F172A] mb-4">Risk Level Distribution</h3>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" /><XAxis dataKey="name" tick={{ fontSize:11, fill:'#64748B' }} /><YAxis tick={{ fontSize:11, fill:'#64748B' }} /><RTooltip />
                <Bar dataKey="count" radius={[4,4,0,0]}>{riskData.map((d,i) => <Cell key={i} fill={d.fill} />)}</Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PAGE: Notifications
// ═══════════════════════════════════════════════════════════════
function NotificationsPage() {
  const { state, dispatch } = useApp();
  const nav = useNavigate();
  const [filter, setFilter] = useState('All');

  const unread = state.notifications.filter(n => !n.read).length;
  const filtered = state.notifications.filter(n => {
    if (filter === 'All') return true;
    if (filter === 'Unread') return !n.read;
    return n.type === filter.toLowerCase();
  });

  const typeIcon = { success:<CheckCircle className="w-5 h-5 text-[#16A34A]" />, danger:<XCircle className="w-5 h-5 text-[#DC2626]" />, warning:<AlertTriangle className="w-5 h-5 text-[#D97706]" />, info:<Info className="w-5 h-5 text-[#1D4ED8]" /> };
  const typeBg = { success:'bg-[#DCFCE7]', danger:'bg-[#FEE2E2]', warning:'bg-[#FEF3C7]', info:'bg-[#EFF6FF]' };

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold">Notifications</h2>
          {unread > 0 && <span className="px-2 py-0.5 bg-[#E8632A] text-white text-xs font-bold rounded-full">{unread}</span>}
        </div>
        {unread > 0 && <button onClick={() => dispatch({ type: 'MARK_ALL_READ' })} className="text-sm text-[#E8632A] font-medium hover:underline">Mark all read</button>}
      </div>

      <div className="flex gap-1 overflow-x-auto">
        {['All','Unread','Success','Warning','Info','Danger'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${filter===f?'bg-[#E8632A] text-white':'bg-white border border-[#E2E8F0] text-[#64748B]'}`}>{f}</button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.length === 0 ? <p className="text-center text-[#64748B] py-8">No notifications</p> : filtered.map(n => (
          <div key={n.id} onClick={() => { dispatch({ type:'MARK_NOTIFICATION_READ', payload:n.id }); if (n.link) nav(n.link); }} className={`flex items-start gap-3 p-4 bg-white rounded-xl border cursor-pointer hover:bg-[#F8FAFC] transition-colors ${!n.read ? 'border-[#E8632A]/30' : 'border-[#E2E8F0]'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${typeBg[n.type]}`}>{typeIcon[n.type]}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[#0F172A]">{n.title}</p>
              <p className="text-sm text-[#64748B] mt-0.5">{n.message}</p>
              <p className="text-xs text-[#64748B] mt-1">{timeAgo(n.at)}</p>
            </div>
            {!n.read && <div className="w-2.5 h-2.5 rounded-full bg-[#E8632A] shrink-0 mt-1" />}
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PAGE: Admin Panel
// ═══════════════════════════════════════════════════════════════
function AdminPage() {
  const { state } = useApp();
  const { addToast } = useToast();
  const [tab, setTab] = useState('requests');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [prompt, setPrompt] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [drawer, setDrawer] = useState(null);

  useEffect(() => {
    (async () => {
      const savedPrompt = await storage.get('hrrl-ai-prompt');
      setPrompt(savedPrompt?.value || DEFAULT_AI_PROMPT);
      const savedKey = await storage.get('hrrl-claude-key');
      setApiKey(savedKey?.value || '');
    })();
  }, []);

  const [robots, setRobots] = useState([
    { name:"SU53 Analyzer Bot", status:"Running", started:"2 min ago", progress:67 },
    { name:"Role Extractor Bot", status:"Completed", started:"1 hr ago", duration:"4m 32s" },
    { name:"Audit Report Bot", status:"Completed", started:"3 hr ago", duration:"8m 11s" },
    { name:"SoD Checker Bot", status:"Failed", started:"5 hr ago", error:"SAP connection timeout" },
  ]);

  const retryBot = (idx) => {
    setRobots(prev => prev.map((r, i) => i === idx ? { ...r, status: 'Running', progress: 0, error: null, started: 'Just now' } : r));
    setTimeout(() => {
      setRobots(prev => prev.map((r, i) => i === idx ? { ...r, status: 'Completed', progress: 100, duration: '2m 15s' } : r));
    }, 3000);
  };

  const filtered = state.requests.filter(r => {
    if (filter !== 'All' && r.status !== filter) return false;
    if (search) { const s = search.toLowerCase(); return r.id.toLowerCase().includes(s) || r.tcode.toLowerCase().includes(s) || r.name.toLowerCase().includes(s); }
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto">
        {[{id:'requests',label:'All Requests'},{id:'config',label:'System Config'},{id:'robots',label:'Robot Status'}].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${tab===t.id?'bg-[#E8632A] text-white':'bg-white border border-[#E2E8F0] text-[#64748B]'}`}>{t.label}</button>
        ))}
      </div>

      {tab === 'requests' && (
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-xs"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" /><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." className="w-full pl-9 pr-3 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E8632A]/30" /></div>
            <select value={filter} onChange={e=>setFilter(e.target.value)} className="px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm"><option>All</option><option>Open</option><option>Pending Approval</option><option>Approved</option><option>Rejected</option></select>
          </div>
          <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-[#E2E8F0]">
                <th className="px-4 py-3 text-left text-[#64748B] font-medium text-xs">ID</th><th className="px-4 py-3 text-left text-[#64748B] font-medium text-xs">Name</th><th className="px-4 py-3 text-left text-[#64748B] font-medium text-xs">T-Code</th><th className="px-4 py-3 text-left text-[#64748B] font-medium text-xs">Status</th><th className="px-4 py-3 text-left text-[#64748B] font-medium text-xs">Risk</th><th className="px-4 py-3 text-left text-[#64748B] font-medium text-xs">Action</th>
              </tr></thead>
              <tbody>{filtered.map(r => (
                <tr key={r.id} className="border-b border-[#E2E8F0]/50 hover:bg-[#F8FAFC] cursor-pointer" onClick={() => setDrawer(r)}>
                  <td className="px-4 py-2.5 font-mono font-bold text-xs">{r.id}</td><td className="px-4 py-2.5">{r.name}</td><td className="px-4 py-2.5"><TCodePill code={r.tcode} /></td><td className="px-4 py-2.5"><StatusBadge status={r.status} /></td><td className="px-4 py-2.5"><RiskBadge level={r.risk} /></td><td className="px-4 py-2.5"><button className="text-[#E8632A] text-xs font-medium">View</button></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'config' && (
        <div className="space-y-4 max-w-2xl">
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-5">
            <h3 className="font-bold text-[#0F172A] mb-1">Claude API Key</h3>
            <p className="text-xs text-[#64748B] mb-3">Required for AI features. Stored locally.</p>
            <div className="flex gap-2">
              <input type="password" value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="sk-ant-..." className="flex-1 px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E8632A]/30" />
              <button onClick={async () => { await storage.set('hrrl-claude-key', apiKey); addToast('API key saved', 'success'); }} className="px-4 py-2 bg-[#E8632A] text-white text-sm font-medium rounded-lg">Save</button>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-5">
            <h3 className="font-bold text-[#0F172A] mb-1">AI System Prompt</h3>
            <p className="text-xs text-[#64748B] mb-3">This prompt is sent as system context for the AI Assistant.</p>
            <textarea value={prompt} onChange={e => setPrompt(e.target.value)} rows={12} className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm font-mono resize-y focus:outline-none focus:ring-2 focus:ring-[#E8632A]/30" />
            <div className="flex gap-2 mt-3">
              <button onClick={async () => { await storage.set('hrrl-ai-prompt', prompt); addToast('Prompt saved', 'success'); }} className="px-4 py-2 bg-[#E8632A] text-white text-sm font-medium rounded-lg">Save Prompt</button>
              <button onClick={() => setPrompt(DEFAULT_AI_PROMPT)} className="px-4 py-2 border border-[#0F2548] text-[#0F2548] text-sm font-medium rounded-lg">Reset to Default</button>
            </div>
          </div>
        </div>
      )}

      {tab === 'robots' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {robots.map((bot, i) => {
            const statusColors = { Running:'bg-[#EFF6FF] text-[#1D4ED8]', Completed:'bg-[#DCFCE7] text-[#16A34A]', Failed:'bg-[#FEE2E2] text-[#DC2626]' };
            return (
              <div key={i} className="bg-white rounded-xl border border-[#E2E8F0] p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2"><Zap className="w-4 h-4 text-[#E8632A]" /><span className="font-bold text-sm text-[#0F172A]">{bot.name}</span></div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${statusColors[bot.status]}`}>{bot.status === 'Running' && <Loader2 className="w-3 h-3 inline mr-1 animate-spin" />}{bot.status}</span>
                </div>
                <p className="text-xs text-[#64748B]">Started: {bot.started}</p>
                {bot.status === 'Running' && (
                  <div className="mt-2"><div className="h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-[#1D4ED8] rounded-full transition-all" style={{width:`${bot.progress}%`}} /></div><p className="text-[10px] text-[#64748B] mt-1">{bot.progress}% complete</p></div>
                )}
                {bot.status === 'Completed' && <p className="text-xs text-[#16A34A] mt-1">Duration: {bot.duration}</p>}
                {bot.status === 'Failed' && (
                  <div className="mt-2"><p className="text-xs text-[#DC2626]">Error: {bot.error}</p><button onClick={() => retryBot(i)} className="mt-2 px-3 py-1 bg-[#E8632A] text-white text-xs font-medium rounded-lg flex items-center gap-1"><RotateCcw className="w-3 h-3" />Retry</button></div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <Drawer open={!!drawer} onClose={() => setDrawer(null)} title={drawer ? `${drawer.id} Details` : ''}>{drawer && <RequestDetail req={drawer} />}</Drawer>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ROOT APP — HashRouter + Providers + Routes
// ═══════════════════════════════════════════════════════════════
function InnerApp() {
  const { addToast } = useToast();
  const [toasts, setToasts] = useState([]);

  // We need to subscribe to addToast calls. Let's use a different approach:
  // Override addToast to also push to local toasts state.
  return null; // This won't work. Let me restructure.
}

// Toast integration wrapper
function AppShell() {
  const [toasts, setToasts] = useState([]);
  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      <AuthProvider>
        <AppProvider>
          <ToastDisplay toasts={toasts} />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<AuthLayout />}>
              <Route element={<PrivateRoute />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/raise-request" element={<RaiseRequestPage />} />
                <Route path="/my-requests" element={<MyRequestsPage />} />
                <Route path="/ai-assistant" element={<AIAssistantPage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
              </Route>
              <Route element={<PrivateRoute roles={['Manager','SAP Admin']} />}>
                <Route path="/approvals" element={<ApprovalsPage />} />
              </Route>
              <Route element={<PrivateRoute roles={['SAP Admin','Auditor']} />}>
                <Route path="/audit" element={<AuditPage />} />
                <Route path="/reports" element={<ReportsPage />} />
              </Route>
              <Route element={<PrivateRoute roles={['SAP Admin']} />}>
                <Route path="/admin" element={<AdminPage />} />
              </Route>
            </Route>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AppProvider>
      </AuthProvider>
    </ToastContext.Provider>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AppShell />
    </HashRouter>
  );
}
