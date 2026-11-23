/**
 * src/components/charts/CriteriaDonutChart.jsx
 * Diagram Donat Komposisi Bobot Kriteria
 * Pusat Diagram: "1,00 Total Bobot" dengan Palet Hijau Harmonis
 */

import React, { useState } from 'react';
import { PieChart, Info } from 'lucide-react';

export default function CriteriaDonutChart({ kriteriaList = [] }) {
  const [hoveredCode, setHoveredCode] = useState(null);

  // Palet Hijau Berbeda untuk 6 Kriteria
  const sliceColors = {
    C1: '#174D3B', // Forest Green
    C2: '#23845B', // Emerald Green
    C3: '#348E66', // Pine
    C4: '#58AC84', // Minty Green
    C5: '#8FB9A0', // Sage Green
    C6: '#B6DCC6'  // Soft Mint
  };

  const totalBobot = kriteriaList.reduce((acc, c) => acc + Number(c.bobot || 0), 0);

  // SVG Donut Path Math
  const size = 180;
  const strokeWidth = 28;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Akumulasi sudut slice
  let accumulatedPercent = 0;
  const slices = kriteriaList.map(crit => {
    const bobot = Number(crit.bobot || 0);
    const percent = totalBobot > 0 ? (bobot / totalBobot) : 0;
    const strokeDasharray = `${percent * circumference} ${circumference}`;
    const strokeDashoffset = -accumulatedPercent * circumference;
    accumulatedPercent += percent;

    return {
      ...crit,
      percent: Math.round(percent * 100),
      color: sliceColors[crit.kode] || '#8FB9A0',
      strokeDasharray,
      strokeDashoffset
    };
  });

  return (
    <div>
      {/* Header Panel */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
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
            <PieChart size={16} color="var(--emerald-green)" />
          </div>
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--forest-green)' }}>
              Komposisi Bobot Kriteria
            </h3>
            <span style={{ fontSize: '0.74rem', color: 'var(--muted-green)' }}>
              Distribusi kepentingan penilaian (Total: 100%)
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
        {/* SVG Donut */}
        <div style={{ position: 'relative', width: `${size}px`, height: `${size}px`, margin: '0 auto' }}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
            {slices.map(slice => {
              const isHovered = hoveredCode === slice.kode;
              return (
                <circle
                  key={slice.kode}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="transparent"
                  stroke={slice.color}
                  strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={slice.strokeDasharray}
                  strokeDashoffset={slice.strokeDashoffset}
                  style={{
                    transition: 'all var(--transition-fast)',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={() => setHoveredCode(slice.kode)}
                  onMouseLeave={() => setHoveredCode(null)}
                />
              );
            })}
          </svg>

          {/* Center Label: 1,00 Total Bobot */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none'
            }}
          >
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--forest-green)', lineHeight: 1 }}>
              {totalBobot.toFixed(2).replace('.', ',')}
            </span>
            <span style={{ fontSize: '0.68rem', color: 'var(--muted-green)', fontWeight: 600, marginTop: '2px' }}>
              Total Bobot
            </span>
          </div>
        </div>

        {/* Legend List */}
        <div style={{ flex: 1, minWidth: '180px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {slices.map(slice => {
            const isHovered = hoveredCode === slice.kode;
            return (
              <div
                key={slice.kode}
                onMouseEnter={() => setHoveredCode(slice.kode)}
                onMouseLeave={() => setHoveredCode(null)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '5px 8px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: isHovered ? 'var(--pale-green)' : 'transparent',
                  transition: 'background var(--transition-fast)',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: slice.color,
                      flexShrink: 0
                    }}
                  />
                  <span style={{ fontSize: '0.78rem', color: 'var(--dark-green)', fontWeight: isHovered ? 700 : 500 }}>
                    {slice.nama}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: isHovered ? 'var(--forest-green)' : 'var(--muted-green)',
                    paddingLeft: '8px'
                  }}
                >
                  {slice.percent}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
