'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/cn'
import { CameraGlyph } from '@/components/ui/CameraGlyph'

/**
 * Cadre vidéo « bubble », prêt pour les vidéos animées à venir.
 *
 * Sans `src`, il affiche un emplacement décoratif : la page a déjà sa
 * composition finale, il suffira de déposer les fichiers dans /public/videos
 * et de renseigner `src` (voir docs/MEDIAS.md).
 *
 * La lecture ne démarre que lorsque le bloc est visible — une vidéo en
 * autoplay hors écran coûte de la bande passante et de la batterie pour rien.
 */
export function VideoBlock({
  src,
  poster,
  caption,
  className,
  tone = 'yellow',
  ratio = 'aspect-[4/5]',
}: {
  src?: string
  poster?: string
  caption?: string
  className?: string
  tone?: 'yellow' | 'red' | 'blue' | 'green' | 'lime'
  ratio?: string
}) {
  const ref = useRef<HTMLVideoElement>(null)
  const [wrapper, setWrapper] = useState<HTMLDivElement | null>(null)
  const [inView, setInView] = useState(false)

  const tones = {
    yellow: 'bg-pop-yellow',
    red: 'bg-pop-red',
    blue: 'bg-pop-blue',
    green: 'bg-pop-green',
    lime: 'bg-pop-lime',
  }

  useEffect(() => {
    if (!wrapper) return
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.25,
    })
    observer.observe(wrapper)
    return () => observer.disconnect()
  }, [wrapper])

  useEffect(() => {
    const video = ref.current
    if (!video || !src) return
    if (inView) void video.play().catch(() => {})
    else video.pause()
  }, [inView, src])

  return (
    <figure className={cn('flex flex-col gap-3', className)}>
      <div
        ref={setWrapper}
        className={cn(
          'relative overflow-hidden rounded-[2rem] border-3 border-ink shadow-pop',
          ratio,
          tones[tone],
        )}
      >
        {src ? (
          <video
            ref={ref}
            src={src}
            poster={poster}
            muted
            loop
            playsInline
            preload="none"
            className="size-full object-cover"
          />
        ) : (
          <div className="grid size-full place-items-center gap-3 p-6 text-center">
            <div>
              <div className="animate-wiggle mx-auto w-fit">
                <CameraGlyph className="w-24 opacity-70" bodyColor="#fffdf8" shadeColor="#14121a" />
              </div>
              <p className="mt-4 font-display text-sm font-bold opacity-70">Emplacement vidéo</p>
            </div>
          </div>
        )}
      </div>
      {caption && <figcaption className="text-center text-sm text-ink-soft">{caption}</figcaption>}
    </figure>
  )
}
