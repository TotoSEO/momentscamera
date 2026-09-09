import { cn } from '@/lib/cn'

const tones = {
  red: 'bg-pop-red text-white',
  yellow: 'bg-pop-yellow text-ink',
  blue: 'bg-pop-blue text-white',
  green: 'bg-pop-green text-ink',
  lime: 'bg-pop-lime text-ink',
  cream: 'bg-paper text-ink',
  ink: 'bg-ink text-cream',
} as const

export type BadgeTone = keyof typeof tones

export function Badge({
  children,
  tone = 'yellow',
  className,
}: {
  children: React.ReactNode
  tone?: BadgeTone
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border-3 border-ink px-4 py-1.5 font-display text-sm font-bold whitespace-nowrap',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

/** Pastille « autocollant » légèrement inclinée, posée sur une carte. */
export function Sticker({
  children,
  tone = 'red',
  className,
}: {
  children: React.ReactNode
  tone?: BadgeTone
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex -rotate-3 items-center rounded-full border-3 border-ink px-4 py-1.5 font-display text-sm font-bold shadow-pop-sm',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
