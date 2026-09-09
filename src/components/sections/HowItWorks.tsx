'use client'

import { motion } from 'motion/react'
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/Reveal'
import { solution } from '@/content/copy'

const tones = ['bg-pop-yellow', 'bg-pop-blue text-white', 'bg-pop-green']

/** PAS — la Solution, découpée en trois gestes concrets. */
export function HowItWorks() {
  return (
    <section id="comment" className="scroll-mt-24 px-4 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <p className="font-mono text-sm tracking-widest text-pop-red uppercase">{solution.kicker}</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-4 text-[clamp(2rem,5vw,3.6rem)]">{solution.title}</h2>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="mt-6 text-lg leading-relaxed text-ink-soft md:text-xl">{solution.body}</p>
          </Reveal>
        </div>

        <RevealGroup className="mt-16 grid gap-6 md:grid-cols-3" stagger={0.12}>
          {solution.steps.map((step, i) => (
            <RevealItem key={step.n}>
              <motion.article
                whileHover={{ y: -8, rotate: i % 2 === 0 ? -1.2 : 1.2 }}
                transition={{ type: 'spring', stiffness: 320, damping: 20 }}
                className="pop-card h-full p-8"
              >
                <span
                  className={`inline-grid size-14 place-items-center rounded-full border-3 border-ink font-display text-xl font-bold ${tones[i]}`}
                >
                  {step.n}
                </span>
                <h3 className="mt-5 text-2xl">{step.title}</h3>
                <p className="mt-3 leading-relaxed text-ink-soft">{step.body}</p>
              </motion.article>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}
