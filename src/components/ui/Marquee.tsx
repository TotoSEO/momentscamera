import { cn } from '@/lib/cn'

/**
 * Bandeau défilant en CSS pur (pas de JS, pas de reflow).
 * Le contenu est dupliqué et la translation s'arrête à -50 % :
 * la boucle est donc parfaitement continue.
 */
export function Marquee({
  items,
  className,
  duration = '30s',
  separator = '✦',
}: {
  items: string[]
  className?: string
  duration?: string
  separator?: string
}) {
  const track = [...items, ...items]

  return (
    <div className={cn('overflow-hidden border-y-3 border-ink py-3.5', className)} aria-hidden>
      <div
        className="animate-marquee flex w-max items-center gap-8 whitespace-nowrap"
        style={{ ['--marquee-duration' as string]: duration }}
      >
        {track.map((item, i) => (
          <span key={i} className="flex items-center gap-8 font-display text-lg font-bold tracking-wide md:text-xl">
            {item}
            <span className="text-pop-red">{separator}</span>
          </span>
        ))}
      </div>
    </div>
  )
}
