import { TOTAL_ROUNDS, type PlayerTotal, type RoundInput, type ScoringOptions } from './types'

/**
 * Cards dealt per player in a given round: 10 in round 1, down to 1 in round 10.
 */
export function getCardsForRound(round: number): number {
  if (round < 1 || round > TOTAL_ROUNDS) {
    throw new Error(`Round must be between 1 and ${TOTAL_ROUNDS}, got ${round}`)
  }
  return TOTAL_ROUNDS + 1 - round
}

const DEFAULT_OPTIONS: ScoringOptions = { durchmarschEnabled: false }

/**
 * Trick points always count (even on a wrong prediction) - only the
 * prediction bonus/malus and the Durchmarsch trick multiplier change.
 */
export function calculateRoundScore(input: RoundInput, options: ScoringOptions = DEFAULT_OPTIONS): number {
  const cardsThisRound = getCardsForRound(input.round)
  const predictionCorrect = input.prediction === input.tricksWon
  const wonAllTricks = input.tricksWon === cardsThisRound
  const durchmarschApplies = options.durchmarschEnabled && wonAllTricks && input.round !== TOTAL_ROUNDS

  const pointsPerTrick = durchmarschApplies ? 2 : 1
  const trickPoints = input.tricksWon * pointsPerTrick
  const predictionBonus = predictionCorrect ? 10 : -5

  return trickPoints + predictionBonus + input.specialCardPoints
}

/**
 * Returns the id(s) of the player(s) with the highest total score.
 * More than one id means a shared win (tie at the top).
 */
export function determineWinners(players: PlayerTotal[]): string[] {
  if (players.length === 0) return []
  const highest = Math.max(...players.map((p) => p.totalScore))
  return players.filter((p) => p.totalScore === highest).map((p) => p.id)
}
