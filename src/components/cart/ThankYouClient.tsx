'use client'

import { useEffect } from 'react'
import { motion } from 'motion/react'
import { useCart } from '@/lib/cart-store'
import { ButtonLink } from '@/components/ui/Button'
import { CameraGlyph } from '@/components/ui/CameraGlyph'
import { routes, site } from '@/lib/site'
import { useSearchParam } from '@/lib/client-state'

/** Confettis en pastilles : les couleurs du produit, aucune dépendance. */
const CONFETTI = ['#ff4438', '#ffd426', '#2f6bff', '#21d07a', '#c8f135']

export function ThankYouClient() {
  const clear = useCart((s) => s.clear)
  const isDemo = useSearchParam('demo') !== null

  // Le panier n'est vidé qu'ici : si le client abandonne le paiement,
  // il retrouve sa sélection intacte. `clear` agit sur un store externe,
  // pas sur l'état local du composant : sa place est bien dans un effet.
  useEffect(() => {
    clear()
  }, [clear])

  return (
    <div className="relative mx-auto grid min-h-[70vh] max-w-3xl place-items-center overflow-hidden px-4 py-20 text-center">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {Array.from({ length: 22 }, (_, i) => (
          <motion.span
            key={i}
            className="absolute size-3 rounded-full border-2 border-ink"
            style={{
              backgroundColor: CONFETTI[i % CONFETTI.length],
              left: `${(i * 37) % 100}%`,
            }}
            initial={{ y: -60, rotate: 0, opacity: 0 }}
            animate={{ y: '100vh', rotate: 540, opacity: [0, 1, 1, 0] }}
            transition={{ duration: 3.4 + (i % 5) * 0.5, delay: (i % 8) * 0.16, ease: 'linear' }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <motion.div
          initial={{ scale: 0.4, rotate: -25, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 16 }}
          className="mx-auto w-fit"
        >
          <CameraGlyph className="w-40" bodyColor="#21d07a" shadeColor="#11a65d" />
        </motion.div>

        <h1 className="mt-8 text-[clamp(2.2rem,6vw,3.6rem)]">
          {isDemo ? 'Parcours de test terminé' : 'Merci, c’est noté !'}
        </h1>

        {isDemo ? (
          <div className="mx-auto mt-6 max-w-xl rounded-[1.75rem] border-3 border-dashed border-ink bg-pop-yellow/60 px-6 py-5 text-left">
            <p className="font-display font-bold">Aucun paiement n’a eu lieu.</p>
            <p className="mt-2 text-sm leading-relaxed">
              Stripe n’est pas encore configuré : le tunnel a tourné en mode démonstration pour
              vérifier le parcours de bout en bout. Renseignez <code className="font-mono">STRIPE_SECRET_KEY</code>{' '}
              et <code className="font-mono">STRIPE_WEBHOOK_SECRET</code> dans votre fichier{' '}
              <code className="font-mono">.env.local</code> pour encaisser réellement — la marche à
              suivre est dans <code className="font-mono">docs/PAYMENTS.md</code>.
            </p>
          </div>
        ) : (
          <>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
              Votre commande est confirmée. Un e-mail de confirmation part à l’instant, et vous
              recevrez le numéro de suivi dès l’expédition — comptez 3 à 5 jours ouvrés.
            </p>
            <p className="mt-4 text-sm text-ink-soft">
              Une question ?{' '}
              <a href={`mailto:${site.email}`} className="font-semibold underline underline-offset-2">
                {site.email}
              </a>
            </p>
          </>
        )}

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <ButtonLink href={routes.home} variant="primary" size="md">
            Retour à l’accueil
          </ButtonLink>
          <ButtonLink href={site.instagram} variant="ghost" size="md">
            Nous montrer vos photos
          </ButtonLink>
        </div>
      </div>
    </div>
  )
}
