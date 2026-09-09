'use client'

import { motion } from 'motion/react'
import type { Bundle } from '@/content/product'
import { bundleUnitPriceCents } from '@/content/product'
import { formatPrice, site } from '@/lib/site'

/**
 * Sélecteur de quantité du pack en nombre.
 *
 * Le prix unitaire descend par paliers : on montre le palier atteint et,
 * tant qu'il en reste un, ce qu'il faudrait commander pour y accéder.
 * C'est le levier de panier moyen le plus honnête qui soit : il n'invente
 * aucune urgence, il annonce une remise réelle.
 */
export function BulkQuantity({
  bundle,
  quantity,
  onChange,
}: {
  bundle: Bundle
  quantity: number
  onChange: (quantity: number) => void
}) {
  if (!bundle.bulk) return null

  const { minQuantity, maxQuantity, tiers } = bundle.bulk
  const unitPrice = bundleUnitPriceCents(bundle, quantity)
  const nextTier = tiers.find((t) => t.minQuantity > quantity)
  const presets = tiers.map((t) => t.minQuantity)

  const clamp = (n: number) => Math.min(maxQuantity, Math.max(minQuantity, n))

  return (
    <div className="rounded-[1.5rem] border-3 border-ink bg-cream-deep p-5">
      <label htmlFor="bulk-quantity" className="font-display text-base font-bold">
        Combien d’appareils ?
      </label>

      <div className="mt-3 flex items-center gap-3">
        <div className="flex items-center gap-1 rounded-full border-3 border-ink bg-paper">
          <button
            type="button"
            onClick={() => onChange(clamp(quantity - 1))}
            aria-label="Retirer un appareil"
            className="grid size-10 place-items-center rounded-full text-lg font-bold hover:bg-pop-yellow"
          >
            −
          </button>
          <input
            id="bulk-quantity"
            type="number"
            inputMode="numeric"
            min={minQuantity}
            max={maxQuantity}
            value={quantity}
            onChange={(e) => {
              const next = Number(e.target.value)
              if (Number.isFinite(next)) onChange(clamp(Math.round(next)))
            }}
            className="w-16 bg-transparent text-center font-mono text-lg font-bold outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
          />
          <button
            type="button"
            onClick={() => onChange(clamp(quantity + 1))}
            aria-label="Ajouter un appareil"
            className="grid size-10 place-items-center rounded-full text-lg font-bold hover:bg-pop-yellow"
          >
            +
          </button>
        </div>

        <motion.p key={unitPrice} initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="font-display font-bold">
          {formatPrice(unitPrice)} <span className="font-normal text-ink-soft">l’unité</span>
        </motion.p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {presets.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={`rounded-full border-3 border-ink px-3.5 py-1 font-display text-sm font-bold transition-colors ${
              quantity === n ? 'bg-ink text-cream' : 'bg-paper hover:bg-pop-yellow'
            }`}
          >
            {n}
          </button>
        ))}
        <button
          type="button"
          onClick={() => onChange(maxQuantity)}
          className={`rounded-full border-3 border-ink px-3.5 py-1 font-display text-sm font-bold transition-colors ${
            quantity === maxQuantity ? 'bg-ink text-cream' : 'bg-paper hover:bg-pop-yellow'
          }`}
        >
          {maxQuantity}
        </button>
      </div>

      {nextTier && (
        <p className="mt-4 rounded-2xl border-3 border-ink bg-pop-lime px-4 py-2 text-sm font-semibold">
          À partir de {nextTier.minQuantity} appareils, le prix passe à{' '}
          {formatPrice(nextTier.unitPriceCents)} l’unité.
        </p>
      )}

      <p className="mt-3 text-xs leading-relaxed text-ink-soft">
        Au-delà de {maxQuantity} appareils, écrivez-nous à{' '}
        <a href={`mailto:${site.email}`} className="underline underline-offset-2">
          {site.email}
        </a>{' '}
        : on établit un devis, avec la possibilité de personnaliser les coloris du lot.
      </p>
    </div>
  )
}
