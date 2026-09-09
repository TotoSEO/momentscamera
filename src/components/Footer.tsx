import Link from 'next/link'
import { routes, site } from '@/lib/site'
import { CameraGlyph } from '@/components/ui/CameraGlyph'
import { Marquee } from '@/components/ui/Marquee'

const columns = [
  {
    title: 'Boutique',
    links: [
      { href: routes.product, label: 'Appareil photo porte-clés' },
      { href: '/#couleurs', label: 'Les 9 couleurs' },
      { href: '/#offres', label: 'Les packs' },
      { href: routes.cart, label: 'Mon panier' },
    ],
  },
  {
    title: 'Aide',
    links: [
      { href: '/#faq', label: 'Questions fréquentes' },
      { href: routes.shipping, label: 'Livraison et retours' },
      { href: `mailto:${site.email}`, label: 'Nous écrire' },
    ],
  },
  {
    title: 'Légal',
    links: [
      { href: routes.cgv, label: 'Conditions générales de vente' },
      { href: routes.legal, label: 'Mentions légales' },
      { href: routes.privacy, label: 'Confidentialité et cookies' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="mt-24 border-t-3 border-ink bg-ink text-cream">
      <Marquee
        items={['MOMENTS CAMÉRA', 'CAPTUREZ AVANT DE RÉFLÉCHIR', '1080P DANS LA POCHE']}
        className="border-ink bg-pop-yellow text-ink"
        duration="24s"
      />

      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 md:grid-cols-[1.4fr_repeat(3,1fr)] md:px-8">
        <div>
          <div className="flex items-center gap-3">
            <CameraGlyph className="w-14" />
            <span className="font-display text-2xl font-bold">
              Moments<span className="text-pop-red">.</span>
            </span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/70">
            Un appareil photo de 20 grammes accroché à vos clés, pour attraper ce que le téléphone
            vous fait rater.
          </p>
          <div className="mt-5 flex gap-3">
            <Link
              href={site.instagram}
              className="rounded-full border-2 border-cream/40 px-4 py-1.5 text-sm transition-colors hover:border-pop-yellow hover:text-pop-yellow"
            >
              Instagram
            </Link>
            <Link
              href={site.tiktok}
              className="rounded-full border-2 border-cream/40 px-4 py-1.5 text-sm transition-colors hover:border-pop-yellow hover:text-pop-yellow"
            >
              TikTok
            </Link>
          </div>
        </div>

        {columns.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h2 className="font-display text-lg font-bold text-pop-yellow">{col.title}</h2>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-cream/75 transition-colors hover:text-cream">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-cream/15 px-4 py-6 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 text-xs text-cream/55 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. Tous droits réservés.
          </p>
          <p>
            Paiement sécurisé par Stripe · Prix TTC · Rétractation {site.returnWindowDays} jours
          </p>
        </div>
      </div>
    </footer>
  )
}
