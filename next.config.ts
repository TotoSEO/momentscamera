import type { NextConfig } from 'next'

/**
 * Deux modes de build.
 *
 * 1. Mode normal (Vercel, Netlify, un serveur Node…) — la boutique complète :
 *    pages statiques + routes API. C'est le mode nécessaire pour encaisser,
 *    puisque `/api/checkout` et `/api/stripe/webhook` doivent s'exécuter
 *    côté serveur.
 *
 * 2. Mode aperçu statique (`NEXT_PUBLIC_STATIC_PREVIEW=true`) — un export de
 *    fichiers HTML pour un hébergeur statique comme GitHub Pages. Le site
 *    s'affiche et la 3D fonctionne, mais **aucun paiement n'est possible** :
 *    un hébergeur statique n'exécute pas de code serveur. Le tunnel affiche
 *    alors un message explicite au lieu d'un bouton qui échouerait.
 *
 * Voir docs/DEPLOIEMENT.md.
 */
const isStaticPreview = process.env.NEXT_PUBLIC_STATIC_PREVIEW === 'true'

// GitHub Pages sert le site sous /<nom-du-depot>, d'où le préfixe.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  ...(isStaticPreview
    ? {
        output: 'export' as const,
        // Sans cela, l'export produit `produit.html`, que GitHub Pages ne
        // sert pas sur l'URL `/produit`. Avec, il produit `produit/index.html`.
        trailingSlash: true,
      }
    : {}),

  ...(basePath ? { basePath, assetPrefix: basePath } : {}),

  images: {
    formats: ['image/avif', 'image/webp'],
    // L'optimisation d'images exige un serveur.
    unoptimized: isStaticPreview,
  },

  // three.js ships untranspiled ESM examples; keep them in the server bundle graph.
  transpilePackages: ['three'],

  // Les en-têtes HTTP sont posés par le serveur Next : un export statique
  // n'en a pas. Sur un hébergeur statique, configurez-les côté hébergeur.
  ...(isStaticPreview
    ? {}
    : {
        async headers() {
          return [
            {
              source: '/:path*',
              headers: [
                { key: 'X-Content-Type-Options', value: 'nosniff' },
                { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
              ],
            },
          ]
        },
      }),
}

export default nextConfig
