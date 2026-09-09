/**
 * ⚠️ CONTENU DE DÉMONSTRATION.
 *
 * Les avis ci-dessous sont des EXEMPLES destinés à valider la mise en page.
 * Ce ne sont PAS de vrais avis clients.
 *
 * Publier de faux avis est une pratique commerciale trompeuse (art. L121-2 du
 * Code de la consommation, directive Omnibus UE 2019/2161) : sanctionnée
 * jusqu'à 300 000 € et 2 ans d'emprisonnement pour une personne physique.
 *
 * Tant que `REVIEWS_ARE_DEMO` vaut `true`, l'interface affiche un bandeau
 * indiquant clairement qu'il s'agit d'exemples. Dès que vous branchez de
 * vrais avis vérifiés (Judge.me, Trustpilot, Loox…), remplacez ce tableau
 * et passez le drapeau à `false`.
 */

export const REVIEWS_ARE_DEMO = true

export type Review = {
  name: string
  location: string
  rating: 1 | 2 | 3 | 4 | 5
  title: string
  body: string
  colorway: string
}

export const reviews: Review[] = [
  {
    name: 'Prénom N.',
    location: 'Lyon',
    rating: 5,
    title: 'Exemple de mise en page',
    body: 'Emplacement réservé à un avis vérifié. Remplacez ce texte par le contenu remonté depuis votre solution d’avis clients.',
    colorway: 'Rouge Flash',
  },
  {
    name: 'Prénom N.',
    location: 'Bordeaux',
    rating: 5,
    title: 'Exemple de mise en page',
    body: 'Emplacement réservé à un avis vérifié. Les avis les plus utiles décrivent un usage concret et une objection levée.',
    colorway: 'Bleu Cobalt',
  },
  {
    name: 'Prénom N.',
    location: 'Nantes',
    rating: 4,
    title: 'Exemple de mise en page',
    body: 'Emplacement réservé à un avis vérifié. Gardez aussi les avis 3 et 4 étoiles : une page 100 % 5 étoiles inspire moins confiance.',
    colorway: 'Jaune Pop',
  },
  {
    name: 'Prénom N.',
    location: 'Lille',
    rating: 5,
    title: 'Exemple de mise en page',
    body: 'Emplacement réservé à un avis vérifié. Mentionnez la couleur commandée : cela aide à la décision sur un produit très coloré.',
    colorway: 'Vert Menthe',
  },
  {
    name: 'Prénom N.',
    location: 'Toulouse',
    rating: 5,
    title: 'Exemple de mise en page',
    body: 'Emplacement réservé à un avis vérifié. Les photos clients convertissent davantage que le texte seul.',
    colorway: 'Transparent',
  },
  {
    name: 'Prénom N.',
    location: 'Strasbourg',
    rating: 4,
    title: 'Exemple de mise en page',
    body: 'Emplacement réservé à un avis vérifié. Pensez à répondre publiquement aux avis mitigés : c’est un signal de confiance fort.',
    colorway: 'Noir Mat',
  },
]
