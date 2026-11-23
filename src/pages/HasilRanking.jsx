// src/pages/HasilRanking.jsx
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import {
  Trophy, Medal, Star, Calculator, TrendingUp,
  ChevronRight, BarChart2, Info,
} from 'lucide-react';
import sawEngine from '../utils/sawEngine';

/**
 * HasilRanking — Halaman 6: Hasil Pemeringkatan & Rekomendasi Kost
 */
export default function HasilRanking() {
  const { sawResult, kosts, criteria, recalculate, settings } = useApp();
  const navigate = useNavigate();

  const ranked = sawResult?.ranked ?? [];
  const top3 = ranked.slice(0, 3);
  const rest = ranked.slice(3);

  const medalColor = ['hsl(45,90%,50%)', 'hsl(220,20%,65%)', 'hsl(25,70%,50%)'];
  const medalLabel = ['Terbaik', 'Runner-up', 'Ke-3'];

  const formatHarga = (v) => sawEngine.formatRupiah(v);
  const getCriteriaLabel = (key) => criteria.find((c) => c.key === key)?.name ?? key;

  const getCriteriaDisplay = (kost) => {
    return criteria.map((c) => ({
      label: c.name,
      kode: c.kode || c.id,
      value: kost[c.key],
      unit: c.unit,
      type: c.type,
    }));
  };

  if (!ranked.length) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title"><Trophy size={24} /> Hasil &amp; Rekomendasi</h1>
        </div>
        <div className="empty-state">
          <BarChart2 size={48} className="empty-state-icon" />
          <h2>Belum Ada Hasil Perhitungan</h2>
          <p>Jalankan perhitungan SAW terlebih dahulu untuk melihat hasil pemeringkatan.</p>
          <button className="btn btn--primary" onClick={() => navigate('/calculation')}>
            <Calculator size={16} /> Ke Perhitungan SAW
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Trophy size={24} className="icon-gold" />
            Hasil &amp; Rekomendasi Kost
          </h1>
          <p className="page-subtitle">
            Peringkat {ranked.length} kost berdasarkan metode Simple Additive Weighting (SAW)
            {settings?.lastCalculated && (
              <span className="text-muted"> · Dihitung: {new Date(settings.lastCalculated).toLocaleString('id-ID')}</span>
            )}
          </p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn--secondary" onClick={recalculate} id="btn-recalculate">
            <TrendingUp size={16} /> Hitung Ulang
          </button>
          <button className="btn btn--primary" onClick={() => navigate('/report')} id="btn-to-report">
            <ChevronRight size={16} /> Lihat Laporan
          </button>
        </div>
      </div>

      {/* Top 3 Podium */}
      <section className="hasil-podium" aria-label="Podium 3 kost terbaik">
        <h2 className="section-title">🏆 Top 3 Kost Terbaik</h2>
        <div className="podium-grid">
          {top3.map((kost, idx) => (
            <div
              key={kost.id}
              className={`podium-card podium-card--${idx + 1}`}
              style={{ '--medal-color': medalColor[idx] }}
            >
              <div className="podium-rank-badge" aria-label={`Peringkat ${idx + 1}`}>
                {idx === 0 ? <Trophy size={20} /> : <Medal size={20} />}
                <span>{medalLabel[idx]}</span>
              </div>

              <div className="podium-avatar" style={{ background: kost.imageColor }}>
                <span>{kost.initials}</span>
              </div>

              <div className="podium-info">
                <h3 className="podium-name">{kost.name}</h3>
                <p className="podium-address">{kost.address}</p>
              </div>

              <div className="podium-score">
                <span className="podium-score-value">
                  {sawEngine.formatScore(kost.score, 4)}
                </span>
                <span className="podium-score-label">Skor Preferensi</span>
              </div>

              <div className="podium-price">
                {formatHarga(kost.harga ?? kost.price ?? 0)}
                <span className="text-muted">/bulan</span>
              </div>

              <button
                className="btn btn--ghost btn--sm podium-detail-btn"
                onClick={() => navigate(`/kost/${kost.id}`)}
                id={`btn-podium-detail-${kost.id}`}
              >
                Lihat Detail <ChevronRight size={14} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Full Ranking Table */}
      <section className="hasil-table-section" aria-label="Tabel peringkat lengkap">
        <h2 className="section-title">📊 Peringkat Lengkap</h2>
        <div className="table-wrapper">
          <table className="data-table" id="tabel-hasil-ranking">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Nama Kost</th>
                <th>Alamat</th>
                {criteria.map((c) => (
                  <th key={c.id} title={c.description}>
                    {c.kode || c.id}
                    <span className="th-sub">{c.name}</span>
                  </th>
                ))}
                <th>Skor (Vi)</th>
                <th>Rekomendasi</th>
              </tr>
            </thead>
            <tbody>
              {ranked.map((kost) => (
                <tr
                  key={kost.id}
                  onClick={() => navigate(`/kost/${kost.id}`)}
                  style={{ cursor: 'pointer' }}
                  title={`Klik untuk detail ${kost.name}`}
                >
                  <td>
                    <span className={`rank-badge rank-badge--${Math.min(kost.rank, 4)}`}>
                      #{kost.rank}
                    </span>
                  </td>
                  <td>
                    <div className="kost-name-cell">
                      <div className="kost-avatar-sm" style={{ background: kost.imageColor }}>
                        {kost.initials}
                      </div>
                      <span>{kost.name}</span>
                    </div>
                  </td>
                  <td className="text-muted text-sm">{kost.address}</td>
                  {criteria.map((c) => (
                    <td key={c.id} className="text-center">
                      {c.key === 'harga'
                        ? sawEngine.formatRupiah(kost[c.key] ?? 0)
                        : (kost[c.key] ?? '-')}
                      {c.key !== 'harga' && c.unit !== 'Rp/bln'
                        ? <span className="text-muted text-xs"> {c.unit}</span>
                        : null}
                    </td>
                  ))}
                  <td>
                    <span className="score-pill">
                      {sawEngine.formatScore(kost.score, 4)}
                    </span>
                  </td>
                  <td>
                    {kost.rank === 1 && <span className="badge badge--success">✓ Terbaik</span>}
                    {kost.rank === 2 && <span className="badge badge--info">Runner-up</span>}
                    {kost.rank === 3 && <span className="badge badge--warning">Top 3</span>}
                    {kost.rank > 3 && <span className="badge badge--neutral">Alternatif</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Info */}
      <div className="hasil-info-box">
        <Info size={15} />
        <p>
          Peringkat dihitung menggunakan metode <strong>SAW (Simple Additive Weighting)</strong>.
          Skor preferensi Vi = Σ(w<sub>j</sub> × r<sub>ij</sub>) dimana r<sub>ij</sub> adalah nilai
          normalisasi dan w<sub>j</sub> adalah bobot kriteria.
          Kost dengan skor tertinggi merupakan rekomendasi terbaik.
        </p>
      </div>
    </div>
  );
}
