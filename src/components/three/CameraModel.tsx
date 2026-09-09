'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import type { Colorway } from '@/content/product'
import { createFrontDecal, loadPrintImage } from '@/components/three/frontDecal'

/**
 * Modèle 3D du Thumb Camera « 1984 ».
 *
 * Forme reprise du produit réel : une plaquette HORIZONTALE trapue
 * (62,8 × 25,9 mm de face, ~21 mm d'épaisseur, 26 g), et non un bâtonnet
 * vertical. Éléments caractéristiques reproduits :
 *   - habillage imprimé (arcs rétro, « THUMB CAMERA », « 1984 »)
 *     généré en texture canvas, voir frontDecal.ts ;
 *   - objectif grand-angle 130° saillant, décentré vers la droite ;
 *   - deux boutons ronds noirs sur la tranche supérieure ;
 *   - languette d'accroche percée sur le flanc gauche, avec anneau métal ;
 *   - écran TFT LCD au dos, dans un cadre clair ;
 *   - port USB-C et fente microSD sur les tranches.
 *
 * Aucun .glb : le modèle ne coûte rien en réseau, se recolore
 * instantanément et reste net à toutes les résolutions. Pour passer sur un
 * scan photoréaliste, remplacez le contenu de <group> par un `useGLTF` en
 * conservant la même API de props.
 */

// 1 unité ≈ 26 mm. 62,8 × 25,9 × 21 mm → 2,42 × 1,0 × 0,81.
const W = 2.42
const H = 1.0
const D = 0.81
const FRONT = D / 2
const BACK = -D / 2
const TOP = H / 2
const LENS_X = -0.05 // très légèrement à gauche du centre, comme sur le produit
const LENS_Y = -0.1 // et sous l'axe médian

export function CameraModel({
  colorway,
  flashing,
  autoRotate = true,
}: {
  colorway: Colorway
  flashing: boolean
  autoRotate?: boolean
}) {
  const group = useRef<THREE.Group>(null)
  const ring = useRef<THREE.Mesh>(null)
  const led = useRef<THREE.MeshStandardMaterial>(null)
  const screen = useRef<THREE.MeshPhysicalMaterial>(null)
  const flashLight = useRef<THREE.PointLight>(null)

  // L'habillage vectoriel est redessiné uniquement quand le coloris change.
  const drawn = useMemo(() => createFrontDecal(colorway), [colorway])
  useEffect(() => () => drawn.dispose(), [drawn])

  // Si les fichiers d'impression du fabricant sont disponibles, ils
  // remplacent le dessin. Voir docs/MEDIAS.md § « Habillages exacts ».
  const [supplied, setSupplied] = useState<THREE.CanvasTexture | null>(null)
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_USE_PRINT_IMAGES !== 'true') return
    let alive = true
    void loadPrintImage(colorway.slug, process.env.NEXT_PUBLIC_BASE_PATH ?? '').then((texture) => {
      if (!alive) {
        texture?.dispose()
        return
      }
      setSupplied(texture)
    })
    return () => {
      alive = false
      setSupplied(null)
    }
  }, [colorway.slug])

  const decal = supplied ?? drawn

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime

    // Balancement d'invitation, tant que personne n'a pris la main.
    // `autoRotate` repasse à false dès la première manipulation : le modèle
    // se fige alors sur sa pose courante. Le remettre à zéro annulerait le
    // geste que le visiteur vient tout juste de faire.
    if (group.current && autoRotate) {
      group.current.rotation.y = Math.sin(t * 0.4) * 0.6
      group.current.rotation.x = Math.sin(t * 0.29) * 0.09
      group.current.position.y = Math.sin(t * 0.9) * 0.04
    }

    if (ring.current && autoRotate) {
      ring.current.rotation.y = Math.sin(t * 1.25) * 0.4
    }

    if (flashLight.current) {
      flashLight.current.intensity = THREE.MathUtils.lerp(
        flashLight.current.intensity,
        flashing ? 3.2 : 0,
        delta * 9,
      )
    }
    if (led.current) {
      led.current.emissiveIntensity = THREE.MathUtils.lerp(
        led.current.emissiveIntensity,
        flashing ? 6 : 0.7,
        delta * 8,
      )
    }
    if (screen.current) {
      // Écran éteint, comme sur les visuels produit : juste un souffle de
      // veille pour qu'il n'ait pas l'air peint en noir.
      screen.current.emissiveIntensity = 0.12 + Math.sin(t * 2.1) * 0.05
    }
  })

  const body = colorway.hex
  const translucent = colorway.translucent === true

  return (
    <group ref={group} dispose={null}>
      {/* ================= Coque ================= */}
      <RoundedBox args={[W, H, D]} radius={0.11} smoothness={7} castShadow receiveShadow>
        {translucent ? (
          // `transmission` a besoin d'une carte d'environnement pour être
          // crédible ; sans elle, la coque sature en blanc pur. Une simple
          // transparence dépolie rend mieux le boîtier translucide réel,
          // et laisse voir l'électronique modélisée à l'intérieur.
          // Le vernis (`clearcoat`) ajoute un spéculaire qui n'est PAS
          // atténué par l'opacité : à 1, il repeignait la coque en blanc et
          // annulait toute transparence. On le réduit fortement.
          <meshPhysicalMaterial
            color={body}
            roughness={0.28}
            metalness={0}
            clearcoat={0.22}
            clearcoatRoughness={0.25}
            transparent
            opacity={0.34}
          />
        ) : (
          <meshPhysicalMaterial
            color={body}
            roughness={0.4}
            metalness={0.02}
            clearcoat={0.45}
            clearcoatRoughness={0.22}
            envMapIntensity={0.5}
          />
        )}
      </RoundedBox>

      {/* ================= Face avant imprimée ================= */}
      <mesh position={[0, 0, FRONT + 0.002]}>
        <planeGeometry args={[W - 0.04, H - 0.04]} />
        <meshPhysicalMaterial
          map={decal}
          roughness={0.55}
          clearcoat={0.12}
          clearcoatRoughness={0.4}
          envMapIntensity={0.28}
          transparent
          opacity={1}
        />
      </mesh>

      {/* Objectif grand-angle 130°, nettement saillant */}
      <group position={[LENS_X, LENS_Y, FRONT]}>
        {/* Embase */}
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.225, 0.245, 0.055, 56]} />
          <meshStandardMaterial color="#17151c" roughness={0.4} metalness={0.35} />
        </mesh>
        {/* Fût strié */}
        <mesh position={[0, 0, 0.045]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.195, 0.22, 0.07, 56]} />
          <meshStandardMaterial color="#100e15" roughness={0.32} metalness={0.5} />
        </mesh>
        {/* Bague avant */}
        <mesh position={[0, 0, 0.085]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.17, 0.19, 0.045, 56]} />
          <meshStandardMaterial color="#26232e" roughness={0.25} metalness={0.7} />
        </mesh>
        {/* Lentille bombée, traitement violacé caractéristique */}
        <mesh position={[0, 0, 0.105]} rotation={[Math.PI / 2, 0, 0]}>
          <sphereGeometry args={[0.145, 44, 32, 0, Math.PI * 2, 0, Math.PI / 2.6]} />
          <meshPhysicalMaterial
            color="#2a1050"
            roughness={0.02}
            metalness={0.25}
            clearcoat={1}
            clearcoatRoughness={0}
            iridescence={0.85}
            iridescenceIOR={2}
            iridescenceThicknessRange={[260, 520]}
            emissive="#1b0a3a"
            emissiveIntensity={0.35}
          />
        </mesh>
      </group>

      {/* Éclairage d'appoint (LED), à gauche de l'objectif */}
      <mesh position={[0.78, 0.3, FRONT + 0.004]}>
        <sphereGeometry args={[0.022, 14, 14]} />
        <meshStandardMaterial
          ref={led}
          color="#fff9df"
          emissive="#ffd426"
          emissiveIntensity={1.6}
          toneMapped={false}
        />
      </mesh>

      {/* ================= Tranche supérieure : deux boutons ronds ================= */}
      {[-0.18, 0.14].map((x) => (
        <mesh key={x} position={[x, TOP + 0.025, 0]} castShadow>
          <cylinderGeometry args={[0.085, 0.09, 0.06, 32]} />
          <meshStandardMaterial color="#17151c" roughness={0.42} metalness={0.15} />
        </mesh>
      ))}

      {/* ================= Flanc gauche : languette percée + anneau ================= */}
      <mesh position={[-W / 2 - 0.08, 0.06, 0]} castShadow>
        <boxGeometry args={[0.2, 0.26, 0.16]} />
        <meshStandardMaterial color={body} roughness={0.36} metalness={0.02} />
      </mesh>
      <mesh position={[-W / 2 - 0.11, 0.06, 0]}>
        <torusGeometry args={[0.055, 0.022, 12, 26]} />
        <meshStandardMaterial color="#17151c" roughness={0.5} />
      </mesh>
      <mesh ref={ring} position={[-W / 2 - 0.32, 0.06, 0]} castShadow>
        <torusGeometry args={[0.17, 0.035, 16, 48]} />
        <meshStandardMaterial color="#cbced6" metalness={1} roughness={0.18} />
      </mesh>

      {/* ================= Dos : écran TFT LCD ================= */}
      {/* Cadre clair, comme sur le produit */}
      <RoundedBox args={[1.34, 0.78, 0.05]} radius={0.06} smoothness={5} position={[0.08, -0.03, BACK - 0.012]}>
        <meshStandardMaterial color={translucent ? '#e8f2fa' : '#f4efe4'} roughness={0.5} />
      </RoundedBox>
      {/* Dalle */}
      <mesh position={[0.08, -0.03, BACK - 0.038]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[1.14, 0.58]} />
        <meshPhysicalMaterial
          ref={screen}
          color="#0a0a0d"
          emissive="#12305e"
          emissiveIntensity={0.12}
          roughness={0.06}
          clearcoat={1}
          clearcoatRoughness={0.02}
        />
      </mesh>
      {/* Deux boutons de navigation, à gauche de l'écran */}
      {[0.14, -0.16].map((y) => (
        <mesh key={y} position={[-0.94, y, BACK - 0.02]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.058, 0.058, 0.04, 22]} />
          <meshStandardMaterial color="#17151c" roughness={0.42} />
        </mesh>
      ))}

      {/* ================= Connectique ================= */}
      {/* USB-C, tranche basse */}
      <mesh position={[0.3, -TOP + 0.012, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <boxGeometry args={[0.28, 0.09, 0.1]} />
        <meshStandardMaterial color="#211e28" roughness={0.7} />
      </mesh>
      {/* microSD, tranche basse également */}
      <mesh position={[-0.32, -TOP + 0.008, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <boxGeometry args={[0.3, 0.06, 0.05]} />
        <meshStandardMaterial color="#211e28" roughness={0.7} />
      </mesh>

      {/* Lumière du flash : n'existe qu'au moment du déclenchement. */}
      <pointLight
        ref={flashLight}
        position={[LENS_X, 0, 1.5]}
        intensity={0}
        color="#fff6d0"
        distance={5}
        decay={2}
      />
    </group>
  )
}
