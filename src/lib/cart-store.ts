'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { bundles, colorways, getBundle, getColorway, type ColorwaySlug } from '@/content/product'
import { site } from '@/lib/site'

export type CartLine = {
  /** Clé stable : pack + couleurs choisies. Deux lignes identiques fusionnent. */
  id: string
  bundleId: string
  /** Une entrée par appareil du pack (le Duo en a deux). */
  colorSlugs: ColorwaySlug[]
  quantity: number
}

type CartState = {
  lines: CartLine[]
  isOpen: boolean
  /** Évite d'afficher un panier vide pendant la réhydratation du localStorage. */
  hydrated: boolean
  add: (bundleId: string, colorSlugs: ColorwaySlug[], quantity?: number) => void
  remove: (id: string) => void
  setQuantity: (id: string, quantity: number) => void
  clear: () => void
  open: () => void
  close: () => void
  toggle: () => void
}

function lineId(bundleId: string, colorSlugs: ColorwaySlug[]): string {
  return `${bundleId}::${colorSlugs.join('+')}`
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      isOpen: false,
      hydrated: false,

      add: (bundleId, colorSlugs, quantity = 1) =>
        set((state) => {
          const id = lineId(bundleId, colorSlugs)
          const existing = state.lines.find((l) => l.id === id)
          const lines = existing
            ? state.lines.map((l) => (l.id === id ? { ...l, quantity: l.quantity + quantity } : l))
            : [...state.lines, { id, bundleId, colorSlugs, quantity }]
          return { lines, isOpen: true }
        }),

      remove: (id) => set((state) => ({ lines: state.lines.filter((l) => l.id !== id) })),

      setQuantity: (id, quantity) =>
        set((state) => ({
          lines:
            quantity <= 0
              ? state.lines.filter((l) => l.id !== id)
              : state.lines.map((l) => (l.id === id ? { ...l, quantity: Math.min(quantity, 20) } : l)),
        })),

      clear: () => set({ lines: [] }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set((s) => ({ isOpen: !s.isOpen })),
    }),
    {
      name: 'moments-camera-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ lines: state.lines }),
      /**
       * Un panier stocké il y a trois mois peut référencer un pack ou un
       * coloris disparu du catalogue : on purge à la réhydratation plutôt
       * que de planter au rendu.
       */
      onRehydrateStorage: () => (state) => {
        if (!state) return
        state.lines = state.lines.filter((line) => resolveLine(line) !== null)
        state.hydrated = true
      },
    },
  ),
)

/** Détail calculé d'une ligne de panier, prêt à l'affichage. */
export type ResolvedLine = {
  line: CartLine
  bundleName: string
  colorNames: string[]
  unitPriceCents: number
  totalCents: number
}

export function resolveLine(line: CartLine): ResolvedLine | null {
  const bundle = getBundle(line.bundleId)
  if (!bundle) return null

  const colors = line.colorSlugs.map((slug) => getColorway(slug)).filter((c) => c !== undefined)
  if (colors.length !== bundle.quantity) return null

  return {
    line,
    bundleName: bundle.name,
    colorNames: colors.map((c) => c.name),
    unitPriceCents: bundle.priceCents,
    totalCents: bundle.priceCents * line.quantity,
  }
}

export function cartTotals(lines: CartLine[]) {
  const resolved = lines.map(resolveLine).filter((l) => l !== null)
  const subtotalCents = resolved.reduce((sum, l) => sum + l.totalCents, 0)
  const itemCount = resolved.reduce((sum, l) => sum + l.line.quantity, 0)
  const freeShipping = subtotalCents >= site.freeShippingThresholdCents
  const shippingCents = subtotalCents === 0 || freeShipping ? 0 : site.shippingFlatCents

  return {
    resolved,
    itemCount,
    subtotalCents,
    shippingCents,
    freeShipping,
    totalCents: subtotalCents + shippingCents,
    missingForFreeShippingCents: Math.max(0, site.freeShippingThresholdCents - subtotalCents),
  }
}

/** Garde-fou : les identifiants venant du localStorage sont validés avant usage. */
export function isKnownBundle(id: string): boolean {
  return bundles.some((b) => b.id === id)
}

export function isKnownColorway(slug: string): slug is ColorwaySlug {
  return colorways.some((c) => c.slug === slug)
}
