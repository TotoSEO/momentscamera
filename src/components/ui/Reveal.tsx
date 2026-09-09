'use client'

import { motion, type Variants } from 'motion/react'
import type { ReactNode } from 'react'

type Direction = 'up' | 'down' | 'left' | 'right' | 'scale'

const offsets: Record<Direction, { x?: number; y?: number; scale?: number }> = {
  up: { y: 34 },
  down: { y: -34 },
  left: { x: 34 },
  right: { x: -34 },
  scale: { scale: 0.9 },
}

/**
 * Apparition au scroll.
 * `once: true` + marge négative : l'élément se révèle un peu avant
 * d'entrer réellement dans le viewport, ce qui évite l'effet « pop » tardif.
 */
export function Reveal({
  children,
  direction = 'up',
  delay = 0,
  className,
}: {
  children: ReactNode
  direction?: Direction
  delay?: number
  className?: string
}) {
  const variants: Variants = {
    hidden: { opacity: 0, ...offsets[direction] },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
    },
  }

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
    >
      {children}
    </motion.div>
  )
}

/** Conteneur qui décale l'apparition de ses enfants directs. */
export function RevealGroup({
  children,
  stagger = 0.08,
  className,
}: {
  children: ReactNode
  stagger?: number
  className?: string
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={{ visible: { transition: { staggerChildren: stagger } } }}
    >
      {children}
    </motion.div>
  )
}

export function RevealItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 28 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
      }}
    >
      {children}
    </motion.div>
  )
}
