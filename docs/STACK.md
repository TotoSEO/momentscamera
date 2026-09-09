# La stack, et pourquoi

## Le cahier des charges

Une boutique mono-produit dont la fiche produit doit être remarquable :
rapide, animée, avec de la 3D et des vidéos à intégrer plus tard, prête
pour un paiement réel.

Ces contraintes tirent dans deux directions opposées — beaucoup
d’animation, et un chargement rapide. Toute la stack est choisie pour
résoudre cette tension.

## Les choix

| Couche | Retenu | Version | Pourquoi |
| --- | --- | --- | --- |
| Framework | **Next.js (App Router)** | 16 | Composants serveur : le HTML des pages est statique, seul l’interactif part en JavaScript |
| UI | **React** | 19.2 | Épinglé sous 19.3 : `@react-three/fiber` 9 exige `>=19 <19.3` |
| Langage | **TypeScript** | 5.9 | Les données produit sont typées, une couleur inexistante ne compile pas |
| Styles | **Tailwind CSS** | 4.3 | Configuration en CSS (`@theme`) : les tokens de design vivent dans `globals.css`, pas dans un fichier JS |
| Animation | **Motion** (`motion/react`) | 13 | Successeur de Framer Motion. Déclaratif, comprend le cycle de vie React, gestes et `layout` inclus |
| Scroll | **Lenis** | 1.3 | Scroll inertiel, désactivé si `prefers-reduced-motion` |
| 3D | **React Three Fiber** + **drei** | 9 / 10 | Three.js écrit en JSX, avec les utilitaires prêts (RoundedBox, Environment, PresentationControls) |
| Panier | **Zustand** | 5 | 3 ko, persistance `localStorage` incluse. Redux serait démesuré pour trois lignes de panier |
| Paiement | **Stripe** | 22 | Checkout hébergé : zéro obligation PCI, Apple Pay et Google Pay inclus |

## Les arbitrages

### Pourquoi pas Shopify ?

Shopify gère très bien le back-office, mais Hydrogen contraint fortement
la fiche produit, et l’objectif ici est justement une fiche produit hors
norme. Next.js + Stripe donne un contrôle total pour un coût mensuel nul.

Si le volume dépasse quelques centaines de commandes par mois, la
question mérite d’être rouverte : Shopify apportera la gestion de stock,
les avis, les e-mails transactionnels et la comptabilité sans
développement.

### Pourquoi pas Medusa ?

Excellent pour un catalogue riche et multi-entrepôts. Ici, il y a
**un produit et trois packs** : un back-office complet serait de
l’infrastructure à maintenir pour rien. Les données produit tiennent dans
un fichier TypeScript typé, versionné avec le code.

### GSAP en plus de Motion ?

Pas pour l’instant. Motion couvre les transitions de composants, les
gestes et les révélations au scroll — 95 % du besoin. GSAP devient
pertinent le jour où il faudra une timeline scrubbée au scroll ou du
morphing SVG. Les deux cohabitent sans conflit.

### Un modèle 3D procédural plutôt qu’un `.glb`

Le modèle de `CameraModel.tsx` est construit en géométrie, et son
habillage imprimé (arcs rétro, « 1984 ») est dessiné sur un canvas puis
appliqué en texture.

- **Zéro octet de réseau** : pas de fichier de plusieurs mégaoctets.
- **Neuf coloris sans neuf textures** : la couleur est un paramètre.
- **Net à toute résolution.**

Le jour où vous ferez photographier ou scanner le produit, remplacez le
contenu du `<group>` par un `useGLTF()` : l’API de props ne change pas.

## Ce qui protège les performances

- **Les pages sont statiques.** `npm run build` prérend `/`, `/produit`,
  `/panier`, `/merci` et les pages légales. Seules les routes API sont
  dynamiques.
- **La 3D est chargée à la demande.** `ProductViewer` n’importe le bundle
  Three.js que lorsque le bloc approche du viewport (IntersectionObserver,
  marge de 250 px), via `dynamic(..., { ssr: false })`.
- **Repli sans WebGL.** Si le contexte WebGL est indisponible,
  l’illustration vectorielle prend le relais — la page reste vendeuse.
- **Les vidéos ne démarrent qu’à l’écran.** `VideoBlock` utilise
  `preload="none"` et met en pause hors du viewport.
- **Aucun cookie tiers, aucune police auto-hébergée manquante.** Les
  polices passent par `next/font` (auto-hébergées, sans requête vers
  Google au runtime).
- **Accessibilité.** `prefers-reduced-motion` coupe Lenis, la rotation
  automatique et les transitions. Les sélecteurs de couleur sont des
  `radio` étiquetés, la navigation au clavier est complète.

## Commandes

```bash
npm run dev        # développement
npm run build      # build de production
npm start          # servir le build
npm run lint       # ESLint
npm run typecheck  # TypeScript sans émission
npm run margin     # table de marges (voir docs/ALIBABA-SOURCING.md)
```

## Sources

- [Best Next.js headless ecommerce platforms](https://focusreactive.com/best-nextjs-headless-ecommerce-platforms/)
- [GSAP vs Framer Motion en 2026](https://www.hontran.dev/blog/gsap-vs-framer-motion)
- [React Three Fiber — exemples officiels](https://r3f.docs.pmnd.rs/getting-started/examples)
