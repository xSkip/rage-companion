import { type FormEvent, useState } from 'react'
import { useI18n } from '../../i18n/I18nContext'
import { MAX_PLAYERS, MIN_PLAYERS, type GameConfig, type GameVariants } from '../../game/types'

interface PlayerSetupScreenProps {
  onCreateGame: (config: GameConfig) => void
}

const DEFAULT_VARIANTS: GameVariants = {
  plusMinusOne: false,
  verdeckterTipp: false,
  geheimeVorhersage: false,
  durchmarsch: false,
}

function createId(): string {
  return crypto.randomUUID()
}

export function PlayerSetupScreen({ onCreateGame }: PlayerSetupScreenProps) {
  const { t } = useI18n()
  const [playerNames, setPlayerNames] = useState<string[]>(['', '', ''])
  const [variants, setVariants] = useState<GameVariants>(DEFAULT_VARIANTS)
  const [error, setError] = useState<string | null>(null)

  function updateName(index: number, value: string) {
    setPlayerNames((prev) => prev.map((name, i) => (i === index ? value : name)))
  }

  function addPlayer() {
    setPlayerNames((prev) => (prev.length >= MAX_PLAYERS ? prev : [...prev, '']))
  }

  function removePlayer(index: number) {
    setPlayerNames((prev) => (prev.length <= MIN_PLAYERS ? prev : prev.filter((_, i) => i !== index)))
  }

  function toggleVariant(key: keyof GameVariants) {
    setVariants((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const trimmedNames = playerNames.map((name) => name.trim())

    if (trimmedNames.some((name) => name.length === 0)) {
      setError(t('setup.errorMissingName'))
      return
    }

    setError(null)
    const config: GameConfig = {
      id: createId(),
      players: trimmedNames.map((name) => ({ id: createId(), name })),
      variants,
      createdAt: new Date().toISOString(),
    }
    onCreateGame(config)
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex max-w-md flex-col gap-6 p-4 text-slate-100 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold">{t('setup.title')}</h1>
        <p className="mt-1 text-sm text-slate-400">{t('setup.subtitle')}</p>
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1 font-semibold">
          {t('setup.playersLegend', { count: playerNames.length, max: MAX_PLAYERS })}
        </legend>
        {playerNames.map((name, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              value={name}
              onChange={(event) => updateName(index, event.target.value)}
              placeholder={t('setup.playerPlaceholder', { index: index + 1 })}
              aria-label={t('setup.playerNameLabel', { index: index + 1 })}
              className="flex-1 rounded border border-slate-600 bg-slate-800 px-3 py-2 focus:border-emerald-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => removePlayer(index)}
              disabled={playerNames.length <= MIN_PLAYERS}
              aria-label={t('setup.removePlayerLabel', { index: index + 1 })}
              className="rounded border border-slate-600 px-3 py-2 disabled:opacity-30"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addPlayer}
          disabled={playerNames.length >= MAX_PLAYERS}
          className="mt-1 rounded border border-dashed border-slate-600 px-3 py-2 text-sm disabled:opacity-30"
        >
          {t('setup.addPlayer')}
        </button>
      </fieldset>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1 font-semibold">{t('setup.variantsLegend')}</legend>
        <VariantToggle
          label={t('setup.variantPlusMinusOneLabel')}
          description={t('setup.variantPlusMinusOneDescription')}
          checked={variants.plusMinusOne}
          onChange={() => toggleVariant('plusMinusOne')}
        />
        <VariantToggle
          label={t('setup.variantVerdeckterTippLabel')}
          description={t('setup.variantVerdeckterTippDescription')}
          checked={variants.verdeckterTipp}
          onChange={() => toggleVariant('verdeckterTipp')}
        />
        <VariantToggle
          label={t('setup.variantGeheimeVorhersageLabel')}
          description={t('setup.variantGeheimeVorhersageDescription')}
          checked={variants.geheimeVorhersage}
          onChange={() => toggleVariant('geheimeVorhersage')}
        />
        <VariantToggle
          label={t('setup.variantDurchmarschLabel')}
          description={t('setup.variantDurchmarschDescription')}
          checked={variants.durchmarsch}
          onChange={() => toggleVariant('durchmarsch')}
        />
      </fieldset>

      {error && (
        <p role="alert" className="rounded border border-red-500 bg-red-950 px-3 py-2 text-sm text-red-200">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="rounded bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-500"
      >
        {t('setup.submit')}
      </button>
    </form>
  )
}

interface VariantToggleProps {
  label: string
  description: string
  checked: boolean
  onChange: () => void
}

function VariantToggle({ label, description, checked, onChange }: VariantToggleProps) {
  return (
    <label className="flex cursor-pointer items-start gap-2 rounded border border-slate-700 p-2 hover:bg-slate-800">
      <input type="checkbox" checked={checked} onChange={onChange} className="mt-1" />
      <span>
        <span className="block font-medium">{label}</span>
        <span className="block text-xs text-slate-400">{description}</span>
      </span>
    </label>
  )
}
