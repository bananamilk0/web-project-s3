// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';
import logoImg from '../assets/logo.png';

/**
 * Login — halaman autentikasi administrator
 */
export default function Login() {
  const { login } = useApp();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      setError('Username dan password tidak boleh kosong.');
      return;
    }
    setLoading(true);
    // Simulasi async
    await new Promise((r) => setTimeout(r, 600));
    const ok = login(form.username, form.password);
    setLoading(false);
    if (ok) {
      navigate('/dashboard', { replace: true });
    } else {
      setError('Username atau password salah. Silakan coba lagi.');
    }
  };

  return (
    <div className="login-page">
      {/* Background decoration */}
      <div className="login-bg-blob login-bg-blob--1" aria-hidden="true" />
      <div className="login-bg-blob login-bg-blob--2" aria-hidden="true" />
      <div className="login-bg-blob login-bg-blob--3" aria-hidden="true" />

      <div className="login-card" role="main">
        {/* Header */}
        <div className="login-header">
          <img
            src={logoImg}
            alt="KiKost Bogor"
            className="login-brand-logo"
            style={{
              maxWidth: '240px',
              width: '100%',
              height: 'auto',
              margin: '0 auto 16px',
              display: 'block',
              filter: 'drop-shadow(0 4px 12px rgba(11, 11, 114, 0.15))'
            }}
          />
          <p className="login-subtitle">
            Sistem Pendukung Keputusan<br />Pemilihan Kost Terbaik (Metode SAW)
          </p>
        </div>

        {/* Form */}
        <form className="login-form" onSubmit={handleSubmit} id="login-form" noValidate>
          <div className="login-form-group">
            <label className="login-label" htmlFor="login-username">Username</label>
            <input
              id="login-username"
              name="username"
              type="text"
              className={`login-input${error ? ' login-input--error' : ''}`}
              placeholder="Masukkan username admin"
              value={form.username}
              onChange={handleChange}
              autoComplete="username"
              autoFocus
              aria-required="true"
              aria-describedby={error ? 'login-error' : undefined}
            />
          </div>

          <div className="login-form-group">
            <label className="login-label" htmlFor="login-password">Password</label>
            <div className="login-input-wrapper">
              <input
                id="login-password"
                name="password"
                type={showPass ? 'text' : 'password'}
                className={`login-input login-input--password${error ? ' login-input--error' : ''}`}
                placeholder="Masukkan password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                aria-required="true"
              />
              <button
                type="button"
                className="login-eye-btn"
                onClick={() => setShowPass((v) => !v)}
                aria-label={showPass ? 'Sembunyikan password' : 'Tampilkan password'}
                id="login-toggle-password"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="login-error" id="login-error" role="alert" aria-live="polite">
              <AlertCircle size={15} />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="login-btn"
            id="login-submit-btn"
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? (
              <span className="login-btn-loading">
                <span className="login-spinner" aria-hidden="true" />
                Memverifikasi...
              </span>
            ) : (
              <>
                <LogIn size={18} />
                <span>Masuk ke Sistem</span>
              </>
            )}
          </button>
        </form>

        {/* Hint */}
        <div className="login-hint">
          <span>Default: admin / admin123</span>
        </div>

        <p className="login-footer-text">
          &copy; 2026 KiKost Bogor &bull; Metode Simple Additive Weighting
        </p>
      </div>
    </div>
  );
}
