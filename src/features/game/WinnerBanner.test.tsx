import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { Standing } from '../../game/standings'
import { renderWithProviders as render } from '../../test/renderWithProviders'
import { WinnerBanner } from './WinnerBanner'

const standings: Standing[] = [
  { id: 'p1', name: 'Christine', totalScore: 42 },
  { id: 'p2', name: 'Kirsten', totalScore: 42 },
  { id: 'p3', name: 'Kira', totalScore: 10 },
]

describe('WinnerBanner', () => {
  it('shows a single winner', () => {
    render(<WinnerBanner standings={standings} winnerIds={['p1']} />)
    expect(screen.getByText(/sieger: christine/i)).toBeInTheDocument()
  })

  it('shows a shared win for tied top scores', () => {
    render(<WinnerBanner standings={standings} winnerIds={['p1', 'p2']} />)
    expect(screen.getByText(/gemeinsamer sieg: christine & kirsten/i)).toBeInTheDocument()
  })

  it('renders nothing when there are no winners', () => {
    const { container } = render(<WinnerBanner standings={standings} winnerIds={[]} />)
    expect(container).toBeEmptyDOMElement()
  })
})
