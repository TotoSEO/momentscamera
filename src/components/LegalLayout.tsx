import Link from 'next/link'
import { canSellLegally } from '@/lib/legal'
import { routes } from '@/lib/site'

/**
 * Gabarit des pages légales.
 *
 * Le bandeau d'avertissement s'affiche tant que `draft` est vrai. Par défaut il
 * suit `canSellLegally` : il disparaîtra tout seul le jour où les informations
 * obligatoires seront renseignées dans src/lib/legal.ts.
 */
export function LegalLayout({
  title,
  updatedAt,
  draft = !canSellLegally,
  children,
}: {
  title: string
  updatedAt: string
  draft?: boolean
  children: React.ReactNode
}) {
  return (
    <article className="mx-auto max-w-3xl px-4 py-14 md:px-8 md:py-20">
      <nav aria-label="Fil d’Ariane" className="mb-6 font-mono text-xs text-ink-soft">
        <Link href={routes.home} className="underline-offset-2 hover:underline">
          Accueil
        </Link>
        <span className="mx-2">/</span>
        <span aria-current="page">{title}</span>
      </nav>

      <h1 className="text-[clamp(2rem,5vw,3rem)]">{title}</h1>
      <p className="mt-3 font-mono text-sm text-ink-soft">Dernière mise à jour : {updatedAt}</p>

      {draft && (
        <div className="mt-8 rounded-[1.5rem] border-3 border-dashed border-ink bg-pop-yellow/60 px-6 py-5">
          <p className="font-display font-bold">Document à compléter avant la première vente</p>
          <p className="mt-2 text-sm leading-relaxed">
            La structure est conforme à ce qu’exige le droit français, mais les mentions affichées
            entre crochets doivent être renseignées avec les informations réelles de l’exploitant,
            dans le fichier <code>src/lib/legal.ts</code>. Certaines d’entre elles (numéro SIREN,
            adresse, médiateur de la consommation) n’existent qu’une fois l’entreprise immatriculée.
            Une relecture par un professionnel du droit est vivement recommandée avant d’encaisser
            la première commande.
          </p>
        </div>
      )}

      <div className="legal-prose mt-10 flex flex-col gap-6 leading-relaxed">{children}</div>
    </article>
  )
}

/** Section numérotée, style homogène sur les quatre pages. */
export function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-display text-2xl font-bold">{title}</h2>
      {children}
    </section>
  )
}

/** Champ à renseigner par l'exploitant, sans valeur connue à ce jour. */
export function Fill({ children }: { children: React.ReactNode }) {
  return (
    <mark className="rounded-md bg-pop-lime px-1.5 py-0.5 font-mono text-sm">[{children}]</mark>
  )
}

/**
 * Affiche une information légale si elle est connue, sinon un marqueur.
 * Évite d'inventer une donnée que la loi impose d'être exacte.
 */
export function Field({ value, label }: { value: string | null | undefined; label: string }) {
  if (value) return <>{value}</>
  return <Fill>{label}</Fill>
}
