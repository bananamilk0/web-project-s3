// src/components/layout/Layout.jsx
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useApp } from '../../context/AppContext';

export default function Layout() {
  const { settings } = useApp();
  const collapsed = settings.sidebarCollapsed;
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="app-shell">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div
        className={`mobile-sidebar-overlay${mobileOpen ? ' visible' : ''}`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />
      <div className={`main-content${collapsed ? ' sidebar-collapsed' : ''}`}>
        <Navbar onHamburgerClick={() => setMobileOpen(prev => !prev)} />
        <main className="page-content" id="main-content" role="main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
