import type { Metadata } from 'next'
import { Fill, LegalLayout, LegalSection } from '@/components/LegalLayout'
import { site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Confidentialité et cookies',
  description: 'Comment Moments Caméra traite vos données personnelles.',
  alternates: { canonical: '/confidentialite' },
}

export default function ConfidentialitePage() {
  return (
    <LegalLayout title="Confidentialité et cookies" updatedAt="9 septembre 2026">
      <LegalSection title="1. Responsable du traitement">
        <p>
          Le responsable du traitement est <Fill>dénomination sociale</Fill>,{' '}
          <Fill>adresse</Fill>. Pour toute question relative à vos données : {site.email}.
        </p>
      </LegalSection>

      <LegalSection title="2. Données collectées et finalités">
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong>Commande</strong> — nom, adresse postale, adresse électronique, téléphone. Base
            légale : exécution du contrat. Conservation : dix ans (obligation comptable).
          </li>
          <li>
            <strong>Paiement</strong> — traité intégralement par Stripe Payments Europe, Ltd. Nous
            ne recevons ni ne stockons aucun numéro de carte. Nous ne conservons que l’identifiant
            de transaction.
          </li>
          <li>
            <strong>Panier</strong> — conservé dans le stockage local de votre navigateur. Ces
            données ne quittent jamais votre appareil et ne nous sont pas transmises.
          </li>
          <li>
            <strong>Service client</strong> — contenu de vos messages. Base légale : intérêt
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
          Si vous ajoutez ultérieurement un outil de mesure d’audience ou de publicité, cette page
          doit être mise à jour et une bannière de consentement conforme aux recommandations de la
          CNIL devient obligatoire.
        </p>
      </LegalSection>

      <LegalSection title="4. Destinataires et transferts">
        <p>
          Vos données sont communiquées aux seuls prestataires nécessaires à l’exécution de la
          commande : le prestataire de paiement (Stripe), le transporteur, et l’hébergeur du site.
          Aucun transfert hors de l’Union européenne n’est effectué sans garanties appropriées au
          sens du chapitre V du RGPD.
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
