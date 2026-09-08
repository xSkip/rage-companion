import type { Standing } from './standings'
import type { GameSession } from './types'

export interface CompletedGame {
  id: string
  playedAt: string
  players: { name: string; totalScore: number }[]
  winnerNames: string[]
}

export interface PlayerStats {
  name: string
  gamesPlayed: number
  wins: number
  averageScore: number
}

export function toCompletedGame(session: GameSession, standings: Standing[], winnerIds: string[]): CompletedGame {
  return {
    id: session.config.id,
    playedAt: new Date().toISOString(),
    players: standings.map((s) => ({ name: s.name, totalScore: s.totalScore })),
    winnerNames: standings.filter((s) => winnerIds.includes(s.id)).map((s) => s.name),
  }
}

/**
 * Adds a completed game, or replaces the existing entry for that game id
 * (a finished game's rounds can still be corrected afterwards) while
 * keeping the original playedAt timestamp so history stays chronological.
 */
export function upsertCompletedGame(games: CompletedGame[], game: CompletedGame): CompletedGame[] {
  const existing = games.find((g) => g.id === game.id)
  if (existing) {
    return games.map((g) => (g.id === game.id ? { ...game, playedAt: existing.playedAt } : g))
  }
  return [...games, game]
}

/**
 * Aggregates per-player stats across completed games, grouped by player
 * name (there's no persistent player identity across separate games).
 * Sorted by wins, then average score, both descending.
 */
export function calculatePlayerStats(games: CompletedGame[]): PlayerStats[] {
  const byName = new Map<string, { gamesPlayed: number; wins: number; totalScore: number }>()

  for (const game of games) {
    for (const player of game.players) {
      const entry = byName.get(player.name) ?? { gamesPlayed: 0, wins: 0, totalScore: 0 }
      entry.gamesPlayed += 1
      entry.totalScore += player.totalScore
      if (game.winnerNames.includes(player.name)) entry.wins += 1
      byName.set(player.name, entry)
    }
  }

  return Array.from(byName.entries())
    .map(([name, s]) => ({
      name,
      gamesPlayed: s.gamesPlayed,
      wins: s.wins,
      averageScore: Math.round((s.totalScore / s.gamesPlayed) * 10) / 10,
    }))
    .sort((a, b) => b.wins - a.wins || b.averageScore - a.averageScore)
}
