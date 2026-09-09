import Link from 'next/link'
import { routes } from '@/lib/site'

/**
 * Gabarit des pages légales.
 *
 * Le bandeau d'avertissement s'affiche tant que `draft` est vrai : ces
 * documents engagent juridiquement l'exploitant du site, ils doivent être
 * complétés (et idéalement relus par un professionnel) avant l'ouverture
 * réelle de la boutique.
 */
export function LegalLayout({
  title,
  updatedAt,
  draft = true,
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
          <p className="font-display font-bold">Modèle à compléter avant mise en ligne</p>
          <p className="mt-2 text-sm leading-relaxed">
            Ce document est une trame conforme à la structure attendue par le droit français, mais
            les mentions entre crochets doivent être renseignées avec vos informations réelles. Une
            relecture par un professionnel du droit est vivement recommandée avant d’encaisser la
            première commande.
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

/** Champ à renseigner par l'exploitant. */
export function Fill({ children }: { children: React.ReactNode }) {
  return (
    <mark className="rounded-md bg-pop-lime px-1.5 py-0.5 font-mono text-sm">[{children}]</mark>
  )
}
