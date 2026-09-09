import Stripe from 'stripe'

/**
 * Client Stripe côté serveur.
 *
 * La boutique fonctionne sans clés : dans ce cas `getStripe()` renvoie
 * `null` et le tunnel bascule en mode démonstration (voir docs/PAYMENTS.md).
 * On peut donc développer, faire relire la maquette et tester tout le
 * parcours avant même d'avoir ouvert un compte Stripe.
 */

let cached: Stripe | null = null

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) return null
  if (!cached) {
    cached = new Stripe(key, {
      // Épingler la version d'API évite qu'une évolution côté Stripe
      // ne casse la boutique sans qu'on ait rien déployé.
      apiVersion: '2026-08-26.dahlia',
      typescript: true,
      appInfo: { name: 'Moments Camera', version: '0.1.0' },
    })
  }
  return cached
}

export function isPaymentsConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY)
}
