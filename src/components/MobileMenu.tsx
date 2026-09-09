'use client'

import Link from 'next/link'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect } from 'react'
import { formatPrice, routes, site } from '@/lib/site'
import { product } from '@/content/product'
import { CameraGlyph } from '@/components/ui/CameraGlyph'

/**
 * Menu mobile.
 *
 * Il ne liste pas l'arborescence du site mais le chemin d'achat, dans
 * l'ordre où les questions se posent : le produit, à quoi il sert, quelles
 * couleurs, combien, et ce qui rassure. Les pages légales restent au pied
 * de page, elles n'ont rien à faire dans un menu de vente.
 */
const groups = [
  {
    title: 'Acheter',
    links: [
      { href: routes.product, label: 'La fiche produit', emoji: '📷' },
      { href: '/#offres', label: 'Les packs et les prix', emoji: '🏷️' },
      { href: '/#couleurs', label: 'Les 9 couleurs', emoji: '🎨' },
    ],
  },
  {
    title: 'Comprendre',
    links: [
      { href: '/#comment', label: 'Comment ça marche', emoji: '⚡' },
      { href: '/#faq', label: 'Questions fréquentes', emoji: '💬' },
      { href: routes.shipping, label: 'Livraison et retours', emoji: '📦' },
    ],
  },
]

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  // Verrouille le scroll de la page derrière le panneau.
  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="scrim"
            className="fixed inset-0 z-90 bg-ink/45 backdrop-blur-[2px] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden
          />

          <motion.nav
            key="panel"
            aria-label="Menu principal"
            className="fixed inset-x-0 top-0 z-100 max-h-dvh overflow-y-auto border-b-3 border-ink bg-cream pb-8 lg:hidden"
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 32 }}
          >
            <div className="flex items-center justify-between border-b-3 border-ink bg-pop-yellow px-4 py-3">
              <Link href={routes.home} onClick={onClose} className="flex items-center gap-2.5">
                <CameraGlyph className="w-11" />
                <span className="font-display text-xl leading-none font-bold">
                  Moments<span className="text-pop-red">.</span>
                </span>
              </Link>
              <button
                onClick={onClose}
                aria-label="Fermer le menu"
                className="grid size-11 place-items-center rounded-full border-3 border-ink bg-cream text-2xl leading-none transition-transform hover:rotate-90"
              >
                ×
              </button>
            </div>

            <div className="px-4 pt-5">
              <Link
                href={routes.product}
                onClick={onClose}
                className="cta-shine flex w-full items-center justify-center gap-2 rounded-full border-3 border-ink bg-pop-red px-6 py-4 font-display text-lg font-bold text-white shadow-pop"
              >
                Je prends le mien · {formatPrice(product.fromPriceCents)}
              </Link>
            </div>

            {groups.map((group) => (
              <div key={group.title} className="px-4 pt-6">
                <h2 className="font-mono text-xs tracking-widest text-ink-soft uppercase">
                  {group.title}
                </h2>
                <ul className="mt-3 flex flex-col gap-2">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={onClose}
                        className="flex items-center gap-3 rounded-[1.25rem] border-3 border-ink bg-paper px-4 py-3.5 font-display font-bold shadow-pop-sm transition-transform active:translate-y-0.5"
                      >
                        <span aria-hidden>{link.emoji}</span>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="px-4 pt-6">
              <p className="rounded-[1.25rem] border-3 border-dashed border-ink px-4 py-3 text-center text-sm text-ink-soft">
                Une question ?{' '}
                <a href={`mailto:${site.email}`} className="font-semibold underline underline-offset-2">
                  {site.email}
                </a>
              </p>
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  )
}
