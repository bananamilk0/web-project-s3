// src/pages/Settings.jsx
import { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  Settings as SettingsIcon, User, Database, Download, Upload,
  Save, RefreshCw, AlertTriangle, CheckCircle2,
  Shield, Info, Trash2, Building, Sliders, Check,
} from 'lucide-react';
import { weightPresets } from '../data/criteriaData';

export default function Settings() {
  const {
    settings, updateSettings, kosts, criteria, updateCriteria,
    lokasi, riwayat, users, resetDefault, importData,
  } = useApp();

  const [form, setForm] = useState({
    systemName: settings?.systemName ?? 'KiKost Bogor',
    adminUsername: settings?.adminUsername ?? 'admin',
    appVersion: settings?.appVersion ?? '2.0.0',
    institutionName: settings?.institutionName ?? 'Pusat Informasi Hunian Mahasiswa & SPK',
    institutionDept: settings?.institutionDept ?? 'Divisi Kemahasiswaan & Akomodasi',
    institutionAddress: settings?.institutionAddress ?? 'Jl. Margonda Raya No. 100, Kota Depok, Jawa Barat',
    institutionContact: settings?.institutionContact ?? 'spk-kost@kampus.ac.id',
    spkDescription: settings?.spkDescription ?? 'Sistem Pendukung Keputusan pemilihan kost menggunakan metode Simple Additive Weighting (SAW) dengan 8 kriteria terbobot untuk menentukan rekomendasi hunian terbaik.',
  });

  const [saved, setSaved] = useState(false);
  const [appliedPreset, setAppliedPreset] = useState('');
  const [resetConfirm, setResetConfirm] = useState(false);
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState('');
  const fileRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateSettings({ ...form });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  // Terapkan Bobot Preset
  const handleApplyPreset = (presetKey, presetData) => {
    const updated = criteria.map((c) => ({
      ...c,
      weight: presetData.weights[c.kode || c.id] ?? c.weight,
    }));
    updateCriteria(updated);
    setAppliedPreset(presetData.name);
    setTimeout(() => setAppliedPreset(''), 3000);
  };

  // Ekspor JSON backup
  const handleExport = () => {
    const backup = {
      exportedAt: new Date().toISOString(),
      appVersion: form.appVersion,
      kosts,
      criteria,
      lokasi,
      users,
      riwayat,
      settings: { ...settings, ...form },
    };
    const json = JSON.stringify(backup, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `KostSAW_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  // Import JSON backup
  const handleImport = (e) => {
    setImportError('');
    setImportSuccess('');
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (!data.kosts || !data.criteria) {
          setImportError('File tidak valid: data kosts dan criteria tidak ditemukan.');
          return;
        }
        importData({
          kosts: data.kosts,
          criteria: data.criteria,
          lokasi: data.lokasi ?? [],
          users: data.users ?? [],
          riwayat: data.riwayat ?? [],
          settings: data.settings ?? settings,
          activityLog: [],
        });
        setImportSuccess(`Data berhasil dipulihkan dari "${file.name}".`);
      } catch {
        setImportError('File rusak atau format bukan JSON yang valid.');
      }
    };
    reader.readAsText(file);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleReset = () => {
    if (resetConfirm) {
      resetDefault();
      setResetConfirm(false);
    } else {
      setResetConfirm(true);
      setTimeout(() => setResetConfirm(false), 4000);
    }
  };

  const totalBobot = criteria.reduce((s, c) => s + (c.weight ?? 0), 0);

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-header-title">
            <SettingsIcon size={28} />
            <span>Pengaturan <span className="highlight">Sistem</span></span>
          </h1>
          <p className="page-header-subtitle">
            Konfigurasi aplikasi, manajemen profil instansi/SPK, bobot default kriteria, dan pencadangan data
          </p>
        </div>
      </div>

      {/* Statistik Ringkas Sistem */}
      <div className="settings-stats-row">
        {[
          { label: 'Data Kost', value: kosts.length, icon: '🏠' },
          { label: 'Kriteria Aktif', value: criteria.length, icon: '📊' },
          { label: 'Lokasi Acuan', value: lokasi?.length ?? 0, icon: '📍' },
          { label: 'Akun Pengguna', value: users?.length ?? 0, icon: '👥' },
        ].map((s) => (
          <div key={s.label} className="settings-stat-card">
            <span className="settings-stat-icon" aria-hidden="true">{s.icon}</span>
            <span className="settings-stat-val">{s.value}</span>
            <span className="settings-stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="settings-grid">
        {/* ── Panel 1: Konfigurasi Identitas Aplikasi ─────────────────────── */}
        <section className="settings-panel" aria-label="Identitas sistem">
          <div className="settings-panel-header">
            <Info size={16} />
            <h2>Konfigurasi Aplikasi</h2>
          </div>
          <form className="settings-form" onSubmit={handleSave} id="form-settings">
            <div className="form-group">
              <label className="form-label" htmlFor="set-systemName">Nama Aplikasi / Sistem</label>
              <input
                id="set-systemName"
                name="systemName"
                type="text"
                className="form-input"
                value={form.systemName}
                onChange={handleChange}
                placeholder="KostSAW"
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="set-adminUsername">Username Administrator Utama</label>
              <input
                id="set-adminUsername"
                name="adminUsername"
                type="text"
                className="form-input"
                value={form.adminUsername}
                onChange={handleChange}
                placeholder="admin"
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="set-appVersion">Versi Aplikasi</label>
              <input
                id="set-appVersion"
                name="appVersion"
                type="text"
                className="form-input"
                value={form.appVersion}
                onChange={handleChange}
                placeholder="2.0.0"
              />
            </div>

            {saved && (
              <div className="settings-success-msg" role="status" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={15} /> Pengaturan berhasil disimpan!
              </div>
            )}

            <button type="submit" className="btn btn-primary" id="btn-save-settings">
              <Save size={16} /> Simpan Konfigurasi
            </button>
          </form>
        </section>

        {/* ── Panel 2: Profil Instansi & SPK ───────────────────────── */}
        <section className="settings-panel" aria-label="Profil instansi">
          <div className="settings-panel-header">
            <Building size={16} />
            <h2>Profil Instansi &amp; Sistem SPK</h2>
          </div>
          <form className="settings-form" onSubmit={handleSave} id="form-instansi">
            <div className="form-group">
              <label className="form-label" htmlFor="set-instName">Nama Lembaga / Instansi</label>
              <input
                id="set-instName"
                name="institutionName"
                type="text"
                className="form-input"
                value={form.institutionName}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="set-instDept">Unit / Divisi Pengelola</label>
              <input
                id="set-instDept"
                name="institutionDept"
                type="text"
                className="form-input"
                value={form.institutionDept}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="set-instContact">Email / Kontak Layanan</label>
              <input
                id="set-instContact"
                name="institutionContact"
                type="text"
                className="form-input"
                value={form.institutionContact}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="set-spkDesc">Deskripsi Metode &amp; Sistem</label>
              <textarea
                id="set-spkDesc"
                name="spkDescription"
                className="form-input"
                rows={2}
                value={form.spkDescription}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="btn btn-secondary" id="btn-save-instansi">
              <Save size={15} /> Simpan Profil Instansi
            </button>
          </form>
        </section>

        {/* ── Panel 3: Bobot Default & Preset SAW ─────────────────────── */}
        <section className="settings-panel settings-panel--wide" aria-label="Bobot default dan preset">
          <div className="settings-panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sliders size={16} />
              <h2>Bobot Default &amp; Preset SAW</h2>
            </div>
            {appliedPreset && (
              <span className="badge badge--success" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Check size={12} /> Preset {appliedPreset} Diterapkan!
              </span>
            )}
          </div>

          <p className="settings-panel-desc">
            Pilih dan terapkan skenario bobot kriteria yang telah dioptimasi sesuai preferensi pengguna:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '14px', marginTop: '12px' }}>
            {Object.entries(weightPresets).map(([key, p]) => (
              <div
                key={key}
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontSize: '1.2rem', marginBottom: '6px' }}>{p.icon}</div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-on-dark)', marginBottom: '4px' }}>
                    {p.name}
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-on-dark-muted)', marginBottom: '12px' }}>
                    {p.description}
                  </p>
                </div>

                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleApplyPreset(key, p)}
                  id={`btn-preset-${key}`}
                >
                  Terapkan Bobot Ini
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* ── Panel 4: Backup & Restore Data ─────────────────────────── */}
        <section className="settings-panel settings-panel--wide" aria-label="Backup dan restore data">
          <div className="settings-panel-header">
            <Database size={16} />
            <h2>Pencadangan &amp; Pemulihan Data</h2>
          </div>

          <p className="settings-panel-desc">
            Ekspor seluruh dataset sistem (kost, kriteria, lokasi strategis, akun pengguna, riwayat) ke file JSON, atau pulihkan dari cadangan sebelumnya.
          </p>

          <div className="settings-backup-actions">
            {/* Export */}
            <div className="settings-backup-group">
              <h3 className="settings-backup-label">
                <Download size={14} /> Ekspor Cadangan
              </h3>
              <button
                className="btn btn-secondary"
                onClick={handleExport}
                id="btn-export-backup"
              >
                <Download size={15} /> Unduh Backup JSON
              </button>
              <p className="settings-help-text">
                Mengunduh file <code>.json</code> berisi semua data sistem saat ini.
              </p>
            </div>

            {/* Import */}
            <div className="settings-backup-group">
              <h3 className="settings-backup-label">
                <Upload size={14} /> Pemulihan dari Cadangan
              </h3>
              <label className="btn btn-secondary" htmlFor="file-import-backup" style={{ cursor: 'pointer' }}>
                <Upload size={15} /> Pilih File Cadangan JSON
              </label>
              <input
                id="file-import-backup"
                ref={fileRef}
                type="file"
                accept=".json"
                style={{ display: 'none' }}
                onChange={handleImport}
              />
              <p className="settings-help-text">
                Memulihkan data dari file backup JSON yang sebelumnya diunduh.
              </p>
            </div>
          </div>

          {importSuccess && (
            <div className="alert alert--success mt-4" role="status" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} /> {importSuccess}
            </div>
          )}
          {importError && (
            <div className="alert alert--danger mt-4" role="alert" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={16} /> {importError}
            </div>
          )}
        </section>

        {/* ── Panel 5: Zona Reset Data ───────────────────────────────── */}
        <section className="settings-panel settings-panel--wide settings-panel--danger" aria-label="Reset sistem">
          <div className="settings-panel-header">
            <AlertTriangle size={16} />
            <h2>Zona Pemulihan Default (Reset Data)</h2>
          </div>
          <p className="settings-panel-desc">
            Mengembalikan seluruh data kost, kriteria, lokasi, dan akun pengguna ke konfigurasi bawaan awal.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <button
              className="btn btn-danger"
              onClick={handleReset}
              id="btn-reset-default"
            >
              <RefreshCw size={15} />
              {resetConfirm ? 'Klik Sekali Lagi untuk Konfirmasi Reset' : 'Reset ke Data Bawaan'}
            </button>
            {resetConfirm && (
              <span style={{ fontSize: '0.8rem', color: 'var(--color-danger)' }}>
                Perhatian: Semua data yang diubah akan dikembalikan ke data awal.
              </span>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
