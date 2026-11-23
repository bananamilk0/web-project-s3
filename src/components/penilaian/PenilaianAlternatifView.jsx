/**
 * src/components/penilaian/PenilaianAlternatifView.jsx
 * Halaman Penilaian Alternatif Kost:
 * - Menampilkan Matriks Evaluasi Alternatif vs Kriteria (C1 - C6)
 * - Input & Pembaruan Nilai Alternatif Secara Cepat (Modal & Quick Edit)
 * - Status Kelengkapan Penilaian
 * - Rubrik & Panduan Skala Penilaian Kualitatif
 */

import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ClipboardList,
  Edit3,
  CheckCircle2,
  Calculator,
  Search,
  SlidersHorizontal,
  Info,
  Save,
  X,
  Sparkles,
  ArrowRight,
  TrendingUp,
  HelpCircle,
  Building2
} from 'lucide-react';

export default function PenilaianAlternatifView() {
  const { kostList, kriteriaList, updateKost, runCalculation, setActivePage, addToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [editingKost, setEditingKost] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [showRubrik, setShowRubrik] = useState(false);

  // Filter Kost Aktif
  const activeKostList = useMemo(() => {
    return kostList.filter(k => k.aktif !== false);
  }, [kostList]);

  const filteredKost = useMemo(() => {
    return activeKostList.filter(item => {
      const matchSearch = item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.alamat.toLowerCase().includes(searchQuery.toLowerCase());
      const matchType = filterType === 'all' || item.tipeKamar === filterType;
      return matchSearch && matchType;
    });
  }, [activeKostList, searchQuery, filterType]);

  // Statistik Kelengkapan Nilai
  const stats = useMemo(() => {
    const total = activeKostList.length;
    let lengkapCount = 0;
    activeKostList.forEach(k => {
      if (k.harga > 0 && k.fasilitasKamar > 0 && k.kondisiKamar > 0 && k.luasKamar > 0 && k.jarakTujuan > 0 && k.fasilitasPendukung > 0) {
        lengkapCount++;
      }
    });
    return {
      total,
      lengkapCount,
      persen: total > 0 ? Math.round((lengkapCount / total) * 100) : 0
    };
  }, [activeKostList]);

  const handleOpenEdit = (kost) => {
    setEditingKost(kost);
    setEditFormData({
      harga: kost.harga,
      fasilitasKamar: kost.fasilitasKamar,
      kondisiKamar: kost.kondisiKamar,
      luasKamar: kost.luasKamar,
      jarakTujuan: kost.jarakTujuan,
      fasilitasPendukung: kost.fasilitasPendukung
    });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingKost) return;

    updateKost(editingKost.id, {
      harga: Number(editFormData.harga),
      fasilitasKamar: Number(editFormData.fasilitasKamar),
      kondisiKamar: Number(editFormData.kondisiKamar),
      luasKamar: Number(editFormData.luasKamar),
      jarakTujuan: Number(editFormData.jarakTujuan),
      fasilitasPendukung: Number(editFormData.fasilitasPendukung)
    });

    addToast(`Nilai penilaian untuk "${editingKost.nama}" berhasil diperbarui!`, 'success');
    setEditingKost(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. Header Page Title */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--forest-green)', letterSpacing: '-0.02em' }}>
            Penilaian Alternatif Kost
          </h1>
          <p style={{ fontSize: '0.86rem', color: 'var(--muted-green)' }}>
            Evaluasi dan perbarui skor nilai masing-masing calon kost terhadap 6 kriteria SPK sebelum dilakukan normalisasi SAW.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            className="btn btn-outline"
            onClick={() => setShowRubrik(!showRubrik)}
            style={{ backgroundColor: '#FFFFFF' }}
          >
            <HelpCircle size={15} color="var(--emerald-green)" />
            <span>{showRubrik ? 'Tutup Rubrik' : 'Panduan Skala Penilaian'}</span>
          </button>

          <button
            className="btn btn-primary"
            onClick={() => {
              runCalculation();
              setActivePage('saw');
            }}
          >
            <Calculator size={16} />
            <span>Lanjut ke Perhitungan SAW</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>

      {/* 2. Banner Kelengkapan Penilaian */}
      <div
        className="panel"
        style={{
          padding: '18px 22px',
          backgroundColor: 'var(--pale-green)',
          borderColor: 'var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: 'var(--emerald-green)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFDF5',
              flexShrink: 0
            }}
          >
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--forest-green)' }}>
              Kelengkapan Data Penilaian: {stats.persen}% Lengkap
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--dark-green)' }}>
              {stats.lengkapCount} dari {stats.total} alternatif kost aktif telah memiliki nilai evaluasi pada seluruh kriteria (C1 - C6).
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '120px',
              height: '10px',
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-pill)',
              overflow: 'hidden',
              border: '1px solid var(--border-light)'
            }}
          >
            <div
              style={{
                width: `${stats.persen}%`,
                height: '100%',
                backgroundColor: 'var(--emerald-green)',
                borderRadius: 'var(--radius-pill)',
                transition: 'width 0.5s ease'
              }}
            />
          </div>
          <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--forest-green)' }}>
            {stats.persen}%
          </span>
        </div>
      </div>

      {/* Rubrik Penilaian Collapsible */}
      {showRubrik && (
        <div className="panel" style={{ padding: '20px 24px', backgroundColor: 'var(--warm-ivory)', borderColor: '#E2DAC8' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Sparkles size={18} color="var(--emerald-green)" />
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--forest-green)' }}>
              Rubrik Panduan Penilaian Skala Kualitatif (1 - 5)
            </h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', fontSize: '0.82rem' }}>
            <div style={{ backgroundColor: '#FFFFFF', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
              <div style={{ fontWeight: 700, color: 'var(--forest-green)', marginBottom: '8px' }}>
                C2: Fasilitas Kamar (Benefit)
              </div>
              <ul style={{ paddingLeft: '16px', color: 'var(--dark-green)', lineHeight: 1.6, margin: 0 }}>
                <li><strong>1:</strong> Kasur polos tanpa perabot</li>
                <li><strong>2:</strong> Kasur + lemari kecil</li>
                <li><strong>3:</strong> Kasur springbed, lemari, meja kerja</li>
                <li><strong>4:</strong> AC, springbed, meja, KM dalam</li>
                <li><strong>5:</strong> Sangat lengkap (AC, TV, Water Heater, Balkon)</li>
              </ul>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
              <div style={{ fontWeight: 700, color: 'var(--forest-green)', marginBottom: '8px' }}>
                C3: Kondisi Kamar & Bangunan (Benefit)
              </div>
              <ul style={{ paddingLeft: '16px', color: 'var(--dark-green)', lineHeight: 1.6, margin: 0 }}>
                <li><strong>1:</strong> Bangunan tua, lembab, ventilasi minim</li>
                <li><strong>2:</strong> Sirkulasi udara sempit & pengap</li>
                <li><strong>3:</strong> Standar bersih dan cukup terawat</li>
                <li><strong>4:</strong> Bangunan baru, ventilasi segar & rapi</li>
                <li><strong>5:</strong> Desain estetik modern & sirkulasi silang</li>
              </ul>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
              <div style={{ fontWeight: 700, color: 'var(--forest-green)', marginBottom: '8px' }}>
                C6: Fasilitas Pendukung (Benefit)
              </div>
              <ul style={{ paddingLeft: '16px', color: 'var(--dark-green)', lineHeight: 1.6, margin: 0 }}>
                <li><strong>1:</strong> Tanpa WiFi, parkir sempit</li>
                <li><strong>2:</strong> Parkir motor, tanpa akses WiFi</li>
                <li><strong>3:</strong> WiFi 20 Mbps, dapur bersama</li>
                <li><strong>4:</strong> WiFi 50 Mbps, parkir mobil/motor, CCTV</li>
                <li><strong>5:</strong> WiFi FO 100 Mbps, Security 24h, Rooftop</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 3. Filter & Pencarian Alternatif */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '260px' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '360px' }}>
            <Search size={16} color="var(--muted-green)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Cari alternatif kost..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="form-control"
              style={{ paddingLeft: '36px' }}
            />
          </div>

          <select
            className="form-control form-select"
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            style={{ width: 'auto', minWidth: '140px' }}
          >
            <option value="all">Semua Tipe</option>
            <option value="Putra">Khusus Putra</option>
            <option value="Putri">Khusus Putri</option>
            <option value="Campur">Campur</option>
          </select>
        </div>

        <div style={{ fontSize: '0.84rem', color: 'var(--muted-green)', fontWeight: 600 }}>
          Menampilkan {filteredKost.length} dari {activeKostList.length} Alternatif
        </div>
      </div>

      {/* 4. Tabel Matriks Penilaian Alternatif */}
      <div className="panel" style={{ overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="verdant-table">
            <thead>
              <tr>
                <th style={{ width: '45px', textAlign: 'center' }}>No</th>
                <th>Alternatif Kost</th>
                <th>Tipe</th>
                <th className="text-right">
                  <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <span>C1: Harga</span>
                    <span className="badge badge-cost" style={{ fontSize: '0.62rem', padding: '1px 5px' }}>Cost</span>
                  </div>
                </th>
                <th className="text-center">
                  <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span>C2: Fasilitas</span>
                    <span className="badge badge-benefit" style={{ fontSize: '0.62rem', padding: '1px 5px' }}>Benefit (1-5)</span>
                  </div>
                </th>
                <th className="text-center">
                  <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span>C3: Kondisi</span>
                    <span className="badge badge-benefit" style={{ fontSize: '0.62rem', padding: '1px 5px' }}>Benefit (1-5)</span>
                  </div>
                </th>
                <th className="text-right">
                  <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <span>C4: Luas</span>
                    <span className="badge badge-benefit" style={{ fontSize: '0.62rem', padding: '1px 5px' }}>Benefit (m²)</span>
                  </div>
                </th>
                <th className="text-right">
                  <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <span>C5: Jarak</span>
                    <span className="badge badge-cost" style={{ fontSize: '0.62rem', padding: '1px 5px' }}>Cost (km)</span>
                  </div>
                </th>
                <th className="text-center">
                  <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span>C6: Pendukung</span>
                    <span className="badge badge-benefit" style={{ fontSize: '0.62rem', padding: '1px 5px' }}>Benefit (1-5)</span>
                  </div>
                </th>
                <th style={{ textAlign: 'center', width: '100px' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredKost.map((kost, index) => (
                <tr key={kost.id}>
                  <td style={{ textAlign: 'center', fontWeight: 600, color: 'var(--muted-green)' }}>
                    {index + 1}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img
                        src={kost.foto}
                        alt={kost.nama}
                        style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--forest-green)', fontSize: '0.92rem' }}>
                          {kost.nama}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--muted-green)' }}>
                          {kost.alamat}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-cost" style={{ fontSize: '0.74rem' }}>
                      {kost.tipeKamar}
                    </span>
                  </td>
                  <td className="text-right" style={{ fontWeight: 700, color: 'var(--forest-green)', whiteSpace: 'nowrap' }}>
                    Rp {kost.harga.toLocaleString('id-ID')}
                  </td>
                  <td className="text-center">
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-pill)',
                        backgroundColor: 'var(--pale-green)',
                        color: 'var(--forest-green)',
                        fontWeight: 700,
                        fontSize: '0.84rem'
                      }}
                    >
                      {kost.fasilitasKamar} / 5
                    </span>
                  </td>
                  <td className="text-center">
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-pill)',
                        backgroundColor: 'var(--pale-green)',
                        color: 'var(--forest-green)',
                        fontWeight: 700,
                        fontSize: '0.84rem'
                      }}
                    >
                      {kost.kondisiKamar} / 5
                    </span>
                  </td>
                  <td className="text-right" style={{ fontWeight: 600, color: 'var(--dark-green)' }}>
                    {kost.luasKamar} m²
                  </td>
                  <td className="text-right" style={{ fontWeight: 600, color: 'var(--dark-green)' }}>
                    {kost.jarakTujuan} km
                  </td>
                  <td className="text-center">
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-pill)',
                        backgroundColor: 'var(--pale-green)',
                        color: 'var(--forest-green)',
                        fontWeight: 700,
                        fontSize: '0.84rem'
                      }}
                    >
                      {kost.fasilitasPendukung} / 5
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleOpenEdit(kost)}
                      title="Ubah Nilai Penilaian"
                    >
                      <Edit3 size={14} />
                      <span>Ubah</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Modal Cepat Edit Penilaian Alternatif */}
      {editingKost && (
        <div className="modal-overlay" onClick={() => setEditingKost(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '580px' }}>
            <div className="modal-header">
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--forest-green)' }}>
                  Perbarui Nilai Penilaian: {editingKost.nama}
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--muted-green)' }}>
                  Sesuaikan nilai atribut kriteria untuk alternatif ini.
                </p>
              </div>
              <button
                onClick={() => setEditingKost(null)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} color="var(--dark-green)" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* C1: Harga */}
                <div className="form-group">
                  <label className="form-label">
                    C1: Harga Sewa Bulanan (Rp) [Cost]
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={editFormData.harga}
                    onChange={e => setEditFormData({ ...editFormData, harga: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  {/* C4: Luas */}
                  <div className="form-group">
                    <label className="form-label">C4: Luas Kamar (m²) [Benefit]</label>
                    <input
                      type="number"
                      className="form-control"
                      value={editFormData.luasKamar}
                      onChange={e => setEditFormData({ ...editFormData, luasKamar: e.target.value })}
                      required
                    />
                  </div>

                  {/* C5: Jarak */}
                  <div className="form-group">
                    <label className="form-label">C5: Jarak Kampus (km) [Cost]</label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-control"
                      value={editFormData.jarakTujuan}
                      onChange={e => setEditFormData({ ...editFormData, jarakTujuan: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* C2: Fasilitas Kamar (1-5) */}
                <div className="form-group">
                  <label className="form-label">C2: Fasilitas Kamar (Skala 1 - 5) [Benefit]</label>
                  <select
                    className="form-control form-select"
                    value={editFormData.fasilitasKamar}
                    onChange={e => setEditFormData({ ...editFormData, fasilitasKamar: Number(e.target.value) })}
                  >
                    <option value={1}>1 - Sangat Minim (Kasur saja)</option>
                    <option value={2}>2 - Kurang Lengkap (Kasur + Lemari kecil)</option>
                    <option value={3}>3 - Cukup Lengkap (Springbed, Lemari, Meja)</option>
                    <option value={4}>4 - Lengkap (AC, Springbed, Meja, KM Dalam)</option>
                    <option value={5}>5 - Sangat Lengkap (AC, TV, Water Heater, Balkon)</option>
                  </select>
                </div>

                {/* C3: Kondisi Kamar (1-5) */}
                <div className="form-group">
                  <label className="form-label">C3: Kondisi Kamar (Skala 1 - 5) [Benefit]</label>
                  <select
                    className="form-control form-select"
                    value={editFormData.kondisiKamar}
                    onChange={e => setEditFormData({ ...editFormData, kondisiKamar: Number(e.target.value) })}
                  >
                    <option value={1}>1 - Sangat Buruk (Lembab, minim ventilasi)</option>
                    <option value={2}>2 - Kurang Baik (Sirkulasi sempit, pengap)</option>
                    <option value={3}>3 - Cukup Baik (Bersih, terawat standar)</option>
                    <option value={4}>4 - Baik (Bangunan baru, ventilasi segar)</option>
                    <option value={5}>5 - Sangat Baik (Estetik modern, sirkulasi silang)</option>
                  </select>
                </div>

                {/* C6: Fasilitas Pendukung (1-5) */}
                <div className="form-group">
                  <label className="form-label">C6: Fasilitas Pendukung (Skala 1 - 5) [Benefit]</label>
                  <select
                    className="form-control form-select"
                    value={editFormData.fasilitasPendukung}
                    onChange={e => setEditFormData({ ...editFormData, fasilitasPendukung: Number(e.target.value) })}
                  >
                    <option value={1}>1 - Sangat Minim (Tanpa WiFi, parkir sempit)</option>
                    <option value={2}>2 - Kurang Lengkap (Parkir motor, tanpa WiFi)</option>
                    <option value={3}>3 - Cukup Lengkap (WiFi 20 Mbps, dapur bersama)</option>
                    <option value={4}>4 - Lengkap (WiFi 50 Mbps, parkir mobil/motor, CCTV)</option>
                    <option value={5}>5 - Sangat Lengkap (WiFi FO 100 Mbps, 24h security, lounge)</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setEditingKost(null)}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  <Save size={16} />
                  <span>Simpan Nilai Penilaian</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
