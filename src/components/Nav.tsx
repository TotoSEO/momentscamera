'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion, useScroll, useMotionValueEvent } from 'motion/react'
import { useCart, cartTotals } from '@/lib/cart-store'
import { formatPrice, routes, site } from '@/lib/site'
import { product } from '@/content/product'
import { useHydrated } from '@/lib/client-state'
import { CameraGlyph } from '@/components/ui/CameraGlyph'
import { MobileMenu } from '@/components/MobileMenu'

const links = [
  { href: routes.product, label: 'Le produit' },
  { href: '/#comment', label: 'Comment ça marche' },
  { href: '/#couleurs', label: 'Couleurs' },
  { href: '/#faq', label: 'Questions' },
]

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { scrollY } = useScroll()
  const { toggle, lines } = useCart()
  const { itemCount } = cartTotals(lines)

  // Le compteur ne s'affiche qu'après hydratation, sinon le HTML serveur
  // (panier vide) et le client (panier restauré) divergent.
  const mounted = useHydrated()

  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 24))

  return (
    <motion.header
      className="sticky top-0 z-80 border-b-3 border-ink transition-colors duration-300"
      animate={{ backgroundColor: scrolled ? '#fffdf8' : 'rgba(255,246,233,0)' }}
      style={{ backdropFilter: scrolled ? 'blur(8px)' : 'none' }}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-8">
        <Link href={routes.home} className="flex items-center gap-2.5" aria-label={`${site.name}, accueil`}>
          <CameraGlyph className="w-11" />
          <span className="font-display text-xl leading-none font-bold md:text-2xl">
            Moments<span className="text-pop-red">.</span>
          </span>
        </Link>

        <ul className="hidden items-center gap-7 lg:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="relative font-display font-semibold after:absolute after:-bottom-1 after:left-0 after:h-1 after:w-0 after:rounded-full after:bg-pop-red after:transition-all after:duration-300 hover:after:w-full"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Ouvrir le menu"
            aria-expanded={menuOpen}
            className="grid size-11 place-items-center rounded-full border-3 border-ink bg-paper shadow-pop-sm transition-transform hover:-translate-y-0.5 lg:hidden"
          >
            <MenuIcon />
          </button>

          <Link
            href={routes.product}
            className="hidden rounded-full border-3 border-ink bg-pop-yellow px-5 py-2 font-display text-sm font-bold shadow-pop-sm transition-transform hover:-translate-y-0.5 sm:inline-flex"
          >
            À partir de {formatPrice(product.fromPriceCents)}
          </Link>

          <button
            onClick={toggle}
            aria-label={`Ouvrir le panier${mounted && itemCount > 0 ? ` (${itemCount} article${itemCount > 1 ? 's' : ''})` : ''}`}
            className="relative grid size-11 place-items-center rounded-full border-3 border-ink bg-paper shadow-pop-sm transition-transform hover:-translate-y-0.5"
          >
            <CartIcon />
            {mounted && itemCount > 0 && (
              <motion.span
                key={itemCount}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 600, damping: 18 }}
                className="absolute -top-2 -right-2 grid size-6 place-items-center rounded-full border-2 border-ink bg-pop-red font-mono text-xs font-bold text-white"
              >
                {itemCount}
              </motion.span>
            )}
          </button>
        </div>
      </nav>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </motion.header>
  )
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.8" aria-hidden>
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  )
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
      <path d="M4 6h16l-1.4 9.3a2 2 0 0 1-2 1.7H7.4a2 2 0 0 1-2-1.7L4 6Z" strokeLinejoin="round" />
      <path d="M8.5 6a3.5 3.5 0 0 1 7 0" strokeLinecap="round" />
      <circle cx="9" cy="20" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="16" cy="20" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  )
}
