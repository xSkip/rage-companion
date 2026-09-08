import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { useLocalStorageState } from './useLocalStorage'

describe('useLocalStorageState', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns the initial value when nothing is stored', () => {
    const { result } = renderHook(() => useLocalStorageState('test-key', 'default'))
    expect(result.current[0]).toBe('default')
  })

  it('persists updates to localStorage', () => {
    const { result } = renderHook(() => useLocalStorageState('test-key', 'default'))
    act(() => result.current[1]('updated'))
    expect(localStorage.getItem('test-key')).toBe(JSON.stringify('updated'))
  })

  it('restores a previously stored value on next mount', () => {
    localStorage.setItem('test-key', JSON.stringify({ foo: 'bar' }))
    const { result } = renderHook(() => useLocalStorageState('test-key', { foo: 'default' }))
    expect(result.current[0]).toEqual({ foo: 'bar' })
  })

  it('falls back to the initial value on corrupt stored JSON', () => {
    localStorage.setItem('test-key', '{not valid json')
    const { result } = renderHook(() => useLocalStorageState('test-key', 'default'))
    expect(result.current[0]).toBe('default')
  })
})
