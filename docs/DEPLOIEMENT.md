# Où héberger la boutique

## La question à trancher d’abord

Ce site contient deux routes qui doivent s’exécuter **sur un serveur** :

| Route | Ce qu’elle fait | Pourquoi elle est indispensable |
| --- | --- | --- |
| `/api/checkout` | Recalcule les prix depuis le catalogue et crée la session Stripe | Sans elle, aucun paiement ne peut démarrer |
| `/api/stripe/webhook` | Reçoit la confirmation de paiement et déclenche l’expédition | Sans elle, vous ne savez pas qu’une commande a été payée |

**Un hébergeur de fichiers statiques ne peut pas les exécuter.** C’est le cas
de GitHub Pages. Le site s’y affichera, mais la boutique n’encaissera rien.

D’où deux modes de build.

---

## Mode 1 — boutique complète (ce qu’il vous faut pour vendre)

Aucune configuration particulière : `npm run build` produit l’application
complète, routes API comprises.

### Vercel (recommandé)

Vercel est édité par l’équipe de Next.js ; c’est l’hébergement le plus direct
pour ce projet, et l’offre gratuite suffit largement au démarrage.

1. Aller sur [vercel.com/new](https://vercel.com/new) et se connecter avec
   GitHub.
2. Choisir le dépôt `momentscamera`. Vercel détecte Next.js seul : ne
   modifiez aucun réglage de build.
3. Dans **Environment Variables**, ajouter :

   | Nom | Valeur |
   | --- | --- |
   | `NEXT_PUBLIC_SITE_URL` | l’URL que Vercel vous attribue |
   | `STRIPE_SECRET_KEY` | `sk_test_…` puis `sk_live_…` |
   | `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_test_…` puis `pk_live_…` |
   | `STRIPE_WEBHOOK_SECRET` | fourni à l’étape 5 |

   Sans ces variables la boutique fonctionne quand même : le tunnel bascule
   en mode démonstration. Vous pouvez donc déployer d’abord, configurer
   Stripe ensuite.
4. **Deploy.** Comptez deux à trois minutes.
5. Déclarer le webhook côté Stripe : tableau de bord → Développeurs →
   Webhooks → `https://votre-url.vercel.app/api/stripe/webhook`, en écoutant
   `checkout.session.completed`. Coller le secret `whsec_…` obtenu dans la
   variable `STRIPE_WEBHOOK_SECRET`, puis redéployer.

Chaque push sur `main` redéploie automatiquement.

### Autres hébergeurs équivalents

Netlify, Cloudflare Pages (adaptateur Next.js), Railway, Render, ou n’importe
quel serveur Node exécutant `npm run build && npm start`.

---

## Mode 2 — aperçu statique (GitHub Pages)

Le workflow `.github/workflows/nextjs.yml` publie un **aperçu** du site sur
GitHub Pages à chaque push sur `main`.

Ce qui fonctionne : toutes les pages, le visualiseur 3D, le nuancier, le
panier, les pages légales.

Ce qui ne fonctionne pas : **le paiement**. La page panier affiche à la place
un encadré expliquant que le tunnel est indisponible dans cette version.

### Comment le workflow s’y prend

1. `NEXT_PUBLIC_STATIC_PREVIEW=true` déclenche `output: 'export'` et
   `trailingSlash: true` dans `next.config.ts`.
2. `NEXT_PUBLIC_BASE_PATH` reçoit le sous-chemin du dépôt
   (`/momentscamera`), sinon toutes les ressources pointeraient à la racine
   du domaine.
3. Les routes API sont retirées de la copie de travail avant le build : un
   export statique ne peut pas embarquer de gestionnaire `POST`, et le build
   échouerait. **Le dépôt n’est pas modifié.**
4. `robots.ts` et `sitemap.ts` déclarent `dynamic = 'force-static'`, exigé
   par Next sous `output: 'export'`.

### Reproduire ce build en local

```bash
rm -rf src/app/api   # à ne PAS committer — restaurez avec git checkout
NEXT_PUBLIC_STATIC_PREVIEW=true \
NEXT_PUBLIC_BASE_PATH=/momentscamera \
NEXT_PUBLIC_SITE_URL=https://totoseo.github.io/momentscamera \
npm run build

# Servir comme GitHub Pages, c'est-à-dire sous le sous-chemin :
mkdir -p /tmp/pages && cp -r out /tmp/pages/momentscamera
cd /tmp/pages && python3 -m http.server 4173
# → http://127.0.0.1:4173/momentscamera/

git checkout src/app/api
```

### Pannes classiques

| Symptôme | Cause | Correctif |
| --- | --- | --- |
| Page blanche, build en échec sur `robots.txt` ou `sitemap.xml` | Route handler sans `dynamic = 'force-static'` | Déjà corrigé dans ce dépôt |
| Build en échec sur `/api/...` | Un gestionnaire `POST` ne peut pas être exporté | Le workflow retire `src/app/api` avant le build |
| Site sans style, ressources en 404 | `basePath` absent | `NEXT_PUBLIC_BASE_PATH` est passé par le workflow |
| Un lien interne renvoie un 404 | Chemin absolu écrit à la main | Utiliser `next/link` ou `router.push`, jamais `window.location` |
| `/produit` en 404 alors que la page existe | Export en `produit.html` | `trailingSlash: true` produit `produit/index.html` |

---

## En résumé

| | GitHub Pages | Vercel |
| --- | --- | --- |
| Affichage du site | ✅ | ✅ |
| Visualiseur 3D | ✅ | ✅ |
| Panier | ✅ | ✅ |
| **Encaisser un paiement** | ❌ | ✅ |
| **Recevoir les commandes** | ❌ | ✅ |
| Coût | Gratuit | Gratuit au démarrage |

Gardez GitHub Pages pour montrer le site. Passez sur Vercel pour vendre.
