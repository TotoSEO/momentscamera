'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { Reveal } from '@/components/ui/Reveal'
import { faq } from '@/content/faq'

/** Accordéon d'objections. Une seule réponse ouverte à la fois. */
export function Faq() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="scroll-mt-24 border-y-3 border-ink bg-cream-deep px-4 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <h2 className="text-center text-[clamp(2rem,5vw,3.4rem)]">Les questions qu’on nous pose</h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="mt-4 text-center text-lg text-ink-soft">
            Y compris celles qui arrangent moins. On préfère un client informé qu’un colis retourné.
          </p>
        </Reveal>

        <div className="mt-12 flex flex-col gap-3">
          {faq.map((item, i) => {
            const isOpen = open === i
            return (
              <Reveal key={item.q} delay={Math.min(i, 5) * 0.04}>
                <div className="overflow-hidden rounded-[1.75rem] border-3 border-ink bg-paper shadow-pop-sm">
                  <h3>
                    <button
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${i}`}
                      className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-display text-lg font-bold"
                    >
                      {item.q}
                      <motion.span
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 24 }}
                        className="grid size-8 shrink-0 place-items-center rounded-full border-3 border-ink bg-pop-yellow text-xl leading-none"
                        aria-hidden
                      >
                        +
                      </motion.span>
                    </button>
                  </h3>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-panel-${i}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <p className="border-t-2 border-dashed border-ink/25 px-6 py-5 leading-relaxed text-ink-soft">
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
