# Paiements

## Comment c’est branché

```
Panier (client)  ──POST /api/checkout──▶  Recalcul serveur des prix
                                          │
                                          ▼
                                  Stripe Checkout Session
                                          │
                            client redirigé vers Stripe
                                          │
                        paiement ─────────┴───────── abandon
                              │                        │
                              ▼                        ▼
                    /api/stripe/webhook            /panier?annule=1
                              │
                    checkout.session.completed
                              │
                              ▼
                    FulfillmentProvider.submit()
```

**Le client n’envoie jamais de prix.** Il envoie un identifiant de pack,
une liste de coloris et une quantité ; `src/app/api/checkout/route.ts`
recalcule le montant depuis `src/content/product.ts`. Un panier trafiqué
depuis la console du navigateur ne peut donc pas changer le montant
débité.

## Mode démonstration

Sans `STRIPE_SECRET_KEY`, la boutique reste entièrement fonctionnelle :
`/api/checkout` renvoie une redirection vers `/merci?demo=1`, qui affiche
clairement qu’aucun paiement n’a eu lieu. Utile pour faire relire la
maquette avant d’ouvrir un compte marchand.

## Mise en service

### 1. Clés de test

Tableau de bord Stripe → Développeurs → Clés d’API. Copiez dans
`.env.local` :

```bash
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

### 2. Webhook local

```bash
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

La commande affiche un secret `whsec_…` : collez-le dans
`STRIPE_WEBHOOK_SECRET`. Testez avec la carte `4242 4242 4242 4242`,
n’importe quelle date future et n’importe quel CVC.

### 3. Webhook en production

Tableau de bord → Développeurs → Webhooks → Ajouter un point de
terminaison : `https://votredomaine.fr/api/stripe/webhook`.

Événements à écouter :

- `checkout.session.completed` — **indispensable**, c’est lui qui déclenche
  l’expédition ;
- `checkout.session.async_payment_failed` ;
- `payment_intent.payment_failed` ;
- `charge.refunded`.

### 4. Passage en production

Remplacez les clés `sk_test_` / `pk_test_` par `sk_live_` / `pk_live_`, et
utilisez le secret du webhook **de production** (il diffère de celui du
mode test).

## Trois règles à ne pas casser

1. **Vérifier la signature.** N’importe qui peut poster sur l’URL du
   webhook. `stripe.webhooks.constructEvent()` s’en charge — ne le
   contournez jamais « pour déboguer ».
2. **Être idempotent.** Stripe rejoue les événements. Le garde actuel est
   un `Set` en mémoire : il protège **un processus**, pas un déploiement
   multi-instances. En production sérieuse, remplacez-le par une table
   `processed_events(id primary key)`. C’est la seule modification requise
   pour être correct à l’échelle — le point est signalé en commentaire
   dans le fichier.
3. **Ne jamais se fier à l’URL de retour.** Un client peut ouvrir
   `/merci` à la main. Seul le webhook fait foi pour considérer une
   commande comme payée.

## TVA

`STRIPE_AUTOMATIC_TAX="false"` par défaut. Pour activer Stripe Tax :

1. Activez-le dans le tableau de bord et renseignez vos immatriculations.
2. Passez la variable à `"true"`.

Points d’attention pour une boutique française :

- **Franchise en base** (auto-entrepreneur sous les seuils) : vous ne
  facturez pas la TVA, mais vous ne la récupérez pas non plus à
  l’import — 20 % de coût sec sur la marchandise. Le paramètre
  `vatRecoverable` de `computeLandedCost()` modélise ce cas.
- **Ventes intra-UE** : au-delà de 10 000 € par an de ventes à distance
  vers d’autres États membres, la TVA du pays de destination s’applique.
  Le guichet **OSS** permet de tout déclarer en France.
- **IOSS** : pertinent si vous expédiez directement depuis la Chine des
  colis de moins de 150 € — quasi indispensable dans ce cas pour éviter
  que le client paie des frais de dédouanement à la livraison.

## Alternatives à Stripe

| Solution | Tarif indicatif France | Remarque |
| --- | --- | --- |
| **Stripe** | ~1,5 % + 0,25 € (carte EU) | Retenu ici : API la plus claire, Apple/Google Pay inclus |
| PayPlug | ~1,5 % + 0,25 € + abonnement | Acteur français, bon taux d’acceptation local |
| Mollie | ~1,8 % + 0,25 € | Sans abonnement, très simple |
| Shopify Payments | inclus dans l’abonnement | Seulement si vous migrez sur Shopify |

Vérifiez toujours les tarifs en vigueur : ils changent souvent.

## Sources

- [Stripe + Next.js 15, guide complet](https://www.pedroalonso.net/blog/stripe-nextjs-complete-guide-2025/)
- [Stripe Payments in Next.js 15 App Router, 2026](https://stacknotice.com/blog/stripe-nextjs-15-payments-tutorial-2026)
- [Stripe — IOSS et TVA OSS en France](https://stripe.com/resources/more/import-one-stop-shop-and-vat-oss-france)
- [Passerelles de paiement Shopify : Stripe, PayPlug, Adyen](https://www.artich.io/le-shopify-labs/stripe-payplug-adyen-shopify)
