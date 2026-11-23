// src/pages/ManageKost.jsx
import { useState } from 'react';
import {
  Building2, Plus, Search, Edit2, Trash2, Eye,
  CheckCircle2, AlertCircle, Sparkles, MapPin,
  Banknote, Maximize2, Shield, Droplets, Wifi, Star,
  X, Image as ImageIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import sawEngine from '../utils/sawEngine';

const STATUS_OPTIONS = [
  { value: 'tersedia', label: 'Tersedia', color: '#10B981', bg: 'rgba(16,185,129,0.15)' },
  { value: 'penuh', label: 'Penuh', color: '#EF4444', bg: 'rgba(239,68,68,0.15)' },
  { value: 'booking', label: 'Terbooking Sebagian', color: '#F59E0B', bg: 'rgba(245,158,11,0.15)' },
];

const emptyForm = {
  name: '',
  address: '',
  status: 'tersedia',
  foto: '',
  harga: '',
  jarakTujuan: '',
  luasKamar: '',
  kondisiKamar: '4',
  fasilitasKamar: '4',
  fasilitasPendukung: '4',
  keamanan: '4',
  sanitasi: '4',
  description: '',
};

const COLORS = [
  'hsl(218,70%,35%)', 'hsl(160,60%,30%)', 'hsl(280,60%,35%)',
  'hsl(35,70%,40%)',  'hsl(45,80%,40%)',  'hsl(200,70%,35%)',
  'hsl(330,60%,40%)', 'hsl(10,60%,35%)',  'hsl(55,90%,35%)', 'hsl(140,55%,30%)',
];

export default function ManageKost() {
  const { kosts, addKost, updateKost, deleteKost } = useApp();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  const filtered = kosts.filter((k) => {
    const matchSearch =
      k.name.toLowerCase().includes(search.toLowerCase()) ||
      k.address.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || (k.status || 'tersedia') === filterStatus;
    return matchSearch && matchStatus;
  });

  const openAdd = () => {
    setEditTarget(null);
    setForm(emptyForm);
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (kost) => {
    setEditTarget(kost);
    setForm({
      name: kost.name || '',
      address: kost.address || '',
      status: kost.status || 'tersedia',
      foto: kost.foto || '',
      harga: (kost.harga ?? kost.price ?? '').toString(),
      jarakTujuan: (kost.jarakTujuan ?? kost.distance ?? '').toString(),
      luasKamar: (kost.luasKamar ?? 16).toString(),
      kondisiKamar: (kost.kondisiKamar ?? 4).toString(),
      fasilitasKamar: (kost.fasilitasKamar ?? kost.facilities ?? 4).toString(),
      fasilitasPendukung: (kost.fasilitasPendukung ?? 4).toString(),
      keamanan: (kost.keamanan ?? kost.security ?? 4).toString(),
      sanitasi: (kost.sanitasi ?? kost.cleanliness ?? 4).toString(),
      description: kost.description || '',
    });
    setErrors({});
    setModalOpen(true);
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Nama kost wajib diisi';
    if (!form.address.trim()) e.address = 'Alamat wajib diisi';
    if (!form.harga || isNaN(form.harga) || +form.harga <= 0) e.harga = 'Harga sewa harus angka positif';
    if (!form.jarakTujuan || isNaN(form.jarakTujuan) || +form.jarakTujuan <= 0) e.jarakTujuan = 'Jarak harus angka positif (km)';
    if (!form.luasKamar || isNaN(form.luasKamar) || +form.luasKamar <= 0) e.luasKamar = 'Luas kamar harus angka positif (m²)';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const eValidate = validate();
    if (Object.keys(eValidate).length) {
      setErrors(eValidate);
      return;
    }

    const priceNum = +form.harga;
    const distanceNum = +form.jarakTujuan;
    const luasNum = +form.luasKamar;

    const data = {
      name: form.name.trim(),
      address: form.address.trim(),
      status: form.status,
      foto: form.foto.trim() || null,
      description: form.description.trim(),
      // Criteria keys
      harga: priceNum,
      price: priceNum, // backward compat
      jarakTujuan: distanceNum,
      distance: distanceNum, // backward compat
      luasKamar: luasNum,
      kondisiKamar: +form.kondisiKamar,
      fasilitasKamar: +form.fasilitasKamar,
      facilities: +form.fasilitasKamar, // backward compat
      fasilitasPendukung: +form.fasilitasPendukung,
      keamanan: +form.keamanan,
      security: +form.keamanan, // backward compat
      sanitasi: +form.sanitasi,
      cleanliness: +form.sanitasi, // backward compat
      imageColor: editTarget?.imageColor || COLORS[Math.floor(Math.random() * COLORS.length)],
      initials: form.name.trim().split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase(),
    };

    if (editTarget) {
      updateKost(editTarget.id, data);
    } else {
      addKost({ ...data, id: 'k' + Date.now() });
    }
    setModalOpen(false);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      deleteKost(deleteTarget.id);
      setDeleteModalOpen(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-header-title">
            <Building2 size={28} />
            <span>Manajemen <span className="highlight">Data Kost</span></span>
          </h1>
          <p className="page-header-subtitle">
            Kelola data alternatif kost lengkap: harga sewa, luas kamar, kondisi, fasilitas, jarak, foto, dan status ketersediaan
          </p>
        </div>
      </div>

      {/* Action Bar */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, flexWrap: 'wrap' }}>
            <div className="search-bar" style={{ width: '280px' }}>
              <span className="search-bar-icon"><Search size={16} /></span>
              <input
                id="kost-search"
                type="search"
                className="form-input"
                placeholder="Cari nama atau alamat kost..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Cari kost"
              />
            </div>

            <select
              className="form-input"
              style={{ width: 'auto' }}
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              id="filter-status-kost"
            >
              <option value="all">Semua Status Ketersediaan</option>
              <option value="tersedia">Tersedia</option>
              <option value="penuh">Penuh</option>
              <option value="booking">Terbooking Sebagian</option>
            </select>

            <span className="badge badge-primary">{filtered.length} Alternatif Kost</span>
          </div>

          <button className="btn btn-primary" onClick={openAdd} id="btn-add-kost" aria-label="Tambah kost baru">
            <Plus size={16} /> Tambah Kost Baru
          </button>
        </div>

        {/* Data Table */}
        <div className="table-wrapper">
          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon"><Building2 size={28} /></div>
              <div className="empty-state-title">Tidak ada data kost ditemukan</div>
              <div className="empty-state-desc">Coba sesuaikan kata kunci pencarian atau tambah data kost baru</div>
              <button className="btn btn-primary" onClick={openAdd} id="btn-add-kost-empty">
                <Plus size={15} /> Tambah Kost
              </button>
            </div>
          ) : (
            <table className="data-table" aria-label="Tabel data alternatif kost">
              <thead>
                <tr>
                  <th>Kost</th>
                  <th>Status</th>
                  <th>Harga Sewa</th>
                  <th>Jarak</th>
                  <th>Luas Kamar</th>
                  <th>Kondisi</th>
                  <th>Fasilitas</th>
                  <th>Keamanan</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((kost) => {
                  const statusMeta = STATUS_OPTIONS.find((s) => s.value === (kost.status || 'tersedia')) || STATUS_OPTIONS[0];

                  return (
                    <tr key={kost.id} id={`kost-row-${kost.id}`}>
                      {/* Kost info & Foto */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          {kost.foto ? (
                            <img
                              src={kost.foto}
                              alt={kost.name}
                              style={{ width: 42, height: 42, borderRadius: '8px', objectFit: 'cover' }}
                            />
                          ) : (
                            <div
                              style={{
                                width: 42,
                                height: 42,
                                borderRadius: '8px',
                                background: kost.imageColor || '#3B82F6',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 700,
                                fontSize: '0.85rem',
                                color: 'white',
                                flexShrink: 0,
                              }}
                              aria-hidden="true"
                            >
                              {kost.initials || kost.name.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <div style={{ fontWeight: 600, color: 'var(--text-on-dark)', fontSize: '0.925rem' }}>{kost.name}</div>
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td>
                        <span
                          className="badge"
                          style={{
                            background: statusMeta.bg,
                            color: statusMeta.color,
                            fontWeight: 600,
                          }}
                        >
                          ● {statusMeta.label}
                        </span>
                      </td>

                      {/* Harga */}
                      <td className="mono" style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
                        {sawEngine.formatRupiah(kost.harga ?? kost.price ?? 0)}
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-on-dark-muted)', display: 'block' }}>/bulan</span>
                      </td>

                      {/* Jarak */}
                      <td className="mono">
                        {(kost.jarakTujuan ?? kost.distance ?? 0)} km
                      </td>

                      {/* Luas Kamar */}
                      <td className="mono">
                        {(kost.luasKamar ?? 16)} m²
                      </td>

                      {/* Kondisi Kamar */}
                      <td>
                        <span className="badge badge--success">
                          ★ {(kost.kondisiKamar ?? 4)}/5
                        </span>
                      </td>

                      {/* Fasilitas Kamar */}
                      <td>
                        <span className="badge badge--success">
                          {(kost.fasilitasKamar ?? kost.facilities ?? 4)}/5
                        </span>
                      </td>

                      {/* Keamanan */}
                      <td>
                        <span className="badge badge--success">
                          {(kost.keamanan ?? kost.security ?? 4)}/5
                        </span>
                      </td>

                      {/* Aksi */}
                      <td>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => navigate(`/kost/${kost.id}`)}
                            title="Lihat Detail & Analisis"
                            id={`btn-view-${kost.id}`}
                          >
                            <Eye size={13} />
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => openEdit(kost)}
                            title="Edit Data Kost"
                            id={`btn-edit-${kost.id}`}
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => { setDeleteTarget(kost); setDeleteModalOpen(true); }}
                            title="Hapus Kost"
                            id={`btn-delete-${kost.id}`}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ─── MODAL ADD / EDIT KOST ────────────────────────────────────────── */}
      {modalOpen && (
        <div className="modal-backdrop">
          <div className="modal" style={{ maxWidth: 650, maxHeight: '90vh', overflowY: 'auto' }} role="dialog" aria-modal="true">
            <div className="modal-header">
              <h2 className="modal-title">
                {editTarget ? 'Edit Data Kost' : 'Tambah Alternatif Kost Baru'}
              </h2>
              <button className="modal-close-btn" onClick={() => setModalOpen(false)} aria-label="Tutup">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {/* Bagian 1: Identitas & Info Umum */}
                <h3 style={{ fontSize: '0.9rem', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
                  1. Identitas &amp; Status Kost
                </h3>

                <div className="form-group">
                  <label className="form-label" htmlFor="k-name">Nama Kost *</label>
                  <input
                    id="k-name"
                    type="text"
                    className="form-input"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Contoh: Kost Griya Melati"
                  />
                  {errors.name && <div className="form-error">{errors.name}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="k-address">Alamat Lengkap *</label>
                  <input
                    id="k-address"
                    type="text"
                    className="form-input"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder="Jl. Margonda Raya No. 12, Depok"
                  />
                  {errors.address && <div className="form-error">{errors.address}</div>}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="k-status">Status Ketersediaan</label>
                    <select
                      id="k-status"
                      className="form-input"
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value })}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="k-foto">URL Foto Kost (Opsional)</label>
                    <input
                      id="k-foto"
                      type="url"
                      className="form-input"
                      value={form.foto}
                      onChange={(e) => setForm({ ...form, foto: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                </div>

                {/* Bagian 2: Kriteria Penilaian SAW (C1 - C8) */}
                <h3 style={{ fontSize: '0.9rem', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '20px', marginBottom: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
                  2. Atribut Kriteria Penilaian SAW
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="k-harga">
                      <Banknote size={13} style={{ display: 'inline', marginRight: 4 }} />
                      Harga Sewa per Bulan (Rp) * [C1 Cost]
                    </label>
                    <input
                      id="k-harga"
                      type="number"
                      className="form-input"
                      value={form.harga}
                      onChange={(e) => setForm({ ...form, harga: e.target.value })}
                      placeholder="Contoh: 1200000"
                    />
                    {errors.harga && <div className="form-error">{errors.harga}</div>}
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="k-jarak">
                      <MapPin size={13} style={{ display: 'inline', marginRight: 4 }} />
                      Jarak ke Lokasi Acuan (km) * [C4 Cost]
                    </label>
                    <input
                      id="k-jarak"
                      type="number"
                      step="0.1"
                      className="form-input"
                      value={form.jarakTujuan}
                      onChange={(e) => setForm({ ...form, jarakTujuan: e.target.value })}
                      placeholder="Contoh: 1.5"
                    />
                    {errors.jarakTujuan && <div className="form-error">{errors.jarakTujuan}</div>}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="k-luas">
                      <Maximize2 size={13} style={{ display: 'inline', marginRight: 4 }} />
                      Luas Kamar (m²) * [C5 Benefit]
                    </label>
                    <input
                      id="k-luas"
                      type="number"
                      className="form-input"
                      value={form.luasKamar}
                      onChange={(e) => setForm({ ...form, luasKamar: e.target.value })}
                      placeholder="Contoh: 16"
                    />
                    {errors.luasKamar && <div className="form-error">{errors.luasKamar}</div>}
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="k-kondisi">
                      <Sparkles size={13} style={{ display: 'inline', marginRight: 4 }} />
                      Kondisi Kamar (1-5) [C3 Benefit]
                    </label>
                    <select
                      id="k-kondisi"
                      className="form-input"
                      value={form.kondisiKamar}
                      onChange={(e) => setForm({ ...form, kondisiKamar: e.target.value })}
                    >
                      <option value="1">1 - Sangat Buruk (lembab, berjamur)</option>
                      <option value="2">2 - Kurang Baik (pencahayaan redup)</option>
                      <option value="3">3 - Cukup Baik (standar, terawat)</option>
                      <option value="4">4 - Baik (bangunan baru, jendela segar)</option>
                      <option value="5">5 - Sangat Baik (modern, optimal)</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="k-faskamar">
                      <Star size={13} style={{ display: 'inline', marginRight: 4 }} />
                      Kelengkapan Fasilitas Kamar (1-5) [C2]
                    </label>
                    <select
                      id="k-faskamar"
                      className="form-input"
                      value={form.fasilitasKamar}
                      onChange={(e) => setForm({ ...form, fasilitasKamar: e.target.value })}
                    >
                      <option value="1">1 - Sangat Minim (kasur lantai saja)</option>
                      <option value="2">2 - Kurang Lengkap (kasur + lemari kecil)</option>
                      <option value="3">3 - Cukup Lengkap (springbed, lemari, meja)</option>
                      <option value="4">4 - Lengkap (springbed, AC, KM dalam)</option>
                      <option value="5">5 - Sangat Lengkap (AC, water heater, TV, balkon)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="k-faspendukung">
                      <Wifi size={13} style={{ display: 'inline', marginRight: 4 }} />
                      Fasilitas Pendukung (1-5) [C6]
                    </label>
                    <select
                      id="k-faspendukung"
                      className="form-input"
                      value={form.fasilitasPendukung}
                      onChange={(e) => setForm({ ...form, fasilitasPendukung: e.target.value })}
                    >
                      <option value="1">1 - Sangat Minim (tanpa WiFi &amp; dapur)</option>
                      <option value="2">2 - Kurang (hanya parkir motor)</option>
                      <option value="3">3 - Cukup (WiFi 20Mbps, dapur bersama)</option>
                      <option value="4">4 - Lengkap (WiFi 50Mbps, CCTV, parkir mobil)</option>
                      <option value="5">5 - Sangat Lengkap (WiFi 100Mbps, gym/lounge)</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="k-keamanan">
                      <Shield size={13} style={{ display: 'inline', marginRight: 4 }} />
                      Keamanan Lingkungan (1-5) [C7]
                    </label>
                    <select
                      id="k-keamanan"
                      className="form-input"
                      value={form.keamanan}
                      onChange={(e) => setForm({ ...form, keamanan: e.target.value })}
                    >
                      <option value="1">1 - Sangat Tidak Aman (tanpa pagar/satpam)</option>
                      <option value="2">2 - Kurang Aman (pagar tanpa kunci)</option>
                      <option value="3">3 - Cukup Aman (pagar terkunci)</option>
                      <option value="4">4 - Aman (satpam 24 jam, CCTV)</option>
                      <option value="5">5 - Sangat Aman (akses kartu/fingerprint &amp; security)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="k-sanitasi">
                      <Droplets size={13} style={{ display: 'inline', marginRight: 4 }} />
                      Sanitasi &amp; Air Bersih (1-5) [C8]
                    </label>
                    <select
                      id="k-sanitasi"
                      className="form-input"
                      value={form.sanitasi}
                      onChange={(e) => setForm({ ...form, sanitasi: e.target.value })}
                    >
                      <option value="1">1 - Sangat Buruk (air sering mati)</option>
                      <option value="2">2 - Kurang Baik (air kadang mati)</option>
                      <option value="3">3 - Cukup Baik (air lancar, standar)</option>
                      <option value="4">4 - Baik (air 24 jam lancar, bersih)</option>
                      <option value="5">5 - Sangat Baik (air panas/dingin &amp; sanitasi modern)</option>
                    </select>
                  </div>
                </div>

                <div className="form-group" style={{ marginTop: '12px' }}>
                  <label className="form-label" htmlFor="k-desc">Deskripsi Tambahan</label>
                  <textarea
                    id="k-desc"
                    className="form-input"
                    rows={2}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Keunggulan atau catatan khusus kost..."
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary" id="btn-save-kost">
                  {editTarget ? 'Simpan Perubahan' : 'Tambah Kost'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL DELETE CONFIRM ─────────────────────────────────────────── */}
      {deleteModalOpen && deleteTarget && (
        <div className="modal-backdrop">
          <div className="modal" style={{ maxWidth: 420 }} role="dialog" aria-modal="true">
            <div className="modal-header">
              <h2 className="modal-title">Konfirmasi Hapus Kost</h2>
              <button className="modal-close-btn" onClick={() => setDeleteModalOpen(false)} aria-label="Tutup">
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <p>Apakah Anda yakin ingin menghapus data <strong>{deleteTarget.name}</strong>?</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-danger)', marginTop: '8px' }}>
                Tindakan ini akan mempengaruhi matriks keputusan dan perhitungan SAW saat ini.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setDeleteModalOpen(false)}>
                Batal
              </button>
              <button className="btn btn-danger" onClick={confirmDelete} id="btn-confirm-delete-kost">
                Hapus Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
