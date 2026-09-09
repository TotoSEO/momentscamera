'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ProductViewer } from '@/components/product/ProductViewer'
import { ProductPhoto } from '@/components/product/ProductPhoto'
import { BulkQuantity } from '@/components/product/BulkQuantity'
import { ColorPicker } from '@/components/product/ColorPicker'
import { BundlePicker } from '@/components/product/BundlePicker'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { VideoBlock } from '@/components/ui/VideoBlock'
import { useCart } from '@/lib/cart-store'
import { formatPrice, routes, site } from '@/lib/site'
import { useSearchParam } from '@/lib/client-state'
import {
  bundleLinePriceCents,
  bundles,
  perDevicePriceCents,
  colorways,
  defaultColorway,
  getBundle,
  specs,
  type Bundle,
  type ColorwaySlug,
} from '@/content/product'
import { productPage } from '@/content/copy'

/**
 * Fiche produit.
 *
 * Structure : visuel 3D collant à gauche, boîte d'achat à droite,
 * puis les blocs de réassurance en dessous. Sur mobile, une barre
 * d'achat apparaît dès que la boîte principale sort de l'écran —
 * c'est là que se joue l'essentiel du chiffre d'affaires.
 */
export function ProductPageClient() {
  // Le pack choisi dans la grille d'offres de l'accueil arrive en `?pack=`.
  // Lu via un store externe pour que la page reste entièrement statique et
  // qu'aucun état ne soit synchronisé dans un effet.
  const packFromUrl = useSearchParam('pack')
  const [pickedBundle, setPickedBundle] = useState<Bundle['id'] | null>(null)

  const bundleId: Bundle['id'] =
    pickedBundle ??
    (packFromUrl && bundles.some((b) => b.id === packFromUrl) ? (packFromUrl as Bundle['id']) : 'duo')

  const bundle = getBundle(bundleId) ?? bundles[0]

  // Un seul tableau, dimensionné pour le plus gros pack. On n'en montre que
  // les `bundle.quantity` premières entrées : plus rien à resynchroniser
  // quand le client change de pack, et son choix de couleurs est conservé.
  const maxUnits = Math.max(...bundles.map((b) => b.quantity))
  const [colorPool, setColorPool] = useState<ColorwaySlug[]>(() =>
    Array.from({ length: maxUnits }, () => defaultColorway.slug),
  )
  const selectedColors = colorPool.slice(0, bundle.quantity)

  // Quantité du pack en nombre. Indépendante du pack sélectionné pour que
  // le client puisse comparer sans perdre son réglage.
  const [bulkQuantity, setBulkQuantity] = useState(10)

  // Le visuel par défaut est la PHOTO du produit réel ; la 3D est une vue
  // complémentaire, jamais celle sur laquelle on décide d'acheter.
  const [view, setView] = useState<'photo' | '3d'>('photo')

  const [justAdded, setJustAdded] = useState(false)
  const [showStickyBar, setShowStickyBar] = useState(false)

  const add = useCart((s) => s.add)

  // Barre d'achat mobile.
  //
  // Elle était pilotée par la sortie d'écran de la boîte d'achat, donc
  // n'apparaissait qu'une fois celle-ci entièrement dépassée : très bas dans
  // la page, alors que c'est justement pendant la lecture qu'on veut pouvoir
  // commander. Elle suit maintenant le simple fait d'avoir commencé à lire.
  useEffect(() => {
    const onScroll = () => setShowStickyBar(window.scrollY > 140)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const previewColorway = useMemo(
    () => colorways.find((c) => c.slug === colorPool[0]) ?? defaultColorway,
    [colorPool],
  )

  const isBulk = bundle.bulk !== undefined
  const orderQuantity = isBulk ? bulkQuantity : 1
  const deviceCount = bundle.quantity * orderQuantity
  const totalPrice = bundleLinePriceCents(bundle, orderQuantity) * orderQuantity
  const unitPrice = perDevicePriceCents(bundle, orderQuantity)
  const saving = bundle.compareAtCents * orderQuantity - totalPrice

  function handleAdd() {
    add(bundle.id, selectedColors, orderQuantity)
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 2200)
  }

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 pt-8 pb-20 md:px-8 md:pt-12">
        <nav aria-label="Fil d’Ariane" className="mb-6 font-mono text-xs text-ink-soft">
          <Link href={routes.home} className="underline-offset-2 hover:underline">
            Accueil
          </Link>
          <span className="mx-2">/</span>
          <span aria-current="page">Appareil photo porte-clés</span>
        </nav>

        {/* Identité du produit, avant tout le reste : on doit savoir ce
            qu'on regarde avant de choisir. */}
        <header className="mb-6 lg:mb-8">
          <p className="font-mono text-sm tracking-widest text-pop-red uppercase">
            {productPage.eyebrow}
          </p>
          <h1 className="mt-2 text-[clamp(2.2rem,5.5vw,3.6rem)]">{productPage.title}</h1>
        </header>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
          {/* ---------------- Visuel ---------------- */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="relative overflow-hidden rounded-[2.5rem] border-3 border-ink bg-cream-deep shadow-pop">
              <div className="pointer-events-none absolute inset-0 -z-0 opacity-60" aria-hidden>
                <div className="animate-blob absolute -top-16 -left-16 size-72 bg-pop-yellow/70 blur-3xl" />
                <div
                  className="animate-blob absolute -right-16 -bottom-16 size-72 bg-pop-blue/40 blur-3xl"
                  style={{ animationDelay: '-6s' }}
                />
              </div>

              {view === 'photo' ? (
                <ProductPhoto
                  colorway={previewColorway}
                  className="relative z-10 aspect-square w-full"
                  priority
                />
              ) : (
                <>
                  <ProductViewer colorway={previewColorway} className="relative z-10 aspect-square w-full" />
                  <p className="relative z-10 px-6 pb-4 text-center text-[11px] leading-snug text-ink-soft">
                    Modèle 3D non contractuel, fourni pour visualiser les volumes. Les photos
                    montrent le produit réel.
                  </p>
                </>
              )}

              <Badge tone={view === 'photo' ? 'green' : 'red'} className="absolute top-5 left-5 z-10">
                {view === 'photo' ? 'Photo du produit' : 'Vue 3D interactive'}
              </Badge>
            </div>

            {/* Bascule entre la photo et la vue 3D. */}
            <div className="mt-4 flex gap-2">
              {(
                [
                  ['photo', 'Photo réelle'],
                  ['3d', 'Vue 3D'],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setView(id)}
                  aria-pressed={view === id}
                  className={`flex-1 rounded-full border-3 border-ink px-4 py-2.5 font-display text-sm font-bold transition-colors ${
                    view === id ? 'bg-ink text-cream' : 'bg-paper hover:bg-pop-yellow'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

          </div>

          {/* ---------------- Décisions d'achat ----------------
              Coloris puis quantité, immédiatement après l'image.
              L'argumentaire vient après : personne ne lit une fiche
              technique avant d'avoir choisi sa couleur. */}
          <div id="buy-box" className="flex flex-col gap-6">
            <section aria-labelledby="color-title" className="flex flex-col gap-3">
              <h2 id="color-title" className="font-display text-lg font-bold">
                {productPage.colorLabel}
              </h2>
              {isBulk && (
                <p className="-mt-1 text-sm text-ink-soft">
                  Un coloris par lot. Pour panacher, ajoutez plusieurs lots au panier.
                </p>
              )}
              {selectedColors.map((slug, i) => (
                <ColorPicker
                  key={i}
                  groupId={`unit-${i}`}
                  value={slug}
                  label={
                    isBulk
                      ? `Couleur du lot de ${deviceCount}`
                      : bundle.quantity > 1
                        ? `Appareil ${i + 1}`
                        : undefined
                  }
                  onChange={(next) =>
                    setColorPool((prev) => prev.map((c, j) => (j === i ? next : c)))
                  }
                />
              ))}
            </section>

            <section aria-labelledby="pack-title" className="flex flex-col gap-3">
              <h2 id="pack-title" className="font-display text-lg font-bold">
                {productPage.bundleLabel}
              </h2>
              <BundlePicker value={bundleId} onChange={setPickedBundle} bulkQuantity={bulkQuantity} />
              {isBulk && (
                <BulkQuantity bundle={bundle} quantity={bulkQuantity} onChange={setBulkQuantity} />
              )}
            </section>

            <div className="rounded-[2rem] border-3 border-ink bg-paper p-6 shadow-pop">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="font-display text-4xl leading-none font-bold">
                    {formatPrice(totalPrice)}
                  </p>
                  <p className="mt-1.5 text-sm text-ink-soft">
                    {deviceCount > 1 && <>soit {formatPrice(unitPrice)} l’unité · </>}TTC, livraison{' '}
                    {totalPrice >= site.freeShippingThresholdCents ? 'offerte' : 'en sus'}
                  </p>
                </div>
                {saving > 0 && (
                  <span className="rounded-full border-3 border-ink bg-pop-green px-3.5 py-1.5 font-display text-sm font-bold">
                    −{formatPrice(saving)}
                  </span>
                )}
              </div>

              <Button
                variant="primary"
                size="lg"
                shine
                className="mt-5 w-full"
                onClick={handleAdd}
                aria-live="polite"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {justAdded ? (
                    <motion.span
                      key="added"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="flex items-center gap-2"
                    >
                      Ajouté au panier ✓
                    </motion.span>
                  ) : (
                    <motion.span
                      key="add"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                    >
                      Ajouter au panier
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>

              <ul className="mt-5 grid gap-2.5 text-sm sm:grid-cols-2">
                {[
                  '📦 Expédié sous 24 h ouvrées',
                  '↩️ 30 jours pour changer d’avis',
                  '🛡️ Garantie 12 mois',
                  '🔒 Paiement sécurisé Stripe',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-ink-soft">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* ---------------- Argumentaire et caractéristiques ----------------
                Après les décisions : ce bloc rassure celui qui hésite encore,
                il ne doit pas retarder celui qui a déjà choisi. */}
            <div>
              <p className="text-lg text-ink-soft md:text-xl">{productPage.tagline}</p>
              <ul className="mt-4 flex flex-col gap-2.5">
                {productPage.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-2.5">
                    <span className="mt-2 size-2 shrink-0 rounded-full bg-pop-green" aria-hidden />
                    <span className="leading-relaxed">{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>

            <section aria-labelledby="specs-title" className="rounded-[2rem] border-3 border-ink bg-cream-deep p-6">
              <h2 id="specs-title" className="font-display text-lg font-bold">
                Caractéristiques
              </h2>
              <dl className="mt-4 divide-y-2 divide-dashed divide-ink/20">
                {specs.map((spec) => (
                  <div key={spec.label} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-3">
                    <dt className="font-display font-bold">{spec.label}</dt>
                    <dd className="text-right">
                      <span className="font-mono text-sm">{spec.value}</span>
                      {spec.note && <span className="block text-xs text-ink-soft">{spec.note}</span>}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 text-xs leading-relaxed text-ink-soft">
                Valeurs communiquées par le fabricant, mesurées en conditions normales
                d’utilisation. L’autonomie varie selon la température et la proportion de vidéo.
              </p>
            </section>

            <p className="text-center text-sm text-ink-soft">
              Une question avant de commander ?{' '}
              <Link href="/#faq" className="font-semibold underline underline-offset-2">
                Voir les réponses
              </Link>{' '}
              ou{' '}
              <a href={`mailto:${site.email}`} className="font-semibold underline underline-offset-2">
                nous écrire
              </a>
              .
            </p>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
          <VideoBlock ratio="aspect-square" tone="yellow" />
          <VideoBlock ratio="aspect-square" tone="blue" />
          <VideoBlock ratio="aspect-square" tone="green" />
          <VideoBlock ratio="aspect-square" tone="red" />
        </div>
      </div>

      {/* ---------------- Barre d'achat mobile ---------------- */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="fixed inset-x-0 bottom-0 z-70 border-t-3 border-ink bg-paper px-4 py-3 lg:hidden"
          >
            <div className="mx-auto flex max-w-2xl items-center gap-3">
              <div className="min-w-0 flex-1">
                <p className="truncate font-display font-bold">
                  {bundle.name}
                  {isBulk && <span className="font-normal text-ink-soft"> · {deviceCount}</span>}
                </p>
                <p className="font-mono text-sm">{formatPrice(totalPrice)}</p>
              </div>
              <Button variant="primary" size="sm" onClick={handleAdd} className="shrink-0">
                {justAdded ? 'Ajouté ✓' : 'Ajouter'}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
