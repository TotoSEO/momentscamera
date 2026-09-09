'use client'

import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { ButtonLink } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { finalCta } from '@/content/copy'
import { routes } from '@/lib/site'

/** AIDA — Action. Dernier écran, une seule sortie possible. */
export function FinalCta() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] })
  const scale = useTransform(scrollYProgress, [0, 1], [0.85, 1])
  const rotate = useTransform(scrollYProgress, [0, 1], [-6, 0])

  return (
    <section ref={ref} className="relative overflow-hidden px-4 py-24 md:px-8 md:py-32">
      <motion.div
        style={{ scale, rotate }}
        className="relative mx-auto max-w-4xl rounded-[3rem] border-3 border-ink bg-pop-red px-6 py-16 text-center text-white shadow-pop-lg md:px-16 md:py-24"
      >
        <div className="animate-flash pointer-events-none absolute inset-0 -z-0 flash-halo opacity-25" aria-hidden />

        <div className="relative z-10">
          <Reveal>
            <p className="font-mono text-sm tracking-widest uppercase opacity-80">{finalCta.kicker}</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-4 text-[clamp(2rem,5.5vw,3.8rem)]">{finalCta.title}</h2>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed opacity-90 md:text-xl">{finalCta.body}</p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-10">
              <ButtonLink href={routes.product} variant="secondary" size="lg" shine>
                {finalCta.cta}
              </ButtonLink>
            </div>
          </Reveal>
          <Reveal delay={0.26}>
            <p className="mt-5 text-sm opacity-80">{finalCta.micro}</p>
          </Reveal>
        </div>
      </motion.div>
    </section>
  )
}
