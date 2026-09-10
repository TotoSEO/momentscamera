import type { Metadata } from 'next'
import Link from 'next/link'
import { Field, LegalLayout, LegalSection } from '@/components/LegalLayout'
import { operator } from '@/lib/legal'
import { deliveryRange, formatPrice, routes, site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Livraison et retours',
  description: 'Délais, tarifs de livraison, procédure de retour et de remboursement.',
  alternates: { canonical: '/livraison-et-retours' },
}

export default function LivraisonPage() {
  return (
    <LegalLayout title="Livraison et retours" updatedAt="10 septembre 2026">
      <LegalSection title="Délais et tarifs">
        <ul className="ml-5 list-disc space-y-2">
          <li>France métropolitaine : {deliveryRange(site.deliveryDays.fr)}, avec suivi.</li>
          <li>
            Belgique, Luxembourg, Suisse et Union européenne :{' '}
            {deliveryRange(site.deliveryDays.eu)}.
          </li>
          <li>
            Frais : {formatPrice(site.shippingFlatCents)}, offerts dès{' '}
            {formatPrice(site.freeShippingThresholdCents)} d’achat.
          </li>
          <li>Expédition sous 24 heures ouvrées après confirmation du paiement.</li>
        </ul>
        <p>
          Le numéro de suivi est envoyé par courriel dès la remise du colis au transporteur.
        </p>
      </LegalSection>

      <LegalSection title="Colis perdu ou endommagé">
        <p>
          Si le colis n’est pas arrivé sept jours après la date de livraison annoncée, écrivez à{' '}
          {site.email} avec votre numéro de commande : nous ouvrons une enquête auprès du
          transporteur et réexpédions si nécessaire. En cas de produit endommagé à la réception, une
          photo suffit, nous remplaçons sans retour préalable.
        </p>
      </LegalSection>

      <LegalSection title="Retour et remboursement">
        <p>
          Vous avez <strong>trente jours</strong> à compter de la réception pour changer d’avis. Le
          délai légal de rétractation est de {site.returnWindowDays} jours : nous le doublons de
          notre propre initiative.
        </p>
        <ol className="ml-5 list-decimal space-y-2">
          <li>Écrivez à {site.email} en indiquant votre numéro de commande.</li>
          <li>Nous vous envoyons une étiquette de retour prépayée.</li>
          <li>Renvoyez l’appareil complet, avec son câble, dans un emballage protecteur.</li>
          <li>
            Le remboursement est effectué sous quatorze jours après réception, sur le moyen de
            paiement d’origine.
          </li>
        </ol>
        <p className="text-sm text-ink-soft">
          Aucun justificatif n’est demandé. Un appareil visiblement endommagé par une mauvaise
          utilisation peut faire l’objet d’une décote, conformément à l’article L221-23 du Code de
          la consommation.
        </p>
      </LegalSection>

      <LegalSection title="Formulaire type de rétractation">
        <p className="text-sm text-ink-soft">
          Ce formulaire est mis à votre disposition en application de l’article L221-5 du Code de la
          consommation. Son usage n’est pas obligatoire : un simple courriel suffit. Complétez-le et
          renvoyez-le uniquement si vous souhaitez vous rétracter.
        </p>
        <div className="rounded-[1.5rem] border-3 border-ink bg-paper px-6 py-5 font-mono text-sm leading-relaxed">
          <p>
            À l’attention de {operator.name},{' '}
            <Field value={operator.address} label="adresse postale complète" />,{' '}
            {operator.email} :
          </p>
          <p className="mt-4">
            Je vous notifie par la présente ma rétractation du contrat portant sur la vente du bien
            ci-dessous :
          </p>
          <ul className="mt-4 flex flex-col gap-2">
            <li>Commandé le : ..................................................</li>
            <li>Reçu le : ......................................................</li>
            <li>Numéro de commande : ...........................................</li>
            <li>Nom du consommateur : ..........................................</li>
            <li>Adresse du consommateur : ......................................</li>
            <li>Date : .........................................................</li>
            <li>Signature (uniquement en cas d’envoi sur papier) : .............</li>
          </ul>
        </div>
      </LegalSection>

      <LegalSection title="Garantie">
        <p>
          Chaque appareil est garanti {site.warrantyMonths} mois contre les défauts de fabrication,
          en plus des garanties légales détaillées dans les{' '}
          <Link href={routes.cgv} className="underline underline-offset-2">
            conditions générales de vente
          </Link>
          .
        </p>
      </LegalSection>
    </LegalLayout>
  )
}
