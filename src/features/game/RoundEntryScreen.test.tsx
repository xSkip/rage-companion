import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { GameConfig, RoundData } from '../../game/types'
import { RoundEntryScreen } from './RoundEntryScreen'

const config: GameConfig = {
  id: 'game-1',
  players: [
    { id: 'p1', name: 'Christine' },
    { id: 'p2', name: 'Kirsten' },
    { id: 'p3', name: 'Kira' },
  ],
  variants: { plusMinusOne: false, verdeckterTipp: false, geheimeVorhersage: false, durchmarsch: false },
  createdAt: new Date().toISOString(),
}

function renderScreen(rounds: RoundData[] = [], overrides: Partial<Parameters<typeof RoundEntryScreen>[0]> = {}) {
  const onRoundComplete = vi.fn()
  const onRoundEdit = vi.fn()
  const onNewGame = vi.fn()
  const utils = render(
    <RoundEntryScreen
      config={config}
      rounds={rounds}
      onRoundComplete={onRoundComplete}
      onRoundEdit={onRoundEdit}
      onNewGame={onNewGame}
      {...overrides}
    />,
  )
  return { ...utils, onRoundComplete, onRoundEdit, onNewGame }
}

describe('RoundEntryScreen', () => {
  it('shows round 1 with 10 cards when no rounds have been played', () => {
    renderScreen([])
    expect(screen.getByRole('heading', { name: /runde 1 von 10/i })).toBeInTheDocument()
    expect(screen.getByText(/10 karten pro spieler/i)).toBeInTheDocument()
  })

  it('shows round 6 with 5 cards after 5 rounds are recorded', () => {
    const rounds: RoundData[] = Array.from({ length: 5 }, (_, i) => ({
      round: i + 1,
      predictions: { p1: 1, p2: 1, p3: 1 },
      tricksWon: { p1: 1, p2: 1, p3: 1 },
      specialCardPoints: { p1: 0, p2: 0, p3: 0 },
    }))
    renderScreen(rounds)
    expect(screen.getByRole('heading', { name: /runde 6 von 10/i })).toBeInTheDocument()
    expect(screen.getByText(/5 karten pro spieler/i)).toBeInTheDocument()
  })

  it('live-updates the round score as values are entered', async () => {
    const user = userEvent.setup()
    renderScreen([])

    await user.type(screen.getByLabelText('Vorhersage Christine'), '2')
    await user.type(screen.getByLabelText('Stiche Christine'), '2')

    expect(screen.getByText('12')).toBeInTheDocument()
  })

  it('shows a non-blocking warning when the tricks sum does not match the cards dealt', async () => {
    const user = userEvent.setup()
    renderScreen([])

    await user.type(screen.getByLabelText('Stiche Christine'), '1')

    expect(screen.getByRole('alert')).toHaveTextContent(/entspricht nicht der kartenanzahl/i)
  })

  it('calls onRoundComplete with parsed values; the parent advancing `rounds` resets the form', async () => {
    const user = userEvent.setup()
    const { onRoundComplete, rerender } = renderScreen([])

    await user.type(screen.getByLabelText('Vorhersage Christine'), '2')
    await user.type(screen.getByLabelText('Stiche Christine'), '2')
    await user.type(screen.getByLabelText('Vorhersage Kirsten'), '3')
    await user.type(screen.getByLabelText('Stiche Kirsten'), '3')
    await user.type(screen.getByLabelText('Vorhersage Kira'), '5')
    await user.type(screen.getByLabelText('Stiche Kira'), '5')

    await user.click(screen.getByRole('button', { name: /runde 1 abschließen/i }))

    expect(onRoundComplete).toHaveBeenCalledTimes(1)
    const round = onRoundComplete.mock.calls[0][0] as RoundData
    expect(round.round).toBe(1)
    expect(round.predictions).toEqual({ p1: 2, p2: 3, p3: 5 })
    expect(round.tricksWon).toEqual({ p1: 2, p2: 3, p3: 5 })

    // simulate the parent (App) appending the completed round, as it does in the real app
    rerender(
      <RoundEntryScreen
        config={config}
        rounds={[round]}
        onRoundComplete={onRoundComplete}
        onRoundEdit={vi.fn()}
        onNewGame={vi.fn()}
      />,
    )
    expect(screen.getByRole('heading', { name: /runde 2 von 10/i })).toBeInTheDocument()
    expect(screen.getByLabelText('Vorhersage Christine')).toHaveValue(null)
  })

  it('shows the final standings once all 10 rounds are recorded', () => {
    const rounds: RoundData[] = Array.from({ length: 10 }, (_, i) => ({
      round: i + 1,
      predictions: { p1: 1, p2: 1, p3: 1 },
      tricksWon: { p1: 1, p2: 1, p3: 1 },
      specialCardPoints: { p1: 0, p2: 0, p3: 0 },
    }))
    renderScreen(rounds)
    expect(screen.getByRole('heading', { name: /alle 10 runden gespielt/i })).toBeInTheDocument()
  })

  it('highlights the single winner once the game is finished', () => {
    // p3 predicts and wins more tricks every round -> clear leader
    const rounds: RoundData[] = Array.from({ length: 10 }, (_, i) => ({
      round: i + 1,
      predictions: { p1: 1, p2: 1, p3: 2 },
      tricksWon: { p1: 1, p2: 1, p3: 2 },
      specialCardPoints: { p1: 0, p2: 0, p3: 0 },
    }))
    renderScreen(rounds)
    expect(screen.getByText(/^🏆 sieger: kira$/i)).toBeInTheDocument()
  })

  it('shows a shared win banner when players are tied for first after round 10', () => {
    const rounds: RoundData[] = Array.from({ length: 10 }, (_, i) => ({
      round: i + 1,
      predictions: { p1: 1, p2: 1, p3: 0 },
      tricksWon: { p1: 1, p2: 1, p3: 0 },
      specialCardPoints: { p1: 0, p2: 0, p3: 0 },
    }))
    renderScreen(rounds)
    expect(screen.getByText(/gemeinsamer sieg: christine & kirsten/i)).toBeInTheDocument()
  })

  describe('editing a previous round', () => {
    const existingRound: RoundData = {
      round: 1,
      predictions: { p1: 2, p2: 3, p3: 5 },
      tricksWon: { p1: 2, p2: 3, p3: 5 },
      specialCardPoints: { p1: 0, p2: 0, p3: 0 },
    }

    it('lists recorded rounds with per-player scores and an edit button', () => {
      renderScreen([existingRound])
      expect(screen.getByText(/runde 1:/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /bearbeiten/i })).toBeInTheDocument()
    })

    it('pre-fills the form with the round being edited and calls onRoundEdit on save', async () => {
      const user = userEvent.setup()
      const { onRoundEdit } = renderScreen([existingRound])

      await user.click(screen.getByRole('button', { name: /bearbeiten/i }))

      expect(screen.getByRole('heading', { name: /runde 1 bearbeiten/i })).toBeInTheDocument()
      expect(screen.getByLabelText('Vorhersage Christine')).toHaveValue(2)

      await user.clear(screen.getByLabelText('Stiche Christine'))
      await user.type(screen.getByLabelText('Stiche Christine'), '4')
      await user.click(screen.getByRole('button', { name: /runde 1 speichern/i }))

      expect(onRoundEdit).toHaveBeenCalledTimes(1)
      const edited = onRoundEdit.mock.calls[0][0] as RoundData
      expect(edited.tricksWon.p1).toBe(4)
    })

    it('does not advance to a new round while editing an earlier one, even if the game is finished', async () => {
      const user = userEvent.setup()
      const allRounds: RoundData[] = Array.from({ length: 10 }, (_, i) => ({
        round: i + 1,
        predictions: { p1: 1, p2: 1, p3: 1 },
        tricksWon: { p1: 1, p2: 1, p3: 1 },
        specialCardPoints: { p1: 0, p2: 0, p3: 0 },
      }))
      renderScreen(allRounds)

      const editButtons = screen.getAllByRole('button', { name: /bearbeiten/i })
      await user.click(editButtons[0])

      expect(screen.getByRole('heading', { name: /runde 1 bearbeiten/i })).toBeInTheDocument()
      expect(screen.queryByRole('heading', { name: /alle 10 runden gespielt/i })).not.toBeInTheDocument()
    })

    it('cancels editing without calling onRoundEdit', async () => {
      const user = userEvent.setup()
      const { onRoundEdit } = renderScreen([existingRound])

      await user.click(screen.getByRole('button', { name: /bearbeiten/i }))
      await user.click(screen.getByRole('button', { name: /abbrechen/i }))

      expect(screen.getByRole('heading', { name: /runde 2 von 10/i })).toBeInTheDocument()
      expect(onRoundEdit).not.toHaveBeenCalled()
    })
  })

  describe('starting a new game', () => {
    it('requires a confirmation click before calling onNewGame', async () => {
      const user = userEvent.setup()
      const { onNewGame } = renderScreen([])

      await user.click(screen.getByRole('button', { name: /^neue partie$/i }))
      expect(onNewGame).not.toHaveBeenCalled()

      await user.click(screen.getByRole('button', { name: /ja, neue partie/i }))
      expect(onNewGame).toHaveBeenCalledTimes(1)
    })
  })
})
