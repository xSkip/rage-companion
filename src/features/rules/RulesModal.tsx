import { useEffect, useState } from 'react'
import { useI18n } from '../../i18n/I18nContext'

export function RulesButton() {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded border border-slate-600 px-2 py-1 text-sm text-slate-300 hover:bg-slate-800"
      >
        {t('rules.trigger')}
      </button>
      {open && <RulesDialog onClose={() => setOpen(false)} />}
    </>
  )
}

interface RulesDialogProps {
  onClose: () => void
}

function RulesDialog({ onClose }: RulesDialogProps) {
  const { t } = useI18n()

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const entries = [
    { title: t('rules.jokerTitle'), text: t('rules.jokerText') },
    { title: t('rules.trumpfwechselTitle'), text: t('rules.trumpfwechselText') },
    { title: t('rules.keinTrumpfTitle'), text: t('rules.keinTrumpfText') },
    { title: t('rules.specialCardsTitle'), text: t('rules.specialCardsText') },
  ]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t('rules.title')}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded border border-slate-700 bg-slate-900 p-5 text-slate-100"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <h2 className="text-lg font-bold">{t('rules.title')}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('rules.close')}
            className="rounded border border-slate-600 px-2 py-1 text-sm hover:bg-slate-800"
          >
            ✕
          </button>
        </div>
        <dl className="flex flex-col gap-4">
          {entries.map((entry) => (
            <div key={entry.title}>
              <dt className="font-semibold text-emerald-400">{entry.title}</dt>
              <dd className="mt-1 text-sm text-slate-300">{entry.text}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}
