import { useState } from 'react'
import { useI18n } from '../../i18n/I18nContext'
import { determineWinners } from '../../game/scoring'
import { calculateStandings } from '../../game/standings'
import { TOTAL_ROUNDS, type GameConfig, type RoundData } from '../../game/types'
import { NewGameButton } from './NewGameButton'
import { RoundForm } from './RoundForm'
import { RoundHistory } from './RoundHistory'
import { ShareButton } from './ShareButton'
import { StandingsTable } from './StandingsTable'
import { WinnerBanner } from './WinnerBanner'

interface RoundEntryScreenProps {
  config: GameConfig
  rounds: RoundData[]
  onRoundComplete: (round: RoundData) => void
  onRoundEdit: (round: RoundData) => void
  onNewGame: () => void
}

export function RoundEntryScreen({ config, rounds, onRoundComplete, onRoundEdit, onNewGame }: RoundEntryScreenProps) {
  const { t } = useI18n()
  const [editingRound, setEditingRound] = useState<number | null>(null)

  const isEditing = editingRound !== null
  const activeRoundNumber = editingRound ?? rounds.length + 1
  const gameFinished = !isEditing && rounds.length >= TOTAL_ROUNDS
  const existingRoundData = isEditing ? (rounds.find((r) => r.round === editingRound) ?? null) : null

  const standings = calculateStandings(config.players, rounds, config.variants)
  const winnerIds = gameFinished ? determineWinners(standings) : []

  const title = gameFinished
    ? t('round.titleFinished', { total: TOTAL_ROUNDS })
    : isEditing
      ? t('round.titleEdit', { round: activeRoundNumber })
      : t('round.titleNew', { round: activeRoundNumber, total: TOTAL_ROUNDS })

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 p-4 text-slate-100 sm:p-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
        </div>
        <NewGameButton onConfirm={onNewGame} />
      </header>

      {!gameFinished && (
        <RoundForm
          key={`${activeRoundNumber}-${isEditing}`}
          round={activeRoundNumber}
          players={config.players}
          variants={config.variants}
          initialData={existingRoundData}
          submitLabel={
            isEditing
              ? t('round.submitEdit', { round: activeRoundNumber })
              : t('round.submitNew', { round: activeRoundNumber })
          }
          onCancel={isEditing ? () => setEditingRound(null) : undefined}
          onSubmit={(roundData) => {
            if (isEditing) {
              onRoundEdit(roundData)
              setEditingRound(null)
            } else {
              onRoundComplete(roundData)
            }
          }}
        />
      )}

      {gameFinished && (
        <div className="flex flex-col gap-4">
          <WinnerBanner standings={standings} winnerIds={winnerIds} />
          <div>
            <p className="mb-2 text-sm text-slate-400">{t('round.finalStandingsLabel')}</p>
            <StandingsTable standings={standings} winnerIds={winnerIds} />
          </div>
          <ShareButton
            standings={standings}
            winnerNames={standings.filter((s) => winnerIds.includes(s.id)).map((s) => s.name)}
          />
        </div>
      )}

      {!gameFinished && (
        <section>
          <h2 className="mb-2 text-lg font-semibold">
            {rounds.length > 0 ? t('round.standingsTitleAfterRound', { round: rounds.length }) : t('round.standingsTitle')}
          </h2>
          <StandingsTable standings={standings} />
        </section>
      )}

      <RoundHistory rounds={rounds} players={config.players} variants={config.variants} onEdit={setEditingRound} />
    </div>
  )
}
