// src/pages/Dashboard.jsx
import { useNavigate } from 'react-router-dom';
import {
  Building2, Trophy, Sliders, TrendingUp, Clock,
  Calculator, ArrowRight, CheckCircle2, ShieldCheck,
  CheckCircle, PieChart, Star,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import KpiCard from '../components/common/KpiCard';
import sawEngine from '../utils/sawEngine';

const activityTypeColor = {
  success: 'var(--color-success)',
  danger:  'var(--color-danger)',
  warning: 'var(--color-warning)',
  info:    'var(--color-info)',
};

export default function Dashboard() {
  const { kosts, criteria, sawResult, activityLog, settings } = useApp();
  const navigate = useNavigate();

  const ranked = sawResult?.ranked || [];
  const top3 = ranked.slice(0, 3);

  // Perhitungan ringkasan sistem
  const totalKost = kosts.length;
  const kostAktif = kosts.filter((k) => (k.status || 'tersedia') === 'tersedia').length;
  const kostPenuh = kosts.filter((k) => k.status === 'penuh').length;
  const totalCriteria = criteria.length;
  const totalWeight = criteria.reduce((s, c) => s + (c.weight || 0), 0);
  const isWeightValid = Math.abs(totalWeight - 1.0) < 0.001;

  // Kelengkapan data: alternatif dengan semua data kriteria terisi
  const completeDataCount = kosts.filter((k) =>
    (k.harga || k.price) && (k.jarakTujuan || k.distance) && (k.luasKamar || 16)
  ).length;
  const dataCompletenessPct = totalKost > 0 ? Math.round((completeDataCount / totalKost) * 100) : 100;

  const maxScore = ranked[0]?.score || 1;

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-header-title">
            <TrendingUp size={28} />
            <span>Dashboard <span className="highlight">Admin &amp; Informasi Sistem</span></span>
          </h1>
          <p className="page-header-subtitle">
            Ringkasan status data kost, bobot kriteria SAW, kelengkapan data, dan hasil pemeringkatan rekomendasi
          </p>
        </div>
      </div>

      {/* KPI Cards — 4 Indikator Utama */}
      <div className="kpi-grid">
        <KpiCard
          id="kpi-total-kost"
          icon={<Building2 size={22} color="#3B82F6" />}
          iconBg="rgba(59,130,246,0.15)"
          label="Jumlah Data Kost"
          value={totalKost.toString()}
          rawValue={totalKost}
          delta={`${kostAktif} Aktif / Tersedia • ${kostPenuh} Penuh`}
        />
        <KpiCard
          id="kpi-criteria-count"
          icon={<Sliders size={22} color="#F59E0B" />}
          iconBg="rgba(245,158,11,0.15)"
          label="Kriteria & Total Bobot"
          value={`${totalCriteria} Kriteria`}
          rawValue={totalCriteria}
          delta={`Total Bobot: ${(totalWeight * 100).toFixed(0)}% (${isWeightValid ? 'Valid 1.00' : 'Perlu Penyesuaian'})`}
        />
        <KpiCard
          id="kpi-completeness"
          icon={<CheckCircle size={22} color="#10B981" />}
          iconBg="rgba(16,185,129,0.15)"
          label="Kelengkapan Data"
          value={`${dataCompletenessPct}%`}
          rawValue={dataCompletenessPct}
          delta={`${completeDataCount} dari ${totalKost} kost terisi lengkap`}
        />
        <KpiCard
          id="kpi-best-kost"
          icon={<Trophy size={22} color="#CFFF5E" />}
          iconBg="rgba(207,255,94,0.15)"
          label="Hasil Peringkat #1"
          value={top3[0]?.name || '—'}
          highlight
          delta={top3[0] ? `Skor Preferensi: ${sawEngine.formatScore(top3[0].score)}` : 'Belum dihitung'}
        />
      </div>

      {/* Status Pemeringkatan Terakhir */}
      <div className="card" style={{ marginBottom: '24px', background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: 44, height: 44, borderRadius: '10px', background: '#ECFCCB', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0B0B72' }}>
              <Trophy size={24} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Status Pemeringkatan Terakhir
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0B0B72' }}>
                Rekomendasi Utama: <span style={{ color: '#0B0B72', fontWeight: 800 }}>{top3[0]?.name || 'Belum Dihitung'}</span>
                {top3[0] && (
                  <span className="badge badge--success ml-8" style={{ fontSize: '0.8rem', marginLeft: '10px' }}>
                    Skor: {sawEngine.formatScore(top3[0].score)}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate('/calculation')} id="btn-dash-eval">
              <Calculator size={14} /> Proses Hitung SAW
            </button>
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/hasil')} id="btn-dash-hasil">
              <Trophy size={14} /> Lihat Rekomendasi Lengkap
            </button>
          </div>
        </div>
      </div>

      {/* Top 3 Ranking Cards */}
      {top3.length > 0 && (
        <div style={{ marginBottom: '28px' }}>
          <div className="flex-between mb-4">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-h3)', color: 'var(--color-primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Trophy size={20} />
              Top 3 Kost Terbaik Hasil Rekomendasi
            </h2>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate('/hasil')} id="dashboard-see-all-btn">
              Lihat Semua Peringkat <ArrowRight size={14} />
            </button>
          </div>

          <div className="ranking-grid">
            {top3.map((kost) => (
              <div
                key={kost.id}
                className={`rank-card rank-${kost.rank}`}
                onClick={() => navigate(`/kost/${kost.id}`)}
                style={{ cursor: 'pointer' }}
                id={`rank-card-${kost.rank}`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && navigate(`/kost/${kost.id}`)}
                aria-label={`Kost ${kost.name} peringkat ${kost.rank}`}
              >
                <span className="rank-number">{kost.rank}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <span className={`badge badge-rank-${kost.rank}`}>
                    {kost.rank === 1 ? '🥇 Terbaik' : kost.rank === 2 ? '🥈 Ke-2' : '🥉 Ke-3'}
                  </span>
                  <span className="badge" style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981', fontSize: '11px' }}>
                    ● {kost.status || 'Tersedia'}
                  </span>
                </div>
                <div className="rank-name">{kost.name}</div>
                <div className="rank-address">{kost.address}</div>
                <div className="rank-score">{sawEngine.formatScore(kost.score)}</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-on-dark-muted)' }}>
                  {sawEngine.formatRupiah(kost.harga ?? kost.price ?? 0)} / bulan • {kost.jarakTujuan ?? kost.distance ?? 0} km
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chart & Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Bar Chart */}
        <div className="card">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calculator size={18} /> Perbandingan Skor Preferensi (V<sub>i</sub>)
            </h3>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate('/calculation')} id="dashboard-calc-btn">
              Detail Matriks
            </button>
          </div>
          <div className="card-body">
            {ranked.length > 0 ? (
              <div className="score-chart">
                {ranked.map((kost, i) => {
                  const widthPct = ((kost.score / maxScore) * 100).toFixed(1);
                  const cls = i === 0 ? 'rank-1' : i === 1 ? 'rank-2' : i === 2 ? 'rank-3' : 'rank-other';
                  return (
                    <div className="chart-row" key={kost.id} id={`chart-row-${kost.id}`}>
                      <div className="chart-label" title={kost.name}>{i + 1}. {kost.name}</div>
                      <div className="chart-bar-track">
                        <div className={`chart-bar-fill ${cls}`} style={{ width: `${widthPct}%` }}>
                          {sawEngine.formatScore(kost.score)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon"><Calculator size={28} /></div>
                <div className="empty-state-title">Belum ada hasil kalkulasi</div>
              </div>
            )}
          </div>
        </div>

        {/* Activity Log */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={18} /> Aktivitas Sistem Terbaru
            </h3>
          </div>
          <div className="card-body" style={{ padding: '12px 16px' }}>
            {activityLog.length === 0 ? (
              <p style={{ color: 'var(--text-on-dark-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '20px' }}>
                Belum ada aktivitas
              </p>
            ) : (
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {activityLog.slice(0, 6).map((log) => (
                  <li
                    key={log.id}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-md)',
                      borderLeft: `3px solid ${activityTypeColor[log.type] || '#2563EB'}`,
                      background: '#F8FAFC',
                    }}
                  >
                    <span style={{ fontSize: '0.85rem', color: '#0F172A', fontWeight: 600 }}>
                      {log.action}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '2px' }}>
                      {new Date(log.time).toLocaleTimeString('id-ID')} • {new Date(log.time).toLocaleDateString('id-ID')}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
