export const TOTAL_ROUNDS = 10

export interface RoundInput {
  round: number
  prediction: number
  tricksWon: number
  specialCardPoints: number
}

export interface ScoringOptions {
  durchmarschEnabled: boolean
}

export interface PlayerTotal {
  id: string
  totalScore: number
}
