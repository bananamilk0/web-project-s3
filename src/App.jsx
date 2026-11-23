// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from './context/AppContext';
import Layout from './components/layout/Layout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ManageKost from './pages/ManageKost';
import KostDetail from './pages/KostDetail';
import ManageCriteria from './pages/ManageCriteria';
import Calculation from './pages/Calculation';
import HasilRanking from './pages/HasilRanking';
import Report from './pages/Report';
import Riwayat from './pages/Riwayat';
import ManageLokasi from './pages/ManageLokasi';
import Settings from './pages/Settings';

/**
 * ProtectedRoute — redirect ke /login jika belum terautentikasi
 */
function ProtectedRoute({ children }) {
  const { auth } = useApp();
  if (!auth?.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />

      {/* Protected — semua di bawah Layout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />

        {/* 1. Dashboard */}
        <Route path="dashboard" element={<Dashboard />} />

        {/* 2. Manajemen Data Kost */}
        <Route path="kost" element={<ManageKost />} />
        <Route path="kost/:id" element={<KostDetail />} />

        {/* 3. Manajemen Kriteria & Bobot */}
        <Route path="criteria" element={<ManageCriteria />} />

        {/* 4. Penilaian & Perhitungan SAW */}
        <Route path="calculation" element={<Calculation />} />

        {/* 5. Hasil Pemeringkatan & Rekomendasi */}
        <Route path="hasil" element={<HasilRanking />} />

        {/* 6. Laporan */}
        <Route path="report" element={<Report />} />

        {/* 7. Riwayat Perhitungan */}
        <Route path="riwayat" element={<Riwayat />} />

        {/* 8. Manajemen Lokasi Acuan */}
        <Route path="lokasi" element={<ManageLokasi />} />

        {/* 9. Pengaturan & Backup */}
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
