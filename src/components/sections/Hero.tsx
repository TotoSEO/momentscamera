'use client'

import Link from 'next/link'
import { motion, useScroll, useTransform } from 'motion/react'
import { useRef, useState } from 'react'
import { ButtonLink } from '@/components/ui/Button'
import { ProductViewer } from '@/components/product/ProductViewer'
import { hero } from '@/content/copy'
import { colorways, defaultColorway, product } from '@/content/product'
import { formatPrice, routes } from '@/lib/site'

/**
 * Hero.
 *
 * Trois plans qui bougent à des vitesses différentes (blobs, titre, produit)
 * pour donner de la profondeur sans image lourde. Le produit est en 3D dès
 * l'ouverture : c'est l'argument principal, il ne doit pas attendre un scroll.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const [colorway, setColorway] = useState(defaultColorway)

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const blobY = useTransform(scrollYProgress, [0, 1], [0, 220])
  const productY = useTransform(scrollYProgress, [0, 1], [0, 90])
  const textY = useTransform(scrollYProgress, [0, 1], [0, -40])
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0])

  return (
    <section ref={ref} className="relative overflow-hidden px-4 pt-10 pb-16 md:px-8 md:pt-16 md:pb-24">
      {/* --- Blobs de fond --- */}
      <motion.div style={{ y: blobY }} className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div className="animate-blob absolute -top-24 -left-32 size-[30rem] bg-pop-yellow/55 blur-[60px]" />
        <div
          className="animate-blob absolute top-40 -right-28 size-[26rem] bg-pop-blue/35 blur-[70px]"
          style={{ animationDelay: '-4s' }}
        />
        <div
          className="animate-blob absolute -bottom-40 left-1/3 size-[24rem] bg-pop-green/35 blur-[70px]"
          style={{ animationDelay: '-8s' }}
        />
      </motion.div>

      <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[1.05fr_1fr] lg:grid-rows-[auto_auto] lg:gap-x-6 lg:gap-y-0">
        {/* --- Titre --- */}
        <motion.div
          style={{ y: textY }}
          className="relative z-10 order-1 text-center lg:order-none lg:col-start-1 lg:row-start-1 lg:text-left"
        >
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border-3 border-ink bg-paper px-4 py-1.5 font-mono text-xs tracking-tight shadow-pop-sm md:text-sm"
          >
            <span className="inline-block size-2.5 animate-pulse rounded-full bg-pop-red" />
            {hero.eyebrow}
          </motion.p>

          <h1 className="mt-6 text-[clamp(2.6rem,6.5vw,5rem)] font-bold">
            {/* Chaque ligne monte séparément : lecture rythmée plutôt qu'un bloc qui apparaît. */}
            {['Vos plus beaux moments', 'ne sont pas dans', 'votre téléphone.'].map((line, i) => (
              <motion.span
                key={line}
                className="block"
                initial={{ opacity: 0, y: 30, rotate: i === 2 ? -1.5 : 0 }}
                animate={{ opacity: 1, y: 0, rotate: i === 2 ? -1.5 : 0 }}
                transition={{ duration: 0.65, delay: 0.12 + i * 0.11, ease: [0.22, 1, 0.36, 1] }}
              >
                {i === 2 ? (
                  <span className="relative inline-block">
                    <span className="relative z-10">{line}</span>
                    <span
                      className="absolute inset-x-[-0.15em] bottom-[0.06em] -z-0 h-[0.42em] -rotate-1 rounded-full bg-pop-yellow"
                      aria-hidden
                    />
                  </span>
                ) : (
                  line
                )}
              </motion.span>
            ))}
          </h1>

        </motion.div>

        {/* --- Accroche, appels à l'action et réassurance ---
            En mobile, ce bloc passe APRÈS le visuel : on voit le produit
            avant de lire son argumentaire. En desktop, il reprend sa place
            sous le titre, dans la colonne de gauche. */}
        <motion.div
          style={{ y: textY }}
          className="relative z-10 order-3 text-center lg:order-none lg:col-start-1 lg:row-start-2 lg:text-left"
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mx-auto max-w-xl text-lg leading-relaxed text-ink-soft lg:mx-0 md:text-xl"
          >
            {hero.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.58 }}
            className="mt-9 flex flex-col items-center gap-3 sm:flex-row lg:items-start"
          >
            <ButtonLink href={routes.product} variant="primary" size="lg" shine className="w-full sm:w-auto">
              {hero.primaryCta} · {formatPrice(product.fromPriceCents)}
            </ButtonLink>
            <ButtonLink href="#comment" variant="ghost" size="lg" className="w-full sm:w-auto">
              {hero.secondaryCta}
            </ButtonLink>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.75 }}
            className="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-semibold text-ink-soft lg:justify-start"
          >
            {hero.reassurance.map((item) => (
              <li key={item} className="flex items-center gap-1.5">
                <CheckMark />
                {item}
              </li>
            ))}
          </motion.ul>
        </motion.div>

        {/* --- Produit en 3D ---
            Placé juste après le titre en lecture mobile : c'est l'argument
            principal, il ne doit pas attendre trois paragraphes. */}
        <motion.div
          style={{ y: productY, opacity: fade }}
          className="relative order-2 lg:order-none lg:col-start-2 lg:row-span-2 lg:row-start-1"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative aspect-square w-full"
          >
            <ProductViewer colorway={colorway} className="size-full" />

            {/* Étiquettes flottantes : elles racontent la fiche technique sans tableau. */}
            <FloatingTag className="left-0 top-[14%]" delay={1}>
              1080p
            </FloatingTag>
            <FloatingTag className="right-0 top-[34%]" delay={1.2} tone="blue">
              26 g
            </FloatingTag>
            <FloatingTag className="left-[6%] bottom-[16%]" delay={1.4} tone="green">
              Grand-angle 130°
            </FloatingTag>
          </motion.div>

          {/* Sélecteur de couleur : le visiteur touche le produit dès l'écran d'accueil. */}
          <div className="mt-2 flex flex-wrap items-center justify-center gap-2.5">
            {colorways.map((c) => {
              const active = c.slug === colorway.slug
              return (
                <button
                  key={c.slug}
                  onClick={() => setColorway(c)}
                  aria-label={`Voir le coloris ${c.name}`}
                  aria-pressed={active}
                  className="group relative grid size-9 place-items-center rounded-full border-3 border-ink transition-transform hover:-translate-y-1 md:size-10"
                  style={{ backgroundColor: c.hex }}
                >
                  {active && (
                    <motion.span
                      layoutId="hero-swatch"
                      className="absolute -inset-1.5 rounded-full border-3 border-ink"
                      transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                    />
                  )}
                </button>
              )
            })}
          </div>
          <p className="mt-2.5 text-center font-display text-sm font-semibold text-ink-soft">
            {colorway.name} · faites-le tourner avec le doigt
          </p>
          <p className="mt-1 text-center text-[11px] leading-snug text-ink-soft/70">
            Modèle 3D non contractuel.{' '}
            <Link href={routes.product} className="underline underline-offset-2 hover:text-ink">
              Voir les vrais modèles ici
            </Link>
          </p>
        </motion.div>
      </div>
    </section>
  )
}

function FloatingTag({
  children,
  className,
  delay = 0,
  tone = 'yellow',
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  tone?: 'yellow' | 'blue' | 'green'
}) {
  const tones = {
    yellow: 'bg-pop-yellow text-ink',
    blue: 'bg-pop-blue text-white',
    green: 'bg-pop-green text-ink',
  }

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: 'spring', stiffness: 400, damping: 18 }}
      className={`absolute rounded-full border-3 border-ink px-3.5 py-1.5 font-display text-sm font-bold shadow-pop-sm md:text-base ${tones[tone]} ${className}`}
    >
      {children}
    </motion.span>
  )
}

function CheckMark() {
  return (
    <svg viewBox="0 0 20 20" className="size-4 shrink-0 text-pop-green" fill="none" stroke="currentColor" strokeWidth="3.5" aria-hidden>
      <path d="M4 10.5 8 15l8-10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
