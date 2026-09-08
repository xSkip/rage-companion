import { useI18n } from '../../i18n/I18nContext'
import type { Standing } from '../../game/standings'

interface WinnerBannerProps {
  standings: Standing[]
  winnerIds: string[]
}

export function WinnerBanner({ standings, winnerIds }: WinnerBannerProps) {
  const { t } = useI18n()
  const winnerNames = standings.filter((s) => winnerIds.includes(s.id)).map((s) => s.name)
  if (winnerNames.length === 0) return null

  const label =
    winnerNames.length > 1
      ? t('winner.shared', { names: winnerNames.join(' & ') })
      : t('winner.single', { name: winnerNames[0] })

  return (
    <div className="rounded border border-amber-400 bg-amber-950/40 px-4 py-3">
      <p className="text-lg font-bold text-amber-200">🏆 {label}</p>
    </div>
  )
}
