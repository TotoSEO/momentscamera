/**
 * Calculateur de marge — `npm run margin`.
 *
 * Croise les paliers de prix fournisseur avec les prix de vente affichés
 * pour montrer, pour chaque volume d'achat, ce qui reste réellement une
 * fois le fret, la douane, l'emballage, le port sortant et les frais
 * Stripe déduits.
 *
 * Les hypothèses de fret et de change sont en tête de fichier : ajustez-les
 * avec vos vrais devis avant de vous fier au résultat.
 */

import { bundles } from '../src/content/product.ts'
import { computeLandedCost, computeMargin, supplier, unitPriceUsd } from '../src/lib/supplier/sourcing.ts'

// --- Hypothèses à ajuster ---------------------------------------------------
const USD_TO_EUR = 0.92
/** Fret estimé pour le lot entier, en euros. Aérien groupage, porte à porte. */
const FREIGHT_BY_QUANTITY: Record<number, number> = {
  100: 150,
  500: 420,
  1000: 700,
  5000: 2600,
}
const SCENARIOS = [100, 500, 1000, 5000]

const euro = (v: number) => `${v.toFixed(2).replace('.', ',')} €`
const pct = (v: number) => `${(v * 100).toFixed(1)} %`

console.log(`\n  APPROVISIONNEMENT — ${supplier.name} (${supplier.platform})`)
console.log(`  Référence : ${supplier.productRef}`)
console.log(`  Tarifs relevés le ${supplier.quotedOn} · 1 USD = ${USD_TO_EUR} EUR\n`)

for (const quantity of SCENARIOS) {
  const freightEur = FREIGHT_BY_QUANTITY[quantity] ?? 0
  const landed = computeLandedCost({ quantity, usdToEur: USD_TO_EUR, freightEur })

  console.log(`  ── ${quantity} unités ${'─'.repeat(52 - String(quantity).length)}`)
  console.log(`     Prix unitaire fournisseur : ${unitPriceUsd(quantity).toFixed(2)} USD`)
  console.log(`     Marchandise ............... ${euro(landed.goodsEur)}`)
  console.log(`     Fret ...................... ${euro(landed.freightEur)}`)
  console.log(`     Emballage ................. ${euro(landed.packagingEur)}`)
  console.log(`     TVA import (récupérable) .. ${euro(landed.importVatEur)}`)
  console.log(`     Coût de revient rendu ..... ${euro(landed.totalEur)}`)
  console.log(`     Soit par appareil ......... ${euro(landed.perUnitEur)}\n`)

  for (const bundle of bundles) {
    const margin = computeMargin({
      sellingPriceCents: bundle.priceCents,
      unitsInPack: bundle.quantity,
      landedCostPerUnitEur: landed.perUnitEur,
      // Le port est offert au-delà du seuil : on l'assume sur les packs.
      outboundShippingEur: bundle.priceCents >= 4000 ? 2.9 : 0,
    })

    const health = margin.grossMarginRate > 0.6 ? '✅' : margin.grossMarginRate > 0.4 ? '🟡' : '🔴'

    console.log(
      `     ${health} ${bundle.name.padEnd(10)} ${euro(margin.revenueTtcEur).padStart(9)} TTC` +
        ` → marge ${euro(margin.grossMarginEur).padStart(8)}` +
        ` (${pct(margin.grossMarginRate).padStart(6)}, ×${margin.markupMultiple})`,
    )
  }
  console.log()
}

console.log('  Lecture : marge brute = CA HT − achat rendu − port sortant − frais Stripe.')
console.log('  Elle doit encore absorber la publicité, les retours et vos charges fixes.')
console.log('  Repère du e-commerce grand public : viser au moins 65 % de marge brute.\n')
