/**
 * src/components/dashboard/DashboardView.jsx
 * Dashboard Utama Administrator SPK Kost Terbaik (Verdant Living)
 * Sesuai Desain Mockup "Kikost":
 * - Hero Banner Modern Tropical Housing
 * - 5 Kartu Statistik Real-time
 * - Grafik Batang & Diagram Donat Komposisi Bobot
 * - Tabel Peringkat Kost Terbaik
 * - Kolom Kanan: Jam Real-time, Aktivitas Terbaru, Trigger Perhitungan, & Riwayat
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import PreferenceBarChart from '../charts/PreferenceBarChart';
import CriteriaDonutChart from '../charts/CriteriaDonutChart';
import {
  Home,
  CheckCircle2,
  ListFilter,
  Layers,
  Trophy,
  ArrowRight,
  Play,
  RotateCw,
  Clock,
  Calendar,
  Sparkles,
  ExternalLink,
  MapPin,
  Check
} from 'lucide-react';

export default function DashboardView() {
  const {
    kostList,
    kriteriaList,
    sawResult,
    isCalculating,
    runCalculation,
    recentActivities,
    calculationHistory,
    setActivePage,
    setGuideModalOpen
  } = useApp();

  // Live Current Time
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const totalKost = kostList.length;
  const activeKost = kostList.filter(k => k.aktif);
  const totalBobot = kriteriaList.reduce((acc, c) => acc + Number(c.bobot || 0), 0);
  const topAlternative = sawResult?.results?.[0];

  const formatHariTanggal = (date) => {
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatWaktu = (date) => {
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* ========================================================
          1. HERO SECTION (Verdant Living Welcome Banner)
          ======================================================== */}
      <div
        className="panel"
        style={{
          background: 'linear-gradient(135deg, #EEF5EC 0%, #E3EFE1 100%)',
          borderColor: '#D4E5D3',
          padding: 0,
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          alignItems: 'stretch',
          borderRadius: 'var(--radius-xl)'
        }}
      >
        {/* Konten Teks Hero */}
        <div
          style={{
            flex: 1.2,
            padding: '32px 36px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            zIndex: 2
          }}
        >
          {/* Tag Verdant Living Housing & Sistem SPK */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
            <span
              style={{
                backgroundColor: 'var(--mint-green)',
                color: 'var(--forest-green)',
                padding: '6px 14px',
                borderRadius: 'var(--radius-pill)',
                fontSize: '0.8rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: 'var(--shadow-xs)',
                letterSpacing: '0.02em'
              }}
            >
              🌿 Verdant Living Housing
            </span>
            <span
              style={{
                backgroundColor: 'rgba(23, 77, 59, 0.08)',
                color: 'var(--forest-green)',
                padding: '6px 12px',
                borderRadius: 'var(--radius-pill)',
                fontSize: '0.78rem',
                fontWeight: 600
              }}
            >
              SPK Kost Metode SAW
            </span>
          </div>

          <h1
            style={{
              fontSize: '2rem',
              fontWeight: 800,
              color: 'var(--forest-green)',
              letterSpacing: '-0.02em',
              marginBottom: '18px',
              lineHeight: 1.2
            }}
          >
            Halo, Administrator!
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <button
              className="btn btn-primary"
              onClick={() => setGuideModalOpen(true)}
              style={{ padding: '10px 20px', borderRadius: 'var(--radius-md)' }}
            >
              <Sparkles size={16} />
              <span>Lihat Panduan Singkat</span>
            </button>
            <button
              className="btn btn-outline"
              onClick={() => setActivePage('saw')}
              style={{ padding: '10px 18px', backgroundColor: '#FFFFFF' }}
            >
              <span>Matriks & Normalisasi SAW</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>

        {/* Gambar Hero Hunian Tropis Modern */}
        <div
          style={{
            flex: 1,
            position: 'relative',
            minHeight: '220px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            borderRadius: 'var(--radius-lg)'
          }}
        >
          <img
            src="./assets/hero-banner.jpg"
            alt="Verdant Living Housing"
            onError={e => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80';
            }}
            style={{
              width: '100%',
              height: '100%',
              minHeight: '220px',
              objectFit: 'cover',
              objectPosition: 'center',
              display: 'block'
            }}
          />
          {/* Subtle gradient overlay to blend into the ivory/green card */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(90deg, #EEF5EC 0%, rgba(238, 245, 236, 0.25) 25%, transparent 100%)'
            }}
          />
          {/* Badge Handwriting Note: Temukan kost terbaik sesuai preferensimu! */}
          <div
            style={{
              position: 'absolute',
              top: '18px',
              right: '20px',
              backgroundColor: 'rgba(255, 253, 245, 0.94)',
              backdropFilter: 'blur(6px)',
              padding: '7px 16px',
              borderRadius: 'var(--radius-pill)',
              border: '1.5px solid rgba(35, 132, 91, 0.25)',
              boxShadow: '0 4px 14px rgba(23, 77, 59, 0.12)',
              fontFamily: "'Caveat', cursive, var(--font-sans)",
              fontSize: '1.18rem',
              color: 'var(--forest-green)',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              whiteSpace: 'nowrap'
            }}
          >
            <span>Temukan kost terbaik sesuai preferensimu!</span>
            <span>🌿</span>
          </div>
        </div>
      </div>

      {/* ========================================================
          2. KARTU STATISTIK (5 Kartu Dinamis)
          ======================================================== */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px'
        }}
      >
        {/* Card 1: Total Data Kost */}
        <div className="panel" style={{ padding: '18px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--muted-green)' }}>Total Data Kost</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'var(--pale-green)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Home size={17} color="var(--emerald-green)" />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--forest-green)', lineHeight: 1.1 }}>
              {totalKost}
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--emerald-green)', fontWeight: 600 }}>
              Semua kost terdaftar
            </span>
          </div>
        </div>

        {/* Card 2: Kost Aktif */}
        <div className="panel" style={{ padding: '18px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--muted-green)' }}>Kost Aktif</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'var(--pale-green)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={17} color="var(--emerald-green)" />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--forest-green)', lineHeight: 1.1 }}>
              {activeKost.length}
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--muted-green)', fontWeight: 600 }}>
              Tersedia untuk perhitungan
            </span>
          </div>
        </div>

        {/* Card 3: Jumlah Kriteria */}
        <div className="panel" style={{ padding: '18px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--muted-green)' }}>Jumlah Kriteria</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'var(--pale-green)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ListFilter size={17} color="var(--emerald-green)" />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--forest-green)', lineHeight: 1.1 }}>
              {kriteriaList.length}
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--forest-green)', fontWeight: 600 }}>
              Total bobot: {totalBobot.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Card 4: Alternatif Lengkap */}
        <div className="panel" style={{ padding: '18px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--muted-green)' }}>Alternatif Lengkap</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'var(--pale-green)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Layers size={17} color="var(--emerald-green)" />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--forest-green)', lineHeight: 1.1 }}>
              {sawResult?.activeKostCount || 0}
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--emerald-green)', fontWeight: 600 }}>
              Siap dihitung
            </span>
          </div>
        </div>

        {/* Card 5: Peringkat Teratas */}
        <div className="panel" style={{ padding: '18px 20px', backgroundColor: 'var(--warm-ivory)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--forest-green)' }}>Peringkat Teratas</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#FDE68A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Trophy size={17} color="#92400E" />
            </div>
          </div>
          <div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--forest-green)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {topAlternative ? topAlternative.kostData.nama : '-'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--emerald-green)', fontWeight: 700, marginTop: '2px' }}>
              Nilai: {topAlternative ? topAlternative.skorAkhir : '0.000'}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          3. MAIN LAYOUT: KIRI (Visualisasi & Tabel) + KANAN (Aktivitas)
          ======================================================== */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2.3fr) minmax(310px, 1fr)', gap: '24px' }}>
        {/* KOLOM KIRI */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', minWidth: 0 }}>
          {/* Visualisasi 2 Panel: Bar Chart + Donut Chart */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            <div className="panel">
              <PreferenceBarChart results={sawResult?.results || []} />
            </div>
            <div className="panel">
              <CriteriaDonutChart kriteriaList={kriteriaList} />
            </div>
          </div>

          {/* Tabel Peringkat Kost Terbaik */}
          <div className="panel" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--pale-green)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Trophy size={18} color="var(--emerald-green)" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--forest-green)' }}>
                    Peringkat Kost Terbaik
                  </h3>
                  <span style={{ fontSize: '0.76rem', color: 'var(--muted-green)' }}>
                    Daftar rekomendasi berdasarkan perhitungan SAW terkini
                  </span>
                </div>
              </div>

              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setActivePage('hasil')}
                style={{ fontWeight: 600, color: 'var(--emerald-green)' }}
              >
                <span>Lihat Semua</span>
                <ArrowRight size={14} />
              </button>
            </div>

            {/* Tabel Ringkas Peringkat */}
            <div className="table-container">
              <table className="verdant-table">
                <thead>
                  <tr>
                    <th style={{ width: '60px' }}>Peringkat</th>
                    <th>Nama Kost</th>
                    <th>Alamat</th>
                    <th className="text-right">Harga / Bulan</th>
                    <th style={{ width: '160px' }}>Nilai Preferensi</th>
                    <th className="text-center" style={{ width: '100px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sawResult?.results && sawResult.results.length > 0 ? (
                    sawResult.results.slice(0, 5).map(item => {
                      const kost = item.kostData;
                      return (
                        <tr key={kost.id}>
                          <td>
                            {item.ranking === 1 ? (
                              <span className="badge badge-gold">#1</span>
                            ) : item.ranking === 2 ? (
                              <span className="badge badge-silver">#2</span>
                            ) : item.ranking === 3 ? (
                              <span className="badge badge-bronze">#3</span>
                            ) : (
                              <span style={{ fontWeight: 700, color: 'var(--muted-green)', paddingLeft: '8px' }}>
                                #{item.ranking}
                              </span>
                            )}
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <img
                                src={kost.foto}
                                alt={kost.nama}
                                style={{ width: '42px', height: '42px', borderRadius: '8px', objectFit: 'cover' }}
                              />
                              <div>
                                <div style={{ fontWeight: 700, color: 'var(--dark-green)' }}>
                                  {kost.nama}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--muted-green)' }}>
                                  {kost.tipeKamar} • Luas {kost.luasKamar} m²
                                </div>
                              </div>
                            </div>
                          </td>
                          <td style={{ fontSize: '0.82rem', color: 'var(--muted-green)', maxWidth: '200px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <MapPin size={13} style={{ flexShrink: 0 }} />
                              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {kost.alamat}
                              </span>
                            </div>
                          </td>
                          <td className="text-right" style={{ fontWeight: 700, color: 'var(--forest-green)', whiteSpace: 'nowrap' }}>
                            Rp {kost.harga.toLocaleString('id-ID')}/bln
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--forest-green)', minWidth: '42px' }}>
                                {item.skorAkhir.toFixed(3)}
                              </span>
                              <div
                                style={{
                                  flex: 1,
                                  height: '7px',
                                  backgroundColor: 'var(--pale-green)',
                                  borderRadius: 'var(--radius-pill)',
                                  overflow: 'hidden'
                                }}
                              >
                                <div
                                  style={{
                                    width: `${item.skorAkhir * 100}%`,
                                    height: '100%',
                                    backgroundColor: 'var(--emerald-green)',
                                    borderRadius: 'var(--radius-pill)'
                                  }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="text-center">
                            <span className={`badge ${kost.status === 'Tersedia' ? 'badge-available' : 'badge-full'}`}>
                              {kost.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center" style={{ padding: '30px', color: 'var(--muted-green)' }}>
                        Tidak ada data alternatif yang aktif untuk dinilai.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* KOLOM KANAN: Clock, Aktivitas, Action Box, & Riwayat */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* 1. Live Calendar & Clock Widget */}
          <div
            className="panel"
            style={{
              padding: '16px 20px',
              backgroundColor: 'var(--pale-green)',
              borderColor: 'var(--border-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Calendar size={18} color="var(--emerald-green)" />
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--forest-green)' }}>
                  {formatHariTanggal(currentTime)}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--muted-green)' }}>
                  Waktu Sistem Server
                </div>
              </div>
            </div>
            <div
              style={{
                fontFamily: 'monospace',
                fontSize: '0.95rem',
                fontWeight: 700,
                color: 'var(--forest-green)',
                backgroundColor: '#FFFFFF',
                padding: '4px 8px',
                borderRadius: '6px',
                border: '1px solid var(--border-light)'
              }}
            >
              {formatWaktu(currentTime)}
            </div>
          </div>

          {/* 2. Banner Interaktif: Proses Perhitungan SAW */}
          <div
            className="panel"
            style={{
              background: 'linear-gradient(135deg, var(--forest-green) 0%, #10382B 100%)',
              color: '#FFFFFF',
              padding: '24px',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Delicate Botanical Leaf Silhouettes in background */}
            <div
              style={{
                position: 'absolute',
                right: '-15px',
                bottom: '-20px',
                opacity: 0.15,
                pointerEvents: 'none'
              }}
            >
              <svg width="140" height="140" viewBox="0 0 100 100" fill="#FFFFFF">
                <path d="M10 80 Q 30 20, 90 10 Q 70 60, 10 80 Z" />
                <path d="M10 80 L 70 30" stroke="#FFFFFF" strokeWidth="2" fill="none" />
              </svg>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <RotateCw size={17} color="var(--mint-green)" className={isCalculating ? 'animate-spin' : ''} />
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFDF5' }}>
                Proses Perhitungan SAW
              </h4>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--sage-green)', lineHeight: 1.5, marginBottom: '18px' }}>
              Sistem siap melakukan kalkulasi pembobotan dan normalisasi dengan data alternatif serta bobot kriteria terbaru.
            </p>

            <button
              onClick={runCalculation}
              disabled={isCalculating}
              className="btn"
              style={{
                backgroundColor: 'var(--emerald-green)',
                color: '#FFFFFF',
                width: '100%',
                padding: '11px 18px',
                borderRadius: 'var(--radius-md)',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)',
                fontWeight: 700
              }}
            >
              {isCalculating ? (
                <>
                  <RotateCw size={16} className="animate-spin" />
                  <span>Mengkalkulasi SAW...</span>
                </>
              ) : (
                <>
                  <Play size={16} fill="#FFFFFF" />
                  <span>Mulai Perhitungan</span>
                </>
              )}
            </button>
          </div>

          {/* 3. Panel Aktivitas Terbaru */}
          <div className="panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={16} color="var(--emerald-green)" />
                <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--forest-green)' }}>
                  Aktivitas Terbaru
                </h4>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recentActivities.slice(0, 4).map(act => (
                <div
                  key={act.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    paddingBottom: '10px',
                    borderBottom: '1px solid var(--border-light)'
                  }}
                >
                  <div
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--pale-green)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px'
                    }}
                  >
                    <Check size={14} color="var(--emerald-green)" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--dark-green)', fontWeight: 500, lineHeight: 1.35 }}>
                      {act.pesan}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--muted-green)', marginTop: '2px' }}>
                      {new Date(act.waktu).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Panel Riwayat Perhitungan */}
          <div className="panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Layers size={16} color="var(--emerald-green)" />
                <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--forest-green)' }}>
                  Riwayat Perhitungan
                </h4>
              </div>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setActivePage('laporan')}
                style={{ fontSize: '0.74rem', color: 'var(--emerald-green)' }}
              >
                Lihat Semua &gt;
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {calculationHistory.slice(0, 3).map(hist => (
                <div
                  key={hist.id}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--warm-ivory)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--dark-green)' }}>
                      {new Date(hist.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })} - {new Date(hist.tanggal).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--muted-green)' }}>
                      {hist.totalAlternatif} Kost • Juara: {hist.juara1} ({hist.skorJuara1})
                    </div>
                  </div>
                  <span className="badge badge-benefit" style={{ fontSize: '0.7rem' }}>
                    {hist.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
