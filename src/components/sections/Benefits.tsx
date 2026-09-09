'use client'

import { motion } from 'motion/react'
import { RevealGroup, RevealItem, Reveal } from '@/components/ui/Reveal'
import { benefits } from '@/content/copy'

const palette: Record<string, string> = {
  yellow: 'bg-pop-yellow',
  red: 'bg-pop-red text-white',
  blue: 'bg-pop-blue text-white',
  green: 'bg-pop-green',
  lime: 'bg-pop-lime',
}

/** AIDA — Desire. Une carte = un bénéfice, la spec arrive en second. */
export function Benefits() {
  return (
    <section className="border-y-3 border-ink bg-cream-deep px-4 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="max-w-2xl text-[clamp(2rem,5vw,3.6rem)]">
            Six raisons pour lesquelles il ne quittera plus vos clés
          </h2>
        </Reveal>

        <RevealGroup className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" stagger={0.07}>
          {benefits.map((benefit, i) => (
            <RevealItem key={benefit.title}>
              <motion.article
                whileHover={{ y: -6, scale: 1.015 }}
                transition={{ type: 'spring', stiffness: 340, damping: 22 }}
                className={`h-full rounded-[2rem] border-3 border-ink p-7 shadow-pop ${palette[benefit.color] ?? 'bg-paper'}`}
                style={{ rotate: `${(i % 3) - 1}deg` }}
              >
                <span className="text-4xl" aria-hidden>
                  {benefit.emoji}
                </span>
                <h3 className="mt-4 text-2xl">{benefit.title}</h3>
                <p className="mt-3 leading-relaxed opacity-85">{benefit.body}</p>
              </motion.article>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}
