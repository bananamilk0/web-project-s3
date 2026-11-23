/**
 * src/components/hasil/HasilPeringkatView.jsx
 * Halaman Hasil & Peringkat Rekomendasi Kost Terbaik (Showcase Utama)
 * - 3 Kartu Unggulan Teratas (Podium Visual Hierarki)
 * - Tabel Lengkap Seluruh Alternatif
 * - Panel Analisis Kontribusi Kriteria (Progress Bar Hijau)
 * - Disclaimer Resmi Sistem SPK
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Trophy,
  Award,
  Medal,
  Sparkles,
  MapPin,
  ExternalLink,
  ChevronRight,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  Eye,
  Info
} from 'lucide-react';

export default function HasilPeringkatView() {
  const { sawResult, kriteriaList } = useApp();
  const { results = [] } = sawResult || {};

  const top1 = results[0];
  const top2 = results[1];
  const top3 = results[2];

  // Selected kost for detailed criteria contribution analysis
  const [selectedKostId, setSelectedKostId] = useState(top1 ? top1.kostId : null);

  const selectedAlternative = results.find(r => r.kostId === selectedKostId) || top1;

  if (results.length === 0) {
    return (
      <div className="panel" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <Trophy size={48} color="var(--sage-green)" style={{ margin: '0 auto 16px', opacity: 0.6 }} />
        <h2 style={{ fontSize: '1.25rem', color: 'var(--forest-green)', fontWeight: 700 }}>
          Belum Ada Hasil Perhitungan
        </h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--muted-green)', marginTop: '6px' }}>
          Jalankan perhitungan SAW pada menu <em>Perhitungan SAW</em> untuk melihat perangkingan rekomendasi.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* 1. Header Page Title */}
      <div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
          <span className="badge badge-benefit" style={{ fontSize: '0.75rem' }}>
            <Sparkles size={13} />
            <span>Hasil Akhir Rekomendasi SPK</span>
          </span>
        </div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--forest-green)', letterSpacing: '-0.02em' }}>
          Hasil & Peringkat Kost Terbaik
        </h1>
        <p style={{ fontSize: '0.88rem', color: 'var(--muted-green)' }}>
          Peringkat alternatif berdasarkan kalkulasi Simple Additive Weighting dengan bobot preferensi aktif.
        </p>
      </div>

      {/* 2. Top 3 Cards Podium (Visual Hierarchy) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
          gap: '24px',
          alignItems: 'stretch'
        }}
      >
        {/* RANK #1: JUARA UTAMA (Paling Menonjol) */}
        {top1 && (
          <div
            className="panel"
            style={{
              padding: 0,
              overflow: 'hidden',
              border: '2px solid var(--emerald-green)',
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--shadow-lg)',
              position: 'relative',
              backgroundColor: '#FFFFFF',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Header Badge Pita Emas/Emerald */}
            <div
              style={{
                backgroundColor: 'var(--emerald-green)',
                color: '#FFFFFF',
                padding: '10px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.88rem' }}>
                <Trophy size={18} color="#FEF3C7" />
                <span>Peringkat #1 • Rekomendasi Utama</span>
              </div>
              <span style={{
                fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.7)',
                backgroundColor: 'rgba(0,0,0,0.15)', borderRadius: '20px',
                padding: '2px 8px', fontFamily: 'monospace', letterSpacing: '0.03em'
              }}>
                V={top1.skorAkhir.toFixed(4)}
              </span>
            </div>

            {/* Foto & Info */}
            <div style={{ height: '190px', width: '100%', position: 'relative' }}>
              <img
                src={top1.kostData.foto}
                alt={top1.kostData.nama}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '12px',
                  backgroundColor: 'rgba(23, 60, 50, 0.85)',
                  backdropFilter: 'blur(4px)',
                  color: '#FFFDF5',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '0.75rem',
                  fontWeight: 600
                }}
              >
                {top1.kostData.tipeKamar} • {top1.kostData.luasKamar} m²
              </div>
            </div>

            <div style={{ padding: '22px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--forest-green)', marginBottom: '4px' }}>
                {top1.kostData.nama}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.82rem', color: 'var(--muted-green)', marginBottom: '14px' }}>
                <MapPin size={13} style={{ flexShrink: 0 }} />
                <span>{top1.kostData.alamat}</span>
              </div>

              {/* Harga & Jarak */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  backgroundColor: 'var(--pale-green)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '16px'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--muted-green)', fontWeight: 600 }}>HARGA SEWA</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--forest-green)', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'baseline', gap: '3px' }}>
                    <span>Rp {top1.kostData.harga.toLocaleString('id-ID')}</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted-green)', whiteSpace: 'nowrap' }}>/bln</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--muted-green)', fontWeight: 600 }}>JARAK KAMPUS</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--dark-green)' }}>
                    {top1.kostData.jarakTujuan} km
                  </div>
                </div>
              </div>

              <button
                className="btn btn-primary"
                onClick={() => setSelectedKostId(top1.kostId)}
                style={{ marginTop: 'auto', width: '100%' }}
              >
                <BarChart3 size={15} />
                <span>Lihat Analisis Kontribusi Skor</span>
              </button>
            </div>
          </div>
        )}

        {/* RANK #2: UNGGULAN KEDUA */}
        {top2 && (
          <div
            className="panel"
            style={{
              padding: 0,
              overflow: 'hidden',
              borderRadius: 'var(--radius-xl)',
              position: 'relative',
              backgroundColor: '#FFFFFF',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div
              style={{
                backgroundColor: 'var(--forest-green)',
                color: '#FFFFFF',
                padding: '10px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.88rem' }}>
                <Medal size={18} color="#E2E8F0" />
                <span>Peringkat #2 • Alternatif Unggulan</span>
              </div>
              <span style={{
                fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.65)',
                backgroundColor: 'rgba(0,0,0,0.15)', borderRadius: '20px',
                padding: '2px 8px', fontFamily: 'monospace', letterSpacing: '0.03em'
              }}>
                V={top2.skorAkhir.toFixed(4)}
              </span>
            </div>

            <div style={{ height: '170px', width: '100%', position: 'relative' }}>
              <img
                src={top2.kostData.foto}
                alt={top2.kostData.nama}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '12px',
                  backgroundColor: 'rgba(23, 60, 50, 0.85)',
                  backdropFilter: 'blur(4px)',
                  color: '#FFFDF5',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '0.75rem',
                  fontWeight: 600
                }}
              >
                {top2.kostData.tipeKamar} • {top2.kostData.luasKamar} m²
              </div>
            </div>

            <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--forest-green)', marginBottom: '4px' }}>
                {top2.kostData.nama}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.82rem', color: 'var(--muted-green)', marginBottom: '14px' }}>
                <MapPin size={13} style={{ flexShrink: 0 }} />
                <span>{top2.kostData.alamat}</span>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  backgroundColor: 'var(--pale-green)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '16px'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--muted-green)', fontWeight: 600 }}>HARGA SEWA</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--forest-green)', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'baseline', gap: '3px' }}>
                    <span>Rp {top2.kostData.harga.toLocaleString('id-ID')}</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted-green)', whiteSpace: 'nowrap' }}>/bln</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--muted-green)', fontWeight: 600 }}>JARAK KAMPUS</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--dark-green)' }}>
                    {top2.kostData.jarakTujuan} km
                  </div>
                </div>
              </div>

              <button
                className="btn btn-secondary"
                onClick={() => setSelectedKostId(top2.kostId)}
                style={{ marginTop: 'auto', width: '100%' }}
              >
                <BarChart3 size={15} />
                <span>Lihat Analisis Kontribusi Skor</span>
              </button>
            </div>
          </div>
        )}

        {/* RANK #3: ALTERNATIF PILIHAN KETIGA */}
        {top3 && (
          <div
            className="panel"
            style={{
              padding: 0,
              overflow: 'hidden',
              borderRadius: 'var(--radius-xl)',
              position: 'relative',
              backgroundColor: '#FFFFFF',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div
              style={{
                backgroundColor: 'var(--forest-green-light)',
                color: '#FFFFFF',
                padding: '10px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.88rem' }}>
                <Award size={18} color="#FFEDD5" />
                <span>Peringkat #3 • Pilihan Alternatif</span>
              </div>
              <span style={{
                fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.65)',
                backgroundColor: 'rgba(0,0,0,0.15)', borderRadius: '20px',
                padding: '2px 8px', fontFamily: 'monospace', letterSpacing: '0.03em'
              }}>
                V={top3.skorAkhir.toFixed(4)}
              </span>
            </div>

            <div style={{ height: '170px', width: '100%', position: 'relative' }}>
              <img
                src={top3.kostData.foto}
                alt={top3.kostData.nama}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '12px',
                  backgroundColor: 'rgba(23, 60, 50, 0.85)',
                  backdropFilter: 'blur(4px)',
                  color: '#FFFDF5',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '0.75rem',
                  fontWeight: 600
                }}
              >
                {top3.kostData.tipeKamar} • {top3.kostData.luasKamar} m²
              </div>
            </div>

            <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--forest-green)', marginBottom: '4px' }}>
                {top3.kostData.nama}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.82rem', color: 'var(--muted-green)', marginBottom: '14px' }}>
                <MapPin size={13} style={{ flexShrink: 0 }} />
                <span>{top3.kostData.alamat}</span>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  backgroundColor: 'var(--pale-green)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '16px'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--muted-green)', fontWeight: 600 }}>HARGA SEWA</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--forest-green)', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'baseline', gap: '3px' }}>
                    <span>Rp {top3.kostData.harga.toLocaleString('id-ID')}</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted-green)', whiteSpace: 'nowrap' }}>/bln</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--muted-green)', fontWeight: 600 }}>JARAK KAMPUS</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--dark-green)' }}>
                    {top3.kostData.jarakTujuan} km
                  </div>
                </div>
              </div>

              <button
                className="btn btn-secondary"
                onClick={() => setSelectedKostId(top3.kostId)}
                style={{ marginTop: 'auto', width: '100%' }}
              >
                <BarChart3 size={15} />
                <span>Lihat Analisis Kontribusi Skor</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. Panel Analisis Kontribusi Kriteria terhadap Skor Akhir */}
      {selectedAlternative && (
        <div
          className="panel"
          style={{
            padding: '24px',
            backgroundColor: 'var(--warm-ivory)',
            borderColor: '#E2DAC8'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--emerald-green)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF'
                }}
              >
                <BarChart3 size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--forest-green)' }}>
                  Analisis Dekomposisi Skor: {selectedAlternative.kostData.nama}
                </h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--muted-green)' }}>
                  Peringkat #{selectedAlternative.ranking} • Skor Total V_i = {selectedAlternative.skorAkhir.toFixed(4)}
                </span>
              </div>
            </div>

            {/* Selector Kost */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--dark-green)' }}>Pilih Alternatif:</span>
              <select
                value={selectedKostId}
                onChange={e => setSelectedKostId(e.target.value)}
                className="form-control form-select"
                style={{ width: '220px', padding: '7px 28px 7px 12px', fontSize: '0.85rem' }}
              >
                {results.map(r => (
                  <option key={r.kostId} value={r.kostId}>
                    #{r.ranking} {r.kostData.nama} ({r.skorAkhir})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Progress Bars Kontribusi 6 Kriteria */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginTop: '16px' }}>
            {selectedAlternative.rincianPerhitungan.map(r => {
              const pctOfScore = selectedAlternative.skorAkhirRaw > 0
                ? ((r.kontribusi / selectedAlternative.skorAkhirRaw) * 100)
                : 0;

              return (
                <div
                  key={r.kriteriaKode}
                  style={{
                    backgroundColor: '#FFFFFF',
                    padding: '14px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-light)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--forest-green)' }}>
                      {r.kriteriaKode}: {r.kriteriaNama}
                    </span>
                    <span className={`badge ${r.tipe === 'benefit' ? 'badge-benefit' : 'badge-cost'}`} style={{ fontSize: '0.66rem' }}>
                      {r.tipe}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--muted-green)', marginBottom: '8px' }}>
                    <span>Nilai Asli: <strong>{r.nilaiAsli} {r.satuan}</strong></span>
                    <span>Kontribusi: <strong>{r.kontribusi.toFixed(4)}</strong> ({pctOfScore.toFixed(1)}%)</span>
                  </div>

                  {/* Progress Bar Hijau */}
                  <div
                    style={{
                      height: '7px',
                      backgroundColor: 'var(--pale-green)',
                      borderRadius: 'var(--radius-pill)',
                      overflow: 'hidden'
                    }}
                  >
                    <div
                      style={{
                        width: `${Math.min(pctOfScore, 100)}%`,
                        height: '100%',
                        backgroundColor: 'var(--emerald-green)',
                        borderRadius: 'var(--radius-pill)'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Tabel Lengkap Seluruh Alternatif */}
      <div className="panel" style={{ padding: '24px' }}>
        <div style={{ marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--forest-green)' }}>
            Tabel Peringkat Lengkap Alternatif Kost
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--muted-green)' }}>
            Menampilkan seluruh alternatif aktif terurut berdasarkan nilai preferensi SAW.
          </p>
        </div>

        <div className="table-container">
          <table className="verdant-table">
            <thead>
              <tr>
                <th style={{ width: '70px' }}>Peringkat</th>
                <th>Foto & Nama Kost</th>
                <th>Tipe</th>
                <th className="text-right">Harga Sewa</th>
                <th className="text-center">Luas</th>
                <th className="text-center">Jarak</th>
                <th style={{ width: '180px' }}>Nilai Preferensi</th>
                <th className="text-center">Status</th>
                <th className="text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {results.map(item => {
                const kost = item.kostData;
                const isSelected = item.kostId === selectedKostId;

                return (
                  <tr
                    key={kost.id}
                    style={{
                      backgroundColor: isSelected ? 'var(--pale-green)' : 'transparent',
                      transition: 'background var(--transition-fast)'
                    }}
                  >
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
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={kost.foto}
                          alt={kost.nama}
                          style={{ width: '42px', height: '42px', borderRadius: '8px', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--dark-green)' }}>{kost.nama}</div>
                          <div style={{ fontSize: '0.74rem', color: 'var(--muted-green)' }}>{kost.alamat}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-cost" style={{ fontSize: '0.72rem' }}>
                        {kost.tipeKamar}
                      </span>
                    </td>
                    <td className="text-right" style={{ fontWeight: 700, color: 'var(--forest-green)', whiteSpace: 'nowrap' }}>
                      Rp {kost.harga.toLocaleString('id-ID')}/bln
                    </td>
                    <td className="text-center">{kost.luasKamar} m²</td>
                    <td className="text-center">{kost.jarakTujuan} km</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontFamily: 'monospace', fontWeight: 800, color: 'var(--forest-green)', minWidth: '48px' }}>
                          {item.skorAkhir.toFixed(4)}
                        </span>
                        <div
                          style={{
                            flex: 1,
                            height: '7px',
                            backgroundColor: 'var(--pale-green)',
                            borderRadius: 'var(--radius-pill)',
                            overflow: 'hidden'
                          }}
                        >
                          <div
                            style={{
                              width: `${item.skorAkhir * 100}%`,
                              height: '100%',
                              backgroundColor: 'var(--emerald-green)',
                              borderRadius: 'var(--radius-pill)'
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="text-center">
                      <span className={`badge ${kost.status === 'Tersedia' ? 'badge-available' : 'badge-full'}`}>
                        {kost.status}
                      </span>
                    </td>
                    <td className="text-center">
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setSelectedKostId(kost.id)}
                      >
                        Analisis
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Catatan Disclaimer Resmi Sistem */}
      <div
        className="panel"
        style={{
          padding: '18px 24px',
          backgroundColor: 'var(--pale-green)',
          borderColor: 'var(--border-light)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px'
        }}
      >
        <Info size={20} color="var(--emerald-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div style={{ fontSize: '0.84rem', color: 'var(--dark-green)', lineHeight: 1.55 }}>
          <strong>Pernyataan Akurasi & Rekomendasi:</strong> Hasil pemeringkatan di atas merupakan output komputasi objektif metode <em>Simple Additive Weighting (SAW)</em> berdasarkan kriteria dan bobot yang ditetapkan oleh pihak administrator. Rekomendasi ini dimaksudkan sebagai pendukung keputusan dan tidak mengeliminasi pertimbangan preferensi individual pencari kost.
        </div>
      </div>
    </div>
  );
}
