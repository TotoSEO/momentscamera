'use client'

import { AnimatePresence, motion } from 'motion/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useCart, cartTotals } from '@/lib/cart-store'
import { formatPrice, routes, site } from '@/lib/site'
import { Button, ButtonLink } from '@/components/ui/Button'
import { CameraGlyph } from '@/components/ui/CameraGlyph'
import { getColorway } from '@/content/product'

/**
 * Tiroir de panier global.
 * Rendu à la racine pour qu'un ajout depuis n'importe quelle page l'ouvre.
 */
export function CartProvider({ children }: { children: React.ReactNode }) {
  const { lines, isOpen, close, setQuantity, remove } = useCart()
  const totals = cartTotals(lines)
  const router = useRouter()

  // Verrouille le scroll de la page derrière le tiroir.
  useEffect(() => {
    if (!isOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [isOpen])

  // Échap ferme le tiroir.
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, close])

  return (
    <>
      {children}

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              key="scrim"
              className="fixed inset-0 z-90 bg-ink/45 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
              aria-hidden
            />

            <motion.aside
              key="drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Panier"
              className="fixed inset-y-0 right-0 z-100 flex w-full max-w-md flex-col border-l-3 border-ink bg-cream"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            >
              <header className="flex items-center justify-between border-b-3 border-ink bg-pop-yellow px-6 py-5">
                <h2 className="font-display text-2xl font-bold">
                  Votre panier{totals.itemCount > 0 && ` (${totals.itemCount})`}
                </h2>
                <button
                  onClick={close}
                  aria-label="Fermer le panier"
                  className="grid size-10 place-items-center rounded-full border-3 border-ink bg-cream text-xl leading-none transition-transform hover:rotate-90"
                >
                  ×
                </button>
              </header>

              <div className="flex-1 overflow-y-auto px-6 py-6">
                {totals.resolved.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center gap-5 text-center">
                    <div className="animate-wiggle">
                      <CameraGlyph className="w-28" bodyColor="#9a9aa8" />
                    </div>
                    <p className="max-w-xs font-display text-xl">Il n’y a encore aucun moment là-dedans.</p>
                    <ButtonLink href={routes.product} variant="primary" size="sm">
                      Choisir ma couleur
                    </ButtonLink>
                  </div>
                ) : (
                  <ul className="flex flex-col gap-4">
                    {totals.resolved.map(({ line, bundleName, colorNames, totalCents, deviceCount, perDeviceCents }) => (
                      <li key={line.id} className="pop-card flex gap-4 p-4">
                        <div className="flex w-16 shrink-0 flex-col gap-1.5">
                          {line.colorSlugs.map((slug, i) => (
                            <CameraGlyph
                              key={`${slug}-${i}`}
                              className="w-12"
                              bodyColor={getColorway(slug)?.hex ?? '#9a9aa8'}
                            />
                          ))}
                        </div>

                        <div className="flex min-w-0 flex-1 flex-col gap-2">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="font-display text-lg leading-tight font-bold">{bundleName}</p>
                              <p className="truncate text-sm text-ink-soft">{colorNames.join(' · ')}</p>
                              <p className="font-mono text-xs text-ink-soft">
                                {deviceCount} appareil{deviceCount > 1 ? 's' : ''} ·{' '}
                                {formatPrice(perDeviceCents)} l’unité
                              </p>
                            </div>
                            <button
                              onClick={() => remove(line.id)}
                              aria-label={`Retirer ${bundleName}`}
                              className="shrink-0 text-sm text-ink-soft underline underline-offset-2 hover:text-pop-red"
                            >
                              Retirer
                            </button>
                          </div>

                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-1 rounded-full border-3 border-ink bg-cream">
                              <button
                                onClick={() => setQuantity(line.id, line.quantity - 1)}
                                aria-label="Diminuer la quantité"
                                className="grid size-8 place-items-center rounded-full font-bold hover:bg-pop-yellow"
                              >
                                −
                              </button>
                              <span className="w-6 text-center font-mono text-sm" aria-live="polite">
                                {line.quantity}
                              </span>
                              <button
                                onClick={() => setQuantity(line.id, line.quantity + 1)}
                                aria-label="Augmenter la quantité"
                                className="grid size-8 place-items-center rounded-full font-bold hover:bg-pop-yellow"
                              >
                                +
                              </button>
                            </div>
                            <span className="font-display text-lg font-bold">{formatPrice(totalCents)}</span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {totals.resolved.length > 0 && (
                <footer className="border-t-3 border-ink bg-paper px-6 py-5">
                  {!totals.freeShipping && (
                    <p className="mb-3 rounded-2xl border-3 border-ink bg-pop-lime px-4 py-2 text-center text-sm font-semibold">
                      Plus que {formatPrice(totals.missingForFreeShippingCents)} pour la livraison offerte
                    </p>
                  )}

                  <dl className="mb-4 flex flex-col gap-1.5 text-sm">
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
                    <div className="mt-1 flex justify-between border-t-2 border-dashed border-ink pt-2 font-display text-xl font-bold">
                      <dt>Total</dt>
                      <dd>{formatPrice(totals.totalCents)}</dd>
                    </div>
                  </dl>

                  <Button
                    variant="primary"
                    size="md"
                    shine
                    className="w-full"
                    onClick={() => {
                      close()
                      // `router.push` respecte le basePath ; `window.location`
                      // l'ignorerait et sortirait du site en sous-répertoire.
                      router.push(routes.cart)
                    }}
                  >
                    Passer commande
                  </Button>

                  <p className="mt-3 text-center text-xs text-ink-soft">
                    Paiement sécurisé · {site.returnWindowDays} jours de rétractation légale ·{' '}
                    <Link href={routes.cgv} className="underline underline-offset-2">
                      CGV
                    </Link>
                  </p>
                </footer>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
