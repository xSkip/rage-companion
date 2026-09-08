import { getCardsForRound } from './scoring'

export interface ValidationWarning {
  code: 'predictionOutOfRange' | 'tricksSumMismatch' | 'plusMinusOneViolation'
  params: Record<string, number>
}

/**
 * All checks here are soft (non-blocking): the app is a companion, not a
 * referee. They return a warning (code + params, translated by the UI
 * layer), but never prevent saving.
 */

export function validatePrediction(prediction: number, round: number): ValidationWarning | null {
  const cards = getCardsForRound(round)
  if (prediction < 0 || prediction > cards) {
    return { code: 'predictionOutOfRange', params: { cards } }
  }
  return null
}

export function validateTricksSum(tricksWonByPlayer: number[], round: number): ValidationWarning | null {
  const cards = getCardsForRound(round)
  const sum = tricksWonByPlayer.reduce((a, b) => a + b, 0)
  if (sum !== cards) {
    return { code: 'tricksSumMismatch', params: { sum, cards } }
  }
  return null
}

/**
 * "Plus/Minus Eins" variant: the sum of predictions must NOT equal the
 * number of cards dealt this round. Only relevant when that variant is active.
 */
export function validatePlusMinusOne(predictions: number[], round: number): ValidationWarning | null {
  const cards = getCardsForRound(round)
  const sum = predictions.reduce((a, b) => a + b, 0)
  if (sum === cards) {
    return { code: 'plusMinusOneViolation', params: { sum, cards } }
  }
  return null
}
