import { site } from '@/lib/site'

/**
 * Informations légales de l'exploitant.
 *
 * Un champ laissé à `null` n'est pas encore connu : les pages légales affichent
 * alors un marqueur « [à compléter] » plutôt qu'une valeur inventée. Renseignez
 * la valeur ici une seule fois, elle se propage aux mentions légales, aux CGV et
 * à la politique de confidentialité.
 *
 * Tant que `canSellLegally` vaut faux, la boutique n'est pas en règle pour
 * encaisser une commande. La marche à suivre est détaillée dans docs/LEGAL.md.
 */

export type Mediator = {
  name: string
  address: string
  url: string
}

export const operator = {
  /** Nom ou dénomination sociale de l'exploitant, tel qu'il figurera sur les factures. */
  name: 'Thomas Owaller',
  /**
   * Forme juridique : « Entrepreneur individuel » pour une micro-entreprise,
   * « SASU au capital de 1 000 € » pour une société. Reste `null` tant qu'aucune
   * immatriculation n'a été demandée au guichet unique de l'INPI.
   */
  legalForm: null as string | null,
  /** Capital social en euros. Ne concerne que les sociétés. */
  capitalEuros: null as number | null,
  /** SIREN à 9 chiffres, attribué par l'INSEE après la déclaration au guichet unique. */
  siren: null as string | null,
  /** SIRET de l'établissement, soit le SIREN suivi du NIC à 5 chiffres. */
  siret: null as string | null,
  /** Ville du greffe d'immatriculation au registre du commerce et des sociétés. */
  rcsCity: null as string | null,
  /**
   * Numéro de TVA intracommunautaire. Reste `null` sous le régime de la franchise
   * en base : dans ce cas les factures portent la mention « TVA non applicable,
   * article 293 B du CGI ».
   */
  vatNumber: null as string | null,
  /**
   * Adresse postale complète. Obligatoire au titre de l'article 6 III de la LCEN
   * et de l'article L221-5 du Code de la consommation. Une domiciliation
   * commerciale convient si vous ne souhaitez pas publier votre adresse privée.
   */
  address: null as string | null,
  /** Téléphone du service client. Obligatoire en vente à distance (art. L221-5). */
  phone: null as string | null,
  /** Adresse électronique de contact. Elle doit être relevée : c'est le canal légal. */
  email: site.email,
  /** Directeur de la publication (art. 6 III 1° a de la LCEN). */
  publicationDirector: 'Thomas Owaller',
  /**
   * Médiateur de la consommation. L'adhésion à un dispositif de médiation est
   * obligatoire pour tout professionnel vendant à des consommateurs
   * (art. L612-1 du Code de la consommation), et ses coordonnées doivent figurer
   * sur le site et dans les CGV.
   */
  mediator: null as Mediator | null,
  /**
   * Identifiants uniques délivrés par l'ADEME après adhésion à un éco-organisme.
   * Obligatoires pour mettre un appareil électronique et sa batterie sur le
   * marché français (art. L541-10-13 du Code de l'environnement), et à
   * communiquer dans les conditions générales de vente.
   */
  ademe: {
    /** Filière équipements électriques et électroniques (DEEE). */
    eee: null as string | null,
    /** Filière piles et accumulateurs. */
    batteries: null as string | null,
    /** Filière emballages ménagers. */
    packaging: null as string | null,
  },
}

/**
 * Régime de TVA appliqué aux prix affichés.
 *
 * `franchise` : franchise en base, les prix sont nets de taxe et les factures
 * portent la mention de l'article 293 B du CGI. Seuil 2026 pour la vente de
 * marchandises : 85 000 € de chiffre d'affaires encaissé, 93 500 € en seuil
 * majoré.
 *
 * `assujetti` : la TVA est facturée et le numéro intracommunautaire doit être
 * renseigné ci-dessus.
 */
export const vatRegime: 'franchise' | 'assujetti' = 'franchise'

/**
 * Hébergeur du site, à mentionner nominativement (art. 6 III de la LCEN).
 * À corriger le jour où le site bascule sur Vercel pour encaisser les paiements.
 */
export const host = {
  name: 'GitHub, Inc. (GitHub Pages)',
  address: '88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, États-Unis',
  url: 'https://github.com',
}

/**
 * Vrai lorsque toutes les mentions obligatoires pour vendre à distance à un
 * consommateur français sont renseignées. Pilote le bandeau « à compléter »
 * affiché en tête des pages légales.
 */
export const canSellLegally =
  Boolean(operator.legalForm) &&
  Boolean(operator.siren) &&
  Boolean(operator.address) &&
  Boolean(operator.phone) &&
  Boolean(operator.mediator) &&
  Boolean(operator.ademe.eee)

/** Identité de l'exploitant en une ligne, pour les CGV et les mentions légales. */
export function operatorIdentity(): string {
  const parts = [operator.name]
  if (operator.legalForm) {
    parts.push(
      operator.capitalEuros
        ? `${operator.legalForm} au capital de ${operator.capitalEuros} €`
        : operator.legalForm,
    )
  }
  return parts.join(', ')
}
