import { calculateRoundScore } from '../../game/scoring'
import type { GameVariants, Player, RoundData } from '../../game/types'

interface RoundHistoryProps {
  rounds: RoundData[]
  players: Player[]
  variants: GameVariants
  onEdit: (round: number) => void
}

export function RoundHistory({ rounds, players, variants, onEdit }: RoundHistoryProps) {
  if (rounds.length === 0) return null

  return (
    <section>
      <h2 className="mb-2 text-lg font-semibold">Bisherige Runden</h2>
      <ul className="flex flex-col gap-2">
        {rounds.map((round) => (
          <li
            key={round.round}
            className="flex flex-wrap items-center justify-between gap-2 rounded border border-slate-700 px-3 py-2 text-sm"
          >
            <div>
              <span className="font-medium">Runde {round.round}: </span>
              {players
                .map((player) => {
                  const score = calculateRoundScore(
                    {
                      round: round.round,
                      prediction: round.predictions[player.id] ?? 0,
                      tricksWon: round.tricksWon[player.id] ?? 0,
                      specialCardPoints: round.specialCardPoints[player.id] ?? 0,
                    },
                    { durchmarschEnabled: variants.durchmarsch },
                  )
                  return `${player.name} ${score}`
                })
                .join(' · ')}
            </div>
            <button
              type="button"
              onClick={() => onEdit(round.round)}
              className="rounded border border-slate-600 px-3 py-1 text-xs hover:bg-slate-800"
            >
              Bearbeiten
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
