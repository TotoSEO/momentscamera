# Vendre un produit Alibaba : le mode d’emploi

Ce document résume la chaîne complète, de la fiche fournisseur à la
commande client livrée. Il est spécifique au produit vendu ici — le
**G6 Mini Thumb Camera** de *Muchen Industrial Limited* (Hong Kong) —
mais la méthode vaut pour n’importe quel produit Alibaba.

---

## 1. Ce que l’on sait du fournisseur

| Élément | Valeur |
| --- | --- |
| Fournisseur | Muchen Industrial Limited (Hong Kong) |
| Référence | G6 Mini Thumb Camera |
| Note boutique | 4,7 / 5 (67 avis) |
| Temps de réponse | ≤ 4 h |
| Expédition à l’heure | ≥ 99 % |
| Délai petite série | 7 jours (1 à 10 unités) |
| Trade Assurance | Oui — **à exiger** |

**Paliers de prix** (unitaire, hors transport) :

| Quantité | Prix unitaire |
| --- | --- |
| 10 – 999 | 3,85 $ |
| 1 000 – 9 999 | 3,55 $ |
| 10 000 + | 3,15 $ |

**Remises sur montant total** : −5 % dès 2 000 $, −8 % dès 5 000 $, −10 % dès 10 000 $.

Ces chiffres vivent dans `src/lib/supplier/sourcing.ts`. Mettez-les à jour
après chaque négociation, puis relancez `npm run margin`.

---

## 2. Avant de commander : les cinq vérifications

1. **Trade Assurance active.** C’est la seule protection qui permette
   d’être remboursé si la marchandise ne correspond pas ou n’arrive pas.
   Elle n’est valable **que si le paiement passe par la plateforme
   Alibaba**. Un fournisseur qui propose un virement direct « pour éviter
   les frais » vous fait sortir de la protection : c’est le signal
   d’alerte numéro un.
2. **Statut du fournisseur.** Privilégier *Verified Supplier* ou
   *Gold Supplier*, vérifier l’ancienneté du compte et l’historique de
   transactions.
3. **Échantillon.** Toujours. Comptez 20 à 40 $ port compris. Vérifiez la
   qualité d’image réelle, l’autonomie réelle, la finition, et surtout la
   conformité des accessoires annoncés.
4. **Fiche technique écrite.** Demandez-la par message sur la plateforme
   (traçable). Elle doit confirmer : résolution, capteur, autonomie,
   capacité mémoire, dimensions, poids, contenu de la boîte. Ne publiez
   aucune caractéristique que vous ne pouvez pas prouver — voir
   `SPECS_NEED_SUPPLIER_CONFIRMATION` dans `src/content/product.ts`.
5. **Conformité réglementaire.** Pour vendre cet appareil dans l’Union
   européenne, il vous faut :
   - le **marquage CE** et la déclaration UE de conformité (directives
     RED 2014/53/UE et RoHS 2011/65/UE) ;
   - la conformité **REACH** ;
   - l’enregistrement **DEEE** (équipements électriques) et
     **batteries** auprès d’un éco-organisme, avec votre numéro
     d’identifiant unique ADEME affiché ;
   - une notice en français.

   C’est le point que la plupart des vendeurs oublient, et c’est celui qui
   coûte le plus cher en cas de contrôle. Demandez les certificats au
   fournisseur **avant** de payer.

---

## 3. Incoterms et transport

| Incoterm | Qui paie quoi | Quand l’utiliser |
| --- | --- | --- |
| **EXW** | Vous payez tout depuis l’usine | À éviter au début |
| **FOB** | Le fournisseur livre au port, vous payez le fret | Le standard pour un conteneur |
| **DDP** | Le fournisseur livre chez vous, droits inclus | **Recommandé pour vos premières commandes** |

Pour un premier lot de 100 à 500 pièces, demandez un prix **DDP France** :
le fournisseur gère le transport et le dédouanement, vous recevez une
facture unique. C’est plus cher au kilo, mais vous n’avez pas à ouvrir un
compte transitaire pour 300 € de marchandise.

**Coûts d’import à anticiper** (France) :

- **Droits de douane** : 0 % pour les appareils de prise de vue numériques
  (position SH 8525.89). À confirmer avec votre transitaire selon le
  classement retenu.
- **TVA à l’import** : 20 %, exigible à l’entrée. **Récupérable** si vous
  êtes assujetti à la TVA. En franchise en base (auto-entrepreneur sous
  les seuils), elle ne l’est **pas** — c’est un coût sec de 20 % qui
  change tout le calcul. Le paramètre `vatRecoverable` de
  `computeLandedCost()` modélise exactement ce cas.
- **Frais de dossier** du transitaire : 30 à 80 € par envoi.

---

## 4. Marges

Lancez `npm run margin` pour la table complète. Résumé aux hypothèses
actuelles (1 USD = 0,92 €, fret aérien groupé, TVA récupérable) :

| Volume | Coût rendu / appareil | Marge brute « Solo » à 29,90 € |
| --- | --- | --- |
| 100 | ≈ 5,64 € | ≈ 18,60 € (74 %) |
| 500 | ≈ 4,98 € | ≈ 19,20 € (77 %) |
| 1 000 | ≈ 4,40 € | ≈ 19,70 € (79 %) |

Cette marge brute doit encore absorber la publicité (souvent 30 à 50 % du
chiffre d’affaires en acquisition payante), les retours, le SAV et vos
charges fixes. **Un coefficient ×4 à ×5 sur le coût rendu est le minimum
viable** en e-commerce grand public — c’est le cas ici.

---

## 5. Modèles d’exploitation

### a. Achat de stock (recommandé)

Vous achetez 100 à 500 pièces, vous stockez, vous expédiez vous-même ou via
un prestataire logistique.

- ✅ Délai de livraison de 3 à 5 jours : c’est ce que le site promet.
- ✅ Vous contrôlez l’emballage, donc l’expérience de déballage.
- ✅ Vous pouvez traiter un retour immédiatement.
- ❌ Immobilise 600 à 3 000 € de trésorerie.

### b. Dropshipping depuis la Chine

Le fournisseur expédie directement à votre client.

- ✅ Zéro trésorerie immobilisée.
- ❌ 15 à 30 jours de délai : incompatible avec la promesse actuelle du
  site. Si vous choisissez cette voie, **modifiez les délais annoncés**
  dans `src/lib/site.ts`, la FAQ et les CGV. Annoncer 3-5 jours et livrer
  en 3 semaines est une pratique commerciale trompeuse.
- ❌ Colis sans marque, retours très coûteux.

### c. Modèle mixte

Dropshipping pour tester la demande sur 30 jours, puis achat de stock dès
que les ventes sont régulières. C’est le chemin le plus prudent.

---

## 6. Automatiser l’expédition

Le code est déjà prêt : `src/lib/supplier/fulfillment.ts` définit une
interface `FulfillmentProvider` et trois implémentations. Le webhook Stripe
appelle le provider actif après chaque paiement confirmé.

### Mode `manual` (par défaut)

```bash
FULFILLMENT_PROVIDER="manual"
```

Chaque commande payée est journalisée en une ligne JSON préfixée
`[fulfillment:manual]`. Récupérez-la dans les logs de votre hébergeur et
préparez le colis.

### Mode `webhook` (recommandé pour passer à l’échelle)

```bash
FULFILLMENT_PROVIDER="webhook"
FULFILLMENT_WEBHOOK_URL="https://hook.eu2.make.com/..."
FULFILLMENT_WEBHOOK_SECRET="une-chaine-aleatoire-longue"
```

La commande est postée en JSON sur votre scénario Make / n8n / Zapier, qui
peut ensuite créer une étiquette Colissimo, remplir un tableur, ou envoyer
un bon de commande à votre agent de sourcing. Le secret est transmis dans
l’en-tête `x-fulfillment-secret` : vérifiez-le côté réception.

C’est le pont le plus rapide vers un fournisseur qui n’a pas d’API.

### Mode `alibaba`

```bash
FULFILLMENT_PROVIDER="alibaba"
ALIBABA_APP_KEY="..."
ALIBABA_APP_SECRET="..."
```

L’API Alibaba n’est pas ouverte librement. La démarche :

1. Créer un compte développeur sur **open.alibaba.com**.
2. Déclarer une application et décrire votre cas d’usage.
3. Obtenir la validation (comptez plusieurs semaines) et la documentation
   de la version d’API attribuée à votre compte.
4. Implémenter la signature HMAC-SHA256 des paramètres triés, puis les
   appels `alibaba.trade.fastCreateOrder` et
   `alibaba.trade.getLogisticsTrackingInfo`.

Tant que les identifiants sont absents ou l’intégration incomplète, le
provider **retombe automatiquement en mode manuel** : aucune commande
n’est perdue silencieusement.

> En pratique, pour un catalogue mono-produit, le mode `webhook` couvre
> 95 % des besoins pour 1 % de l’effort. Ne vous lancez dans l’API Alibaba
> que si vous dépassez la centaine de commandes par jour.

---

## 7. Sources

- Alibaba — [Trade Assurance et vérification fournisseur](https://www.salehoo.com/learn/alibaba-dropshipping)
- Mercury — [How to set up Alibaba dropshipping](https://mercury.com/blog/how-to-set-up-alibaba-dropshipping)
- Forthsource — [How to order on Alibaba, guide 2026](https://forthsource.io/blog/how-to-buy-on-alibaba-step-by-step-guide-2026)
- DSers — [Alibaba dropshipping : suppliers and workflow](https://www.dsers.com/blog/alibaba-dropshipping/)
- Stripe — [IOSS et TVA OSS en France](https://stripe.com/resources/more/import-one-stop-shop-and-vat-oss-france)
