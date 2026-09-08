import { getCardsForRound } from './scoring'

export interface ValidationWarning {
  code: string
  message: string
}

/**
 * All checks here are soft (non-blocking): the app is a companion, not a
 * referee. They return a warning to display, but never prevent saving.
 */

export function validatePrediction(prediction: number, round: number): ValidationWarning | null {
  const cards = getCardsForRound(round)
  if (prediction < 0 || prediction > cards) {
    return {
      code: 'prediction-out-of-range',
      message: `Vorhersage sollte zwischen 0 und ${cards} liegen (${cards} Karten in dieser Runde).`,
    }
  }
  return null
}

export function validateTricksSum(tricksWonByPlayer: number[], round: number): ValidationWarning | null {
  const cards = getCardsForRound(round)
  const sum = tricksWonByPlayer.reduce((a, b) => a + b, 0)
  if (sum !== cards) {
    return {
      code: 'tricks-sum-mismatch',
      message: `Die Summe der gewonnenen Stiche (${sum}) entspricht nicht der Kartenanzahl dieser Runde (${cards}).`,
    }
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
    return {
      code: 'plus-minus-one-violation',
      message: `Bei aktivierter Variante "Plus/Minus Eins" darf die Summe der Vorhersagen (${sum}) nicht der Kartenanzahl (${cards}) entsprechen.`,
    }
  }
  return null
}
