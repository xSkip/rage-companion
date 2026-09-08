export const TOTAL_ROUNDS = 10
export const MIN_PLAYERS = 3
export const MAX_PLAYERS = 8

export interface Player {
  id: string
  name: string
}

export interface GameVariants {
  plusMinusOne: boolean
  verdeckterTipp: boolean
  geheimeVorhersage: boolean
  durchmarsch: boolean
}

export interface GameConfig {
  id: string
  players: Player[]
  variants: GameVariants
  createdAt: string
}

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
