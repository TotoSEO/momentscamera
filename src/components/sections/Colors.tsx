'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Reveal } from '@/components/ui/Reveal'
import { ButtonLink } from '@/components/ui/Button'
import { ProductPhoto } from '@/components/product/ProductPhoto'
import { colorways, defaultColorway } from '@/content/product'
import { routes } from '@/lib/site'

/**
 * Nuancier interactif.
 *
 * Le fond de section prend la couleur sélectionnée : le choix devient une
 * expérience plein écran plutôt qu'une liste de pastilles.
 *
 * Ordre de lecture en mobile : titre, PHOTO, pastilles, argumentaire.
 * Le visuel arrivait auparavant après tout le texte, donc trop bas pour
 * qu'on comprenne ce qu'on choisit. En desktop la mise en deux colonnes
 * est conservée.
 *
 * Ce sont les photos fabricant qui sont montrées ici, pas le modèle 3D :
 * c'est l'écran où l'acheteur choisit son coloris, il doit voir le produit
 * réel.
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

      <div className="mx-auto grid max-w-7xl items-center gap-6 px-4 py-16 md:px-8 md:py-24 lg:grid-cols-2 lg:grid-rows-[auto_auto] lg:gap-x-10 lg:gap-y-0">
        {/* --- Titre --- */}
        <div className="order-1 lg:col-start-1 lg:row-start-1" style={{ color: active.onHex }}>
          <Reveal>
            <p className="font-mono text-sm tracking-widest uppercase opacity-70">Neuf coloris</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-3 text-[clamp(2rem,5vw,3.8rem)]">
              Choisissez la couleur
              <br />
              qui vous ressemble.
            </h2>
          </Reveal>
        </div>

        {/* --- Photo du coloris --- */}
        <div className="relative order-2 lg:col-start-2 lg:row-span-2 lg:row-start-1">
          {/* Disque contrastant : sans lui, un appareil rouge disparaîtrait
              sur le fond rouge de la section. */}
          <motion.div
            className="pointer-events-none absolute inset-[14%] -z-10 rounded-full blur-2xl"
            animate={{ backgroundColor: active.onHex }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{ opacity: 0.22 }}
            aria-hidden
          />
          <ProductPhoto
            colorway={active}
            framed
            className="aspect-square w-full"
            sizes="(max-width: 1024px) 92vw, 44vw"
          />

          <AnimatePresence mode="wait">
            <motion.p
              key={active.slug}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28 }}
              className="mt-4 text-center font-display text-2xl font-bold md:text-3xl"
              style={{ color: active.onHex }}
            >
              {active.name}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* --- Pastilles et argumentaire --- */}
        <div className="order-3 lg:col-start-1 lg:row-start-2" style={{ color: active.onHex }}>
          <div className="flex flex-wrap justify-center gap-2 lg:justify-start lg:gap-3">
            {colorways.map((c) => {
              const isActive = c.slug === active.slug
              return (
                <button
                  key={c.slug}
                  onClick={() => setActive(c)}
                  aria-pressed={isActive}
                  className="group relative flex items-center gap-2 rounded-full border-3 border-ink bg-paper py-1.5 pr-3.5 pl-1.5 font-display text-xs font-bold text-ink shadow-pop-sm transition-transform hover:-translate-y-1 sm:text-sm"
                >
                  <span
                    className="size-6 rounded-full border-2 border-ink sm:size-7"
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

          <Reveal delay={0.1}>
            <p className="mx-auto mt-6 max-w-md text-center text-base leading-relaxed opacity-85 lg:mx-0 lg:text-left lg:text-lg">
              Du rouge qui se voit à dix mètres au boîtier transparent qui laisse voir l’électronique.
              Chaque coloris a sa propre sérigraphie, et sur les packs, chaque appareil a sa couleur.
            </p>
          </Reveal>

          <div className="mt-7 flex justify-center lg:justify-start">
            <ButtonLink href={routes.product} variant="dark" size="lg" shine>
              Commander en {active.name}
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  )
}
