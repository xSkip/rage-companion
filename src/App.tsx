import { RoundEntryScreen } from './features/game/RoundEntryScreen'
import { PlayerSetupScreen } from './features/setup/PlayerSetupScreen'
import { upsertRound } from './game/rounds'
import type { GameSession, RoundData } from './game/types'
import { I18nProvider } from './i18n/I18nContext'
import { LanguageSwitcher } from './i18n/LanguageSwitcher'
import { useLocalStorageState } from './lib/useLocalStorage'

const SESSION_STORAGE_KEY = 'rage-companion:session'

function App() {
  const [session, setSession] = useLocalStorageState<GameSession | null>(SESSION_STORAGE_KEY, null)

  function updateRounds(round: RoundData) {
    setSession((prev) => (prev ? { ...prev, rounds: upsertRound(prev.rounds, round) } : prev))
  }

  return (
    <I18nProvider>
      <div className="min-h-screen bg-slate-900">
        <div className="flex justify-end p-3">
          <LanguageSwitcher />
        </div>
        {!session ? (
          <PlayerSetupScreen onCreateGame={(config) => setSession({ config, rounds: [] })} />
        ) : (
          <RoundEntryScreen
            config={session.config}
            rounds={session.rounds}
            onRoundComplete={updateRounds}
            onRoundEdit={updateRounds}
            onNewGame={() => setSession(null)}
          />
        )}
      </div>
    </I18nProvider>
  )
}

export default App
