/**
 * Chemin d'un fichier de `public/`, préfixé du basePath.
 *
 * `next/image` applique le basePath à ses URL optimisées, mais PAS aux
 * sources laissées telles quelles par `unoptimized: true` — le mode utilisé
 * pour l'export statique. Un `src="/produits/x.jpg"` part donc à la racine
 * du domaine et renvoie un 404 dès que le site est servi dans un
 * sous-répertoire, comme sur GitHub Pages.
 *
 * Toute référence en dur à un fichier de `public/` doit passer par ici.
 */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

export function assetPath(path: string): string {
  if (!path.startsWith('/')) return `${basePath}/${path}`
  return `${basePath}${path}`
}
