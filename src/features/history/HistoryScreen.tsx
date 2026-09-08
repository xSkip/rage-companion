import { useI18n } from '../../i18n/I18nContext'
import { calculatePlayerStats, type CompletedGame } from '../../game/history'

interface HistoryScreenProps {
  games: CompletedGame[]
}

export function HistoryScreen({ games }: HistoryScreenProps) {
  const { t, language } = useI18n()

  if (games.length === 0) {
    return (
      <div className="mx-auto max-w-2xl p-4 text-slate-100 sm:p-6">
        <h1 className="text-2xl font-bold">{t('history.title')}</h1>
        <p className="mt-4 text-slate-400">{t('history.emptyState')}</p>
      </div>
    )
  }

  const stats = calculatePlayerStats(games)
  const sortedGames = [...games].sort((a, b) => b.playedAt.localeCompare(a.playedAt))

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 p-4 text-slate-100 sm:p-6">
      <h1 className="text-2xl font-bold">{t('history.title')}</h1>

      <section>
        <h2 className="mb-2 text-lg font-semibold">{t('history.playerStatsTitle')}</h2>
        <ul className="flex flex-col gap-1">
          {stats.map((s) => (
            <li
              key={s.name}
              className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 rounded border border-slate-700 px-3 py-2 text-sm"
            >
              <span className="font-medium">{s.name}</span>
              <span className="text-slate-400">
                {t('history.winsLabel', { count: s.wins })} · {t('history.gamesPlayedLabel', { count: s.gamesPlayed })} ·{' '}
                {t('history.averageScoreLabel', { average: s.averageScore })}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold">{t('history.gamesTitle')}</h2>
        <ul className="flex flex-col gap-2">
          {sortedGames.map((game) => (
            <li key={game.id} className="rounded border border-slate-700 px-3 py-2 text-sm">
              <div className="text-xs text-slate-500">{new Date(game.playedAt).toLocaleDateString(language)}</div>
              <div className="mt-1">
                {game.players
                  .slice()
                  .sort((a, b) => b.totalScore - a.totalScore)
                  .map((p) => `${p.name} ${p.totalScore}`)
                  .join(' · ')}
              </div>
              <div className="mt-1 text-amber-300">
                {t('history.winnerLabel', { names: game.winnerNames.join(' & ') })}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
