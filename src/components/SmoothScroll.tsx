'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import Lenis from 'lenis'

/**
 * Scroll inertiel global (Lenis) et remise en haut de page à la navigation.
 *
 * Lenis détourne le défilement : il applique lui-même une translation et
 * conserve sa propre position. Next, de son côté, remet `window.scrollTo(0)`
 * au changement de route, mais Lenis ignore cet appel et réapplique sa
 * position précédente au frame suivant. Résultat : on arrivait sur la
 * nouvelle page à la hauteur où on avait quitté l'ancienne.
 *
 * On remet donc explicitement Lenis à zéro à chaque changement de chemin,
 * en mode immédiat pour ne pas donner l'impression d'un défilement subi.
 *
 * Désactivé si l'utilisateur a demandé moins d'animations : un scroll
 * détourné est une des premières causes de nausée sur ce profil.
 */
export function SmoothScroll() {
  const lenis = useRef<Lenis | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (prefersReduced.matches) return

    const instance = new Lenis({
      duration: 1.05,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.6,
    })
    lenis.current = instance

    let frame = 0
    const raf = (time: number) => {
      instance.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(frame)
      instance.destroy()
      lenis.current = null
    }
  }, [])

  useEffect(() => {
    // Une ancre dans l'URL désigne une position voulue : on ne l'écrase pas.
    if (window.location.hash) return

    lenis.current?.scrollTo(0, { immediate: true })
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
