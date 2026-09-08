import { useState } from 'react'
import { useI18n } from '../../i18n/I18nContext'
import type { Standing } from '../../game/standings'
import { buildShareText } from './shareText'

type ShareFn = (data: { text: string; title: string }) => Promise<void>
type ClipboardWriteFn = (text: string) => Promise<void>

interface ShareButtonProps {
  standings: Standing[]
  winnerNames: string[]
  /**
   * Overridable for tests. `undefined` (the default) uses the real Web
   * Share API if present; pass `null` to explicitly force it unavailable.
   */
  shareFn?: ShareFn | null
  /** Same convention as shareFn, for the real Clipboard API. */
  clipboardWriteFn?: ClipboardWriteFn | null
}

function realShareFn(): ShareFn | undefined {
  return typeof navigator !== 'undefined' && navigator.share ? navigator.share.bind(navigator) : undefined
}

function realClipboardWriteFn(): ClipboardWriteFn | undefined {
  return typeof navigator !== 'undefined' && navigator.clipboard
    ? navigator.clipboard.writeText.bind(navigator.clipboard)
    : undefined
}

export function ShareButton({ standings, winnerNames, shareFn, clipboardWriteFn }: ShareButtonProps) {
  const { t } = useI18n()
  const [copied, setCopied] = useState(false)
  const [fallbackText, setFallbackText] = useState<string | null>(null)

  const share = shareFn === undefined ? realShareFn() : (shareFn ?? undefined)
  const clipboardWrite = clipboardWriteFn === undefined ? realClipboardWriteFn() : (clipboardWriteFn ?? undefined)

  async function handleShare() {
    const winnerLine =
      winnerNames.length > 1
        ? t('winner.shared', { names: winnerNames.join(' & ') })
        : t('winner.single', { name: winnerNames[0] ?? '' })
    const text = buildShareText({ title: t('share.textTitle'), standings, winnerLine })

    if (share) {
      try {
        await share({ text, title: t('share.textTitle') })
      } catch {
        // user cancelled or the share sheet failed - nothing more to do here
      }
      return
    }

    if (clipboardWrite) {
      try {
        await clipboardWrite(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
        return
      } catch {
        // fall through to the manual copy fallback below
      }
    }

    setFallbackText(text)
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={handleShare}
        className="self-start rounded border border-slate-600 px-3 py-2 text-sm hover:bg-slate-800"
      >
        {copied ? t('share.copied') : t('share.button')}
      </button>
      {fallbackText && (
        <textarea
          readOnly
          value={fallbackText}
          onFocus={(e) => e.target.select()}
          rows={standings.length + 3}
          className="w-full rounded border border-slate-600 bg-slate-800 p-2 font-mono text-xs"
        />
      )}
    </div>
  )
}
