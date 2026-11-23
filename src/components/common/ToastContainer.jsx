/**
 * src/components/common/ToastContainer.jsx
 * Container Notifikasi Toast Mengambang
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map(toast => {
        let Icon = CheckCircle2;
        let iconColor = 'var(--emerald-green)';

        if (toast.type === 'error') {
          Icon = AlertCircle;
          iconColor = 'var(--soft-coral)';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          iconColor = '#EAB308';
        } else if (toast.type === 'info') {
          Icon = Info;
          iconColor = 'var(--forest-green)';
        }

        return (
          <div key={toast.id} className={`toast-item ${toast.type}`}>
            <Icon size={20} color={iconColor} style={{ flexShrink: 0 }} />
            <div style={{ flex: 1, color: 'var(--dark-green)', fontWeight: 500 }}>
              {toast.message}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--muted-green)',
                cursor: 'pointer',
                padding: '2px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
