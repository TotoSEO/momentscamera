'use client'

import { motion } from 'motion/react'
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/Reveal'
import { useCases } from '@/content/copy'

const accents: Record<string, string> = {
  red: 'bg-pop-red',
  yellow: 'bg-pop-yellow',
  blue: 'bg-pop-blue',
  green: 'bg-pop-green',
  lime: 'bg-pop-lime',
}

/** BAB — Before / After / Bridge, une carte par situation. */
export function UseCases() {
  return (
    <section className="px-4 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="max-w-3xl text-[clamp(2rem,5vw,3.6rem)]">
            Les moments où vous regretterez de ne pas l’avoir eu
          </h2>
        </Reveal>

        <RevealGroup className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.07}>
          {useCases.map((useCase) => (
            <RevealItem key={useCase.title}>
              <motion.article
                whileHover={{ y: -6 }}
                transition={{ type: 'spring', stiffness: 340, damping: 22 }}
                className="pop-card flex h-full flex-col overflow-hidden"
              >
                <div className={`flex items-center gap-3 border-b-3 border-ink px-6 py-4 ${accents[useCase.color]}`}>
                  <h3 className="text-xl">{useCase.title}</h3>
                </div>

                <div className="flex flex-1 flex-col gap-4 p-6">
                  <div className="flex gap-3">
                    <span className="mt-0.5 font-mono text-xs font-bold text-pop-red">AVANT</span>
                    <p className="flex-1 text-sm leading-relaxed text-ink-soft line-through decoration-pop-red/50 decoration-2">
                      {useCase.before}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <span className="mt-0.5 font-mono text-xs font-bold text-pop-green-deep">APRÈS</span>
                    <p className="flex-1 leading-relaxed font-semibold">{useCase.after}</p>
                  </div>
                </div>
              </motion.article>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}
