'use client'

import Image from 'next/image'
import { AnimatePresence, motion } from 'motion/react'
import type { Colorway } from '@/content/product'
import { cn } from '@/lib/cn'

/**
 * Photo fabricant du coloris sélectionné.
 *
 * Ce sont les vrais produits, contrairement au modèle 3D qui reste une
 * représentation. Partout où l'acheteur décide, c'est cette photo qui doit
 * être montrée.
 *
 * Le fondu enchaîné à chaque changement de coloris évite le clignotement
 * d'un simple remplacement de `src`.
 */
export function ProductPhoto({
  colorway,
  className,
  priority = false,
  framed = false,
  sizes = '(max-width: 1024px) 92vw, 46vw',
}: {
  colorway: Colorway
  className?: string
  priority?: boolean
  /**
   * Encadre la photo. Les visuels fabricant sont détourés sur fond blanc :
   * posés tels quels sur une section colorée, ils forment un rectangle
   * blanc accidentel. La carte en fait un choix.
   */
  framed?: boolean
  sizes?: string
}) {
  return (
    <div
      className={cn(
        'relative isolate',
        framed && 'overflow-hidden rounded-[2rem] border-3 border-ink bg-white shadow-pop',
        className,
      )}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={colorway.slug}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={colorway.photo}
            alt={`Appareil photo porte-clés Moments Caméra, coloris ${colorway.name}, vu de face et de dos`}
            fill
            sizes={sizes}
            priority={priority}
            className="object-contain"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
