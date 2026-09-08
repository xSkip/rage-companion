import { useState } from 'react'
import { RoundEntryScreen } from './features/game/RoundEntryScreen'
import { PlayerSetupScreen } from './features/setup/PlayerSetupScreen'
import type { GameConfig, RoundData } from './game/types'

function App() {
  const [game, setGame] = useState<GameConfig | null>(null)
  const [rounds, setRounds] = useState<RoundData[]>([])

  if (!game) {
    return (
      <div className="min-h-screen bg-slate-900">
        <PlayerSetupScreen onCreateGame={setGame} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <RoundEntryScreen
        config={game}
        rounds={rounds}
        onRoundComplete={(round) => setRounds((prev) => [...prev, round])}
      />
    </div>
  )
}

export default App
