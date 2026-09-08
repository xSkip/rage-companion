import { RoundEntryScreen } from './features/game/RoundEntryScreen'
import { PlayerSetupScreen } from './features/setup/PlayerSetupScreen'
import { upsertRound } from './game/rounds'
import type { GameSession, RoundData } from './game/types'
import { useLocalStorageState } from './lib/useLocalStorage'

const SESSION_STORAGE_KEY = 'rage-companion:session'

function App() {
  const [session, setSession] = useLocalStorageState<GameSession | null>(SESSION_STORAGE_KEY, null)

  if (!session) {
    return (
      <div className="min-h-screen bg-slate-900">
        <PlayerSetupScreen onCreateGame={(config) => setSession({ config, rounds: [] })} />
      </div>
    )
  }

  function updateRounds(round: RoundData) {
    setSession((prev) => (prev ? { ...prev, rounds: upsertRound(prev.rounds, round) } : prev))
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <RoundEntryScreen
        config={session.config}
        rounds={session.rounds}
        onRoundComplete={updateRounds}
        onRoundEdit={updateRounds}
        onNewGame={() => setSession(null)}
      />
    </div>
  )
}

export default App
