import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { I18nProvider, useI18n } from './I18nContext'

function wrapper({ children }: { children: React.ReactNode }) {
  return <I18nProvider>{children}</I18nProvider>
}

describe('I18nContext', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('defaults to German', () => {
    const { result } = renderHook(() => useI18n(), { wrapper })
    expect(result.current.language).toBe('de')
    expect(result.current.t('setup.submit')).toBe('Partie starten')
  })

  it('interpolates variables into the translated string', () => {
    const { result } = renderHook(() => useI18n(), { wrapper })
    expect(result.current.t('round.titleNew', { round: 3, total: 10 })).toBe('Runde 3 von 10')
  })

  it('switches language and persists the choice', () => {
    const { result } = renderHook(() => useI18n(), { wrapper })
    act(() => result.current.setLanguage('en'))
    expect(result.current.language).toBe('en')
    expect(result.current.t('setup.submit')).toBe('Start game')
    expect(localStorage.getItem('rage-companion:language')).toBe(JSON.stringify('en'))
  })

  it('falls back to the key itself for an unknown translation', () => {
    const { result } = renderHook(() => useI18n(), { wrapper })
    expect(result.current.t('does.not.exist')).toBe('does.not.exist')
  })

  it('throws when used outside the provider', () => {
    const { result } = renderHook(() => {
      try {
        return useI18n()
      } catch (e) {
        return e
      }
    })
    expect(result.current).toBeInstanceOf(Error)
  })
})
