// src/pages/Riwayat.jsx
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  History, Trash2, ChevronDown, ChevronUp,
  Clock, Building2, Sliders, Trophy, AlertTriangle,
} from 'lucide-react';
import sawEngine from '../utils/sawEngine';

/**
 * Riwayat — Halaman 8: Riwayat Perhitungan & Perubahan Bobot
 */
export default function Riwayat() {
  const { riwayat, clearRiwayat } = useApp();
  const [expandedId, setExpandedId] = useState(null);
  const [confirmClear, setConfirmClear] = useState(false);

  const toggle = (id) => setExpandedId((prev) => (prev === id ? null : id));

  const handleClear = () => {
    if (confirmClear) {
      clearRiwayat();
      setConfirmClear(false);
    } else {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 4000);
    }
  };

  if (!riwayat || riwayat.length === 0) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title"><History size={24} /> Riwayat Perhitungan</h1>
        </div>
        <div className="empty-state">
          <History size={48} className="empty-state-icon" />
          <h2>Belum Ada Riwayat</h2>
          <p>Riwayat akan tersimpan otomatis setiap kali perhitungan SAW dijalankan.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title"><History size={24} /> Riwayat Perhitungan</h1>
          <p className="page-subtitle">
            Catatan {riwayat.length} sesi perhitungan SAW sebelumnya
          </p>
        </div>
        <button
          className={`btn ${confirmClear ? 'btn--danger' : 'btn--secondary'}`}
          onClick={handleClear}
          id="btn-clear-riwayat"
          aria-label="Hapus semua riwayat"
        >
          {confirmClear ? (
            <><AlertTriangle size={15} /> Konfirmasi Hapus</>
          ) : (
            <><Trash2 size={15} /> Hapus Semua</>
          )}
        </button>
      </div>

      {/* List */}
      <div className="riwayat-list">
        {riwayat.map((item, idx) => {
          const isOpen = expandedId === item.id;
          const tanggal = new Date(item.tanggal).toLocaleString('id-ID', {
            dateStyle: 'medium', timeStyle: 'short',
          });

          return (
            <div key={item.id} className={`riwayat-card${isOpen ? ' riwayat-card--open' : ''}`}>
              {/* Summary row */}
              <button
                className="riwayat-card-header"
                onClick={() => toggle(item.id)}
                aria-expanded={isOpen}
                id={`riwayat-toggle-${item.id}`}
              >
                <div className="riwayat-card-meta">
                  <span className="riwayat-index">#{riwayat.length - idx}</span>
                  <div>
                    <span className="riwayat-tanggal">
                      <Clock size={12} /> {tanggal}
                    </span>
                    <div className="riwayat-summary-pills">
                      <span className="pill">
                        <Building2 size={11} /> {item.jumlahAlternatif} Kost
                      </span>
                      <span className="pill">
                        <Sliders size={11} /> {item.jumlahKriteria} Kriteria
                      </span>
                      <span className="pill pill--gold">
                        <Trophy size={11} /> {item.topKost}
                      </span>
                    </div>
                  </div>
                </div>
                <span className="riwayat-chevron" aria-hidden="true">
                  {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </span>
              </button>

              {/* Detail row */}
              {isOpen && (
                <div className="riwayat-card-body">
                  {/* Bobot snapshot */}
                  <h3 className="riwayat-section-title">
                    <Sliders size={14} /> Bobot Kriteria yang Digunakan
                  </h3>
                  <div className="riwayat-bobot-grid">
                    {item.bobotSnapshot?.map((b) => (
                      <div key={b.id} className="riwayat-bobot-item">
                        <span className="riwayat-bobot-kode">{b.kode}</span>
                        <span className="riwayat-bobot-nama">{b.nama}</span>
                        <span className="riwayat-bobot-val">
                          {(b.bobot * 100).toFixed(0)}%
                        </span>
                        <div
                          className="riwayat-bobot-bar"
                          style={{ '--bar-pct': `${b.bobot * 100}%` }}
                          aria-hidden="true"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Hasil ranking */}
                  <h3 className="riwayat-section-title" style={{ marginTop: '16px' }}>
                    <Trophy size={14} /> Hasil Peringkat
                  </h3>
                  <div className="riwayat-ranking-list">
                    {item.hasilRanking?.slice(0, 10).map((r) => (
                      <div key={r.id} className="riwayat-ranking-row">
                        <span className={`rank-badge rank-badge--${Math.min(r.rank, 4)}`}>
                          #{r.rank}
                        </span>
                        <span className="riwayat-ranking-name">{r.name}</span>
                        <span className="score-pill">
                          {sawEngine.formatScore(r.score, 4)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="page-note">
        * Sistem menyimpan maksimal 20 riwayat perhitungan terakhir.
      </p>
    </div>
  );
}
