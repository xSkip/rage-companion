import { useState } from 'react'
import { calculateRoundScore, getCardsForRound } from '../../game/scoring'
import { calculateStandings } from '../../game/standings'
import { TOTAL_ROUNDS, type GameConfig, type Player, type RoundData } from '../../game/types'
import { validatePlusMinusOne, validatePrediction, validateTricksSum, type ValidationWarning } from '../../game/validation'
import { StandingsTable } from './StandingsTable'

interface RoundEntryScreenProps {
  config: GameConfig
  rounds: RoundData[]
  onRoundComplete: (round: RoundData) => void
}

type DraftValues = Record<string, string>

function emptyDraft(players: Player[]): DraftValues {
  return Object.fromEntries(players.map((player) => [player.id, '']))
}

function parseValue(value: string): number {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

export function RoundEntryScreen({ config, rounds, onRoundComplete }: RoundEntryScreenProps) {
  const currentRound = rounds.length + 1
  const gameFinished = currentRound > TOTAL_ROUNDS
  const standings = calculateStandings(config.players, rounds, config.variants)

  const [predictions, setPredictions] = useState<DraftValues>(() => emptyDraft(config.players))
  const [tricksWon, setTricksWon] = useState<DraftValues>(() => emptyDraft(config.players))
  const [specialCardPoints, setSpecialCardPoints] = useState<DraftValues>(() => emptyDraft(config.players))

  if (gameFinished) {
    return (
      <div className="mx-auto max-w-xl p-6 text-slate-100">
        <h1 className="text-2xl font-bold">Alle {TOTAL_ROUNDS} Runden gespielt</h1>
        <p className="mt-1 text-sm text-slate-400">Endstand:</p>
        <div className="mt-4">
          <StandingsTable standings={standings} />
        </div>
      </div>
    )
  }

  const cardsThisRound = getCardsForRound(currentRound)

  function updateValue(setter: typeof setPredictions, playerId: string, value: string) {
    setter((prev) => ({ ...prev, [playerId]: value }))
  }

  function handleComplete() {
    const roundData: RoundData = {
      round: currentRound,
      predictions: Object.fromEntries(config.players.map((p) => [p.id, parseValue(predictions[p.id])])),
      tricksWon: Object.fromEntries(config.players.map((p) => [p.id, parseValue(tricksWon[p.id])])),
      specialCardPoints: Object.fromEntries(config.players.map((p) => [p.id, parseValue(specialCardPoints[p.id])])),
    }
    onRoundComplete(roundData)
    setPredictions(emptyDraft(config.players))
    setTricksWon(emptyDraft(config.players))
    setSpecialCardPoints(emptyDraft(config.players))
  }

  const predictionValues = config.players.map((p) => parseValue(predictions[p.id]))
  const tricksValues = config.players.map((p) => parseValue(tricksWon[p.id]))
  const hasAnyInput = config.players.some(
    (p) => predictions[p.id] !== '' || tricksWon[p.id] !== '' || specialCardPoints[p.id] !== '',
  )

  const warnings: ValidationWarning[] = hasAnyInput
    ? [
        ...config.players
          .map((p) => validatePrediction(parseValue(predictions[p.id]), currentRound))
          .filter((w): w is ValidationWarning => w !== null),
        ...[validateTricksSum(tricksValues, currentRound)].filter((w): w is ValidationWarning => w !== null),
        ...(config.variants.plusMinusOne
          ? [validatePlusMinusOne(predictionValues, currentRound)].filter((w): w is ValidationWarning => w !== null)
          : []),
      ]
    : []

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 p-6 text-slate-100">
      <header>
        <h1 className="text-2xl font-bold">
          Runde {currentRound} von {TOTAL_ROUNDS}
        </h1>
        <p className="mt-1 text-sm text-slate-400">{cardsThisRound} Karten pro Spieler</p>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-700 text-left text-slate-400">
              <th className="py-2 pr-2">Spieler</th>
              <th className="px-2 py-2">Vorhersage</th>
              <th className="px-2 py-2">Stiche</th>
              <th className="px-2 py-2">Sonderpunkte</th>
              <th className="py-2 pl-2 text-right">Punkte</th>
            </tr>
          </thead>
          <tbody>
            {config.players.map((player) => {
              const liveScore = calculateRoundScore(
                {
                  round: currentRound,
                  prediction: parseValue(predictions[player.id]),
                  tricksWon: parseValue(tricksWon[player.id]),
                  specialCardPoints: parseValue(specialCardPoints[player.id]),
                },
                { durchmarschEnabled: config.variants.durchmarsch },
              )
              return (
                <tr key={player.id} className="border-b border-slate-800">
                  <td className="py-2 pr-2 font-medium">{player.name}</td>
                  <td className="px-2 py-2">
                    <input
                      type="number"
                      value={predictions[player.id]}
                      onChange={(e) => updateValue(setPredictions, player.id, e.target.value)}
                      aria-label={`Vorhersage ${player.name}`}
                      className="w-20 rounded border border-slate-600 bg-slate-800 px-2 py-1"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <input
                      type="number"
                      value={tricksWon[player.id]}
                      onChange={(e) => updateValue(setTricksWon, player.id, e.target.value)}
                      aria-label={`Stiche ${player.name}`}
                      className="w-20 rounded border border-slate-600 bg-slate-800 px-2 py-1"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <input
                      type="number"
                      step={5}
                      value={specialCardPoints[player.id]}
                      onChange={(e) => updateValue(setSpecialCardPoints, player.id, e.target.value)}
                      aria-label={`Sonderpunkte ${player.name}`}
                      className="w-20 rounded border border-slate-600 bg-slate-800 px-2 py-1"
                    />
                  </td>
                  <td className="py-2 pl-2 text-right font-mono">{liveScore}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {warnings.length > 0 && (
        <ul className="flex flex-col gap-1">
          {warnings.map((warning) => (
            <li
              key={warning.code + JSON.stringify(warning.message)}
              role="alert"
              className="rounded border border-amber-500 bg-amber-950 px-3 py-2 text-sm text-amber-200"
            >
              {warning.message}
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={handleComplete}
        className="self-start rounded bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-500"
      >
        Runde {currentRound} abschließen
      </button>

      <section>
        <h2 className="mb-2 text-lg font-semibold">Rangliste {rounds.length > 0 ? `nach Runde ${rounds.length}` : ''}</h2>
        <StandingsTable standings={standings} />
      </section>
    </div>
  )
}
