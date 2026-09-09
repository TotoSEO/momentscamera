'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Reveal } from '@/components/ui/Reveal'
import { ButtonLink } from '@/components/ui/Button'
import { ProductViewer } from '@/components/product/ProductViewer'
import { colorways, defaultColorway } from '@/content/product'
import { routes } from '@/lib/site'

/**
 * Nuancier interactif.
 * Le fond de section prend la couleur sélectionnée : le choix devient
 * une expérience plein écran plutôt qu'une liste de pastilles.
 */
export function Colors() {
  const [active, setActive] = useState(defaultColorway)

  return (
    <section id="couleurs" className="relative scroll-mt-24 overflow-hidden border-b-3 border-ink">
      <motion.div
        className="absolute inset-0 -z-10"
        animate={{ backgroundColor: active.hex }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden
      />
      <div className="absolute inset-0 -z-10 bg-linear-to-b from-white/30 via-transparent to-black/10" aria-hidden />

      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-24 md:px-8 md:py-28 lg:grid-cols-2">
        <div style={{ color: active.onHex }}>
          <Reveal>
            <p className="font-mono text-sm tracking-widest uppercase opacity-70">Neuf coloris</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-4 text-[clamp(2rem,5vw,3.8rem)]">
              Choisissez la couleur
              <br />
              qui vous ressemble.
            </h2>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="mt-6 max-w-md text-lg leading-relaxed opacity-80">
              Du rouge qui se voit à dix mètres au boîtier transparent qui laisse voir l’électronique.
              Sur un pack Duo ou La Bande, chaque appareil a sa propre couleur.
            </p>
          </Reveal>

          <div className="mt-9 flex flex-wrap gap-3">
            {colorways.map((c) => {
              const isActive = c.slug === active.slug
              return (
                <button
                  key={c.slug}
                  onClick={() => setActive(c)}
                  aria-pressed={isActive}
                  className="group relative flex items-center gap-2 rounded-full border-3 border-ink bg-paper py-1.5 pr-4 pl-1.5 font-display text-sm font-bold text-ink shadow-pop-sm transition-transform hover:-translate-y-1"
                >
                  <span
                    className="size-7 rounded-full border-2 border-ink"
                    style={{ backgroundColor: c.hex }}
                    aria-hidden
                  />
                  {c.name}
                  {isActive && (
                    <motion.span
                      layoutId="color-pill"
                      className="absolute -inset-1 rounded-full border-3 border-ink"
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    />
                  )}
                </button>
              )
            })}
          </div>

          <div className="mt-10">
            <ButtonLink href={routes.product} variant="dark" size="lg" shine>
              Commander en {active.name}
            </ButtonLink>
          </div>
        </div>

        <div className="relative aspect-square">
          <ProductViewer colorway={active} className="size-full" />
          <AnimatePresence mode="wait">
            <motion.p
              key={active.slug}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.28 }}
              className="absolute inset-x-0 bottom-0 text-center font-display text-2xl font-bold md:text-3xl"
              style={{ color: active.onHex }}
            >
              {active.name}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
