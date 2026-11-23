// src/components/common/ProgressBar.jsx
import { useEffect, useState } from 'react';

export default function ProgressBar({ label, value, maxValue = 1, unit = '', id }) {
  const [width, setWidth] = useState(0);
  const pct = Math.min((value / maxValue) * 100, 100);
  const displayVal = typeof value === 'number' && value < 10
    ? value.toFixed(4)
    : value;

  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 100);
    return () => clearTimeout(t);
  }, [pct]);

  return (
    <div className="progress-bar-wrapper" id={id}>
      <div className="progress-bar-header">
        <span className="progress-bar-label">{label}</span>
        <span className="progress-bar-value">{displayVal}{unit ? ` ${unit}` : ''}</span>
      </div>
      <div className="progress-track" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div className="progress-fill" style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}
