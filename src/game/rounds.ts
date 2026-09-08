import type { RoundData } from './types'

/**
 * Adds a round, or replaces the existing entry for that round number
 * (used when editing an already-recorded round). Result stays sorted by
 * round number.
 */
export function upsertRound(rounds: RoundData[], round: RoundData): RoundData[] {
  const withoutRound = rounds.filter((r) => r.round !== round.round)
  return [...withoutRound, round].sort((a, b) => a.round - b.round)
}
