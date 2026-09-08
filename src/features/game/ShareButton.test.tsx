import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { Standing } from '../../game/standings'
import { renderWithProviders as render } from '../../test/renderWithProviders'
import { ShareButton } from './ShareButton'

const standings: Standing[] = [
  { id: 'p1', name: 'Kira', totalScore: 120 },
  { id: 'p2', name: 'Christine', totalScore: 110 },
]

describe('ShareButton', () => {
  it('uses the Web Share API when available', async () => {
    const shareFn = vi.fn().mockResolvedValue(undefined)

    const user = userEvent.setup()
    render(<ShareButton standings={standings} winnerNames={['Kira']} shareFn={shareFn} />)

    await user.click(screen.getByRole('button', { name: /ergebnis teilen/i }))

    expect(shareFn).toHaveBeenCalledTimes(1)
    const arg = shareFn.mock.calls[0][0]
    expect(arg.text).toContain('1. Kira: 120')
    expect(arg.text).toContain('Sieger: Kira')
  })

  it('falls back to the clipboard when Web Share is unavailable', async () => {
    const clipboardWriteFn = vi.fn().mockResolvedValue(undefined)

    const user = userEvent.setup()
    render(
      <ShareButton
        standings={standings}
        winnerNames={['Kira']}
        shareFn={null}
        clipboardWriteFn={clipboardWriteFn}
      />,
    )

    await user.click(screen.getByRole('button', { name: /ergebnis teilen/i }))

    expect(clipboardWriteFn).toHaveBeenCalledTimes(1)
    expect(clipboardWriteFn.mock.calls[0][0]).toContain('1. Kira: 120')
    expect(await screen.findByText(/in zwischenablage kopiert/i)).toBeInTheDocument()
  })

  it('shows a manual copy fallback when neither share nor clipboard are available', async () => {
    const user = userEvent.setup()
    render(<ShareButton standings={standings} winnerNames={['Kira']} shareFn={null} clipboardWriteFn={null} />)

    await user.click(screen.getByRole('button', { name: /ergebnis teilen/i }))

    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement
    expect(textarea.value).toContain('1. Kira: 120')
  })

  it('formats a shared win with both names', async () => {
    const shareFn = vi.fn().mockResolvedValue(undefined)

    const user = userEvent.setup()
    render(<ShareButton standings={standings} winnerNames={['Kira', 'Christine']} shareFn={shareFn} />)

    await user.click(screen.getByRole('button', { name: /ergebnis teilen/i }))

    expect(shareFn.mock.calls[0][0].text).toContain('Gemeinsamer Sieg: Kira & Christine')
  })
})
