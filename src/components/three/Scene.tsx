'use client'

import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContactShadows, OrbitControls } from '@react-three/drei'
import { CameraModel } from '@/components/three/CameraModel'
import type { Colorway } from '@/content/product'

/**
 * Scène 3D du produit.
 *
 * Contrôles : `OrbitControls` et non `PresentationControls`. Le second
 * ramenait l'objet à sa position de départ dès qu'on relâchait la souris —
 * on ne pouvait donc jamais « poser » l'appareil sous l'angle voulu.
 * OrbitControls conserve l'orientation, avec un amorti qui garde le geste
 * fluide.
 *
 * Le balancement automatique sert d'invitation : dès que le visiteur prend
 * la main, il s'arrête définitivement et ne vient plus contrarier son geste.
 *
 * Éclairage entièrement composé de lumières classiques, sans carte
 * d'environnement : déterministe, moins coûteux, et la scène s'affiche même
 * hors ligne.
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
  const [interacted, setInteracted] = useState(false)
  /** Position du pointeur à l'appui : sert à distinguer un clic d'un glissement. */
  const pressAt = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    if (!flashing) return
    const t = setTimeout(() => setFlashing(false), 160)
    return () => clearTimeout(t)
  }, [flashing])

  // Un flash automatique de temps en temps : la scène reste vivante
  // même quand personne n'interagit. Il s'arrête dès qu'on manipule l'objet.
  useEffect(() => {
    if (interacted) return
    const id = setInterval(() => setFlashing(true), 9000)
    return () => clearInterval(id)
  }, [interacted])

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    pressAt.current = { x: e.clientX, y: e.clientY }
  }, [])

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    const start = pressAt.current
    pressAt.current = null
    if (!start) return
    // Un glissement fait tourner l'objet ; seul un vrai clic déclenche le flash.
    const moved = Math.hypot(e.clientX - start.x, e.clientY - start.y)
    if (moved < 6) setFlashing(true)
  }, [])

  return (
    <Canvas
      camera={{ position: [0, 0.15, 7.2], fov: 30 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', toneMappingExposure: 1 }}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      className="cursor-grab active:cursor-grabbing"
    >
      {/* Ambiance douce : crème par le haut, chaud par le bas, comme une
          table éclairée par une fenêtre. */}
      <hemisphereLight args={['#fffaf2', '#f0d4b4', 0.82]} />

      {/* Lumière clé : c'est elle qui sculpte le volume. */}
      <directionalLight position={[3, 6, 2]} intensity={1.15} castShadow />

      {/* Débouchage à gauche, teinté, pour que l'ombre ne soit pas morte. */}
      <directionalLight position={[-4.5, 1.5, 2.5]} intensity={0.42} color="#ffd9a8" />

      {/* Contre-jour : détache la silhouette du fond. */}
      <directionalLight position={[-2, 2, -5]} intensity={0.7} color="#bcd6ff" />

      {/* Petite source frontale rapprochée : donne son éclat à l'objectif. */}
      <pointLight position={[1.2, 1.4, 3.2]} intensity={3} distance={10} decay={2} color="#ffffff" />

      <Suspense fallback={null}>
        <CameraModel
          colorway={colorway}
          flashing={flashing}
          autoRotate={autoRotate && !interacted}
        />

        <ContactShadows position={[0, -0.85, 0]} opacity={0.4} scale={6} blur={2} far={3} color="#14121a" />

        <OrbitControls
          enabled={interactive}
          // Zoom et déplacement désactivés : on veut faire tourner un objet,
          // pas explorer une scène — et surtout ne pas capturer le scroll.
          enableZoom={false}
          enablePan={false}
          enableDamping
          dampingFactor={0.08}
          rotateSpeed={0.85}
          // On borne l'inclinaison pour ne jamais voir l'appareil par-dessous.
          minPolarAngle={Math.PI / 2 - 0.65}
          maxPolarAngle={Math.PI / 2 + 0.45}
          onStart={() => setInteracted(true)}
        />
      </Suspense>
    </Canvas>
  )
}

export default Scene
