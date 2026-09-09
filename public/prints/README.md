# Fichiers d'impression des façades

Déposez ici les visuels d'impression fournis par le fabricant, en **1024 × 420 px**,
nommés d'après le `slug` du coloris — par exemple `rouge-flash.png`.

Activez-les ensuite avec :

```bash
NEXT_PUBLIC_USE_PRINT_IMAGES="true"
```

Tant qu'un fichier est absent, le modèle 3D utilise la sérigraphie redessinée
dans `src/components/three/frontDecal.ts`. Détails dans `docs/MEDIAS.md`.
