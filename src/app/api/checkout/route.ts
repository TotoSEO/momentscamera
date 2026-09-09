import { NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { getStripe, isPaymentsConfigured } from '@/lib/stripe'
import { bundles, colorways, getBundle, getColorway } from '@/content/product'
import { site } from '@/lib/site'

export const runtime = 'nodejs'

/**
 * Création de la session de paiement.
 *
 * Règle absolue : le client n'envoie QUE des identifiants (pack, coloris,
 * quantité). Les prix sont recalculés ici à partir du catalogue. Un panier
 * trafiqué depuis la console du navigateur ne peut donc pas changer le
 * montant débité.
 */

type IncomingLine = { bundleId: unknown; colorSlugs: unknown; quantity: unknown }

const MAX_QUANTITY_PER_LINE = 20
const MAX_LINES = 10

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 })
}

export async function POST(request: Request) {
  let payload: { lines?: IncomingLine[] }

  try {
    payload = await request.json()
  } catch {
    return badRequest('Corps de requête illisible.')
  }

  const rawLines = payload.lines
  if (!Array.isArray(rawLines) || rawLines.length === 0) {
    return badRequest('Panier vide.')
  }
  if (rawLines.length > MAX_LINES) {
    return badRequest('Trop de lignes dans le panier.')
  }

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = []
  let subtotalCents = 0

  for (const raw of rawLines) {
    if (typeof raw.bundleId !== 'string') return badRequest('Pack invalide.')

    const bundle = getBundle(raw.bundleId)
    if (!bundle) return badRequest(`Pack inconnu : ${raw.bundleId}`)

    const quantity = Number(raw.quantity)
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY_PER_LINE) {
      return badRequest('Quantité invalide.')
    }

    if (!Array.isArray(raw.colorSlugs) || raw.colorSlugs.length !== bundle.quantity) {
      return badRequest('Sélection de couleurs incohérente avec le pack.')
    }

    const colorNames: string[] = []
    for (const slug of raw.colorSlugs) {
      if (typeof slug !== 'string') return badRequest('Coloris invalide.')
      const color = getColorway(slug)
      if (!color) return badRequest(`Coloris inconnu : ${slug}`)
      colorNames.push(color.name)
    }

    subtotalCents += bundle.priceCents * quantity

    lineItems.push({
      quantity,
      price_data: {
        currency: site.currency.toLowerCase(),
        unit_amount: bundle.priceCents,
        product_data: {
          name: `${site.name} — ${bundle.name}`,
          description: `${bundle.quantity} appareil${bundle.quantity > 1 ? 's' : ''} · ${colorNames.join(', ')}`,
          metadata: { bundle_id: bundle.id, colors: colorNames.join('|') },
        },
      },
    })
  }

  const shippingCents = subtotalCents >= site.freeShippingThresholdCents ? 0 : site.shippingFlatCents
  const origin = request.headers.get('origin') ?? site.url

  // ----- Mode démonstration : aucune clé Stripe configurée -----
  if (!isPaymentsConfigured()) {
    return NextResponse.json({
      demo: true,
      url: `${origin}/merci?demo=1`,
      message:
        'Stripe n’est pas configuré : parcours simulé. Renseignez STRIPE_SECRET_KEY pour encaisser réellement.',
      computed: { subtotalCents, shippingCents, totalCents: subtotalCents + shippingCents },
    })
  }

  const stripe = getStripe()
  if (!stripe) return NextResponse.json({ error: 'Paiement indisponible.' }, { status: 503 })

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      locale: 'fr',
      success_url: `${origin}/merci?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/panier?annule=1`,
      // Stripe collecte l'adresse : pas de formulaire à maintenir de notre côté.
      shipping_address_collection: {
        allowed_countries: ['FR', 'BE', 'LU', 'CH', 'DE', 'ES', 'IT', 'NL', 'PT'],
      },
      billing_address_collection: 'auto',
      phone_number_collection: { enabled: true },
      allow_promotion_codes: true,
      automatic_tax: { enabled: process.env.STRIPE_AUTOMATIC_TAX === 'true' },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: shippingCents, currency: site.currency.toLowerCase() },
            display_name:
              shippingCents === 0 ? 'Livraison offerte (3-5 jours)' : 'Livraison suivie (3-5 jours)',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 3 },
              maximum: { unit: 'business_day', value: 5 },
            },
          },
        },
      ],
      consent_collection: { terms_of_service: 'required' },
      custom_text: {
        terms_of_service_acceptance: {
          message: `J’accepte les [conditions générales de vente](${site.url}/cgv) et je reconnais disposer d’un droit de rétractation de ${site.returnWindowDays} jours.`,
        },
      },
      metadata: {
        source: 'momentscamera-web',
        line_count: String(lineItems.length),
      },
    })

    return NextResponse.json({ url: session.url, id: session.id })
  } catch (error) {
    // Le détail Stripe reste dans les logs serveur : inutile de l'exposer au client.
    console.error('[checkout] création de session échouée', error)
    return NextResponse.json(
      { error: 'Impossible de démarrer le paiement. Réessayez dans un instant.' },
      { status: 502 },
    )
  }
}

/** Petit utilitaire de diagnostic pour la mise en production. */
export async function GET() {
  return NextResponse.json({
    paymentsConfigured: isPaymentsConfigured(),
    bundles: bundles.map((b) => ({ id: b.id, priceCents: b.priceCents })),
    colorways: colorways.map((c) => c.slug),
  })
}
