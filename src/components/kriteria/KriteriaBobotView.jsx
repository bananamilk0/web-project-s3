/**
 * src/components/kriteria/KriteriaBobotView.jsx
 * Manajemen Kriteria & Bobot Penilaian SPK SAW:
 * - 6 Kriteria dengan Tipe Benefit & Cost
 * - Input Numerik & Slider Tersinkronisasi
 * - Indikator Total Bobot Real-Time (Wajib 1.00 / 100%)
 * - Penyimpanan Versi Konfigurasi & Histori Perubahan
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { validateTotalBobot } from '../../data/kriteriaConfig';
import {
  SlidersHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Save,
  Clock,
  History,
  Info,
  Layers,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function KriteriaBobotView() {
  const {
    kriteriaList,
    updateKriteriaBobot,
    saveKriteriaVersion,
    kriteriaVersions,
    applyKriteriaVersion,
    resetKriteriaDefault
  } = useApp();

  const [expandedRubrik, setExpandedRubrik] = useState({ C2: true });
  const [versionName, setVersionName] = useState('');
  const [versionNotes, setVersionNotes] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);

  const validation = validateTotalBobot(kriteriaList);

  const toggleRubrik = (kode) => {
    setExpandedRubrik(prev => ({ ...prev, [kode]: !prev[kode] }));
  };

  const handleSliderChange = (kode, val) => {
    updateKriteriaBobot(kode, parseFloat(val));
  };

  const handleNumericChange = (kode, val) => {
    const num = parseFloat(val);
    if (!isNaN(num) && num >= 0 && num <= 1) {
      updateKriteriaBobot(kode, num);
    }
  };

  const handleSaveVersionSubmit = (e) => {
    e.preventDefault();
    const success = saveKriteriaVersion(versionName, versionNotes);
    if (success) {
      setShowSaveModal(false);
      setVersionName('');
      setVersionNotes('');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. Header Page Title & Summary */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--forest-green)', letterSpacing: '-0.02em' }}>
            Kriteria & Bobot Penilaian
          </h1>
          <p style={{ fontSize: '0.86rem', color: 'var(--muted-green)' }}>
            Konfigurasi 6 atribut kriteria SAW, penyesuaian bobot prioritas, dan riwayat versi.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button className="btn btn-secondary" onClick={resetKriteriaDefault}>
            <RotateCcw size={15} />
            <span>Reset Bobot Standar</span>
          </button>
          <button
            className="btn btn-primary"
            onClick={() => setShowSaveModal(true)}
            disabled={!validation.isValid}
            style={{ opacity: validation.isValid ? 1 : 0.6 }}
          >
            <Save size={15} />
            <span>Simpan Versi Konfigurasi</span>
          </button>
        </div>
      </div>

      {/* 2. Indikator Akumulasi Bobot Real-Time */}
      <div
        className="panel"
        style={{
          padding: '20px 24px',
          backgroundColor: validation.isValid ? 'var(--pale-green)' : 'var(--soft-coral-light)',
          borderColor: validation.isValid ? 'var(--border-light)' : 'rgba(233, 140, 121, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
          flexWrap: 'wrap'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: validation.isValid ? 'var(--emerald-green)' : 'var(--soft-coral)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF'
            }}
          >
            {validation.isValid ? <CheckCircle2 size={24} /> : <AlertTriangle size={24} />}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: validation.isValid ? 'var(--forest-green)' : 'var(--soft-coral-dark)' }}>
                {validation.isValid ? 'Konfigurasi Bobot Valid (100%)' : `Total Bobot Tidak Valid (${validation.persentase}%)`}
              </h3>
              <span
                className="badge"
                style={{
                  backgroundColor: validation.isValid ? 'var(--mint-green)' : 'var(--soft-coral)',
                  color: validation.isValid ? 'var(--forest-green)' : '#FFFFFF'
                }}
              >
                {validation.totalBobot.toFixed(2)} / 1.00
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: validation.isValid ? 'var(--dark-green)' : 'var(--soft-coral-dark)', marginTop: '2px' }}>
              {validation.isValid
                ? 'Total akumulasi bobot tepat 1,00 (100%). Seluruh tahapan perhitungan SAW siap dijalankan secara sah.'
                : `Akumulasi bobot belum bernilai 1,00. Selisih ${validation.selisih > 0 ? '+' : ''}${validation.selisih}. Harap seimbangkan slider kriteria.`}
            </p>
          </div>
        </div>

        {/* Progress Bar Akumulasi */}
        <div style={{ width: '220px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: 'var(--muted-green)', marginBottom: '4px' }}>
            <span>Progress Akumulasi</span>
            <strong>{validation.persentase}%</strong>
          </div>
          <div
            style={{
              height: '8px',
              backgroundColor: 'rgba(0,0,0,0.08)',
              borderRadius: 'var(--radius-pill)',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                width: `${Math.min(validation.persentase, 100)}%`,
                height: '100%',
                backgroundColor: validation.isValid ? 'var(--emerald-green)' : 'var(--soft-coral)',
                transition: 'width var(--transition-fast)'
              }}
            />
          </div>
        </div>
      </div>

      {/* 3. Daftar 6 Kartu Kriteria */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        {kriteriaList.map(crit => {
          const isBenefit = crit.tipe === 'benefit';
          const isExpanded = !!expandedRubrik[crit.kode];

          return (
            <div
              key={crit.kode}
              className="panel"
              style={{
                padding: '22px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                position: 'relative'
              }}
            >
              {/* Header Kartu Kriteria */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--forest-green)',
                      color: '#FFFDF5',
                      fontWeight: 800,
                      fontSize: '0.95rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {crit.kode}
                  </span>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--forest-green)', lineHeight: 1.2 }}>
                      {crit.nama}
                    </h3>
                    <span style={{ fontSize: '0.74rem', color: 'var(--muted-green)' }}>
                      Satuan: {crit.satuan}
                    </span>
                  </div>
                </div>

                {/* Badge Benefit / Cost */}
                <span className={`badge ${isBenefit ? 'badge-benefit' : 'badge-cost'}`}>
                  {isBenefit ? (
                    <>
                      <ArrowUpRight size={13} />
                      <span>Benefit</span>
                    </>
                  ) : (
                    <>
                      <ArrowDownRight size={13} />
                      <span>Cost</span>
                    </>
                  )}
                </span>
              </div>

              {/* Deskripsi Atribut */}
              <p style={{ fontSize: '0.82rem', color: 'var(--dark-green)', lineHeight: 1.5 }}>
                {crit.deskripsi}
              </p>

              {/* Slider & Input Numerik Bobot */}
              <div
                style={{
                  backgroundColor: 'var(--pale-green)',
                  padding: '14px 16px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-light)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--forest-green)' }}>
                    Bobot Prioritas ({Math.round(crit.bobot * 100)}%)
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <input
                      type="number"
                      step="0.05"
                      min="0"
                      max="1"
                      value={crit.bobot}
                      onChange={e => handleNumericChange(crit.kode, e.target.value)}
                      className="form-control"
                      style={{
                        width: '74px',
                        padding: '4px 8px',
                        fontSize: '0.88rem',
                        fontWeight: 700,
                        textAlign: 'right',
                        backgroundColor: '#FFFFFF'
                      }}
                    />
                  </div>
                </div>

                <input
                  type="range"
                  min="0"
                  max="0.5"
                  step="0.05"
                  value={crit.bobot}
                  onChange={e => handleSliderChange(crit.kode, e.target.value)}
                  className="range-slider"
                />
              </div>

              {/* Rubrik Penilaian Collapsible Accordion */}
              {crit.isSkalaLikert && (
                <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '10px' }}>
                  <button
                    onClick={() => toggleRubrik(crit.kode)}
                    style={{
                      background: 'none',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      padding: '4px 0',
                      cursor: 'pointer',
                      color: 'var(--emerald-green)',
                      fontSize: '0.78rem',
                      fontWeight: 600
                    }}
                  >
                    <span>Indikator Skala Penilaian (1 - 5)</span>
                    {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                  </button>

                  {isExpanded && (
                    <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {Object.entries(crit.rubrik).map(([skala, desc]) => (
                        <div
                          key={skala}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '8px',
                            fontSize: '0.75rem',
                            lineHeight: 1.4,
                            padding: '4px 6px',
                            borderRadius: '4px',
                            backgroundColor: 'var(--warm-ivory)'
                          }}
                        >
                          <span
                            style={{
                              fontWeight: 700,
                              color: 'var(--forest-green)',
                              minWidth: '16px'
                            }}
                          >
                            {skala}:
                          </span>
                          <span style={{ color: 'var(--dark-green)' }}>{desc}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 4. Tabel Riwayat Versi Konfigurasi Bobot */}
      <div className="panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <History size={18} color="var(--emerald-green)" />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--forest-green)' }}>
            Riwayat Versi Konfigurasi Bobot
          </h3>
        </div>

        <div className="table-container">
          <table className="verdant-table">
            <thead>
              <tr>
                <th>Nama Versi</th>
                <th>Tanggal Simpan</th>
                <th>Snapshot Distribusi Bobot</th>
                <th>Catatan</th>
                <th className="text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {kriteriaVersions.map(ver => (
                <tr key={ver.id}>
                  <td style={{ fontWeight: 700, color: 'var(--forest-green)' }}>
                    {ver.namaVersi}
                  </td>
                  <td style={{ fontSize: '0.82rem', color: 'var(--muted-green)' }}>
                    {new Date(ver.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })} - {new Date(ver.tanggal).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td style={{ fontSize: '0.8rem', fontFamily: 'monospace' }}>
                    {Object.entries(ver.bobotSnapshot).map(([k, w]) => `${k}: ${w}`).join(', ')}
                  </td>
                  <td style={{ fontSize: '0.82rem', color: 'var(--dark-green)' }}>
                    {ver.catatan}
                  </td>
                  <td className="text-center">
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => applyKriteriaVersion(ver.id)}
                    >
                      Terapkan Versi
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Modal Simpan Versi Bobot */}
      {showSaveModal && (
        <div className="modal-overlay" onClick={() => setShowSaveModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '460px' }}>
            <div className="modal-header">
              <div className="modal-title">Simpan Versi Konfigurasi Bobot</div>
              <button onClick={() => setShowSaveModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <AlertTriangle size={18} color="var(--muted-green)" />
              </button>
            </div>

            <form onSubmit={handleSaveVersionSubmit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <p style={{ fontSize: '0.86rem', color: 'var(--dark-green)', lineHeight: 1.5 }}>
                  Simpan konfigurasi bobot saat ini agar hasil perhitungan historis dapat ditelusuri kembali dengan mudah.
                </p>

                <div className="form-group">
                  <label className="form-label">Nama Versi *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Versi Semester Genap 2025"
                    className="form-control"
                    value={versionName}
                    onChange={e => setVersionName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Catatan Pembaruan</label>
                  <textarea
                    rows={3}
                    placeholder="Contoh: Penyesuaian prioritas harga sewa menjadi 30%..."
                    className="form-control"
                    value={versionNotes}
                    onChange={e => setVersionNotes(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowSaveModal(false)}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  Simpan Versi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
