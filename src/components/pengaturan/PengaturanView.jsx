/**
 * src/components/pengaturan/PengaturanView.jsx
 * Pengaturan Sistem SPK Kikost:
 * - Konfigurasi Profil Administrator & Identitas Kampus
 * - Backup & Pemulihan Data
 * - Cetak PDF Laporan Utama
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  User,
  Shield,
  Database,
  Download,
  Save,
  CheckCircle2,
  Building,
  Sparkles,
  Printer,
  FileText,
  Award,
  ClipboardList,
  BookOpen
} from 'lucide-react';

export default function PengaturanView() {
  const { kostList, kriteriaList, addToast, appSettings, updateAppSettings, sawResult } = useApp();

  const [systemName, setSystemName] = useState(appSettings?.systemName || 'Kikost - SPK Kost Terbaik');
  const [targetCampus, setTargetCampus] = useState(appSettings?.targetCampus || 'Universitas Gadjah Mada (UGM) & Sekitarnya');
  const [academicPeriod, setAcademicPeriod] = useState(appSettings?.academicPeriod || '2024/2025 - Semester Gasal');
  const [adminName, setAdminName] = useState(appSettings?.adminName || 'Administrator Sistem');
  const [adminEmail, setAdminEmail] = useState(appSettings?.adminEmail || 'admin@kikost.id');


  // Sync if appSettings changes from reset or other sources
  React.useEffect(() => {
    if (appSettings) {
      setSystemName(appSettings.systemName || '');
      setTargetCampus(appSettings.targetCampus || '');
      setAcademicPeriod(appSettings.academicPeriod || '');
      setAdminName(appSettings.adminName || '');
      setAdminEmail(appSettings.adminEmail || '');
    }
  }, [appSettings]);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    updateAppSettings({
      systemName,
      targetCampus,
      academicPeriod,
      adminName,
      adminEmail
    });
  };

  const handleExportJSON = () => {
    const backupData = {
      timestamp: new Date().toISOString(),
      systemName,
      kostList,
      kriteriaList
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Kikost_Backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addToast('File cadangan JSON berhasil diunduh.', 'success');
  };

  const handlePrintLaporan = (type) => {
    const printWin = window.open('', '_blank', 'width=900,height=700');
    if (!printWin) return;

    const tanggalLaporan = new Date().toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
    const namaAdmin = appSettings?.adminName || 'Administrator Sistem';
    const results = sawResult?.results || [];
    const topKost = results[0];

    const sharedStyles = `
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Segoe UI', Arial, sans-serif; color: #1a3c2e; background: #fff; padding: 32px; }
        h1 { font-size: 1.3rem; font-weight: 800; margin-bottom: 4px; }
        h2 { font-size: 1.1rem; font-weight: 700; margin: 20px 0 10px; color: #174D3B; border-bottom: 2px solid #174D3B; padding-bottom: 6px; }
        p { font-size: 0.88rem; color: #4a7060; margin-bottom: 6px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 0.84rem; }
        th { background: #174D3B; color: #fff; padding: 8px 10px; text-align: left; }
        td { padding: 7px 10px; border-bottom: 1px solid #dde8dc; }
        tr:nth-child(even) td { background: #f0f7ef; }
        .header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 16px; border-bottom: 3px solid #174D3B; margin-bottom: 22px; }
        .logo { display: flex; align-items: center; gap: 12px; }
        .logo-icon { width: 44px; height: 44px; background: #174D3B; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
        .brand-name { font-size: 1.35rem; font-weight: 900; color: #174D3B; line-height: 1.1; }
        .brand-sub { font-size: 0.72rem; color: #5a8070; font-weight: 600; letter-spacing: 0.05em; }
        .meta { text-align: right; font-size: 0.78rem; color: #5a8070; }
        .badge-benefit { background: #d1fae5; color: #065f46; border-radius: 20px; padding: 2px 8px; font-size: 0.74rem; font-weight: 700; }
        .badge-cost { background: #fee2e2; color: #991b1b; border-radius: 20px; padding: 2px 8px; font-size: 0.74rem; font-weight: 700; }
        .badge-rank1 { background: #fef3c7; color: #92400e; border-radius: 20px; padding: 2px 10px; font-weight: 800; }
        .summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin: 12px 0 18px; }
        .summary-item { background: #f0f7ef; padding: 10px 12px; border-radius: 8px; font-size: 0.82rem; }
        .summary-item strong { display: block; font-size: 1.1rem; color: #174D3B; }
        .ttd { display: flex; justify-content: flex-end; margin-top: 48px; padding-right: 16px; }
        .ttd-box { text-align: center; min-width: 200px; }
        .ttd-line { margin-top: 56px; border-top: 1px solid #174D3B; padding-top: 6px; font-weight: 700; font-size: 0.88rem; color: #174D3B; }
        .footnote { font-size: 0.74rem; color: #888; margin-top: 30px; border-top: 1px solid #dde8dc; padding-top: 10px; }
        @media print { body { padding: 20px; } }
      </style>
    `;

    const headerBlock = `
      <div class="header">
        <div class="logo">
          <div class="logo-icon">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#FFFDF5" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </div>
          <div>
            <div class="brand-name">Kikost System</div>
            <div class="brand-sub">SISTEM PENDUKUNG KEPUTUSAN PEMILIHAN KOST TERBAIK</div>
          </div>
        </div>
        <div class="meta">
          <div>Tanggal: <strong>${tanggalLaporan}</strong></div>
          <div>Status: <strong style="color:#174D3B">Resmi / Sah</strong></div>
        </div>
      </div>
    `;

    const ttdBlock = `
      <div class="ttd">
        <div class="ttd-box">
          <div style="font-size:0.82rem;color:#5a8070">Yogyakarta, ${tanggalLaporan}<br/><strong>Administrator Sistem SPK</strong></div>
          <div class="ttd-line">${namaAdmin}</div>
          <div style="font-size:0.74rem;color:#5a8070">NIP / ID: 2025.SPK.001</div>
        </div>
      </div>
    `;

    let bodyContent = '';

    if (type === 'rekomendasi') {
      bodyContent = `
        ${headerBlock}
        <h1 style="text-align:center;text-transform:uppercase;margin-bottom:4px">Laporan Akhir Rekomendasi Pemilihan Kost</h1>
        <p style="text-align:center">Metode Simple Additive Weighting (SAW) — Konsep Verdant Living</p>
        <h2>I. Ringkasan Eksekutif</h2>
        <div class="summary-grid">
          <div class="summary-item"><strong>${kostList.length}</strong>Total Kost Terdaftar</div>
          <div class="summary-item"><strong>${sawResult?.activeKostCount || 0}</strong>Alternatif Aktif</div>
          <div class="summary-item"><strong>${kriteriaList.length}</strong>Kriteria Evaluasi</div>
          <div class="summary-item"><strong style="font-size:0.92rem">${topKost?.kostData?.nama || '-'}</strong>Rekomendasi Utama</div>
        </div>
        <h2>II. Hasil Peringkat Rekomendasi</h2>
        <table>
          <thead><tr><th>Rank</th><th>Nama Kost</th><th>Tipe</th><th>Alamat</th><th>Harga/Bln</th><th style="text-align:right">Nilai V_i</th></tr></thead>
          <tbody>
            ${results.map(item => `
              <tr>
                <td><span class="${item.ranking <= 3 ? 'badge-rank1' : ''}">#${item.ranking}</span></td>
                <td><strong>${item.kostData.nama}</strong></td>
                <td>${item.kostData.tipeKamar}</td>
                <td style="font-size:0.78rem;color:#5a8070">${item.kostData.alamat}</td>
                <td>Rp ${item.kostData.harga.toLocaleString('id-ID')}</td>
                <td style="text-align:right;font-family:monospace;font-weight:800;color:#174D3B">${item.skorAkhir.toFixed(4)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        ${ttdBlock}
        <div class="footnote">Laporan ini merupakan output komputasi objektif SPK. Rekomendasi bersifat pendukung keputusan dan tidak menggantikan pertimbangan individu.</div>
      `;
    } else if (type === 'kriteria') {
      bodyContent = `
        ${headerBlock}
        <h1 style="text-align:center;text-transform:uppercase;margin-bottom:4px">Laporan Konfigurasi Kriteria & Bobot</h1>
        <p style="text-align:center">Konfigurasi Aktif Metode Simple Additive Weighting (SAW)</p>
        <h2>I. Daftar Kriteria Evaluasi & Bobot Penilaian</h2>
        <table>
          <thead><tr><th>Kode</th><th>Nama Kriteria</th><th>Satuan</th><th>Tipe</th><th style="text-align:right">Bobot (w_j)</th><th style="text-align:right">Persentase</th></tr></thead>
          <tbody>
            ${kriteriaList.map(c => `
              <tr>
                <td><strong>${c.kode}</strong></td>
                <td>${c.nama}</td>
                <td>${c.satuan || '-'}</td>
                <td><span class="${c.tipe === 'benefit' ? 'badge-benefit' : 'badge-cost'}">${c.tipe}</span></td>
                <td style="text-align:right;font-family:monospace">${c.bobot.toFixed(2)}</td>
                <td style="text-align:right;font-weight:700">${Math.round(c.bobot * 100)}%</td>
              </tr>
            `).join('')}
            <tr style="background:#d1fae5;font-weight:800">
              <td colspan="4" style="color:#174D3B">Total Akumulasi Bobot</td>
              <td style="text-align:right;font-family:monospace;color:#174D3B">1.00</td>
              <td style="text-align:right;color:#174D3B">100%</td>
            </tr>
          </tbody>
        </table>
        <h2>II. Formulasi SAW yang Digunakan</h2>
        <table>
          <thead><tr><th>Tipe Kriteria</th><th>Rumus Normalisasi</th><th>Keterangan</th></tr></thead>
          <tbody>
            <tr><td>Benefit</td><td style="font-family:monospace">r_ij = x_ij / Max(x_j)</td><td>Nilai lebih besar = lebih baik</td></tr>
            <tr><td>Cost</td><td style="font-family:monospace">r_ij = Min(x_j) / x_ij</td><td>Nilai lebih kecil = lebih baik</td></tr>
            <tr><td>Nilai Preferensi</td><td style="font-family:monospace">V_i = Σ (w_j × r_ij)</td><td>Penjumlahan nilai berbobot</td></tr>
          </tbody>
        </table>
        ${ttdBlock}
      `;
    } else if (type === 'lengkap') {
      bodyContent = `
        ${headerBlock}
        <h1 style="text-align:center;text-transform:uppercase;margin-bottom:4px">Laporan Lengkap SPK Pemilihan Kost</h1>
        <p style="text-align:center">Laporan Gabungan — Rekomendasi, Kriteria & Bobot, Data Kost</p>
        <h2>I. Ringkasan Eksekutif</h2>
        <div class="summary-grid">
          <div class="summary-item"><strong>${kostList.length}</strong>Total Kost Terdaftar</div>
          <div class="summary-item"><strong>${sawResult?.activeKostCount || 0}</strong>Alternatif Aktif</div>
          <div class="summary-item"><strong>${kriteriaList.length}</strong>Kriteria Evaluasi</div>
          <div class="summary-item"><strong style="font-size:0.9rem">${topKost?.kostData?.nama || '-'}</strong>Rekomendasi Utama</div>
        </div>
        <h2>II. Konfigurasi Kriteria & Bobot</h2>
        <table>
          <thead><tr><th>Kode</th><th>Nama Kriteria</th><th>Satuan</th><th>Tipe</th><th style="text-align:right">Bobot</th><th style="text-align:right">%</th></tr></thead>
          <tbody>
            ${kriteriaList.map(c => `
              <tr>
                <td><strong>${c.kode}</strong></td>
                <td>${c.nama}</td>
                <td>${c.satuan || '-'}</td>
                <td><span class="${c.tipe === 'benefit' ? 'badge-benefit' : 'badge-cost'}">${c.tipe}</span></td>
                <td style="text-align:right;font-family:monospace">${c.bobot.toFixed(2)}</td>
                <td style="text-align:right;font-weight:700">${Math.round(c.bobot * 100)}%</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <h2>III. Hasil Peringkat Rekomendasi (Descending V_i)</h2>
        <table>
          <thead><tr><th>Rank</th><th>Nama Kost</th><th>Tipe</th><th>Alamat</th><th>Harga/Bln</th><th style="text-align:right">Nilai V_i</th></tr></thead>
          <tbody>
            ${results.map(item => `
              <tr>
                <td><span class="${item.ranking <= 3 ? 'badge-rank1' : ''}">#${item.ranking}</span></td>
                <td><strong>${item.kostData.nama}</strong></td>
                <td>${item.kostData.tipeKamar}</td>
                <td style="font-size:0.78rem;color:#5a8070">${item.kostData.alamat}</td>
                <td>Rp ${item.kostData.harga.toLocaleString('id-ID')}</td>
                <td style="text-align:right;font-family:monospace;font-weight:800;color:#174D3B">${item.skorAkhir.toFixed(4)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <h2>IV. Daftar Seluruh Data Kost</h2>
        <table>
          <thead><tr><th>ID</th><th>Nama Kost</th><th>Tipe</th><th>Harga/Bln</th><th>Luas (m²)</th><th>Jarak (km)</th><th>Status</th></tr></thead>
          <tbody>
            ${kostList.map(k => `
              <tr>
                <td style="font-family:monospace;font-size:0.74rem">${k.id}</td>
                <td><strong>${k.nama}</strong></td>
                <td>${k.tipeKamar}</td>
                <td>Rp ${k.harga.toLocaleString('id-ID')}</td>
                <td style="text-align:center">${k.luasKamar}</td>
                <td style="text-align:center">${k.jarakTujuan}</td>
                <td>${k.status}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        ${ttdBlock}
        <div class="footnote">Laporan ini merupakan output komputasi objektif SPK Kikost. Rekomendasi bersifat pendukung keputusan dan tidak menggantikan pertimbangan individu.</div>
      `;
    }

    printWin.document.write(`<!DOCTYPE html><html><head><title>Laporan SPK Kikost</title>${sharedStyles}</head><body>${bodyContent}</body></html>`);
    printWin.document.close();
    setTimeout(() => {
      printWin.focus();
      printWin.print();
    }, 400);
    addToast('Laporan PDF berhasil dibuka untuk dicetak.', 'success');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '960px' }}>
      {/* 1. Header Page Title */}
      <div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--forest-green)', letterSpacing: '-0.02em' }}>
          Pengaturan Sistem & Data
        </h1>
        <p style={{ fontSize: '0.86rem', color: 'var(--muted-green)' }}>
          Kelola konfigurasi parameter SPK, data administrator, dan cadangan basis data.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* 2. Informasi SPK & Kampus Tujuan */}
        <div className="panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Building size={18} color="var(--emerald-green)" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--forest-green)' }}>
              Parameter SPK & Instansi
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Nama Aplikasi SPK</label>
              <input
                type="text"
                className="form-control"
                value={systemName}
                onChange={e => setSystemName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Kampus / Titik Acuan Jarak (C5)</label>
              <input
                type="text"
                className="form-control"
                value={targetCampus}
                onChange={e => setTargetCampus(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Tahun Akademik & Periode</label>
              <input
                type="text"
                className="form-control"
                value={academicPeriod}
                onChange={e => setAcademicPeriod(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Konsep Visual Aktif</label>
              <input
                type="text"
                disabled
                className="form-control"
                value="Verdant Living (Forest Green & Warm Ivory)"
                style={{ backgroundColor: 'var(--pale-green)', fontWeight: 600, color: 'var(--forest-green)' }}
              />
            </div>
          </div>
        </div>

        {/* 3. Profil Administrator */}
        <div className="panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <User size={18} color="var(--emerald-green)" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--forest-green)' }}>
              Profil Administrator Sistem
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Nama Lengkap</label>
              <input
                type="text"
                className="form-control"
                value={adminName}
                onChange={e => setAdminName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Administrator</label>
              <input
                type="email"
                className="form-control"
                value={adminEmail}
                onChange={e => setAdminEmail(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" className="btn btn-primary btn-lg">
            <Save size={16} />
            <span>Simpan Perubahan Pengaturan</span>
          </button>
        </div>
      </form>

      {/* 4. Pemeliharaan & Manajemen Basis Data */}
      <div className="panel" style={{ padding: '24px', backgroundColor: 'var(--warm-ivory)', borderColor: '#E2DAC8' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <Database size={18} color="var(--emerald-green)" />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--forest-green)' }}>
            Manajemen Basis Data & Cadangan
          </h3>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--dark-green)', marginBottom: '20px' }}>
          Amankan basis data alternatif kost dan konfigurasi kriteria secara lokal dalam format JSON, atau cetak laporan utama dalam format PDF.
        </p>

        {/* Ekspor Data */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--muted-green)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>
            Ekspor Data
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button className="btn btn-secondary" onClick={handleExportJSON}>
              <Download size={15} />
              <span>Ekspor Cadangan (JSON)</span>
            </button>
          </div>
        </div>

        {/* Cetak Laporan PDF */}
        <div style={{ borderTop: '1px solid #E2DAC8', paddingTop: '18px' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--muted-green)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>
            Cetak Laporan PDF
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              className="btn btn-secondary"
              onClick={() => handlePrintLaporan('rekomendasi')}
              style={{ display: 'flex', alignItems: 'center', gap: '7px' }}
            >
              <Award size={15} color="var(--emerald-green)" />
              <span>Laporan Rekomendasi</span>
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => handlePrintLaporan('kriteria')}
              style={{ display: 'flex', alignItems: 'center', gap: '7px' }}
            >
              <ClipboardList size={15} color="var(--emerald-green)" />
              <span>Laporan Kriteria & Bobot</span>
            </button>
            <button
              className="btn btn-primary"
              onClick={() => handlePrintLaporan('lengkap')}
              style={{ display: 'flex', alignItems: 'center', gap: '7px' }}
            >
              <Printer size={15} />
              <span>Laporan Lengkap (Semua)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
