import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { useLocalStorageState } from '../lib/useLocalStorage'
import de from './dictionaries/de'
import en from './dictionaries/en'

export type Language = 'de' | 'en'

const dictionaries = { de, en }

type Vars = Record<string, string | number>

function resolve(dict: unknown, key: string): string {
  const value = key.split('.').reduce<unknown>((obj, part) => (obj as Record<string, unknown> | undefined)?.[part], dict)
  return typeof value === 'string' ? value : key
}

function interpolate(template: string, vars?: Vars): string {
  if (!vars) return template
  return template.replace(/\{\{(\w+)\}\}/g, (_, name: string) => String(vars[name] ?? ''))
}

interface I18nContextValue {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string, vars?: Vars) => string
}

const I18nContext = createContext<I18nContextValue | null>(null)

const LANGUAGE_STORAGE_KEY = 'rage-companion:language'

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useLocalStorageState<Language>(LANGUAGE_STORAGE_KEY, 'de')

  const value = useMemo<I18nContextValue>(() => {
    const dict = dictionaries[language]
    return {
      language,
      setLanguage,
      t: (key, vars) => interpolate(resolve(dict, key), vars),
    }
  }, [language, setLanguage])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}
