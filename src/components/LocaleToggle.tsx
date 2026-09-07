/**
 * The language switch. It appears twice — once in the hero's corner and once
 * in the nav — because the nav is inert over the first screen, and the first
 * screen is exactly where someone who cannot read the default needs it. The
 * hero's copy scrolls away as the nav arrives, so only ever one is on screen.
 */
import { LOCALE_LABEL, LOCALES } from '../lib/copy'
import { useCopy, useLocale } from '../lib/i18n'

export function LocaleToggle({ className = '' }: { className?: string }) {
  const { locale, setLocale } = useLocale()
  const { nav } = useCopy()

  return (
    <div role="group" aria-label={nav.language} className={`flex items-center rounded-full border border-glow/20 p-0.5 ${className}`.trim()}>
      {LOCALES.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLocale(l)}
          aria-pressed={l === locale}
          className={`cursor-pointer rounded-full px-2.5 py-1 text-[0.68rem] font-medium transition-colors duration-200 ${l === locale ? 'bg-glow/15 text-glow' : 'text-mist hover:text-foam'}`}
        >
          {LOCALE_LABEL[l]}
        </button>
      ))}
    </div>
  )
}
