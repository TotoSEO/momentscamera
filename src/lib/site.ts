/**
 * Configuration globale de la boutique.
 * Tout ce qui est susceptible de changer sans toucher au code vit ici.
 */

export const site = {
  name: 'Moments Caméra',
  tagline: 'Le porte-clés qui prend de vraies photos',
  description:
    "Un appareil photo miniature qui tient sur vos clés. 1080p, photo et vidéo, prêt en une seconde. Capturez les moments que le téléphone vous fait rater.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://momentscamera.fr',
  locale: 'fr_FR',
  lang: 'fr',
  currency: 'EUR',
  currencySymbol: '€',
  email: 'bonjour@momentscamera.fr',
  instagram: 'https://instagram.com/momentscamera',
  tiktok: 'https://tiktok.com/@momentscamera',
  /** Délai de rétractation légal en France (art. L221-18 du Code de la consommation). */
  returnWindowDays: 14,
  /** Garantie commerciale affichée. À aligner avec ce que vous êtes prêt à honorer. */
  warrantyMonths: 12,
  freeShippingThresholdCents: 4000,
  shippingFlatCents: 390,
} as const

export const routes = {
  home: '/',
  product: '/produit',
  cart: '/panier',
  success: '/merci',
  faq: '/#faq',
  cgv: '/cgv',
  legal: '/mentions-legales',
  privacy: '/confidentialite',
  shipping: '/livraison-et-retours',
} as const

export function formatPrice(cents: number, currency = site.currency): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100)
}
