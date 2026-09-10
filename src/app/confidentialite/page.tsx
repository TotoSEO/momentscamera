import type { Metadata } from 'next'
import { Field, LegalLayout, LegalSection } from '@/components/LegalLayout'
import { host, operator } from '@/lib/legal'
import { site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Confidentialité et cookies',
  description: 'Comment Moments Caméra traite vos données personnelles.',
  alternates: { canonical: '/confidentialite' },
}

/**
 * Attention : la section 3 affirme qu'aucun traceur publicitaire n'est déposé.
 * C'est vrai aujourd'hui. Le jour où un pixel Meta, TikTok ou Google est ajouté
 * au site, cette page devient fausse : il faut alors la mettre à jour ET
 * installer une bannière de consentement conforme aux lignes directrices de la
 * CNIL (refuser doit être aussi simple qu'accepter, et rien ne se déclenche
 * avant le choix de l'internaute).
 */
export default function ConfidentialitePage() {
  return (
    <LegalLayout title="Confidentialité et cookies" updatedAt="10 septembre 2026">
      <LegalSection title="1. Responsable du traitement">
        <p>
          Le responsable du traitement est {operator.name},{' '}
          <Field value={operator.address} label="adresse postale complète" />. Pour toute question
          relative à vos données :{' '}
          <a href={`mailto:${operator.email}`} className="underline underline-offset-2">
            {operator.email}
          </a>
          .
        </p>
        <p className="text-sm text-ink-soft">
          Aucun délégué à la protection des données n’est désigné : l’activité ne remplit aucun des
          critères de l’article 37 du RGPD rendant cette désignation obligatoire.
        </p>
      </LegalSection>

      <LegalSection title="2. Données collectées et finalités">
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong>Commande</strong> : nom, adresse postale, adresse électronique, téléphone. Base
            légale : exécution du contrat. Conservation : dix ans (obligation comptable).
          </li>
          <li>
            <strong>Paiement</strong> : traité intégralement par Stripe Payments Europe, Ltd. Nous
            ne recevons ni ne stockons aucun numéro de carte. Nous ne conservons que l’identifiant
            de transaction.
          </li>
          <li>
            <strong>Panier</strong> : conservé dans le stockage local de votre navigateur. Ces
            données ne quittent jamais votre appareil et ne nous sont pas transmises.
          </li>
          <li>
            <strong>Service client</strong> : contenu de vos messages. Base légale : intérêt
            légitime. Conservation : trois ans après le dernier contact.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="3. Cookies et traceurs">
        <p>
          Ce site ne dépose <strong>aucun cookie publicitaire ni de mesure d’audience</strong>. Les
          seules données stockées dans votre navigateur sont votre panier, via le stockage local.
        </p>
        <p>
          Stripe dépose ses propres cookies lors du passage en paiement, strictement nécessaires à
          la sécurisation de la transaction et à la lutte contre la fraude.
        </p>
        <p className="text-sm text-ink-soft">
          Si un outil de mesure d’audience ou un pixel publicitaire est ajouté par la suite, cette
          page sera mise à jour et une bannière de consentement conforme aux recommandations de la
          CNIL sera affichée avant tout dépôt.
        </p>
      </LegalSection>

      <LegalSection title="4. Destinataires et transferts">
        <p>
          Vos données sont communiquées aux seuls prestataires nécessaires à l’exécution de la
          commande.
        </p>
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong>Paiement</strong> : Stripe Payments Europe, Ltd., établi en Irlande.
          </li>
          <li>
            <strong>Hébergement du site</strong> : {host.name}, {host.address}. Ce prestataire est
            établi aux États-Unis ; le transfert repose sur les clauses contractuelles types de la
            Commission européenne.
          </li>
          <li>
            <strong>Expédition</strong> : le transporteur chargé de la livraison, ainsi que le
            fournisseur lorsqu’il expédie directement la commande.
          </li>
        </ul>
        <p className="text-sm text-ink-soft">
          Aucun transfert hors de l’Union européenne n’est effectué sans garanties appropriées au
          sens du chapitre V du RGPD. Vos données ne sont ni vendues ni louées.
        </p>
      </LegalSection>

      <LegalSection title="5. Vos droits">
        <p>
          Vous disposez d’un droit d’accès, de rectification, d’effacement, de limitation,
          d’opposition et de portabilité. Écrivez à {site.email} : nous répondons sous un mois.
        </p>
        <p>
          Vous pouvez également introduire une réclamation auprès de la CNIL, 3 place de Fontenoy,
          75007 Paris.
        </p>
      </LegalSection>
    </LegalLayout>
  )
}
