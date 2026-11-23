/**
 * src/components/layout/TopNavbar.jsx
 * Topbar Navigasi Global: Pencarian [Ctrl+K], Notifikasi, & Profil Administrator
 */

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Bell,
  ChevronDown,
  User,
  Settings,
  HelpCircle,
  LogOut,
  Building2,
  CheckCircle,
  Clock,
  Sparkles
} from 'lucide-react';

export default function TopNavbar() {
  const { setSearchModalOpen, setGuideModalOpen, setActivePage, recentActivities, appSettings } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setSearchModalOpen]);

  return (
    <header
      className="top-navbar"
      style={{
        height: 'var(--topbar-height)',
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid var(--border-light)',
        padding: '0 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 90,
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      {/* 1. Global Search Bar */}
      <div
        onClick={() => setSearchModalOpen(true)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          backgroundColor: 'var(--pale-green)',
          padding: '9px 16px',
          borderRadius: 'var(--radius-pill)',
          width: '100%',
          maxWidth: '440px',
          cursor: 'pointer',
          border: '1.5px solid var(--border-light)',
          transition: 'all var(--transition-fast)'
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = 'var(--sage-green)';
          e.currentTarget.style.backgroundColor = '#FFFFFF';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = 'var(--border-light)';
          e.currentTarget.style.backgroundColor = 'var(--pale-green)';
        }}
      >
        <Search size={18} color="var(--muted-green)" />
        <span style={{ fontSize: '0.88rem', color: 'var(--muted-green)', flex: 1 }}>
          Cari kost, kriteria, atau informasi...
        </span>
        <kbd
          style={{
            fontSize: '0.72rem',
            padding: '2px 7px',
            backgroundColor: '#FFFFFF',
            borderRadius: '4px',
            border: '1px solid var(--border-light)',
            color: 'var(--forest-green)',
            fontWeight: 700,
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
          }}
        >
          Ctrl+K
        </kbd>
      </div>

      {/* 2. Actions: Notifikasi & Profil Admin */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Tombol Notifikasi */}
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            style={{
              position: 'relative',
              background: showNotifications ? 'var(--pale-green)' : 'transparent',
              border: 'none',
              padding: '9px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--dark-green)',
              transition: 'all var(--transition-fast)'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--pale-green)'}
            onMouseLeave={e => {
              if (!showNotifications) e.currentTarget.style.background = 'transparent';
            }}
            title="Notifikasi Aktivitas"
          >
            <Bell size={20} color="var(--forest-green)" />
            {/* Red Badge */}
            <span
              style={{
                position: 'absolute',
                top: '5px',
                right: '5px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: 'var(--soft-coral)',
                border: '1.5px solid #FFFFFF'
              }}
            />
          </button>

          {/* Notifikasi Dropdown */}
          {showNotifications && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: 'calc(100% + 8px)',
                width: '320px',
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-card)',
                boxShadow: 'var(--shadow-xl)',
                padding: '16px',
                zIndex: 100,
                animation: 'fadeIn var(--transition-fast) ease-out'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '12px',
                  paddingBottom: '8px',
                  borderBottom: '1px solid var(--border-light)'
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--forest-green)' }}>
                  Notifikasi Sistem
                </div>
                <span className="badge badge-benefit" style={{ fontSize: '0.7rem' }}>
                  Terbaru
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {recentActivities.slice(0, 3).map(act => (
                  <div
                    key={act.id}
                    style={{
                      padding: '8px 10px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--pale-green)',
                      fontSize: '0.82rem',
                      lineHeight: 1.4
                    }}
                  >
                    <div style={{ color: 'var(--dark-green)', fontWeight: 500 }}>
                      {act.pesan}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.72rem',
                        color: 'var(--muted-green)',
                        marginTop: '4px'
                      }}
                    >
                      <Clock size={11} />
                      <span>{new Date(act.waktu).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Pemisah Vertikal */}
        <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border-light)' }} />

        {/* Profil Admin Dropdown */}
        <div style={{ position: 'relative' }} ref={profileRef}>
          <div
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              cursor: 'pointer',
              padding: '6px 10px',
              borderRadius: 'var(--radius-pill)',
              transition: 'background var(--transition-fast)'
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--pale-green)'}
            onMouseLeave={e => {
              if (!showProfileMenu) e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            {/* Avatar Lingkaran Hijau */}
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: 'var(--mint-green)',
                border: '2px solid var(--emerald-green)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                color: 'var(--forest-green)',
                fontSize: '0.95rem'
              }}
            >
              {(appSettings?.adminName || 'AD').substring(0, 2).toUpperCase()}
            </div>

            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--dark-green)', lineHeight: 1.2 }}>
                {appSettings?.adminName || 'Administrator'}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--muted-green)', fontWeight: 500 }}>
                {appSettings?.adminEmail || 'Admin Sistem'}
              </div>
            </div>

            <ChevronDown size={15} color="var(--muted-green)" />
          </div>

          {/* Profil Dropdown Menu */}
          {showProfileMenu && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: 'calc(100% + 8px)',
                width: '220px',
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-card)',
                boxShadow: 'var(--shadow-xl)',
                padding: '8px',
                zIndex: 100,
                animation: 'fadeIn var(--transition-fast) ease-out'
              }}
            >
              <button
                onClick={() => { setActivePage('pengaturan'); setShowProfileMenu(false); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  width: '100%',
                  padding: '9px 12px',
                  border: 'none',
                  background: 'transparent',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--dark-green)',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--pale-green)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <Settings size={16} color="var(--emerald-green)" />
                <span>Pengaturan Sistem</span>
              </button>

              <button
                onClick={() => { setGuideModalOpen(true); setShowProfileMenu(false); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  width: '100%',
                  padding: '9px 12px',
                  border: 'none',
                  background: 'transparent',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--dark-green)',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--pale-green)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <HelpCircle size={16} color="var(--emerald-green)" />
                <span>Panduan SPK SAW</span>
              </button>

              <div style={{ height: '1px', backgroundColor: 'var(--border-light)', margin: '6px 0' }} />

              <button
                onClick={() => {
                  alert('Sesi administrator aktif.');
                  setShowProfileMenu(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  width: '100%',
                  padding: '9px 12px',
                  border: 'none',
                  background: 'transparent',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--soft-coral-dark)',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--soft-coral-light)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <LogOut size={16} color="var(--soft-coral-dark)" />
                <span>Kunci Sesi Admin</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
