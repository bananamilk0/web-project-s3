/**
 * src/components/common/SearchModal.jsx
 * Modal Pencarian Global [Ctrl+K] untuk Kost, Kriteria, dan Navigasi Halaman
 */

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, X, Building2, SlidersHorizontal, ArrowRight, MapPin } from 'lucide-react';

export default function SearchModal() {
  const { searchModalOpen, setSearchModalOpen, kostList, kriteriaList, setActivePage } = useApp();
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (searchModalOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [searchModalOpen]);

  if (!searchModalOpen) return null;

  const filteredKost = query.trim()
    ? kostList.filter(k =>
        k.nama.toLowerCase().includes(query.toLowerCase()) ||
        k.alamat.toLowerCase().includes(query.toLowerCase()) ||
        k.tipeKamar.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const filteredKriteria = query.trim()
    ? kriteriaList.filter(c =>
        c.nama.toLowerCase().includes(query.toLowerCase()) ||
        c.kode.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleSelectPage = (pageId) => {
    setActivePage(pageId);
    setSearchModalOpen(false);
  };

  return (
    <div
      className="modal-overlay"
      onClick={() => setSearchModalOpen(false)}
      style={{ alignItems: 'flex-start', paddingTop: '10vh' }}
    >
      <div
        className="modal-card"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '600px', borderRadius: 'var(--radius-xl)' }}
      >
        {/* Search Input Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-light)'
          }}
        >
          <Search size={20} color="var(--emerald-green)" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Ketik nama kost, kriteria (misal: C1, Harga), atau menu..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '1rem',
              color: 'var(--dark-green)',
              fontFamily: 'var(--font-sans)',
              background: 'transparent'
            }}
          />
          <button
            onClick={() => setSearchModalOpen(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted-green)' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Results Area */}
        <div style={{ maxHeight: '380px', overflowY: 'auto', padding: '16px' }}>
          {!query.trim() ? (
            <div style={{ color: 'var(--muted-green)', fontSize: '0.88rem' }}>
              <div style={{ fontWeight: 600, color: 'var(--forest-green)', marginBottom: '8px' }}>
                Pintasan Navigasi:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleSelectPage('dashboard')}
                  style={{ justifyContent: 'flex-start' }}
                >
                  Dashboard Utama
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleSelectPage('kost')}
                  style={{ justifyContent: 'flex-start' }}
                >
                  Kelola Data Kost
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleSelectPage('kriteria')}
                  style={{ justifyContent: 'flex-start' }}
                >
                  Konfigurasi Kriteria
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleSelectPage('hasil')}
                  style={{ justifyContent: 'flex-start' }}
                >
                  Hasil & Peringkat SPK
                </button>
              </div>
            </div>
          ) : (
            <div>
              {/* Hasil Kriteria */}
              {filteredKriteria.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--muted-green)', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Kriteria Penilaian ({filteredKriteria.length})
                  </div>
                  {filteredKriteria.map(c => (
                    <div
                      key={c.id}
                      onClick={() => handleSelectPage('kriteria')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 12px',
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer',
                        transition: 'background var(--transition-fast)'
                      }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--pale-green)'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span className="badge badge-benefit">{c.kode}</span>
                        <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--dark-green)' }}>{c.nama}</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--muted-green)' }}>Bobot: {c.bobot} ({Math.round(c.bobot * 100)}%)</span>
                      </div>
                      <ArrowRight size={16} color="var(--emerald-green)" />
                    </div>
                  ))}
                </div>
              )}

              {/* Hasil Kost */}
              {filteredKost.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--muted-green)', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Alternatif Kost ({filteredKost.length})
                  </div>
                  {filteredKost.map(k => (
                    <div
                      key={k.id}
                      onClick={() => handleSelectPage('kost')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 12px',
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer',
                        transition: 'background var(--transition-fast)'
                      }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--pale-green)'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={k.foto}
                          alt={k.nama}
                          style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--dark-green)' }}>{k.nama}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--muted-green)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <MapPin size={12} />
                            <span>{k.alamat}</span>
                            <span>• Rp {k.harga.toLocaleString('id-ID')}/bln</span>
                          </div>
                        </div>
                      </div>
                      <span className={`badge ${k.status === 'Tersedia' ? 'badge-available' : 'badge-full'}`}>
                        {k.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {filteredKost.length === 0 && filteredKriteria.length === 0 && (
                <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--muted-green)' }}>
                  Tidak ada hasil yang sesuai dengan "<strong>{query}</strong>"
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
