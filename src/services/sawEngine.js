/**
 * src/services/sawEngine.js
 * Engine Matematis Perhitungan SPK Metode SAW (Simple Additive Weighting)
 * 
 * Tahapan Perhitungan:
 * 1. Pembentukan Matriks Keputusan X (Alternatif Aktif × Kriteria)
 * 2. Ekstraksi Nilai Ekstrem Max(Xj) & Min(Xj)
 * 3. Normalisasi Matriks R:
 *    - Kriteria Benefit : r_ij = x_ij / max(x_j)
 *    - Kriteria Cost    : r_ij = min(x_j) / x_ij
 * 4. Pembobotan & Perhitungan Nilai Preferensi V_i:
 *    - V_i = SUM( w_j * r_ij )
 * 5. Pemeringkatan Alternatif (Descending)
 */

import { validateTotalBobot } from '../data/kriteriaConfig.js';

/**
 * Membentuk Matriks Keputusan X dari daftar kost aktif
 */
export function buildDecisionMatrix(kostList = [], kriteriaList = []) {
  // Hanya proses alternatif yang aktif
  const activeKost = kostList.filter(k => k.aktif === true);

  const matrixX = {};

  activeKost.forEach(kost => {
    matrixX[kost.id] = {};
    kriteriaList.forEach(crit => {
      const rawVal = kost[crit.key];
      const numVal = Number(rawVal);
      matrixX[kost.id][crit.kode] = isNaN(numVal) ? 0 : numVal;
    });
  });

  return {
    activeKost,
    matrixX
  };
}

/**
 * Mengekstrak nilai Max(X_j) dan Min(X_j) untuk setiap kriteria
 */
export function extractMinMax(activeKost = [], matrixX = {}, kriteriaList = []) {
  const minMax = {};

  kriteriaList.forEach(crit => {
    const kode = crit.kode;
    const values = activeKost.map(kost => matrixX[kost.id]?.[kode] ?? 0);

    if (values.length === 0) {
      minMax[kode] = { min: 0, max: 0, values: [] };
      return;
    }

    const maxVal = Math.max(...values);
    const minVal = Math.min(...values);

    minMax[kode] = {
      min: minVal,
      max: maxVal,
      values
    };
  });

  return minMax;
}

/**
 * Melakukan normalisasi matriks X menjadi matriks R dengan proteksi division by zero
 */
export function normalizeMatrix(activeKost = [], matrixX = {}, minMax = {}, kriteriaList = []) {
  const matrixR = {};

  activeKost.forEach(kost => {
    matrixR[kost.id] = {};

    kriteriaList.forEach(crit => {
      const kode = crit.kode;
      const x_ij = matrixX[kost.id]?.[kode] ?? 0;
      const { min: min_j, max: max_j } = minMax[kode] || { min: 0, max: 0 };
      let r_ij = 0;

      if (crit.tipe === 'benefit') {
        // Benefit: x_ij / max(x_j)
        r_ij = max_j > 0 ? (x_ij / max_j) : 0;
      } else if (crit.tipe === 'cost') {
        // Cost: min(x_j) / x_ij
        const safe_x_ij = x_ij <= 0 ? 0.0001 : x_ij;
        r_ij = min_j > 0 ? (min_j / safe_x_ij) : 0;
      }

      if (isNaN(r_ij) || !isFinite(r_ij)) {
        r_ij = 0;
      }

      matrixR[kost.id][kode] = r_ij;
    });
  });

  return matrixR;
}

/**
 * Menghitung matriks terbobot W × R dan nilai preferensi akhir V_i
 */
export function calculatePreference(activeKost = [], matrixR = {}, matrixX = {}, kriteriaList = []) {
  const weightMap = {};
  kriteriaList.forEach(crit => {
    weightMap[crit.kode] = Number(crit.bobot || 0);
  });

  const preferences = activeKost.map(kost => {
    let V_i = 0;
    const rincianPerhitungan = [];
    const nilaiNormalisasi = {};
    const nilaiAsli = {};
    const nilaiTerbobot = {};

    kriteriaList.forEach(crit => {
      const kode = crit.kode;
      const r_ij = matrixR[kost.id]?.[kode] ?? 0;
      const x_ij = matrixX[kost.id]?.[kode] ?? 0;
      const w_j = weightMap[kode] ?? 0;
      const kontribusi = w_j * r_ij;

      V_i += kontribusi;

      nilaiNormalisasi[kode] = r_ij;
      nilaiAsli[kode] = x_ij;
      nilaiTerbobot[kode] = kontribusi;

      rincianPerhitungan.push({
        kriteriaKode: kode,
        kriteriaNama: crit.nama,
        tipe: crit.tipe,
        nilaiAsli: x_ij,
        satuan: crit.satuan,
        r_ij: Number(r_ij.toFixed(4)),
        w_j,
        kontribusi: Number(kontribusi.toFixed(4)),
        formulaDisplay: crit.tipe === 'benefit'
          ? `${x_ij} / ${matrixR.maxVal || 'Max'} = ${r_ij.toFixed(4)} × ${w_j} = ${kontribusi.toFixed(4)}`
          : `${matrixR.minVal || 'Min'} / ${x_ij} = ${r_ij.toFixed(4)} × ${w_j} = ${kontribusi.toFixed(4)}`
      });
    });

    return {
      kostId: kost.id,
      kostData: kost,
      skorAkhir: Number(V_i.toFixed(4)),
      skorAkhirRaw: V_i,
      nilaiNormalisasi,
      nilaiAsli,
      nilaiTerbobot,
      rincianPerhitungan
    };
  });

  return preferences;
}

/**
 * Mengurutkan hasil alternatif secara descending
 */
export function rankAlternatives(preferences = []) {
  const sorted = [...preferences].sort((a, b) => b.skorAkhirRaw - a.skorAkhirRaw);

  return sorted.map((item, index) => {
    // Hitung kontribusi relatif kriteria terhadap skor akhir
    const kontribusiPersen = {};
    item.rincianPerhitungan.forEach(r => {
      const pct = item.skorAkhirRaw > 0 ? (r.kontribusi / item.skorAkhirRaw) * 100 : 0;
      kontribusiPersen[r.kriteriaKode] = Math.round(pct * 10) / 10;
    });

    return {
      ...item,
      ranking: index + 1,
      kontribusiPersen,
      isTop3: index < 3,
      badgeTier: index === 0 ? 'Peringkat #1 (Rekomendasi Utama)' :
                 index === 1 ? 'Peringkat #2 (Unggulan)' :
                 index === 2 ? 'Peringkat #3 (Pilihan Alternatif)' :
                 `Peringkat #${index + 1}`
    };
  });
}

/**
 * Pipeline Lengkap SAW Engine
 */
export function computeSAW(kostList = [], kriteriaList = []) {
  const bobotValidation = validateTotalBobot(kriteriaList);
  const { activeKost, matrixX } = buildDecisionMatrix(kostList, kriteriaList);

  if (activeKost.length === 0) {
    return {
      isValid: false,
      isWeightValid: bobotValidation.isValid,
      totalBobot: bobotValidation.totalBobot,
      errorMessage: 'Tidak ada alternatif kost aktif yang dapat dievaluasi.',
      activeKostCount: 0,
      matrixX: {},
      minMax: {},
      matrixR: {},
      weightsW: {},
      results: []
    };
  }

  const minMax = extractMinMax(activeKost, matrixX, kriteriaList);
  const matrixR = normalizeMatrix(activeKost, matrixX, minMax, kriteriaList);
  const preferences = calculatePreference(activeKost, matrixR, matrixX, kriteriaList);
  const rankedResults = rankAlternatives(preferences);

  const weightsW = {};
  kriteriaList.forEach(c => {
    weightsW[c.kode] = c.bobot;
  });

  return {
    isValid: bobotValidation.isValid,
    isWeightValid: bobotValidation.isValid,
    totalBobot: bobotValidation.totalBobot,
    errorMessage: bobotValidation.isValid ? null : `Total bobot saat ini ${(bobotValidation.totalBobot * 100).toFixed(0)}%. Wajib genap 100% agar perhitungan sah.`,
    activeKostCount: activeKost.length,
    totalKostCount: kostList.length,
    matrixX,
    minMax,
    matrixR,
    weightsW,
    kriteriaList,
    results: rankedResults
  };
}
