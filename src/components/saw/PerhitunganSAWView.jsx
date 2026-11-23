/**
 * src/components/saw/PerhitunganSAWView.jsx
 * Antarmuka Analisis Perhitungan SAW (5 Tahap Berurutan):
 * 1. Matriks Keputusan Awal (X)
 * 2. Normalisasi Matriks (R)
 * 3. Pembobotan Nilai (W × R)
 * 4. Nilai Preferensi Akhir (V_i)
 * 5. Pemeringkatan Alternatif
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calculator,
  RotateCw,
  Info,
  CheckCircle2,
  Table as TableIcon,
  Layers,
  Award,
  ChevronRight,
  Sparkles,
  HelpCircle
} from 'lucide-react';

const TAHAP_ANALISIS = [
  { id: 1, label: '1. Matriks Keputusan (X)' },
  { id: 2, label: '2. Normalisasi (R)' },
  { id: 3, label: '3. Nilai Berbobot (W×R)' },
  { id: 4, label: '4. Nilai Preferensi (V)' },
  { id: 5, label: '5. Pemeringkatan' }
];

export default function PerhitunganSAWView() {
  const {
    sawResult,
    kriteriaList,
    isCalculating,
    runCalculation,
    setActivePage
  } = useApp();

  const [activeStep, setActiveStep] = useState(1);
  const [showFormulaInfo, setShowFormulaInfo] = useState(true);

  const { matrixX, minMax, matrixR, results, activeKostCount } = sawResult || {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. Header Page Title & Action */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--forest-green)', letterSpacing: '-0.02em' }}>
            Perhitungan Metode SAW
          </h1>
          <p style={{ fontSize: '0.86rem', color: 'var(--muted-green)' }}>
            Transparansi penuh 5 tahap perhitungan Simple Additive Weighting (SAW) secara terstruktur.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            className="btn btn-primary"
            onClick={runCalculation}
            disabled={isCalculating}
          >
            <RotateCw size={16} className={isCalculating ? 'animate-spin' : ''} />
            <span>{isCalculating ? 'Sedang Menghitung...' : 'Hitung Ulang SAW'}</span>
          </button>
        </div>
      </div>

      {/* 2. Banner Kelengkapan Data & Status SAW */}
      <div
        className="panel"
        style={{
          padding: '16px 20px',
          backgroundColor: 'var(--pale-green)',
          borderColor: 'var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <CheckCircle2 size={22} color="var(--emerald-green)" />
          <div>
            <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--forest-green)' }}>
              Data Alternatif Siap: {activeKostCount} Kost Aktif
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--dark-green)' }}>
              Semua kriteria wajib (C1 - C6) memiliki data lengkap dan siap dievaluasi secara matematis.
            </div>
          </div>
        </div>

        <button
          className="btn btn-outline btn-sm"
          onClick={() => setShowFormulaInfo(!showFormulaInfo)}
          style={{ backgroundColor: '#FFFFFF' }}
        >
          <HelpCircle size={15} />
          <span>{showFormulaInfo ? 'Sembunyikan Rumus' : 'Lihat Rumus & Penjelasan'}</span>
        </button>
      </div>

      {/* 3. Panel Penjelasan Rumus (Collapsible) */}
      {showFormulaInfo && (
        <div
          className="panel"
          style={{
            backgroundColor: 'var(--warm-ivory)',
            borderColor: '#E2D9C5',
            padding: '18px 22px'
          }}
        >
          <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--forest-green)', marginBottom: '8px' }}>
            Formulasi Matematis Simple Additive Weighting:
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', fontSize: '0.82rem' }}>
            <div style={{ backgroundColor: '#FFFFFF', padding: '10px 14px', borderRadius: '8px', borderLeft: '3px solid var(--emerald-green)' }}>
              <strong>Kriteria Benefit (Keuntungan):</strong>
              <div style={{ fontFamily: 'monospace', color: 'var(--forest-green)', marginTop: '4px', fontSize: '0.86rem' }}>
                r_ij = x_ij / Max(x_j)
              </div>
              <div style={{ color: 'var(--muted-green)', marginTop: '2px', fontSize: '0.74rem' }}>
                Semakin besar nilai asli, semakin tinggi nilai normalisasinya.
              </div>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', padding: '10px 14px', borderRadius: '8px', borderLeft: '3px solid var(--soft-coral)' }}>
              <strong>Kriteria Cost (Biaya/Beban):</strong>
              <div style={{ fontFamily: 'monospace', color: 'var(--forest-green)', marginTop: '4px', fontSize: '0.86rem' }}>
                r_ij = Min(x_j) / x_ij
              </div>
              <div style={{ color: 'var(--muted-green)', marginTop: '2px', fontSize: '0.74rem' }}>
                Semakin kecil harga atau jarak, semakin tinggi nilai normalisasinya.
              </div>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', padding: '10px 14px', borderRadius: '8px', borderLeft: '3px solid var(--forest-green)' }}>
              <strong>Nilai Preferensi Akhir:</strong>
              <div style={{ fontFamily: 'monospace', color: 'var(--forest-green)', marginTop: '4px', fontSize: '0.86rem' }}>
                V_i = ∑ ( w_j × r_ij )
              </div>
              <div style={{ color: 'var(--muted-green)', marginTop: '2px', fontSize: '0.74rem' }}>
                Perkalian bobot kriteria w_j dengan matriks ternormalisasi r_ij.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Stepper Navigasi 5 Tahap */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '4px'
        }}
      >
        {TAHAP_ANALISIS.map(t => {
          const isActive = activeStep === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveStep(t.id)}
              className="btn"
              style={{
                flex: 1,
                minWidth: '170px',
                padding: '11px 14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: isActive ? 'var(--forest-green)' : '#FFFFFF',
                color: isActive ? '#FFFFFF' : 'var(--dark-green)',
                borderColor: isActive ? 'var(--forest-green)' : 'var(--border-card)',
                boxShadow: isActive ? 'var(--shadow-md)' : 'none',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.84rem'
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* 5. Konten Tabel Sesuai Tahap Terpilih */}
      <div className="panel" style={{ padding: '24px' }}>
        {/* TAHAP 1: Matriks Keputusan Awal (X) */}
        {activeStep === 1 && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--forest-green)' }}>
                Tahap 1: Matriks Keputusan Awal (X)
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--muted-green)' }}>
                Nilai asli data alternatif kost untuk masing-masing kriteria sebelum normalisasi.
              </p>
            </div>

            <div className="table-container">
              <table className="verdant-table">
                <thead>
                  <tr>
                    <th>Alternatif Kost</th>
                    {kriteriaList.map(c => (
                      <th key={c.kode} className="text-right">
                        <div>{c.kode} ({c.tipe})</div>
                        <div style={{ fontSize: '0.7rem', fontWeight: 400, color: 'var(--muted-green)' }}>{c.satuan}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results && results.map(item => {
                    const kost = item.kostData;
                    return (
                      <tr key={kost.id}>
                        <td style={{ fontWeight: 700, color: 'var(--dark-green)' }}>
                          {kost.nama}
                        </td>
                        <td className="text-right">{kost.harga.toLocaleString('id-ID')}</td>
                        <td className="text-right">{kost.fasilitasKamar}</td>
                        <td className="text-right">{kost.kondisiKamar}</td>
                        <td className="text-right">{kost.luasKamar}</td>
                        <td className="text-right">{kost.jarakTujuan}</td>
                        <td className="text-right">{kost.fasilitasPendukung}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr style={{ backgroundColor: 'var(--warm-ivory)', fontWeight: 700 }}>
                    <td style={{ color: 'var(--forest-green)' }}>Nilai Max (X_j)</td>
                    {kriteriaList.map(c => (
                      <td key={c.kode} className="text-right" style={{ color: 'var(--forest-green)' }}>
                        {minMax?.[c.kode]?.max?.toLocaleString('id-ID') ?? 0}
                      </td>
                    ))}
                  </tr>
                  <tr style={{ backgroundColor: 'var(--warm-ivory)', fontWeight: 700 }}>
                    <td style={{ color: 'var(--soft-coral-dark)' }}>Nilai Min (X_j)</td>
                    {kriteriaList.map(c => (
                      <td key={c.kode} className="text-right" style={{ color: 'var(--soft-coral-dark)' }}>
                        {minMax?.[c.kode]?.min?.toLocaleString('id-ID') ?? 0}
                      </td>
                    ))}
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {/* TAHAP 2: Normalisasi Matriks (R) */}
        {activeStep === 2 && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--forest-green)' }}>
                Tahap 2: Normalisasi Matriks (R)
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--muted-green)' }}>
                Hasil pembagian data asli dengan batas Max (Benefit) atau Min dibagi nilai asli (Cost). Seluruh nilai berada pada interval [0, 1].
              </p>
            </div>

            <div className="table-container">
              <table className="verdant-table">
                <thead>
                  <tr>
                    <th>Alternatif Kost</th>
                    {kriteriaList.map(c => (
                      <th key={c.kode} className="text-right">
                        <div>{c.kode}</div>
                        <span className={`badge ${c.tipe === 'benefit' ? 'badge-benefit' : 'badge-cost'}`} style={{ fontSize: '0.66rem' }}>
                          {c.tipe}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results && results.map(item => {
                    const kost = item.kostData;
                    const r = matrixR?.[kost.id] || {};
                    return (
                      <tr key={kost.id}>
                        <td style={{ fontWeight: 700, color: 'var(--dark-green)' }}>
                          {kost.nama}
                        </td>
                        {kriteriaList.map(c => (
                          <td key={c.kode} className="text-right" style={{ fontFamily: 'monospace', fontWeight: 600 }}>
                            {r[c.kode] !== undefined ? r[c.kode].toFixed(4) : '0.0000'}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAHAP 3: Nilai Berbobot (W × R) */}
        {activeStep === 3 && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--forest-green)' }}>
                Tahap 3: Pembobotan Nilai (W × R)
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--muted-green)' }}>
                Nilai matriks normalisasi r_ij dikalikan dengan bobot w_j masing-masing kriteria.
              </p>
            </div>

            <div className="table-container">
              <table className="verdant-table">
                <thead>
                  <tr>
                    <th>Alternatif Kost</th>
                    {kriteriaList.map(c => (
                      <th key={c.kode} className="text-right">
                        <div>{c.kode} (w={c.bobot})</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--muted-green)' }}>{c.nama}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results && results.map(item => {
                    const kost = item.kostData;
                    const terbobot = item.nilaiTerbobot || {};
                    return (
                      <tr key={kost.id}>
                        <td style={{ fontWeight: 700, color: 'var(--dark-green)' }}>
                          {kost.nama}
                        </td>
                        {kriteriaList.map(c => (
                          <td key={c.kode} className="text-right" style={{ fontFamily: 'monospace', color: 'var(--forest-green)', fontWeight: 600 }}>
                            {terbobot[c.kode] !== undefined ? terbobot[c.kode].toFixed(4) : '0.0000'}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAHAP 4: Nilai Preferensi Akhir (V_i) */}
        {activeStep === 4 && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--forest-green)' }}>
                Tahap 4: Nilai Preferensi Akhir (V_i)
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--muted-green)' }}>
                Penjumlahan seluruh elemen berbobot: V_i = (w1·r_i1) + (w2·r_i2) + ... + (wn·r_in).
              </p>
            </div>

            <div className="table-container">
              <table className="verdant-table">
                <thead>
                  <tr>
                    <th>Alternatif Kost</th>
                    <th>Formula Kalkulasi Nilai Preferensi</th>
                    <th className="text-right" style={{ width: '180px' }}>Skor Akhir (V_i)</th>
                  </tr>
                </thead>
                <tbody>
                  {results && results.map(item => {
                    const kost = item.kostData;
                    const rincian = item.rincianPerhitungan;
                    const formulaText = rincian.map(r => r.kontribusi.toFixed(4)).join(' + ');
                    return (
                      <tr key={kost.id}>
                        <td style={{ fontWeight: 700, color: 'var(--dark-green)' }}>
                          {kost.nama}
                        </td>
                        <td style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: 'var(--muted-green)' }}>
                          {formulaText}
                        </td>
                        <td className="text-right" style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--emerald-green)', fontFamily: 'monospace' }}>
                          {item.skorAkhir.toFixed(4)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAHAP 5: Hasil Pemeringkatan */}
        {activeStep === 5 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--forest-green)' }}>
                  Tahap 5: Hasil Pemeringkatan Alternatif
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--muted-green)' }}>
                  Daftar diurutkan secara descending dari nilai preferensi tertinggi ke terendah.
                </p>
              </div>

              <button className="btn btn-primary" onClick={() => setActivePage('hasil')}>
                <span>Buka Tampilan Hasil & Peringkat</span>
                <ChevronRight size={15} />
              </button>
            </div>

            <div className="table-container">
              <table className="verdant-table">
                <thead>
                  <tr>
                    <th style={{ width: '70px' }}>Peringkat</th>
                    <th>Nama Kost</th>
                    <th>Tipe Kamar</th>
                    <th className="text-right">Harga Sewa</th>
                    <th className="text-right" style={{ width: '160px' }}>Skor Akhir (V_i)</th>
                    <th>Predikat Rekomendasi</th>
                  </tr>
                </thead>
                <tbody>
                  {results && results.map(item => {
                    const kost = item.kostData;
                    return (
                      <tr key={kost.id} style={{ backgroundColor: item.ranking === 1 ? 'var(--pale-green)' : 'transparent' }}>
                        <td>
                          {item.ranking === 1 ? (
                            <span className="badge badge-gold">#1</span>
                          ) : item.ranking === 2 ? (
                            <span className="badge badge-silver">#2</span>
                          ) : item.ranking === 3 ? (
                            <span className="badge badge-bronze">#3</span>
                          ) : (
                            <span style={{ fontWeight: 700, color: 'var(--muted-green)', paddingLeft: '8px' }}>
                              #{item.ranking}
                            </span>
                          )}
                        </td>
                        <td style={{ fontWeight: 700, color: 'var(--forest-green)' }}>
                          {kost.nama}
                        </td>
                        <td>{kost.tipeKamar}</td>
                        <td className="text-right">Rp {kost.harga.toLocaleString('id-ID')}/bln</td>
                        <td className="text-right" style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '0.95rem', color: 'var(--forest-green)' }}>
                          {item.skorAkhir.toFixed(4)}
                        </td>
                        <td>
                          <span
                            className="badge"
                            style={{
                              backgroundColor: item.ranking === 1 ? 'var(--mint-green)' : 'var(--warm-ivory)',
                              color: 'var(--forest-green)'
                            }}
                          >
                            {item.badgeTier}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
