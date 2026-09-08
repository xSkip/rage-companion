import type { Standing } from '../../game/standings'

interface StandingsTableProps {
  standings: Standing[]
  winnerIds?: string[]
}

export function StandingsTable({ standings, winnerIds = [] }: StandingsTableProps) {
  return (
    <ol className="flex flex-col gap-1">
      {standings.map((standing, index) => {
        const isWinner = winnerIds.includes(standing.id)
        return (
          <li
            key={standing.id}
            className={`flex items-center justify-between rounded border px-3 py-2 ${
              isWinner ? 'border-amber-400 bg-amber-950/30 font-semibold' : 'border-slate-700'
            }`}
          >
            <span>
              {index + 1}. {standing.name}
              {isWinner ? ' 🏆' : ''}
            </span>
            <span className="font-mono">{standing.totalScore}</span>
          </li>
        )
      })}
    </ol>
  )
}
