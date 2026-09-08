import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { MAX_PLAYERS, MIN_PLAYERS } from '../../game/types'
import { PlayerSetupScreen } from './PlayerSetupScreen'

describe('PlayerSetupScreen', () => {
  it('starts with the minimum number of player fields', () => {
    render(<PlayerSetupScreen onCreateGame={vi.fn()} />)
    expect(screen.getAllByRole('textbox')).toHaveLength(MIN_PLAYERS)
  })

  it('allows adding players up to the maximum', async () => {
    const user = userEvent.setup()
    render(<PlayerSetupScreen onCreateGame={vi.fn()} />)

    const addButton = screen.getByRole('button', { name: /spieler hinzufügen/i })
    for (let i = MIN_PLAYERS; i < MAX_PLAYERS; i++) {
      await user.click(addButton)
    }

    expect(screen.getAllByRole('textbox')).toHaveLength(MAX_PLAYERS)
    expect(addButton).toBeDisabled()
  })

  it('does not allow removing players below the minimum', async () => {
    const user = userEvent.setup()
    render(<PlayerSetupScreen onCreateGame={vi.fn()} />)

    const removeButtons = screen.getAllByRole('button', { name: /entfernen/i })
    expect(removeButtons[0]).toBeDisabled()
    await user.click(removeButtons[0])
    expect(screen.getAllByRole('textbox')).toHaveLength(MIN_PLAYERS)
  })

  it('shows an error and does not submit when a player name is missing', async () => {
    const user = userEvent.setup()
    const onCreateGame = vi.fn()
    render(<PlayerSetupScreen onCreateGame={onCreateGame} />)

    await user.type(screen.getByLabelText('Name Spieler 1'), 'Christine')
    await user.type(screen.getByLabelText('Name Spieler 2'), 'Kirsten')
    // Spieler 3 left empty

    await user.click(screen.getByRole('button', { name: /partie starten/i }))

    expect(screen.getByRole('alert')).toHaveTextContent(/namen eingeben/i)
    expect(onCreateGame).not.toHaveBeenCalled()
  })

  it('creates a game with trimmed player names and chosen variants on valid submit', async () => {
    const user = userEvent.setup()
    const onCreateGame = vi.fn()
    render(<PlayerSetupScreen onCreateGame={onCreateGame} />)

    await user.type(screen.getByLabelText('Name Spieler 1'), '  Christine  ')
    await user.type(screen.getByLabelText('Name Spieler 2'), 'Kirsten')
    await user.type(screen.getByLabelText('Name Spieler 3'), 'Kira')
    await user.click(screen.getByLabelText(/durchmarsch/i))

    await user.click(screen.getByRole('button', { name: /partie starten/i }))

    expect(onCreateGame).toHaveBeenCalledTimes(1)
    const config = onCreateGame.mock.calls[0][0]
    expect(config.players.map((p: { name: string }) => p.name)).toEqual(['Christine', 'Kirsten', 'Kira'])
    expect(config.variants.durchmarsch).toBe(true)
    expect(config.variants.plusMinusOne).toBe(false)
    expect(config.id).toBeTruthy()
  })
})
