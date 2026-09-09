'use client'

import { Suspense, useCallback, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContactShadows, PresentationControls } from '@react-three/drei'
import { CameraModel } from '@/components/three/CameraModel'
import type { Colorway } from '@/content/product'

/**
 * Scène 3D du produit.
 *
 * Éclairage entièrement composé de lumières classiques, sans carte
 * d'environnement. Ce choix est délibéré : la page d'accueil monte deux
 * scènes (le hero et le nuancier), et deux `<Environment>` de drei sur une
 * même page se corrompent mutuellement — le rendu vire au noir et blanc
 * solarisé dès que la seconde scène apparaît. Des lumières nommées sont
 * déterministes, moins coûteuses, et n'exigent aucune ressource externe :
 * la scène s'affiche même hors ligne.
 *
 * La brillance de la coque et de l'objectif vient donc du `clearcoat` des
 * matériaux et de deux lumières spéculaires placées à la main.
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
    const id = setInterval(() => setFlashing(true), 9000)
    return () => clearInterval(id)
  }, [])

  return (
    <Canvas
      camera={{ position: [0, 0.15, 7.2], fov: 30 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', toneMappingExposure: 1 }}
      onPointerDown={triggerFlash}
      className="cursor-grab active:cursor-grabbing"
    >
      {/* Ambiance douce : crème par le haut, chaud par le bas, comme une
          table éclairée par une fenêtre. */}
      <hemisphereLight args={['#fff6e9', '#e8b98a', 0.85]} />

      {/* Lumière clé, en haut à droite : c'est elle qui sculpte le volume. */}
      <directionalLight position={[3.5, 5, 4]} intensity={1.5} castShadow />

      {/* Débouchage à gauche, teinté, pour que l'ombre ne soit pas morte. */}
      <directionalLight position={[-4.5, 1.5, 2.5]} intensity={0.55} color="#ffd9a8" />

      {/* Contre-jour : détache la silhouette du fond. */}
      <directionalLight position={[-2, 2, -5]} intensity={0.7} color="#bcd6ff" />

      {/* Petite source frontale rapprochée : donne son éclat à l'objectif. */}
      <pointLight position={[1.2, 1.4, 3.2]} intensity={4} distance={11} decay={2} color="#ffffff" />

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
      </Suspense>
    </Canvas>
  )
}

export default Scene
