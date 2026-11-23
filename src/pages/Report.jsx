// src/pages/Report.jsx
import { useRef, useState } from 'react';
import {
  FileText, Printer, Download, Trophy, CheckCircle2,
  Table, BarChart2, Calendar, Building,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import sawEngine from '../utils/sawEngine';

export default function Report() {
  const { kosts, criteria, sawResult, settings } = useApp();
  const ranked = sawResult?.ranked || [];
  const printRef = useRef();
  const [downloadMsg, setDownloadMsg] = useState('');

  const handlePrint = () => window.print();

  const showDownloadToast = (msg) => {
    setDownloadMsg(msg);
    setTimeout(() => setDownloadMsg(''), 3000);
  };

  const now = new Date().toLocaleDateString('id-ID', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  // Ekspor CSV Data Kost
  const exportKostsCSV = () => {
    const headers = ['ID', 'Nama Kost', 'Alamat', 'Status', 'Harga (Rp)', 'Jarak (km)', 'Luas (m2)', 'Kondisi Kamar', 'Fasilitas Kamar', 'Keamanan', 'Sanitasi'];
    const rows = kosts.map((k) => [
      k.id,
      `"${k.name.replace(/"/g, '""')}"`,
      `"${k.address.replace(/"/g, '""')}"`,
      k.status || 'tersedia',
      k.harga ?? k.price ?? 0,
      k.jarakTujuan ?? k.distance ?? 0,
      k.luasKamar ?? 16,
      k.kondisiKamar ?? 4,
      k.fasilitasKamar ?? 4,
      k.keamanan ?? 4,
      k.sanitasi ?? 4,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Data_Kost_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    showDownloadToast('Data kost berhasil diekspor ke CSV');
  };

  // Ekspor CSV Hasil Perangkingan SAW
  const exportHasilCSV = () => {
    const headers = ['Peringkat', 'Nama Kost', 'Alamat', 'Nilai Preferensi (Vi)', 'Status Ketersediaan', 'Keterangan'];
    const rows = ranked.map((k) => [
      k.rank,
      `"${k.name.replace(/"/g, '""')}"`,
      `"${k.address.replace(/"/g, '""')}"`,
      sawEngine.formatScore(k.score),
      k.status || 'tersedia',
      k.rank === 1 ? 'Rekomendasi Terbaik' : `Peringkat ${k.rank}`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Hasil_Pemeringkatan_SAW_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    showDownloadToast('Hasil pemeringkatan SAW berhasil diekspor ke CSV');
  };

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-header-title">
            <FileText size={28} />
            <span>Laporan &amp; <span className="highlight">Ekspor Data</span></span>
          </h1>
          <p className="page-header-subtitle">
            Cetak laporan resmi hasil evaluasi SPK, ekspor dataset alternatif kost, dan unduh rekapan pemeringkatan
          </p>
        </div>
      </div>

      {downloadMsg && (
        <div className="alert alert--success mb-4 no-print" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={16} /> {downloadMsg}
        </div>
      )}

      {/* Action Toolbar (Hidden in Print) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }} className="no-print">
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary" onClick={exportKostsCSV} id="btn-export-kost-csv">
            <Download size={15} /> Ekspor Data Kost (CSV)
          </button>
          <button className="btn btn-secondary" onClick={exportHasilCSV} id="btn-export-hasil-csv">
            <Download size={15} /> Ekspor Hasil SAW (CSV)
          </button>
        </div>

        <button className="btn btn-primary" onClick={handlePrint} id="btn-print-report" aria-label="Cetak laporan">
          <Printer size={16} /> Cetak Laporan / PDF
        </button>
      </div>

      {/* Report Preview Document */}
      <div className="report-container" id="report-preview" ref={printRef} style={{ background: '#ffffff', color: '#111827', borderRadius: '12px', padding: '40px', boxShadow: '0 4px 20px rgba(11,11,114,0.12)' }}>
        {/* Document Header / Kop */}
        <div className="report-header" style={{ borderBottom: '3px double #0B0B72', paddingBottom: '20px', marginBottom: '24px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0B0B72', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            LAPORAN HASIL KEPUTUSAN SISTEM PENDUKUNG KEPUTUSAN (SPK)
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0B0B72', marginTop: '4px' }}>
            Pemilihan Kost Terbaik — Metode Simple Additive Weighting (SAW)
          </div>
          <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '6px' }}>
            {settings.systemName || 'KiKost Bogor'} • Tanggal Cetak: {now}
          </div>
        </div>

        <div className="report-body">
          {/* Executive Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '28px' }}>
            {[
              { label: 'Jumlah Alternatif Kost', value: kosts.length },
              { label: 'Jumlah Kriteria Penilaian', value: criteria.length },
              { label: 'Alternatif Rekomendasi #1', value: ranked[0]?.name || '—' },
              { label: 'Nilai Preferensi Tertinggi', value: ranked[0] ? sawEngine.formatScore(ranked[0].score) : '—' },
            ].map(({ label, value }) => (
              <div key={label} style={{ textAlign: 'center', padding: '14px', background: '#f8fafc', border: '2px solid #0B0B72', borderRadius: '8px' }}>
                <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0B0B72' }}>{value}</div>
                <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: '4px' }}>{label}</div>
              </div>
            ))}
          </div>

          {/* 1. Kriteria & Bobot */}
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '10px', color: '#0B0B72', borderLeft: '4px solid #CFFF5E', paddingLeft: '10px', textTransform: 'uppercase' }}>
            1. Definisi Kriteria &amp; Bobot Kepentingan
          </h2>
          <table className="report-table" style={{ width: '100%', marginBottom: '28px', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: '#0B0B72', textAlign: 'left' }}>
                <th style={{ padding: '8px 10px', border: '1px solid #0B0B72', color: '#ffffff' }}>Kode</th>
                <th style={{ padding: '8px 10px', border: '1px solid #0B0B72', color: '#ffffff' }}>Nama Kriteria</th>
                <th style={{ padding: '8px 10px', border: '1px solid #0B0B72', color: '#ffffff' }}>Sifat Atribut</th>
                <th style={{ padding: '8px 10px', border: '1px solid #0B0B72', color: '#ffffff' }}>Satuan</th>
                <th style={{ padding: '8px 10px', border: '1px solid #0B0B72', color: '#ffffff' }}>Bobot (W)</th>
                <th style={{ padding: '8px 10px', border: '1px solid #0B0B72', color: '#ffffff' }}>Persentase</th>
              </tr>
            </thead>
            <tbody>
              {criteria.map((c) => (
                <tr key={c.id}>
                  <td style={{ padding: '8px 10px', border: '1px solid #e2e8f0', fontWeight: 600 }}>{c.kode || c.id}</td>
                  <td style={{ padding: '8px 10px', border: '1px solid #e2e8f0' }}>{c.name}</td>
                  <td style={{ padding: '8px 10px', border: '1px solid #e2e8f0' }}>{c.type === 'benefit' ? 'Benefit' : 'Cost'}</td>
                  <td style={{ padding: '8px 10px', border: '1px solid #e2e8f0' }}>{c.unit || '-'}</td>
                  <td style={{ padding: '8px 10px', border: '1px solid #e2e8f0' }}>{c.weight.toFixed(2)}</td>
                  <td style={{ padding: '8px 10px', border: '1px solid #e2e8f0' }}>{(c.weight * 100).toFixed(0)}%</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 2. Matriks Keputusan Alternatif */}
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '10px', color: '#0B0B72', borderLeft: '4px solid #CFFF5E', paddingLeft: '10px', textTransform: 'uppercase' }}>
            2. Matriks Keputusan Awal (X)
          </h2>
          <div style={{ overflowX: 'auto', marginBottom: '28px' }}>
            <table className="report-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
              <thead>
                <tr style={{ background: '#0B0B72', textAlign: 'left' }}>
                  <th style={{ padding: '8px 10px', border: '1px solid #0B0B72', color: '#ffffff' }}>Alternatif</th>
                  {criteria.map((c) => (
                    <th key={c.id} style={{ padding: '8px 10px', border: '1px solid #0B0B72', color: '#ffffff' }}>{c.kode || c.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {kosts.map((k, i) => (
                  <tr key={k.id}>
                    <td style={{ padding: '6px 10px', border: '1px solid #e2e8f0', fontWeight: 600 }}>
                      A{i + 1} - {k.name}
                    </td>
                    {criteria.map((c) => {
                      const val = k[c.key] ?? (c.key === 'harga' ? k.price : c.key === 'jarakTujuan' ? k.distance : 4);
                      return (
                        <td key={c.id} style={{ padding: '6px 10px', border: '1px solid #e2e8f0' }}>
                          {c.key === 'harga' || c.key === 'price' ? sawEngine.formatRupiah(val) : val}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 3. Hasil Perangkingan Akhir */}
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '10px', color: '#0B0B72', borderLeft: '4px solid #CFFF5E', paddingLeft: '10px', textTransform: 'uppercase' }}>
            3. Hasil Pemeringkatan &amp; Preferensi Akhir (V)
          </h2>
          <table className="report-table" style={{ width: '100%', marginBottom: '28px', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: '#0B0B72', textAlign: 'left' }}>
                <th style={{ padding: '8px 10px', border: '1px solid #0B0B72', color: '#ffffff' }}>Peringkat</th>
                <th style={{ padding: '8px 10px', border: '1px solid #0B0B72', color: '#ffffff' }}>Nama Alternatif Kost</th>
                <th style={{ padding: '8px 10px', border: '1px solid #0B0B72', color: '#ffffff' }}>Alamat</th>
                <th style={{ padding: '8px 10px', border: '1px solid #0B0B72', color: '#ffffff' }}>Nilai Preferensi (V<sub style={{ color: '#ffffff' }}>i</sub>)</th>
                <th style={{ padding: '8px 10px', border: '1px solid #0B0B72', color: '#ffffff' }}>Keterangan</th>
              </tr>
            </thead>
            <tbody>
              {ranked.map((k) => (
                <tr key={k.id}>
                  <td style={{ padding: '8px 10px', border: '1px solid #e2e8f0' }}>#{k.rank}</td>
                  <td style={{ padding: '8px 10px', border: '1px solid #e2e8f0', fontWeight: k.rank === 1 ? 700 : 400 }}>{k.name}</td>
                  <td style={{ padding: '8px 10px', border: '1px solid #e2e8f0' }}>{k.address}</td>
                  <td style={{ padding: '8px 10px', border: '1px solid #e2e8f0', color: '#0B0B72', fontWeight: 700 }}>
                    {sawEngine.formatScore(k.score)}
                  </td>
                  <td style={{ padding: '8px 10px', border: '1px solid #e2e8f0' }}>
                    {k.rank === 1 ? '🥇 Rekomendasi Terbaik' : k.rank === 2 ? '🥈 Peringkat 2' : k.rank === 3 ? '🥉 Peringkat 3' : 'Alternatif Tambahan'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 4. Rekomendasi Resmi */}
          {ranked[0] && (
            <div style={{ padding: '16px 20px', background: '#EEF2FF', border: '2px solid #0B0B72', borderRadius: '8px', marginBottom: '32px' }}>
              <div style={{ fontWeight: 700, color: '#0B0B72', marginBottom: '6px', fontSize: '0.95rem' }}>
                ✅ Rekomendasi Resmi Sistem
              </div>
              <p style={{ color: '#1e293b', fontSize: '0.85rem', lineHeight: 1.6, margin: 0 }}>
                Berdasarkan evaluasi metode <strong>Simple Additive Weighting (SAW)</strong> dengan memperhitungkan {criteria.length} kriteria terbobot,
                kost yang paling direkomendasikan adalah <strong>"{ranked[0].name}"</strong> dengan skor preferensi tertinggi <strong>{sawEngine.formatScore(ranked[0].score)}</strong>.
                Kost ini memenuhi kombinasi kriteria optimal dari segi harga, fasilitas, kondisi kamar, dan jarak strategis.
              </p>
            </div>
          )}

          {/* Tanda Tangan & Pengesahan */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', marginTop: '40px', paddingTop: '20px', borderTop: '2px solid #0B0B72', fontSize: '0.85rem', color: '#475569' }}>
            <div>
              <div>Mengetahui,</div>
              <div style={{ fontWeight: 600, marginTop: '4px', color: '#0B0B72' }}>Kepala Pengelola / Verifikator SPK</div>
              <div style={{ height: '60px' }}></div>
              <div style={{ fontWeight: 600, color: '#0f172a' }}>___________________________</div>
              <div style={{ fontSize: '0.75rem' }}>NIP / ID: ADM-2026-001</div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div>Bogor, {now}</div>
              <div style={{ fontWeight: 600, marginTop: '4px', color: '#0B0B72' }}>Staf Evaluator &amp; Administrator</div>
              <div style={{ height: '60px' }}></div>
              <div style={{ fontWeight: 600, color: '#0f172a' }}>{settings.adminUsername || 'Administrator'}</div>
              <div style={{ fontSize: '0.75rem' }}>Sistem Pendukung Keputusan KiKost Bogor</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
