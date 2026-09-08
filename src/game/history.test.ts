import { describe, expect, it } from 'vitest'
import { calculatePlayerStats, toCompletedGame, upsertCompletedGame, type CompletedGame } from './history'
import type { GameSession } from './types'

const session: GameSession = {
  config: {
    id: 'game-1',
    players: [
      { id: 'p1', name: 'Christine' },
      { id: 'p2', name: 'Kirsten' },
    ],
    variants: { plusMinusOne: false, verdeckterTipp: false, geheimeVorhersage: false, durchmarsch: false },
    createdAt: '2026-09-08T10:00:00.000Z',
  },
  rounds: [],
}

describe('toCompletedGame', () => {
  it('maps standings and winners into a completed-game record', () => {
    const standings = [
      { id: 'p2', name: 'Kirsten', totalScore: 100 },
      { id: 'p1', name: 'Christine', totalScore: 80 },
    ]
    const completed = toCompletedGame(session, standings, ['p2'])
    expect(completed.id).toBe('game-1')
    expect(completed.players).toEqual([
      { name: 'Kirsten', totalScore: 100 },
      { name: 'Christine', totalScore: 80 },
    ])
    expect(completed.winnerNames).toEqual(['Kirsten'])
  })

  it('lists multiple winner names for a shared win', () => {
    const standings = [
      { id: 'p1', name: 'Christine', totalScore: 100 },
      { id: 'p2', name: 'Kirsten', totalScore: 100 },
    ]
    const completed = toCompletedGame(session, standings, ['p1', 'p2'])
    expect(completed.winnerNames).toEqual(['Christine', 'Kirsten'])
  })
})

describe('upsertCompletedGame', () => {
  const gameA: CompletedGame = {
    id: 'g1',
    playedAt: '2026-09-01T10:00:00.000Z',
    players: [{ name: 'Christine', totalScore: 100 }],
    winnerNames: ['Christine'],
  }

  it('appends a new game', () => {
    const result = upsertCompletedGame([], gameA)
    expect(result).toEqual([gameA])
  })

  it('replaces an existing game by id but keeps the original playedAt', () => {
    const edited: CompletedGame = {
      ...gameA,
      playedAt: '2026-09-05T10:00:00.000Z', // would-be new timestamp
      players: [{ name: 'Christine', totalScore: 120 }],
    }
    const result = upsertCompletedGame([gameA], edited)
    expect(result).toHaveLength(1)
    expect(result[0].players[0].totalScore).toBe(120)
    expect(result[0].playedAt).toBe('2026-09-01T10:00:00.000Z')
  })
})

describe('calculatePlayerStats', () => {
  it('aggregates wins, games played, and average score per player name', () => {
    const games: CompletedGame[] = [
      {
        id: 'g1',
        playedAt: '2026-09-01T10:00:00.000Z',
        players: [
          { name: 'Christine', totalScore: 100 },
          { name: 'Kirsten', totalScore: 80 },
        ],
        winnerNames: ['Christine'],
      },
      {
        id: 'g2',
        playedAt: '2026-09-02T10:00:00.000Z',
        players: [
          { name: 'Christine', totalScore: 60 },
          { name: 'Kirsten', totalScore: 90 },
        ],
        winnerNames: ['Kirsten'],
      },
    ]

    const stats = calculatePlayerStats(games)
    const christine = stats.find((s) => s.name === 'Christine')!
    const kirsten = stats.find((s) => s.name === 'Kirsten')!

    expect(christine).toEqual({ name: 'Christine', gamesPlayed: 2, wins: 1, averageScore: 80 })
    expect(kirsten).toEqual({ name: 'Kirsten', gamesPlayed: 2, wins: 1, averageScore: 85 })
  })

  it('sorts by wins, then average score, both descending', () => {
    const games: CompletedGame[] = [
      { id: 'g1', playedAt: 't1', players: [{ name: 'A', totalScore: 50 }, { name: 'B', totalScore: 10 }], winnerNames: ['A'] },
      { id: 'g2', playedAt: 't2', players: [{ name: 'A', totalScore: 10 }, { name: 'B', totalScore: 50 }], winnerNames: ['B'] },
      { id: 'g3', playedAt: 't3', players: [{ name: 'A', totalScore: 10 }, { name: 'B', totalScore: 50 }], winnerNames: ['B'] },
    ]
    const stats = calculatePlayerStats(games)
    expect(stats.map((s) => s.name)).toEqual(['B', 'A'])
  })

  it('returns an empty list for no games', () => {
    expect(calculatePlayerStats([])).toEqual([])
  })
})
