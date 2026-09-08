import { useState } from 'react'
import { PlayerSetupScreen } from './features/setup/PlayerSetupScreen'
import type { GameConfig } from './game/types'

function App() {
  const [game, setGame] = useState<GameConfig | null>(null)

  if (!game) {
    return (
      <div className="min-h-screen bg-slate-900">
        <PlayerSetupScreen onCreateGame={setGame} />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-900 p-6 text-center text-slate-100">
      <h1 className="text-2xl font-bold">Partie gestartet</h1>
      <p className="text-slate-400">{game.players.map((p) => p.name).join(', ')}</p>
      <p className="text-sm text-slate-500">Rundenraster folgt in Meilenstein 4.</p>
    </div>
  )
}

export default App
