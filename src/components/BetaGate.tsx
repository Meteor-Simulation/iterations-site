/**
 * The gate: one field, two consents, and the download.
 *
 * A dialog rather than a section, because it is an interruption, and it
 * behaves like one properly — Escape closes it and does not reach the page
 * behind, focus starts in the field and cannot leave, the page beneath does
 * not scroll, and the form unmounts on close so it never reopens half-filled.
 */
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useId, useRef, useState } from 'react'
import { isEmail } from '../lib/betaEmail'
import { useBeta } from '../lib/beta'
import { CONTACT_EMAIL, DOWNLOAD_URL } from '../lib/copy'
import { useCopy } from '../lib/i18n'
import { EASE } from '../lib/motion'

export function BetaGate() {
  const { open, dismiss } = useBeta()

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-5 py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28, ease: EASE }}
        >
          <button type="button" aria-hidden tabIndex={-1} onClick={dismiss} className="absolute inset-0 cursor-default bg-abyss/85 backdrop-blur-sm" />
          <GateForm />
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

function GateForm() {
  const { dismiss, submit, hasEndpoint } = useBeta()
  const { gate, finale } = useCopy()
  const emailId = useId()
  const errorId = useId()
  const titleId = useId()
  const dialogRef = useRef<HTMLDivElement | null>(null)
  const fieldRef = useRef<HTMLInputElement | null>(null)

  const [email, setEmail] = useState('')
  const [marketing, setMarketing] = useState(false)
  const [licence, setLicence] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => fieldRef.current?.focus(), 60)
    return () => clearTimeout(t)
  }, [])

  // Escape belongs to the dialog while it is up; nothing on the page behind
  // may also act on it. Tab is kept inside the dialog for the same reason.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        e.preventDefault()
        dismiss()
        return
      }
      if (e.key !== 'Tab' || !dialogRef.current) return
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled])')
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      } else if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      }
    }
    document.addEventListener('keydown', onKey, true)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey, true)
      document.body.style.overflow = previous
    }
  }, [dismiss])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (busy) return
    if (!isEmail(email)) {
      setError(gate.emailInvalid)
      fieldRef.current?.focus()
      return
    }
    if (!marketing || !licence) {
      setError(gate.consentRequired)
      return
    }
    setError(null)
    setBusy(true)
    await submit(email, { marketing, licence })
    // The gate has closed and the buttons behind it are download links now;
    // start the download the reader asked for rather than making them ask again.
    const a = document.createElement('a')
    a.href = DOWNLOAD_URL
    a.download = ''
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  return (
    <motion.div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="pane relative w-full max-w-lg rounded-2xl p-7 sm:p-9"
      initial={{ opacity: 0, y: 18, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.99 }}
      transition={{ duration: 0.45, ease: EASE }}
    >
      <h2 id={titleId} className="text-2xl tracking-tight text-foam">
        {gate.title}
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-mist">{gate.body}</p>

      <form onSubmit={onSubmit} className="mt-7">
        <label htmlFor={emailId} className="block text-xs uppercase tracking-wide text-mist">
          {gate.emailLabel}
        </label>
        <input
          ref={fieldRef}
          id={emailId}
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={gate.emailPlaceholder}
          aria-describedby={error ? errorId : undefined}
          className="mt-2 w-full rounded-lg border border-glow/20 bg-abyss/60 px-4 py-3 text-foam outline-none transition-colors placeholder:text-mist/50 focus:border-glow/60"
        />

        <div className="mt-5 space-y-3.5">
          <Consent checked={marketing} onChange={setMarketing} text={gate.consentMarketing} />
          <Consent checked={licence} onChange={setLicence} text={gate.consentLicence} />
        </div>

        {error ? (
          <p id={errorId} role="alert" className="mt-4 text-sm text-glow">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={busy}
          className="mt-6 w-full cursor-pointer rounded-full bg-glow px-6 py-3.5 font-semibold text-abyss transition-colors hover:bg-foam disabled:opacity-60"
        >
          {busy ? gate.submitting : gate.submit}
        </button>

        <p className="mt-4 text-xs leading-relaxed text-mist/80">
          {gate.privacy}
          {hasEndpoint ? '' : ` ${gate.offlineNote}`}{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-mist underline underline-offset-2 hover:text-glow">
            {CONTACT_EMAIL}
          </a>
        </p>
        <p className="mt-3 text-xs text-mist/70">{finale.requirements.join(' · ')}</p>
      </form>
    </motion.div>
  )
}

function Consent({ checked, onChange, text }: { checked: boolean; onChange(next: boolean): void; text: string }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-mist">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 size-4 shrink-0 cursor-pointer appearance-none rounded border border-glow/40 bg-abyss/60 transition-colors checked:border-glow checked:bg-glow"
      />
      <span>{text}</span>
    </label>
  )
}
