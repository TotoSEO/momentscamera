'use client'

import { Suspense, useCallback, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContactShadows, Environment, Lightformer, PresentationControls } from '@react-three/drei'
import { CameraModel } from '@/components/three/CameraModel'
import type { Colorway } from '@/content/product'

/**
 * Scène 3D du produit.
 *
 * L'éclairage est entièrement procédural (Lightformer), donc aucun HDRI
 * n'est téléchargé : la scène s'affiche même hors ligne et le premier
 * rendu n'attend aucune ressource.
 */
export function Scene({
  colorway,
  interactive = true,
  autoRotate = true,
}: {
  colorway: Colorway
  interactive?: boolean
  autoRotate?: boolean
}) {
  const [flashing, setFlashing] = useState(false)

  const triggerFlash = useCallback(() => {
    setFlashing(true)
  }, [])

  useEffect(() => {
    if (!flashing) return
    const t = setTimeout(() => setFlashing(false), 160)
    return () => clearTimeout(t)
  }, [flashing])

  // Un flash automatique de temps en temps : la scène reste vivante
  // même quand personne n'interagit.
  useEffect(() => {
    const id = setInterval(() => setFlashing(true), 7000)
    return () => clearInterval(id)
  }, [])

  return (
    <Canvas
      camera={{ position: [0, 0.15, 7.2], fov: 30 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', toneMappingExposure: 0.78 }}
      onPointerDown={triggerFlash}
      className="cursor-grab active:cursor-grabbing"
    >
      <ambientLight intensity={0.28} />
      <directionalLight position={[3, 6, 2] } intensity={0.9} castShadow />
      <directionalLight position={[-5, 2, -3]} intensity={0.45} color="#ffd426" />

      <Suspense fallback={null}>
        <PresentationControls
          enabled={interactive}
          global
          snap
          cursor={interactive}
          speed={1.4}
          zoom={1}
          rotation={[0.05, -0.18, 0]}
          polar={[-0.4, 0.5]}
          azimuth={[-Math.PI, Math.PI]}
        >
          <CameraModel colorway={colorway} flashing={flashing} autoRotate={autoRotate} />
        </PresentationControls>

        <ContactShadows position={[0, -0.85, 0]} opacity={0.4} scale={6} blur={2} far={3} color="#14121a" />

        {/* Studio « bonbon » : deux barres blanches + deux touches colorées. */}
        <Environment resolution={256}>
          <Lightformer form="rect" intensity={1.1} position={[0, 4.5, 1]} scale={[8, 3, 1]} color="#ffffff" />
          <Lightformer form="rect" intensity={1} position={[-4, 1, 2]} scale={[3, 6, 1]} color="#ffe9a8" />
          <Lightformer form="rect" intensity={0.9} position={[4, 0, 2]} scale={[3, 6, 1]} color="#bcd6ff" />
          <Lightformer form="rect" intensity={0.5} position={[0, -2.4, 2.5]} scale={[6, 2, 1]} color="#ffd0cb" />
        </Environment>
      </Suspense>
    </Canvas>
  )
}

export default Scene
