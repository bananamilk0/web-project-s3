// src/pages/ManageCriteria.jsx
import { useState } from 'react';
import { Sliders, Save, RotateCcw, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { weightPresets, defaultCriteria } from '../data/criteriaData';

export default function ManageCriteria() {
  const { criteria, updateCriteria } = useApp();
  const [localCriteria, setLocalCriteria] = useState(() =>
    criteria.map((c) => ({ ...c }))
  );
  const [activePreset, setActivePreset] = useState(null);
  const [saved, setSaved] = useState(false);

  const totalWeight = localCriteria.reduce((s, c) => s + c.weight, 0);
  const isValid = Math.abs(totalWeight - 1.0) < 0.001;

  const handleWeightChange = (id, val) => {
    const num = Math.max(0, Math.min(1, parseFloat(val) || 0));
    setLocalCriteria((prev) =>
      prev.map((c) => (c.id === id ? { ...c, weight: +num.toFixed(2) } : c))
    );
    setActivePreset(null);
  };

  const applyPreset = (presetKey) => {
    const preset = weightPresets[presetKey];
    setLocalCriteria((prev) =>
      prev.map((c) => ({
        ...c,
        weight: preset.weights[c.id] ?? c.weight,
      }))
    );
    setActivePreset(presetKey);
  };

  const handleSave = () => {
    if (!isValid) return;
    updateCriteria(localCriteria);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    setLocalCriteria(defaultCriteria.map((c) => ({ ...c })));
    setActivePreset(null);
  };

  const typeLabels = { benefit: 'Benefit', cost: 'Cost' };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-header-title">
          <Sliders size={28} />
          <span>Kriteria <span className="highlight">&amp; Bobot</span></span>
        </h1>
        <p className="page-header-subtitle">
          Atur kriteria dan bobot SAW. Total bobot harus = 1.00 (100%)
        </p>
      </div>

      {/* Preset Buttons */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div className="card-header">
          <h3 className="card-title"><Info size={18} /> Preset Bobot Cepat</h3>
        </div>
        <div className="card-body">
          <div className="preset-grid">
            {Object.entries(weightPresets).map(([key, preset]) => (
              <button
                key={key}
                className={`preset-btn${activePreset === key ? ' active' : ''}`}
                onClick={() => applyPreset(key)}
                id={`preset-${key}`}
                aria-label={`Preset ${preset.name}`}
                aria-pressed={activePreset === key}
              >
                <span className="preset-btn-icon">{preset.icon}</span>
                <strong>{preset.name}</strong>
                <br />
                <small style={{ fontSize: '0.7rem', opacity: 0.7 }}>{preset.description}</small>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Weight Adjustment */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title"><Sliders size={18} /> Pengaturan Bobot</h3>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={handleReset}
              id="btn-reset-criteria"
              aria-label="Reset ke default"
            >
              <RotateCcw size={14} /> Reset
            </button>
            <button
              className="btn btn-primary btn-sm"
              onClick={handleSave}
              disabled={!isValid}
              id="btn-save-criteria"
              aria-label="Simpan perubahan bobot"
            >
              <Save size={14} /> {saved ? 'Tersimpan ✓' : 'Simpan'}
            </button>
          </div>
        </div>

        <div className="card-body">
          {/* Total Weight Indicator */}
          <div className="weight-total" id="weight-total-indicator">
            <span className="weight-total-label">Total Bobot Saat Ini</span>
            <span className={`weight-total-value ${isValid ? 'valid' : 'invalid'}`}>
              {totalWeight.toFixed(2)} {isValid ? '✓ Valid' : '✗ Harus = 1.00'}
            </span>
          </div>

          {/* Progress bar for total */}
          <div
            style={{
              height: 6, borderRadius: 'var(--radius-full)',
              background: 'rgba(255,255,255,0.08)',
              marginBottom: '24px', overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${Math.min(totalWeight * 100, 100)}%`,
                background: isValid ? 'var(--color-success)' : 'var(--color-danger)',
                borderRadius: 'var(--radius-full)',
                transition: 'width 0.3s ease, background 0.3s ease',
              }}
            />
          </div>

          {/* Criteria List */}
          {localCriteria.map((crit) => (
            <div
              key={crit.id}
              style={{
                padding: '16px',
                background: '#F8FAFC',
                borderRadius: 'var(--radius-md)',
                border: '1px solid #E2E8F0',
                marginBottom: '12px',
              }}
              id={`criteria-row-${crit.id}`}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#0B0B72', marginBottom: 4, fontFamily: 'var(--font-display)' }}>
                    {crit.name}
                  </div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <span className={`badge ${crit.type === 'benefit' ? 'badge-benefit' : 'badge-cost'}`}>
                      {typeLabels[crit.type]}
                    </span>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-on-dark-muted)' }}>
                      {crit.unit}
                    </span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    fontSize: '1.5rem', fontWeight: 800,
                    fontFamily: 'var(--font-mono)', color: '#0B0B72',
                  }}>
                    {(crit.weight * 100).toFixed(0)}%
                  </div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-on-dark-dim)' }}>
                    bobot: {crit.weight.toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="slider-wrapper">
                <input
                  type="range"
                  className="form-slider"
                  id={`slider-${crit.id}`}
                  min="0"
                  max="1"
                  step="0.01"
                  value={crit.weight}
                  onChange={(e) => handleWeightChange(crit.id, e.target.value)}
                  aria-label={`Bobot ${crit.name}`}
                  aria-valuenow={crit.weight}
                  aria-valuemin={0}
                  aria-valuemax={1}
                />
                <input
                  type="number"
                  id={`input-weight-${crit.id}`}
                  className="form-input"
                  style={{ width: '80px', textAlign: 'center', padding: '6px 8px', fontFamily: 'var(--font-mono)' }}
                  min="0" max="1" step="0.01"
                  value={crit.weight}
                  onChange={(e) => handleWeightChange(crit.id, e.target.value)}
                  aria-label={`Nilai bobot ${crit.name}`}
                />
              </div>

              {crit.description && (
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-on-dark-dim)', marginTop: 8 }}>
                  {crit.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Criteria Table */}
      <div className="card" style={{ marginTop: '20px' }}>
        <div className="card-header">
          <h3 className="card-title">Ringkasan Kriteria SAW</h3>
        </div>
        <div className="table-wrapper">
          <table className="data-table" aria-label="Ringkasan kriteria SAW">
            <thead>
              <tr>
                <th>No</th>
                <th>Kriteria</th>
                <th>Tipe</th>
                <th>Satuan</th>
                <th>Bobot</th>
                <th>Persentase</th>
              </tr>
            </thead>
            <tbody>
              {localCriteria.map((crit, i) => (
                <tr key={crit.id}>
                  <td className="mono">{i + 1}</td>
                  <td style={{ fontWeight: 600, color: 'var(--text-on-dark)' }}>{crit.name}</td>
                  <td>
                    <span className={`badge ${crit.type === 'benefit' ? 'badge-benefit' : 'badge-cost'}`}>
                      {typeLabels[crit.type]}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-on-dark-muted)' }}>{crit.unit}</td>
                  <td className="mono">{crit.weight.toFixed(2)}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ flex: 1, height: 6, background: '#E2E8F0', borderRadius: '99px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${crit.weight * 100}%`, background: 'linear-gradient(90deg, #1E40AF, #2563EB)', borderRadius: '99px' }} />
                      </div>
                      <span className="mono" style={{ color: '#0B0B72', minWidth: '3rem', fontSize: 'var(--text-xs)', fontWeight: 700 }}>
                        {(crit.weight * 100).toFixed(0)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
