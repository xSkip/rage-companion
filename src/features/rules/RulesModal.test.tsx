import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderWithProviders as render } from '../../test/renderWithProviders'
import { RulesButton } from './RulesModal'

describe('RulesButton', () => {
  it('opens the rules dialog on click and shows all rule entries', async () => {
    const user = userEvent.setup()
    render(<RulesButton />)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /regeln/i }))

    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeInTheDocument()
    expect(screen.getByText('Joker')).toBeInTheDocument()
    expect(screen.getByText('Trumpfwechsel')).toBeInTheDocument()
    expect(screen.getByText('Kein Trumpf')).toBeInTheDocument()
  })

  it('closes when the close button is clicked', async () => {
    const user = userEvent.setup()
    render(<RulesButton />)

    await user.click(screen.getByRole('button', { name: /regeln/i }))
    await user.click(screen.getByRole('button', { name: /schließen/i }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('closes when Escape is pressed', async () => {
    const user = userEvent.setup()
    render(<RulesButton />)

    await user.click(screen.getByRole('button', { name: /regeln/i }))
    await user.keyboard('{Escape}')

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
