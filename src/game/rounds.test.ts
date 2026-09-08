import { describe, expect, it } from 'vitest'
import { upsertRound } from './rounds'
import type { RoundData } from './types'

function makeRound(round: number): RoundData {
  return { round, predictions: {}, tricksWon: {}, specialCardPoints: {} }
}

describe('upsertRound', () => {
  it('appends a new round to an empty list', () => {
    const result = upsertRound([], makeRound(1))
    expect(result.map((r) => r.round)).toEqual([1])
  })

  it('appends subsequent rounds in order', () => {
    const result = upsertRound([makeRound(1), makeRound(2)], makeRound(3))
    expect(result.map((r) => r.round)).toEqual([1, 2, 3])
  })

  it('replaces an existing round instead of duplicating it', () => {
    const original = makeRound(2)
    original.tricksWon = { p1: 3 }
    const edited = makeRound(2)
    edited.tricksWon = { p1: 5 }

    const result = upsertRound([makeRound(1), original, makeRound(3)], edited)
    expect(result.map((r) => r.round)).toEqual([1, 2, 3])
    expect(result.find((r) => r.round === 2)?.tricksWon).toEqual({ p1: 5 })
  })
})
