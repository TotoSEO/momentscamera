# Le système de design « Bubble Pop »

## D’où vient la palette

Elle n’est pas inventée : ce sont **les coloris de fabrication du
produit** — rouge, jaune, bleu, vert, vert-citron, gris, noir, blanc et un
boîtier translucide. Le site et l’objet parlent donc la même langue, et le
nuancier de la fiche produit est aussi la charte du site.

Le produit apporte un second registre graphique, repris tel quel : le
**balayage arc-en-ciel rétro** de sa façade, sa typographie grasse et sa
mention « 1984 ». C’est ce qui donne au site sa direction : pop, rond,
franc, un peu années 80.

| Token | Valeur | Usage |
| --- | --- | --- |
| `--color-pop-red` | `#ff4438` | Action principale, accents |
| `--color-pop-yellow` | `#ffd426` | Surlignage, action secondaire |
| `--color-pop-blue` | `#2f6bff` | Sections froides, contraste |
| `--color-pop-green` | `#21d07a` | Validation, confirmation |
| `--color-pop-lime` | `#c8f135` | Signal, économies |
| `--color-ink` | `#14121a` | Texte, contours |
| `--color-cream` | `#fff6e9` | Fond général |
| `--color-paper` | `#fffdf8` | Fond des cartes |

Tout est déclaré dans `@theme` au sommet de `src/app/globals.css`.
Changer une valeur là suffit à repeindre le site, la 3D comprise —
`colorways` dans `src/content/product.ts` pilote le modèle.

## Les principes

1. **Rond partout.** Rayons de 2 rem sur les cartes, `999px` sur les
   boutons et les pastilles. Aucun angle vif.
2. **Contour épais.** `3px solid ink` sur presque tout. C’est ce qui
   empêche une palette aussi saturée de partir en bouillie.
3. **Ombre dure, jamais floue.** `5px 6px 0 0 ink` — pas de flou. L’objet
   a l’air découpé et posé, comme un autocollant.
4. **Ça bouge un peu au repos.** Blobs qui se déforment, bandeau qui
   défile, halo qui pulse, appareil qui se balance. La page respire même
   sans interaction.
5. **Le flash comme motif.** Halo radial jaune derrière le produit,
   balayage lumineux sur les boutons principaux, éclair au clic sur la 3D.
6. **Grain léger.** Un bruit SVG à 5 % d’opacité sur tout le corps de
   page, pour éviter l’aspect « aplat numérique ».

## Typographie

- **Fredoka** — titres. Ronde, épaisse, joyeuse. C’est la définition même
  d’une police « bubble ».
- **Nunito** — texte courant. Rondeurs assorties, très lisible en petit.
- **Space Mono** — chiffres, prix, étiquettes techniques. Le contraste
  mécanique donne de la crédibilité aux caractéristiques.

Inter et Roboto sont volontairement écartées : ce sont les polices par
défaut de tout site généré, et elles rendraient la page indistinguable
des autres.

## Utilitaires maison

Définis dans `globals.css` avec la directive `@utility` de Tailwind 4 :

| Utilitaire | Effet |
| --- | --- |
| `grain` | Bruit SVG en surcouche |
| `flash-halo` | Halo radial jaune |
| `stripes` | Rayures obliques « ruban de chantier » |
| `text-stroke` | Contour de texte |
| `animate-blob` | Déformation organique lente |
| `animate-marquee` | Défilement horizontal continu |
| `animate-flash` | Pulsation lumineuse |
| `animate-wiggle` | Balancement léger |

## Mouvement

| Composant | Rôle |
| --- | --- |
| `Reveal` / `RevealGroup` | Apparition au scroll, `once: true`, marge négative |
| `Button` | Ressort au survol et au tap, porté par Motion (survit au tactile) |
| `Marquee` | CSS pur, contenu dupliqué, translation à −50 % pour une boucle sans couture |
| `Hero` | Trois plans à vitesses différentes via `useScroll` + `useTransform` |
| `Colors` | Le fond de section prend la couleur choisie |
| `CartProvider` | Tiroir en ressort, `AnimatePresence` |

**Toutes les animations s’effacent sous `prefers-reduced-motion`** : les
durées passent à 0,001 ms, Lenis ne se monte pas, la rotation automatique
du modèle 3D s’arrête.

## Références

- [awesome-design-md](https://github.com/VoltAgent/awesome-design-md)
- [Landing page design — principes anti-convergence](https://github.com/2389-research/landing-page-design)
- [Awwwards — sélection e-commerce colorée](https://www.awwwards.com/inspiration/creative-and-colorful-ecommerce)
- [Polices « bubble » — panorama 2026](https://madegooddesigns.com/bubble-fonts/)
