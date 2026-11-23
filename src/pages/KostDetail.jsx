// src/pages/KostDetail.jsx
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, MapPin, Banknote, Star, Shield, Sparkles,
  Trophy, Maximize2, Wifi, Droplets, Info, CheckCircle2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import ProgressBar from '../components/common/ProgressBar';
import sawEngine from '../utils/sawEngine';

const criteriaIconMap = {
  harga: Banknote,
  fasilitasKamar: Star,
  kondisiKamar: Sparkles,
  jarakTujuan: MapPin,
  luasKamar: Maximize2,
  fasilitasPendukung: Wifi,
  keamanan: Shield,
  sanitasi: Droplets,
  price: Banknote,
  distance: MapPin,
  facilities: Star,
  security: Shield,
  cleanliness: Sparkles,
};

export default function KostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { kosts, criteria, sawResult } = useApp();

  const kost = kosts.find((k) => k.id === id);
  const ranked = sawResult?.ranked || [];
  const rankedKost = ranked.find((k) => k.id === id);

  if (!kost) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-header-title">Kost Tidak Ditemukan</h1>
        </div>
        <button className="btn btn-secondary" onClick={() => navigate('/kost')} id="btn-back-notfound">
          <ArrowLeft size={16} /> Kembali ke Data Kost
        </button>
      </div>
    );
  }

  const rank = rankedKost?.rank || null;
  const score = rankedKost?.score || null;

  // Compute normalized values for this kost
  const normalMatrix = sawResult?.normalMatrix;
  const kostIndex = kosts.findIndex((k) => k.id === id);
  const normalRow = normalMatrix ? normalMatrix[kostIndex] : null;

  const hargaVal = kost.harga ?? kost.price ?? 0;
  const jarakVal = kost.jarakTujuan ?? kost.distance ?? 0;
  const luasVal = kost.luasKamar ?? 16;
  const statusLabel = kost.status === 'penuh' ? 'Penuh' : kost.status === 'booking' ? 'Terbooking Sebagian' : 'Tersedia';
  const statusColor = kost.status === 'penuh' ? '#EF4444' : kost.status === 'booking' ? '#F59E0B' : '#10B981';

  return (
    <div className="page-container">
      {/* Back button */}
      <div style={{ marginBottom: '16px' }}>
        <button className="btn btn-secondary btn-sm" onClick={() => navigate(-1)} id="btn-back-detail">
          <ArrowLeft size={14} /> Kembali
        </button>
      </div>

      {/* Hero */}
      <div className="kost-detail-hero" id="kost-detail-hero" style={{ background: 'var(--color-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px', flexWrap: 'wrap' }}>
          {kost.foto ? (
            <img
              src={kost.foto}
              alt={kost.name}
              style={{ width: 100, height: 100, borderRadius: '12px', objectFit: 'cover' }}
            />
          ) : (
            <div
              className="kost-avatar"
              style={{
                width: 90, height: 90, borderRadius: '14px',
                background: kost.imageColor || '#3B82F6',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: '1.8rem', color: 'white', flexShrink: 0,
              }}
              aria-hidden="true"
            >
              {kost.initials || kost.name.slice(0, 2).toUpperCase()}
            </div>
          )}

          <div style={{ flex: 1, minWidth: '280px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
              {rank && rank <= 3 && (
                <span className={`badge badge-rank-${rank}`}>
                  {['🥇 Terbaik (Juara 1)', '🥈 Peringkat 2', '🥉 Peringkat 3'][rank - 1]}
                </span>
              )}
              {rank && rank > 3 && (
                <span className="badge badge-primary">Peringkat #{rank}</span>
              )}
              <span className="badge" style={{ background: `${statusColor}22`, color: statusColor, fontWeight: 600 }}>
                ● {statusLabel}
              </span>
            </div>

            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-on-dark)', marginBottom: '8px' }}>
              {kost.name}
            </h1>
            <p style={{ color: 'var(--text-on-dark-muted)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={15} /> {kost.address}
            </p>
            {kost.description && (
              <p style={{ color: 'var(--text-on-dark-muted)', fontSize: '0.9rem', maxWidth: '650px', lineHeight: 1.5 }}>
                {kost.description}
              </p>
            )}
          </div>

          {score !== null && (
            <div style={{ textAlign: 'center', padding: '18px 24px', background: '#F7FEE7', borderRadius: 'var(--radius-lg)', border: '1.5px solid #BEF264', minWidth: 150 }}>
              <Trophy size={22} color="#0B0B72" style={{ marginBottom: '6px' }} />
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2.2rem', fontWeight: 800, color: '#0B0B72' }}>
                {sawEngine.formatScore(score)}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>
                Nilai Preferensi (V<sub>i</sub>)
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Score Breakdown (SAW Criteria) */}
        <div className="card" style={{ gridColumn: 'span 2' }}>
          <div className="card-header">
            <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Star size={18} color="var(--color-primary)" />
              Rincian Penilaian 8 Kriteria SAW
            </h2>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {criteria.map((crit, j) => {
              const Icon = criteriaIconMap[crit.key] || Star;
              const rawVal = kost[crit.key] ?? (crit.key === 'harga' ? kost.price : crit.key === 'jarakTujuan' ? kost.distance : 4);
              const normalVal = normalRow ? normalRow[j] : 0;
              const contribution = normalVal * crit.weight;

              return (
                <div key={crit.id} id={`detail-crit-${crit.id}`} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Icon size={16} color="var(--color-primary)" />
                      <span style={{ fontWeight: 600, color: 'var(--text-on-dark)', fontSize: '0.95rem' }}>
                        {crit.kode || crit.id} — {crit.name}
                      </span>
                    </div>
                    <span className={`badge ${crit.type === 'benefit' ? 'badge--success' : 'badge--danger'}`}>
                      {crit.type === 'benefit' ? '↑ Benefit' : '↓ Cost'} (Bobot {(crit.weight * 100).toFixed(0)}%)
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-on-dark-muted)' }}>
                      Nilai Riil: <strong style={{ color: 'var(--text-on-dark)', fontFamily: 'var(--font-mono)' }}>
                        {crit.key === 'harga' || crit.key === 'price' ? sawEngine.formatRupiah(rawVal) : rawVal}
                      </strong> {crit.unit}
                    </span>
                    <span style={{ color: 'var(--text-on-dark-muted)' }}>
                      Normalisasi (r<sub>ij</sub>): <strong style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-mono)' }}>
                        {sawEngine.formatScore(normalVal)}
                      </strong>
                    </span>
                    <span style={{ color: 'var(--text-on-dark-muted)' }}>
                      Kontribusi Skor: <strong style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-mono)' }}>
                        +{sawEngine.formatScore(contribution)}
                      </strong>
                    </span>
                  </div>

                  {crit.rubrik && crit.rubrik[rawVal] && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-on-dark-muted)', fontStyle: 'italic', marginBottom: '8px' }}>
                      Keterangan: {crit.rubrik[rawVal]}
                    </div>
                  )}

                  <ProgressBar
                    id={`progress-${crit.id}`}
                    label={`Skor Ternormalisasi`}
                    value={normalVal}
                    maxValue={1}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Info Ringkas & Rekomendasi */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Quick Specifications */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Spesifikasi Kost</h3>
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { label: 'Harga Sewa', value: `${sawEngine.formatRupiah(hargaVal)} / bln`, icon: Banknote },
                { label: 'Jarak ke Acuan', value: `${jarakVal} km`, icon: MapPin },
                { label: 'Luas Kamar', value: `${luasVal} m²`, icon: Maximize2 },
                { label: 'Kondisi Kamar', value: `Skor ${kost.kondisiKamar ?? 4}/5`, icon: Sparkles },
                { label: 'Fasilitas Kamar', value: `Skor ${kost.fasilitasKamar ?? 4}/5`, icon: Star },
                { label: 'Fasilitas Pendukung', value: `Skor ${kost.fasilitasPendukung ?? 4}/5`, icon: Wifi },
                { label: 'Keamanan', value: `Skor ${kost.keamanan ?? 4}/5`, icon: Shield },
                { label: 'Sanitasi & Air', value: `Skor ${kost.sanitasi ?? 4}/5`, icon: Droplets },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-on-dark-muted)', fontSize: '0.85rem' }}>
                    <Icon size={14} /> {label}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-on-dark)' }}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Kesimpulan Rekomendasi */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Info size={16} color="var(--color-primary)" /> Catatan Evaluasi SPK
              </h3>
            </div>
            <div className="card-body">
              <div style={{ padding: '14px', background: 'rgba(59,130,246,0.08)', borderRadius: '8px', border: '1px solid rgba(59,130,246,0.2)', fontSize: '0.85rem', lineHeight: 1.6, color: 'var(--text-on-dark)' }}>
                {rank === 1 ? (
                  <span>🏆 <strong>Alternatif Terbaik:</strong> Kost ini memiliki nilai preferensi tertinggi ({sawEngine.formatScore(score)}), mengungguli alternatif lain terutama pada kombinasi harga, fasilitas, dan kelayakan lokasi.</span>
                ) : rank <= 3 ? (
                  <span>⭐ <strong>Rekomendasi Utama:</strong> Masuk dalam Top 3 Kost Terbaik dengan skor {sawEngine.formatScore(score)}. Sangat layak dipertimbangkan sebagai pilihan alternatif kompetitif.</span>
                ) : (
                  <span>📌 <strong>Alternatif Tambahan:</strong> Menempati peringkat ke-{rank} dengan skor preferensi {sawEngine.formatScore(score)}.</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
