import { useState } from 'react'
import { useI18n } from '../../i18n/I18nContext'
import { calculateRoundScore, getCardsForRound } from '../../game/scoring'
import type { GameVariants, Player, RoundData } from '../../game/types'
import { validatePlusMinusOne, validatePrediction, validateTricksSum, type ValidationWarning } from '../../game/validation'

type DraftValues = Record<string, string>

function draftFrom(players: Player[], data: RoundData | null, field: 'predictions' | 'tricksWon' | 'specialCardPoints'): DraftValues {
  return Object.fromEntries(players.map((player) => [player.id, data ? String(data[field][player.id] ?? '') : '']))
}

function parseValue(value: string): number {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

interface RoundFormProps {
  round: number
  players: Player[]
  variants: GameVariants
  initialData: RoundData | null
  onSubmit: (round: RoundData) => void
  onCancel?: () => void
  submitLabel: string
}

export function RoundForm({ round, players, variants, initialData, onSubmit, onCancel, submitLabel }: RoundFormProps) {
  const { t } = useI18n()
  const [predictions, setPredictions] = useState<DraftValues>(() => draftFrom(players, initialData, 'predictions'))
  const [tricksWon, setTricksWon] = useState<DraftValues>(() => draftFrom(players, initialData, 'tricksWon'))
  const [specialCardPoints, setSpecialCardPoints] = useState<DraftValues>(() =>
    draftFrom(players, initialData, 'specialCardPoints'),
  )

  const cardsThisRound = getCardsForRound(round)

  function updateValue(setter: typeof setPredictions, playerId: string, value: string) {
    setter((prev) => ({ ...prev, [playerId]: value }))
  }

  function handleSubmit() {
    const roundData: RoundData = {
      round,
      predictions: Object.fromEntries(players.map((p) => [p.id, parseValue(predictions[p.id])])),
      tricksWon: Object.fromEntries(players.map((p) => [p.id, parseValue(tricksWon[p.id])])),
      specialCardPoints: Object.fromEntries(players.map((p) => [p.id, parseValue(specialCardPoints[p.id])])),
    }
    onSubmit(roundData)
  }

  const predictionValues = players.map((p) => parseValue(predictions[p.id]))
  const tricksValues = players.map((p) => parseValue(tricksWon[p.id]))
  const hasAnyInput = players.some(
    (p) => predictions[p.id] !== '' || tricksWon[p.id] !== '' || specialCardPoints[p.id] !== '',
  )

  const warnings: ValidationWarning[] = hasAnyInput
    ? [
        ...players
          .map((p) => validatePrediction(parseValue(predictions[p.id]), round))
          .filter((w): w is ValidationWarning => w !== null),
        ...[validateTricksSum(tricksValues, round)].filter((w): w is ValidationWarning => w !== null),
        ...(variants.plusMinusOne
          ? [validatePlusMinusOne(predictionValues, round)].filter((w): w is ValidationWarning => w !== null)
          : []),
      ]
    : []

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-slate-400">{t('round.cardsInfo', { count: cardsThisRound })}</p>

      <div className="-mx-1 overflow-x-auto px-1">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-700 text-left text-slate-400">
              <th className="py-2 pr-1 sm:pr-2">{t('round.columnPlayer')}</th>
              <th className="px-1 py-2 sm:px-2">{t('round.columnPrediction')}</th>
              <th className="px-1 py-2 sm:px-2">{t('round.columnTricks')}</th>
              <th className="px-1 py-2 sm:px-2">{t('round.columnSpecial')}</th>
              <th className="py-2 pl-1 text-right sm:pl-2">{t('round.columnPoints')}</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player) => {
              const liveScore = calculateRoundScore(
                {
                  round,
                  prediction: parseValue(predictions[player.id]),
                  tricksWon: parseValue(tricksWon[player.id]),
                  specialCardPoints: parseValue(specialCardPoints[player.id]),
                },
                { durchmarschEnabled: variants.durchmarsch },
              )
              return (
                <tr key={player.id} className="border-b border-slate-800">
                  <td className="max-w-[4.5rem] truncate py-2 pr-1 font-medium sm:max-w-none sm:pr-2">{player.name}</td>
                  <td className="px-1 py-2 sm:px-2">
                    <input
                      type="number"
                      value={predictions[player.id]}
                      onChange={(e) => updateValue(setPredictions, player.id, e.target.value)}
                      aria-label={t('round.predictionLabel', { name: player.name })}
                      className="w-11 rounded border border-slate-600 bg-slate-800 px-1 py-2 text-base sm:w-20 sm:px-2 sm:py-1"
                    />
                  </td>
                  <td className="px-1 py-2 sm:px-2">
                    <input
                      type="number"
                      value={tricksWon[player.id]}
                      onChange={(e) => updateValue(setTricksWon, player.id, e.target.value)}
                      aria-label={t('round.tricksLabel', { name: player.name })}
                      className="w-11 rounded border border-slate-600 bg-slate-800 px-1 py-2 text-base sm:w-20 sm:px-2 sm:py-1"
                    />
                  </td>
                  <td className="px-1 py-2 sm:px-2">
                    <input
                      type="number"
                      step={5}
                      value={specialCardPoints[player.id]}
                      onChange={(e) => updateValue(setSpecialCardPoints, player.id, e.target.value)}
                      aria-label={t('round.specialLabel', { name: player.name })}
                      className="w-11 rounded border border-slate-600 bg-slate-800 px-1 py-2 text-base sm:w-20 sm:px-2 sm:py-1"
                    />
                  </td>
                  <td className="py-2 pl-1 text-right font-mono sm:pl-2">{liveScore}</td>
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
              key={warning.code}
              role="alert"
              className="rounded border border-amber-500 bg-amber-950 px-3 py-2 text-sm text-amber-200"
            >
              {t(`validation.${warning.code}`, warning.params)}
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleSubmit}
          className="rounded bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-500"
        >
          {submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded border border-slate-600 px-4 py-2 font-semibold text-slate-300 hover:bg-slate-800"
          >
            {t('round.cancel')}
          </button>
        )}
      </div>
    </div>
  )
}
