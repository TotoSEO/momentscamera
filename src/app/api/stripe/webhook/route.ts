import { NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { getStripe } from '@/lib/stripe'
import {
  buildFulfillmentItems,
  defaultSupplierRef,
  getFulfillmentProvider,
  type FulfillmentOrder,
} from '@/lib/supplier/fulfillment'

export const runtime = 'nodejs'
/** Le corps brut est indispensable au calcul de signature. */
export const dynamic = 'force-dynamic'

/**
 * Webhook Stripe.
 *
 * Trois règles non négociables :
 *  1. vérifier la signature — n'importe qui peut poster sur cette URL ;
 *  2. être idempotent — Stripe rejoue les événements en cas de doute ;
 *  3. répondre vite — un traitement long finit en timeout, donc en rejeu.
 *
 * ⚠️ Le garde d'idempotence ci-dessous est en mémoire : il protège un
 * processus, pas un déploiement multi-instances. En production, remplacez
 * `seenEvents` par une table `processed_events(id primary key)` — c'est la
 * seule modification requise pour être correct à l'échelle.
 */

const seenEvents = new Set<string>()
const MAX_TRACKED_EVENTS = 500

function alreadyHandled(eventId: string): boolean {
  if (seenEvents.has(eventId)) return true
  seenEvents.add(eventId)
  if (seenEvents.size > MAX_TRACKED_EVENTS) {
    // Purge grossière : on ne garde qu'une fenêtre récente.
    const iterator = seenEvents.values()
    for (let i = 0; i < MAX_TRACKED_EVENTS / 2; i++) {
      const next = iterator.next()
      if (next.done) break
      seenEvents.delete(next.value)
    }
  }
  return false
}

export async function POST(request: Request) {
  const stripe = getStripe()
  const secret = process.env.STRIPE_WEBHOOK_SECRET

  if (!stripe || !secret) {
    // 503 plutôt que 400 : Stripe réessaiera une fois la configuration en place.
    return NextResponse.json({ error: 'Webhook non configuré.' }, { status: 503 })
  }

  const signature = request.headers.get('stripe-signature')
  if (!signature) {
    return NextResponse.json({ error: 'Signature absente.' }, { status: 400 })
  }

  const rawBody = await request.text()

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, secret)
  } catch (error) {
    console.error('[webhook] signature invalide', error)
    return NextResponse.json({ error: 'Signature invalide.' }, { status: 400 })
  }

  if (alreadyHandled(event.id)) {
    return NextResponse.json({ received: true, duplicate: true })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        await handleCompletedCheckout(stripe, event.data.object)
        break
      }

      case 'checkout.session.async_payment_failed':
      case 'payment_intent.payment_failed': {
        console.warn('[webhook] paiement échoué', event.id, event.type)
        break
      }

      case 'charge.refunded': {
        console.info('[webhook] remboursement enregistré', event.id)
        break
      }

      default:
        // Un événement non géré n'est pas une erreur : on acquitte.
        break
    }
  } catch (error) {
    console.error('[webhook] traitement échoué', event.id, error)
    // 500 → Stripe rejoue. Le garde d'idempotence évite le doublon
    // uniquement si le traitement avait déjà abouti.
    return NextResponse.json({ error: 'Traitement échoué.' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}

/**
 * MANQUE AVANT LA PREMIÈRE VENTE : la confirmation de contrat sur support
 * durable. L'article L221-13 du Code de la consommation impose d'adresser au
 * client, au plus tard à la livraison, un récapitulatif reprenant les
 * informations précontractuelles et le formulaire type de rétractation.
 *
 * Le reçu de paiement envoyé par Stripe ne suffit pas : il ne contient ni les
 * caractéristiques du bien, ni le droit de rétractation, ni le formulaire.
 * Brancher ici un envoi transactionnel (Resend, Brevo, Postmark) reprenant le
 * contenu de /livraison-et-retours. Voir docs/LEGAL.md.
 */
async function handleCompletedCheckout(stripe: Stripe, session: Stripe.Checkout.Session) {
  // Un paiement différé (virement, prélèvement) arrive `unpaid` :
  // on n'expédie que ce qui est réellement encaissé.
  if (session.payment_status !== 'paid') {
    console.info('[webhook] session complétée mais non payée', session.id, session.payment_status)
    return
  }

  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
    limit: 100,
    expand: ['data.price.product'],
  })

  const lines = lineItems.data.flatMap((item) => {
    const product = item.price?.product
    if (!product || typeof product === 'string' || product.deleted) return []

    const bundleId = product.metadata?.bundle_id
    const colorSlugs = product.metadata?.colors?.split('|').filter(Boolean) ?? []
    if (!bundleId) return []

    return [{ bundleId, colorSlugs, quantity: item.quantity ?? 1 }]
  })

  const shipping = session.collected_information?.shipping_details

  const order: FulfillmentOrder = {
    reference: session.id,
    email: session.customer_details?.email ?? null,
    amountTotalCents: session.amount_total ?? 0,
    currency: (session.currency ?? 'eur').toUpperCase(),
    placedAt: new Date(session.created * 1000).toISOString(),
    address: {
      name: shipping?.name ?? session.customer_details?.name ?? null,
      line1: shipping?.address?.line1 ?? null,
      line2: shipping?.address?.line2 ?? null,
      postalCode: shipping?.address?.postal_code ?? null,
      city: shipping?.address?.city ?? null,
      country: shipping?.address?.country ?? null,
      phone: session.customer_details?.phone ?? null,
    },
    items: buildFulfillmentItems(lines),
    supplierRef: defaultSupplierRef(),
  }

  const result = await getFulfillmentProvider().submit(order)
  console.info('[webhook] commande transmise', session.id, result)

  if (result.status === 'failed') {
    // On laisse remonter : Stripe rejouera, et l'échec reste visible
    // dans le tableau de bord au lieu de disparaître dans les logs.
    throw new Error(`Transmission fournisseur échouée : ${result.error}`)
  }
}
