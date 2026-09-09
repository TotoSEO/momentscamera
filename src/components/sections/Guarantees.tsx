import { Reveal, RevealGroup, RevealItem } from '@/components/ui/Reveal'
import { guarantees } from '@/content/copy'

/** Réassurance : placée juste avant la FAQ, là où le doute apparaît. */
export function Guarantees() {
  return (
    <section className="px-4 py-20 md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="text-center text-[clamp(1.8rem,4vw,2.8rem)]">Ce sur quoi on s’engage</h2>
        </Reveal>

        <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" stagger={0.07}>
          {guarantees.map((item) => (
            <RevealItem key={item.title}>
              <div className="pop-card h-full p-6 text-center">
                <span className="text-3xl" aria-hidden>
                  {item.emoji}
                </span>
                <h3 className="mt-3 text-lg">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.body}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}
