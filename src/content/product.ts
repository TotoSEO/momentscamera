/**
 * Données produit — source de vérité unique.
 *
 * Les coloris, matériaux et caractéristiques proviennent de la fiche
 * fournisseur Alibaba (réf. G6 Mini Thumb Camera, Muchen Industrial Limited).
 * Voir docs/ALIBABA-SOURCING.md pour les coûts d'achat et la marge.
 */

export type ColorwaySlug =
  | 'rouge-flash'
  | 'jaune-pop'
  | 'bleu-cobalt'
  | 'vert-menthe'
  | 'vert-citron'
  | 'noir-mat'
  | 'blanc-craie'
  | 'gris-galet'
  | 'transparent'

/**
 * Habillage imprimé sur la façade.
 *
 * Le fabricant ne recolore pas un motif unique : chaque coloris a sa propre
 * sérigraphie. Les neuf identifiants ci-dessous correspondent aux neuf
 * visuels produit, un pour un.
 */
export type PrintStyle =
  /** Triangles Memphis et trames de points, « CAMERA » orange. */
  | 'memphis-clear'
  /** Lettres évidées surchargées de portraits au trait continu. */
  | 'lineart-faces'
  /** Bandeau horizontal de formes géométriques, liserés cyan. */
  | 'geo-band'
  /** Memphis années 80 : zigzags, damiers, flèches. */
  | 'memphis-80s'
  /** Synthwave : dégradé rayé, « 1984 » évidé, cassette. */
  | 'synthwave'
  /** Bandes arc-en-ciel horizontales barrées d'un swoosh. */
  | 'rainbow-bands'
  /** Énorme « CAMERA », l'objectif posé sur le E. */
  | 'wordmark'
  /** Composition Bauhaus : demi-disques, arcs, rectangles. */
  | 'bauhaus'
  /** Formes tramées sur fond sombre, grand disque cyan. */
  | 'cosmic-dots'

export type Colorway = {
  slug: ColorwaySlug
  /** Nom commercial affiché au client. */
  name: string
  /** Couleur du boîtier — pilote le rendu 3D et les pastilles. */
  hex: string
  /** Teinte plus sombre pour les ombres et le contour de la coque en 3D. */
  shadeHex: string
  /** Couleur du texte à poser sur `hex` (contraste). */
  onHex: string
  /** Sérigraphie de la façade, voir `PrintStyle`. */
  print: PrintStyle
  /** Photo fabricant du coloris, dans `public/produits/`. */
  photo: string
  /** Coque translucide : le rendu 3D bascule en matériau transmissif. */
  translucent?: boolean
  /** Coloris mis en avant par défaut. */
  featured?: boolean
}

export const colorways: Colorway[] = [
  { slug: 'rouge-flash', name: 'Rouge Flash', hex: '#e8302a', shadeHex: '#b31f1a', onHex: '#ffffff', print: 'wordmark', featured: true , photo: '/produits/rouge-flash.jpg' },
  { slug: 'jaune-pop', name: 'Jaune Pop', hex: '#f2c230', shadeHex: '#c2971a', onHex: '#14121a', print: 'rainbow-bands' , photo: '/produits/jaune-pop.jpg' },
  { slug: 'bleu-cobalt', name: 'Bleu Cobalt', hex: '#2b50a8', shadeHex: '#1b3577', onHex: '#ffffff', print: 'geo-band' , photo: '/produits/bleu-cobalt.jpg' },
  { slug: 'vert-menthe', name: 'Vert Lagon', hex: '#3aa79d', shadeHex: '#247a72', onHex: '#ffffff', print: 'lineart-faces' , photo: '/produits/vert-menthe.jpg' },
  { slug: 'vert-citron', name: 'Vert Pomme', hex: '#86c443', shadeHex: '#5f9129', onHex: '#14121a', print: 'memphis-80s' , photo: '/produits/vert-citron.jpg' },
  { slug: 'noir-mat', name: 'Noir Mat', hex: '#1a1a1c', shadeHex: '#000000', onHex: '#ffffff', print: 'cosmic-dots' , photo: '/produits/noir-mat.jpg' },
  { slug: 'blanc-craie', name: 'Blanc Craie', hex: '#efeae0', shadeHex: '#c8c2b6', onHex: '#14121a', print: 'bauhaus' , photo: '/produits/blanc-craie.jpg' },
  { slug: 'gris-galet', name: 'Gris Galet', hex: '#a9adb2', shadeHex: '#7c8085', onHex: '#14121a', print: 'synthwave' , photo: '/produits/gris-galet.jpg' },
  { slug: 'transparent', name: 'Transparent', hex: '#e6f2fa', shadeHex: '#aecbdd', onHex: '#14121a', print: 'memphis-clear', translucent: true , photo: '/produits/transparent.jpg' },
]

export const defaultColorway = colorways.find((c) => c.featured) ?? colorways[0]

export function getColorway(slug: string): Colorway | undefined {
  return colorways.find((c) => c.slug === slug)
}

/* -------------------------------------------------------------------------- */
/*  Caractéristiques techniques                                                */
/* -------------------------------------------------------------------------- */

export type Spec = { label: string; value: string; note?: string }

export const specs: Spec[] = [
  { label: 'Vidéo', value: '1080p', note: 'Enregistrement continu, limité par la capacité de la carte' },
  { label: 'Photo', value: 'Jusqu’à 5 MP' },
  { label: 'Objectif', value: 'Grand-angle 130°', note: 'Tout le groupe tient dans le cadre, même à bout de bras' },
  { label: 'Mise au point', value: 'Autofocus', note: 'Rien à régler : vous cadrez, il fait le point' },
  { label: 'Écran', value: 'TFT LCD 0,96 pouce', note: 'Environ 2,4 cm : cadrage et relecture, rien d’autre' },
  { label: 'Éclairage', value: 'LED d’appoint intégrée', note: 'Dépanne en intérieur sombre, sans remplacer un vrai flash' },
  { label: 'Filtres', value: 'Rendu argentique intégré', note: 'Appliqués à la prise de vue, sans retouche' },
  { label: 'Mémoire', value: '1 Go intégré', note: 'Extensible par carte microSD jusqu’à 32 Go' },
  { label: 'Autonomie', value: '≈ 45 min de vidéo', note: 'Ou plusieurs centaines de photos sur une charge' },
  { label: 'Charge et transfert', value: 'USB-C haute vitesse', note: 'Recharge complète en 1 h à 1 h 30' },
  { label: 'Boîtier', value: 'ABS renforcé', note: 'Le même plastique que les boîtiers de manettes de jeu' },
  { label: 'Poids', value: '26 g', note: 'Moins lourd qu’une clé de voiture' },
  { label: 'Dimensions', value: '62,8 × 58 × 25,9 mm', note: 'Données fabricant. Il tient entièrement dans la paume' },
  { label: 'Fixation', value: 'Œillet moulé + anneau porte-clés métal' },
]

/**
 * ⚠️ À CONFIRMER AVANT MISE EN LIGNE.
 *
 * Ces caractéristiques croisent la fiche Alibaba du fournisseur et les
 * descriptifs publics du même modèle (G6 Mini Thumb Camera) chez les
 * revendeurs. Demandez au fournisseur une fiche technique écrite et un
 * échantillon avant publication : annoncer une caractéristique absente
 * du produit livré est une pratique commerciale trompeuse.
 */
export const SPECS_NEED_SUPPLIER_CONFIRMATION = true


/* -------------------------------------------------------------------------- */
/*  Offres                                                                     */
/* -------------------------------------------------------------------------- */

/** Palier de prix dégressif, appliqué au-delà d'un certain nombre d'unités. */
export type PriceTier = { minQuantity: number; unitPriceCents: number }

export type Bundle = {
  id: 'solo' | 'duo' | 'squad' | 'gros'
  name: string
  /** Nombre d'appareils inclus. */
  quantity: number
  priceCents: number
  /** Prix barré = quantity × prix unitaire du pack Solo. */
  compareAtCents: number
  badge?: string
  pitch: string
  perks: string[]
  /** Mise en avant visuelle dans la grille d'offres. */
  highlight?: boolean
  /**
   * Pack à quantité libre : le client choisit combien d'appareils il veut,
   * et le prix unitaire suit les paliers ci-dessous. `quantity` vaut alors 1
   * (une ligne de panier = un appareil).
   */
  bulk?: {
    minQuantity: number
    maxQuantity: number
    tiers: PriceTier[]
  }
}

export const bundles: Bundle[] = [
  {
    id: 'solo',
    name: 'Le Solo',
    quantity: 1,
    priceCents: 1899,
    compareAtCents: 1899,
    pitch: 'Un appareil, une couleur, vos clés. Le point de départ.',
    perks: ['1 appareil photo porte-clés', 'Câble USB-C de charge', 'Anneau porte-clés métal'],
  },
  {
    id: 'duo',
    name: 'Le Duo',
    quantity: 2,
    priceCents: 3199,
    compareAtCents: 3798,
    badge: 'Le plus choisi',
    pitch: 'Un pour vous, un pour la personne avec qui vous faites les meilleurs souvenirs.',
    perks: [
      '2 appareils, 2 couleurs au choix',
      '2 câbles USB-C',
      'Livraison offerte',
      'Vous économisez 5,99 €',
    ],
    highlight: true,
  },
  {
    id: 'squad',
    name: 'La Bande',
    quantity: 4,
    priceCents: 5999,
    compareAtCents: 7596,
    badge: 'Meilleure valeur',
    pitch: 'Le pack qui transforme un week-end entre amis en film collectif.',
    perks: [
      '4 appareils, 4 couleurs au choix',
      '4 câbles USB-C',
      'Livraison offerte',
      'Vous économisez 15,97 €',
    ],
  },
  {
    id: 'gros',
    name: 'En nombre',
    quantity: 1,
    priceCents: 1499,
    compareAtCents: 1899,
    badge: 'À partir de 5',
    pitch: 'Un mariage, une classe, une équipe, une boutique. Vous choisissez la quantité.',
    perks: [
      'De 5 à 100 appareils',
      'Prix unitaire dégressif',
      'Livraison offerte',
      'Devis sur mesure au-delà de 100',
    ],
    bulk: {
      minQuantity: 5,
      maxQuantity: 100,
      // Le palier le plus haut reste sous les 15,00 € l'unité de La Bande,
      // sinon commander en nombre coûterait plus cher que le pack de 4.
      tiers: [
        { minQuantity: 5, unitPriceCents: 1499 },
        { minQuantity: 10, unitPriceCents: 1399 },
        { minQuantity: 20, unitPriceCents: 1299 },
        { minQuantity: 50, unitPriceCents: 1199 },
      ],
    },
  },
]

/**
 * Prix d'UNE unité de commande, c'est-à-dire le montant facturé pour chaque
 * incrément de quantité.
 *
 * Pour un pack à quantité fixe, l'unité de commande est le pack entier : le
 * Duo vaut 31,99 € quel que soit le nombre de Duos commandés. Pour le pack
 * en nombre, l'unité de commande est un appareil, et son prix suit les
 * paliers dégressifs.
 *
 * C'est ce montant que Stripe reçoit en `unit_amount`. Ce n'est PAS le prix
 * par appareil : pour l'afficher, voir `perDevicePriceCents`.
 */
export function bundleLinePriceCents(bundle: Bundle, quantity: number): number {
  if (!bundle.bulk) return bundle.priceCents

  const tier = bundle.bulk.tiers.reduce<PriceTier | null>(
    (best, t) => (quantity >= t.minQuantity ? t : best),
    null,
  )
  return tier?.unitPriceCents ?? bundle.priceCents
}

/**
 * Prix ramené à un appareil, celui qu'on affiche derrière « l'unité ».
 *
 * Le Duo à 31,99 € pour deux appareils fait 16,00 € l'unité. Confondre les
 * deux revenait à annoncer le prix du pack comme prix unitaire, ce qui
 * faisait passer les packs pour plus chers que l'achat à l'unité.
 */
export function perDevicePriceCents(bundle: Bundle, quantity: number): number {
  const devices = bundle.quantity * quantity
  if (devices <= 0) return bundle.priceCents
  return Math.round((bundleLinePriceCents(bundle, quantity) * quantity) / devices)
}

/** Bornes de quantité acceptées pour un pack. */
export function bundleQuantityRange(bundle: Bundle): { min: number; max: number } {
  return bundle.bulk
    ? { min: bundle.bulk.minQuantity, max: bundle.bulk.maxQuantity }
    : { min: 1, max: 20 }
}

export function getBundle(id: string): Bundle | undefined {
  return bundles.find((b) => b.id === id)
}

export const product = {
  slug: 'appareil-photo-porte-cles',
  name: 'Moments Caméra',
  subtitle: 'Appareil photo porte-clés 1080p',
  /** Référence fabricant, utile pour les échanges fournisseur. */
  supplierRef: 'G6 Mini Thumb Camera',
  sku: 'MC-KEYCAM-1080',
  gtin: null as string | null,
  brand: 'Moments Caméra',
  /**
   * Prix d'entrée affiché. C'est le prix pour repartir avec UN appareil,
   * donc le moins cher des packs à quantité fixe : le tarif unitaire du
   * pack en nombre suppose d'en commander cinq, l'annoncer ici serait
   * trompeur.
   */
  fromPriceCents: Math.min(...bundles.filter((b) => !b.bulk).map((b) => b.priceCents)),
  colorways,
  specs,
  bundles,
} as const
