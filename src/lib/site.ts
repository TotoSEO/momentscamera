/**
 * Configuration globale de la boutique.
 * Tout ce qui est susceptible de changer sans toucher au code vit ici.
 */

export const site = {
  name: 'Moments Caméra',
  tagline: 'Le porte-clés qui prend de vraies photos',
  description:
    "Un appareil photo miniature de 26 g qui tient sur vos clés. Vidéo 1080p, grand-angle 130°, prêt en une seconde. Capturez les moments que le téléphone vous fait rater.",
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
  /**
   * Délai de livraison annoncé, en jours ouvrés. Valeur unique, reprise par la
   * FAQ, la page Livraison, les CGV et la page de remerciement.
   *
   * Annoncer un délai qu'on ne tient pas est une pratique commerciale trompeuse
   * (art. L121-2 du Code de la consommation), et le vendeur reste responsable du
   * délai même lorsque c'est le fournisseur qui expédie (art. L221-15).
   * Ordres de grandeur : 3 à 5 jours avec du stock en France, 10 à 20 jours en
   * expédition directe depuis la Chine. À aligner sur le délai réellement
   * constaté avant d'ouvrir la boutique.
   */
  deliveryDays: { fr: [3, 5], eu: [5, 8] },
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

/** Met en forme une plage de délais : « 3 à 5 jours ouvrés ». */
export function deliveryRange(range: readonly [number, number]): string {
  const [min, max] = range
  return min === max ? `${min} jours ouvrés` : `${min} à ${max} jours ouvrés`
}

export function formatPrice(cents: number, currency = site.currency): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100)
}
