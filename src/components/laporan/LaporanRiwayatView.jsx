/**
 * src/components/laporan/LaporanRiwayatView.jsx
 * Modul Laporan Resmi & Riwayat Historis Perhitungan SAW:
 * - Print PDF: Laporan Rekomendasi, Kriteria & Bobot, Riwayat, dan Laporan Lengkap Gabungan
 * - Ekspor CSV Hasil Peringkat
 * - Tab Riwayat Perhitungan Historis
 */

import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  Printer,
  Download,
  Calendar,
  Layers,
  CheckCircle2,
  Clock,
  Sparkles,
  Award,
  BarChart3,
  ClipboardList,
  BookOpen,
  ChevronDown,
  X
} from 'lucide-react';

export default function LaporanRiwayatView() {
  const {
    sawResult,
    kriteriaList,
    calculationHistory,
    kostList,
    appSettings
  } = useApp();

  const [activeTab, setActiveTab] = useState('laporan'); // 'laporan' | 'riwayat'
  const [printMenuOpen, setPrintMenuOpen] = useState(false);
  const [activePrintPreview, setActivePrintPreview] = useState(null); // null | 'rekomendasi' | 'kriteria' | 'riwayat' | 'lengkap'

  const tanggalLaporan = new Date().toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  const namaAdmin = appSettings?.adminName || 'Administrator Sistem';
  const namaAplikasi = appSettings?.systemName || 'Kikost - SPK Kost Terbaik';

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    if (!sawResult?.results) return;
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Peringkat,Nama Kost,Tipe,Alamat,Harga/Bulan,Skor Preferensi\n';
    sawResult.results.forEach(item => {
      const row = [
        item.ranking,
        `"${item.kostData.nama}"`,
        item.kostData.tipeKamar,
        `"${item.kostData.alamat}"`,
        item.kostData.harga,
        item.skorAkhir
      ].join(',');
      csvContent += row + '\n';
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Laporan_SPK_Kikost_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print a specific section via new window
  const handlePrintReport = (type) => {
    setPrintMenuOpen(false);
    const printWin = window.open('', '_blank', 'width=900,height=700');
    if (!printWin) return;

    const results = sawResult?.results || [];
    const topKost = results[0];

    let bodyContent = '';

    const sharedStyles = `
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Segoe UI', Arial, sans-serif; color: #1a3c2e; background: #fff; padding: 32px; }
        h1 { font-size: 1.3rem; font-weight: 800; margin-bottom: 4px; }
        h2 { font-size: 1.1rem; font-weight: 700; margin: 20px 0 10px; color: #174D3B; border-bottom: 2px solid #174D3B; padding-bottom: 6px; }
        h3 { font-size: 0.98rem; font-weight: 700; margin: 14px 0 6px; }
        p { font-size: 0.88rem; color: #4a7060; margin-bottom: 6px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 0.84rem; }
        th { background: #174D3B; color: #fff; padding: 8px 10px; text-align: left; }
        td { padding: 7px 10px; border-bottom: 1px solid #dde8dc; }
        tr:nth-child(even) td { background: #f0f7ef; }
        .header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 16px; border-bottom: 3px solid #174D3B; margin-bottom: 22px; }
        .logo { display: flex; align-items: center; gap: 12px; }
        .logo-icon { width: 44px; height: 44px; background: #174D3B; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
        .logo-icon svg { display: block; }
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
    } else if (type === 'riwayat') {
      bodyContent = `
        ${headerBlock}
        <h1 style="text-align:center;text-transform:uppercase;margin-bottom:4px">Laporan Riwayat Komputasi SAW</h1>
        <p style="text-align:center">Arsip Historis Seluruh Eksekusi Perhitungan SPK Kikost</p>

        <h2>Arsip Riwayat Perhitungan SAW</h2>
        <table>
          <thead><tr><th>Waktu Eksekusi</th><th>Konfigurasi Bobot</th><th style="text-align:center">Jml. Alternatif</th><th>Juara #1</th><th style="text-align:right">Skor Juara</th><th style="text-align:center">Status</th></tr></thead>
          <tbody>
            ${calculationHistory.map(hist => `
              <tr>
                <td style="font-size:0.78rem">${new Date(hist.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })} • ${new Date(hist.tanggal).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</td>
                <td style="font-size:0.74rem;font-family:monospace;color:#5a8070">${hist.ringkasanBobot}</td>
                <td style="text-align:center">${hist.totalAlternatif} Kost</td>
                <td><strong>${hist.juara1}</strong></td>
                <td style="text-align:right;font-family:monospace;font-weight:700">${Number(hist.skorJuara1).toFixed(4)}</td>
                <td style="text-align:center"><span class="badge-benefit">${hist.status}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <p style="margin-top:12px;font-size:0.8rem">Total eksekusi tercatat: <strong>${calculationHistory.length}</strong></p>
        ${ttdBlock}
      `;
    } else if (type === 'lengkap') {
      bodyContent = `
        ${headerBlock}
        <h1 style="text-align:center;text-transform:uppercase;margin-bottom:4px">Laporan Lengkap SPK Pemilihan Kost</h1>
        <p style="text-align:center">Laporan Gabungan — Rekomendasi, Kriteria & Bobot, Riwayat Komputasi</p>

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

        <h2>IV. Riwayat Komputasi SAW</h2>
        <table>
          <thead><tr><th>Waktu</th><th>Konfigurasi Bobot</th><th style="text-align:center">Alternatif</th><th>Juara #1</th><th style="text-align:right">Skor</th></tr></thead>
          <tbody>
            ${calculationHistory.map(hist => `
              <tr>
                <td style="font-size:0.76rem">${new Date(hist.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                <td style="font-size:0.72rem;font-family:monospace;color:#5a8070">${hist.ringkasanBobot}</td>
                <td style="text-align:center">${hist.totalAlternatif}</td>
                <td>${hist.juara1}</td>
                <td style="text-align:right;font-family:monospace;font-weight:700">${Number(hist.skorJuara1).toFixed(4)}</td>
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
  };

  const PRINT_OPTIONS = [
    { type: 'rekomendasi', label: 'Laporan Rekomendasi', icon: Award, desc: 'Peringkat & skor semua alternatif kost' },
    { type: 'kriteria', label: 'Laporan Kriteria & Bobot', icon: ClipboardList, desc: 'Konfigurasi kriteria & formulasi SAW' },
    { type: 'riwayat', label: 'Laporan Riwayat', icon: Clock, desc: 'Arsip historis semua eksekusi SAW' },
    { type: 'lengkap', label: 'Laporan Lengkap (Gabungan)', icon: BookOpen, desc: 'Semua laporan dalam satu dokumen PDF' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. Header Page Title & Sub Tabs */}
      <div className="no-print" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--forest-green)', letterSpacing: '-0.02em' }}>
            Laporan & Riwayat Perhitungan
          </h1>
          <p style={{ fontSize: '0.86rem', color: 'var(--muted-green)' }}>
            Cetak dokumen hasil rekomendasi resmi atau pantau arsip historis komputasi.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Tab Switcher */}
          <div
            style={{
              display: 'flex',
              backgroundColor: 'var(--pale-green)',
              padding: '4px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-light)'
            }}
          >
            <button
              onClick={() => setActiveTab('laporan')}
              style={{
                padding: '6px 14px', borderRadius: '6px', border: 'none',
                background: activeTab === 'laporan' ? '#FFFFFF' : 'transparent',
                color: activeTab === 'laporan' ? 'var(--forest-green)' : 'var(--muted-green)',
                fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer'
              }}
            >
              Laporan Rekomendasi
            </button>
            <button
              onClick={() => setActiveTab('riwayat')}
              style={{
                padding: '6px 14px', borderRadius: '6px', border: 'none',
                background: activeTab === 'riwayat' ? '#FFFFFF' : 'transparent',
                color: activeTab === 'riwayat' ? 'var(--forest-green)' : 'var(--muted-green)',
                fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer'
              }}
            >
              Riwayat Perhitungan
            </button>
          </div>

          {activeTab === 'laporan' && (
            <>
              <button className="btn btn-secondary" onClick={handleExportCSV}>
                <Download size={15} />
                <span>Ekspor CSV</span>
              </button>

              {/* Print PDF Dropdown */}
              <div style={{ position: 'relative' }}>
                <button
                  className="btn btn-primary"
                  onClick={() => setPrintMenuOpen(prev => !prev)}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Printer size={15} />
                  <span>Cetak / Simpan PDF</span>
                  <ChevronDown size={13} style={{ transform: printMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </button>

                {printMenuOpen && (
                  <>
                    {/* Overlay to close */}
                    <div
                      style={{ position: 'fixed', inset: 0, zIndex: 49 }}
                      onClick={() => setPrintMenuOpen(false)}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        top: 'calc(100% + 8px)',
                        right: 0,
                        zIndex: 50,
                        backgroundColor: '#FFFFFF',
                        border: '1px solid var(--border-card)',
                        borderRadius: 'var(--radius-lg)',
                        boxShadow: 'var(--shadow-lg)',
                        minWidth: '300px',
                        overflow: 'hidden'
                      }}
                    >
                      <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FileText size={15} color="var(--emerald-green)" />
                        <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--forest-green)' }}>Pilih Jenis Laporan PDF</span>
                      </div>
                      {PRINT_OPTIONS.map(opt => {
                        const Icon = opt.icon;
                        return (
                          <button
                            key={opt.type}
                            onClick={() => handlePrintReport(opt.type)}
                            style={{
                              display: 'flex', alignItems: 'flex-start', gap: '12px',
                              width: '100%', padding: '12px 16px', border: 'none', background: 'transparent',
                              cursor: 'pointer', textAlign: 'left', transition: 'background 0.15s'
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = 'var(--pale-green)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                          >
                            <div style={{ width: '34px', height: '34px', borderRadius: '8px', backgroundColor: 'var(--pale-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <Icon size={17} color="var(--forest-green)" />
                            </div>
                            <div>
                              <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--forest-green)' }}>{opt.label}</div>
                              <div style={{ fontSize: '0.76rem', color: 'var(--muted-green)' }}>{opt.desc}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* 2. TAB 1: LEMBAR DOKUMEN LAPORAN RESMI (Printable Layout) */}
      {activeTab === 'laporan' && (
        <div
          className="panel"
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-xl)',
            padding: '48px',
            maxWidth: '1000px',
            margin: '0 auto',
            width: '100%',
            boxShadow: 'var(--shadow-md)',
            border: '1px solid var(--border-card)'
          }}
        >
          {/* Kop Dokumen Laporan Resmi */}
          <div
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              paddingBottom: '24px', borderBottom: '2px solid var(--forest-green)', marginBottom: '28px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '48px', height: '48px', borderRadius: '12px',
                  backgroundColor: 'var(--forest-green)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', color: '#FFFDF5'
                }}
              >
                <Sparkles size={26} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--forest-green)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                  Kikost System
                </h2>
                <div style={{ fontSize: '0.84rem', color: 'var(--muted-green)', fontWeight: 600 }}>
                  SISTEM PENDUKUNG KEPUTUSAN PEMILIHAN KOST TERBAIK
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'right', fontSize: '0.8rem', color: 'var(--muted-green)' }}>
              <div>Nomor Dokumen: <strong>SPK-KW/{new Date().getFullYear()}/04</strong></div>
              <div>Tanggal Pembuatan: <strong>{tanggalLaporan}</strong></div>
              <div>Status Hasil: <span style={{ color: 'var(--emerald-green)', fontWeight: 700 }}>Resmi / Sah</span></div>
            </div>
          </div>

          {/* Judul Laporan */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--forest-green)', textTransform: 'uppercase' }}>
              Laporan Akhir Rekomendasi Pemilihan Kost
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--muted-green)', marginTop: '4px' }}>
              Metode Simple Additive Weighting (SAW) • Konsep Verdant Living
            </p>
          </div>

          {/* Bagian 1: Ringkasan Eksekutif */}
          <div style={{ marginBottom: '28px', backgroundColor: 'var(--warm-ivory)', padding: '16px 20px', borderRadius: 'var(--radius-md)' }}>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--forest-green)', marginBottom: '8px' }}>
              I. Ringkasan Eksekutif Evaluasi
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', fontSize: '0.82rem' }}>
              <div>Total Alternatif Terdaftar: <strong>{kostList.length} Kost</strong></div>
              <div>Alternatif Aktif Dihitung: <strong>{sawResult?.activeKostCount || 0} Kost</strong></div>
              <div>Jumlah Kriteria Evaluasi: <strong>{kriteriaList.length} Kriteria</strong></div>
              <div>Rekomendasi Utama: <strong style={{ color: 'var(--forest-green)' }}>{sawResult?.results?.[0]?.kostData?.nama || '-'}</strong></div>
            </div>
          </div>

          {/* Bagian 2: Kriteria & Bobot yang Digunakan */}
          <div style={{ marginBottom: '28px' }}>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--forest-green)', marginBottom: '10px' }}>
              II. Konfigurasi Kriteria & Bobot Penilaian (W)
            </h4>
            <table className="verdant-table">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>Kode</th>
                  <th>Nama Kriteria</th>
                  <th style={{ width: '90px' }}>Tipe</th>
                  <th style={{ width: '100px' }} className="text-right">Bobot (w_j)</th>
                  <th style={{ width: '80px' }} className="text-right">Persentase</th>
                </tr>
              </thead>
              <tbody>
                {kriteriaList.map(c => (
                  <tr key={c.kode}>
                    <td style={{ fontWeight: 700 }}>{c.kode}</td>
                    <td>{c.nama}</td>
                    <td>
                      <span className={`badge ${c.tipe === 'benefit' ? 'badge-benefit' : 'badge-cost'}`} style={{ fontSize: '0.68rem' }}>
                        {c.tipe}
                      </span>
                    </td>
                    <td className="text-right" style={{ fontFamily: 'monospace' }}>{c.bobot.toFixed(2)}</td>
                    <td className="text-right" style={{ fontWeight: 700 }}>{Math.round(c.bobot * 100)}%</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ backgroundColor: 'var(--pale-green)', fontWeight: 700 }}>
                  <td colSpan="3" style={{ color: 'var(--forest-green)' }}>Total Akumulasi Bobot</td>
                  <td className="text-right" style={{ fontFamily: 'monospace', color: 'var(--forest-green)' }}>1.00</td>
                  <td className="text-right" style={{ color: 'var(--forest-green)' }}>100%</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Bagian 3: Tabel Hasil Akhir & Peringkat */}
          <div style={{ marginBottom: '36px' }}>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--forest-green)', marginBottom: '10px' }}>
              III. Peringkat Akhir Rekomendasi (Descending V_i)
            </h4>
            <table className="verdant-table">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>Rank</th>
                  <th>Nama Alternatif Kost</th>
                  <th>Tipe Kamar</th>
                  <th>Alamat</th>
                  <th className="text-right">Harga / Bln</th>
                  <th className="text-right" style={{ width: '130px' }}>Nilai Akhir (V_i)</th>
                </tr>
              </thead>
              <tbody>
                {sawResult?.results?.map(item => (
                  <tr key={item.kostId} style={{ backgroundColor: item.ranking === 1 ? 'var(--pale-green)' : 'transparent' }}>
                    <td style={{ fontWeight: 700, textAlign: 'center' }}>
                      #{item.ranking}
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--dark-green)' }}>
                      {item.kostData.nama}
                    </td>
                    <td>{item.kostData.tipeKamar}</td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--muted-green)' }}>{item.kostData.alamat}</td>
                    <td className="text-right">Rp {item.kostData.harga.toLocaleString('id-ID')}</td>
                    <td className="text-right" style={{ fontFamily: 'monospace', fontWeight: 800, color: 'var(--forest-green)' }}>
                      {item.skorAkhir.toFixed(4)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tanda Tangan Pengesahan Administrator */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '40px', paddingRight: '20px' }}>
            <div style={{ textAlign: 'center', minWidth: '220px' }}>
              <div style={{ fontSize: '0.82rem', color: 'var(--muted-green)', marginBottom: '60px' }}>
                Yogyakarta, {tanggalLaporan}<br />
                <strong>Administrator Sistem SPK</strong>
              </div>
              <div style={{ fontWeight: 800, color: 'var(--forest-green)', textDecoration: 'underline' }}>
                ( {namaAdmin} )
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--muted-green)' }}>
                NIP / ID: 2025.SPK.001
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. TAB 2: RIWAYAT PERHITUNGAN */}
      {activeTab === 'riwayat' && (
        <div className="panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Clock size={18} color="var(--emerald-green)" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--forest-green)' }}>
                Arsip Historis Komputasi SAW
              </h3>
            </div>
            <button className="btn btn-secondary" onClick={() => handlePrintReport('riwayat')}>
              <Printer size={14} />
              <span>Print PDF Riwayat</span>
            </button>
          </div>

          <div className="table-container">
            <table className="verdant-table">
              <thead>
                <tr>
                  <th>Waktu Eksekusi</th>
                  <th>Konfigurasi Bobot yang Digunakan</th>
                  <th className="text-center">Jumlah Alternatif</th>
                  <th>Juara Peringkat #1</th>
                  <th className="text-right">Skor Juara</th>
                  <th className="text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {calculationHistory.map(hist => (
                  <tr key={hist.id}>
                    <td style={{ fontWeight: 600, color: 'var(--dark-green)' }}>
                      {new Date(hist.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })} • {new Date(hist.tanggal).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td style={{ fontSize: '0.78rem', fontFamily: 'monospace', color: 'var(--muted-green)' }}>
                      {hist.ringkasanBobot}
                    </td>
                    <td className="text-center">{hist.totalAlternatif} Kost</td>
                    <td style={{ fontWeight: 700, color: 'var(--forest-green)' }}>
                      {hist.juara1}
                    </td>
                    <td className="text-right" style={{ fontFamily: 'monospace', fontWeight: 700 }}>
                      {Number(hist.skorJuara1).toFixed(4)}
                    </td>
                    <td className="text-center">
                      <span className="badge badge-benefit">{hist.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
