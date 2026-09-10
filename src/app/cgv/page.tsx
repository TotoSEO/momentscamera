import type { Metadata } from 'next'
import Link from 'next/link'
import { Field, LegalLayout, LegalSection } from '@/components/LegalLayout'
import { operator, operatorIdentity, vatRegime } from '@/lib/legal'
import { deliveryRange, routes, site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Conditions générales de vente',
  description: 'Conditions générales de vente applicables aux commandes passées sur Moments Caméra.',
  alternates: { canonical: '/cgv' },
}

export default function CgvPage() {
  return (
    <LegalLayout title="Conditions générales de vente" updatedAt="10 septembre 2026">
      <LegalSection title="1. Objet et champ d’application">
        <p>
          Les présentes conditions régissent les ventes conclues sur {site.url} entre{' '}
          {operatorIdentity()}, dont le siège est situé{' '}
          <Field value={operator.address} label="adresse postale complète" />, immatriculé sous le
          numéro SIREN <Field value={operator.siren} label="numéro SIREN" /> (« le Vendeur »), et
          toute personne physique non commerçante (« le Client »). Toute commande vaut acceptation
          sans réserve des présentes conditions, dans leur version en vigueur au jour de la
          commande.
        </p>
      </LegalSection>

      <LegalSection title="2. Produits">
        <p>
          Les caractéristiques essentielles des produits sont présentées sur les fiches produit. Les
          photographies et le modèle tridimensionnel sont des représentations : de légères
          différences de teinte peuvent exister entre l’affichage à l’écran et le produit livré.
        </p>
        <p>
          Les performances annoncées (autonomie, résolution, angle de champ) proviennent des données
          du fabricant et sont mesurées en conditions normales d’utilisation.
        </p>
      </LegalSection>

      <LegalSection title="3. Prix">
        {vatRegime === 'franchise' ? (
          <p>
            Les prix sont indiqués en euros, nets de taxe, hors frais de livraison. TVA non
            applicable, article 293 B du code général des impôts. Les frais de livraison sont
            affichés avant validation définitive de la commande.
          </p>
        ) : (
          <p>
            Les prix sont indiqués en euros, toutes taxes comprises, hors frais de livraison. Les
            frais de livraison sont affichés avant validation définitive de la commande.
          </p>
        )}
        <p>
          Les produits sont importés depuis un pays situé hors de l’Union européenne. Le prix
          affiché est un prix rendu destination : les droits de douane et taxes à l’importation sont
          acquittés par le Vendeur. Aucun supplément ne peut être réclamé au Client à la livraison.
        </p>
        <p>
          Le Vendeur se réserve le droit de modifier ses prix à tout moment, le prix applicable
          étant celui en vigueur au moment de la commande.
        </p>
      </LegalSection>

      <LegalSection title="4. Commande et paiement">
        <p>
          Le Client sélectionne ses produits, vérifie le détail de sa commande et la valide. Le
          paiement s’effectue par carte bancaire, Apple Pay ou Google Pay via la plateforme
          sécurisée Stripe. Le Vendeur n’a jamais accès aux données bancaires du Client.
        </p>
        <p>
          La vente est définitive à réception du paiement. Un courriel de confirmation récapitulant
          la commande est adressé au Client.
        </p>
      </LegalSection>

      <LegalSection title="5. Livraison">
        <p>
          Les produits sont expédiés à l’adresse indiquée par le Client. Le délai indicatif est de{' '}
          {deliveryRange(site.deliveryDays.fr)} en France métropolitaine et de{' '}
          {deliveryRange(site.deliveryDays.eu)} dans le reste de l’Union européenne. Conformément à
          l’article L216-1 du Code de la consommation, le Vendeur livre au plus tard trente jours
          après la conclusion du contrat.
        </p>
        <p>
          Lorsque la commande est expédiée directement par le fournisseur, le Vendeur reste seul
          responsable de la bonne exécution du contrat à l’égard du Client, conformément à l’article
          L221-15 du Code de la consommation. L’identité du fournisseur est communiquée sur simple
          demande à {site.email}.
        </p>
        <p>
          En cas de retard, le Client peut résoudre le contrat par lettre recommandée ou par écrit
          sur un autre support durable, après avoir enjoint le Vendeur de livrer dans un délai
          supplémentaire raisonnable.
        </p>
        <p>
          Les détails figurent sur la page{' '}
          <Link href={routes.shipping} className="underline underline-offset-2">
            Livraison et retours
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection title="6. Droit de rétractation">
        <p>
          Conformément aux articles L221-18 et suivants du Code de la consommation, le Client
          dispose d’un délai de quatorze jours à compter de la réception pour exercer son droit de
          rétractation, sans motif ni pénalité. À titre commercial, le Vendeur porte ce délai à{' '}
          <strong>trente jours</strong>.
        </p>
        <p>
          Le produit doit être retourné complet et dans un état permettant sa remise en vente. Les
          frais de retour sont à la charge du Vendeur. Le remboursement intervient au plus tard
          quatorze jours après récupération du bien, par le même moyen de paiement.
        </p>
        <p>
          Pour exercer ce droit, il suffit d’écrire à {site.email} en indiquant le numéro de
          commande. Aucun justificatif n’est demandé.
        </p>
      </LegalSection>

      <LegalSection title="7. Garanties">
        <p>
          Tous les produits bénéficient de la garantie légale de conformité (articles L217-3 et
          suivants du Code de la consommation) et de la garantie contre les vices cachés (articles
          1641 et suivants du Code civil). Le Client dispose de deux ans à compter de la délivrance
          pour agir en garantie de conformité, sans avoir à prouver l’antériorité du défaut.
        </p>
        <p>
          S’y ajoute une garantie commerciale de {site.warrantyMonths} mois couvrant les défauts de
          fabrication, qui ne se substitue pas aux garanties légales.
        </p>
      </LegalSection>

      <LegalSection title="8. Conformité et fin de vie du produit">
        <p>
          Les appareils vendus portent le marquage CE et respectent les restrictions applicables aux
          substances dangereuses. Ils contiennent une batterie lithium intégrée et ne doivent pas
          être jetés avec les ordures ménagères : ils sont repris gratuitement en déchèterie ou en
          magasin dans le cadre de la filière des déchets d’équipements électriques et
          électroniques.
        </p>
        <p>
          Identifiants uniques ADEME du Vendeur, communiqués en application de l’article L541-10-13
          du Code de l’environnement : filière équipements électriques et électroniques{' '}
          <Field value={operator.ademe.eee} label="identifiant unique filière EEE" />, filière piles
          et accumulateurs{' '}
          <Field value={operator.ademe.batteries} label="identifiant unique filière piles" />.
        </p>
      </LegalSection>

      <LegalSection title="9. Usage du produit">
        <p>
          Le produit est un appareil photo et vidéo destiné à un usage personnel et licite. Le Client
          demeure seul responsable de son utilisation. Il est notamment rappelé que la captation de
          l’image d’une personne à son insu dans un lieu privé, ainsi que la diffusion de son image
          sans son consentement, sont réprimées par les articles 226-1 et 226-2 du Code pénal.
        </p>
      </LegalSection>

      <LegalSection title="10. Responsabilité">
        <p>
          Le Vendeur est de plein droit responsable de la bonne exécution du contrat. Sa
          responsabilité ne saurait toutefois être engagée en cas d’inexécution imputable au Client,
          au fait imprévisible et insurmontable d’un tiers, ou à un cas de force majeure.
        </p>
      </LegalSection>

      <LegalSection title="11. Données personnelles">
        <p>
          Le traitement des données est décrit dans la{' '}
          <Link href={routes.privacy} className="underline underline-offset-2">
            politique de confidentialité
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection title="12. Litiges">
        <p>
          En cas de différend, le Client s’adresse en priorité au service client. À défaut d’accord,
          il peut recourir gratuitement au médiateur de la consommation dont les coordonnées
          figurent dans les{' '}
          <Link href={routes.legal} className="underline underline-offset-2">
            mentions légales
          </Link>
          . Les présentes conditions sont soumises au droit français.
        </p>
      </LegalSection>
    </LegalLayout>
  )
}
