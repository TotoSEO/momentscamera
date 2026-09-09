# Intégrer les vidéos et les photos

Les emplacements sont déjà composés et animés dans la page. Il ne reste
qu’à déposer les fichiers.

## Vidéos

1. Placez vos fichiers dans `public/videos/`.
2. Renseignez `src` sur les `VideoBlock` concernés :
   - `src/components/sections/VideoWall.tsx` — le mur de la page d’accueil ;
   - `src/components/product/ProductPageClient.tsx` — les trois vignettes
     sous le visualiseur 3D.

```tsx
<VideoBlock
  src="/videos/un-clic-une-photo.mp4"
  poster="/videos/un-clic-une-photo.jpg"
  caption="Un clic, une photo"
  tone="red"
/>
```

### Ce que le composant fait déjà pour vous

- `preload="none"` : rien n’est téléchargé tant que le bloc n’est pas visible.
- Lecture démarrée à l’entrée dans le viewport, mise en pause à la sortie
  (IntersectionObserver à 25 %).
- `muted`, `loop`, `playsInline` : lecture automatique autorisée sur iOS.
- Cadre arrondi, contour épais et ombre dure : cohérent avec le reste.

### Recommandations d’encodage

| Réglage | Valeur |
| --- | --- |
| Format | MP4 (H.264) — ajoutez un WebM si vous visez le poids minimal |
| Résolution | 1080 × 1350 (4:5) pour les verticales, 1080 × 1080 pour les carrées |
| Débit | 2 à 3 Mb/s |
| Durée | 4 à 8 secondes en boucle |
| Poids cible | **moins de 2 Mo par vidéo** |
| Son | Aucun — les vidéos sont muettes par conception |

```bash
ffmpeg -i source.mov -vf "scale=1080:-2" -c:v libx264 -crf 26 \
       -preset slow -an -movflags +faststart public/videos/sortie.mp4
```

`-movflags +faststart` déplace les métadonnées en tête de fichier : la
lecture démarre sans attendre le téléchargement complet.

### Les quatre vidéos à tourner en priorité

1. **Le geste** — la main sort les clés, appuie, range. Trois secondes.
   C’est la vidéo qui explique le produit sans un mot.
2. **L’échelle** — l’appareil dans une paume, à côté d’une pièce de monnaie.
   Répond à « il est vraiment si petit ? ».
3. **Le rendu** — des photos prises avec l’appareil, en plein écran, sans
   retouche. C’est l’objection numéro un ; une vidéo la lève mieux qu’un
   paragraphe.
4. **Les coloris** — les neuf boîtiers qui défilent.

## Photos

Utilisez `next/image` : les formats AVIF et WebP sont déjà activés dans
`next.config.ts`.

```tsx
import Image from 'next/image'

<Image
  src="/photos/appareil-rouge.jpg"
  alt="L’appareil photo porte-clés rouge, tenu dans une main"
  width={1200}
  height={1500}
  className="rounded-[2rem] border-3 border-ink shadow-pop"
/>
```

Le texte alternatif décrit ce que montre l’image, pas le nom du produit.

## Remplacer le modèle 3D par un vrai scan

Le modèle procédural est là pour ne pas bloquer la mise en ligne. Le jour
où vous disposez d’un `.glb` :

1. Déposez-le dans `public/models/camera.glb`.
2. Dans `src/components/three/CameraModel.tsx`, remplacez le contenu du
   `<group>` par :

```tsx
const { scene } = useGLTF('/models/camera.glb')
```

3. Conservez la signature des props (`colorway`, `flashing`, `autoRotate`)
   pour ne rien changer ailleurs.
4. Compressez avec Draco ou Meshopt : visez moins de 3 Mo.

## Image de partage

`public/og.svg` est générée à la main, aux couleurs du produit. Si vous la
remplacez par une photo, gardez 1200 × 630 px et mettez à jour les
références dans `src/app/layout.tsx`.
