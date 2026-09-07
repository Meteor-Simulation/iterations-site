/**
 * The descent, in order.
 *
 * Each section owns one band of the palette and hands the next one a floor no
 * lighter than the one it started on, so the page reads as a single fall
 * rather than nine boxes stacked up. The ledger, top to bottom:
 *
 *   Hero        scrim lands on  abyss
 *   Finale      abyss ........... abyss  (holds)
 *   MeshReveal  abyss ........... sea    (.band-surface, one ramp)
 *   Scenes      sea ............. deep   (.band-mid)
 *   Cutaway     deep ............ deep   (holds)
 *   Engine      deep ............ deep   (holds)
 *   PhysicalAI  deep ............ abyss  (.band-deep)
 *   Proof       abyss ........... abyss  (holds)
 *   Mcp         abyss ........... abyss  (holds)
 *   Footer      abyss
 *
 * Nothing after the mesh is allowed to get lighter again.
 *
 * The chat sits second rather than last. The question it asks — what do you
 * want to solve? — is the one the hero has just provoked, and asking it eight
 * sections later asks it of someone who has already decided. What ends the
 * page instead is the way out of it: the same solvers, handed over to whatever
 * assistant the reader already uses.
 *
 * MotionConfig is here rather than in any one section: six files wrote their
 * own reduced-motion guards to different depths, and this is the single place
 * that can promise the same answer for all of them.
 */
import { MotionConfig } from 'motion/react'
import { BetaProvider } from './lib/beta'
import { LocaleProvider } from './lib/i18n'
import { BetaGate } from './components/BetaGate'
import { Footer } from './components/Footer'
import { Nav } from './components/Nav'
import { Cutaway } from './sections/Cutaway'
import { Engine } from './sections/Engine'
import { Finale } from './sections/Finale'
import { Hero } from './sections/Hero'
import { Mcp } from './sections/Mcp'
import { MeshReveal } from './sections/MeshReveal'
import { PhysicalAI } from './sections/PhysicalAI'
import { Proof } from './sections/Proof'
import { Scenes } from './sections/Scenes'

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <LocaleProvider>
        <BetaProvider>
          <Nav />
          <main>
            <Hero />
            <Finale />
            <MeshReveal />
            <Scenes />
            <Cutaway />
            <Engine />
            <PhysicalAI />
            <Proof />
            <Mcp />
          </main>
          <Footer />
          <BetaGate />
        </BetaProvider>
      </LocaleProvider>
    </MotionConfig>
  )
}
