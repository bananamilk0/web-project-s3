// src/pages/ManageLokasi.jsx
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  MapPin, Users, Plus, Edit2, Trash2, Star, Building,
  Briefcase, ShoppingBag, HeartPulse, X, Check,
  Navigation, ShieldCheck, Key,
  Mail, Search, CheckCircle2,
} from 'lucide-react';

const TIPE_OPTIONS = [
  { value: 'kampus',        label: 'Kampus / Perguruan Tinggi',        icon: Building,     color: '#3B82F6' },
  { value: 'mall',          label: 'Pusat Perbelanjaan (Mall)',         icon: ShoppingBag,  color: '#EC4899' },
  { value: 'fasilitas_umum',label: 'Fasilitas Umum / Transportasi / RS',icon: HeartPulse,  color: '#10B981' },
  { value: 'tempat_kerja',  label: 'Perkantoran / Tempat Kerja',       icon: Briefcase,    color: '#F59E0B' },
  { value: 'lainnya',       label: 'Lokasi Lainnya',                   icon: MapPin,       color: '#8B5CF6' },
];

const emptyLokasiForm = {
  nama: '', tipe: 'kampus', alamat: '',
  jarakRataRata: '1.0 - 2.5 km', deskripsi: '',
};

const emptyUserForm = {
  nama: '', username: '', password: '', email: '',
  role: 'Staf Penilai SPK', status: 'Aktif',
};

const ROLES = ['Super Admin', 'Staf Penilai SPK', 'Operator Data Kost', 'Administrator'];

/** ManageLokasi — Modul 8: Manajemen Pengguna dan Lokasi Sekitar */
export default function ManageLokasi() {
  const {
    lokasi, addLokasi, updateLokasi, deleteLokasi, setDefaultLokasi,
    users = [], addUser, updateUser, deleteUser, auth,
  } = useApp();

  const [activeTab, setActiveTab]           = useState('lokasi');
  const [searchLokasi, setSearchLokasi]     = useState('');
  const [filterTipe, setFilterTipe]         = useState('all');
  const [searchUser, setSearchUser]         = useState('');

  const [showLokasiForm, setShowLokasiForm] = useState(false);
  const [editLokasiId, setEditLokasiId]     = useState(null);
  const [lokasiForm, setLokasiForm]         = useState(emptyLokasiForm);
  const [lokasiErrors, setLokasiErrors]     = useState({});
  const [deleteLokasiConfirm, setDeleteLokasiConfirm] = useState(null);

  const [showUserForm, setShowUserForm]     = useState(false);
  const [editUserId, setEditUserId]         = useState(null);
  const [userForm, setUserForm]             = useState(emptyUserForm);
  const [userErrors, setUserErrors]         = useState({});
  const [deleteUserConfirm, setDeleteUserConfirm] = useState(null);
  const [toastMsg, setToastMsg]             = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  // ── Lokasi handlers ──────────────────────────────────────────────────────────
  const openAddLokasi = () => {
    setLokasiForm(emptyLokasiForm); setEditLokasiId(null);
    setLokasiErrors({}); setShowLokasiForm(true);
  };
  const openEditLokasi = (loc) => {
    setLokasiForm({ nama: loc.nama, tipe: loc.tipe || 'kampus', alamat: loc.alamat,
      jarakRataRata: loc.jarakRataRata || '1.0 - 2.5 km', deskripsi: loc.deskripsi ?? '' });
    setEditLokasiId(loc.id); setLokasiErrors({}); setShowLokasiForm(true);
  };
  const validateLokasi = () => {
    const e = {};
    if (!lokasiForm.nama.trim())   e.nama   = 'Nama lokasi wajib diisi.';
    if (!lokasiForm.alamat.trim()) e.alamat  = 'Alamat wajib diisi.';
    return e;
  };
  const handleSubmitLokasi = (ev) => {
    ev.preventDefault();
    const e = validateLokasi();
    if (Object.keys(e).length) { setLokasiErrors(e); return; }
    const sel = TIPE_OPTIONS.find((t) => t.value === lokasiForm.tipe);
    const payload = { ...lokasiForm, kategoriLabel: sel?.label || 'Lokasi Strategis', updatedAt: new Date().toISOString() };
    if (editLokasiId) { updateLokasi(editLokasiId, payload); showToast('Lokasi berhasil diperbarui'); }
    else { addLokasi({ id: `loc_${Date.now()}`, ...payload, isDefault: lokasi.length === 0, createdAt: new Date().toISOString() }); showToast('Lokasi baru berhasil ditambahkan'); }
    setShowLokasiForm(false); setEditLokasiId(null); setLokasiForm(emptyLokasiForm);
  };
  const handleDeleteLokasi = (id) => {
    if (deleteLokasiConfirm === id) { deleteLokasi(id); setDeleteLokasiConfirm(null); showToast('Lokasi berhasil dihapus'); }
    else { setDeleteLokasiConfirm(id); setTimeout(() => setDeleteLokasiConfirm(null), 3000); }
  };

  // ── User handlers ────────────────────────────────────────────────────────────
  const openAddUser = () => {
    setUserForm(emptyUserForm); setEditUserId(null);
    setUserErrors({}); setShowUserForm(true);
  };
  const openEditUser = (usr) => {
    setUserForm({ nama: usr.nama, username: usr.username, password: usr.password || '',
      email: usr.email || '', role: usr.role || 'Staf Penilai SPK', status: usr.status || 'Aktif' });
    setEditUserId(usr.id); setUserErrors({}); setShowUserForm(true);
  };
  const validateUser = () => {
    const e = {};
    if (!userForm.nama.trim())     e.nama     = 'Nama lengkap wajib diisi.';
    if (!userForm.username.trim()) e.username  = 'Username wajib diisi.';
    if (!editUserId && !userForm.password.trim()) e.password = 'Password wajib diisi untuk pengguna baru.';
    if (!userForm.email.trim())    e.email    = 'Email wajib diisi.';
    return e;
  };
  const handleSubmitUser = (ev) => {
    ev.preventDefault();
    const e = validateUser();
    if (Object.keys(e).length) { setUserErrors(e); return; }
    const avatarColors = ['#3B82F6', '#10B981', '#8B5CF6', '#EC4899', '#F59E0B'];
    const payload = { nama: userForm.nama.trim(), username: userForm.username.trim().toLowerCase(),
      password: userForm.password ? userForm.password.trim() : undefined, email: userForm.email.trim(),
      role: userForm.role, status: userForm.status, updatedAt: new Date().toISOString() };
    if (editUserId) { updateUser(editUserId, payload); showToast('Data pengguna berhasil diperbarui'); }
    else { addUser({ id: `usr_${Date.now()}`, ...payload, password: userForm.password.trim(),
        lastLogin: 'Belum pernah', avatarBg: avatarColors[Math.floor(Math.random() * avatarColors.length)],
        createdAt: new Date().toISOString() }); showToast('Pengguna baru berhasil ditambahkan'); }
    setShowUserForm(false); setEditUserId(null); setUserForm(emptyUserForm);
  };
  const handleDeleteUser = (u) => {
    if (u.username === auth?.username) { alert('Tidak dapat menghapus akun yang sedang aktif.'); return; }
    if (deleteUserConfirm === u.id) { deleteUser(u.id); setDeleteUserConfirm(null); showToast('Pengguna berhasil dihapus'); }
    else { setDeleteUserConfirm(u.id); setTimeout(() => setDeleteUserConfirm(null), 3000); }
  };

  // ── Filtered lists ───────────────────────────────────────────────────────────
  const filteredLokasi = lokasi.filter((loc) => {
    const ms = loc.nama.toLowerCase().includes(searchLokasi.toLowerCase()) ||
               loc.alamat.toLowerCase().includes(searchLokasi.toLowerCase());
    const mt = filterTipe === 'all' || loc.tipe === filterTipe;
    return ms && mt;
  });
  const filteredUsers = users.filter((u) =>
    u.nama.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.username.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.email.toLowerCase().includes(searchUser.toLowerCase())
  );

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="page-container">

      {/* ── Page Header ─────────────────────────────────────────────────────── */}
      <div className="page-header">
        <h1 className="page-header-title">
          <Users size={26} />
          <span>Pengguna <span className="highlight">&amp; Lokasi Sekitar</span></span>
        </h1>
        <p className="page-header-subtitle">
          Kelola akun administrator dan titik lokasi strategis di sekitar kost
        </p>
      </div>

      {/* ── Toast ──────────────────────────────────────────────────────────── */}
      {toastMsg && (
        <div className="ml-toast" role="status">
          <CheckCircle2 size={16} /> {toastMsg}
        </div>
      )}

      {/* ── Tab Bar ────────────────────────────────────────────────────────── */}
      <div className="ml-tabs">
        <button
          className={`ml-tab${activeTab === 'lokasi' ? ' ml-tab--active' : ''}`}
          onClick={() => setActiveTab('lokasi')}
          id="tab-lokasi-btn"
        >
          <MapPin size={16} />
          <span>Lokasi Strategis <span className="ml-tab-count">({lokasi.length})</span></span>
        </button>
        <button
          className={`ml-tab${activeTab === 'pengguna' ? ' ml-tab--active' : ''}`}
          onClick={() => setActiveTab('pengguna')}
          id="tab-pengguna-btn"
        >
          <Users size={16} />
          <span>Pengguna &amp; Admin <span className="ml-tab-count">({users.length})</span></span>
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          TAB 1 — LOKASI SEKITAR
          ══════════════════════════════════════════════════════════════ */}
      {activeTab === 'lokasi' && (
        <section aria-label="Manajemen Lokasi Sekitar">

          {/* Toolbar */}
          <div className="ml-toolbar">
            <div className="ml-toolbar-left">
              <div className="search-bar ml-search">
                <span className="search-bar-icon"><Search size={15} /></span>
                <input
                  type="search" className="form-input"
                  placeholder="Cari lokasi strategis..."
                  value={searchLokasi}
                  onChange={(e) => setSearchLokasi(e.target.value)}
                  id="lokasi-search-input"
                />
              </div>
              <select
                className="form-input ml-filter-select"
                value={filterTipe}
                onChange={(e) => setFilterTipe(e.target.value)}
                id="filter-tipe-lokasi"
              >
                <option value="all">Semua Kategori</option>
                {TIPE_OPTIONS.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <button className="btn btn-primary" onClick={openAddLokasi} id="btn-add-lokasi">
              <Plus size={15} /> Tambah Lokasi
            </button>
          </div>

          {/* Cards Grid */}
          {filteredLokasi.length === 0 ? (
            <div className="empty-state">
              <MapPin size={42} className="empty-state-icon" />
              <h3>Belum Ada Lokasi</h3>
              <p>Tambahkan lokasi strategis di sekitar kost.</p>
              <button className="btn btn-primary" onClick={openAddLokasi}>
                <Plus size={15} /> Tambah Lokasi Pertama
              </button>
            </div>
          ) : (
            <div className="lokasi-grid">
              {filteredLokasi.map((loc) => {
                const meta = TIPE_OPTIONS.find((t) => t.value === loc.tipe) || TIPE_OPTIONS[4];
                const Icon = meta.icon;
                return (
                  <div
                    key={loc.id}
                    className={`lokasi-card${loc.isDefault ? ' lokasi-card--default' : ''}`}
                  >
                    {/* Badge default */}
                    {loc.isDefault && (
                      <span className="lokasi-default-badge">
                        <Star size={11} fill="currentColor" /> Acuan Utama
                      </span>
                    )}

                    {/* Header */}
                    <div className="lokasi-card-head">
                      <div
                        className="lokasi-card-icon"
                        style={{ background: `${meta.color}1A`, color: meta.color, borderColor: `${meta.color}33` }}
                      >
                        <Icon size={20} />
                      </div>
                      <div className="lokasi-card-info">
                        <span
                          className="badge"
                          style={{ background: `${meta.color}18`, color: meta.color,
                            border: `1px solid ${meta.color}33`, fontSize: '11px', marginBottom: 4 }}
                        >
                          {loc.kategoriLabel || meta.label}
                        </span>
                        <h3 className="lokasi-nama">{loc.nama}</h3>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="lokasi-alamat">
                      <MapPin size={13} style={{ flexShrink: 0, marginTop: 2 }} />
                      <span>{loc.alamat}</span>
                    </div>

                    {loc.jarakRataRata && (
                      <div className="lokasi-jarak">
                        <Navigation size={13} />
                        <span>Estimasi jarak: <strong>{loc.jarakRataRata}</strong></span>
                      </div>
                    )}

                    {loc.deskripsi && (
                      <p className="lokasi-deskripsi">"{loc.deskripsi}"</p>
                    )}

                    {/* Actions */}
                    <div className="lokasi-card-actions">
                      {!loc.isDefault ? (
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => setDefaultLokasi(loc.id)}
                          id={`btn-setdefault-${loc.id}`}
                        >
                          <Star size={12} /> Jadikan Default
                        </button>
                      ) : (
                        <span className="lokasi-active-label">
                          <Check size={12} /> Titik Acuan Aktif
                        </span>
                      )}
                      <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => openEditLokasi(loc)}
                          id={`btn-edit-lokasi-${loc.id}`}
                        >
                          <Edit2 size={12} /> Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteLokasi(loc.id)}
                          id={`btn-delete-lokasi-${loc.id}`}
                        >
                          <Trash2 size={12} />
                          {deleteLokasiConfirm === loc.id ? ' Yakin?' : ''}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════
          TAB 2 — PENGGUNA & ADMIN
          ══════════════════════════════════════════════════════════════ */}
      {activeTab === 'pengguna' && (
        <section aria-label="Manajemen Pengguna Admin">

          {/* Toolbar */}
          <div className="ml-toolbar">
            <div className="ml-toolbar-left">
              <div className="search-bar ml-search">
                <span className="search-bar-icon"><Search size={15} /></span>
                <input
                  type="search" className="form-input"
                  placeholder="Cari nama, username, atau email..."
                  value={searchUser}
                  onChange={(e) => setSearchUser(e.target.value)}
                  id="user-search-input"
                />
              </div>
            </div>
            <button className="btn btn-primary" onClick={openAddUser} id="btn-add-user">
              <Plus size={15} /> Tambah Pengguna
            </button>
          </div>

          {/* User Cards (mobile-first grid) */}
          <div className="ml-user-grid">
            {filteredUsers.map((u) => {
              const isCurrent = u.username === auth?.username;
              return (
                <div key={u.id} className={`ml-user-card${isCurrent ? ' ml-user-card--current' : ''}`} id={`user-row-${u.id}`}>
                  {/* Avatar + name */}
                  <div className="ml-user-card-top">
                    <div
                      className="ml-user-avatar"
                      style={{ background: u.avatarBg || '#3B82F6' }}
                      aria-hidden="true"
                    >
                      {u.nama.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="ml-user-identity">
                      <div className="ml-user-name">
                        {u.nama}
                        {isCurrent && <span className="badge badge-primary ml-you-badge">Anda</span>}
                      </div>
                      <div className="ml-user-username">@{u.username}</div>
                    </div>
                    <div className="ml-user-status">
                      <span className={`badge ${u.status === 'Aktif' ? 'badge--success' : 'badge--danger'}`}>
                        {u.status === 'Aktif' ? '● Aktif' : '○ Nonaktif'}
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="ml-user-details">
                    <div className="ml-user-detail-row">
                      <Mail size={13} />
                      <span>{u.email}</span>
                    </div>
                    <div className="ml-user-detail-row">
                      <ShieldCheck size={13} />
                      <span>{u.role}</span>
                    </div>
                    <div className="ml-user-detail-row">
                      <Key size={13} />
                      <span style={{ color: '#94A3B8' }}>Login: {u.lastLogin || '—'}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="ml-user-actions">
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => openEditUser(u)}
                      id={`btn-edit-user-${u.id}`}
                    >
                      <Edit2 size={13} /> Edit
                    </button>
                    {!isCurrent && (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteUser(u)}
                        id={`btn-delete-user-${u.id}`}
                      >
                        <Trash2 size={13} />
                        {deleteUserConfirm === u.id ? ' Yakin?' : ' Hapus'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Modal Lokasi ────────────────────────────────────────────────────── */}
      {showLokasiForm && (
        <div className="modal-backdrop">
          <div className="modal modal-lg" role="dialog" aria-modal="true">
            <div className="modal-header">
              <h2 className="modal-title">
                <MapPin size={18} />
                {editLokasiId ? 'Edit Lokasi Strategis' : 'Tambah Lokasi Sekitar'}
              </h2>
              <button className="modal-close-btn" onClick={() => setShowLokasiForm(false)} aria-label="Tutup">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmitLokasi}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label" htmlFor="lok-nama">Nama Lokasi Strategis *</label>
                  <input id="lok-nama" type="text" className="form-input"
                    value={lokasiForm.nama}
                    onChange={(e) => setLokasiForm({ ...lokasiForm, nama: e.target.value })}
                    placeholder="Contoh: Universitas Indonesia, Margo City Mall..."
                  />
                  {lokasiErrors.nama && <div className="form-error">{lokasiErrors.nama}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="lok-tipe">Kategori Lokasi</label>
                  <select id="lok-tipe" className="form-input"
                    value={lokasiForm.tipe}
                    onChange={(e) => setLokasiForm({ ...lokasiForm, tipe: e.target.value })}
                  >
                    {TIPE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="lok-alamat">Alamat Lengkap *</label>
                  <textarea id="lok-alamat" className="form-input" rows={2}
                    value={lokasiForm.alamat}
                    onChange={(e) => setLokasiForm({ ...lokasiForm, alamat: e.target.value })}
                    placeholder="Jl. Margonda Raya No. ..."
                  />
                  {lokasiErrors.alamat && <div className="form-error">{lokasiErrors.alamat}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="lok-jarak">Estimasi Jarak Rata-rata ke Kost</label>
                  <input id="lok-jarak" type="text" className="form-input"
                    value={lokasiForm.jarakRataRata}
                    onChange={(e) => setLokasiForm({ ...lokasiForm, jarakRataRata: e.target.value })}
                    placeholder="Contoh: 0.8 - 2.5 km"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="lok-desc">Keterangan / Catatan</label>
                  <input id="lok-desc" type="text" className="form-input"
                    value={lokasiForm.deskripsi}
                    onChange={(e) => setLokasiForm({ ...lokasiForm, deskripsi: e.target.value })}
                    placeholder="Fasilitas umum di sekitar lokasi..."
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowLokasiForm(false)}>Batal</button>
                <button type="submit" className="btn btn-primary" id="btn-save-lokasi">
                  {editLokasiId ? 'Simpan Perubahan' : 'Tambah Lokasi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal User ───────────────────────────────────────────────────────── */}
      {showUserForm && (
        <div className="modal-backdrop">
          <div className="modal modal-lg" role="dialog" aria-modal="true">
            <div className="modal-header">
              <h2 className="modal-title">
                <Users size={18} />
                {editUserId ? 'Edit Akun Pengguna' : 'Tambah Pengguna Baru'}
              </h2>
              <button className="modal-close-btn" onClick={() => setShowUserForm(false)} aria-label="Tutup">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmitUser}>
              <div className="modal-body">
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="usr-nama">Nama Lengkap *</label>
                    <input id="usr-nama" type="text" className="form-input"
                      value={userForm.nama}
                      onChange={(e) => setUserForm({ ...userForm, nama: e.target.value })}
                      placeholder="Nama Pengguna / Admin"
                    />
                    {userErrors.nama && <div className="form-error">{userErrors.nama}</div>}
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="usr-username">Username *</label>
                    <input id="usr-username" type="text" className="form-input"
                      value={userForm.username}
                      onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
                      placeholder="username (tanpa spasi)"
                    />
                    {userErrors.username && <div className="form-error">{userErrors.username}</div>}
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="usr-password">
                      {editUserId ? 'Password Baru (kosongkan jika tidak diubah)' : 'Password *'}
                    </label>
                    <input id="usr-password" type="password" className="form-input"
                      value={userForm.password}
                      onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                      placeholder="••••••••"
                    />
                    {userErrors.password && <div className="form-error">{userErrors.password}</div>}
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="usr-email">Email *</label>
                    <input id="usr-email" type="email" className="form-input"
                      value={userForm.email}
                      onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                      placeholder="admin@kostsaw.ac.id"
                    />
                    {userErrors.email && <div className="form-error">{userErrors.email}</div>}
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="usr-role">Hak Akses (Role)</label>
                    <select id="usr-role" className="form-input"
                      value={userForm.role}
                      onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                    >
                      {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="usr-status">Status Akun</label>
                    <select id="usr-status" className="form-input"
                      value={userForm.status}
                      onChange={(e) => setUserForm({ ...userForm, status: e.target.value })}
                    >
                      <option value="Aktif">Aktif</option>
                      <option value="Nonaktif">Nonaktif</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowUserForm(false)}>Batal</button>
                <button type="submit" className="btn btn-primary" id="btn-save-user">
                  {editUserId ? 'Simpan Perubahan' : 'Tambah Pengguna'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
