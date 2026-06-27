import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { mockNotifications } from '../data/mockData';
import HRRLLogo from './HRRLLogo';
import {
  LayoutDashboard, FilePlus2, FileText, Bot, CheckSquare,
  ShieldCheck, BarChart3, Settings, Bell, ChevronLeft, ChevronRight,
  LogOut, Menu, X, ChevronDown, Search, Moon, Sun, HelpCircle,
  MoreHorizontal, Plus
} from 'lucide-react';

const allNavItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['employee', 'manager', 'sap_admin', 'auditor'] },
  { path: '/raise-request', label: 'Raise Request', icon: FilePlus2, roles: ['employee', 'manager', 'sap_admin', 'auditor'] },
  { path: '/my-requests', label: 'My Requests', icon: FileText, roles: ['employee', 'manager', 'sap_admin', 'auditor'] },
  { path: '/ai-assistant', label: 'AI Assistant', icon: Bot, roles: ['employee', 'manager', 'sap_admin', 'auditor'] },
  { path: '/approvals', label: 'Approvals', icon: CheckSquare, roles: ['manager', 'sap_admin'] },
  { path: '/audit', label: 'Audit & Compliance', icon: ShieldCheck, roles: ['sap_admin', 'auditor'] },
  { path: '/reports', label: 'Reports', icon: BarChart3, roles: ['sap_admin', 'auditor'] },
  { path: '/admin', label: 'Admin Panel', icon: Settings, roles: ['sap_admin'] },
];

export function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const { user } = useAuth();
  const navItems = allNavItems.filter((item) => item.roles.includes(user?.role));

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen bg-sidebar-bg text-white transition-all duration-300 ease-in-out flex flex-col
          ${collapsed ? 'lg:w-[68px]' : 'lg:w-[240px]'}
          ${mobileOpen ? 'translate-x-0 w-[240px]' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className={`flex items-center gap-3 px-4 h-[56px] border-b border-white/10 ${collapsed ? 'lg:justify-center' : ''}`}>
          <HRRLLogo size={36} monochrome />
          {(!collapsed || mobileOpen) && (
            <span className="text-[14px] font-medium tracking-wide">HRRL Portal</span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] transition-colors relative group ${
                      isActive
                        ? 'bg-accent-bg text-white font-medium before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-2/3 before:w-[3px] before:bg-accent before:rounded-r'
                        : 'text-text-muted hover:text-white hover:bg-white/5'
                    } ${collapsed && !mobileOpen ? 'lg:justify-center px-0' : ''}`
                  }
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon className="w-[18px] h-[18px] shrink-0" />
                  {(!collapsed || mobileOpen) && <span>{item.label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}

export function MobileNav() {
  const { user } = useAuth();
  const location = useLocation();
  const navItems = allNavItems.filter((item) => item.roles.includes(user?.role));

  const rawBottomTabs = [
    navItems.find(i => i.path === '/dashboard'),
    navItems.find(i => i.path === '/my-requests'),
    'RAISE',
    navItems.find(i => i.path === '/approvals') || navItems.find(i => i.path === '/ai-assistant'),
    { path: '#more', label: 'More', icon: MoreHorizontal }
  ];

  // Remove duplicates and undefined, keeping 'RAISE' and '#more'
  const bottomTabs = rawBottomTabs.filter((item, index, self) => 
    item && (typeof item === 'string' || item.path === '#more' || self.findIndex(t => t.path === item.path) === index)
  );

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-[56px] bg-card border-t border-border z-40">
      <div className="flex items-center justify-around h-full px-2">
        {bottomTabs.map((item, idx) => {
          if (item === 'RAISE') {
            return (
              <NavLink
                key="raise"
                to="/raise-request"
                className="flex flex-col items-center justify-center -mt-6 z-50"
              >
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center shadow-lg transform active:scale-95 transition-transform border-[4px] border-surface">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <span className="text-[10px] font-medium text-accent mt-1">Raise</span>
              </NavLink>
            );
          }

          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path || idx}
              to={item.path}
              className={`flex flex-col items-center justify-center w-16 h-full gap-1 ${
                isActive ? 'text-accent' : 'text-text-muted'
              }`}
            >
              <item.icon className="w-[20px] h-[20px]" />
              <span className="text-[10px] font-medium">{item.label.split(' ')[0]}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}

export function TopNav({ collapsed, setCollapsed, setMobileOpen }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfile, setShowProfile] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const profileRef = useRef(null);
  const helpRef = useRef(null);

  const unreadCount = mockNotifications.filter((n) => !n.read).length;
  const displayCount = unreadCount > 9 ? '9+' : unreadCount;

  // Breadcrumbs logic
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const currentPage = pathSegments.length > 0 
    ? pathSegments[0].split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    : 'Dashboard';

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
      if (helpRef.current && !helpRef.current.contains(event.target)) {
        setShowHelp(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 h-[56px] bg-card border-b border-border flex items-center justify-between px-4">
      {/* Left Section */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            if (window.innerWidth < 1024) setMobileOpen(true);
            else setCollapsed(!collapsed);
          }}
          className="p-1.5 text-text-muted hover:bg-accent-bg hover:text-accent rounded-md transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Desktop Breadcrumbs */}
        <div className="hidden md:flex items-center gap-2 text-[13px]">
          <Link to="/" className="text-text-muted hover:text-accent transition-colors">Home</Link>
          <span className="text-text-muted text-[12px]">›</span>
          <span className="text-text-primary font-medium">{currentPage}</span>
        </div>

        {/* Mobile Logo (only shown when sidebar is hidden on small screens) */}
        <div className="flex md:hidden items-center gap-2">
          <HRRLLogo size={28} monochrome={theme === 'dark'} />
          <span className="text-[14px] font-bold text-text-primary">HRRL</span>
        </div>
      </div>

      {/* Center Section - Search */}
      <div className="hidden md:flex flex-1 max-w-[280px] mx-4">
        <div className="relative w-full group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
          <input
            type="text"
            placeholder="Search requests, T-Codes…"
            className="w-full h-[34px] pl-9 pr-12 text-[13px] bg-surface border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 px-1.5 py-0.5 bg-border rounded text-[10px] font-medium text-text-muted pointer-events-none">
            ⌘K
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-1">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-1.5 rounded-md text-text-muted hover:bg-surface hover:text-text-primary transition-colors relative"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          <div className="relative w-4 h-4">
            <Sun className={`absolute inset-0 w-4 h-4 transition-opacity duration-200 ${theme === 'dark' ? 'opacity-0' : 'opacity-100'}`} />
            <Moon className={`absolute inset-0 w-4 h-4 transition-opacity duration-200 ${theme === 'dark' ? 'opacity-100' : 'opacity-0'}`} />
          </div>
        </button>

        {/* Help */}
        <div className="relative" ref={helpRef}>
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="p-1.5 rounded-md text-text-muted hover:bg-surface hover:text-text-primary transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
          {showHelp && (
            <div className="absolute right-0 top-10 w-[240px] p-3 bg-card border border-border rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.08)] z-50 text-[12px] text-text-secondary">
              Need help? Contact SAP Support at <a href="mailto:sap-helpdesk@hrrl.in" className="text-accent font-medium hover:underline">sap-helpdesk@hrrl.in</a>
            </div>
          )}
        </div>

        {/* Notifications */}
        <button
          onClick={() => navigate('/notifications')}
          className="p-1.5 rounded-md text-text-muted hover:bg-surface hover:text-text-primary transition-colors relative mr-1"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-danger rounded-full ring-2 ring-card" />
          )}
        </button>

        {/* Divider */}
        <div className="w-[1px] h-[20px] bg-border mx-1 hidden sm:block" />

        {/* User Dropdown */}
        <div className="relative ml-1" ref={profileRef}>
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 pl-1 pr-1.5 py-1 hover:bg-surface rounded-lg transition-colors text-left"
          >
            <div className="w-[30px] h-[30px] rounded-full bg-accent-bg flex items-center justify-center shrink-0">
              <span className="text-accent text-[11px] font-medium">
                {user?.name?.split(' ').map(n => n[0]).join('').substring(0, 2) || 'U'}
              </span>
            </div>
            <div className="hidden md:block">
              <p className="text-[13px] font-medium text-text-primary leading-none">{user?.name}</p>
              <span className="inline-block mt-1 px-1.5 py-[1px] bg-accent-bg text-accent text-[10px] font-medium rounded-full whitespace-nowrap capitalize">
                {user?.role?.replace('_', ' ')}
              </span>
            </div>
            <ChevronDown className="w-3 h-3 text-text-muted hidden md:block ml-1" />
          </button>

          {showProfile && (
            <div className="absolute right-0 top-11 w-[200px] bg-card border border-border rounded-[10px] shadow-[0_4px_20px_rgba(0,0,0,0.08)] py-1 z-50">
              <button className="w-full flex items-center gap-2 px-[14px] py-[9px] text-[13px] text-text-primary hover:bg-surface transition-colors">
                <span className="w-4 text-center">👤</span> My Profile
              </button>
              <button className="w-full flex items-center gap-2 px-[14px] py-[9px] text-[13px] text-text-primary hover:bg-surface transition-colors">
                <span className="w-4 text-center">⚙️</span> Settings
              </button>
              <div className="h-[1px] bg-border my-1" />
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-[14px] py-[9px] text-[13px] text-danger-text hover:bg-danger-bg transition-colors"
              >
                <span className="w-4 text-center">🚪</span> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
