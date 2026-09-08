import type { Standing } from '../../game/standings'

interface StandingsTableProps {
  standings: Standing[]
}

export function StandingsTable({ standings }: StandingsTableProps) {
  return (
    <ol className="flex flex-col gap-1">
      {standings.map((standing, index) => (
        <li
          key={standing.id}
          className="flex items-center justify-between rounded border border-slate-700 px-3 py-2"
        >
          <span>
            {index + 1}. {standing.name}
          </span>
          <span className="font-mono">{standing.totalScore}</span>
        </li>
      ))}
    </ol>
  )
}
