/**
 * Données d'approvisionnement et calcul de marge.
 *
 * Source : fiche fournisseur Alibaba consultée le 09/09/2026
 * (« Mini Keychain Camera Photo Video 1080P 1-5MP G6 Mini Thumb Camera »,
 * Muchen Industrial Limited, Hong Kong).
 *
 * ⚠️ Ces chiffres évoluent. Vérifiez-les auprès du fournisseur avant toute
 * commande ferme, et relancez `npm run margin` (voir scripts/margin.ts)
 * pour recontrôler la rentabilité après chaque changement de prix.
 */

export const supplier = {
  name: 'Muchen Industrial Limited',
  country: 'HK',
  platform: 'Alibaba.com',
  productRef: 'G6 Mini Thumb Camera',
  productUrl:
    'https://www.alibaba.com/product-detail/Mini-Keychain-Camera-Photo-Video-1080P_1601806083220.html',
  storeRating: 4.7,
  reviewCount: 67,
  responseTimeHours: 4,
  onTimeDeliveryRate: 0.99,
  leadTimeDaysSmallOrder: 7,
  /** Protection Alibaba : à exiger impérativement (voir docs/ALIBABA-SOURCING.md). */
  tradeAssurance: true,
  quotedOn: '2026-09-09',
} as const

/** Paliers de prix unitaires, en dollars américains, hors transport. */
export const priceTiersUsd = [
  { minQuantity: 10, maxQuantity: 999, unitUsd: 3.85 },
  { minQuantity: 1000, maxQuantity: 9999, unitUsd: 3.55 },
  { minQuantity: 10000, maxQuantity: null, unitUsd: 3.15 },
] as const

/** Remises sur montant total annoncées par le fournisseur. */
export const volumeDiscounts = [
  { minOrderUsd: 2000, discount: 0.05 },
  { minOrderUsd: 5000, discount: 0.08 },
  { minOrderUsd: 10000, discount: 0.1 },
] as const

export function unitPriceUsd(quantity: number): number {
  const tier =
    priceTiersUsd.find((t) => quantity >= t.minQuantity && (t.maxQuantity === null || quantity <= t.maxQuantity)) ??
    priceTiersUsd[0]
  return tier.unitUsd
}

export function volumeDiscountFor(orderUsd: number): number {
  return volumeDiscounts.reduce((best, d) => (orderUsd >= d.minOrderUsd ? d.discount : best), 0)
}

/* -------------------------------------------------------------------------- */
/*  Coût de revient rendu (landed cost)                                        */
/* -------------------------------------------------------------------------- */

export type LandedCostInput = {
  quantity: number
  /** Taux de change USD → EUR à la date de la commande. */
  usdToEur: number
  /** Fret total pour le lot, en euros (aérien express ou groupage maritime). */
  freightEur: number
  /** Droits de douane. 0 % pour les appareils photo numériques (SH 8525.89). */
  dutyRate?: number
  /** TVA à l'import : 20 % en France. Récupérable si vous êtes assujetti. */
  importVatRate?: number
  /** TVA récupérable ? Vrai dès que vous êtes assujetti (donc hors franchise en base). */
  vatRecoverable?: boolean
  /** Frais annexes par unité : emballage, étiquette, notice, contrôle qualité. */
  packagingEurPerUnit?: number
}

export type LandedCost = {
  quantity: number
  goodsEur: number
  freightEur: number
  dutyEur: number
  importVatEur: number
  packagingEur: number
  /** Coût total effectivement supporté (TVA import exclue si récupérable). */
  totalEur: number
  perUnitEur: number
}

export function computeLandedCost(input: LandedCostInput): LandedCost {
  const {
    quantity,
    usdToEur,
    freightEur,
    dutyRate = 0,
    importVatRate = 0.2,
    vatRecoverable = true,
    packagingEurPerUnit = 0.6,
  } = input

  const grossUsd = unitPriceUsd(quantity) * quantity
  const discountedUsd = grossUsd * (1 - volumeDiscountFor(grossUsd))
  const goodsEur = discountedUsd * usdToEur

  const dutyEur = (goodsEur + freightEur) * dutyRate
  const importVatEur = (goodsEur + freightEur + dutyEur) * importVatRate
  const packagingEur = packagingEurPerUnit * quantity

  const totalEur = goodsEur + freightEur + dutyEur + packagingEur + (vatRecoverable ? 0 : importVatEur)

  return {
    quantity,
    goodsEur: round(goodsEur),
    freightEur: round(freightEur),
    dutyEur: round(dutyEur),
    importVatEur: round(importVatEur),
    packagingEur: round(packagingEur),
    totalEur: round(totalEur),
    perUnitEur: round(totalEur / quantity),
  }
}

/* -------------------------------------------------------------------------- */
/*  Marge sur une vente                                                        */
/* -------------------------------------------------------------------------- */

export type MarginInput = {
  /** Prix de vente TTC affiché, en centimes. */
  sellingPriceCents: number
  /** Nombre d'appareils dans le pack vendu. */
  unitsInPack: number
  /** Coût de revient rendu, par appareil, en euros. */
  landedCostPerUnitEur: number
  /** TVA française applicable au produit. */
  vatRate?: number
  /** Frais de port réellement payés pour l'expédition au client, en euros. */
  outboundShippingEur?: number
  /** Stripe France : 1,5 % + 0,25 € sur carte européenne (à vérifier au contrat). */
  psPercent?: number
  psFixedEur?: number
}

export type MarginResult = {
  revenueTtcEur: number
  vatEur: number
  revenueHtEur: number
  cogsEur: number
  shippingEur: number
  paymentFeesEur: number
  grossMarginEur: number
  /** Marge brute rapportée au chiffre d'affaires hors taxes. */
  grossMarginRate: number
  /** Coefficient multiplicateur prix de vente HT / coût d'achat. */
  markupMultiple: number
}

export function computeMargin(input: MarginInput): MarginResult {
  const {
    sellingPriceCents,
    unitsInPack,
    landedCostPerUnitEur,
    vatRate = 0.2,
    outboundShippingEur = 2.9,
    psPercent = 0.015,
    psFixedEur = 0.25,
  } = input

  const revenueTtcEur = sellingPriceCents / 100
  const revenueHtEur = revenueTtcEur / (1 + vatRate)
  const vatEur = revenueTtcEur - revenueHtEur

  const cogsEur = landedCostPerUnitEur * unitsInPack
  // Les frais Stripe se calculent sur le montant TTC encaissé.
  const paymentFeesEur = revenueTtcEur * psPercent + psFixedEur

  const grossMarginEur = revenueHtEur - cogsEur - outboundShippingEur - paymentFeesEur

  return {
    revenueTtcEur: round(revenueTtcEur),
    vatEur: round(vatEur),
    revenueHtEur: round(revenueHtEur),
    cogsEur: round(cogsEur),
    shippingEur: round(outboundShippingEur),
    paymentFeesEur: round(paymentFeesEur),
    grossMarginEur: round(grossMarginEur),
    grossMarginRate: round(grossMarginEur / revenueHtEur, 4),
    markupMultiple: round(revenueHtEur / cogsEur, 2),
  }
}

function round(value: number, decimals = 2): number {
  const factor = 10 ** decimals
  return Math.round(value * factor) / factor
}
