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

describe('RoundEntryScreen', () => {
  it('shows round 1 with 10 cards when no rounds have been played', () => {
    render(<RoundEntryScreen config={config} rounds={[]} onRoundComplete={vi.fn()} />)
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
    render(<RoundEntryScreen config={config} rounds={rounds} onRoundComplete={vi.fn()} />)
    expect(screen.getByRole('heading', { name: /runde 6 von 10/i })).toBeInTheDocument()
    expect(screen.getByText(/5 karten pro spieler/i)).toBeInTheDocument()
  })

  it('live-updates the round score as values are entered', async () => {
    const user = userEvent.setup()
    render(<RoundEntryScreen config={config} rounds={[]} onRoundComplete={vi.fn()} />)

    await user.type(screen.getByLabelText('Vorhersage Christine'), '2')
    await user.type(screen.getByLabelText('Stiche Christine'), '2')

    // correct prediction: 2 tricks + 10 bonus = 12
    expect(screen.getByText('12')).toBeInTheDocument()
  })

  it('shows a non-blocking warning when the tricks sum does not match the cards dealt', async () => {
    const user = userEvent.setup()
    render(<RoundEntryScreen config={config} rounds={[]} onRoundComplete={vi.fn()} />)

    await user.type(screen.getByLabelText('Stiche Christine'), '1')
    // sum of tricks (1) does not match the 10 cards dealt in round 1

    expect(screen.getByRole('alert')).toHaveTextContent(/entspricht nicht der kartenanzahl/i)
  })

  it('calls onRoundComplete with parsed values and resets the form for the next round', async () => {
    const user = userEvent.setup()
    const onRoundComplete = vi.fn()
    render(<RoundEntryScreen config={config} rounds={[]} onRoundComplete={onRoundComplete} />)

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

    // form resets for the next round
    expect(screen.getByLabelText('Vorhersage Christine')).toHaveValue(null)
  })

  it('shows the final standings once all 10 rounds are recorded', () => {
    const rounds: RoundData[] = Array.from({ length: 10 }, (_, i) => ({
      round: i + 1,
      predictions: { p1: 1, p2: 1, p3: 1 },
      tricksWon: { p1: 1, p2: 1, p3: 1 },
      specialCardPoints: { p1: 0, p2: 0, p3: 0 },
    }))
    render(<RoundEntryScreen config={config} rounds={rounds} onRoundComplete={vi.fn()} />)
    expect(screen.getByRole('heading', { name: /alle 10 runden gespielt/i })).toBeInTheDocument()
  })
})
