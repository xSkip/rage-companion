import { useI18n } from './I18nContext'

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useI18n()

  return (
    <div className="flex items-center gap-1 text-sm" aria-label={t('language.label')}>
      <button
        type="button"
        onClick={() => setLanguage('de')}
        aria-pressed={language === 'de'}
        className={`rounded border px-2 py-1 ${
          language === 'de' ? 'border-emerald-500 bg-emerald-950 text-emerald-200' : 'border-slate-600 text-slate-400'
        }`}
      >
        DE
      </button>
      <button
        type="button"
        onClick={() => setLanguage('en')}
        aria-pressed={language === 'en'}
        className={`rounded border px-2 py-1 ${
          language === 'en' ? 'border-emerald-500 bg-emerald-950 text-emerald-200' : 'border-slate-600 text-slate-400'
        }`}
      >
        EN
      </button>
    </div>
  )
}
