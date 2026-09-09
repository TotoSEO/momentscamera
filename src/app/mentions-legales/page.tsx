import type { Metadata } from 'next'
import { Fill, LegalLayout, LegalSection } from '@/components/LegalLayout'
import { site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Mentions légales',
  description: 'Informations légales relatives à l’éditeur et à l’hébergeur du site Moments Caméra.',
  alternates: { canonical: '/mentions-legales' },
}

export default function MentionsLegalesPage() {
  return (
    <LegalLayout title="Mentions légales" updatedAt="9 septembre 2026">
      <LegalSection title="1. Éditeur du site">
        <p>
          Le site {site.name} est édité par <Fill>dénomination sociale</Fill>,{' '}
          <Fill>forme juridique</Fill> au capital de <Fill>montant</Fill> €, immatriculée au
          registre du commerce et des sociétés de <Fill>ville</Fill> sous le numéro{' '}
          <Fill>numéro SIREN</Fill>.
        </p>
        <ul className="ml-5 list-disc space-y-1">
          <li>Siège social : <Fill>adresse complète</Fill></li>
          <li>Numéro de TVA intracommunautaire : <Fill>FR00000000000</Fill></li>
          <li>Adresse électronique : {site.email}</li>
          <li>Téléphone : <Fill>numéro</Fill></li>
          <li>Directeur de la publication : <Fill>nom et prénom</Fill></li>
        </ul>
        <p className="text-sm text-ink-soft">
          Ces mentions sont exigées par l’article 6 III de la loi n° 2004-575 du 21 juin 2004 pour
          la confiance dans l’économie numérique, et par l’article L221-5 du Code de la consommation
          pour la vente à distance.
        </p>
      </LegalSection>

      <LegalSection title="2. Hébergeur">
        <p>
          Le site est hébergé par <Fill>nom de l’hébergeur</Fill>, <Fill>adresse</Fill>,{' '}
          <Fill>téléphone</Fill>.
        </p>
      </LegalSection>

      <LegalSection title="3. Propriété intellectuelle">
        <p>
          L’ensemble des éléments composant le site — textes, visuels, modèle tridimensionnel,
          identité graphique, code source — est protégé par le droit de la propriété
          intellectuelle. Toute reproduction, représentation ou adaptation, totale ou partielle,
          sans autorisation écrite préalable, est interdite.
        </p>
        <p>
          Les marques et logos cités appartiennent à leurs propriétaires respectifs.
        </p>
      </LegalSection>

      <LegalSection title="4. Responsabilité">
        <p>
          Les informations techniques publiées sur ce site proviennent des données communiquées par
          le fabricant. Elles sont fournies à titre indicatif et peuvent évoluer selon les séries de
          production. Les performances réelles (autonomie, qualité d’image) varient selon les
          conditions d’utilisation.
        </p>
      </LegalSection>

      <LegalSection title="5. Médiation de la consommation">
        <p>
          Conformément à l’article L612-1 du Code de la consommation, le consommateur peut recourir
          gratuitement à un médiateur de la consommation en vue de la résolution amiable d’un
          litige. Le médiateur désigné est <Fill>nom et coordonnées du médiateur</Fill>.
        </p>
        <p>
          La plateforme européenne de règlement en ligne des litiges est accessible à l’adresse{' '}
          <a
            href="https://ec.europa.eu/consumers/odr"
            className="underline underline-offset-2"
            rel="noreferrer"
            target="_blank"
          >
            ec.europa.eu/consumers/odr
          </a>
          .
        </p>
      </LegalSection>
    </LegalLayout>
  )
}
