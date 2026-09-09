'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { colorways, type ColorwaySlug } from '@/content/product'

/**
 * Édition des coloris d'une ligne de panier.
 *
 * Se tromper de couleur au moment d'ajouter est fréquent, et repartir sur la
 * fiche produit pour corriger fait perdre la vente aussi souvent qu'elle la
 * sauve. Le panneau se déplie sous la ligne, sans quitter le panier.
 */
export function LineColorEditor({
  colorSlugs,
  onChange,
}: {
  colorSlugs: ColorwaySlug[]
  onChange: (next: ColorwaySlug[]) => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="mt-1">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft underline underline-offset-2 hover:text-ink"
      >
        {open ? 'Terminer' : 'Changer la couleur'}
        <motion.span animate={{ rotate: open ? 180 : 0 }} className="text-xs" aria-hidden>
          ▾
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-3 flex flex-col gap-3 rounded-[1.25rem] border-3 border-dashed border-ink/40 p-3">
              {colorSlugs.map((slug, index) => (
                <fieldset key={index} className="flex flex-col gap-2">
                  {colorSlugs.length > 1 && (
                    <legend className="font-display text-xs font-bold text-ink-soft">
                      Appareil {index + 1}
                    </legend>
                  )}
                  <div className="grid grid-cols-5 justify-items-center gap-2 sm:flex sm:flex-wrap">
                    {colorways.map((c) => {
                      const active = c.slug === slug
                      return (
                        <button
                          key={c.slug}
                          type="button"
                          role="radio"
                          aria-checked={active}
                          aria-label={c.name}
                          title={c.name}
                          onClick={() =>
                            onChange(colorSlugs.map((s, i) => (i === index ? c.slug : s)))
                          }
                          className={`size-9 rounded-full border-3 transition-transform hover:-translate-y-0.5 ${
                            active ? 'border-ink ring-3 ring-ink ring-offset-2' : 'border-ink/60'
                          }`}
                          style={{ backgroundColor: c.hex }}
                        />
                      )
                    })}
                  </div>
                </fieldset>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
