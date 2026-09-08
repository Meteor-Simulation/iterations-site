/**
 * The guidebook page.
 *
 * A second entry rather than a route: the front page is one long scroll with a
 * WebGPU ocean at the top of it, and a reader who came for the solver table
 * should not have to load a wave simulation to reach it. Vite builds guide.html
 * beside index.html, so this ships as its own document with its own bundle.
 *
 * It keeps the front page's palette and typography and drops its theatre. The
 * front page is making an argument; this one is answering questions, so the
 * motion is a single fade per block and the widest thing on the page is a
 * table.
 */
import { motion } from 'motion/react'
import { useEffect } from 'react'
import { LocaleToggle } from './components/LocaleToggle'
import { GUIDE } from './lib/guideCopy'
import { useCopy, useLocale } from './lib/i18n'
import { inView, inViewEarly, line, prefersReducedMotion, rise, stagger } from './lib/motion'

/** Reduced motion: everything is already where it belongs. */
const still = { hidden: { opacity: 1 }, show: { opacity: 1 } }

function Kicker({ children }: { children: string }) {
  return (
    <div className="flex items-center gap-4">
      <span aria-hidden className="h-px w-10 bg-glow/60" />
      <span className="text-xs tracking-[0.3em] text-glow uppercase sm:text-sm">{children}</span>
    </div>
  )
}

export default function GuideApp() {
  const { locale } = useLocale()
  const { hero: siteHero } = useCopy()
  const g = GUIDE[locale]
  const reduced = prefersReducedMotion()
  const headline = reduced ? still : line
  const step = reduced ? still : rise

  // The document title is the page's own, and it follows the language.
  useEffect(() => {
    document.title = g.meta.title
  }, [g.meta.title])

  return (
    <div className="bg-abyss">
      {/* --- top bar: home, language, download ------------------------------ */}
      <header className="sticky top-0 z-40 border-b border-tide/20 bg-abyss/80 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-4 px-6 py-3.5 sm:px-8 lg:px-12">
          <a href="./index.html" className="flex items-center gap-2.5 text-foam" aria-label={g.meta.back}>
            <svg width="22" height="22" viewBox="0 0 32 32" aria-hidden className="shrink-0">
              <path d="M4 20c4-6 8-6 12 0s8 6 12 0" stroke="#4fd1c5" strokeWidth="2.4" fill="none" strokeLinecap="round" />
              <path d="M4 13c4-6 8-6 12 0s8 6 12 0" stroke="#1c6b7c" strokeWidth="2" fill="none" strokeLinecap="round" />
            </svg>
            <span className="text-[0.95rem] font-semibold tracking-tight">Iterations</span>
          </a>
          <span aria-hidden className="hidden text-mist/40 sm:inline">/</span>
          <span className="hidden text-sm text-mist sm:inline">{g.hero.eyebrow}</span>

          <div className="ml-auto flex items-center gap-2">
            <LocaleToggle />
            <a
              href="./index.html"
              className="rounded-full border border-glow/40 bg-glow/10 px-4 py-1.5 text-xs font-medium text-glow transition-colors duration-300 hover:bg-glow/20"
            >
              {siteHero.cta}
            </a>
          </div>
        </div>
      </header>

      {/* --- hero ----------------------------------------------------------- */}
      <section className="border-b border-tide/15">
        <div className="mx-auto w-full max-w-6xl px-6 py-24 sm:px-8 md:py-32 lg:px-12">
          <motion.div initial="hidden" animate="show" variants={stagger(0.1)}>
            <motion.div variants={step}>
              <Kicker>{g.hero.eyebrow}</Kicker>
            </motion.div>
            <h1 className="mt-7 text-major text-foam">
              <motion.span variants={headline} className="block">
                {g.hero.title}
              </motion.span>
            </h1>
            <motion.p variants={step} className="mt-8 max-w-2xl text-lead leading-relaxed text-mist">
              {g.hero.lead}
            </motion.p>
            <motion.div variants={step} className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-3">
              <a
                href={g.more.links[0].href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2.5 rounded-full border border-glow/45 px-6 py-3 text-sm text-foam transition-colors duration-300 hover:border-glow hover:bg-glow/10 sm:text-base"
              >
                {g.hero.cta}
                <span aria-hidden className="text-glow">
                  →
                </span>
              </a>
              <span className="text-xs text-mist/70 sm:text-sm">{g.hero.ctaSub}</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-12">
        <div className="lg:flex lg:gap-16">
          {/* --- the rail: sticky on desktop, a plain list on a phone ------- */}
          <nav aria-label={g.toc.label} className="shrink-0 pt-16 lg:sticky lg:top-24 lg:h-fit lg:w-52 lg:pt-24">
            <p className="font-mono text-[0.68rem] tracking-[0.22em] text-glow uppercase">{g.toc.label}</p>
            <ul className="mt-5 space-y-3">
              {g.toc.items.map((i) => (
                <li key={i.id}>
                  <a href={`#${i.id}`} className="text-sm text-mist transition-colors duration-200 hover:text-foam">
                    {i.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <main className="min-w-0 flex-1">
            {/* --- five minutes -------------------------------------------- */}
            <section id="start" className="scroll-mt-24 pt-16 lg:pt-24">
              <motion.header initial="hidden" whileInView="show" viewport={inView} variants={stagger(0.09)}>
                <motion.div variants={step}>
                  <Kicker>{g.start.kicker}</Kicker>
                </motion.div>
                <h2 className="mt-6 text-section text-foam">
                  {g.start.title.split('\n').map((l) => (
                    <motion.span key={l} variants={headline} className="block">
                      {l}
                    </motion.span>
                  ))}
                </h2>
                <motion.p variants={step} className="mt-7 max-w-2xl text-base leading-relaxed text-mist sm:text-lg">
                  {g.start.lead}
                </motion.p>
              </motion.header>

              <motion.ol
                className="mt-14 space-y-10"
                initial="hidden"
                whileInView="show"
                viewport={inViewEarly}
                variants={stagger(0.1)}
              >
                {g.start.steps.map((s) => (
                  <motion.li key={s.n} variants={step} className="pane rounded-xl p-6 sm:p-8">
                    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
                      <span className="font-mono text-2xl leading-none text-glow/70">{s.n}</span>
                      <h3 className="text-lg text-foam sm:text-xl">{s.title}</h3>
                      <span className="ml-auto rounded-full border border-tide/30 px-3 py-1 font-mono text-[0.68rem] text-mist">
                        {s.time}
                      </span>
                    </div>
                    <p className="mt-4 max-w-2xl text-sm leading-relaxed text-mist sm:text-base">{s.body}</p>
                    <pre className="mt-5 overflow-x-auto rounded-lg border border-tide/25 bg-abyss/60 px-4 py-3.5 font-mono text-[0.78rem] leading-6 text-foam sm:text-[0.82rem]">
                      {s.code}
                    </pre>
                  </motion.li>
                ))}
              </motion.ol>

              <motion.p
                variants={step}
                initial="hidden"
                whileInView="show"
                viewport={inView}
                className="mt-8 font-mono text-xs text-mist/70 sm:text-sm"
              >
                {g.start.note}
              </motion.p>
            </section>

            {/* --- choosing a solver --------------------------------------- */}
            <section id="solvers" className="scroll-mt-24 pt-24 lg:pt-36">
              <motion.header initial="hidden" whileInView="show" viewport={inView} variants={stagger(0.09)}>
                <motion.div variants={step}>
                  <Kicker>{g.solvers.kicker}</Kicker>
                </motion.div>
                <h2 className="mt-6 text-section text-foam">
                  {g.solvers.title.split('\n').map((l) => (
                    <motion.span key={l} variants={headline} className="block">
                      {l}
                    </motion.span>
                  ))}
                </h2>
                <motion.p variants={step} className="mt-7 max-w-2xl text-base leading-relaxed text-mist sm:text-lg">
                  {g.solvers.lead}
                </motion.p>
              </motion.header>

              {/* The one warning on the page gets the only warm colour on it. */}
              <motion.div
                variants={step}
                initial="hidden"
                whileInView="show"
                viewport={inViewEarly}
                className="mt-12 rounded-xl border border-amber-400/35 bg-amber-400/[0.06] p-6 sm:p-8"
              >
                <p className="text-base text-foam sm:text-lg">{g.solvers.warning.title}</p>
                <p className="mt-4 text-sm leading-relaxed text-mist sm:text-base">{g.solvers.warning.body}</p>
                <ul className="mt-4 space-y-2">
                  {g.solvers.warning.bullets.map((b) => (
                    <li key={b} className="flex gap-3 text-sm leading-relaxed text-mist sm:text-base">
                      <span aria-hidden className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-amber-400/70" />
                      {b}
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                variants={step}
                initial="hidden"
                whileInView="show"
                viewport={inViewEarly}
                className="mt-10 overflow-x-auto"
              >
                <table className="w-full min-w-[38rem] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-tide/35">
                      {g.solvers.tableHead.map((h) => (
                        <th key={h} className="py-3 pr-6 font-mono text-[0.68rem] tracking-[0.18em] text-glow uppercase">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {g.solvers.rows.map((r) => (
                      <tr
                        key={r.bin}
                        className={`border-b border-tide/15 ${r.momentum ? 'bg-glow/[0.045]' : ''}`}
                      >
                        <td className="py-3.5 pr-6 font-mono text-[0.8rem] whitespace-nowrap text-foam">{r.bin}</td>
                        <td className={`py-3.5 pr-6 text-sm ${r.momentum ? 'text-foam' : 'text-mist'}`}>{r.solves}</td>
                        <td className="py-3.5 text-sm whitespace-nowrap text-mist/80">{r.format}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>

              <motion.p
                variants={step}
                initial="hidden"
                whileInView="show"
                viewport={inView}
                className="mt-6 max-w-2xl text-sm leading-relaxed text-mist/75"
              >
                {g.solvers.legend}
              </motion.p>
            </section>

            {/* --- reading convergence ------------------------------------- */}
            <section id="reading" className="scroll-mt-24 pt-24 lg:pt-36">
              <motion.header initial="hidden" whileInView="show" viewport={inView} variants={stagger(0.09)}>
                <motion.div variants={step}>
                  <Kicker>{g.reading.kicker}</Kicker>
                </motion.div>
                <h2 className="mt-6 text-section text-foam">
                  {g.reading.title.split('\n').map((l) => (
                    <motion.span key={l} variants={headline} className="block">
                      {l}
                    </motion.span>
                  ))}
                </h2>
                <motion.p variants={step} className="mt-7 max-w-2xl text-base leading-relaxed text-mist sm:text-lg">
                  {g.reading.lead}
                </motion.p>
              </motion.header>

              <motion.div
                variants={step}
                initial="hidden"
                whileInView="show"
                viewport={inViewEarly}
                className="pane mt-12 overflow-x-auto rounded-xl px-5 py-5 sm:px-6"
              >
                {g.reading.sample.map((l, i) => (
                  <p key={i} className="font-mono text-[0.76rem] leading-6 whitespace-pre text-foam sm:text-[0.82rem]">
                    {l}
                  </p>
                ))}
              </motion.div>

              <motion.dl
                className="mt-10 space-y-7"
                initial="hidden"
                whileInView="show"
                viewport={inViewEarly}
                variants={stagger(0.08)}
              >
                {g.reading.rows.map((r) => (
                  <motion.div key={r.k} variants={step}>
                    <dt className="font-mono text-sm text-glow">{r.k}</dt>
                    <dd className="mt-2 max-w-2xl text-sm leading-relaxed text-mist sm:text-base">{r.v}</dd>
                  </motion.div>
                ))}
              </motion.dl>

              <motion.div
                variants={step}
                initial="hidden"
                whileInView="show"
                viewport={inView}
                className="mt-10 border-l-2 border-glow/50 pl-6"
              >
                <p className="text-base text-foam sm:text-lg">{g.reading.diverge.title}</p>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-mist sm:text-base">{g.reading.diverge.body}</p>
              </motion.div>
            </section>

            {/* --- troubleshooting ----------------------------------------- */}
            <section id="trouble" className="scroll-mt-24 pt-24 lg:pt-36">
              <motion.header initial="hidden" whileInView="show" viewport={inView} variants={stagger(0.09)}>
                <motion.div variants={step}>
                  <Kicker>{g.trouble.kicker}</Kicker>
                </motion.div>
                <h2 className="mt-6 text-section text-foam">
                  {g.trouble.title.split('\n').map((l) => (
                    <motion.span key={l} variants={headline} className="block">
                      {l}
                    </motion.span>
                  ))}
                </h2>
                <motion.p variants={step} className="mt-7 max-w-2xl text-base leading-relaxed text-mist sm:text-lg">
                  {g.trouble.lead}
                </motion.p>
              </motion.header>

              <motion.div
                className="mt-12 divide-y divide-tide/20 border-y border-tide/20"
                initial="hidden"
                whileInView="show"
                viewport={inViewEarly}
                variants={stagger(0.06)}
              >
                {g.trouble.items.map((t) => (
                  <motion.details key={t.q} variants={step} className="group py-5">
                    <summary className="flex cursor-pointer list-none items-start gap-4 text-sm text-foam sm:text-base">
                      <span
                        aria-hidden
                        className="mt-1.5 text-glow transition-transform duration-300 group-open:rotate-90"
                      >
                        ›
                      </span>
                      <span className="font-mono text-[0.82rem] sm:text-[0.9rem]">{t.q}</span>
                    </summary>
                    <p className="mt-4 max-w-2xl pl-8 text-sm leading-relaxed text-mist sm:text-base">{t.a}</p>
                  </motion.details>
                ))}
              </motion.div>
            </section>

            {/* --- further reading ----------------------------------------- */}
            <section id="more" className="scroll-mt-24 pt-24 pb-28 lg:pt-36 lg:pb-40">
              <motion.header initial="hidden" whileInView="show" viewport={inView} variants={stagger(0.09)}>
                <motion.div variants={step}>
                  <Kicker>{g.more.kicker}</Kicker>
                </motion.div>
                <h2 className="mt-6 text-section text-foam">
                  <motion.span variants={headline} className="block">
                    {g.more.title}
                  </motion.span>
                </h2>
                <motion.p variants={step} className="mt-7 max-w-2xl text-base leading-relaxed text-mist sm:text-lg">
                  {g.more.lead}
                </motion.p>
              </motion.header>

              <motion.ul
                className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2"
                initial="hidden"
                whileInView="show"
                viewport={inViewEarly}
                variants={stagger(0.07)}
              >
                {g.more.links.map((l) => (
                  <motion.li key={l.label} variants={step}>
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noreferrer"
                      className="pane block h-full rounded-xl p-6 transition-colors duration-300 hover:border-glow/40"
                    >
                      <span className="font-mono text-sm text-glow">{l.label}</span>
                      <p className="mt-3 text-sm leading-relaxed text-mist">{l.body}</p>
                    </a>
                  </motion.li>
                ))}
              </motion.ul>
            </section>
          </main>
        </div>
      </div>
    </div>
  )
}
