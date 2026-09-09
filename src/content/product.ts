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
  /** Coque translucide : le rendu 3D bascule en matériau transmissif. */
  translucent?: boolean
  /** Coloris mis en avant par défaut. */
  featured?: boolean
}

export const colorways: Colorway[] = [
  { slug: 'rouge-flash', name: 'Rouge Flash', hex: '#ff4438', shadeHex: '#c02a20', onHex: '#ffffff', featured: true },
  { slug: 'jaune-pop', name: 'Jaune Pop', hex: '#ffd426', shadeHex: '#d3a600', onHex: '#14121a' },
  { slug: 'bleu-cobalt', name: 'Bleu Cobalt', hex: '#2f6bff', shadeHex: '#1a44b4', onHex: '#ffffff' },
  { slug: 'vert-menthe', name: 'Vert Menthe', hex: '#21d07a', shadeHex: '#129153', onHex: '#14121a' },
  { slug: 'vert-citron', name: 'Vert Citron', hex: '#c8f135', shadeHex: '#96b91d', onHex: '#14121a' },
  { slug: 'noir-mat', name: 'Noir Mat', hex: '#1c1a22', shadeHex: '#000000', onHex: '#ffffff' },
  { slug: 'blanc-craie', name: 'Blanc Craie', hex: '#f7f4ee', shadeHex: '#cfc9bd', onHex: '#14121a' },
  { slug: 'gris-galet', name: 'Gris Galet', hex: '#9a9aa8', shadeHex: '#6c6c7a', onHex: '#14121a' },
  { slug: 'transparent', name: 'Transparent', hex: '#dff1ff', shadeHex: '#a8cfe6', onHex: '#14121a', translucent: true },
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
  { label: 'Dimensions', value: '62,8 × 58 × 25,9 mm', note: 'Données fabricant — il tient entièrement dans la paume' },
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

export type Bundle = {
  id: 'solo' | 'duo' | 'squad'
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
}

export const bundles: Bundle[] = [
  {
    id: 'solo',
    name: 'Le Solo',
    quantity: 1,
    priceCents: 2990,
    compareAtCents: 2990,
    pitch: 'Un appareil, une couleur, vos clés. Le point de départ.',
    perks: ['1 appareil photo porte-clés', 'Câble USB de charge', 'Anneau porte-clés métal'],
  },
  {
    id: 'duo',
    name: 'Le Duo',
    quantity: 2,
    priceCents: 4990,
    compareAtCents: 5980,
    badge: 'Le plus choisi',
    pitch: 'Un pour vous, un pour la personne avec qui vous faites les meilleurs souvenirs.',
    perks: [
      '2 appareils, 2 couleurs au choix',
      '2 câbles USB',
      'Livraison offerte',
      'Vous économisez 9,90 €',
    ],
    highlight: true,
  },
  {
    id: 'squad',
    name: 'La Bande',
    quantity: 3,
    priceCents: 6490,
    compareAtCents: 8970,
    badge: 'Meilleure valeur',
    pitch: 'Le pack qui transforme un week-end entre amis en film collectif.',
    perks: [
      '3 appareils, 3 couleurs au choix',
      '3 câbles USB',
      'Livraison offerte',
      'Vous économisez 24,80 €',
    ],
  },
]

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
  fromPriceCents: bundles[0].priceCents,
  colorways,
  specs,
  bundles,
} as const
