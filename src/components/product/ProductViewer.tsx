'use client'

import dynamic from 'next/dynamic'
import { useEffect, useMemo, useState } from 'react'
import { CameraGlyph } from '@/components/ui/CameraGlyph'
import type { Colorway } from '@/content/product'
import { cn } from '@/lib/cn'
import { useHydrated, usePrefersReducedMotion } from '@/lib/client-state'

/**
 * Enveloppe du visualiseur 3D.
 *
 * Trois garde-fous, dans cet ordre :
 *  1. le bundle three.js n'est chargé qu'au moment où le bloc entre à l'écran ;
 *  2. si WebGL est indisponible, on retombe sur l'illustration vectorielle ;
 *  3. si l'utilisateur a demandé moins d'animations, la rotation auto s'arrête.
 */
const Scene = dynamic(() => import('@/components/three/Scene').then((m) => m.Scene), {
  ssr: false,
  loading: () => <ViewerSkeleton />,
})

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl2') ?? canvas.getContext('webgl')),
    )
  } catch {
    return false
  }
}

function ViewerSkeleton() {
  return (
    <div className="grid size-full place-items-center">
      <div className="animate-wiggle">
        <CameraGlyph className="w-40 opacity-30" bodyColor="#9a9aa8" />
      </div>
    </div>
  )
}

export function ProductViewer({
  colorway,
  className,
  interactive = true,
}: {
  colorway: Colorway
  className?: string
  interactive?: boolean
}) {
  const [visible, setVisible] = useState(false)
  const [node, setNode] = useState<HTMLDivElement | null>(null)

  const hydrated = useHydrated()
  const reducedMotion = usePrefersReducedMotion()

  // `null` tant qu'on ne sait pas : évite d'afficher le repli une fraction
  // de seconde avant d'avoir pu tester WebGL.
  const supported = useMemo(() => (hydrated ? hasWebGL() : null), [hydrated])

  useEffect(() => {
    if (!node || visible) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '250px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [node, visible])

  return (
    <div ref={setNode} className={cn('relative isolate', className)}>
      {/* Halo lumineux derrière le produit. */}
      <div
        className="animate-flash absolute inset-[8%] -z-10 rounded-full flash-halo blur-2xl"
        aria-hidden
      />

      {supported === false ? (
        <div className="grid size-full place-items-center p-6">
          <CameraGlyph
            className="w-full max-w-md"
            bodyColor={colorway.hex}
            shadeColor={colorway.shadeHex}
            translucent={colorway.translucent}
            title={`Appareil photo porte-clés, coloris ${colorway.name}`}
          />
        </div>
      ) : visible ? (
        <Scene colorway={colorway} interactive={interactive} autoRotate={!reducedMotion} />
      ) : (
        <ViewerSkeleton />
      )}
    </div>
  )
}
