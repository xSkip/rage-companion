import { useEffect, useState } from 'react'
import { RoundEntryScreen } from './features/game/RoundEntryScreen'
import { HistoryScreen } from './features/history/HistoryScreen'
import { RulesButton } from './features/rules/RulesModal'
import { PlayerSetupScreen } from './features/setup/PlayerSetupScreen'
import { toCompletedGame, upsertCompletedGame, type CompletedGame } from './game/history'
import { upsertRound } from './game/rounds'
import { determineWinners } from './game/scoring'
import { calculateStandings } from './game/standings'
import { TOTAL_ROUNDS, type GameSession, type RoundData } from './game/types'
import { I18nProvider, useI18n } from './i18n/I18nContext'
import { LanguageSwitcher } from './i18n/LanguageSwitcher'
import { useLocalStorageState } from './lib/useLocalStorage'

const SESSION_STORAGE_KEY = 'rage-companion:session'
const HISTORY_STORAGE_KEY = 'rage-companion:history'

function App() {
  return (
    <I18nProvider>
      <AppShell />
    </I18nProvider>
  )
}

function AppShell() {
  const { t } = useI18n()
  const [session, setSession] = useLocalStorageState<GameSession | null>(SESSION_STORAGE_KEY, null)
  const [history, setHistory] = useLocalStorageState<CompletedGame[]>(HISTORY_STORAGE_KEY, [])
  const [view, setView] = useState<'game' | 'history'>('game')

  // Archive a finished game (and keep it in sync if its rounds are corrected afterwards).
  useEffect(() => {
    if (!session || session.rounds.length < TOTAL_ROUNDS) return
    const standings = calculateStandings(session.config.players, session.rounds, session.config.variants)
    const winnerIds = determineWinners(standings)
    const completed = toCompletedGame(session, standings, winnerIds)
    setHistory((prev) => upsertCompletedGame(prev, completed))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session])

  function updateRounds(round: RoundData) {
    setSession((prev) => (prev ? { ...prev, rounds: upsertRound(prev.rounds, round) } : prev))
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="flex justify-end gap-2 p-3">
        <RulesButton />
        <button
          type="button"
          onClick={() => setView((v) => (v === 'game' ? 'history' : 'game'))}
          className="rounded border border-slate-600 px-2 py-1 text-sm text-slate-300 hover:bg-slate-800"
        >
          {view === 'game' ? t('history.trigger') : t('history.backToGame')}
        </button>
        <LanguageSwitcher />
      </div>

      {view === 'history' ? (
        <HistoryScreen games={history} />
      ) : !session ? (
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
  )
}

export default App
