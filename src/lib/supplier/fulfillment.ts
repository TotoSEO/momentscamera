/**
 * Couche d'expédition.
 *
 * Objectif : que le passage « je prépare les colis à la main » →
 * « mon fournisseur reçoit les commandes automatiquement » ne demande
 * qu'un changement de variable d'environnement, jamais une refonte.
 *
 * Trois implémentations sont prévues :
 *   - `manual`   : la commande est journalisée, vous expédiez vous-même. Défaut.
 *   - `webhook`  : la commande est postée sur une URL (Make, n8n, Zapier,
 *                  3PL, agent de sourcing…). C'est le pont le plus rapide
 *                  vers un fournisseur qui n'a pas d'API publique.
 *   - `alibaba`  : squelette prêt pour l'API Alibaba/AliExpress Dropshipping
 *                  une fois vos identifiants obtenus.
 *
 * Voir docs/ALIBABA-SOURCING.md pour la démarche complète.
 */

import { getBundle, getColorway } from '@/content/product'
import { supplier } from '@/lib/supplier/sourcing'

export type FulfillmentItem = {
  bundleId: string
  bundleName: string
  quantity: number
  /** Un coloris par appareil du pack, dupliqué autant de fois que la quantité. */
  units: Array<{ colorSlug: string; colorName: string }>
}

export type FulfillmentAddress = {
  name?: string | null
  line1?: string | null
  line2?: string | null
  postalCode?: string | null
  city?: string | null
  country?: string | null
  phone?: string | null
}

export type FulfillmentOrder = {
  /** Identifiant Stripe de la session : sert aussi de clé d'idempotence. */
  reference: string
  email: string | null
  amountTotalCents: number
  currency: string
  placedAt: string
  address: FulfillmentAddress
  items: FulfillmentItem[]
  supplierRef: string
}

export type FulfillmentResult =
  | { status: 'queued'; provider: string; detail?: string }
  | { status: 'sent'; provider: string; remoteId?: string }
  | { status: 'failed'; provider: string; error: string }

export interface FulfillmentProvider {
  readonly name: string
  submit(order: FulfillmentOrder): Promise<FulfillmentResult>
}

/* -------------------------------------------------------------------------- */
/*  1. Manuel — comportement par défaut                                        */
/* -------------------------------------------------------------------------- */

class ManualProvider implements FulfillmentProvider {
  readonly name = 'manual'

  async submit(order: FulfillmentOrder): Promise<FulfillmentResult> {
    // Journalisé en une ligne JSON : facile à récupérer dans les logs
    // de l'hébergeur, puis à coller dans un tableur d'expédition.
    console.info('[fulfillment:manual]', JSON.stringify(order))
    return { status: 'queued', provider: this.name, detail: 'À expédier manuellement.' }
  }
}

/* -------------------------------------------------------------------------- */
/*  2. Webhook — pont générique vers un 3PL ou un agent de sourcing            */
/* -------------------------------------------------------------------------- */

class WebhookProvider implements FulfillmentProvider {
  readonly name = 'webhook'

  constructor(
    private readonly url: string,
    private readonly secret?: string,
  ) {}

  async submit(order: FulfillmentOrder): Promise<FulfillmentResult> {
    try {
      const response = await fetch(this.url, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          ...(this.secret ? { 'x-fulfillment-secret': this.secret } : {}),
        },
        body: JSON.stringify(order),
        // Sans limite, un partenaire lent bloquerait le webhook Stripe
        // jusqu'à son expiration.
        signal: AbortSignal.timeout(10_000),
      })

      if (!response.ok) {
        return { status: 'failed', provider: this.name, error: `HTTP ${response.status}` }
      }

      const remoteId = response.headers.get('x-order-id') ?? undefined
      return { status: 'sent', provider: this.name, remoteId }
    } catch (error) {
      return {
        status: 'failed',
        provider: this.name,
        error: error instanceof Error ? error.message : 'Erreur réseau inconnue',
      }
    }
  }
}

/* -------------------------------------------------------------------------- */
/*  3. Alibaba — squelette                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Intégration Alibaba / AliExpress Dropshipping.
 *
 * L'accès n'est pas ouvert librement : il faut un compte développeur sur
 * open.alibaba.com, une application validée, et une relation commerciale
 * établie avec le fournisseur. La procédure est décrite pas à pas dans
 * docs/ALIBABA-SOURCING.md § « Automatiser l'expédition ».
 *
 * Tant que les identifiants sont absents, ce provider retombe volontairement
 * en mode manuel : une commande n'est JAMAIS perdue silencieusement.
 */
class AlibabaProvider implements FulfillmentProvider {
  readonly name = 'alibaba'

  constructor(
    private readonly appKey: string,
    private readonly appSecret: string,
    private readonly fallback: FulfillmentProvider,
  ) {}

  async submit(order: FulfillmentOrder): Promise<FulfillmentResult> {
    if (!this.appKey || !this.appSecret) {
      return this.fallback.submit(order)
    }

    // À implémenter une fois l'application validée :
    //   1. signer la requête (HMAC-SHA256 des paramètres triés + appSecret) ;
    //   2. appeler `alibaba.trade.fastCreateOrder` avec les lignes et l'adresse ;
    //   3. stocker l'identifiant de commande renvoyé pour le suivi ;
    //   4. relire le statut via `alibaba.trade.getLogisticsTrackingInfo`.
    //
    // La signature dépend de la version d'API attribuée à votre compte :
    // ne la codez qu'avec la documentation qui vous sera fournie.
    console.warn('[fulfillment:alibaba] identifiants présents mais intégration non implémentée')
    return this.fallback.submit(order)
  }
}

/* -------------------------------------------------------------------------- */
/*  Sélection du provider                                                      */
/* -------------------------------------------------------------------------- */

let cached: FulfillmentProvider | null = null

export function getFulfillmentProvider(): FulfillmentProvider {
  if (cached) return cached

  const manual = new ManualProvider()
  const mode = process.env.FULFILLMENT_PROVIDER ?? 'manual'

  if (mode === 'webhook') {
    const url = process.env.FULFILLMENT_WEBHOOK_URL
    cached = url ? new WebhookProvider(url, process.env.FULFILLMENT_WEBHOOK_SECRET) : manual
  } else if (mode === 'alibaba') {
    cached = new AlibabaProvider(
      process.env.ALIBABA_APP_KEY ?? '',
      process.env.ALIBABA_APP_SECRET ?? '',
      manual,
    )
  } else {
    cached = manual
  }

  return cached
}

/* -------------------------------------------------------------------------- */
/*  Conversion d'une session Stripe en bon de commande fournisseur             */
/* -------------------------------------------------------------------------- */

/**
 * Reconstitue les lignes d'expédition depuis les métadonnées posées à la
 * création de la session. On ne se fie jamais au libellé affiché : seules
 * les métadonnées `bundle_id` et `colors` font foi.
 */
export function buildFulfillmentItems(
  lines: Array<{ bundleId: string; colorSlugs: string[]; quantity: number }>,
): FulfillmentItem[] {
  return lines.flatMap((line) => {
    const bundle = getBundle(line.bundleId)
    if (!bundle) return []

    const units = line.colorSlugs.map((slug) => ({
      colorSlug: slug,
      colorName: getColorway(slug)?.name ?? slug,
    }))

    return [{ bundleId: bundle.id, bundleName: bundle.name, quantity: line.quantity, units }]
  })
}

export function defaultSupplierRef(): string {
  return `${supplier.name} · ${supplier.productRef}`
}
