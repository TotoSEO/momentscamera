'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/Reveal'
import { Sticker } from '@/components/ui/Badge'
import { bundleUnitPriceCents, bundles } from '@/content/product'
import { formatPrice, routes } from '@/lib/site'

/** Grille d'offres. Le pack central est mis en avant : ancrage de prix classique. */
export function Offers() {
  return (
    <section id="offres" className="scroll-mt-24 border-y-3 border-ink bg-pop-blue px-4 py-24 text-white md:px-8 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <h2 className="text-[clamp(2rem,5vw,3.6rem)]">Un appareil, ou toute la bande ?</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 text-lg text-white/85 md:text-xl">
              Les meilleures photos ne viennent jamais d’un seul appareil. Elles viennent de trois
              personnes qui se prennent en photo au même moment.
            </p>
          </Reveal>
        </div>

        <RevealGroup className="mt-14 grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-4" stagger={0.09}>
          {bundles.map((bundle) => {
            // Le pack en nombre n'a pas de prix fixe : on annonce son point
            // d'entrée, le détail se règle sur la fiche produit.
            const isBulk = bundle.bulk !== undefined
            const entryQuantity = bundle.bulk?.minQuantity ?? 1
            const price = bundleUnitPriceCents(bundle, entryQuantity) * (isBulk ? entryQuantity : 1)
            const saving = bundle.compareAtCents * entryQuantity - price

            return (
              <RevealItem key={bundle.id} className="h-full">
                <motion.div
                  whileHover={{ y: -10 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                  className={`relative flex h-full flex-col rounded-[2rem] border-3 border-ink bg-paper p-6 text-ink lg:p-7 ${
                    bundle.highlight ? 'shadow-pop-lg lg:-mt-4 lg:mb-4' : 'shadow-pop'
                  }`}
                >
                  {bundle.badge && (
                    <Sticker tone={bundle.highlight ? 'yellow' : 'lime'} className="absolute -top-4 left-7">
                      {bundle.badge}
                    </Sticker>
                  )}

                  <h3 className="mt-2 text-2xl lg:text-3xl">{bundle.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{bundle.pitch}</p>

                  <div className="mt-6 flex flex-wrap items-end gap-x-3 gap-y-1">
                    {isBulk && (
                      <span className="w-full font-display text-sm font-bold text-ink-soft">
                        dès {entryQuantity} appareils
                      </span>
                    )}
                    <span className="font-display text-4xl leading-none font-bold lg:text-[2.6rem]">
                      {formatPrice(price)}
                    </span>
                    {saving > 0 && (
                      <span className="pb-1 font-mono text-sm text-ink-soft line-through">
                        {formatPrice(bundle.compareAtCents * entryQuantity)}
                      </span>
                    )}
                  </div>
                  {saving > 0 && (
                    <p className="mt-1.5 font-display text-sm font-bold text-pop-green-deep">
                      Vous économisez {formatPrice(saving)}
                    </p>
                  )}

                  <ul className="mt-6 flex flex-1 flex-col gap-2.5 text-sm">
                    {bundle.perks.map((perk) => (
                      <li key={perk} className="flex items-start gap-2.5">
                        <span className="mt-1.5 size-2 shrink-0 rounded-full bg-pop-red" aria-hidden />
                        {perk}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={`${routes.product}?pack=${bundle.id}`}
                    className={`mt-7 inline-flex w-full items-center justify-center rounded-full border-3 border-ink px-6 py-3.5 font-display font-bold shadow-pop-sm transition-transform hover:-translate-y-1 ${
                      bundle.highlight ? 'bg-pop-red text-white' : 'bg-pop-yellow text-ink'
                    }`}
                  >
                    Choisir {bundle.name}
                  </Link>
                </motion.div>
              </RevealItem>
            )
          })}
        </RevealGroup>

        <Reveal delay={0.2}>
          <p className="mt-10 text-center text-sm text-white/75">
            Prix TTC · Livraison offerte dès 40 € · 30 jours pour changer d’avis
          </p>
        </Reveal>
      </div>
    </section>
  )
}
