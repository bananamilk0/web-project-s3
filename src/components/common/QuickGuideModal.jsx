/**
 * src/components/common/QuickGuideModal.jsx
 * Modal Panduan Singkat Sistem Pendukung Keputusan (Metode SAW)
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, CheckCircle2, BookOpen, Calculator, Sparkles, Scale, Award } from 'lucide-react';

const GUIDE_STEPS = [
  {
    step: 1,
    title: 'Pembentukan Matriks Keputusan (X)',
    desc: 'Sistem mengumpulkan data dari seluruh alternatif kost yang aktif. Setiap nilai kriteria (Harga, Fasilitas, Kondisi, Luas, Jarak, Pendukung) disusun ke dalam matriks baris × kolom.',
    icon: BookOpen,
    formula: 'X = [x_ij] di mana i = alternatif, j = kriteria'
  },
  {
    step: 2,
    title: 'Normalisasi Matriks (R)',
    desc: 'Semua nilai kriteria diubah ke skala proporsional [0 s/d 1] sesuai jenis atribut:',
    icon: Scale,
    formula: '• Benefit (Fasilitas, Kondisi, Luas, Pendukung): r_ij = x_ij / max(x_j)\n• Cost (Harga, Jarak): r_ij = min(x_j) / x_ij'
  },
  {
    step: 3,
    title: 'Pembobotan & Nilai Preferensi (V_i)',
    desc: 'Setiap nilai ternormalisasi (r_ij) dikalikan dengan bobot kriteria yang bersangkutan (w_j). Total akumulasi perkalian menghasilkan Skor Preferensi Akhir V_i.',
    icon: Calculator,
    formula: 'V_i = ∑ (w_j × r_ij)'
  },
  {
    step: 4,
    title: 'Pemeringkatan Rekomendasi',
    desc: 'Alternatif diurutkan dari skor V_i tertinggi ke terendah. Alternatif dengan nilai V_i terbesar menjadi Rekomendasi Utama (Peringkat #1) yang paling seimbang memenuhi preferensi.',
    icon: Award,
    formula: 'V_terbesar = Peringkat #1 (Juara Rekomendasi)'
  }
];

export default function QuickGuideModal() {
  const { guideModalOpen, setGuideModalOpen } = useApp();
  const [activeTab, setActiveTab] = useState(0);

  if (!guideModalOpen) return null;

  return (
    <div className="modal-overlay" onClick={() => setGuideModalOpen(false)}>
      <div
        className="modal-card"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '680px' }}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'var(--emerald-green)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFDF5'
              }}
            >
              <Sparkles size={18} />
            </div>
            <div>
              <div className="modal-title">Panduan SPK Metode SAW</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--muted-green)' }}>
                Konsep Simple Additive Weighting pada Kikost
              </div>
            </div>
          </div>
          <button
            onClick={() => setGuideModalOpen(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted-green)' }}
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Stepper Tabs */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '4px' }}>
            {GUIDE_STEPS.map((s, idx) => (
              <button
                key={s.step}
                onClick={() => setActiveTab(idx)}
                className={`btn btn-sm ${activeTab === idx ? 'btn-primary' : 'btn-secondary'}`}
                style={{ flex: 1, padding: '8px 10px' }}
              >
                Tahap {s.step}
              </button>
            ))}
          </div>

          {/* Active Step Content */}
          <div
            style={{
              padding: '20px',
              backgroundColor: 'var(--pale-green)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-light)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--emerald-green)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF'
                }}
              >
                {React.createElement(GUIDE_STEPS[activeTab].icon, { size: 22 })}
              </div>
              <div>
                <h4 style={{ fontSize: '1.05rem', color: 'var(--forest-green)', fontWeight: 700 }}>
                  {GUIDE_STEPS[activeTab].title}
                </h4>
                <div style={{ fontSize: '0.8rem', color: 'var(--muted-green)' }}>
                  Langkah {activeTab + 1} dari {GUIDE_STEPS.length}
                </div>
              </div>
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--dark-green)', lineHeight: 1.6, marginBottom: '16px' }}>
              {GUIDE_STEPS[activeTab].desc}
            </p>

            <div
              style={{
                backgroundColor: '#FFFFFF',
                padding: '14px 16px',
                borderRadius: 'var(--radius-md)',
                borderLeft: '4px solid var(--emerald-green)',
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                color: 'var(--forest-green)',
                whiteSpace: 'pre-line'
              }}
            >
              {GUIDE_STEPS[activeTab].formula}
            </div>
          </div>

          <div
            style={{
              marginTop: '20px',
              padding: '14px 16px',
              backgroundColor: 'var(--warm-ivory)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid #E5DEC9',
              fontSize: '0.82rem',
              color: 'var(--dark-green)',
              lineHeight: 1.5
            }}
          >
            <strong>Prinsip Penting:</strong> Rekomendasi SPK SAW merupakan alat bantu analisis berbasis kriteria objektif dan konfigurasi bobot. Administrator dapat melakukan penyesuaian bobot pada menu <em>Kriteria & Bobot</em> untuk menguji skenario preferensi yang berbeda.
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setGuideModalOpen(false)}>
            Tutup
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              if (activeTab < GUIDE_STEPS.length - 1) {
                setActiveTab(activeTab + 1);
              } else {
                setGuideModalOpen(false);
              }
            }}
          >
            {activeTab < GUIDE_STEPS.length - 1 ? 'Tahap Selanjutnya' : 'Selesai & Mulai Eksplorasi'}
          </button>
        </div>
      </div>
    </div>
  );
}
