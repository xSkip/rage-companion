import { describe, expect, it } from 'vitest'
import { calculateRoundScore, determineWinners, getCardsForRound } from './scoring'

describe('getCardsForRound', () => {
  it('returns 10 cards in round 1 and 1 card in round 10', () => {
    expect(getCardsForRound(1)).toBe(10)
    expect(getCardsForRound(10)).toBe(1)
  })

  it('decreases by one card per round', () => {
    expect(getCardsForRound(5)).toBe(6)
    expect(getCardsForRound(9)).toBe(2)
  })

  it('throws for rounds outside 1-10', () => {
    expect(() => getCardsForRound(0)).toThrow()
    expect(() => getCardsForRound(11)).toThrow()
  })
})

describe('calculateRoundScore', () => {
  it('matches the official rulebook example: correct prediction with a -5 special card', () => {
    // Christine: 2 tricks won, predicted 2 (correct), one trick contains a -5 card => 2 + 10 - 5 = 7
    const score = calculateRoundScore({ round: 1, prediction: 2, tricksWon: 2, specialCardPoints: -5 })
    expect(score).toBe(7)
  })

  it('awards trick points even on a wrong prediction (confirmed with project owner)', () => {
    // Predicted 5, actually won 6 => 6 (tricks) - 5 (wrong-prediction malus) = 1
    const score = calculateRoundScore({ round: 5, prediction: 5, tricksWon: 6, specialCardPoints: 0 })
    expect(score).toBe(1)
  })

  it('gives a +10 bonus on top of trick points for a correct prediction', () => {
    const score = calculateRoundScore({ round: 3, prediction: 4, tricksWon: 4, specialCardPoints: 0 })
    expect(score).toBe(4 + 10)
  })

  it('applies +5/-5 special card points on top of the base score', () => {
    const correct = calculateRoundScore({ round: 2, prediction: 3, tricksWon: 3, specialCardPoints: 10 })
    expect(correct).toBe(3 + 10 + 10)

    const wrong = calculateRoundScore({ round: 2, prediction: 3, tricksWon: 1, specialCardPoints: -10 })
    expect(wrong).toBe(1 - 5 - 10)
  })

  it('can go negative', () => {
    const score = calculateRoundScore({ round: 1, prediction: 8, tricksWon: 0, specialCardPoints: -5 })
    expect(score).toBe(0 - 5 - 5)
  })

  describe('Durchmarsch variant', () => {
    it('doubles trick points when a player wins every trick in the round', () => {
      // Round 4 has 7 cards; winning all 7 with a correct prediction of 7
      const score = calculateRoundScore(
        { round: 4, prediction: 7, tricksWon: 7, specialCardPoints: 0 },
        { durchmarschEnabled: true },
      )
      expect(score).toBe(7 * 2 + 10)
    })

    it('still doubles trick points on a wrong prediction, if all tricks were won', () => {
      // Won all 7 tricks but had predicted only 5 (wrong) => 7*2 - 5 = 9
      const score = calculateRoundScore(
        { round: 4, prediction: 5, tricksWon: 7, specialCardPoints: 0 },
        { durchmarschEnabled: true },
      )
      expect(score).toBe(9)
    })

    it('does not apply when the variant is disabled, even if all tricks were won', () => {
      const score = calculateRoundScore(
        { round: 4, prediction: 7, tricksWon: 7, specialCardPoints: 0 },
        { durchmarschEnabled: false },
      )
      expect(score).toBe(7 + 10)
    })

    it('does not apply in round 10, even with the variant enabled', () => {
      // Round 10 has exactly 1 card/trick - rulebook explicitly excludes the bonus here
      const score = calculateRoundScore(
        { round: 10, prediction: 1, tricksWon: 1, specialCardPoints: 0 },
        { durchmarschEnabled: true },
      )
      expect(score).toBe(1 + 10)
    })

    it('does not apply if the player did not win every trick', () => {
      const score = calculateRoundScore(
        { round: 4, prediction: 5, tricksWon: 5, specialCardPoints: 0 },
        { durchmarschEnabled: true },
      )
      expect(score).toBe(5 + 10)
    })
  })
})

describe('determineWinners', () => {
  it('returns the single player with the highest score', () => {
    const winners = determineWinners([
      { id: 'a', totalScore: 42 },
      { id: 'b', totalScore: 58 },
      { id: 'c', totalScore: 10 },
    ])
    expect(winners).toEqual(['b'])
  })

  it('returns all players tied for the highest score', () => {
    const winners = determineWinners([
      { id: 'a', totalScore: 58 },
      { id: 'b', totalScore: 58 },
      { id: 'c', totalScore: 10 },
    ])
    expect(winners).toEqual(['a', 'b'])
  })

  it('returns an empty array for no players', () => {
    expect(determineWinners([])).toEqual([])
  })
})
