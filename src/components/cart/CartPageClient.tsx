'use client'

import Link from 'next/link'
import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useCart, cartTotals } from '@/lib/cart-store'
import { formatPrice, routes, site } from '@/lib/site'
import { useHydrated, useSearchParam } from '@/lib/client-state'
import { Button, ButtonLink } from '@/components/ui/Button'
import { CameraGlyph } from '@/components/ui/CameraGlyph'
import { getColorway } from '@/content/product'
import { guarantees } from '@/content/copy'

export function CartPageClient() {
  const { lines, setQuantity, remove } = useCart()
  const totals = cartTotals(lines)

  const mounted = useHydrated()
  const cancelled = useSearchParam('annule') !== null
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function checkout() {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          lines: lines.map((l) => ({
            bundleId: l.bundleId,
            colorSlugs: l.colorSlugs,
            quantity: l.quantity,
          })),
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.url) {
        setError(data.error ?? 'Le paiement n’a pas pu démarrer. Réessayez dans un instant.')
        return
      }

      window.location.href = data.url
    } catch {
      setError('Connexion perdue. Vérifiez votre réseau et réessayez.')
    } finally {
      setLoading(false)
    }
  }

  // Avant l'hydratation, le panier stocké n'est pas encore lu :
  // afficher « vide » à ce moment-là ferait clignoter la page.
  if (!mounted) {
    return (
      <div className="mx-auto grid min-h-[50vh] max-w-6xl place-items-center px-4">
        <div className="animate-wiggle">
          <CameraGlyph className="w-20 opacity-40" bodyColor="#9a9aa8" />
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-8 md:py-16">
      <h1 className="text-[clamp(2.2rem,5vw,3.4rem)]">Votre panier</h1>

      {cancelled && (
        <p className="mt-6 rounded-[1.5rem] border-3 border-ink bg-pop-yellow px-6 py-4 font-semibold">
          Paiement interrompu — rien n’a été débité. Votre panier vous attend.
        </p>
      )}

      {totals.resolved.length === 0 ? (
        <div className="mt-12 flex flex-col items-center gap-6 rounded-[2.5rem] border-3 border-dashed border-ink px-6 py-20 text-center">
          <div className="animate-wiggle">
            <CameraGlyph className="w-36" bodyColor="#9a9aa8" />
          </div>
          <p className="max-w-md font-display text-2xl">
            Votre panier est vide. Les moments, eux, n’attendent pas.
          </p>
          <ButtonLink href={routes.product} variant="primary" size="lg" shine>
            Choisir ma couleur
          </ButtonLink>
        </div>
      ) : (
        <div className="mt-10 grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-start">
          {/* ---------------- Lignes ---------------- */}
          <ul className="flex flex-col gap-4">
            <AnimatePresence initial={false}>
              {totals.resolved.map(({ line, bundleName, colorNames, unitPriceCents, totalCents }) => (
                <motion.li
                  key={line.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                  className="pop-card flex flex-col gap-5 p-6 sm:flex-row"
                >
                  <div className="flex shrink-0 flex-wrap gap-2">
                    {line.colorSlugs.map((slug, i) => (
                      <CameraGlyph
                        key={`${slug}-${i}`}
                        className="w-16"
                        bodyColor={getColorway(slug)?.hex ?? '#9a9aa8'}
                        shadeColor={getColorway(slug)?.shadeHex}
                        translucent={getColorway(slug)?.translucent}
                      />
                    ))}
                  </div>

                  <div className="flex flex-1 flex-col gap-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-xl">{bundleName}</h2>
                        <p className="mt-0.5 text-sm text-ink-soft">{colorNames.join(' · ')}</p>
                        <p className="mt-0.5 font-mono text-xs text-ink-soft">
                          {formatPrice(unitPriceCents)} le pack
                        </p>
                      </div>
                      <button
                        onClick={() => remove(line.id)}
                        className="text-sm text-ink-soft underline underline-offset-2 hover:text-pop-red"
                      >
                        Retirer
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-1 rounded-full border-3 border-ink bg-cream">
                        <button
                          onClick={() => setQuantity(line.id, line.quantity - 1)}
                          aria-label="Diminuer la quantité"
                          className="grid size-9 place-items-center rounded-full text-lg font-bold hover:bg-pop-yellow"
                        >
                          −
                        </button>
                        <span className="w-8 text-center font-mono" aria-live="polite">
                          {line.quantity}
                        </span>
                        <button
                          onClick={() => setQuantity(line.id, line.quantity + 1)}
                          aria-label="Augmenter la quantité"
                          className="grid size-9 place-items-center rounded-full text-lg font-bold hover:bg-pop-yellow"
                        >
                          +
                        </button>
                      </div>
                      <span className="font-display text-2xl font-bold">{formatPrice(totalCents)}</span>
                    </div>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>

            <Link
              href={routes.product}
              className="self-start font-display font-semibold underline underline-offset-4"
            >
              ← Continuer mes achats
            </Link>
          </ul>

          {/* ---------------- Récapitulatif ---------------- */}
          <aside className="rounded-[2.5rem] border-3 border-ink bg-paper p-7 shadow-pop lg:sticky lg:top-24">
            <h2 className="text-2xl">Récapitulatif</h2>

            {!totals.freeShipping && (
              <p className="mt-4 rounded-2xl border-3 border-ink bg-pop-lime px-4 py-2.5 text-center text-sm font-semibold">
                Plus que {formatPrice(totals.missingForFreeShippingCents)} pour la livraison offerte
              </p>
            )}

            <dl className="mt-5 flex flex-col gap-2.5">
              <div className="flex justify-between">
                <dt>Sous-total</dt>
                <dd className="font-mono">{formatPrice(totals.subtotalCents)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Livraison</dt>
                <dd className="font-mono">
                  {totals.freeShipping ? 'Offerte' : formatPrice(totals.shippingCents)}
                </dd>
              </div>
              <div className="mt-2 flex justify-between border-t-2 border-dashed border-ink pt-3 font-display text-2xl font-bold">
                <dt>Total</dt>
                <dd>{formatPrice(totals.totalCents)}</dd>
              </div>
              <p className="text-xs text-ink-soft">TVA incluse</p>
            </dl>

            <Button
              variant="primary"
              size="lg"
              shine
              className="mt-6 w-full"
              onClick={checkout}
              disabled={loading}
            >
              {loading ? 'Redirection…' : 'Payer maintenant'}
            </Button>

            {error && (
              <p role="alert" className="mt-3 rounded-2xl border-3 border-ink bg-pop-red px-4 py-3 text-sm text-white">
                {error}
              </p>
            )}

            <ul className="mt-6 flex flex-col gap-2 text-sm text-ink-soft">
              {guarantees.map((g) => (
                <li key={g.title}>
                  {g.emoji} {g.title}
                </li>
              ))}
            </ul>

            <p className="mt-5 text-xs leading-relaxed text-ink-soft">
              En validant, vous acceptez les{' '}
              <Link href={routes.cgv} className="underline underline-offset-2">
                conditions générales de vente
              </Link>
              . Paiement traité par Stripe — {site.name} ne conserve aucune donnée bancaire.
            </p>
          </aside>
        </div>
      )}
    </div>
  )
}
