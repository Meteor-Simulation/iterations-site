/**
 * The close. The reader has been shown the product for six screens; here they
 * touch it. The chat is scripted — a static page has no model behind it — so
 * the honesty is in the third line: the answer stops exactly where the reader's
 * own GPU would have to start, and the installer is what stands in that gap.
 *
 * Principle 4 still binds: the beats run once per question, the typing dots are
 * the only loop and they exist only while the reader waits for them, and the
 * glow blooms one time as the download arrives and then sits still.
 *
 * The heading is the page's second --text-major, the same step as the turn at
 * the mesh: the descent opened on one large sentence and it closes on one, and
 * the four sections in between are visibly the argument, not the frame.
 */
import { motion } from 'motion/react'
import type { FormEvent, KeyboardEvent } from 'react'
import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { GatedDownload } from '../components/DownloadButton'
import { useCopy } from '../lib/i18n'
import { EASE, enterSlow, inViewEarly, line, prefersReducedMotion, rise, stagger } from '../lib/motion'

type Role = 'user' | 'assistant'
type Message = { id: number; role: Role; text: string }

/** Slow enough to read as thought, short enough that nobody taps send twice. */
const BEATS = [560, 820, 900]

/** Anything longer is a paste, not a question, and it wrecks the bubble. */
const MAX_CHARS = 200

function wait(ms: number, timers: { current: number[] }): Promise<void> {
  return new Promise((resolve) => {
    timers.current.push(window.setTimeout(resolve, ms))
  })
}

/**
 * The conversation state machine. A run counter rather than a lock: asking
 * again abandons any beats still in flight instead of interleaving them.
 */
function useScriptedChat(reduced: boolean) {
  const { finale } = useCopy()
  const [messages, setMessages] = useState<Message[]>([])
  const [typing, setTyping] = useState(false)
  const [busy, setBusy] = useState(false)
  const [revealed, setRevealed] = useState(false)

  const timers = useRef<number[]>([])
  const run = useRef(0)
  const seq = useRef(0)

  useEffect(() => {
    const pending = timers.current
    return () => {
      for (const id of pending) window.clearTimeout(id)
    }
  }, [])

  const push = useCallback((role: Role, text: string) => {
    seq.current += 1
    const id = seq.current
    setMessages((prev) => [...prev, { id, role, text }])
  }, [])

  const ask = useCallback(
    async (question: string) => {
      run.current += 1
      const mine = run.current

      push('user', question)
      const lines = finale.reply(question)

      // Reduced motion: no beats at all — the whole answer and the download at once.
      if (reduced) {
        for (const text of lines) push('assistant', text)
        setRevealed(true)
        return
      }

      setBusy(true)
      for (let i = 0; i < lines.length; i += 1) {
        setTyping(true)
        await wait(BEATS[i] ?? 800, timers)
        if (run.current !== mine) return
        setTyping(false)
        push('assistant', lines[i] ?? '')
      }
      setBusy(false)
      setRevealed(true)
    },
    [push, reduced, finale],
  )

  return { messages, typing, busy, revealed, ask }
}

function AssistantMark() {
  return (
    <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-md border border-tide/30 bg-sea/60 text-glow">
      <svg viewBox="0 0 16 16" className="size-3.5" fill="currentColor" aria-hidden="true">
        <path d="M8 0c.42 3.9 3.68 7.16 8 8-4.32.84-7.58 4.1-8 8-.42-3.9-3.68-7.16-8-8 4.32-.84 7.58-4.1 8-8Z" />
      </svg>
    </span>
  )
}

export function Finale() {
  const { finale } = useCopy()
  const [reduced] = useState(prefersReducedMotion)
  const { messages, typing, busy, revealed, ask } = useScriptedChat(reduced)

  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const revealRef = useRef<HTMLDivElement>(null)
  const inputId = useId()
  const ctaId = useId()

  const canSend = value.trim().length > 0 && !busy
  const hasThread = messages.length > 0 || typing

  // The thread scrolls inside the pane, never the page: the download has to stay
  // where the reader last saw it while an answer streams in above it.
  useEffect(() => {
    const el = listRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, typing])

  // On a phone the reveal lands under the fold, and the climax of the page must
  // not be something the reader has to go looking for. Only if it is actually
  // out of view, and only the once.
  useEffect(() => {
    const el = revealRef.current
    if (!revealed || !el) return
    if (el.getBoundingClientRect().bottom <= window.innerHeight) return
    el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'end' })
  }, [revealed, reduced])

  const send = useCallback(() => {
    const question = value.trim()
    if (!question || busy) return
    setValue('')
    void ask(question)
    inputRef.current?.focus()
  }, [ask, busy, value])

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    send()
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    // First line, always: Enter is how a Korean IME commits a word, so an Enter
    // that is still composing must never reach the send path.
    if (e.nativeEvent.isComposing) return
    if (e.key !== 'Enter' || e.shiftKey) return
    e.preventDefault()
    send()
  }

  function fill(suggestion: string) {
    setValue(suggestion)
    requestAnimationFrame(() => {
      const el = inputRef.current
      if (!el) return
      el.focus()
      el.setSelectionRange(el.value.length, el.value.length)
    })
  }

  return (
    <section id="finale" className="relative isolate overflow-hidden bg-abyss scroll-mt-24">
      <div className="mx-auto flex min-h-[100svh] w-full max-w-5xl flex-col justify-center gap-10 px-6 py-20 sm:px-8 sm:py-28 lg:gap-14">
        <motion.header
          className="mx-auto flex max-w-3xl flex-col items-center text-center"
          variants={stagger(0.1)}
          initial={reduced ? false : 'hidden'}
          whileInView="show"
          viewport={inViewEarly}
        >
          <motion.span variants={rise} className="rule-glow h-px w-20" aria-hidden="true" />
          <motion.p variants={rise} className="font-mono mt-6 text-xs tracking-[0.28em] text-glow/85">
            {finale.kicker}
          </motion.p>
          <h2 className="mt-5 text-major">
            {finale.title.split('\n').map((l) => (
              <motion.span key={l} variants={line} className="block">
                {l}
              </motion.span>
            ))}
          </h2>
          <motion.p variants={rise} className="mt-6 max-w-2xl text-lead text-mist">
            {finale.lead}
          </motion.p>
        </motion.header>

        <motion.div
          className="pane mx-auto w-full max-w-3xl rounded-2xl p-3 sm:p-4"
          variants={rise}
          initial={reduced ? false : 'hidden'}
          whileInView="show"
          viewport={inViewEarly}
        >
          <ul
            ref={listRef}
            aria-live="polite"
            aria-busy={busy}
            className={
              hasThread
                ? 'mb-3 flex max-h-[38svh] flex-col gap-3 overflow-y-auto px-1 py-1 sm:max-h-[34svh]'
                : 'sr-only'
            }
          >
            {messages.map((m) => (
              <motion.li
                key={m.id}
                className={m.role === 'user' ? 'flex justify-end' : 'flex min-w-0 gap-3'}
                variants={rise}
                initial={reduced ? false : 'hidden'}
                animate="show"
              >
                <span className="sr-only">{m.role === 'user' ? finale.a11y.you : finale.a11y.assistant}</span>
                {m.role === 'assistant' && <AssistantMark />}
                <p
                  className={
                    m.role === 'user'
                      ? 'max-w-[46ch] rounded-2xl rounded-br-sm bg-tide/80 px-4 py-2.5 text-sm leading-relaxed break-words text-foam sm:text-base'
                      : 'max-w-[52ch] rounded-2xl rounded-tl-sm border border-tide/25 bg-deep/70 px-4 py-2.5 text-sm leading-relaxed break-words text-foam sm:text-base'
                  }
                >
                  {m.text}
                </p>
              </motion.li>
            ))}

            {typing && (
              <li className="flex gap-3" aria-hidden="true">
                <AssistantMark />
                <span className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm border border-tide/25 bg-deep/70 px-4 py-3.5">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="size-1.5 rounded-full bg-glow"
                      initial={{ opacity: 0.25 }}
                      animate={{ opacity: 1 }}
                      transition={{
                        duration: 0.7,
                        ease: EASE,
                        delay: i * 0.14,
                        repeat: Infinity,
                        repeatType: 'reverse',
                      }}
                    />
                  ))}
                </span>
              </li>
            )}
          </ul>

          <form onSubmit={onSubmit}>
            <label htmlFor={inputId} className="sr-only">
              {finale.a11y.input}
            </label>
            <div className="flex items-end gap-2 rounded-xl border border-tide/25 bg-abyss/50 p-2 transition-colors duration-200 focus-within:border-glow/40">
              <textarea
                id={inputId}
                ref={inputRef}
                rows={2}
                maxLength={MAX_CHARS}
                value={value}
                placeholder={finale.placeholder}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={onKeyDown}
                className="min-w-0 flex-1 resize-none bg-transparent px-2 py-1.5 text-sm leading-relaxed text-foam outline-none placeholder:text-mist/55 sm:text-base"
              />
              <button
                type="submit"
                disabled={!canSend}
                aria-label={finale.a11y.send}
                className={
                  canSend
                    ? 'grid size-10 shrink-0 place-items-center rounded-lg bg-glow text-abyss transition-colors duration-200 hover:bg-foam'
                    : 'grid size-10 shrink-0 cursor-not-allowed place-items-center rounded-lg bg-tide/20 text-mist/50 transition-colors duration-200'
                }
              >
                <svg
                  viewBox="0 0 24 24"
                  className="size-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M21.5 2.5 10.8 13.2" />
                  <path d="M21.5 2.5 14.7 21.5l-3.9-8.3-8.3-3.9Z" />
                </svg>
              </button>
            </div>
          </form>

          <div className="mt-3 flex flex-wrap gap-2">
            {finale.suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => fill(s)}
                className="rounded-full border border-tide/30 bg-sea/40 px-3 py-1.5 text-xs text-mist transition-colors duration-200 hover:border-glow/45 hover:text-foam sm:text-sm"
              >
                {s}
              </button>
            ))}
          </div>
        </motion.div>

        {revealed && (
          <motion.div
            ref={revealRef}
            className="relative mx-auto w-full max-w-3xl"
            initial={reduced ? false : { opacity: 0, scale: 0.96, filter: 'blur(12px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={enterSlow}
          >
            {/* The one flourish the page allows itself: it blooms as the download
                arrives, settles to a held rim, and never pulses again. */}
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-8 -z-10 rounded-[2.5rem]"
              style={{
                background:
                  'radial-gradient(60% 60% at 50% 45%, color-mix(in oklab, var(--color-glow) 24%, transparent), transparent 72%)',
              }}
              initial={{ opacity: reduced ? 0.18 : 0 }}
              animate={{ opacity: reduced ? 0.18 : [0, 0.85, 0.18] }}
              transition={reduced ? { duration: 0 } : { duration: 1.8, times: [0, 0.3, 1], ease: EASE }}
            />
            <div role="region" aria-labelledby={ctaId} className="pane rounded-2xl px-6 py-9 text-center sm:px-10 sm:py-11">
              <h3 id={ctaId} className="text-2xl sm:text-3xl">
                {finale.ctaTitle}
              </h3>
              <p className="font-mono mt-3 text-xs text-mist sm:text-sm">{finale.ctaBody}</p>
              <GatedDownload className="mt-7 inline-flex cursor-pointer items-center gap-2.5 rounded-xl bg-glow px-7 py-4 text-base font-semibold text-abyss transition-colors duration-200 hover:bg-foam sm:px-9 sm:text-lg">
                <svg
                  viewBox="0 0 24 24"
                  className="size-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 3v12" />
                  <path d="m6.5 10.5 5.5 5.5 5.5-5.5" />
                  <path d="M4 20h16" />
                </svg>
                {finale.cta}
              </GatedDownload>
              <ul className="mt-7 flex flex-col items-center gap-1.5 text-xs text-mist/85 sm:flex-row sm:justify-center sm:gap-x-6 sm:text-sm">
                {finale.requirements.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
