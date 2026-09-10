import type { Metadata } from 'next'
import { Field, LegalLayout, LegalSection } from '@/components/LegalLayout'
import { host, operator, vatRegime } from '@/lib/legal'
import { site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Mentions légales',
  description: 'Informations légales relatives à l’éditeur et à l’hébergeur du site Moments Caméra.',
  alternates: { canonical: '/mentions-legales' },
}

export default function MentionsLegalesPage() {
  return (
    <LegalLayout title="Mentions légales" updatedAt="10 septembre 2026">
      <LegalSection title="1. Éditeur du site">
        <p>
          Le site {site.name} est édité par {operator.name},{' '}
          <Field
            value={
              operator.legalForm && operator.capitalEuros
                ? `${operator.legalForm} au capital de ${operator.capitalEuros} €`
                : operator.legalForm
            }
            label="forme juridique, connue après immatriculation"
          />
          .
        </p>
        <ul className="ml-5 list-disc space-y-1">
          <li>
            Numéro SIREN : <Field value={operator.siren} label="9 chiffres, attribué par l’INSEE" />
          </li>
          <li>
            Immatriculation au registre du commerce et des sociétés de{' '}
            <Field value={operator.rcsCity} label="ville du greffe" />
          </li>
          <li>
            Numéro de TVA intracommunautaire :{' '}
            {vatRegime === 'franchise' ? (
              <span>
                non applicable, article 293 B du code général des impôts (franchise en base)
              </span>
            ) : (
              <Field value={operator.vatNumber} label="FR + clé + SIREN" />
            )}
          </li>
          <li>
            Siège social : <Field value={operator.address} label="adresse postale complète" />
          </li>
          <li>
            Adresse électronique :{' '}
            <a href={`mailto:${operator.email}`} className="underline underline-offset-2">
              {operator.email}
            </a>
          </li>
          <li>
            Téléphone : <Field value={operator.phone} label="numéro du service client" />
          </li>
          <li>Directeur de la publication : {operator.publicationDirector}</li>
        </ul>
        <p className="text-sm text-ink-soft">
          Ces mentions sont exigées par l’article 6 III de la loi n° 2004-575 du 21 juin 2004 pour
          la confiance dans l’économie numérique, et par l’article L221-5 du Code de la consommation
          pour la vente à distance.
        </p>
      </LegalSection>

      <LegalSection title="2. Hébergeur">
        <p>
          Le site est hébergé par {host.name}, {host.address}.
        </p>
      </LegalSection>

      <LegalSection title="3. Responsabilité élargie du producteur">
        <p>
          Un appareil photo et sa batterie relèvent des filières à responsabilité élargie du
          producteur. Les identifiants uniques délivrés par l’ADEME, prévus à l’article L541-10-13
          du Code de l’environnement, sont les suivants.
        </p>
        <ul className="ml-5 list-disc space-y-1">
          <li>
            Équipements électriques et électroniques :{' '}
            <Field value={operator.ademe.eee} label="identifiant unique filière EEE" />
          </li>
          <li>
            Piles et accumulateurs :{' '}
            <Field value={operator.ademe.batteries} label="identifiant unique filière piles" />
          </li>
          <li>
            Emballages ménagers :{' '}
            <Field value={operator.ademe.packaging} label="identifiant unique filière emballages" />
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Propriété intellectuelle">
        <p>
          L’ensemble des éléments composant le site (textes, visuels, modèle tridimensionnel,
          identité graphique, code source) est protégé par le droit de la propriété
          intellectuelle. Toute reproduction, représentation ou adaptation, totale ou partielle,
          sans autorisation écrite préalable, est interdite.
        </p>
        <p>
          Les marques et logos cités appartiennent à leurs propriétaires respectifs.
        </p>
      </LegalSection>

      <LegalSection title="5. Responsabilité">
        <p>
          Les informations techniques publiées sur ce site proviennent des données communiquées par
          le fabricant. Elles sont fournies à titre indicatif et peuvent évoluer selon les séries de
          production. Les performances réelles (autonomie, qualité d’image) varient selon les
          conditions d’utilisation.
        </p>
      </LegalSection>

      <LegalSection title="6. Médiation de la consommation">
        <p>
          Conformément à l’article L612-1 du Code de la consommation, le consommateur peut recourir
          gratuitement à un médiateur de la consommation en vue de la résolution amiable d’un
          litige. Le médiateur désigné est{' '}
          <Field
            value={
              operator.mediator
                ? `${operator.mediator.name}, ${operator.mediator.address} (${operator.mediator.url})`
                : null
            }
            label="nom, adresse et site du médiateur"
          />
          .
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
