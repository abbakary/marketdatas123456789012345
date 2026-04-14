import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard, Users, Database, DollarSign, Settings, FileCheck, BarChart3,
  ShoppingCart, Heart, ListChecks, Package, Eye, Bookmark, History, FileText,
  Menu, X, LogOut, Bell, Search, ChevronDown, ChevronRight, User, Zap, Send,
} from 'lucide-react';
import { useThemeColors } from '../../../utils/useThemeColors';
import logo from '../../../assets/logo1.png';

const TOKEN_KEY = 'dali-token';
const USER_KEY = 'dali-user';

const roleNavItems = {
  admin: [
    { label: 'Overview', href: '/dashboard/admin', icon: LayoutDashboard },
    { label: 'User Management', href: '/dashboard/admin/users', icon: Users },
    { label: 'Datasets', href: '/dashboard/admin/datasets', icon: Database },
    { label: 'Project Requests', href: '/dashboard/admin/requests', icon: Send },
    { label: 'Custom Reports', href: '/dashboard/admin/reports', icon: FileText },
    { label: 'Projects', href: '/dashboard/admin/projects', icon: BarChart3 },
    { label: 'Revenue Reports', href: '/dashboard/admin/revenue', icon: DollarSign },
    { label: 'Settings', href: '/dashboard/admin/settings', icon: Settings },
  ],
  editor: [
    { label: 'Overview', href: '/dashboard/editor', icon: LayoutDashboard },
    { label: 'Review Queue', href: '/dashboard/editor/reviews', icon: FileCheck },
    { label: 'Approvals', href: '/dashboard/editor/approvals', icon: ListChecks },
    { label: 'Moderation', href: '/dashboard/editor/moderation', icon: Eye },
    { label: 'Project Requests', href: '/dashboard/editor/requests', icon: Send },
    { label: 'Custom Reports', href: '/dashboard/editor/reports', icon: FileText },
    { label: 'Projects', href: '/dashboard/editor/projects', icon: BarChart3 },
    { label: 'Revenue Analytics', href: '/dashboard/editor/analytics', icon: BarChart3 },
    { label: 'Settings', href: '/dashboard/editor/settings', icon: Settings },
  ],
  seller: [
    { label: 'Overview', href: '/dashboard/seller', icon: LayoutDashboard },
    { label: 'Requests & Opportunities', href: '/dashboard/seller/bids', icon: Zap },
    { label: 'Sales Pending', href: '/dashboard/seller/pending', icon: FileCheck },
    { label: 'My Listings', href: '/dashboard/seller/listings', icon: Package },
    { label: 'Sales Analytics', href: '/dashboard/seller/analytics', icon: BarChart3 },
    { label: 'Inventory', href: '/dashboard/seller/inventory', icon: Database },
    { label: 'Advertisements', href: '/dashboard/seller/ads', icon: FileText },
    { label: 'Customer Chats', href: '/dashboard/seller/chats', icon: Users },
  ],
  buyer: [
    { label: 'Overview', href: '/dashboard/buyer', icon: LayoutDashboard },
    { label: 'Project Requests', href: '/dashboard/buyer/requests', icon: Send },
    { label: 'Purchases', href: '/dashboard/buyer/purchases', icon: ShoppingCart },
    { label: 'Wishlist', href: '/dashboard/buyer/wishlist', icon: Heart },
    { label: 'Recommendations', href: '/dashboard/buyer/recommendations', icon: ListChecks },
    { label: 'Budget Tracker', href: '/dashboard/buyer/budget', icon: DollarSign },
  ],
  viewer: [
    { label: 'Overview', href: '/dashboard/viewer', icon: LayoutDashboard },
    { label: 'Browse Datasets', href: '/dashboard/viewer/browse', icon: Database },
    { label: 'Bookmarks', href: '/dashboard/viewer/bookmarks', icon: Bookmark },
    { label: 'View History', href: '/dashboard/viewer/history', icon: History },
    { label: 'Reports', href: '/dashboard/viewer/reports', icon: FileText },
  ],
};

const themeColors = {
  header: "#FF8C00", // Vibrant Orange
  toolbar: "#20B2AA", // Teal
  sidebar: "#04121D", // Dark Blue (from DARK_BG in LogoutPage)
  background: "#F8FAFC",
  accent: "#FF8C00",
  secondary: "#20B2AA",
  text: "#334155",
  activeBg: "linear-gradient(135deg, #FF8C00 0%, #FFA500 100%)",
  activeText: "#FFFFFF",
  sidebarText: "rgba(255, 255, 255, 0.7)",
  sidebarActiveText: "#FFFFFF"
};

const roleStyles = {
  admin: {
    primary: "#FF8C00",
    secondary: "#FFF7ED",
    gradient: "linear-gradient(135deg, #FF8C00 0%, #FFA500 50%, #FFB84D 100%)",
    lightGradient: "linear-gradient(135deg, rgba(255, 140, 0, 0.1) 0%, rgba(255, 165, 0, 0.05) 100%)",
    accentGradient: "linear-gradient(90deg, #FF8C00, #FFA500)",
  },
  editor: {
    primary: "#8B5CF6",
    secondary: "#F5F3FF",
    gradient: "linear-gradient(135deg, #8B5CF6 0%, #A78BFA 50%, #C4B5FD 100%)",
    lightGradient: "linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(167, 139, 250, 0.05) 100%)",
    accentGradient: "linear-gradient(90deg, #8B5CF6, #A78BFA)",
  },
  seller: {
    primary: "#10B981",
    secondary: "#F0FDF4",
    gradient: "linear-gradient(135deg, #10B981 0%, #34D399 50%, #6EE7B7 100%)",
    lightGradient: "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(52, 211, 153, 0.05) 100%)",
    accentGradient: "linear-gradient(90deg, #10B981, #34D399)",
  },
  buyer: {
    primary: "#3B82F6",
    secondary: "#EFF6FF",
    gradient: "linear-gradient(135deg, #3B82F6 0%, #60A5FA 50%, #93C5FD 100%)",
    lightGradient: "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(96, 165, 250, 0.05) 100%)",
    accentGradient: "linear-gradient(90deg, #3B82F6, #60A5FA)",
  },
  viewer: {
    primary: "#64748B",
    secondary: "#F8FAFC",
    gradient: "linear-gradient(135deg, #64748B 0%, #94A3B8 50%, #CBD5E1 100%)",
    lightGradient: "linear-gradient(135deg, rgba(100, 116, 139, 0.1) 0%, rgba(148, 163, 184, 0.05) 100%)",
    accentGradient: "linear-gradient(90deg, #64748B, #94A3B8)",
  },
};

const roleTitles = {
  admin: 'Admin Dashboard', editor: 'Editor Dashboard', seller: 'Seller Dashboard',
  buyer: 'Buyer Dashboard', viewer: 'Viewer Dashboard',
};

export default function DashboardLayout({ children, role }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const themeColors = useThemeColors();

  const user = (() => {
    try { return JSON.parse(localStorage.getItem(USER_KEY) || 'null'); } catch { return null; }
  })();

  const navItems = roleNavItems[role] || roleNavItems.viewer;
  const colors = {
    header: "#FF8C00", // Vibrant Orange
    toolbar: "#20B2AA", // Teal
    sidebar: themeColors.bgPanel,
    background: themeColors.bg,
    accent: "#FF8C00",
    secondary: "#20B2AA",
    text: themeColors.text,
    activeBg: "linear-gradient(135deg, #FF8C00 0%, #FFA500 100%)",
    activeText: "#FFFFFF",
    sidebarText: themeColors.isDarkMode ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.6)",
    sidebarActiveText: "#FFFFFF",
    sidebarBorder: themeColors.isDarkMode ? "rgba(255, 255, 255, 0.1)" : "#e2e8f0",
    sidebarBg: themeColors.isDarkMode ? "#1E293B" : "#FFFFFF"
  };
  const currentRoleStyle = roleStyles[role] || roleStyles.viewer;
  const title = roleTitles[role] || 'Dashboard';

  const handleLogout = () => {
    navigate('/logout');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: colors.background, color: colors.text, transition: 'all 0.3s ease' }}>
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(255, 140, 0, 0.3); }
          50% { box-shadow: 0 0 30px rgba(255, 140, 0, 0.5); }
        }
        .nav-item {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .nav-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.05) 100%);
          transform: scaleX(0);
          transform-origin: right;
          transition: transform 0.3s ease;
          z-index: 0;
        }
        .nav-item:hover {
          transform: translateY(-2px);
        }
        .nav-item:hover::before {
          transform: scaleX(1);
        }
        .active-nav-item {
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
          transform: translateY(-4px);
        }
        .sidebar-decoration {
          position: absolute;
          border-radius: 50%;
          opacity: 0.1;
        }
        @media (max-width: 1023px) {
          .lg-main { padding-right: 0 !important; }
        }
        @media (min-width: 1024px) {
          .lg-sidebar { transform: translateX(0) !important; }
          .lg-main { margin-right: 280px !important; padding-right: 0 !important; }
          .lg-menu-btn { display: none !important; }
        }
      `}</style>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 40, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', transition: 'all 0.3s' }}
        />
      )}

      {/* Sidebar - Right Side */}
      <aside style={{
        position: 'fixed', top: 0, right: 0, zIndex: 50, height: '100%', width: 280,
        background: themeColors.isDarkMode ? `linear-gradient(180deg, #1E293B 0%, #0F172A 100%)` : currentRoleStyle.gradient,
        borderLeft: `1px solid ${colors.sidebarBorder}`,
        transform: sidebarOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.3s ease',
        display: 'flex', flexDirection: 'column',
        boxShadow: themeColors.isDarkMode ? '-10px 0 30px rgba(0,0,0,0.3)' : `-10px 0 40px ${currentRoleStyle.primary}25`,
        overflow: 'hidden',
      }}
        className="lg-sidebar"
      >
        {/* Decorative elements */}
        <div style={{
          position: 'absolute', top: -40, right: -40, width: 150, height: 150,
          borderRadius: '50%', background: 'rgba(255, 255, 255, 0.08)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: 100, left: -50, width: 120, height: 120,
          borderRadius: '50%', background: 'rgba(255, 255, 255, 0.05)',
          pointerEvents: 'none',
        }} />
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72,
          padding: '0 20px', borderBottom: `1px solid rgba(255, 255, 255, 0.1)`,
          backgroundColor: themeColors.isDarkMode ? 'rgba(30, 41, 59, 0.5)' : 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(10px)', transition: 'all 0.3s ease', position: 'relative', zIndex: 10
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', transition: 'transform 0.2s' }}>
              <img src={logo} alt="DaliData Logo" style={{ height: 36, width: 'auto', objectFit: 'contain', display: 'block' }} />
            </Link>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              border: `1px solid rgba(255, 255, 255, 0.2)`,
              color: themeColors.isDarkMode ? '#e2e8f0' : '#fff',
              cursor: 'pointer',
              padding: 6,
              borderRadius: 10,
              display: 'flex',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            }}
          >
            <X size={18} />
          </button>
        </div>

        <nav style={{
          padding: '16px 14px',
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          position: 'relative',
          zIndex: 5,
        }}>
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            const roleColor = currentRoleStyle.primary;

            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`nav-item ${isActive ? 'active-nav-item' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 14px',
                  borderRadius: 12,
                  fontSize: 13,
                  fontWeight: isActive ? 700 : 600,
                  textDecoration: 'none',
                  background: isActive
                    ? currentRoleStyle.accentGradient
                    : themeColors.isDarkMode
                    ? 'rgba(255, 255, 255, 0.05)'
                    : 'rgba(255, 255, 255, 0.2)',
                  color: isActive ? '#fff' : themeColors.isDarkMode ? '#e2e8f0' : '#fff',
                  animation: `slideIn 0.4s ease forwards ${index * 0.05}s`,
                  opacity: 0,
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  border: isActive ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid rgba(255, 255, 255, 0.15)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: isActive
                      ? 'rgba(255, 255, 255, 0.25)'
                      : themeColors.isDarkMode
                      ? 'rgba(255, 255, 255, 0.1)'
                      : 'rgba(255, 255, 255, 0.15)',
                    color: isActive ? '#fff' : themeColors.isDarkMode ? '#cbd5e1' : '#fff',
                    transition: 'all 0.3s',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <Icon size={18} strokeWidth={2.5} />
                </div>
                <span style={{ flex: 1, letterSpacing: '-0.01em' }}>{item.label}</span>
                {isActive && <ChevronRight size={16} color="#fff" />}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer - User Account */}
        <div style={{
          padding: 16,
          borderTop: `1px solid rgba(255, 255, 255, 0.1)`,
          backgroundColor: themeColors.isDarkMode ? 'rgba(15, 23, 42, 0.5)' : 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s ease',
          position: 'relative',
          zIndex: 10,
        }}>
          {/* User Profile Card */}
          <div style={{
            background: themeColors.isDarkMode
              ? 'linear-gradient(135deg, rgba(226, 232, 240, 0.1) 0%, rgba(148, 163, 184, 0.05) 100%)'
              : currentRoleStyle.lightGradient,
            border: `1.5px solid rgba(255, 255, 255, 0.2)`,
            borderRadius: 12,
            padding: 12,
            marginBottom: 12,
            backdropFilter: 'blur(10px)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: currentRoleStyle.gradient,
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: 18,
                boxShadow: `0 8px 20px ${currentRoleStyle.primary}40`,
                border: `2px solid rgba(255, 255, 255, 0.3)`,
                flexShrink: 0,
              }}>
                {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : role[0].toUpperCase()}
              </div>
              <div style={{ flex: 1, overflow: 'hidden', minWidth: 0 }}>
                <div style={{
                  fontSize: 13,
                  fontWeight: 800,
                  color: themeColors.isDarkMode ? '#e2e8f0' : '#fff',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  letterSpacing: '-0.01em',
                }}>
                  {user?.name || 'User'}
                </div>
                <div style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: themeColors.isDarkMode ? '#cbd5e1' : 'rgba(255, 255, 255, 0.9)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginTop: 2,
                  opacity: 0.9,
                }}>
                  {role}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <button
              onClick={() => { setSidebarOpen(false); navigate('/profile'); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                width: '100%',
                padding: '10px 12px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: `1px solid rgba(255, 255, 255, 0.2)`,
                cursor: 'pointer',
                fontSize: 13,
                color: themeColors.isDarkMode ? '#e2e8f0' : '#fff',
                borderRadius: 10,
                fontWeight: 600,
                transition: 'all 0.2s',
                backdropFilter: 'blur(10px)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              }}
            >
              <User size={16} /> Profile
            </button>
            <button
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                width: '100%',
                padding: '10px 12px',
                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                border: `1px solid rgba(239, 68, 68, 0.4)`,
                cursor: 'pointer',
                fontSize: 13,
                color: '#fecaca',
                borderRadius: 10,
                fontWeight: 600,
                transition: 'all 0.2s',
                backdropFilter: 'blur(10px)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.3)';
                e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.5)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
                e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.4)';
              }}
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Desktop Sidebar always visible style is already in the <style> tag above */}

      {/* Main content */}
      <div className="lg-main" style={{ transition: 'margin 0.3s ease' }}>
        {/* Header */}
        <header style={{
          position: 'sticky', top: 0, zIndex: 30,
          background: themeColors.isDarkMode ? '#1a1f2e' : colors.header,
          boxShadow: themeColors.isDarkMode ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(255,140,0,0.15)',
          borderBottom: themeColors.isDarkMode ? `1px solid ${themeColors.border}` : 'none',
          transition: 'all 0.3s ease'
        }}>
          <div style={{ display: 'flex', height: 72, alignItems: 'center', justifyContent: 'space-between', padding: '0 32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <button
                className="lg-menu-btn"
                onClick={() => setSidebarOpen(true)}
                style={{ background: themeColors.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.15)', border: 'none', color: themeColors.isDarkMode ? themeColors.text : '#fff', cursor: 'pointer', padding: 10, borderRadius: 12, display: 'flex', transition: 'all 0.3s ease' }}
              >
                <Menu size={22} />
              </button>
              <h1 style={{ fontSize: 24, fontWeight: 800, color: themeColors.isDarkMode ? themeColors.text : '#fff', margin: 0, letterSpacing: '-0.03em', transition: 'color 0.3s ease' }}>{title}</h1>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              {/* Search */}
              <div style={{ display: 'flex', alignItems: 'center', background: themeColors.isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.12)', borderRadius: 14, padding: '10px 20px', gap: 12, border: `1px solid ${themeColors.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.1)'}`, transition: 'all 0.2s' }}>
                <Search size={18} color={themeColors.isDarkMode ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.9)'} />
                <input
                  placeholder="Search dashboard..."
                  style={{ background: 'transparent', border: 'none', color: themeColors.isDarkMode ? themeColors.text : '#fff', fontSize: 14, outline: 'none', width: 200, fontWeight: 500, transition: 'all 0.3s ease' }}
                />
              </div>

              {/* Notifications */}
              <div style={{ position: 'relative' }}>
                <button style={{ background: themeColors.isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.12)', border: 'none', color: themeColors.isDarkMode ? themeColors.text : '#fff', cursor: 'pointer', padding: 10, borderRadius: 12, display: 'flex', transition: 'all 0.2s' }}>
                  <Bell size={22} />
                </button>
                <span style={{
                  position: 'absolute', top: -4, right: -4, width: 20, height: 20,
                  background: '#ef4444', borderRadius: '50%', fontSize: 11, fontWeight: 800,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
                  border: `3px solid ${themeColors.isDarkMode ? '#1a1f2e' : '#FF8C00'}`, boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>3</span>
              </div>
            </div>
          </div>

          {/* Subheader */}
          <div style={{ height: 52, background: themeColors.isDarkMode ? colors.background : colors.toolbar, display: 'flex', alignItems: 'center', padding: '0 32px', boxShadow: themeColors.isDarkMode ? `inset 0 1px 0 ${themeColors.border}` : 'inset 0 2px 10px rgba(0,0,0,0.05)', transition: 'all 0.3s ease' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                <Link to={location.pathname} style={{ color: themeColors.isDarkMode ? themeColors.text : '#fff', fontSize: 14, fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, background: themeColors.isDarkMode ? themeColors.bgSecondary : 'rgba(255,255,255,0.15)', padding: '6px 14px', borderRadius: 10, transition: 'all 0.3s ease' }}>
                   <LayoutDashboard size={16} /> Overview
                </Link>
                <div style={{ width: 1, height: 20, background: themeColors.isDarkMode ? themeColors.border : 'rgba(255,255,255,0.2)', transition: 'all 0.3s ease' }} />
                <span style={{ color: themeColors.isDarkMode ? themeColors.textMuted : 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: 600, letterSpacing: '0.01em', transition: 'color 0.3s ease' }}>
                   Platform / <span style={{ textTransform: 'capitalize', color: themeColors.isDarkMode ? themeColors.text : 'rgba(255,255,255,0.9)' }}>{role}</span> / {location.pathname.split('/').pop().split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </span>
             </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ padding: '32px', width: '100%', boxSizing: 'border-box', maxWidth: '1600px', margin: '0 auto', backgroundColor: colors.background, transition: 'all 0.3s ease' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
