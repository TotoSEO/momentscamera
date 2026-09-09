/**
 * Illustration vectorielle de l'appareil.
 *
 * Reprend la silhouette réelle : plaquette horizontale, balayage rétro,
 * objectif décentré à droite, deux boutons sur la tranche haute et anneau
 * porte-clés sur le flanc gauche.
 *
 * Sert de vignette partout où charger la scène 3D serait absurde
 * (panier, états vides, favicon social). Le corps prend la couleur du
 * coloris sélectionné, comme le modèle 3D.
 */

const SWEEP = ['#2f4fb8', '#7b3fbf', '#e0459b', '#f2453d', '#f5842e', '#f7c02e']

export function CameraGlyph({
  className,
  bodyColor = '#ff4438',
  shadeColor,
  translucent = false,
  title,
}: {
  className?: string
  bodyColor?: string
  shadeColor?: string
  translucent?: boolean
  title?: string
}) {
  const shade = shadeColor ?? bodyColor
  const id = bodyColor.replace('#', '')

  return (
    <svg viewBox="0 0 128 68" className={className} role={title ? 'img' : 'presentation'} aria-hidden={!title}>
      {title && <title>{title}</title>}

      <defs>
        {/* Le balayage doit être coupé net par le bord du boîtier. */}
        <clipPath id={`body-${id}`}>
          <rect x="22" y="12" width="98" height="46" rx="9" />
        </clipPath>
      </defs>

      {/* Anneau porte-clés */}
      <circle cx="7" cy="31" r="5.5" fill="none" stroke="#14121a" strokeWidth="3" />
      <rect x="12" y="27" width="12" height="9" rx="3" fill={shade} stroke="#14121a" strokeWidth="3" />

      {/* Boutons sur la tranche supérieure */}
      <rect x="52" y="6" width="10" height="8" rx="3" fill="#14121a" />
      <rect x="68" y="6" width="10" height="8" rx="3" fill="#14121a" />

      {/* Coque */}
      <rect
        x="22"
        y="12"
        width="98"
        height="46"
        rx="9"
        fill={bodyColor}
        fillOpacity={translucent ? 0.5 : 1}
        stroke="#14121a"
        strokeWidth="3"
      />

      {/* Balayage rétro */}
      <g clipPath={`url(#body-${id})`}>
        {SWEEP.map((color, i) => (
          <path
            key={color}
            d={`M18 ${64 - i * 5} Q 60 ${34 - i * 4} 126 ${44 - i * 3}`}
            fill="none"
            stroke={color}
            strokeWidth="4.5"
            opacity={translucent ? 0.75 : 1}
          />
        ))}
      </g>

      {/* Fenêtre de visée + fente micro */}
      <rect x="106" y="17" width="9" height="6" rx="1.5" fill="#14121a" />
      <rect x="28" y="24" width="10" height="3" rx="1.5" fill="#14121a" />

      {/* Objectif, décentré vers la droite */}
      <circle cx="84" cy="36" r="14" fill="#14121a" />
      <circle cx="84" cy="36" r="10" fill="#26232e" stroke="#14121a" strokeWidth="1.5" />
      <circle cx="84" cy="36" r="6" fill="#1a0d3a" />
      <circle cx="80.5" cy="32.5" r="2.4" fill="#ffffff" fillOpacity="0.85" />

      {/* LED d'appoint */}
      <circle cx="62" cy="45" r="2.8" fill="#ffd426" stroke="#14121a" strokeWidth="2" />

      {/* Contour redessiné par-dessus le balayage */}
      <rect x="22" y="12" width="98" height="46" rx="9" fill="none" stroke="#14121a" strokeWidth="3" />
    </svg>
  )
}
