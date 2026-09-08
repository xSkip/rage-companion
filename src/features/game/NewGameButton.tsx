import { useState } from 'react'
import { useI18n } from '../../i18n/I18nContext'

interface NewGameButtonProps {
  onConfirm: () => void
}

export function NewGameButton({ onConfirm }: NewGameButtonProps) {
  const { t } = useI18n()
  const [confirming, setConfirming] = useState(false)

  if (confirming) {
    return (
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="text-amber-300">{t('newGame.confirmWarning')}</span>
        <button
          type="button"
          onClick={onConfirm}
          className="rounded bg-red-600 px-3 py-1 font-semibold text-white hover:bg-red-500"
        >
          {t('newGame.confirmYes')}
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="rounded border border-slate-600 px-3 py-1 hover:bg-slate-800"
        >
          {t('newGame.cancel')}
        </button>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className="rounded border border-slate-600 px-3 py-1 text-sm text-slate-300 hover:bg-slate-800"
    >
      {t('newGame.trigger')}
    </button>
  )
}
