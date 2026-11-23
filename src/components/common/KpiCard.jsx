// src/components/common/KpiCard.jsx
import { useEffect, useState } from 'react';

export default function KpiCard({ icon, label, value, rawValue, delta, iconBg, highlight = false, id }) {
  const [displayValue, setDisplayValue] = useState('0');

  // Count-up animation for numeric values
  useEffect(() => {
    if (typeof rawValue === 'number') {
      let start = 0;
      const end = rawValue;
      const duration = 800;
      const step = (timestamp) => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplayValue(Math.floor(eased * end).toString());
        if (progress < 1) requestAnimationFrame(step);
        else setDisplayValue(value);
      };
      requestAnimationFrame(step);
    } else {
      setDisplayValue(value);
    }
  }, [value, rawValue]);

  return (
    <div className="kpi-card" id={id} role="region" aria-label={label}>
      <div
        className="kpi-icon"
        style={{ background: iconBg || 'rgba(26,58,107,0.5)' }}
        aria-hidden="true"
      >
        {icon}
      </div>
      <div className="kpi-label">{label}</div>
      <div className={`kpi-value${highlight ? ' highlight' : ''}`} aria-live="polite">
        {displayValue}
      </div>
      {delta && <div className="kpi-delta">{delta}</div>}
    </div>
  );
}
