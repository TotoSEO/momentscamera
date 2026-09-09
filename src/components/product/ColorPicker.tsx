'use client'

import { motion } from 'motion/react'
import { colorways, type ColorwaySlug } from '@/content/product'
import { cn } from '@/lib/cn'

/**
 * Sélecteur de coloris.
 * `groupId` isole l'animation partagée : deux sélecteurs affichés côte à côte
 * (pack Duo) ne se volent pas le curseur.
 */
export function ColorPicker({
  value,
  onChange,
  groupId,
  label,
  className,
}: {
  value: ColorwaySlug
  onChange: (slug: ColorwaySlug) => void
  groupId: string
  label?: string
  className?: string
}) {
  const current = colorways.find((c) => c.slug === value)

  return (
    <fieldset className={cn('flex flex-col gap-2.5', className)}>
      {label && (
        <legend className="font-display text-sm font-bold">
          {label} <span className="font-normal text-ink-soft">: {current?.name}</span>
        </legend>
      )}

      <div className="flex flex-wrap gap-2.5">
        {colorways.map((c) => {
          const active = c.slug === value
          return (
            <button
              key={c.slug}
              type="button"
              role="radio"
              aria-checked={active}
              aria-label={c.name}
              title={c.name}
              onClick={() => onChange(c.slug)}
              className="relative grid size-9 place-items-center rounded-full border-3 border-ink transition-transform hover:-translate-y-1"
              style={{ backgroundColor: c.hex }}
            >
              {c.translucent && (
                <span className="pointer-events-none absolute inset-1 rounded-full border-2 border-white/70" aria-hidden />
              )}
              {active && (
                <motion.span
                  layoutId={`swatch-${groupId}`}
                  className="absolute -inset-1.5 rounded-full border-3 border-ink"
                  transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                />
              )}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
