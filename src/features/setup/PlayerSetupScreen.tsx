import { type FormEvent, useState } from 'react'
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
      setError('Bitte für alle Spieler einen Namen eingeben.')
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
    <form onSubmit={handleSubmit} className="mx-auto flex max-w-md flex-col gap-6 p-6 text-slate-100">
      <div>
        <h1 className="text-2xl font-bold">Neue Partie</h1>
        <p className="mt-1 text-sm text-slate-400">RAGE Companion — Wertungsblatt-Ersatz</p>
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1 font-semibold">
          Spieler ({playerNames.length}/{MAX_PLAYERS})
        </legend>
        {playerNames.map((name, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              value={name}
              onChange={(event) => updateName(index, event.target.value)}
              placeholder={`Spieler ${index + 1}`}
              aria-label={`Name Spieler ${index + 1}`}
              className="flex-1 rounded border border-slate-600 bg-slate-800 px-3 py-2 focus:border-emerald-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => removePlayer(index)}
              disabled={playerNames.length <= MIN_PLAYERS}
              aria-label={`Spieler ${index + 1} entfernen`}
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
          + Spieler hinzufügen
        </button>
      </fieldset>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1 font-semibold">Regel-Varianten</legend>
        <VariantToggle
          label="Plus/Minus Eins"
          description="Die Summe der Vorhersagen darf nicht der Kartenanzahl der Runde entsprechen."
          checked={variants.plusMinusOne}
          onChange={() => toggleVariant('plusMinusOne')}
        />
        <VariantToggle
          label="Verdeckter Tipp"
          description="Vorhersagen werden geheim notiert und gleichzeitig aufgedeckt."
          checked={variants.verdeckterTipp}
          onChange={() => toggleVariant('verdeckterTipp')}
        />
        <VariantToggle
          label="Geheime Vorhersage"
          description="Vorhersagen bleiben bis zum Rundenende geheim."
          checked={variants.geheimeVorhersage}
          onChange={() => toggleVariant('geheimeVorhersage')}
        />
        <VariantToggle
          label="Durchmarsch"
          description="Doppelte Stichpunkte bei Gewinn aller Stiche einer Runde (außer Runde 10)."
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
        Partie starten
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
