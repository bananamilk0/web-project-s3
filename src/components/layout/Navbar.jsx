// src/components/layout/Navbar.jsx
import { useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const pageTitles = {
  '/dashboard':   { title: 'Dashboard', sub: 'Ringkasan sistem' },
  '/kost':        { title: 'Data Kost', sub: 'Manajemen alternatif' },
  '/criteria':    { title: 'Kriteria & Bobot', sub: 'Konfigurasi SAW' },
  '/calculation': { title: 'Perhitungan SAW', sub: 'Proses & hasil' },
  '/hasil':       { title: 'Hasil & Rekomendasi', sub: 'Pemeringkatan alternatif' },
  '/report':      { title: 'Laporan', sub: 'Export & cetak' },
  '/riwayat':     { title: 'Riwayat', sub: 'Histori perhitungan' },
  '/lokasi':      { title: 'Pengguna & Lokasi', sub: 'Manajemen acuan & akun' },
  '/settings':    { title: 'Pengaturan', sub: 'Konfigurasi sistem' },
};

export default function Navbar({ onHamburgerClick }) {
  const location = useLocation();
  const { settings } = useApp();

  const pathKey = '/' + location.pathname.split('/')[1];
  const page = pageTitles[pathKey] || { title: 'KiKost Bogor', sub: '' };

  return (
    <header className="navbar" role="banner">
      <button
        className="navbar-hamburger"
        onClick={onHamburgerClick}
        aria-label="Buka menu navigasi"
        id="navbar-hamburger-btn"
      >
        <Menu size={22} />
      </button>
      <div>
        <h1 className="navbar-title" id="page-title">{page.title}</h1>
        <div className="navbar-breadcrumb" aria-label="Breadcrumb">
          <span>{settings.systemName || 'KiKost Bogor'}</span>
          <span aria-hidden="true">›</span>
          <span>{page.sub}</span>
        </div>
      </div>
    </header>
  );
}
