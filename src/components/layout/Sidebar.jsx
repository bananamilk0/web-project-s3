// src/components/layout/Sidebar.jsx
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Building2, Sliders, Calculator,
  Trophy, FileText, History, MapPin, Settings,
  ChevronLeft, ChevronRight, LogOut, User,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import logoImg from '../../assets/logo.png';

const menuUtama = [
  { to: '/dashboard',   label: 'Dashboard',              icon: LayoutDashboard },
  { to: '/kost',        label: 'Data Kost',               icon: Building2 },
  { to: '/criteria',    label: 'Kriteria & Bobot',        icon: Sliders },
  { to: '/calculation', label: 'Perhitungan SAW',         icon: Calculator },
  { to: '/hasil',       label: 'Hasil & Rekomendasi',     icon: Trophy },
];

const menuLainnya = [
  { to: '/report',    label: 'Laporan & Export',         icon: FileText },
  { to: '/riwayat',  label: 'Riwayat Perhitungan',      icon: History },
  { to: '/lokasi',   label: 'Pengguna & Lokasi',         icon: MapPin },
  { to: '/settings', label: 'Pengaturan Sistem',         icon: Settings },
];

export default function Sidebar({ mobileOpen = false, onClose }) {
  const { settings, updateSettings, auth, logout } = useApp();
  const collapsed = settings?.sidebarCollapsed ?? false;
  const navigate = useNavigate();

  const toggle = () => updateSettings({ sidebarCollapsed: !collapsed });

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const handleNavClick = () => {
    if (onClose) onClose();
  };

  return (
    <aside
      className={`sidebar${collapsed ? ' collapsed' : ''}${mobileOpen ? ' mobile-open' : ''}`}
      aria-label="Sidebar navigasi"
    >
      {/* Logo */}
      <div
        className="sidebar-logo"
        style={{ cursor: 'pointer' }}
        onClick={() => { navigate('/dashboard'); if (onClose) onClose(); }}
        title="KiKost Bogor — Dashboard"
      >
        <img
          src={logoImg}
          alt="KiKost Bogor"
          className="sidebar-brand-img"
        />
      </div>

      {/* User Info */}
      {!collapsed && auth?.isAuthenticated && (
        <div className="sidebar-user">
          <div className="sidebar-user-avatar" aria-hidden="true">
            <User size={14} />
          </div>
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">{auth.username}</span>
            <span className="sidebar-user-role">Administrator</span>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Menu Utama</div>
        {menuUtama.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
            title={collapsed ? label : undefined}
            aria-label={label}
            onClick={handleNavClick}
          >
            <span className="nav-item-icon"><Icon size={18} /></span>
            <span className="nav-item-label">{label}</span>
          </NavLink>
        ))}

        <div className="sidebar-section-label" style={{ marginTop: '8px' }}>Lainnya</div>
        {menuLainnya.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
            title={collapsed ? label : undefined}
            aria-label={label}
            onClick={handleNavClick}
          >
            <span className="nav-item-icon"><Icon size={18} /></span>
            <span className="nav-item-label">{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <button
          className="sidebar-logout-btn"
          onClick={handleLogout}
          title="Keluar"
          aria-label="Keluar dari sistem"
          id="sidebar-logout-btn"
        >
          <span className="nav-item-icon"><LogOut size={16} /></span>
          {!collapsed && <span className="nav-item-label">Keluar</span>}
        </button>

        <button
          className="sidebar-toggle"
          onClick={toggle}
          title={collapsed ? 'Perluas sidebar' : 'Ciutkan sidebar'}
          aria-label={collapsed ? 'Perluas sidebar' : 'Ciutkan sidebar'}
          id="sidebar-toggle-btn"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
    </aside>
  );
}
