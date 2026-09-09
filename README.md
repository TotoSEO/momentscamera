# Moments Caméra

Boutique en ligne mono-produit pour un **appareil photo porte-clés 1080p**
(G6 Mini Thumb Camera, sourcé sur Alibaba).

Fiche produit avec **visualiseur 3D interactif**, animations au scroll,
neuf coloris, panier persistant et tunnel de paiement Stripe.

```bash
npm install
npm run dev     # http://localhost:3000
```

La boutique fonctionne **sans aucune clé** : le tunnel de paiement bascule
alors en mode démonstration, ce qui permet de tester le parcours complet
avant d’ouvrir un compte marchand.

> **Hébergement — à lire avant de mettre en ligne.**
> La boutique a besoin d’un serveur pour encaisser : `/api/checkout` crée la
> session Stripe et `/api/stripe/webhook` reçoit les paiements. **GitHub Pages
> ne sert que des fichiers et ne peut donc pas les exécuter.** Le dépôt publie
> un aperçu statique sur Pages (le site s’affiche, la 3D tourne, le paiement
> est explicitement désactivé), mais pour vendre, déployez sur Vercel ou
> équivalent — trois clics, gratuit, aucun changement de code. Marche à
> suivre : [`docs/DEPLOIEMENT.md`](docs/DEPLOIEMENT.md).

---

## Ce qu’il y a dedans

| | |
| --- | --- |
| **Page d’accueil** | Hero 3D, bandeau défilant, bloc problème, fonctionnement, bénéfices, nuancier interactif, mur vidéo, cas d’usage, offres, avis, garanties, FAQ, appel final |
| **Fiche produit** | Visualiseur 3D collant, sélecteur de pack, un sélecteur de coloris par appareil, boîte d’achat, barre d’achat mobile, caractéristiques |
| **Panier** | Tiroir global + page dédiée, persistance `localStorage`, seuil de livraison offerte |
| **Paiement** | Stripe Checkout, prix recalculés côté serveur, webhook signé et idempotent |
| **Expédition** | Interface `FulfillmentProvider` : manuel, webhook, ou API Alibaba |
| **Légal** | CGV, mentions légales, confidentialité, livraison et retours — trames à compléter |
| **SEO** | Métadonnées, OpenGraph, `sitemap.xml`, `robots.txt`, JSON-LD Product et FAQPage |

## Documentation

| Fichier | Contenu |
| --- | --- |
| [`docs/STACK.md`](docs/STACK.md) | La stack et les arbitrages |
| [`docs/DESIGN-SYSTEM.md`](docs/DESIGN-SYSTEM.md) | Palette, typographie, mouvement |
| [`docs/COPYWRITING.md`](docs/COPYWRITING.md) | Cadres de persuasion et règles tenues |
| [`docs/PAYMENTS.md`](docs/PAYMENTS.md) | Stripe, webhooks, TVA, alternatives |
| [`docs/ALIBABA-SOURCING.md`](docs/ALIBABA-SOURCING.md) | Fournisseur, marges, import, automatisation |
| [`docs/MEDIAS.md`](docs/MEDIAS.md) | Intégrer vidéos, photos et modèle 3D |
| [`docs/DEPLOIEMENT.md`](docs/DEPLOIEMENT.md) | Où héberger — et pourquoi GitHub Pages ne peut pas encaisser |

## Où modifier quoi

| Vous voulez changer… | Fichier |
| --- | --- |
| Un prix, un pack | `src/content/product.ts` |
| Une couleur du produit | `src/content/product.ts` → `colorways` |
| Un texte marketing | `src/content/copy.ts` |
| Une réponse de FAQ | `src/content/faq.ts` |
| Les avis clients | `src/content/reviews.ts` |
| Un délai, une garantie, un seuil | `src/lib/site.ts` |
| La charte graphique | `src/app/globals.css` → bloc `@theme` |
| Le modèle 3D | `src/components/three/CameraModel.tsx` |
| L’habillage imprimé du boîtier | `src/components/three/frontDecal.ts` |
| Les coûts fournisseur | `src/lib/supplier/sourcing.ts` |

## Commandes

```bash
npm run dev        # développement
npm run build      # build de production
npm start          # servir le build
npm run lint       # ESLint
npm run typecheck  # TypeScript
npm run margin     # table de marges par volume d'achat
```

---

## ⚠️ Avant d’ouvrir la boutique

Six points bloquants, dans l’ordre :

1. **Compléter les pages légales.** Les mentions entre crochets doivent
   être renseignées. Un bandeau les signale tant qu’elles sont en l’état.
2. **Confirmer les caractéristiques auprès du fournisseur.** Elles
   croisent la fiche Alibaba et les descriptifs revendeurs du même modèle
   — voir `SPECS_NEED_SUPPLIER_CONFIRMATION` dans `src/content/product.ts`.
   Commandez un échantillon et faites-vous envoyer une fiche technique
   écrite.
3. **Remplacer les avis de démonstration.** Ils sont clairement étiquetés
   tant que `REVIEWS_ARE_DEMO` vaut `true`. Publier de faux avis est une
   pratique commerciale trompeuse.
4. **Vérifier la conformité CE / RoHS / DEEE / batteries** pour la vente
   dans l’Union européenne. Détails dans `docs/ALIBABA-SOURCING.md`.
5. **Tenir les promesses affichées** : 3-5 jours, 30 jours de
   rétractation, garantie 12 mois. Si vous partez en dropshipping depuis
   la Chine, corrigez les délais partout avant d’encaisser.
6. **Rendre le webhook idempotent en base.** Le garde actuel est en
   mémoire et ne survit pas à plusieurs instances — voir
   `docs/PAYMENTS.md`.
