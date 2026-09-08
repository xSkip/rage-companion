import { useState } from 'react'
import { determineWinners } from '../../game/scoring'
import { calculateStandings } from '../../game/standings'
import { TOTAL_ROUNDS, type GameConfig, type RoundData } from '../../game/types'
import { NewGameButton } from './NewGameButton'
import { RoundForm } from './RoundForm'
import { RoundHistory } from './RoundHistory'
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
  const [editingRound, setEditingRound] = useState<number | null>(null)

  const isEditing = editingRound !== null
  const activeRoundNumber = editingRound ?? rounds.length + 1
  const gameFinished = !isEditing && rounds.length >= TOTAL_ROUNDS
  const existingRoundData = isEditing ? (rounds.find((r) => r.round === editingRound) ?? null) : null

  const standings = calculateStandings(config.players, rounds, config.variants)
  const winnerIds = gameFinished ? determineWinners(standings) : []

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 p-6 text-slate-100">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">
            {gameFinished
              ? `Alle ${TOTAL_ROUNDS} Runden gespielt`
              : isEditing
                ? `Runde ${activeRoundNumber} bearbeiten`
                : `Runde ${activeRoundNumber} von ${TOTAL_ROUNDS}`}
          </h1>
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
          submitLabel={isEditing ? `Runde ${activeRoundNumber} speichern` : `Runde ${activeRoundNumber} abschließen`}
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
            <p className="mb-2 text-sm text-slate-400">Endstand:</p>
            <StandingsTable standings={standings} winnerIds={winnerIds} />
          </div>
        </div>
      )}

      {!gameFinished && (
        <section>
          <h2 className="mb-2 text-lg font-semibold">
            Rangliste {rounds.length > 0 ? `nach Runde ${rounds.length}` : ''}
          </h2>
          <StandingsTable standings={standings} />
        </section>
      )}

      <RoundHistory rounds={rounds} players={config.players} variants={config.variants} onEdit={setEditingRound} />
    </div>
  )
}
