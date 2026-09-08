import { describe, expect, it } from 'vitest'
import { validatePlusMinusOne, validatePrediction, validateTricksSum } from './validation'

describe('validatePrediction', () => {
  it('returns no warning for a plausible prediction', () => {
    expect(validatePrediction(4, 5)).toBeNull() // round 5 has 6 cards
  })

  it('warns when the prediction exceeds the cards dealt this round', () => {
    const warning = validatePrediction(9, 8) // round 8 has 3 cards
    expect(warning?.code).toBe('predictionOutOfRange')
    expect(warning?.params).toEqual({ cards: 3 })
  })

  it('warns for a negative prediction', () => {
    expect(validatePrediction(-1, 1)?.code).toBe('predictionOutOfRange')
  })

  it('does not block - only returns a warning object', () => {
    const warning = validatePrediction(99, 1)
    expect(warning).not.toBeNull()
  })
})

describe('validateTricksSum', () => {
  it('returns no warning when tricks sum to the cards dealt', () => {
    expect(validateTricksSum([3, 2, 3], 3)).toBeNull() // round 3 has 8 cards, sum is 8
  })

  it('warns when the tricks sum does not match the cards dealt this round', () => {
    const warning = validateTricksSum([2, 1, 1], 5) // round 5 has 6 cards, sum is 4
    expect(warning?.code).toBe('tricksSumMismatch')
    expect(warning?.params).toEqual({ sum: 4, cards: 6 })
  })
})

describe('validatePlusMinusOne', () => {
  it('returns no warning when the prediction sum differs from the cards dealt', () => {
    expect(validatePlusMinusOne([2, 1, 1], 5)).toBeNull() // sum 4 != 6 cards
  })

  it('warns when the prediction sum equals the cards dealt this round', () => {
    const warning = validatePlusMinusOne([2, 2, 2], 5) // sum 6 == 6 cards
    expect(warning?.code).toBe('plusMinusOneViolation')
    expect(warning?.params).toEqual({ sum: 6, cards: 6 })
  })
})
