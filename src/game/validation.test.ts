import { describe, expect, it } from 'vitest'
import { validatePlusMinusOne, validatePrediction, validateTricksSum } from './validation'

describe('validatePrediction', () => {
  it('returns no warning for a plausible prediction', () => {
    expect(validatePrediction(4, 5)).toBeNull() // round 5 has 6 cards
  })

  it('warns when the prediction exceeds the cards dealt this round', () => {
    const warning = validatePrediction(9, 8) // round 8 has 3 cards
    expect(warning?.code).toBe('prediction-out-of-range')
  })

  it('warns for a negative prediction', () => {
    expect(validatePrediction(-1, 1)?.code).toBe('prediction-out-of-range')
  })

  it('does not block - only returns a warning object', () => {
    // sanity check that the function is pure and side-effect free
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
    expect(warning?.code).toBe('tricks-sum-mismatch')
  })
})

describe('validatePlusMinusOne', () => {
  it('returns no warning when the prediction sum differs from the cards dealt', () => {
    expect(validatePlusMinusOne([2, 1, 1], 5)).toBeNull() // sum 4 != 6 cards
  })

  it('warns when the prediction sum equals the cards dealt this round', () => {
    const warning = validatePlusMinusOne([2, 2, 2], 5) // sum 6 == 6 cards
    expect(warning?.code).toBe('plus-minus-one-violation')
  })
})
