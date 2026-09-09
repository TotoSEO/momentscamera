'use client'

import { motion } from 'motion/react'
import { Reveal } from '@/components/ui/Reveal'
import { reviews, REVIEWS_ARE_DEMO } from '@/content/reviews'

/**
 * Bandeau d'avis en défilement continu (deux pistes, sens opposés).
 *
 * Tant que `REVIEWS_ARE_DEMO` est vrai, un bandeau explicite indique qu'il
 * s'agit d'exemples de mise en page. Afficher de faux avis comme s'ils
 * étaient réels est une pratique commerciale trompeuse — voir
 * src/content/reviews.ts.
 */
export function Reviews() {
  const half = Math.ceil(reviews.length / 2)
  const rows = [reviews.slice(0, half), reviews.slice(half)]

  return (
    <section className="overflow-hidden px-0 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <Reveal>
          <h2 className="text-center text-[clamp(2rem,5vw,3.4rem)]">Ce qu’en disent les gens</h2>
        </Reveal>

        {REVIEWS_ARE_DEMO && (
          <Reveal delay={0.08}>
            <p className="mx-auto mt-6 max-w-2xl rounded-[1.5rem] border-3 border-dashed border-ink bg-pop-yellow/60 px-6 py-4 text-center text-sm font-semibold">
              Emplacement de démonstration. Les cartes ci-dessous montrent la mise en page prévue —
              ce ne sont pas de vrais avis clients. Elles seront remplacées par les avis vérifiés
              collectés après les premières commandes.
            </p>
          </Reveal>
        )}
      </div>

      <div className="mt-12 flex flex-col gap-5">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex overflow-hidden" aria-hidden={rowIndex > 0}>
            <motion.div
              className="flex shrink-0 gap-5 pr-5"
              animate={{ x: rowIndex === 0 ? ['0%', '-50%'] : ['-50%', '0%'] }}
              transition={{ duration: 44, repeat: Infinity, ease: 'linear' }}
            >
              {[...row, ...row].map((review, i) => (
                <article
                  key={`${review.name}-${i}`}
                  className="pop-card flex w-[19rem] shrink-0 flex-col gap-3 p-6 md:w-[23rem]"
                >
                  <div className="flex items-center gap-2">
                    <Stars rating={review.rating} />
                    <span className="font-mono text-xs text-ink-soft">{review.colorway}</span>
                  </div>
                  <h3 className="text-lg">{review.title}</h3>
                  <p className="flex-1 text-sm leading-relaxed text-ink-soft">{review.body}</p>
                  <p className="font-display text-sm font-bold">
                    {review.name} <span className="font-normal text-ink-soft">· {review.location}</span>
                  </p>
                </article>
              ))}
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  )
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex gap-0.5" aria-label={`${rating} étoiles sur 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className={`size-4 ${i < rating ? 'text-pop-yellow' : 'text-ink/15'}`}
          fill="currentColor"
          stroke="#14121a"
          strokeWidth="1.2"
          aria-hidden
        >
          <path d="m10 1.6 2.6 5.3 5.9.85-4.25 4.15 1 5.85L10 15l-5.25 2.75 1-5.85L1.5 7.75l5.9-.85L10 1.6Z" />
        </svg>
      ))}
    </span>
  )
}
