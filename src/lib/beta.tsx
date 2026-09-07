/**
 * The open beta's one gate: an email address and two consents, in exchange for
 * the download.
 *
 * The address is collected for one reason - product news - and the form says
 * so, asks for it separately from the licence acknowledgement, and keeps both
 * answers with the record. Nothing else is collected: no tracking, no
 * fingerprint, no third party.
 *
 * Where it goes: `VITE_SIGNUP_ENDPOINT` at build time. This is a static site,
 * so there is no server of its own to receive it - point that at whatever
 * collects addresses (a form service, a function) and it is POSTed as JSON. If
 * the variable is unset, or the POST fails, the signup is still recorded on
 * the device and the download still unlocks: a collection outage must not
 * stand between someone and the software.
 */
import { createContext, use, useCallback, useMemo, useState, type ReactNode } from 'react'

const STORAGE_KEY = 'iterations.beta'
const ENDPOINT = import.meta.env.VITE_SIGNUP_ENDPOINT as string | undefined

export interface BetaSignup {
  email: string
  /** Consent to product news at this address. */
  marketing: boolean
  /** Acknowledgement of the Prosperity commercial terms. */
  licence: boolean
  at: string
  /** False when there was nowhere to send it, or sending failed. */
  delivered: boolean
}

export interface BetaState {
  signup: BetaSignup | null
  /** The gate is open on screen. */
  open: boolean
  /** Ask for the download; opens the gate unless already signed up. */
  request(): void
  dismiss(): void
  submit(email: string, consents: { marketing: boolean; licence: boolean }): Promise<void>
  signOut(): void
  /** True when an endpoint is configured, so the form can say what happens. */
  readonly hasEndpoint: boolean
}

const BetaContext = createContext<BetaState | null>(null)

function readStored(): BetaSignup | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const v = JSON.parse(raw) as Partial<BetaSignup>
    return typeof v.email === 'string' && v.marketing === true && v.licence === true ? { email: v.email, marketing: true, licence: true, at: String(v.at ?? ''), delivered: v.delivered === true } : null
  } catch {
    return null
  }
}

export function BetaProvider({ children }: { children: ReactNode }) {
  const [signup, setSignup] = useState<BetaSignup | null>(readStored)
  const [open, setOpen] = useState(false)

  const request = useCallback(() => {
    // Already signed up: the button is a plain download link and never gets here.
    setOpen(true)
  }, [])

  const dismiss = useCallback(() => setOpen(false), [])

  const submit = useCallback(async (email: string, consents: { marketing: boolean; licence: boolean }) => {
    const record: BetaSignup = { email: email.trim(), marketing: consents.marketing, licence: consents.licence, at: new Date().toISOString(), delivered: false }
    if (ENDPOINT) {
      try {
        const res = await fetch(ENDPOINT, {
          method: 'POST',
          headers: { 'content-type': 'application/json', accept: 'application/json' },
          body: JSON.stringify({ ...record, product: 'iterations', version: import.meta.env.VITE_APP_VERSION ?? '0.1.0' }),
        })
        record.delivered = res.ok
      } catch {
        // Offline, blocked, or the endpoint is down. Recorded locally instead.
      }
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(record))
    } catch {
      // Storage refused: this session still counts as signed in.
    }
    setSignup(record)
    setOpen(false)
  }, [])

  const signOut = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // Nothing to clear.
    }
    setSignup(null)
  }, [])

  const value = useMemo<BetaState>(() => ({ signup, open, request, dismiss, submit, signOut, hasEndpoint: Boolean(ENDPOINT) }), [signup, open, request, dismiss, submit, signOut])
  return <BetaContext value={value}>{children}</BetaContext>
}

// The provider and its hook belong together; see the note in i18n.tsx.
// oxlint-disable-next-line react/only-export-components
export function useBeta(): BetaState {
  const ctx = use(BetaContext)
  if (!ctx) throw new Error('useBeta must be used inside <BetaProvider>')
  return ctx
}
