import { calculateRoundScore } from './scoring'
import type { GameVariants, Player, RoundData } from './types'

export interface Standing {
  id: string
  name: string
  totalScore: number
}

/**
 * Sums each player's score across all given rounds and sorts descending
 * (highest total first). Ties keep the players' original relative order.
 */
export function calculateStandings(players: Player[], rounds: RoundData[], variants: GameVariants): Standing[] {
  const totals = new Map<string, number>(players.map((player) => [player.id, 0]))

  for (const round of rounds) {
    for (const player of players) {
      const score = calculateRoundScore(
        {
          round: round.round,
          prediction: round.predictions[player.id] ?? 0,
          tricksWon: round.tricksWon[player.id] ?? 0,
          specialCardPoints: round.specialCardPoints[player.id] ?? 0,
        },
        { durchmarschEnabled: variants.durchmarsch },
      )
      totals.set(player.id, (totals.get(player.id) ?? 0) + score)
    }
  }

  return players
    .map((player) => ({ id: player.id, name: player.name, totalScore: totals.get(player.id) ?? 0 }))
    .sort((a, b) => b.totalScore - a.totalScore)
}
