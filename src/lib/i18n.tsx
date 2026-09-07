/**
 * Locale state for the page. English is the default; a choice is remembered on
 * the device and nowhere else.
 *
 * Sections read `useCopy()` and get one language's whole copy object, so a
 * component never sees a locale — the only place that knows is the toggle.
 */
import { createContext, use, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { COPY, DEFAULT_LOCALE, LOCALES, type Copy, type Locale } from './copy'

const STORAGE_KEY = 'iterations.locale'

interface LocaleContextValue {
  locale: Locale
  setLocale(next: Locale): void
  copy: Copy
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

function isLocale(v: unknown): v is Locale {
  return typeof v === 'string' && (LOCALES as readonly string[]).includes(v)
}

/**
 * A stored choice wins; otherwise English, always. The browser's own language
 * is deliberately not consulted - the default is a decision, not a guess, and
 * the toggle is on the first screen for anyone it does not suit.
 */
function initialLocale(): Locale {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (isLocale(stored)) return stored
  } catch {
    // Private window or blocked storage: fall through to the default.
  }
  return DEFAULT_LOCALE
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale)

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Not remembering the choice is not a reason to refuse to make it.
    }
  }, [])

  // Screen readers and the browser's own hyphenation need the real language.
  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  const value = useMemo<LocaleContextValue>(() => ({ locale, setLocale, copy: COPY[locale] }), [locale, setLocale])
  return <LocaleContext value={value}>{children}</LocaleContext>
}

function useLocaleContext(): LocaleContextValue {
  const ctx = use(LocaleContext)
  if (!ctx) throw new Error('useCopy must be used inside <LocaleProvider>')
  return ctx
}

// The provider and its hooks belong together; splitting them to satisfy fast
// refresh would spread one concept over three files for a dev-only nicety.
/** The whole copy object for the current language. */
// oxlint-disable-next-line react/only-export-components
export function useCopy(): Copy {
  return useLocaleContext().copy
}

/** For the toggle, which is the only thing that needs to know which language it is. */
// oxlint-disable-next-line react/only-export-components
export function useLocale(): { locale: Locale; setLocale(next: Locale): void } {
  const { locale, setLocale } = useLocaleContext()
  return { locale, setLocale }
}
