import { describe, expect, it } from 'vitest'
import { buildShareText } from './shareText'

describe('buildShareText', () => {
  it('formats a title, ranked standings, and a winner line', () => {
    const text = buildShareText({
      title: 'RAGE-Ergebnis',
      standings: [
        { name: 'Kira', totalScore: 120 },
        { name: 'Christine', totalScore: 110 },
      ],
      winnerLine: 'Sieger: Kira',
    })

    expect(text).toBe('RAGE-Ergebnis\n\n1. Kira: 120\n2. Christine: 110\n\nSieger: Kira')
  })
})
