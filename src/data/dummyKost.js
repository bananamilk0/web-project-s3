/**
 * src/data/dummyKost.js
 * Master Alternatif Data Kost (12 Kost Realistis)
 * Sesuai Mockup UI Kikost Verdant Living:
 * - 12 Total Data Kost
 * - 10 Kost Aktif (tersedia untuk perhitungan SAW)
 * - 2 Kost Nonaktif / Pemeliharaan
 */

export const INITIAL_KOST_DATA = [
  {
    id: 'kost-1',
    nama: 'Kost Harapan Indah',
    tipeKamar: 'Campur',
    alamat: 'Jl. Kaliurang KM 5.2 No. 12, Sleman',
    deskripsi: 'Kost modern dengan taman hijau asri di tengah bangunan. Ventilasi udara silang optimal, lingkungan kondusif untuk belajar dan istirahat.',
    foto: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
    fotoGaleri: [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80'
    ],
    status: 'Tersedia',
    aktif: true,
    // 6 Nilai Kriteria SAW
    harga: 1200000,          // C1 (Cost): Rp 1.200.000/bln
    fasilitasKamar: 4,       // C2 (Benefit): 1-5 (AC, kasur springbed, meja, lemari, KM dalam)
    kondisiKamar: 5,         // C3 (Benefit): 1-5 (Bangunan baru, sangat terawat & bersih)
    luasKamar: 16,           // C4 (Benefit): 16 m² (4x4 meter)
    jarakTujuan: 0.5,        // C5 (Cost): 0.5 km ke kampus utama
    fasilitasPendukung: 4,   // C6 (Benefit): 1-5 (WiFi 50 Mbps, parkir motor & mobil beratap, CCTV)
    fasilitasTags: ['AC', 'KM Dalam', 'WiFi Cepat', 'Parkir Mobil', 'Dapur Bersama'],
    kontak: '0812-3456-7801'
  },
  {
    id: 'kost-2',
    nama: 'Kost Melati Asri',
    tipeKamar: 'Putri',
    alamat: 'Jl. Agro Gg. Melati No. 8, Caturtunggal',
    deskripsi: 'Hunian nyaman khusus mahasiswi dengan pengawasan security 24 jam. Suasana tenang dengan pepohonan rindang dan kebun herbal santai.',
    foto: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    fotoGaleri: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1540518614846-7ede433c4ef0?auto=format&fit=crop&w=800&q=80'
    ],
    status: 'Tersedia',
    aktif: true,
    harga: 1350000,
    fasilitasKamar: 4,
    kondisiKamar: 4,
    luasKamar: 15,
    jarakTujuan: 0.4,
    fasilitasPendukung: 4,
    fasilitasTags: ['Khusus Putri', 'AC', 'KM Dalam', 'Security 24 Jam', 'WiFi FO'],
    kontak: '0813-2233-4412'
  },
  {
    id: 'kost-3',
    nama: 'Kost Sinar Residence',
    tipeKamar: 'Campur',
    alamat: 'Jl. Gejayan No. 3, Kota Depok, Sleman',
    deskripsi: 'Kost eksklusif bertema modern minimalis. Kamar mandi dalam dengan air hangat, akses kartu cerdas, dan area rooftop santai.',
    foto: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80',
    fotoGaleri: [
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80'
    ],
    status: 'Tersedia',
    aktif: true,
    harga: 1500000,
    fasilitasKamar: 5,
    kondisiKamar: 4,
    luasKamar: 18,
    jarakTujuan: 0.8,
    fasilitasPendukung: 4,
    fasilitasTags: ['Water Heater', 'Smart Lock', 'AC Daikin', 'Rooftop Lounge'],
    kontak: '0811-9876-5432'
  },
  {
    id: 'kost-4',
    nama: 'Kost Putri Ayu',
    tipeKamar: 'Putri',
    alamat: 'Jl. Kenanga No. 5, Pogung Lor, Sleman',
    deskripsi: 'Kost putri bersih terawat dengan suasana kekeluargaan yang ramah. Dekat pusat jajanan mahasiswa dan minimarket.',
    foto: 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=800&q=80',
    fotoGaleri: [
      'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=800&q=80'
    ],
    status: 'Penuh',
    aktif: true,
    harga: 1650000,
    fasilitasKamar: 4,
    kondisiKamar: 4,
    luasKamar: 14,
    jarakTujuan: 0.7,
    fasilitasPendukung: 3,
    fasilitasTags: ['Khusus Putri', 'AC', 'Springbed', 'Dapur'],
    kontak: '0857-1234-5678'
  },
  {
    id: 'kost-5',
    nama: 'Kost Dahlia Executive',
    tipeKamar: 'Campur',
    alamat: 'Jl. Dahlia No. 7, Sinduadi, Mlati',
    deskripsi: 'Hunian eksekutif semi-apartemen dengan fasilitas lengkap premium. Dikelilingi taman vertikal yang menyegarkan mata.',
    foto: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80',
    fotoGaleri: [
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80'
    ],
    status: 'Tersedia',
    aktif: true,
    harga: 1450000,
    fasilitasKamar: 4,
    kondisiKamar: 4,
    luasKamar: 16,
    jarakTujuan: 1.1,
    fasilitasPendukung: 4,
    fasilitasTags: ['AC', 'Balkon', 'Parkir Luas', 'Smart TV'],
    kontak: '0812-5566-7788'
  },
  {
    id: 'kost-6',
    nama: 'Emerald Residence Eksklusif',
    tipeKamar: 'Campur',
    alamat: 'Jl. Flamboyan No. 42, Caturtunggal, Depok',
    deskripsi: 'Coliving mewah bergaya Skandinavia tropis dengan kolam ikan dan tanaman hias rimbun. Kecepatan internet serat optik 100 Mbps.',
    foto: 'https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?auto=format&fit=crop&w=800&q=80',
    fotoGaleri: [
      'https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?auto=format&fit=crop&w=800&q=80'
    ],
    status: 'Tersedia',
    aktif: true,
    harga: 2100000,
    fasilitasKamar: 5,
    kondisiKamar: 5,
    luasKamar: 20,
    jarakTujuan: 1.2,
    fasilitasPendukung: 5,
    fasilitasTags: ['AC Inverter', 'Water Heater', 'Smart TV', 'Gym Mini', 'WiFi 100Mbps'],
    kontak: '0813-9876-5402'
  },
  {
    id: 'kost-7',
    nama: 'Kost Griya Asri Harmoni',
    tipeKamar: 'Putra',
    alamat: 'Jl. Kaliurang KM 4.5, Pandega Marta No. 18',
    deskripsi: 'Pilihan favorit mahasiswa teknik. Tenang, sejuk, bebas jam malam dengan kartu akses, dan dekat dengan berbagai rumah makan.',
    foto: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&w=800&q=80',
    fotoGaleri: [
      'https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&w=800&q=80'
    ],
    status: 'Tersedia',
    aktif: true,
    harga: 950000,
    fasilitasKamar: 3,
    kondisiKamar: 4,
    luasKamar: 12,
    jarakTujuan: 0.6,
    fasilitasPendukung: 4,
    fasilitasTags: ['Parkir Motor Beratap', 'WiFi 50Mbps', 'Dapur Bersama', 'CCTV'],
    kontak: '0812-3456-7801'
  },
  {
    id: 'kost-8',
    nama: 'Green Oasis Living',
    tipeKamar: 'Campur',
    alamat: 'Jl. Ring Road Utara No. 101, Condongcatur',
    deskripsi: 'Kost ramah lingkungan dengan konsep biophilic design. Pepohonan hijau di sekeliling kamar memberikan udara sejuk alami sepanjang hari.',
    foto: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80',
    fotoGaleri: [
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80'
    ],
    status: 'Tersedia',
    aktif: true,
    harga: 1750000,
    fasilitasKamar: 4,
    kondisiKamar: 5,
    luasKamar: 17,
    jarakTujuan: 1.0,
    fasilitasPendukung: 4,
    fasilitasTags: ['Taman Tropis', 'AC', 'KM Dalam', 'Balkon', 'WiFi FO'],
    kontak: '0812-4455-6608'
  },
  {
    id: 'kost-9',
    nama: 'Kost Putri Muslimah An-Nur',
    tipeKamar: 'Putri',
    alamat: 'Jl. Colombo Gg. Samirono No. 12, Depok',
    deskripsi: 'Kost putri syariah yang tertib dan nyaman. Hanya 3 menit jalan kaki ke perpustakaan kampus pusat. Mushola luas dan bersih.',
    foto: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    fotoGaleri: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'
    ],
    status: 'Tersedia',
    aktif: true,
    harga: 850000,
    fasilitasKamar: 3,
    kondisiKamar: 3,
    luasKamar: 10,
    jarakTujuan: 0.3,
    fasilitasPendukung: 3,
    fasilitasTags: ['Jalan Kaki ke Kampus', 'Mushola', 'Dapur Bersama', 'WiFi'],
    kontak: '0813-2233-4405'
  },
  {
    id: 'kost-10',
    nama: 'Urban Living Modern Coliving',
    tipeKamar: 'Campur',
    alamat: 'Jl. Monjali No. 78, Sariharjo, Ngaglik',
    deskripsi: 'Hunian komunal untuk mahasiswa dan profesional muda. Dilengkapi kafe mandiri, ruang kerja bersama, dan laundry koin gratis.',
    foto: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
    fotoGaleri: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'
    ],
    status: 'Tersedia',
    aktif: true,
    harga: 1600000,
    fasilitasKamar: 4,
    kondisiKamar: 5,
    luasKamar: 16,
    jarakTujuan: 1.8,
    fasilitasPendukung: 5,
    fasilitasTags: ['Coworking Space', 'WiFi 100Mbps', 'Laundry Mandiri', 'AC'],
    kontak: '0812-7766-5506'
  },
  {
    id: 'kost-11',
    nama: 'Kost Barokah Mandiri Hemat',
    tipeKamar: 'Putra',
    alamat: 'Jl. Pogung Kidul No. 15, Sleman',
    deskripsi: 'Pilihan hemat untuk mahasiswa berbudget efisien. Bersih, lingkungan guyub, dekat minimarket dan fotokopi 24 jam.',
    foto: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=800&q=80',
    fotoGaleri: [
      'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=800&q=80'
    ],
    status: 'Penuh',
    aktif: false, // Tidak aktif untuk evaluasi SPK saat ini
    harga: 650000,
    fasilitasKamar: 2,
    kondisiKamar: 3,
    luasKamar: 9,
    jarakTujuan: 1.0,
    fasilitasPendukung: 2,
    fasilitasTags: ['Harga Terjangkau', 'Parkir Motor', 'Dekat Warung'],
    kontak: '0815-6677-8807'
  },
  {
    id: 'kost-12',
    nama: 'Kost Cemara Hijau',
    tipeKamar: 'Putri',
    alamat: 'Jl. Kaliurang KM 6 No. 22, Condongcatur',
    deskripsi: 'Kost putri suasana taman asri sedang dalam tahap peremajaan interior dan pengecatan ulang.',
    foto: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80',
    fotoGaleri: [
      'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80'
    ],
    status: 'Penuh',
    aktif: false, // Tidak aktif (sedang renovasi)
    harga: 1100000,
    fasilitasKamar: 3,
    kondisiKamar: 3,
    luasKamar: 12,
    jarakTujuan: 1.4,
    fasilitasPendukung: 3,
    fasilitasTags: ['Renovasi', 'WiFi', 'Parkir Motor'],
    kontak: '0812-3344-5566'
  }
];
