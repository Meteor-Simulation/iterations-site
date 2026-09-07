/**
 * The bottom of the sea.
 *
 * Principle 8: the last screen still carries the mood of the first. So the
 * footer is not a different kind of page — same cold palette, same glow
 * hairline, the same wave mark the tab and the nav carry. It is only quieter,
 * and it does not move, because there is nothing below it to earn.
 */
import { VERSION } from '../lib/copy'
import { useCopy } from '../lib/i18n'

/** Repeated rather than shared: three files own this mark, none owns the other two. */
function WaveMark() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className="h-6 w-6 shrink-0">
      <path d="M4 20c4-6 8-6 12 0s8 6 12 0" fill="none" stroke="var(--color-glow)" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M4 13c4-6 8-6 12 0s8 6 12 0" fill="none" stroke="var(--color-tide)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function Footer() {
  const { footer } = useCopy()
  return (
    <footer className="bg-abyss">
      <div className="rule-glow h-px w-full" />
      <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-8 md:py-20 lg:px-12">
        <div className="flex flex-col gap-12 md:flex-row md:justify-between md:gap-16">
          <div className="max-w-md">
            <div className="flex items-center gap-2.5 text-foam">
              <WaveMark />
              <span className="text-base font-semibold tracking-tight">Iterations</span>
              <span className="font-mono text-xs text-mist">{VERSION}</span>
            </div>
            <p className="mt-6 text-xs uppercase tracking-wide text-mist/60">{footer.licenseTitle}</p>
            <p className="mt-2 text-sm text-mist">{footer.license}</p>
            <p className="mt-3 text-sm leading-relaxed text-mist/70">{footer.licenseNote}</p>
            {/* The rule people get wrong: an institute is not free or paid as an
                institution — the purpose of the work decides. */}
            <p className="mt-3 border-l border-glow/25 pl-4 text-sm leading-relaxed text-mist/70">{footer.licenseResearch}</p>
          </div>

          <div className="flex flex-col gap-8 md:items-end">
            <nav className="flex flex-wrap gap-x-7 gap-y-3 md:justify-end">
              {footer.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-mist transition-colors duration-300 hover:text-glow"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <a
              href={`mailto:${footer.contact}`}
              className="font-mono text-sm text-glow/80 transition-colors duration-300 hover:text-glow"
            >
              {footer.contact}
            </a>
          </div>
        </div>

        <p className="mt-16 font-mono text-xs text-mist/60 md:mt-20">
          © {new Date().getFullYear()} {footer.owner} · {footer.collaboratorLabel} {footer.collaborator}
        </p>
      </div>
    </footer>
  )
}
