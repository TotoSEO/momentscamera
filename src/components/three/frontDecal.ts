import * as THREE from 'three'
import type { Colorway, PrintStyle } from '@/content/product'

/**
 * Habillage imprimé de la façade, dessiné sur un canvas puis appliqué
 * en texture sur le modèle 3D.
 *
 * Chaque coloris a SA sérigraphie — le fabricant ne recolore pas un motif
 * unique. Les neuf routines ci-dessous reprennent une à une les
 * compositions relevées sur les visuels produit : palette, motifs, position
 * des mentions.
 *
 * ── Remplacer par les fichiers d'impression du fournisseur ──
 * Ces motifs sont redessinés au vecteur d'après des photos en 3/4 : la
 * perspective interdit toute mesure au pixel. Le jour où vous obtenez les
 * fichiers à plat, déposez-les dans `public/prints/<slug>.png` (format
 * 1024 × 420) : ils seront utilisés automatiquement à la place du dessin,
 * sans toucher au code. Voir docs/MEDIAS.md.
 */

const TEX_W = 1024
const TEX_H = 420

/* -------------------------------------------------------------------------- */
/*  Point d'entrée                                                             */
/* -------------------------------------------------------------------------- */

export function createFrontDecal(colorway: Colorway): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = TEX_W
  canvas.height = TEX_H

  const ctx = canvas.getContext('2d')
  if (!ctx) return new THREE.CanvasTexture(canvas)

  // Fond : la couleur du boîtier. Sur le modèle translucide on ne peint
  // rien — le canvas reste transparent, et seuls les motifs sont opaques,
  // pour que l'électronique se voie au travers comme sur le vrai produit.
  if (!colorway.translucent) {
    ctx.fillStyle = colorway.hex
    ctx.fillRect(0, 0, TEX_W, TEX_H)
  }

  ctx.save()
  ctx.beginPath()
  ctx.rect(0, 0, TEX_W, TEX_H)
  ctx.clip()
  PRINTS[colorway.print](ctx, colorway)
  ctx.restore()

  // Éléments physiques, identiques sur tous les boîtiers.
  drawHardware(ctx)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8
  texture.needsUpdate = true
  return texture
}

/**
 * Charge un fichier d'impression fourni par le fabricant, s'il existe.
 * Renvoie `null` sinon — l'appelant retombe alors sur le dessin vectoriel.
 */
export function loadPrintImage(slug: string, basePath = ''): Promise<THREE.CanvasTexture | null> {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = TEX_W
      canvas.height = TEX_H
      const ctx = canvas.getContext('2d')
      if (!ctx) return resolve(null)
      ctx.drawImage(img, 0, 0, TEX_W, TEX_H)
      const texture = new THREE.CanvasTexture(canvas)
      texture.colorSpace = THREE.SRGBColorSpace
      texture.anisotropy = 8
      resolve(texture)
    }
    img.onerror = () => resolve(null)
    img.src = `${basePath}/prints/${slug}.png`
  })
}

type PrintRenderer = (ctx: CanvasRenderingContext2D, colorway: Colorway) => void

/* -------------------------------------------------------------------------- */
/*  1. Rouge — énorme « CAMERA »                                               */
/* -------------------------------------------------------------------------- */

const wordmark: PrintRenderer = (ctx) => {
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 62px "Arial Black", "Trebuchet MS", sans-serif'
  ctx.fillText('THUMB', 56, 152)

  // Le mot déborde volontairement : sur le produit il touche les deux bords.
  ctx.font = 'bold 208px "Arial Black", "Trebuchet MS", sans-serif'
  ctx.letterSpacing = '-4px'
  ctx.fillText('CAMERA', 42, 340)
  ctx.letterSpacing = '0px'

  // Grille haut-parleur : quatre traits, à gauche de la fenêtre de visée.
  ctx.fillStyle = '#ffffff'
  for (let i = 0; i < 4; i++) ctx.fillRect(TEX_W - 236, 52 + i * 13, 62, 6)
}

/* -------------------------------------------------------------------------- */
/*  2. Jaune — bandes arc-en-ciel horizontales + swoosh                        */
/* -------------------------------------------------------------------------- */

const RAINBOW = ['#1b3a8f', '#3f3fa8', '#7b3f9e', '#c93f8a', '#e0403f', '#ef6b2b', '#f5a623']

const rainbowBands: PrintRenderer = (ctx, colorway) => {
  const top = 150
  const bandH = (TEX_H - top) / RAINBOW.length

  RAINBOW.forEach((color, i) => {
    ctx.fillStyle = color
    ctx.fillRect(0, top + i * bandH, TEX_W, bandH + 1)
  })

  // Le swoosh : une courbe de la couleur du boîtier qui entaille les bandes.
  ctx.strokeStyle = colorway.hex
  ctx.lineWidth = 16
  ctx.beginPath()
  ctx.moveTo(238, TEX_H + 20)
  ctx.bezierCurveTo(232, 300, 290, 190, 470, 168)
  ctx.stroke()
  ctx.fillStyle = colorway.hex
  ctx.beginPath()
  ctx.moveTo(0, top)
  ctx.lineTo(250, top)
  ctx.bezierCurveTo(180, 230, 160, 320, 168, TEX_H)
  ctx.lineTo(0, TEX_H)
  ctx.closePath()
  ctx.fill()

  brand(ctx, { x: 452, y: 126, mark: '#d5342b', sub: '#2c2c2c' })
  year(ctx, { x: TEX_W - 262, y: 312, color: '#ffffff', size: 82 })
}

/* -------------------------------------------------------------------------- */
/*  3. Bleu — bandeau de formes géométriques                                   */
/* -------------------------------------------------------------------------- */

const geoBand: PrintRenderer = (ctx) => {
  const top = 196
  const h = TEX_H - top

  ctx.fillStyle = '#3b6fd4'
  ctx.fillRect(0, top, TEX_W, h)

  // Liserés cyan en haut et en bas du bandeau.
  ctx.fillStyle = '#4cc9e8'
  ctx.fillRect(0, top, TEX_W, 7)
  ctx.fillRect(0, top + 16, TEX_W, 4)
  ctx.fillRect(0, TEX_H - 22, TEX_W, 5)

  const shapes: Array<[string, () => void]> = [
    ['#f5c542', () => triangle(ctx, 250, TEX_H - 26, 92, -96)],
    ['#e0403f', () => triangle(ctx, 372, TEX_H - 26, 78, -78)],
    ['#4cc9e8', () => circle(ctx, 214, 300, 26)],
    ['#f5f2ea', () => triangle(ctx, 470, top + 30, 70, 84)],
    ['#e0403f', () => ctx.fillRect(690, 250, 96, 60)],
    ['#f5c542', () => triangle(ctx, 800, TEX_H - 26, 104, -104)],
    ['#1b3577', () => circle(ctx, 916, 268, 22)],
    ['#4cc9e8', () => {
      ctx.beginPath()
      ctx.arc(560, TEX_H - 26, 62, Math.PI, 0)
      ctx.closePath()
      ctx.fill()
    }],
  ]
  for (const [color, draw] of shapes) {
    ctx.fillStyle = color
    draw()
  }

  // Petits points blancs, motif récurrent du boîtier bleu.
  ctx.fillStyle = '#1b3577'
  dots(ctx, 636, 268, 3, 2, 16, 5)

  ctx.fillStyle = '#f5c542'
  ctx.font = 'bold 62px "Arial Black", "Trebuchet MS", sans-serif'
  ctx.fillText('CAMERA', 44, 296)
  ctx.strokeStyle = '#f5f2ea'
  ctx.lineWidth = 3
  ctx.font = 'bold 48px "Arial Black", "Trebuchet MS", sans-serif'
  ctx.strokeText('THUMB', 62, 348)

  brand(ctx, { x: 404, y: 116, mark: '#f5c542', sub: '#f5f2ea', stacked: true })
  year(ctx, { x: TEX_W - 306, y: 380, color: '#f5c542', size: 70 })
}

/* -------------------------------------------------------------------------- */
/*  4. Turquoise — lettres évidées et portraits au trait                       */
/* -------------------------------------------------------------------------- */

const lineartFaces: PrintRenderer = (ctx) => {
  const palette = ['#e8e2d4', '#e8792b', '#2f5c8f', '#e8c34a', '#c8402f', '#8fb0a8']

  // Grandes lettres « CAMERA » remplies de aplats, puis surchargées de traits.
  ctx.save()
  ctx.font = 'bold 300px "Arial Black", "Trebuchet MS", sans-serif'
  ctx.letterSpacing = '-10px'
  const text = 'CAMERA'
  ctx.beginPath()
  // Le tracé du texte sert de masque aux aplats.
  const metrics = ctx.measureText(text)
  const scale = Math.min(1, (TEX_W + 120) / metrics.width)
  ctx.translate(-40, 0)
  ctx.scale(scale, 1)
  ctx.rect(0, 0, TEX_W / scale + 200, TEX_H)
  ctx.clip()

  ctx.fillStyle = '#e8e2d4'
  ctx.fillText(text, 0, 400)

  // Aplats colorés à l'intérieur des lettres.
  ctx.globalCompositeOperation = 'source-atop'
  palette.forEach((color, i) => {
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(120 + i * 190, 210 + (i % 3) * 60, 120, 0, Math.PI * 2)
    ctx.fill()
  })
  ctx.globalCompositeOperation = 'source-over'
  ctx.restore()

  // Portraits au trait continu, par-dessus l'ensemble.
  ctx.strokeStyle = '#1f3c38'
  ctx.lineWidth = 3.5
  ctx.lineCap = 'round'
  for (let i = 0; i < 5; i++) {
    const x = 90 + i * 200
    ctx.beginPath()
    ctx.moveTo(x, 380)
    ctx.bezierCurveTo(x - 40, 300, x + 10, 250, x + 46, 216)
    ctx.bezierCurveTo(x + 92, 176, x + 60, 118, x + 8, 132)
    ctx.bezierCurveTo(x - 34, 144, x - 26, 200, x + 18, 214)
    ctx.bezierCurveTo(x + 62, 228, x + 40, 300, x + 74, 380)
    ctx.stroke()
  }
  ctx.lineWidth = 1

  brand(ctx, { x: 404, y: 120, mark: '#f0a92e', sub: '#f0a92e', stacked: true })
  year(ctx, { x: 726, y: 150, color: '#1f3c38', size: 72 })
}

/* -------------------------------------------------------------------------- */
/*  5. Vert — Memphis années 80                                                */
/* -------------------------------------------------------------------------- */

const memphis80s: PrintRenderer = (ctx) => {
  const cyan = '#3fc5e0'
  const pink = '#e8367a'
  const yellow = '#f2d23a'
  const blue = '#2f6fd0'
  const purple = '#8b3fc9'

  // Zigzag cyan, en haut à gauche.
  zigzag(ctx, cyan, 40, 250, 7, 46, 34, 14)
  // Zigzag magenta, au milieu.
  zigzag(ctx, pink, 40, 318, 8, 44, 30, 13)

  // Damiers jaunes à pois.
  ctx.fillStyle = yellow
  ctx.fillRect(300, 148, 96, 96)
  ctx.fillStyle = '#6aa334'
  dots(ctx, 314, 166, 4, 4, 22, 5)
  ctx.fillStyle = yellow
  ctx.fillRect(430, 178, 72, 72)

  // Grand quart de cercle cyan à pois.
  ctx.fillStyle = cyan
  ctx.beginPath()
  ctx.moveTo(640, TEX_H)
  ctx.lineTo(830, TEX_H)
  ctx.lineTo(640, 232)
  ctx.closePath()
  ctx.fill()
  ctx.fillStyle = blue
  dots(ctx, 676, 320, 3, 3, 24, 6)

  // Chevrons bleus.
  ctx.fillStyle = blue
  for (let i = 0; i < 3; i++) {
    ctx.save()
    ctx.translate(220 + i * 46, 352)
    ctx.rotate(-0.5)
    ctx.fillRect(0, 0, 46, 18)
    ctx.restore()
  }

  // Disque « pac-man » jaune, à droite.
  ctx.fillStyle = yellow
  ctx.beginPath()
  ctx.moveTo(902, 336)
  ctx.arc(902, 336, 74, -0.5, Math.PI * 1.35)
  ctx.closePath()
  ctx.fill()

  // Barres violette et magenta.
  ctx.fillStyle = purple
  ctx.fillRect(560, 300, 132, 20)
  ctx.fillStyle = pink
  ctx.fillRect(560, 328, 96, 14)

  // Demi-disque cyan, coin haut gauche.
  ctx.fillStyle = cyan
  ctx.beginPath()
  ctx.arc(96, 176, 82, Math.PI / 2, -Math.PI / 2, true)
  ctx.closePath()
  ctx.fill()

  brand(ctx, { x: 372, y: 124, mark: '#7b2fbf', sub: '#243018' })
}

/* -------------------------------------------------------------------------- */
/*  6. Gris — synthwave                                                        */
/* -------------------------------------------------------------------------- */

const synthwave: PrintRenderer = (ctx) => {
  const top = 170
  const gradient = ctx.createLinearGradient(0, top, 0, TEX_H)
  gradient.addColorStop(0, '#2b2fb0')
  gradient.addColorStop(0.35, '#8b2fc0')
  gradient.addColorStop(0.62, '#e0357f')
  gradient.addColorStop(0.85, '#f27b3a')
  gradient.addColorStop(1, '#f5d23a')
  ctx.fillStyle = gradient
  ctx.fillRect(0, top, TEX_W, TEX_H - top)

  // Lignes de fuite horizontales, resserrées vers le haut.
  ctx.strokeStyle = 'rgba(255,255,255,0.32)'
  for (let i = 0; i < 16; i++) {
    const y = top + Math.pow(i / 16, 1.7) * (TEX_H - top)
    ctx.lineWidth = 1 + (i / 16) * 3
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(TEX_W, y)
    ctx.stroke()
  }
  ctx.lineWidth = 1

  // « 1984 » évidé, à gauche.
  ctx.strokeStyle = '#f5f0e6'
  ctx.lineWidth = 5
  ctx.font = 'bold 120px "Arial Black", "Trebuchet MS", sans-serif'
  ctx.strokeText('1984', 54, 356)
  ctx.lineWidth = 1

  // Cassette stylisée, à droite.
  ctx.strokeStyle = '#f5f0e6'
  ctx.lineWidth = 5
  roundRect(ctx, TEX_W - 262, 258, 146, 92, 10)
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(TEX_W - 218, 300, 17, 0, Math.PI * 2)
  ctx.moveTo(TEX_W - 143, 300)
  ctx.arc(TEX_W - 160, 300, 17, 0, Math.PI * 2)
  ctx.stroke()
  ctx.lineWidth = 1

  brand(ctx, { x: 372, y: 124, mark: '#e0357f', sub: '#3c3c40' })
}

/* -------------------------------------------------------------------------- */
/*  7. Crème — Bauhaus                                                         */
/* -------------------------------------------------------------------------- */

const bauhaus: PrintRenderer = (ctx) => {
  const red = '#e0342c'
  const teal = '#1c93a8'
  const orange = '#ef8a2b'
  const navy = '#22506b'

  // Grand demi-disque rouge, à gauche.
  ctx.fillStyle = red
  ctx.beginPath()
  ctx.arc(196, 200, 152, 0, Math.PI)
  ctx.closePath()
  ctx.fill()

  // Petit quart turquoise dessous.
  ctx.fillStyle = teal
  ctx.beginPath()
  ctx.arc(140, TEX_H - 8, 84, Math.PI, Math.PI * 1.5)
  ctx.closePath()
  ctx.fill()

  // Arcs concentriques orange et bleu.
  ctx.lineWidth = 34
  ctx.strokeStyle = orange
  ctx.beginPath()
  ctx.arc(430, TEX_H, 168, Math.PI, Math.PI * 1.55)
  ctx.stroke()
  ctx.strokeStyle = navy
  ctx.beginPath()
  ctx.arc(430, TEX_H, 122, Math.PI, Math.PI * 1.6)
  ctx.stroke()
  ctx.lineWidth = 1

  // Rectangles.
  ctx.fillStyle = navy
  ctx.fillRect(392, 286, 94, 82)
  ctx.fillStyle = orange
  ctx.fillRect(680, 208, 44, 160)
  ctx.fillStyle = red
  ctx.fillRect(740, 208, 58, 160)
  ctx.fillStyle = navy
  ctx.fillRect(812, 236, 54, 132)
  ctx.fillStyle = teal
  ctx.fillRect(878, 208, 62, 160)

  // Demi-disque orange, à droite.
  ctx.fillStyle = orange
  ctx.beginPath()
  ctx.arc(612, 300, 66, -Math.PI / 2, Math.PI / 2)
  ctx.closePath()
  ctx.fill()

  brand(ctx, { x: 404, y: 118, mark: '#3c3c40', sub: '#3c3c40', stacked: true })
  year(ctx, { x: 748, y: 142, color: '#22506b', size: 76 })
}

/* -------------------------------------------------------------------------- */
/*  8. Noir — formes tramées                                                   */
/* -------------------------------------------------------------------------- */

const cosmicDots: PrintRenderer = (ctx) => {
  // Grand disque cyan mordu par un arc jaune, en bas à droite.
  ctx.fillStyle = '#f2c230'
  ctx.beginPath()
  ctx.arc(796, TEX_H - 6, 176, Math.PI, 0)
  ctx.closePath()
  ctx.fill()
  ctx.fillStyle = '#2fa8e0'
  ctx.beginPath()
  ctx.arc(760, TEX_H + 10, 150, Math.PI, 0)
  ctx.closePath()
  ctx.fill()

  // Demi-disque rouge tramé, en haut à gauche.
  ctx.fillStyle = '#d8342c'
  ctx.beginPath()
  ctx.arc(268, 244, 82, Math.PI, 0)
  ctx.closePath()
  ctx.fill()
  ctx.fillStyle = '#1a1a1c'
  dots(ctx, 214, 176, 8, 3, 14, 3)

  // Groupes de lignes cyan.
  ctx.fillStyle = '#2fa8e0'
  for (let i = 0; i < 6; i++) ctx.fillRect(430, 190 + i * 15, 210 - i * 22, 7)
  for (let i = 0; i < 5; i++) ctx.fillRect(56, 310 + i * 15, 132, 7)

  // Coin jaune tramé, en haut à gauche.
  ctx.fillStyle = '#f2c230'
  triangle(ctx, 56, 128, 130, 74)

  // Éclats.
  ctx.fillStyle = '#d8342c'
  circle(ctx, 486, 152, 6)
  circle(ctx, 618, 176, 5)
  ctx.fillStyle = '#f2c230'
  circle(ctx, 372, 300, 7)

  ctx.fillStyle = '#ef8a2b'
  ctx.font = 'bold 30px "Trebuchet MS", system-ui, sans-serif'
  ctx.fillText('THUMB CAMERA', 60, 288)
}

/* -------------------------------------------------------------------------- */
/*  9. Transparent — Memphis clair                                             */
/* -------------------------------------------------------------------------- */

const memphisClear: PrintRenderer = (ctx) => {
  // L'électronique est peinte dans la texture plutôt que modélisée derrière
  // la coque : le tri de transparence de three.js rend un objet opaque
  // placé derrière deux surfaces translucides très peu fiable, alors que
  // le résultat visuel attendu — voir le circuit à travers le boîtier — est
  // ici obtenu de façon déterministe.
  drawInternals(ctx)

  const red = '#e8455a'
  const teal = '#17a0a0'
  const yellow = '#f5c542'
  const green = '#3aa655'
  const blue = '#2e86c8'
  const cream = '#e8e0d2'

  const tri: Array<[string, number, number, number, number]> = [
    [red, 46, 366, 108, -104],
    [cream, 150, 366, 92, -92],
    [yellow, 232, 366, 96, -96],
    [teal, 322, 262, 82, 82],
    [red, 336, 366, 88, -88],
    [green, 420, 366, 74, -74],
    [blue, 96, 262, 68, 68],
    [yellow, 806, 366, 96, -96],
    [red, 900, 366, 82, -82],
    [teal, 730, 300, 64, 64],
  ]
  for (const [color, x, y, w, h] of tri) {
    ctx.fillStyle = color
    triangle(ctx, x, y, w, h)
  }

  // Trames de points, signature du boîtier transparent.
  ctx.fillStyle = teal
  dots(ctx, 66, 274, 6, 3, 12, 3)
  ctx.fillStyle = red
  dots(ctx, 470, 300, 5, 4, 13, 3)
  ctx.fillStyle = green
  dots(ctx, 860, 250, 4, 3, 13, 3)

  // Peignes colorés à gauche du mot.
  const comb = [yellow, red, blue, teal, yellow, green]
  comb.forEach((color, i) => {
    ctx.strokeStyle = color
    ctx.lineWidth = 4
    const x = 470 + i * 26
    ctx.beginPath()
    for (let k = 0; k < 5; k++) {
      ctx.moveTo(x + k * 4, 150)
      ctx.lineTo(x + k * 4, 194)
    }
    ctx.stroke()
  })
  ctx.lineWidth = 1

  ctx.fillStyle = '#f5a623'
  ctx.font = 'bold 64px "Arial Black", "Trebuchet MS", sans-serif'
  ctx.fillText('CAMERA', 646, 198)

  ctx.fillStyle = '#f5f2ea'
  ctx.font = 'bold 30px "Trebuchet MS", system-ui, sans-serif'
  ctx.fillText('Record Anytime Anywhere', 470, 240)

  ctx.fillStyle = '#e8455a'
  circle(ctx, 968, 176, 20)
}


/** Circuit imprimé, batterie et composants, vus par transparence. */
function drawInternals(ctx: CanvasRenderingContext2D) {
  ctx.save()
  ctx.globalAlpha = 0.5

  // Carte verte.
  ctx.fillStyle = '#2f7f5c'
  roundRect(ctx, 92, 108, TEX_W - 250, 262, 10)
  ctx.fill()

  // Pistes.
  ctx.strokeStyle = '#8fbfa4'
  ctx.lineWidth = 3
  for (let i = 0; i < 7; i++) {
    ctx.beginPath()
    ctx.moveTo(120, 140 + i * 32)
    ctx.lineTo(120 + 140 + (i % 3) * 90, 140 + i * 32)
    ctx.lineTo(120 + 200 + (i % 3) * 90, 172 + i * 32)
    ctx.stroke()
  }
  ctx.lineWidth = 1

  // Batterie, à gauche.
  ctx.fillStyle = '#c9c4b8'
  roundRect(ctx, 96, 140, 176, 200, 12)
  ctx.fill()
  ctx.fillStyle = '#8f8a80'
  ctx.fillRect(96, 300, 176, 14)

  // Composants.
  ctx.fillStyle = '#1f2a24'
  for (const [x, y, w, h] of [
    [520, 150, 90, 62],
    [660, 228, 62, 44],
    [790, 152, 54, 40],
  ] as Array<[number, number, number, number]>) {
    roundRect(ctx, x, y, w, h, 5)
    ctx.fill()
  }

  // Bobine cuivrée.
  ctx.strokeStyle = '#c98a3a'
  ctx.lineWidth = 5
  ctx.beginPath()
  ctx.arc(742, 322, 26, 0, Math.PI * 2)
  ctx.stroke()
  ctx.lineWidth = 1

  ctx.restore()
}

const PRINTS: Record<PrintStyle, PrintRenderer> = {
  'wordmark': wordmark,
  'rainbow-bands': rainbowBands,
  'geo-band': geoBand,
  'lineart-faces': lineartFaces,
  'memphis-80s': memphis80s,
  'synthwave': synthwave,
  'bauhaus': bauhaus,
  'cosmic-dots': cosmicDots,
  'memphis-clear': memphisClear,
}

/* -------------------------------------------------------------------------- */
/*  Blocs partagés                                                             */
/* -------------------------------------------------------------------------- */

/**
 * « THUMB CAMERA » et sa baseline.
 *
 * Deux dispositions coexistent sur les visuels : soit le mot sur deux
 * lignes avec la baseline posée à droite, soit le mot sur une seule ligne
 * avec la baseline dessous.
 */
function brand(
  ctx: CanvasRenderingContext2D,
  {
    x,
    y,
    mark,
    sub,
    stacked = false,
  }: { x: number; y: number; mark: string; sub: string; stacked?: boolean },
) {
  ctx.fillStyle = mark

  if (stacked) {
    ctx.font = 'bold 34px "Arial Black", "Trebuchet MS", sans-serif'
    ctx.fillText('THUMB CAMERA', x, y - 32)
    ctx.fillStyle = sub
    ctx.font = '27px "Trebuchet MS", system-ui, sans-serif'
    ctx.fillText('Record Anytime Anywhere', x, y + 4)
    return
  }

  ctx.font = 'bold 26px "Trebuchet MS", system-ui, sans-serif'
  ctx.fillText('THUMB', x, y - 32)
  ctx.font = 'bold 38px "Arial Black", "Trebuchet MS", sans-serif'
  ctx.fillText('CAMERA', x, y)

  ctx.fillStyle = sub
  ctx.font = '28px "Trebuchet MS", system-ui, sans-serif'
  ctx.fillText('Record Anytime Anywhere', x + 210, y - 2)
}

/** « 1984 », dans une graisse et une position propres à chaque boîtier. */
function year(
  ctx: CanvasRenderingContext2D,
  { x, y, color, size }: { x: number; y: number; color: string; size: number },
) {
  ctx.fillStyle = color
  ctx.font = `bold ${size}px "Arial Black", "Trebuchet MS", sans-serif`
  ctx.fillText('1984', x, y)
}

/** Fenêtre de visée et fente micro : présentes sur tous les boîtiers. */
function drawHardware(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = '#14121a'
  roundRect(ctx, TEX_W - 132, 46, 96, 62, 8)
  ctx.fill()
  roundRect(ctx, 118, 62, 96, 20, 10)
  ctx.fill()
}

/* -------------------------------------------------------------------------- */
/*  Primitives                                                                 */
/* -------------------------------------------------------------------------- */

function triangle(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.lineTo(x + w, y)
  ctx.lineTo(x + w / 2, y + h)
  ctx.closePath()
  ctx.fill()
}

function circle(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.beginPath()
  ctx.arc(x, y, r, 0, Math.PI * 2)
  ctx.fill()
}

function dots(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  cols: number,
  rows: number,
  step: number,
  r: number,
) {
  for (let c = 0; c < cols; c++) {
    for (let rw = 0; rw < rows; rw++) {
      ctx.beginPath()
      ctx.arc(x + c * step, y + rw * step, r, 0, Math.PI * 2)
      ctx.fill()
    }
  }
}

function zigzag(
  ctx: CanvasRenderingContext2D,
  color: string,
  x: number,
  y: number,
  teeth: number,
  w: number,
  h: number,
  thickness: number,
) {
  ctx.strokeStyle = color
  ctx.lineWidth = thickness
  ctx.lineJoin = 'miter'
  ctx.beginPath()
  ctx.moveTo(x, y)
  for (let i = 0; i < teeth; i++) {
    ctx.lineTo(x + i * w + w / 2, y - h)
    ctx.lineTo(x + (i + 1) * w, y)
  }
  ctx.stroke()
  ctx.lineWidth = 1
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
