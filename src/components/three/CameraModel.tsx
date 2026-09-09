'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import type { Colorway } from '@/content/product'
import { createFrontDecal } from '@/components/three/frontDecal'

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
const LENS_X = 0.28 // objectif décentré vers la droite, comme sur le produit

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
  const screen = useRef<THREE.MeshStandardMaterial>(null)
  const flashLight = useRef<THREE.PointLight>(null)

  // L'habillage est redessiné uniquement quand le coloris change.
  const decal = useMemo(() => createFrontDecal(colorway), [colorway])
  useEffect(() => () => decal.dispose(), [decal])

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime

    if (group.current) {
      // Balancement plutôt que rotation continue : l'objectif et le
      // graphisme restent face au visiteur, qui verrait sinon le dos
      // la moitié du temps.
      if (autoRotate) {
        group.current.rotation.y = Math.sin(t * 0.4) * 0.6
        group.current.rotation.x = Math.sin(t * 0.29) * 0.09
      }
      group.current.position.y = Math.sin(t * 0.9) * 0.04
    }

    if (ring.current) {
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
      // L'écran respire un peu : il a l'air allumé, pas peint.
      screen.current.emissiveIntensity = 0.5 + Math.sin(t * 2.1) * 0.12
    }
  })

  const body = colorway.hex
  const shade = colorway.shadeHex
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
          <meshPhysicalMaterial
            color={body}
            roughness={0.22}
            metalness={0}
            clearcoat={1}
            clearcoatRoughness={0.06}
            transparent
            opacity={0.42}
            depthWrite={false}
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

      {/* Électronique : n'a d'intérêt que sous une coque translucide,
          où elle donne de la profondeur au lieu d'un vide blanc. */}
      {translucent && (
        <group>
          {/* Carte */}
          <mesh position={[0, -0.06, 0]}>
            <boxGeometry args={[W - 0.42, H - 0.42, 0.05]} />
            <meshStandardMaterial color="#1f6b4a" roughness={0.65} />
          </mesh>
          {/* Batterie */}
          <mesh position={[-0.62, -0.02, 0.12]}>
            <boxGeometry args={[0.5, 0.44, 0.18]} />
            <meshStandardMaterial color="#2a2731" roughness={0.5} metalness={0.3} />
          </mesh>
          {/* Composants */}
          {[
            [0.72, 0.2],
            [0.86, -0.16],
            [0.2, 0.24],
          ].map(([x, y]) => (
            <mesh key={`${x}-${y}`} position={[x, y, 0.05]}>
              <boxGeometry args={[0.14, 0.1, 0.06]} />
              <meshStandardMaterial color="#14121a" roughness={0.7} />
            </mesh>
          ))}
        </group>
      )}

      {/* ================= Face avant imprimée ================= */}
      <mesh position={[0, 0, FRONT + 0.002]}>
        <planeGeometry args={[W - 0.09, H - 0.09]} />
        <meshPhysicalMaterial
          map={decal}
          roughness={0.55}
          clearcoat={0.12}
          clearcoatRoughness={0.4}
          envMapIntensity={0.28}
          transparent={translucent}
          opacity={translucent ? 0.72 : 1}
        />
      </mesh>

      {/* Objectif grand-angle 130°, nettement saillant */}
      <group position={[LENS_X, -0.02, FRONT]}>
        {/* Embase */}
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.29, 0.31, 0.06, 56]} />
          <meshStandardMaterial color="#17151c" roughness={0.4} metalness={0.35} />
        </mesh>
        {/* Fût strié */}
        <mesh position={[0, 0, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.25, 0.28, 0.08, 56]} />
          <meshStandardMaterial color="#100e15" roughness={0.32} metalness={0.5} />
        </mesh>
        {/* Bague avant */}
        <mesh position={[0, 0, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.22, 0.24, 0.05, 56]} />
          <meshStandardMaterial color="#26232e" roughness={0.25} metalness={0.7} />
        </mesh>
        {/* Lentille bombée, traitement violacé caractéristique */}
        <mesh position={[0, 0, 0.13]} rotation={[Math.PI / 2, 0, 0]}>
          <sphereGeometry args={[0.185, 44, 32, 0, Math.PI * 2, 0, Math.PI / 2.6]} />
          <meshPhysicalMaterial
            color="#120826"
            roughness={0.03}
            metalness={0.3}
            clearcoat={1}
            clearcoatRoughness={0}
            iridescence={0.55}
            iridescenceIOR={1.7}
            iridescenceThicknessRange={[240, 400]}
            envMapIntensity={0.45}
          />
        </mesh>
      </group>

      {/* Éclairage d'appoint (LED), à gauche de l'objectif */}
      <mesh position={[0.04, -0.28, FRONT + 0.006]}>
        <sphereGeometry args={[0.055, 20, 20]} />
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
        <meshStandardMaterial
          ref={screen}
          color="#0d1b3d"
          emissive="#4d8dff"
          emissiveIntensity={0.5}
          roughness={0.14}
          toneMapped={false}
        />
      </mesh>
      {/* Deux boutons de navigation, à gauche de l'écran */}
      {[0.14, -0.16].map((y) => (
        <mesh key={y} position={[-0.94, y, BACK - 0.02]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.055, 0.055, 0.035, 22]} />
          <meshStandardMaterial color={shade} roughness={0.45} />
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
