import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { CompletedGame } from '../../game/history'
import { renderWithProviders as render } from '../../test/renderWithProviders'
import { HistoryScreen } from './HistoryScreen'

describe('HistoryScreen', () => {
  it('shows an empty state when no games have been completed', () => {
    render(<HistoryScreen games={[]} />)
    expect(screen.getByText(/noch keine abgeschlossene partie/i)).toBeInTheDocument()
  })

  it('shows player stats and the games list when games exist', () => {
    const games: CompletedGame[] = [
      {
        id: 'g1',
        playedAt: '2026-09-01T10:00:00.000Z',
        players: [
          { name: 'Christine', totalScore: 100 },
          { name: 'Kirsten', totalScore: 80 },
        ],
        winnerNames: ['Christine'],
      },
    ]
    render(<HistoryScreen games={games} />)

    expect(screen.getByText('Christine')).toBeInTheDocument()
    expect(screen.getByText(/1 Siege/)).toBeInTheDocument()
    expect(screen.getByText(/Sieger: Christine/)).toBeInTheDocument()
  })
})
