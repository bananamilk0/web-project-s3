// src/data/kriteriaConfig.js
// Konfigurasi 8 Kriteria Standar SPK Pemilihan Kost Terbaik (Metode SAW)
// Sesuai Spesifikasi: C1-C8

export const KRITERIA_KEYS = {
  C1: 'harga',
  C2: 'fasilitasKamar',
  C3: 'kondisiKamar',
  C4: 'jarakTujuan',
  C5: 'luasKamar',
  C6: 'fasilitasPendukung',
  C7: 'keamanan',
  C8: 'sanitasi',
};

export const DEFAULT_KRITERIA = [
  {
    id: 'C1',
    kode: 'C1',
    key: 'harga',
    nama: 'Harga Sewa per Bulan',
    tipe: 'cost',
    bobot: 0.20,
    satuan: 'Rp/bln',
    deskripsi: 'Biaya sewa kamar per bulan. Semakin terjangkau harga sewa, semakin tinggi preferensinya.',
    isSkalaLikert: false,
    minVal: 300000,
    maxVal: 5000000,
    rubrik: {
      keterangan: 'Nilai numerik riil sewa per bulan (contoh: Rp 500.000 s/d Rp 3.000.000).'
    }
  },
  {
    id: 'C2',
    kode: 'C2',
    key: 'fasilitasKamar',
    nama: 'Kelengkapan Fasilitas Kamar',
    tipe: 'benefit',
    bobot: 0.15,
    satuan: 'Skala 1-5',
    deskripsi: 'Kelengkapan perabot dan sarana privat di dalam kamar tidur.',
    isSkalaLikert: true,
    minVal: 1,
    maxVal: 5,
    rubrik: {
      1: 'Sangat minim (hanya kasur lantai tanpa lemari)',
      2: 'Kurang lengkap (kasur busa standar + lemari pakaian kecil)',
      3: 'Cukup lengkap (kasur springbed, lemari baju, meja kerja, kipas angin)',
      4: 'Lengkap (springbed nyaman, AC, meja kursi kerja, lemari besar, KM dalam)',
      5: 'Sangat lengkap (AC, water heater, smart TV, KM dalam shower, balkon pribadi)'
    }
  },
  {
    id: 'C3',
    kode: 'C3',
    key: 'kondisiKamar',
    nama: 'Kondisi Kamar',
    tipe: 'benefit',
    bobot: 0.15,
    satuan: 'Skala 1-5',
    deskripsi: 'Kebersihan fisik, pencahayaan alami, sirkulasi udara, dan kebaruan bangunan.',
    isSkalaLikert: true,
    minVal: 1,
    maxVal: 5,
    rubrik: {
      1: 'Sangat buruk (lembab, dinding berjamur/retak, minim ventilasi)',
      2: 'Kurang baik (ventilasi sempit, pencahayaan redup, terasa pengap)',
      3: 'Cukup baik (bersih, sirkulasi udara standar, dinding terawat)',
      4: 'Baik (bangunan baru/terawat, ventilasi segar, jendela besar, terang alami)',
      5: 'Sangat baik (estetik modern, sirkulasi silang optimal, bebas debu & bau)'
    }
  },
  {
    id: 'C4',
    kode: 'C4',
    key: 'jarakTujuan',
    nama: 'Jarak ke Lokasi Tujuan',
    tipe: 'cost',
    bobot: 0.12,
    satuan: 'km',
    deskripsi: 'Jarak fisik dari lokasi kost ke kampus/tempat kerja. Semakin dekat semakin baik.',
    isSkalaLikert: false,
    minVal: 0.1,
    maxVal: 20.0,
    rubrik: {
      keterangan: 'Jarak fisik riil dalam kilometer (contoh: 0.3 km hingga 10 km). Semakin dekat semakin baik.'
    }
  },
  {
    id: 'C5',
    kode: 'C5',
    key: 'luasKamar',
    nama: 'Luas Kamar',
    tipe: 'benefit',
    bobot: 0.08,
    satuan: 'm²',
    deskripsi: 'Dimensi luas area lantai kamar tidur dalam satuan meter persegi (m²).',
    isSkalaLikert: false,
    minVal: 6,
    maxVal: 50,
    rubrik: {
      keterangan: 'Nilai numerik riil luas kamar dalam m² (contoh: 9 m² hingga 30 m²).'
    }
  },
  {
    id: 'C6',
    kode: 'C6',
    key: 'fasilitasPendukung',
    nama: 'Fasilitas Pendukung',
    tipe: 'benefit',
    bobot: 0.10,
    satuan: 'Skala 1-5',
    deskripsi: 'Fasilitas komunal di luar kamar (WiFi, parkir, keamanan, dapur, laundry).',
    isSkalaLikert: true,
    minVal: 1,
    maxVal: 5,
    rubrik: {
      1: 'Sangat minim (tidak ada akses internet WiFi, parkir motor sempit terbuka)',
      2: 'Kurang lengkap (parkir motor ada, tanpa WiFi dan tanpa dapur bersama)',
      3: 'Cukup lengkap (WiFi 20 Mbps, parkir motor beratap, dapur bersama standar)',
      4: 'Lengkap (WiFi kencang 50 Mbps, parkir motor & mobil aman, dapur, CCTV 24 jam)',
      5: 'Sangat lengkap (WiFi FO high-speed 100 Mbps, security 24/7, lounge, mesin cuci)'
    }
  },
  {
    id: 'C7',
    kode: 'C7',
    key: 'keamanan',
    nama: 'Keamanan Lingkungan',
    tipe: 'benefit',
    bobot: 0.10,
    satuan: 'Skala 1-5',
    deskripsi: 'Tingkat keamanan lingkungan kost (satpam, CCTV, pagar, sistem akses).',
    isSkalaLikert: true,
    minVal: 1,
    maxVal: 5,
    rubrik: {
      1: 'Sangat tidak aman (tanpa pagar, tanpa satpam, bebas keluar masuk)',
      2: 'Kurang aman (pagar ada tapi tanpa kunci/satpam resmi)',
      3: 'Cukup aman (pagar terkunci, ada petugas jaga siang)',
      4: 'Aman (satpam 24 jam, CCTV, akses dengan kunci/kartu)',
      5: 'Sangat aman (satpam 24 jam, CCTV lengkap, intercom, akses fingerprint)'
    }
  },
  {
    id: 'C8',
    kode: 'C8',
    key: 'sanitasi',
    nama: 'Ketersediaan Air Bersih & Sanitasi',
    tipe: 'benefit',
    bobot: 0.10,
    satuan: 'Skala 1-5',
    deskripsi: 'Ketersediaan air bersih, kondisi kamar mandi, dan sanitasi lingkungan kost.',
    isSkalaLikert: true,
    minVal: 1,
    maxVal: 5,
    rubrik: {
      1: 'Sangat buruk (air sering mati berhari-hari, kamar mandi sangat kotor)',
      2: 'Kurang baik (air kadang mati, kamar mandi kurang terawat)',
      3: 'Cukup baik (air mengalir lancar, kamar mandi bersih cukup)',
      4: 'Baik (air tersedia 24 jam, kamar mandi bersih & terawat baik)',
      5: 'Sangat baik (air panas/dingin tersedia, kamar mandi modern & higienis)'
    }
  }
];

export const DEFAULT_KRITERIA_VERSIONS = [
  {
    id: 'ver-1',
    namaVersi: 'Versi 1.0 (Standar Akademik)',
    tanggal: '2026-10-28T10:00:00Z',
    catatan: 'Konfigurasi bobot kriteria resmi — 8 kriteria SAW',
    bobotSnapshot: {
      C1: 0.20,
      C2: 0.15,
      C3: 0.15,
      C4: 0.12,
      C5: 0.08,
      C6: 0.10,
      C7: 0.10,
      C8: 0.10,
    },
    totalBobot: 1.00
  }
];

/**
 * Validasi total bobot kriteria harus tepat 1.0
 * @param {Array} kriteriaList
 * @returns {{ isValid: boolean, totalBobot: number, selisih: number, persentase: number }}
 */
export function validateTotalBobot(kriteriaList = DEFAULT_KRITERIA) {
  const total = kriteriaList.reduce((acc, curr) => acc + Number(curr.bobot || curr.weight || 0), 0);
  const roundedTotal = Math.round(total * 10000) / 10000;
  const isValid = Math.abs(roundedTotal - 1.0) < 0.0001;
  const persentase = Math.round(roundedTotal * 100);
  return {
    isValid,
    totalBobot: roundedTotal,
    persentase,
    selisih: Math.round((1.0 - roundedTotal) * 10000) / 10000
  };
}
