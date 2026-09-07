/**
 * The only way to the installer.
 *
 * Before someone has signed up it is a button that opens the gate; afterwards
 * it is an ordinary download link, which is what it should be. It takes the
 * caller's own className and children, so the hero, the nav and the finale
 * each keep the shape their author gave them.
 */
import { useBeta } from '../lib/beta'
import { DOWNLOAD_URL } from '../lib/copy'
import type { ReactNode } from 'react'

export function GatedDownload({ className, children, ariaLabel }: { className?: string; children: ReactNode; ariaLabel?: string }) {
  const { signup, request } = useBeta()

  if (!signup) {
    return (
      <button type="button" onClick={request} aria-label={ariaLabel} className={className}>
        {children}
      </button>
    )
  }
  return (
    <a href={DOWNLOAD_URL} download aria-label={ariaLabel} className={className}>
      {children}
    </a>
  )
}
