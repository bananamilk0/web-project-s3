/**
 * src/components/kost/DataKostView.jsx
 * Manajemen Data Kost: Tampilan Grid & Tabel, Filter, Pencarian, & Form CRUD Terstruktur
 */

import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  Plus,
  LayoutGrid,
  List,
  Search,
  Filter,
  MapPin,
  Maximize2,
  Trash2,
  Edit3,
  Eye,
  CheckCircle2,
  X,
  AlertTriangle,
  Phone,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Camera,
  Upload,
  Image as ImageIcon
} from 'lucide-react';

const PRESET_PHOTOS = [
  { label: 'Kamar Minimalis Kayu', url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80' },
  { label: 'Kamar Asri Tropis', url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80' },
  { label: 'Studio Modern Cerah', url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80' },
  { label: 'Kamar Scandinavian', url: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80' },
  { label: 'Kamar Luas Balkon', url: 'https://images.unsplash.com/photo-1540518614846-7ede433c4ef0?auto=format&fit=crop&w=800&q=80' },
  { label: 'Kamar Elegan Hijau', url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80' }
];

export default function DataKostView() {
  const { kostList, addKost, updateKost, deleteKost, addToast } = useApp();

  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all' | 'Putra' | 'Putri' | 'Campur'
  const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'Tersedia' | 'Penuh'
  const [sortBy, setSortBy] = useState('nama_asc');

  // Pagination for table mode
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingKost, setEditingKost] = useState(null);
  const [detailKost, setDetailKost] = useState(null);
  const [deleteConfirmKost, setDeleteConfirmKost] = useState(null);
  const [photoModalKost, setPhotoModalKost] = useState(null);
  const [tempPhotoUrl, setTempPhotoUrl] = useState('');

  const openPhotoModal = (kost) => {
    setPhotoModalKost(kost);
    setTempPhotoUrl(kost.foto || '');
  };

  const handleFileUpload = (e, callback) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        addToast('Ukuran file foto maksimal 5MB!', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        callback(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePhotoModal = () => {
    if (!photoModalKost || !tempPhotoUrl) return;
    updateKost(photoModalKost.id, { foto: tempPhotoUrl });
    if (detailKost && detailKost.id === photoModalKost.id) {
      setDetailKost(prev => ({ ...prev, foto: tempPhotoUrl }));
    }
    addToast(`Foto profil "${photoModalKost.nama}" berhasil diperbarui!`, 'success');
    setPhotoModalKost(null);
  };

  // Form Fields State
  const initialFormData = {
    nama: '',
    tipeKamar: 'Campur',
    alamat: '',
    deskripsi: '',
    harga: 1200000,
    luasKamar: 15,
    fasilitasKamar: 4,
    kondisiKamar: 4,
    jarakTujuan: 0.8,
    fasilitasPendukung: 4,
    status: 'Tersedia',
    aktif: true,
    foto: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
    kontak: '0812-3456-7890',
    fasilitasTags: 'AC, KM Dalam, WiFi Cepat, Parkir Motor'
  };

  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});

  // Filtered & Sorted Kost Data
  const filteredData = useMemo(() => {
    return kostList.filter(item => {
      const matchSearch =
        item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.alamat.toLowerCase().includes(searchQuery.toLowerCase());
      const matchType = filterType === 'all' || item.tipeKamar === filterType;
      const matchStatus = filterStatus === 'all' || item.status === filterStatus;
      return matchSearch && matchType && matchStatus;
    }).sort((a, b) => {
      if (sortBy === 'nama_asc') return a.nama.localeCompare(b.nama);
      if (sortBy === 'nama_desc') return b.nama.localeCompare(a.nama);
      if (sortBy === 'harga_asc') return a.harga - b.harga;
      if (sortBy === 'harga_desc') return b.harga - a.harga;
      if (sortBy === 'luas_desc') return b.luasKamar - a.luasKamar;
      return 0;
    });
  }, [kostList, searchQuery, filterType, filterStatus, sortBy]);

  // Paginated Data
  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const openAddForm = () => {
    setEditingKost(null);
    setFormData(initialFormData);
    setFormErrors({});
    setIsFormOpen(true);
  };

  const openEditForm = (kost) => {
    setEditingKost(kost);
    setFormData({
      ...kost,
      fasilitasTags: Array.isArray(kost.fasilitasTags) ? kost.fasilitasTags.join(', ') : kost.fasilitasTags
    });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.nama.trim()) errors.nama = 'Nama kost wajib diisi';
    if (!formData.alamat.trim()) errors.alamat = 'Alamat lengkap wajib diisi';
    if (formData.harga <= 0) errors.harga = 'Harga sewa harus lebih dari 0';
    if (formData.luasKamar <= 0) errors.luasKamar = 'Luas kamar harus valid';
    if (formData.jarakTujuan <= 0) errors.jarakTujuan = 'Jarak ke tujuan harus valid';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      ...formData,
      harga: Number(formData.harga),
      luasKamar: Number(formData.luasKamar),
      fasilitasKamar: Number(formData.fasilitasKamar),
      kondisiKamar: Number(formData.kondisiKamar),
      jarakTujuan: Number(formData.jarakTujuan),
      fasilitasPendukung: Number(formData.fasilitasPendukung),
      fasilitasTags: typeof formData.fasilitasTags === 'string'
        ? formData.fasilitasTags.split(',').map(t => t.trim()).filter(Boolean)
        : formData.fasilitasTags
    };

    if (editingKost) {
      updateKost(editingKost.id, payload);
    } else {
      addKost(payload);
    }
    setIsFormOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. Header Page Title & Actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--forest-green)', letterSpacing: '-0.02em' }}>
            Data Alternatif Kost
          </h1>
          <p style={{ fontSize: '0.86rem', color: 'var(--muted-green)' }}>
            Kelola master data hunian kost, ketersediaan kamar, dan atribut kriteria SPK.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Mode Switcher: Grid vs Table */}
          <div
            style={{
              display: 'flex',
              backgroundColor: 'var(--pale-green)',
              padding: '4px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-light)'
            }}
          >
            <button
              onClick={() => setViewMode('grid')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                background: viewMode === 'grid' ? '#FFFFFF' : 'transparent',
                color: viewMode === 'grid' ? 'var(--forest-green)' : 'var(--muted-green)',
                fontWeight: 600,
                fontSize: '0.8rem',
                cursor: 'pointer',
                boxShadow: viewMode === 'grid' ? 'var(--shadow-sm)' : 'none'
              }}
            >
              <LayoutGrid size={15} />
              <span>Grid</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                background: viewMode === 'table' ? '#FFFFFF' : 'transparent',
                color: viewMode === 'table' ? 'var(--forest-green)' : 'var(--muted-green)',
                fontWeight: 600,
                fontSize: '0.8rem',
                cursor: 'pointer',
                boxShadow: viewMode === 'table' ? 'var(--shadow-sm)' : 'none'
              }}
            >
              <List size={15} />
              <span>Tabel</span>
            </button>
          </div>

          {/* Tombol Tambah Kost */}
          <button className="btn btn-primary" onClick={openAddForm}>
            <Plus size={16} />
            <span>Tambah Data Kost</span>
          </button>
        </div>
      </div>

      {/* 2. Search & Filter Bar */}
      <div
        className="panel"
        style={{
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          flexWrap: 'wrap'
        }}
      >
        {/* Search Input */}
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search
            size={17}
            color="var(--muted-green)"
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            placeholder="Cari berdasarkan nama atau alamat kost..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="form-control"
            style={{ paddingLeft: '38px', backgroundColor: 'var(--ivory-white)' }}
          />
        </div>

        {/* Filter Tipe */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--dark-green)' }}>Tipe:</span>
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="form-control form-select"
            style={{ width: '130px', padding: '7px 28px 7px 10px', fontSize: '0.82rem' }}
          >
            <option value="all">Semua Tipe</option>
            <option value="Putra">Putra</option>
            <option value="Putri">Putri</option>
            <option value="Campur">Campur</option>
          </select>
        </div>

        {/* Filter Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--dark-green)' }}>Status:</span>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="form-control form-select"
            style={{ width: '130px', padding: '7px 28px 7px 10px', fontSize: '0.82rem' }}
          >
            <option value="all">Semua Status</option>
            <option value="Tersedia">Tersedia</option>
            <option value="Penuh">Penuh</option>
          </select>
        </div>

        {/* Urutan */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--dark-green)' }}>Urutan:</span>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="form-control form-select"
            style={{ width: '150px', padding: '7px 28px 7px 10px', fontSize: '0.82rem' }}
          >
            <option value="nama_asc">Nama (A - Z)</option>
            <option value="nama_desc">Nama (Z - A)</option>
            <option value="harga_asc">Harga Terendah</option>
            <option value="harga_desc">Harga Tertinggi</option>
            <option value="luas_desc">Luas Terbesar</option>
          </select>
        </div>
      </div>

      {/* 3. Tampilan Data: GRID MODE */}
      {viewMode === 'grid' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '22px' }}>
          {filteredData.map(kost => (
            <div
              key={kost.id}
              className="panel"
              style={{
                padding: 0,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform var(--transition-fast), box-shadow var(--transition-fast)'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              }}
            >
              {/* Foto Cover dengan Badge Status & Tombol Ganti Foto */}
              <div style={{ position: 'relative', height: '180px', width: '100%', overflow: 'hidden' }}>
                <img
                  src={kost.foto}
                  alt={kost.nama}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                  <span className={`badge ${kost.status === 'Tersedia' ? 'badge-available' : 'badge-full'}`}>
                    {kost.status}
                  </span>
                </div>
                <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
                  <span
                    style={{
                      backgroundColor: 'rgba(23, 60, 50, 0.85)',
                      backdropFilter: 'blur(4px)',
                      color: '#FFFDF5',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-pill)',
                      fontSize: '0.72rem',
                      fontWeight: 600
                    }}
                  >
                    {kost.tipeKamar}
                  </span>
                </div>

                {/* Tombol Ganti Foto Cepat */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    openPhotoModal(kost);
                  }}
                  title="Ganti Foto Profil Kost"
                  style={{
                    position: 'absolute',
                    bottom: '10px',
                    right: '10px',
                    backgroundColor: 'rgba(23, 77, 59, 0.88)',
                    backdropFilter: 'blur(4px)',
                    color: '#FFFDF5',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    padding: '5px 12px',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'all var(--transition-fast)'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = 'var(--emerald-green)';
                    e.currentTarget.style.transform = 'scale(1.04)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = 'rgba(23, 77, 59, 0.88)';
                    e.currentTarget.style.transform = 'none';
                  }}
                >
                  <Camera size={13} />
                  <span>Ganti Foto</span>
                </button>
              </div>

              {/* Konten Kartu */}
              <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--forest-green)', marginBottom: '4px' }}>
                  {kost.nama}
                </h3>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--muted-green)', marginBottom: '12px' }}>
                  <MapPin size={13} style={{ flexShrink: 0 }} />
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {kost.alamat}
                  </span>
                </div>

                {/* Harga & Luas */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    backgroundColor: 'var(--pale-green)',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '14px'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--muted-green)', fontWeight: 600 }}>HARGA SEWA</div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--forest-green)', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'baseline', gap: '3px' }}>
                      <span>Rp {kost.harga.toLocaleString('id-ID')}</span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted-green)', whiteSpace: 'nowrap' }}>/bln</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--muted-green)', fontWeight: 600 }}>LUAS KAMAR</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--dark-green)' }}>
                      {kost.luasKamar} m²
                    </div>
                  </div>
                </div>

                {/* Metrik Kriteria Ringkas */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', fontSize: '0.74rem', marginBottom: '14px' }}>
                  <div style={{ backgroundColor: 'var(--warm-ivory)', padding: '6px', borderRadius: '6px', textAlign: 'center' }}>
                    <div style={{ color: 'var(--muted-green)' }}>Fasilitas</div>
                    <div style={{ fontWeight: 700, color: 'var(--forest-green)' }}>{kost.fasilitasKamar}/5</div>
                  </div>
                  <div style={{ backgroundColor: 'var(--warm-ivory)', padding: '6px', borderRadius: '6px', textAlign: 'center' }}>
                    <div style={{ color: 'var(--muted-green)' }}>Kondisi</div>
                    <div style={{ fontWeight: 700, color: 'var(--forest-green)' }}>{kost.kondisiKamar}/5</div>
                  </div>
                  <div style={{ backgroundColor: 'var(--warm-ivory)', padding: '6px', borderRadius: '6px', textAlign: 'center' }}>
                    <div style={{ color: 'var(--muted-green)' }}>Jarak</div>
                    <div style={{ fontWeight: 700, color: 'var(--forest-green)' }}>{kost.jarakTujuan} km</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '10px', borderTop: '1px solid var(--border-light)' }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setDetailKost(kost)}
                    style={{ flex: 1 }}
                  >
                    <Eye size={14} />
                    <span>Detail</span>
                  </button>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => openEditForm(kost)}
                    title="Edit Kost"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => setDeleteConfirmKost(kost)}
                    title="Hapus Kost"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. Tampilan Data: TABLE MODE */}
      {viewMode === 'table' && (
        <div className="panel" style={{ padding: '0', overflow: 'hidden' }}>
          <div className="table-container">
            <table className="verdant-table">
              <thead>
                <tr>
                  <th style={{ width: '50px' }}>No</th>
                  <th>Foto & Nama Kost</th>
                  <th>Tipe</th>
                  <th>Alamat</th>
                  <th className="text-right">Harga / Bln</th>
                  <th className="text-center">Luas</th>
                  <th className="text-center">Jarak</th>
                  <th className="text-center">Status</th>
                  <th className="text-center" style={{ width: '130px' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((kost, idx) => (
                  <tr key={kost.id}>
                    <td style={{ fontWeight: 600, color: 'var(--muted-green)', paddingLeft: '16px' }}>
                      {(currentPage - 1) * itemsPerPage + idx + 1}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                          style={{ position: 'relative', width: '44px', height: '44px', cursor: 'pointer', flexShrink: 0 }}
                          onClick={() => openPhotoModal(kost)}
                          title="Klik untuk ganti foto"
                        >
                          <img
                            src={kost.foto}
                            alt={kost.nama}
                            style={{ width: '44px', height: '44px', borderRadius: '8px', objectFit: 'cover' }}
                          />
                          <div
                            style={{
                              position: 'absolute',
                              inset: 0,
                              backgroundColor: 'rgba(23, 77, 59, 0.5)',
                              borderRadius: '8px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              opacity: 0,
                              transition: 'opacity 0.2s'
                            }}
                            onMouseEnter={e => e.currentTarget.style.opacity = 1}
                            onMouseLeave={e => e.currentTarget.style.opacity = 0}
                          >
                            <Camera size={16} color="#FFFDF5" />
                          </div>
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--dark-green)' }}>{kost.nama}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--muted-green)' }}>
                            Fasilitas: {kost.fasilitasKamar}/5 • Kondisi: {kost.kondisiKamar}/5
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-cost" style={{ fontSize: '0.72rem' }}>
                        {kost.tipeKamar}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--muted-green)', maxWidth: '200px' }}>
                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>
                        {kost.alamat}
                      </span>
                    </td>
                    <td className="text-right" style={{ fontWeight: 700, color: 'var(--forest-green)', whiteSpace: 'nowrap' }}>
                      Rp {kost.harga.toLocaleString('id-ID')}/bln
                    </td>
                    <td className="text-center">{kost.luasKamar} m²</td>
                    <td className="text-center">{kost.jarakTujuan} km</td>
                    <td className="text-center">
                      <span className={`badge ${kost.status === 'Tersedia' ? 'badge-available' : 'badge-full'}`}>
                        {kost.status}
                      </span>
                    </td>
                    <td className="text-center">
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => openPhotoModal(kost)}
                          title="Ganti Foto"
                        >
                          <Camera size={15} color="var(--forest-green)" />
                        </button>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => setDetailKost(kost)}
                          title="Lihat Detail"
                        >
                          <Eye size={15} color="var(--forest-green)" />
                        </button>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => openEditForm(kost)}
                          title="Edit"
                        >
                          <Edit3 size={15} color="var(--emerald-green)" />
                        </button>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => setDeleteConfirmKost(kost)}
                          title="Hapus"
                        >
                          <Trash2 size={15} color="var(--soft-coral)" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Pagination */}
          <div
            style={{
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid var(--border-light)',
              backgroundColor: '#FAFDF9'
            }}
          >
            <div style={{ fontSize: '0.82rem', color: 'var(--muted-green)' }}>
              Menampilkan {Math.min(filteredData.length, (currentPage - 1) * itemsPerPage + 1)} - {Math.min(filteredData.length, currentPage * itemsPerPage)} dari {filteredData.length} data kost
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                className="btn btn-secondary btn-sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              >
                <ChevronLeft size={14} />
                <span>Sebelumnya</span>
              </button>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--forest-green)', padding: '0 8px' }}>
                {currentPage} / {totalPages}
              </span>
              <button
                className="btn btn-secondary btn-sm"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              >
                <span>Selanjutnya</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          5. MODAL FORM: TAMBAH / EDIT DATA KOST
          ======================================================== */}
      {isFormOpen && (
        <div className="modal-overlay" onClick={() => setIsFormOpen(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '720px' }}>
            <div className="modal-header">
              <div className="modal-title">
                {editingKost ? 'Edit Data Kost' : 'Tambah Alternatif Kost Baru'}
              </div>
              <button onClick={() => setIsFormOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} color="var(--muted-green)" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Bagian 1: Informasi Umum */}
                <div>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--forest-green)', fontWeight: 700, marginBottom: '10px' }}>
                    1. Informasi Umum
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '14px' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Nama Kost *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.nama}
                        onChange={e => setFormData({ ...formData, nama: e.target.value })}
                        placeholder="Contoh: Kost Hijau Lestari"
                      />
                      {formErrors.nama && <div className="form-error">{formErrors.nama}</div>}
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Tipe Kamar</label>
                      <select
                        className="form-control form-select"
                        value={formData.tipeKamar}
                        onChange={e => setFormData({ ...formData, tipeKamar: e.target.value })}
                      >
                        <option value="Putra">Putra</option>
                        <option value="Putri">Putri</option>
                        <option value="Campur">Campur</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group" style={{ marginTop: '12px' }}>
                    <label className="form-label">Alamat Lengkap *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.alamat}
                      onChange={e => setFormData({ ...formData, alamat: e.target.value })}
                      placeholder="Jalan, nomor, kelurahan, kecamatan..."
                    />
                    {formErrors.alamat && <div className="form-error">{formErrors.alamat}</div>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Nomor Kontak / WhatsApp</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.kontak}
                      onChange={e => setFormData({ ...formData, kontak: e.target.value })}
                      placeholder="0812-xxxx-xxxx"
                    />
                  </div>
                </div>

                {/* Bagian 2: 6 Kriteria SAW */}
                <div>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--forest-green)', fontWeight: 700, marginBottom: '10px' }}>
                    2. Nilai Kriteria SAW
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
                    {/* C1: Harga */}
                    <div className="form-group">
                      <label className="form-label">C1: Harga Sewa (Rp/bln) [Cost] *</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.harga}
                        onChange={e => setFormData({ ...formData, harga: e.target.value })}
                      />
                      {formErrors.harga && <div className="form-error">{formErrors.harga}</div>}
                    </div>

                    {/* C4: Luas Kamar */}
                    <div className="form-group">
                      <label className="form-label">C4: Luas Kamar (m²) [Benefit] *</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.luasKamar}
                        onChange={e => setFormData({ ...formData, luasKamar: e.target.value })}
                      />
                      {formErrors.luasKamar && <div className="form-error">{formErrors.luasKamar}</div>}
                    </div>

                    {/* C5: Jarak Tujuan */}
                    <div className="form-group">
                      <label className="form-label">C5: Jarak ke Kampus (km) [Cost] *</label>
                      <input
                        type="number"
                        step="0.1"
                        className="form-control"
                        value={formData.jarakTujuan}
                        onChange={e => setFormData({ ...formData, jarakTujuan: e.target.value })}
                      />
                      {formErrors.jarakTujuan && <div className="form-error">{formErrors.jarakTujuan}</div>}
                    </div>

                    {/* C2: Fasilitas Kamar */}
                    <div className="form-group">
                      <label className="form-label">C2: Fasilitas Kamar (Skala 1-5)</label>
                      <select
                        className="form-control form-select"
                        value={formData.fasilitasKamar}
                        onChange={e => setFormData({ ...formData, fasilitasKamar: Number(e.target.value) })}
                      >
                        <option value={1}>1 - Sangat Minim (Kasur saja)</option>
                        <option value={2}>2 - Kurang Lengkap (Kasur + Lemari kecil)</option>
                        <option value={3}>3 - Cukup Lengkap (Springbed, Lemari, Meja)</option>
                        <option value={4}>4 - Lengkap (AC, Springbed, Meja, KM Dalam)</option>
                        <option value={5}>5 - Sangat Lengkap (AC, TV, Water Heater, Balkon)</option>
                      </select>
                    </div>

                    {/* C3: Kondisi Kamar */}
                    <div className="form-group">
                      <label className="form-label">C3: Kondisi Kamar (Skala 1-5)</label>
                      <select
                        className="form-control form-select"
                        value={formData.kondisiKamar}
                        onChange={e => setFormData({ ...formData, kondisiKamar: Number(e.target.value) })}
                      >
                        <option value={1}>1 - Sangat Buruk (Lembab, minim ventilasi)</option>
                        <option value={2}>2 - Kurang Baik (Sirkulasi sempit, pengap)</option>
                        <option value={3}>3 - Cukup Baik (Bersih, terawat standar)</option>
                        <option value={4}>4 - Baik (Bangunan baru, ventilasi segar)</option>
                        <option value={5}>5 - Sangat Baik (Estetik modern, sirkulasi silang)</option>
                      </select>
                    </div>

                    {/* C6: Fasilitas Pendukung */}
                    <div className="form-group">
                      <label className="form-label">C6: Fasilitas Pendukung (Skala 1-5)</label>
                      <select
                        className="form-control form-select"
                        value={formData.fasilitasPendukung}
                        onChange={e => setFormData({ ...formData, fasilitasPendukung: Number(e.target.value) })}
                      >
                        <option value={1}>1 - Sangat Minim (Tanpa WiFi, parkir sempit)</option>
                        <option value={2}>2 - Kurang Lengkap (Parkir motor, tanpa WiFi)</option>
                        <option value={3}>3 - Cukup Lengkap (WiFi 20Mbps, dapur bersama)</option>
                        <option value={4}>4 - Lengkap (WiFi 50Mbps, parkir mobil/motor, CCTV)</option>
                        <option value={5}>5 - Sangat Lengkap (WiFi FO 100Mbps, 24h security, lounge)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Bagian 3: Fasilitas Tambahan & Foto */}
                <div>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--forest-green)', fontWeight: 700, marginBottom: '10px' }}>
                    3. Fasilitas & Visual
                  </h4>
                  <div className="form-group">
                    <label className="form-label">Daftar Tag Fasilitas (Pisahkan dengan koma)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.fasilitasTags}
                      onChange={e => setFormData({ ...formData, fasilitasTags: e.target.value })}
                      placeholder="AC, KM Dalam, WiFi Cepat, Parkir Mobil, Water Heater..."
                    />
                  </div>

                  {/* Visual Foto Cover */}
                  <div className="form-group">
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span>Foto Profil / Cover Kost</span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--muted-green)' }}>Unggah file atau pilih preset</span>
                    </label>

                    {/* Preview Thumbnail */}
                    <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '10px' }}>
                      <div
                        style={{
                          width: '100px',
                          height: '70px',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          border: '2px solid var(--border-light)',
                          flexShrink: 0,
                          backgroundColor: 'var(--pale-green)'
                        }}
                      >
                        <img
                          src={formData.foto || 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80'}
                          alt="Preview Kost"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label
                          className="btn btn-secondary btn-sm"
                          style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}
                        >
                          <Upload size={14} />
                          <span>Pilih File dari Komputer</span>
                          <input
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={e => handleFileUpload(e, (dataUrl) => setFormData(prev => ({ ...prev, foto: dataUrl })))}
                          />
                        </label>
                        <div style={{ fontSize: '0.72rem', color: 'var(--muted-green)' }}>
                          Format didukung: JPG, PNG, WebP (Maks. 5MB)
                        </div>
                      </div>
                    </div>

                    <input
                      type="text"
                      className="form-control"
                      placeholder="Atau tempel URL gambar web di sini..."
                      value={formData.foto}
                      onChange={e => setFormData({ ...formData, foto: e.target.value })}
                      style={{ marginBottom: '10px' }}
                    />

                    {/* Pilihan Cepat Preset Gambar */}
                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--dark-green)', fontWeight: 600, marginBottom: '6px' }}>
                        Preset Rekomendasi Foto Kamar:
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '6px' }}>
                        {PRESET_PHOTOS.map((p, idx) => (
                          <div
                            key={idx}
                            onClick={() => setFormData(prev => ({ ...prev, foto: p.url }))}
                            title={p.label}
                            style={{
                              cursor: 'pointer',
                              borderRadius: '6px',
                              overflow: 'hidden',
                              border: formData.foto === p.url ? '2px solid var(--emerald-green)' : '1px solid var(--border-light)',
                              height: '42px'
                            }}
                          >
                            <img src={p.url} alt={p.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div className="form-group">
                      <label className="form-label">Status Ketersediaan</label>
                      <select
                        className="form-control form-select"
                        value={formData.status}
                        onChange={e => setFormData({ ...formData, status: e.target.value })}
                      >
                        <option value="Tersedia">Tersedia</option>
                        <option value="Penuh">Penuh</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Status Dalam Evaluasi SPK</label>
                      <select
                        className="form-control form-select"
                        value={formData.aktif ? 'true' : 'false'}
                        onChange={e => setFormData({ ...formData, aktif: e.target.value === 'true' })}
                      >
                        <option value="true">Aktif (Dihitung dalam SAW)</option>
                        <option value="false">Nonaktif (Diabaikan)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsFormOpen(false)}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingKost ? 'Simpan Perubahan' : 'Tambah Alternatif'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          6. MODAL DETAIL KOST
          ======================================================== */}
      {detailKost && (
        <div className="modal-overlay" onClick={() => setDetailKost(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '640px' }}>
            <div style={{ position: 'relative', height: '220px', width: '100%' }}>
              <img
                src={detailKost.foto}
                alt={detailKost.nama}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <button
                type="button"
                onClick={() => openPhotoModal(detailKost)}
                title="Ganti Foto Kost"
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  right: '12px',
                  backgroundColor: 'rgba(23, 77, 59, 0.9)',
                  backdropFilter: 'blur(4px)',
                  color: '#FFFDF5',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <Camera size={14} />
                <span>Ganti Foto Kost</span>
              </button>
              <button
                onClick={() => setDetailKost(null)}
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: 'rgba(255, 255, 255, 0.85)',
                  border: 'none',
                  borderRadius: '50%',
                  padding: '6px',
                  cursor: 'pointer'
                }}
              >
                <X size={18} color="var(--dark-green)" />
              </button>
            </div>

            <div className="modal-body">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span className={`badge ${detailKost.status === 'Tersedia' ? 'badge-available' : 'badge-full'}`}>
                  {detailKost.status}
                </span>
                <span className="badge badge-cost">{detailKost.tipeKamar}</span>
              </div>

              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--forest-green)', marginBottom: '4px' }}>
                {detailKost.nama}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--muted-green)', marginBottom: '14px' }}>
                {detailKost.alamat}
              </p>

              <p style={{ fontSize: '0.88rem', color: 'var(--dark-green)', lineHeight: 1.6, marginBottom: '20px' }}>
                {detailKost.deskripsi || 'Kost hunian nyaman yang terpelihara dengan baik, ramah lingkungan, serta mendukung aktivitas belajar dan istirahat.'}
              </p>

              {/* Rincian 6 Kriteria SAW */}
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--forest-green)', marginBottom: '10px' }}>
                Atribut Kriteria SAW
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '20px' }}>
                <div style={{ padding: '10px 12px', backgroundColor: 'var(--pale-green)', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--muted-green)' }}>C1 - Harga Sewa</div>
                  <div style={{ fontWeight: 800, color: 'var(--forest-green)', whiteSpace: 'nowrap' }}>Rp {detailKost.harga.toLocaleString('id-ID')}/bln</div>
                </div>
                <div style={{ padding: '10px 12px', backgroundColor: 'var(--pale-green)', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--muted-green)' }}>C4 - Luas Kamar</div>
                  <div style={{ fontWeight: 800, color: 'var(--forest-green)' }}>{detailKost.luasKamar} m²</div>
                </div>
                <div style={{ padding: '10px 12px', backgroundColor: 'var(--pale-green)', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--muted-green)' }}>C5 - Jarak Tujuan</div>
                  <div style={{ fontWeight: 800, color: 'var(--forest-green)' }}>{detailKost.jarakTujuan} km</div>
                </div>
                <div style={{ padding: '10px 12px', backgroundColor: 'var(--pale-green)', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--muted-green)' }}>C2 - Fasilitas Kamar</div>
                  <div style={{ fontWeight: 800, color: 'var(--forest-green)' }}>Skala {detailKost.fasilitasKamar} / 5</div>
                </div>
                <div style={{ padding: '10px 12px', backgroundColor: 'var(--pale-green)', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--muted-green)' }}>C3 - Kondisi Kamar</div>
                  <div style={{ fontWeight: 800, color: 'var(--forest-green)' }}>Skala {detailKost.kondisiKamar} / 5</div>
                </div>
                <div style={{ padding: '10px 12px', backgroundColor: 'var(--pale-green)', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--muted-green)' }}>C6 - Fasilitas Pendukung</div>
                  <div style={{ fontWeight: 800, color: 'var(--forest-green)' }}>Skala {detailKost.fasilitasPendukung} / 5</div>
                </div>
              </div>

              {/* Tags */}
              {detailKost.fasilitasTags && (
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--forest-green)', marginBottom: '8px' }}>
                    Fasilitas Tersedia
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {(Array.isArray(detailKost.fasilitasTags) ? detailKost.fasilitasTags : detailKost.fasilitasTags.split(',')).map((tag, i) => (
                      <span key={i} className="badge badge-cost" style={{ fontSize: '0.75rem' }}>
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setDetailKost(null)}>
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          7. MODAL KONFIRMASI HAPUS
          ======================================================== */}
      {deleteConfirmKost && (
        <div className="modal-overlay" onClick={() => setDeleteConfirmKost(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '440px' }}>
            <div className="modal-body" style={{ textAlign: 'center', padding: '32px 24px' }}>
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--soft-coral-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px'
                }}
              >
                <AlertTriangle size={28} color="var(--soft-coral-dark)" />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--forest-green)', marginBottom: '8px' }}>
                Hapus Data Kost?
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--muted-green)', lineHeight: 1.5, marginBottom: '24px' }}>
                Apakah Anda yakin ingin menghapus data <strong>{deleteConfirmKost.nama}</strong>? Data yang dihapus tidak dapat dipulihkan dan akan mempengaruhi kalkulasi SAW berikutnya.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                <button className="btn btn-secondary" onClick={() => setDeleteConfirmKost(null)}>
                  Batal
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    deleteKost(deleteConfirmKost.id);
                    setDeleteConfirmKost(null);
                  }}
                >
                  Ya, Hapus Kost
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          8. MODAL GANTI FOTO PROFIL KOST
          ======================================================== */}
      {photoModalKost && (
        <div className="modal-overlay" onClick={() => setPhotoModalKost(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '560px' }}>
            <div className="modal-header">
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--forest-green)' }}>
                  Ganti Foto Profil Kost
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--muted-green)' }}>
                  Pembaruan foto untuk: <strong>{photoModalKost.nama}</strong>
                </p>
              </div>
              <button
                onClick={() => setPhotoModalKost(null)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} color="var(--dark-green)" />
              </button>
            </div>

            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Preview Foto Terpilih */}
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--forest-green)', marginBottom: '8px' }}>
                  Pratinjau Foto
                </div>
                <div
                  style={{
                    position: 'relative',
                    height: '200px',
                    width: '100%',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    border: '2px solid var(--border-light)',
                    backgroundColor: 'var(--pale-green)'
                  }}
                >
                  <img
                    src={tempPhotoUrl || photoModalKost.foto}
                    alt={photoModalKost.nama}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '8px',
                      left: '8px',
                      backgroundColor: 'rgba(23, 60, 50, 0.85)',
                      color: '#FFFDF5',
                      padding: '3px 10px',
                      borderRadius: 'var(--radius-pill)',
                      fontSize: '0.72rem',
                      fontWeight: 600
                    }}
                  >
                    Foto Aktif
                  </div>
                </div>
              </div>

              {/* Opsi 1: Upload dari File Komputer */}
              <div style={{ padding: '14px', backgroundColor: 'var(--pale-green)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Upload size={16} color="var(--emerald-green)" />
                  <span style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--forest-green)' }}>
                    Unggah File Foto dari Komputer
                  </span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--dark-green)', marginBottom: '10px' }}>
                  Pilih file gambar (JPG, PNG, WebP) dari perangkat Anda (Maks. 5MB).
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => handleFileUpload(e, (dataUrl) => setTempPhotoUrl(dataUrl))}
                  style={{ fontSize: '0.82rem' }}
                />
              </div>

              {/* Opsi 2: Input URL Gambar Langsung */}
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ImageIcon size={14} color="var(--emerald-green)" />
                  <span>Atau Masukkan URL Gambar Web</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={tempPhotoUrl}
                  onChange={e => setTempPhotoUrl(e.target.value)}
                />
              </div>

              {/* Opsi 3: Pilihan Preset Estetik */}
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--forest-green)', marginBottom: '8px' }}>
                  Pilihan Rekomendasi Foto Hunian Asri
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {PRESET_PHOTOS.map((preset, pIdx) => (
                    <div
                      key={pIdx}
                      onClick={() => setTempPhotoUrl(preset.url)}
                      style={{
                        cursor: 'pointer',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        border: tempPhotoUrl === preset.url ? '2.5px solid var(--emerald-green)' : '1px solid var(--border-light)',
                        boxShadow: tempPhotoUrl === preset.url ? '0 0 0 2px var(--mint-green)' : 'none',
                        transition: 'all 0.2s'
                      }}
                    >
                      <img
                        src={preset.url}
                        alt={preset.label}
                        style={{ width: '100%', height: '65px', objectFit: 'cover', display: 'block' }}
                      />
                      <div style={{ padding: '4px', fontSize: '0.68rem', textAlign: 'center', backgroundColor: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {preset.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setPhotoModalKost(null)}>
                Batal
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSavePhotoModal}
                disabled={!tempPhotoUrl}
              >
                <Save size={15} />
                <span>Simpan Foto Baru</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
