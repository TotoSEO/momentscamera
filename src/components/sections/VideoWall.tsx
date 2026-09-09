import { Reveal, RevealGroup, RevealItem } from '@/components/ui/Reveal'
import { VideoBlock } from '@/components/ui/VideoBlock'

/**
 * Mur vidéo.
 * Les emplacements sont déjà composés et animés ; il ne restera qu'à
 * renseigner les `src` quand les vidéos produit seront prêtes.
 */
const slots = [
  { caption: 'Un clic, une photo', tone: 'red' as const, ratio: 'aspect-[4/5]' },
  { caption: 'Dans la poche, sur les clés', tone: 'yellow' as const, ratio: 'aspect-[4/5] md:aspect-square' },
  { caption: 'Le rendu, sans retouche', tone: 'blue' as const, ratio: 'aspect-[4/5]' },
  { caption: 'Les 9 coloris', tone: 'green' as const, ratio: 'aspect-[4/5] md:aspect-square' },
]

export function VideoWall() {
  return (
    <section className="px-4 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="max-w-2xl text-[clamp(2rem,5vw,3.4rem)]">Regardez-le vivre</h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="mt-4 max-w-xl text-lg text-ink-soft">
            Quelques secondes valent mieux qu’une fiche technique.
          </p>
        </Reveal>

        <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" stagger={0.08}>
          {slots.map((slot, i) => (
            <RevealItem key={slot.caption} className={i % 2 === 1 ? 'sm:mt-10' : undefined}>
              <VideoBlock caption={slot.caption} tone={slot.tone} ratio={slot.ratio} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}
