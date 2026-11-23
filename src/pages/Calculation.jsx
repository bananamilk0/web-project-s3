// src/pages/Calculation.jsx
import { useState } from 'react';
import { Calculator, RefreshCw, ChevronDown, ChevronUp, Trophy } from 'lucide-react';
import { useApp } from '../context/AppContext';
import sawEngine from '../utils/sawEngine';

const STEPS = [
  { id: 'decision',    label: 'Matriks Keputusan', num: 1 },
  { id: 'normal',      label: 'Matriks Ternormalisasi', num: 2 },
  { id: 'preference',  label: 'Nilai Preferensi', num: 3 },
  { id: 'ranking',     label: 'Ranking Akhir', num: 4 },
];

export default function Calculation() {
  const { kosts, criteria, sawResult, recalculate } = useApp();
  const [activeStep, setActiveStep] = useState('decision');
  const [loading, setLoading] = useState(false);

  const { decisionMatrix, normalMatrix, colStats, preferences, ranked } = sawResult || {};

  const handleRecalculate = () => {
    setLoading(true);
    setTimeout(() => {
      recalculate();
      setLoading(false);
    }, 600);
  };

  const getRankClass = (rank) => {
    if (rank === 1) return 'rank-1';
    if (rank === 2) return 'rank-2';
    if (rank === 3) return 'rank-3';
    return '';
  };

  const formatVal = (val, crit) => {
    if (!crit) return val;
    if (crit.key === 'price') return sawEngine.formatRupiah(val);
    return val;
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-header-title">
          <Calculator size={28} />
          <span>Perhitungan <span className="highlight">SAW</span></span>
        </h1>
        <p className="page-header-subtitle">
          Proses step-by-step metode Simple Additive Weighting — {kosts.length} alternatif, {criteria.length} kriteria
        </p>
      </div>

      {/* Step Tabs */}
      <div className="step-tabs" role="tablist" aria-label="Langkah perhitungan SAW">
        {STEPS.map((step) => (
          <button
            key={step.id}
            className={`step-tab${activeStep === step.id ? ' active' : ''}`}
            onClick={() => setActiveStep(step.id)}
            role="tab"
            aria-selected={activeStep === step.id}
            id={`step-tab-${step.id}`}
            aria-controls={`step-panel-${step.id}`}
          >
            <span className="step-tab-number">{step.num}</span>
            {step.label}
          </button>
        ))}
        <button
          className="btn btn-primary btn-sm"
          onClick={handleRecalculate}
          disabled={loading}
          id="btn-recalculate-saw"
          aria-label="Hitung ulang SAW"
          style={{ marginLeft: 'auto' }}
        >
          <RefreshCw size={14} className={loading ? 'spin' : ''} />
          {loading ? 'Menghitung...' : 'Hitung Ulang'}
        </button>
      </div>

      {/* Step: Decision Matrix */}
      {activeStep === 'decision' && (
        <div className="card" id="step-panel-decision" role="tabpanel" aria-labelledby="step-tab-decision">
          <div className="card-header">
            <h3 className="card-title">
              <span className="badge badge-primary" style={{ marginRight: 8 }}>Step 1</span>
              Matriks Keputusan (X)
            </h3>
          </div>
          <div className="card-body" style={{ padding: '0' }}>
            <div style={{ padding: '16px 20px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: 'var(--text-small)', color: 'var(--text-on-dark-muted)' }}>
              Matriks keputusan berisi nilai asli setiap alternatif kost pada setiap kriteria.
            </div>
            <div className="table-wrapper">
              {decisionMatrix && (
                <table className="data-table" aria-label="Matriks keputusan">
                  <thead>
                    <tr>
                      <th>Alternatif</th>
                      {criteria.map((c) => (
                        <th key={c.id} title={c.description}>
                          {c.name}
                          <br />
                          <span style={{ fontWeight: 400, opacity: 0.7, textTransform: 'none', fontSize: '0.65rem' }}>
                            ({c.type === 'benefit' ? 'B' : 'C'}) w={c.weight}
                          </span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {kosts.map((kost, i) => (
                      <tr key={kost.id}>
                        <td>
                          <div style={{ fontWeight: 600, color: 'var(--text-on-dark)' }}>A{i + 1}</div>
                          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-on-dark-muted)' }}>{kost.name}</div>
                        </td>
                        {decisionMatrix[i]?.map((val, j) => (
                          <td key={j} className="mono">
                            {formatVal(val, criteria[j])}
                          </td>
                        ))}
                      </tr>
                    ))}
                    <tr style={{ background: '#F7FEE7' }}>
                      <td style={{ fontWeight: 700, color: '#0B0B72' }}>Max / Min</td>
                      {colStats?.map((stat, j) => (
                        <td key={j} style={{ fontSize: 'var(--text-xs)' }}>
                          <span style={{ color: 'var(--color-success)' }}>↑ {criteria[j].type === 'benefit' ? formatVal(stat.max, criteria[j]) : formatVal(stat.min, criteria[j])}</span>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Step: Normal Matrix */}
      {activeStep === 'normal' && (
        <div className="card" id="step-panel-normal" role="tabpanel" aria-labelledby="step-tab-normal">
          <div className="card-header">
            <h3 className="card-title">
              <span className="badge badge-primary" style={{ marginRight: 8 }}>Step 2</span>
              Matriks Ternormalisasi (R)
            </h3>
          </div>
          <div className="card-body" style={{ padding: '0' }}>
            <div style={{ padding: '16px 20px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: 'var(--text-small)', color: 'var(--text-on-dark-muted)' }}>
              Benefit: r<sub>ij</sub> = x<sub>ij</sub> / max(x<sub>j</sub>) &nbsp;|&nbsp;
              Cost: r<sub>ij</sub> = min(x<sub>j</sub>) / x<sub>ij</sub>
            </div>
            <div className="table-wrapper">
              {normalMatrix && (
                <table className="data-table" aria-label="Matriks ternormalisasi">
                  <thead>
                    <tr>
                      <th>Alternatif</th>
                      {criteria.map((c) => (
                        <th key={c.id}>{c.name}<br /><span style={{ fontWeight: 400, opacity: 0.7, fontSize: '0.65rem', textTransform: 'none' }}>({c.type === 'benefit' ? 'Benefit' : 'Cost'})</span></th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {kosts.map((kost, i) => (
                      <tr key={kost.id}>
                        <td>
                          <div style={{ fontWeight: 600, color: 'var(--text-on-dark)' }}>A{i + 1}</div>
                          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-on-dark-muted)' }}>{kost.name}</div>
                        </td>
                        {normalMatrix[i]?.map((val, j) => (
                          <td key={j} className="mono" style={{ color: val >= 0.8 ? 'var(--color-success)' : val >= 0.5 ? 'var(--color-warning)' : 'var(--text-on-dark)' }}>
                            {sawEngine.formatScore(val)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Step: Preference */}
      {activeStep === 'preference' && (
        <div className="card" id="step-panel-preference" role="tabpanel" aria-labelledby="step-tab-preference">
          <div className="card-header">
            <h3 className="card-title">
              <span className="badge badge-primary" style={{ marginRight: 8 }}>Step 3</span>
              Nilai Preferensi (V)
            </h3>
          </div>
          <div className="card-body" style={{ padding: '0' }}>
            <div style={{ padding: '16px 20px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: 'var(--text-small)', color: 'var(--text-on-dark-muted)' }}>
              V<sub>i</sub> = Σ (w<sub>j</sub> × r<sub>ij</sub>) — penjumlahan bobot × nilai ternormalisasi per baris
            </div>
            <div className="table-wrapper">
              {preferences && (
                <table className="data-table" aria-label="Nilai preferensi">
                  <thead>
                    <tr>
                      <th>Alternatif</th>
                      {criteria.map((c, j) => (
                        <th key={c.id}>{c.name}<br /><span style={{ fontWeight: 400, opacity: 0.7, fontSize: '0.65rem', textTransform: 'none' }}>w={c.weight}</span></th>
                      ))}
                      <th>V<sub>i</sub> (Total)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {kosts.map((kost, i) => (
                      <tr key={kost.id}>
                        <td>
                          <div style={{ fontWeight: 600, color: 'var(--text-on-dark)' }}>A{i + 1}</div>
                          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-on-dark-muted)' }}>{kost.name}</div>
                        </td>
                        {normalMatrix[i]?.map((val, j) => (
                          <td key={j} className="mono" style={{ fontSize: '0.8rem' }}>
                            {sawEngine.formatScore(criteria[j].weight * val)}
                          </td>
                        ))}
                        <td className="mono" style={{ fontWeight: 700 }}>
                          <span className="score-pill">{sawEngine.formatScore(preferences[i])}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Step: Ranking */}
      {activeStep === 'ranking' && (
        <div className="card" id="step-panel-ranking" role="tabpanel" aria-labelledby="step-tab-ranking">
          <div className="card-header">
            <h3 className="card-title">
              <Trophy size={18} />
              <span className="badge badge-primary" style={{ marginLeft: 8, marginRight: 8 }}>Step 4</span>
              Ranking Akhir
            </h3>
          </div>
          <div className="card-body" style={{ padding: '0' }}>
            <div style={{ padding: '16px 20px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: 'var(--text-small)', color: 'var(--text-on-dark-muted)' }}>
              Alternatif diurutkan berdasarkan nilai V<sub>i</sub> tertinggi. Skor tertinggi = kost terbaik.
            </div>
            <div className="table-wrapper">
              {ranked && (
                <table className="data-table" aria-label="Ranking SAW akhir">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Nama Kost</th>
                      <th>Alamat</th>
                      <th>Skor (V<sub>i</sub>)</th>
                      <th>Visualisasi Skor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ranked.map((kost) => (
                      <tr key={kost.id} className={getRankClass(kost.rank)} id={`result-row-${kost.rank}`}>
                        <td>
                          <span className={`badge badge-rank-${kost.rank <= 3 ? kost.rank : 'primary'}`}>
                            {kost.rank <= 3 ? ['🥇', '🥈', '🥉'][kost.rank - 1] : `#${kost.rank}`}
                          </span>
                        </td>
                        <td style={{ fontWeight: kost.rank <= 3 ? 700 : 400, color: '#0B0B72' }}>
                          {kost.name}
                        </td>
                        <td style={{ color: 'var(--text-on-dark-muted)', fontSize: 'var(--text-xs)' }}>{kost.address}</td>
                        <td className="mono" style={{ fontWeight: 700 }}>{sawEngine.formatScore(kost.score)}</td>
                        <td style={{ minWidth: 160 }}>
                          <div style={{ height: 6, borderRadius: 'var(--radius-full)', background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                            <div style={{
                              height: '100%',
                              width: `${(kost.score / (ranked[0]?.score || 1)) * 100}%`,
                              background: kost.rank === 1 ? 'var(--color-highlight)' : kost.rank === 2 ? 'var(--color-warning)' : kost.rank === 3 ? 'var(--color-info)' : 'var(--color-primary-light)',
                              borderRadius: 'var(--radius-full)',
                              transition: 'width 1s ease',
                            }} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin { animation: spin 0.8s linear infinite; }
      `}</style>
    </div>
  );
}
