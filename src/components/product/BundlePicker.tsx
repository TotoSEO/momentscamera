'use client'

import { motion } from 'motion/react'
import { bundleLinePriceCents, bundles, perDevicePriceCents, type Bundle } from '@/content/product'
import { formatPrice } from '@/lib/site'

export function BundlePicker({
  value,
  onChange,
  bulkQuantity,
}: {
  value: Bundle['id']
  onChange: (id: Bundle['id']) => void
  /** Quantité en cours sur le pack en nombre, pour afficher son vrai prix. */
  bulkQuantity: number
}) {
  return (
    <div role="radiogroup" aria-label="Choisissez votre pack" className="flex flex-col gap-3">
      {bundles.map((bundle) => {
        const active = bundle.id === value
        const isBulk = bundle.bulk !== undefined
        const quantity = isBulk ? bulkQuantity : 1
        // Deux prix distincts : celui de la ligne (facturé) et celui ramené
        // à un appareil (affiché derrière « l'unité »).
        const linePrice = bundleLinePriceCents(bundle, quantity)
        const devices = bundle.quantity * quantity
        const total = linePrice * quantity
        const perDevice = perDevicePriceCents(bundle, quantity)
        const saving = bundle.compareAtCents * (isBulk ? quantity : 1) - total

        return (
          <motion.button
            key={bundle.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(bundle.id)}
            whileTap={{ scale: 0.985 }}
            className={`relative flex items-center gap-4 rounded-[1.5rem] border-3 border-ink px-5 py-4 text-left transition-colors ${
              active ? 'bg-pop-yellow shadow-pop' : 'bg-paper shadow-pop-sm hover:bg-cream-deep'
            }`}
          >
            <span
              className={`grid size-6 shrink-0 place-items-center rounded-full border-3 border-ink ${
                active ? 'bg-ink' : 'bg-paper'
              }`}
              aria-hidden
            >
              {active && <span className="size-2 rounded-full bg-pop-yellow" />}
            </span>

            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-center gap-2">
                <span className="font-display text-lg font-bold">{bundle.name}</span>
                {bundle.badge && (
                  <span className="rounded-full border-2 border-ink bg-pop-red px-2.5 py-0.5 font-display text-xs font-bold text-white">
                    {bundle.badge}
                  </span>
                )}
              </span>
              <span className="mt-0.5 block text-sm text-ink-soft">
                {devices} appareil{devices > 1 ? 's' : ''} · {formatPrice(perDevice)} l’unité
              </span>
            </span>

            <span className="shrink-0 text-right">
              <span className="block font-display text-xl leading-none font-bold">
                {formatPrice(total)}
              </span>
              {saving > 0 && (
                <span className="mt-1 block font-mono text-xs text-ink-soft line-through">
                  {formatPrice(bundle.compareAtCents * (isBulk ? quantity : 1))}
                </span>
              )}
            </span>
          </motion.button>
        )
      })}
    </div>
  )
}
