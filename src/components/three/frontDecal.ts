import * as THREE from 'three'
import type { Colorway } from '@/content/product'

/**
 * Habillage de la face avant, dessiné sur un canvas puis appliqué en texture.
 *
 * Le produit tire son identité de son graphisme : les arcs arc-en-ciel
 * rétro, la mention « THUMB CAMERA / Record Anytime Anywhere » et le gros
 * « 1984 ». Le générer en 2D plutôt qu'en géométrie coûte quelques
 * kilo-octets de mémoire et zéro octet de réseau, et se recolore
 * instantanément pour les neuf coloris.
 */

/** Palette des arcs, reprise du produit (bleu → violet → rose → rouge → orange). */
const ARC_COLORS = ['#2f4fb8', '#4a3fbf', '#7b3fbf', '#e0459b', '#f2453d', '#f5842e', '#f7c02e']

const TEX_W = 1024
const TEX_H = 420

export function createFrontDecal(colorway: Colorway): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = TEX_W
  canvas.height = TEX_H

  const ctx = canvas.getContext('2d')
  if (!ctx) return new THREE.CanvasTexture(canvas)

  const light = isLight(colorway.hex)
  const ink = light ? '#14121a' : '#ffffff'

  // --- Fond : la couleur du boîtier ---
  ctx.fillStyle = colorway.translucent ? '#eef7ff' : colorway.hex
  ctx.fillRect(0, 0, TEX_W, TEX_H)

  // --- Balayage rétro : le motif signature, d'un bord à l'autre ---
  // Des courbes de Bézier plutôt que des arcs de cercle : on maîtrise
  // exactement où la bande entre et où elle sort du cadre.
  ctx.save()
  ctx.beginPath()
  ctx.rect(0, 0, TEX_W, TEX_H)
  ctx.clip()
  ctx.lineCap = 'butt'

  ARC_COLORS.forEach((color, i) => {
    const offset = i * 27
    ctx.beginPath()
    ctx.strokeStyle = color
    ctx.lineWidth = 26
    ctx.moveTo(-30, TEX_H + 60 - offset)
    ctx.quadraticCurveTo(TEX_W * 0.34, TEX_H * 0.42 - offset * 0.75, TEX_W + 40, TEX_H * 0.66 - offset * 0.55)
    ctx.stroke()
  })
  ctx.restore()

  // --- Mentions imprimées ---
  // « CAMERA » est accentué : il doit rester lisible sur les neuf coloris,
  // donc jamais dans une teinte proche de celle du boîtier.
  const accent = light ? '#f2453d' : '#ffffff'

  ctx.fillStyle = ink
  ctx.font = 'bold 38px "Trebuchet MS", system-ui, sans-serif'
  ctx.fillText('THUMB', 56, 74)
  ctx.fillStyle = accent
  ctx.font = 'bold 46px "Trebuchet MS", system-ui, sans-serif'
  ctx.fillText('CAMERA', 56, 122)

  ctx.fillStyle = ink
  ctx.font = '23px "Trebuchet MS", system-ui, sans-serif'
  ctx.fillText('Record Anytime Anywhere', 262, 74)

  // « 1984 » : la référence rétro, calée entre l'objectif et le bord droit,
  // sous la fenêtre de visée pour ne rien recouvrir.
  ctx.font = 'bold 78px "Trebuchet MS", system-ui, sans-serif'
  ctx.fillStyle = light ? '#2f4fb8' : '#f4f1e8'
  ctx.fillText('1984', TEX_W - 232, 258)

  // --- Fenêtre de visée (rectangle noir, en haut à droite) ---
  roundRect(ctx, TEX_W - 128, 44, 92, 60, 10)
  ctx.fillStyle = '#14121a'
  ctx.fill()

  // --- Fente micro (en haut à gauche) ---
  roundRect(ctx, 56, 158, 92, 21, 10)
  ctx.fillStyle = '#14121a'
  ctx.fill()

  // --- Grille haut-parleur (points, sous « 1984 ») ---
  ctx.fillStyle = ink
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      ctx.beginPath()
      ctx.arc(TEX_W - 196 + col * 17, 296 + row * 17, 3.6, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8
  texture.needsUpdate = true
  return texture
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

/** Luminance perçue : décide si le texte imprimé doit être noir ou blanc. */
function isLight(hex: string): boolean {
  const value = hex.replace('#', '')
  const r = parseInt(value.slice(0, 2), 16) / 255
  const g = parseInt(value.slice(2, 4), 16) / 255
  const b = parseInt(value.slice(4, 6), 16) / 255
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.55
}
