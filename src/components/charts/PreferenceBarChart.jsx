/**
 * src/components/charts/PreferenceBarChart.jsx
 * Grafik Batang Interaktif Nilai Preferensi SAW
 * Palet Hijau Gradasi dari Forest Green hingga Sage Green
 */

import React, { useState } from 'react';
import { ChevronDown, BarChart2, Award } from 'lucide-react';

export default function PreferenceBarChart({ results = [] }) {
  const [viewMode, setViewMode] = useState('top5'); // 'top5' | 'all'
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const displayData = viewMode === 'top5' ? results.slice(0, 5) : results;

  // Greens gradient array
  const barColors = [
    '#174D3B', // Forest Green (#1)
    '#1E6649', // Deep Emerald (#2)
    '#23845B', // Emerald Green (#3)
    '#38986F', // Medium Green (#4)
    '#58AC84', // Minty Sage (#5)
    '#76BE99', // Sage Light
    '#8FB9A0', // Sage Green
    '#A5CDB6', // Pale Sage
    '#BCDDC9',
    '#D0EAD9'
  ];

  if (!results || results.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--muted-green)' }}>
        <BarChart2 size={36} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
        <p>Belum ada data hasil perhitungan preferensi.</p>
      </div>
    );
  }

  // Chart Dimensions
  const chartHeight = 220;
  const maxScore = 1.0; // SAW values range 0 to 1

  return (
    <div>
      {/* Header Panel Chart */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              backgroundColor: 'var(--pale-green)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <BarChart2 size={16} color="var(--emerald-green)" />
          </div>
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--forest-green)' }}>
              Perbandingan Nilai Preferensi Kost
            </h3>
            <span style={{ fontSize: '0.74rem', color: 'var(--muted-green)' }}>
              Skor akhir V_i hasil penjumlahan bobot terstandarisasi
            </span>
          </div>
        </div>

        {/* Dropdown Mode Filter */}
        <div style={{ position: 'relative' }}>
          <select
            value={viewMode}
            onChange={e => setViewMode(e.target.value)}
            className="form-control form-select"
            style={{
              padding: '6px 28px 6px 12px',
              fontSize: '0.78rem',
              fontWeight: 600,
              backgroundColor: 'var(--pale-green)',
              borderColor: 'var(--border-light)',
              cursor: 'pointer'
            }}
          >
            <option value="top5">Top 5 Alternatif</option>
            <option value="all">Semua Kost ({results.length})</option>
          </select>
        </div>
      </div>

      {/* SVG Bar Chart Canvas */}
      <div style={{ position: 'relative', width: '100%', height: `${chartHeight + 45}px` }}>
        {/* Y Axis Reference Gridlines */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            height: `${chartHeight}px`,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            pointerEvents: 'none',
            borderBottom: '1px solid var(--border-light)'
          }}
        >
          {[1.0, 0.75, 0.5, 0.25, 0].map(val => (
            <div
              key={val}
              style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                borderTop: val === 0 ? 'none' : '1px dashed #E2ECE4'
              }}
            >
              <span style={{ fontSize: '0.68rem', color: 'var(--muted-green)', width: '28px' }}>
                {val.toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* Bars Container */}
        <div
          style={{
            position: 'absolute',
            left: '34px',
            right: '10px',
            bottom: '40px',
            height: `${chartHeight}px`,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-around',
            gap: '8px'
          }}
        >
          {displayData.map((item, idx) => {
            const score = item.skorAkhir;
            const barHeightPercent = (score / maxScore) * 100;
            const color = barColors[idx % barColors.length];
            const isHovered = hoveredIndex === idx;

            return (
              <div
                key={item.kostId}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  flex: 1,
                  maxWidth: '72px',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  position: 'relative',
                  cursor: 'pointer'
                }}
              >
                {/* Score Label on Top of Bar */}
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: isHovered ? 'var(--forest-green)' : 'var(--dark-green)',
                    marginBottom: '4px',
                    transition: 'transform var(--transition-fast)',
                    transform: isHovered ? 'scale(1.1)' : 'none'
                  }}
                >
                  {score.toFixed(3)}
                </span>

                {/* Animated Vertical Bar */}
                <div
                  style={{
                    width: '100%',
                    maxWidth: '46px',
                    height: `${barHeightPercent}%`,
                    background: `linear-gradient(180deg, ${color} 0%, rgba(35, 132, 91, 0.75) 100%)`,
                    borderRadius: '8px 8px 2px 2px',
                    boxShadow: isHovered
                      ? '0 6px 14px rgba(23, 77, 59, 0.35)'
                      : '0 2px 6px rgba(23, 77, 59, 0.15)',
                    transition: 'all var(--transition-fast)',
                    transform: isHovered ? 'translateY(-3px)' : 'none'
                  }}
                />

                {/* Kost Name on X Axis */}
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 6px)',
                    left: 0,
                    right: 0,
                    textAlign: 'center',
                    fontSize: '0.74rem',
                    fontWeight: isHovered ? 700 : 500,
                    color: isHovered ? 'var(--forest-green)' : 'var(--dark-green)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                  title={item.kostData.nama}
                >
                  {item.kostData.nama.replace('Kost ', '')}
                </div>

                {/* Tooltip on Hover */}
                {isHovered && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 'calc(100% + 10px)',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: 'var(--forest-green)',
                      color: '#FFFFFF',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.75rem',
                      zIndex: 20,
                      whiteSpace: 'nowrap',
                      boxShadow: 'var(--shadow-lg)',
                      pointerEvents: 'none'
                    }}
                  >
                    <div style={{ fontWeight: 700, color: 'var(--mint-green)', marginBottom: '2px' }}>
                      #{item.ranking} {item.kostData.nama}
                    </div>
                    <div>Skor Preferensi: <strong>{item.skorAkhir}</strong></div>
                    <div>Harga: Rp {item.kostData.harga.toLocaleString('id-ID')}/bln</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--sage-green)', marginTop: '2px' }}>
                      Status: {item.kostData.status}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
