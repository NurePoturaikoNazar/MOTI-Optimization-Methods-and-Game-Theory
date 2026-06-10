/**
 * gameTheory.js
 * Pure functions for zero-sum game theory calculations.
 */

/**
 * Find maximin (alpha): max of row minimums.
 * @param {number[][]} matrix
 * @returns {{ alpha: number, rowIndex: number, rowMins: number[] }}
 */
export function findMaximin(matrix) {
  const rowMins = matrix.map(row => Math.min(...row))
  const alpha = Math.max(...rowMins)
  const rowIndex = rowMins.indexOf(alpha)
  return { alpha, rowIndex, rowMins }
}

/**
 * Find minimax (beta): min of column maximums.
 * @param {number[][]} matrix
 * @returns {{ beta: number, colIndex: number, colMaxes: number[] }}
 */
export function findMinimax(matrix) {
  const rows = matrix.length
  const cols = matrix[0].length
  const colMaxes = []
  for (let c = 0; c < cols; c++) {
    let max = -Infinity
    for (let r = 0; r < rows; r++) {
      if (matrix[r][c] > max) max = matrix[r][c]
    }
    colMaxes.push(max)
  }
  const beta = Math.min(...colMaxes)
  const colIndex = colMaxes.indexOf(beta)
  return { beta, colIndex, colMaxes }
}

/**
 * Check for a saddle point: cell where alpha == beta.
 * @param {number[][]} matrix
 * @returns {{ found: boolean, row: number, col: number, value: number } | { found: false }}
 */
export function findSaddlePoint(matrix) {
  const { rowMins } = findMaximin(matrix)
  const { colMaxes } = findMinimax(matrix)
  for (let r = 0; r < matrix.length; r++) {
    for (let c = 0; c < matrix[0].length; c++) {
      if (matrix[r][c] === rowMins[r] && matrix[r][c] === colMaxes[c]) {
        return { found: true, row: r, col: c, value: matrix[r][c] }
      }
    }
  }
  return { found: false, row: -1, col: -1, value: null }
}

/**
 * Remove dominated strategies.
 * Row i dominates row j if matrix[i][c] >= matrix[j][c] for all c.
 * Col c dominates col d if matrix[r][c] <= matrix[r][d] for all r.
 * Returns reduced matrix + kept indices.
 * @param {number[][]} matrix
 * @param {string[]} rowLabels
 * @param {string[]} colLabels
 * @returns {{ reducedMatrix, keptRows, keptCols, eliminatedRows, eliminatedCols }}
 */
export function eliminateDominated(matrix, rowLabels, colLabels) {
  let keptRows = matrix.map((_, i) => i)
  let keptCols = matrix[0].map((_, i) => i)

  let changed = true
  while (changed) {
    changed = false

    // Eliminate dominated rows (row j dominated by row i if all cells of i >= j)
    const nextRows = []
    for (let j of keptRows) {
      let dominated = false
      for (let i of keptRows) {
        if (i === j) continue
        if (keptCols.every(c => matrix[i][c] >= matrix[j][c])) {
          dominated = true
          break
        }
      }
      if (!dominated) nextRows.push(j)
      else changed = true
    }
    keptRows = nextRows

    // Eliminate dominated cols (col d dominated by col c if all cells of c <= d for minimizer)
    const nextCols = []
    for (let d of keptCols) {
      let dominated = false
      for (let c of keptCols) {
        if (c === d) continue
        if (keptRows.every(r => matrix[r][c] <= matrix[r][d])) {
          dominated = true
          break
        }
      }
      if (!dominated) nextCols.push(d)
      else changed = true
    }
    keptCols = nextCols
  }

  const reducedMatrix = keptRows.map(r => keptCols.map(c => matrix[r][c]))
  const eliminatedRows = matrix.map((_, i) => i).filter(i => !keptRows.includes(i))
  const eliminatedCols = matrix[0].map((_, i) => i).filter(i => !keptCols.includes(i))

  return {
    reducedMatrix,
    keptRows,
    keptCols,
    eliminatedRows,
    eliminatedCols,
    keptRowLabels: keptRows.map(i => rowLabels[i]),
    keptColLabels: keptCols.map(i => colLabels[i]),
  }
}

/**
 * Solve a 2x2 zero-sum game for mixed strategies.
 * Formula: p = (d - c) / (a - b - c + d)  for row player
 * @param {number[][]} m2x2 — 2x2 matrix [[a,b],[c,d]]
 * @returns {{ p1: number, p2: number, q1: number, q2: number, value: number }}
 */
export function solveMixed2x2(m2x2) {
  const a = m2x2[0][0], b = m2x2[0][1]
  const c = m2x2[1][0], d = m2x2[1][1]
  const denom = a - b - c + d
  if (Math.abs(denom) < 1e-10) return null

  const p1 = (d - c) / denom  // prob of row 1
  const p2 = 1 - p1
  const q1 = (d - b) / denom  // prob of col 1
  const q2 = 1 - q1
  const value = (a * d - b * c) / denom

  return {
    p1: Math.round(p1 * 1000) / 1000,
    p2: Math.round(p2 * 1000) / 1000,
    q1: Math.round(q1 * 1000) / 1000,
    q2: Math.round(q2 * 1000) / 1000,
    value: Math.round(value * 1000) / 1000,
  }
}

/**
 * Find the best 2x2 submatrix from a reduced matrix for mixed strategy calculation.
 * Picks the pair with valid probability values (both in [0,1]).
 * @param {number[][]} reducedMatrix
 * @param {number[]} keptRows - original row indices
 * @param {number[]} keptCols - original col indices
 * @param {string[]} rowLabels
 * @param {string[]} colLabels
 * @returns mixed strategy result or null
 */
function findBest2x2Mixed(reducedMatrix, keptRows, keptCols, rowLabels, colLabels) {
  const R = reducedMatrix.length
  const C = reducedMatrix[0].length
  // Try all 2x2 submatrices
  for (let r1 = 0; r1 < R; r1++) {
    for (let r2 = r1 + 1; r2 < R; r2++) {
      for (let c1 = 0; c1 < C; c1++) {
        for (let c2 = c1 + 1; c2 < C; c2++) {
          const sub = [
            [reducedMatrix[r1][c1], reducedMatrix[r1][c2]],
            [reducedMatrix[r2][c1], reducedMatrix[r2][c2]],
          ]
          const result = solveMixed2x2(sub)
          if (result && result.p1 >= 0 && result.p1 <= 1 && result.q1 >= 0 && result.q1 <= 1) {
            return {
              ...result,
              rowLabels: [rowLabels[keptRows[r1]], rowLabels[keptRows[r2]]],
              colLabels: [colLabels[keptCols[c1]], colLabels[keptCols[c2]]],
              sub2x2: sub,
              subKeptRows: [keptRows[r1], keptRows[r2]],
              subKeptCols: [keptCols[c1], keptCols[c2]],
            }
          }
        }
      }
    }
  }
  return null
}

/**
 * Full mixed strategy solver: eliminates dominated strategies,
 * then solves the reduced matrix (2x2 case shown in report).
 * @param {number[][]} matrix
 * @param {string[]} rowLabels
 * @param {string[]} colLabels
 * @returns full calculation result
 */
export function solveMixedStrategies(matrix, rowLabels, colLabels) {
  const reduction = eliminateDominated(matrix, rowLabels, colLabels)
  const { reducedMatrix, keptRows, keptCols } = reduction

  let mixed = null
  if (reducedMatrix.length === 2 && reducedMatrix[0].length === 2) {
    const result = solveMixed2x2(reducedMatrix)
    if (result) {
      mixed = {
        ...result,
        rowLabels: keptRows.map(i => rowLabels[i]),
        colLabels: keptCols.map(i => colLabels[i]),
        sub2x2: reducedMatrix,
        subKeptRows: keptRows,
        subKeptCols: keptCols,
      }
    }
  } else if (reducedMatrix.length >= 2 && reducedMatrix[0].length >= 2) {
    // Try to find best 2x2 submatrix
    mixed = findBest2x2Mixed(reducedMatrix, keptRows, keptCols, rowLabels, colLabels)
    if (mixed) {
      // Update reduction to reflect the actual 2x2 used
      reduction.finalRows = mixed.subKeptRows
      reduction.finalCols = mixed.subKeptCols
      reduction.final2x2 = mixed.sub2x2
      reduction.finalRowLabels = mixed.rowLabels
      reduction.finalColLabels = mixed.colLabels
    }
  }

  return {
    reduction,
    mixed,
  }
}

/**
 * Enemy random move (uniform distribution).
 * @param {number} n — number of columns
 * @returns {number} column index
 */
export function enemyRandomMove(n) {
  return Math.floor(Math.random() * n)
}
