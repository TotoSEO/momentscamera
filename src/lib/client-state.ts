'use client'

import { useCallback, useSyncExternalStore } from 'react'

/**
 * Lecture d'état « navigateur uniquement », sans `setState` dans un effet.
 *
 * Le rendu serveur ne connaît ni le stockage local, ni l'URL, ni les
 * préférences système. La tentation est d'écrire `useEffect(() =>
 * setX(...), [])`, mais cela déclenche un rendu en cascade à chaque montage
 * — et React 19 le signale désormais comme une erreur.
 *
 * `useSyncExternalStore` est fait exactement pour ça : il expose un
 * instantané serveur et un instantané client, et React se charge de la
 * transition à l'hydratation.
 */

const noopSubscribe = () => () => {}

/** `false` au rendu serveur et pendant l'hydratation, `true` ensuite. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  )
}

function subscribeToLocation(callback: () => void): () => void {
  window.addEventListener('popstate', callback)
  return () => window.removeEventListener('popstate', callback)
}

/** Valeur d'un paramètre de requête, `null` côté serveur. */
export function useSearchParam(name: string): string | null {
  const getSnapshot = useCallback(
    () => new URLSearchParams(window.location.search).get(name),
    [name],
  )

  return useSyncExternalStore(subscribeToLocation, getSnapshot, () => null)
}

/** `true` si l'utilisateur a demandé à limiter les animations. */
export function usePrefersReducedMotion(): boolean {
  const subscribe = useCallback((callback: () => void) => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    query.addEventListener('change', callback)
    return () => query.removeEventListener('change', callback)
  }, [])

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    () => false,
  )
}
