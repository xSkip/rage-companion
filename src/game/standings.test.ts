import { describe, expect, it } from 'vitest'
import { calculateStandings } from './standings'
import type { GameVariants, Player, RoundData } from './types'

const players: Player[] = [
  { id: 'p1', name: 'Christine' },
  { id: 'p2', name: 'Kirsten' },
]

const noVariants: GameVariants = {
  plusMinusOne: false,
  verdeckterTipp: false,
  geheimeVorhersage: false,
  durchmarsch: false,
}

describe('calculateStandings', () => {
  it('returns all players at 0 with no rounds played', () => {
    expect(calculateStandings(players, [], noVariants)).toEqual([
      { id: 'p1', name: 'Christine', totalScore: 0 },
      { id: 'p2', name: 'Kirsten', totalScore: 0 },
    ])
  })

  it('accumulates scores across multiple rounds and sorts by total descending', () => {
    const rounds: RoundData[] = [
      {
        round: 1,
        predictions: { p1: 2, p2: 3 },
        tricksWon: { p1: 2, p2: 3 },
        specialCardPoints: { p1: 0, p2: 0 },
      },
      {
        round: 2,
        predictions: { p1: 1, p2: 0 },
        tricksWon: { p1: 2, p2: 0 },
        specialCardPoints: { p1: -5, p2: 5 },
      },
    ]

    // p1: round1 (2+10=12) + round2 (2-5-5=-8) = 4
    // p2: round1 (3+10=13) + round2 (0+10+5=15) = 28
    const standings = calculateStandings(players, rounds, noVariants)
    expect(standings).toEqual([
      { id: 'p2', name: 'Kirsten', totalScore: 28 },
      { id: 'p1', name: 'Christine', totalScore: 4 },
    ])
  })

  it('treats a missing player entry in a round as a 0/0 prediction (defaults both to zero)', () => {
    const rounds: RoundData[] = [
      { round: 1, predictions: { p1: 5 }, tricksWon: { p1: 5 }, specialCardPoints: { p1: 0 } },
    ]
    const standings = calculateStandings(players, rounds, noVariants)
    // p2 defaults to prediction 0, tricksWon 0 -> counts as a correct prediction of zero (0 + 10)
    expect(standings.find((s) => s.id === 'p2')?.totalScore).toBe(10)
  })
})
