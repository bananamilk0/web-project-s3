// src/utils/sawEngine.js
// Pure SAW Algorithm — Single source of truth
// Formula:
//   Normalisasi Benefit: r_ij = x_ij / max(x_j)
//   Normalisasi Cost:    r_ij = min(x_j) / x_ij
//   Preferensi:          V_i  = Σ(w_j × r_ij)
//   Ranking:             sort V_i descending

/**
 * Build the decision matrix from alternatives and criteria
 * @param {Array} alternatives - Array of kost objects
 * @param {Array} criteria - Array of criteria objects
 * @returns {Array<Array<number>>} 2D matrix [alternative][criterion]
 */
const buildDecisionMatrix = (alternatives, criteria) => {
  return alternatives.map((alt) =>
    criteria.map((crit) => Number(alt[crit.key]) || 0)
  );
};

/**
 * Normalize the decision matrix using SAW formula
 * @param {Array<Array<number>>} matrix - Decision matrix
 * @param {Array} criteria - Criteria with type 'benefit' | 'cost'
 * @returns {Array<Array<number>>} Normalized matrix
 */
const normalize = (matrix, criteria) => {
  const numCriteria = criteria.length;
  const numAlts = matrix.length;

  // Get column max and min values
  const colStats = criteria.map((crit, j) => {
    const colValues = matrix.map((row) => row[j]);
    return {
      max: Math.max(...colValues),
      min: Math.min(...colValues),
    };
  });

  // Normalize each cell
  return matrix.map((row) =>
    row.map((value, j) => {
      const { max, min } = colStats[j];
      const type = criteria[j].type;

      if (type === 'benefit') {
        return max === 0 ? 0 : value / max;
      } else {
        // cost
        return value === 0 ? 0 : min / value;
      }
    })
  );
};

/**
 * Calculate preference scores V_i = Σ(w_j × r_ij)
 * @param {Array<Array<number>>} normalMatrix - Normalized matrix
 * @param {Array} criteria - Criteria with weight property
 * @returns {Array<number>} Preference scores
 */
const preference = (normalMatrix, criteria) => {
  return normalMatrix.map((row) =>
    row.reduce((sum, r_ij, j) => sum + criteria[j].weight * r_ij, 0)
  );
};

/**
 * Rank alternatives by preference score (descending)
 * @param {Array} alternatives
 * @param {Array<number>} preferences
 * @returns {Array} Ranked alternatives with rank and score
 */
const rank = (alternatives, preferences) => {
  const withScores = alternatives.map((alt, i) => ({
    ...alt,
    score: preferences[i],
    scorePercent: (preferences[i] * 100).toFixed(2),
  }));

  return withScores
    .sort((a, b) => b.score - a.score)
    .map((alt, i) => ({ ...alt, rank: i + 1 }));
};

/**
 * Master compute function — returns all step data
 * @param {Array} alternatives - Array of kost objects
 * @param {Array} criteria - Array of criteria objects
 * @returns {{ decisionMatrix, normalMatrix, colStats, preferences, ranked }}
 */
const compute = (alternatives, criteria) => {
  if (!alternatives.length || !criteria.length) {
    return {
      decisionMatrix: [],
      normalMatrix: [],
      colStats: [],
      preferences: [],
      ranked: [],
    };
  }

  const decisionMatrix = buildDecisionMatrix(alternatives, criteria);

  // Compute column stats for display
  const colStats = criteria.map((crit, j) => {
    const colValues = decisionMatrix.map((row) => row[j]);
    return {
      max: Math.max(...colValues),
      min: Math.min(...colValues),
    };
  });

  const normalMatrix = normalize(decisionMatrix, criteria);
  const preferences = preference(normalMatrix, criteria);
  const ranked = rank(alternatives, preferences);

  return {
    decisionMatrix,
    normalMatrix,
    colStats,
    preferences,
    ranked,
  };
};

/**
 * Format currency Rupiah
 */
const formatRupiah = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);
};

/**
 * Format number with fixed decimals
 */
const formatScore = (value, decimals = 4) => {
  return Number(value).toFixed(decimals);
};

const sawEngine = {
  buildDecisionMatrix,
  normalize,
  preference,
  rank,
  compute,
  formatRupiah,
  formatScore,
};

export default sawEngine;
