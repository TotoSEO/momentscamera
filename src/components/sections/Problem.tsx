'use client'

import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { Reveal } from '@/components/ui/Reveal'
import { problem } from '@/content/copy'

/**
 * Bloc PAS — Problem + Agitation.
 * Fond sombre : rupture visuelle nette avec le reste du site, on ralentit
 * le lecteur au moment exact où on lui parle de son problème.
 */
export function Problem() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const lineWidth = useTransform(scrollYProgress, [0.15, 0.6], ['0%', '100%'])

  return (
    <section ref={ref} className="relative overflow-hidden border-y-3 border-ink bg-ink px-4 py-24 text-cream md:px-8 md:py-32">
      <div
        className="stripes pointer-events-none absolute inset-x-0 top-0 h-4 text-pop-red opacity-70"
        aria-hidden
      />

      <div className="mx-auto max-w-4xl">
        <Reveal>
          <p className="font-mono text-sm tracking-widest text-pop-yellow uppercase">{problem.kicker}</p>
        </Reveal>

        <Reveal delay={0.1}>
          <h2 className="mt-4 text-[clamp(2rem,5vw,3.6rem)]">{problem.title}</h2>
        </Reveal>

        <motion.div style={{ width: lineWidth }} className="mt-7 h-1.5 rounded-full bg-pop-red" aria-hidden />

        <div className="mt-8 flex flex-col gap-5 text-lg leading-relaxed text-cream/80 md:text-xl">
          {problem.body.map((paragraph, i) => (
            <Reveal key={i} delay={0.12 + i * 0.08}>
              <p>{paragraph}</p>
            </Reveal>
          ))}
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-3">
          {problem.stats.map((stat, i) => (
            <Reveal key={stat.label} delay={0.1 + i * 0.1} direction="scale">
              <div className="rounded-[2rem] border-3 border-cream/25 px-6 py-7 text-center">
                <p className="font-display text-4xl font-bold text-pop-yellow md:text-5xl">{stat.value}</p>
                <p className="mt-2 text-sm text-cream/65">{stat.label}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <p className="mt-10 text-center font-display text-sm text-cream/45">
            Ordres de grandeur observés sur le marché, donnés à titre indicatif.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
