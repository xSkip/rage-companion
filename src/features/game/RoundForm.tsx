import { useState } from 'react'
import { useI18n } from '../../i18n/I18nContext'
import { calculateRoundScore, getCardsForRound } from '../../game/scoring'
import type { GameVariants, Player, RoundData } from '../../game/types'
import { validatePlusMinusOne, validatePrediction, validateTricksSum, type ValidationWarning } from '../../game/validation'

type DraftValues = Record<string, string>
type SpecialCounts = Record<string, number>

const MAX_SPECIAL_CARDS = 3 // there are exactly 3 copies each of +5 and -5 in the deck

function draftFrom(players: Player[], data: RoundData | null, field: 'predictions' | 'tricksWon'): DraftValues {
  return Object.fromEntries(players.map((player) => [player.id, data ? String(data[field][player.id] ?? '') : '']))
}

/**
 * A round only stores the net special-card point value, not how many
 * +5/-5 cards produced it. When editing an existing round we can't
 * recover a mixed history exactly, so we assume it came from one card
 * type - the common case in practice.
 */
function decomposeSpecialPoints(points: number): { plus5: SpecialCounts[string]; minus5: SpecialCounts[string] } {
  if (points > 0) return { plus5: Math.min(MAX_SPECIAL_CARDS, Math.round(points / 5)), minus5: 0 }
  if (points < 0) return { plus5: 0, minus5: Math.min(MAX_SPECIAL_CARDS, Math.round(-points / 5)) }
  return { plus5: 0, minus5: 0 }
}

function specialCountsFrom(players: Player[], data: RoundData | null, card: 'plus5' | 'minus5'): SpecialCounts {
  return Object.fromEntries(
    players.map((player) => [player.id, data ? decomposeSpecialPoints(data.specialCardPoints[player.id] ?? 0)[card] : 0]),
  )
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
  const [plus5Counts, setPlus5Counts] = useState<SpecialCounts>(() => specialCountsFrom(players, initialData, 'plus5'))
  const [minus5Counts, setMinus5Counts] = useState<SpecialCounts>(() => specialCountsFrom(players, initialData, 'minus5'))

  const cardsThisRound = getCardsForRound(round)

  function updateValue(setter: typeof setPredictions, playerId: string, value: string) {
    setter((prev) => ({ ...prev, [playerId]: value }))
  }

  function adjustCount(setter: typeof setPlus5Counts, playerId: string, delta: number) {
    setter((prev) => ({ ...prev, [playerId]: Math.max(0, Math.min(MAX_SPECIAL_CARDS, (prev[playerId] ?? 0) + delta)) }))
  }

  function specialPointsFor(playerId: string): number {
    return (plus5Counts[playerId] ?? 0) * 5 - (minus5Counts[playerId] ?? 0) * 5
  }

  function handleSubmit() {
    const roundData: RoundData = {
      round,
      predictions: Object.fromEntries(players.map((p) => [p.id, parseValue(predictions[p.id])])),
      tricksWon: Object.fromEntries(players.map((p) => [p.id, parseValue(tricksWon[p.id])])),
      specialCardPoints: Object.fromEntries(players.map((p) => [p.id, specialPointsFor(p.id)])),
    }
    onSubmit(roundData)
  }

  const predictionValues = players.map((p) => parseValue(predictions[p.id]))
  const tricksValues = players.map((p) => parseValue(tricksWon[p.id]))
  const hasAnyInput = players.some((p) => predictions[p.id] !== '' || tricksWon[p.id] !== '')

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
                  specialCardPoints: specialPointsFor(player.id),
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
                    <div className="flex flex-col gap-1">
                      <CardCounter
                        card="+5"
                        value={plus5Counts[player.id] ?? 0}
                        max={MAX_SPECIAL_CARDS}
                        valueLabel={t('round.specialPlus5Label', { name: player.name })}
                        increaseLabel={t('round.specialIncrease', { card: '+5', name: player.name })}
                        decreaseLabel={t('round.specialDecrease', { card: '+5', name: player.name })}
                        onChange={(delta) => adjustCount(setPlus5Counts, player.id, delta)}
                      />
                      <CardCounter
                        card="−5"
                        value={minus5Counts[player.id] ?? 0}
                        max={MAX_SPECIAL_CARDS}
                        valueLabel={t('round.specialMinus5Label', { name: player.name })}
                        increaseLabel={t('round.specialIncrease', { card: '−5', name: player.name })}
                        decreaseLabel={t('round.specialDecrease', { card: '−5', name: player.name })}
                        onChange={(delta) => adjustCount(setMinus5Counts, player.id, delta)}
                      />
                    </div>
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

interface CardCounterProps {
  card: string
  value: number
  max: number
  valueLabel: string
  increaseLabel: string
  decreaseLabel: string
  onChange: (delta: number) => void
}

function CardCounter({ card, value, max, valueLabel, increaseLabel, decreaseLabel, onChange }: CardCounterProps) {
  return (
    <div className="flex items-center gap-0.5">
      <span className="w-6 text-[10px] text-slate-400 sm:w-7 sm:text-xs">{card}</span>
      <button
        type="button"
        onClick={() => onChange(-1)}
        disabled={value <= 0}
        aria-label={decreaseLabel}
        className="flex h-6 w-6 items-center justify-center rounded border border-slate-600 text-xs disabled:opacity-30 sm:h-7 sm:w-7"
      >
        −
      </button>
      <span aria-label={valueLabel} className="w-4 text-center font-mono text-xs sm:text-sm">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(1)}
        disabled={value >= max}
        aria-label={increaseLabel}
        className="flex h-6 w-6 items-center justify-center rounded border border-slate-600 text-xs disabled:opacity-30 sm:h-7 sm:w-7"
      >
        +
      </button>
    </div>
  )
}
