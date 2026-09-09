/**
 * Copy du site.
 *
 * Structure de persuasion (voir docs/COPYWRITING.md) :
 *   Hero .............. AIDA — Attention + Interest
 *   Problème .......... PAS  — Problem + Agitation
 *   Solution .......... PAS  — Solution
 *   Bénéfices ......... AIDA — Desire (bénéfice d'abord, spec ensuite)
 *   Usages ............ BAB  — Before / After / Bridge
 *   Preuve ............ réassurance
 *   Offre + FAQ ....... levée d'objections
 *   CTA final ......... AIDA — Action
 *
 * Règle tenue partout : une promesse = une chose que le produit fait
 * vraiment. Pas de fausse urgence, pas de faux compteurs de stock.
 */

export const hero = {
  eyebrow: '1080p · 26 grammes · Accroché à vos clés',
  title: 'Vos plus beaux moments ne sont pas dans votre téléphone.',
  subtitle:
    "Moments Caméra est un vrai appareil photo, de la taille d'un pouce, accroché à votre trousseau. Deux boutons, un écran de deux centimètres, un objectif grand-angle. Pas de notification, pas de « attends, je la refais ». Juste le moment, attrapé avant qu'il ne file.",
  primaryCta: 'Je prends le mien',
  secondaryCta: 'Voir ce que ça donne',
  reassurance: ['Livré en 3 à 5 jours', 'Payé, jamais content : remboursé', '9 couleurs'],
}

export const marquee = [
  'PHOTO + VIDÉO 1080P',
  'TIENT SUR VOS CLÉS',
  'PRÊT EN 1 SECONDE',
  '9 COULEURS',
  'AUCUNE APPLI À INSTALLER',
  'GRAND-ANGLE 130°',
  '26 GRAMMES',
]

/** PAS — on nomme le problème, on appuie, puis on ouvre. */
export const problem = {
  kicker: 'Le vrai problème',
  title: 'On n’a jamais pris autant de photos. Ni gardé aussi peu de souvenirs.',
  body: [
    "Votre téléphone contient des milliers de photos. Vous en avez revu une trentaine. Les autres dorment dans une pellicule que personne n'ouvre jamais.",
    "Et le pire, c'est le moment lui-même. Sortir le téléphone. Le déverrouiller. Fermer la notification qui vient de tomber. Ouvrir l'appareil photo. Cadrer. Recommencer parce que quelqu'un a cligné des yeux. Pendant ce temps, la scène est déjà passée, et vous n'y étiez plus vraiment.",
  ],
  stats: [
    { value: '8 000', label: 'photos en moyenne sur un téléphone' },
    { value: '< 1 %', label: 'qu’on regarde une seconde fois' },
    { value: '11 s', label: 'pour dégainer, déverrouiller et cadrer' },
  ],
}

export const solution = {
  kicker: 'Ce qu’on vous propose',
  title: 'Un appareil qui fait une seule chose. Très bien.',
  body: "Pas d'appli à installer. Pas de compte à créer. Pas de fil d'actualité qui vous attend au réveil de l'écran. Il est déjà dans votre main parce qu'il est sur vos clés, et vos clés, vous les avez toujours. Vous appuyez, ça capture, vous rangez. Vous découvrez le résultat plus tard, comme avant.",
  steps: [
    {
      n: '01',
      title: 'Il est déjà là',
      body: 'Accroché au trousseau, dans la poche. Rien à préparer, rien à déverrouiller.',
    },
    {
      n: '02',
      title: 'Un appui',
      body: 'Un clic pour la photo, un appui long pour la vidéo. L’autofocus fait le point tout seul. C’est tout.',
    },
    {
      n: '03',
      title: 'La surprise, plus tard',
      body: 'Vous le branchez en USB-C, il se monte comme une clé USB. Et vous redécouvrez la soirée.',
    },
  ],
}

/** Desire — chaque carte part du bénéfice, la spec vient en second. */
export const benefits = [
  {
    emoji: '⚡',
    title: 'Plus rapide que votre réflexe',
    body: 'Le temps que les autres déverrouillent leur téléphone, c’est déjà pris. Un bouton, aucun menu.',
    color: 'yellow',
  },
  {
    emoji: '🎞️',
    title: 'Le grain qui rend tout vrai',
    body: 'Ce n’est pas un reflex, et c’est exactement le sujet. Le rendu a le charme de l’argentique jetable : les photos ressemblent à des souvenirs, pas à des posts.',
    color: 'red',
  },
  {
    emoji: '🔇',
    title: 'Zéro notification',
    body: 'Son écran de 2,4 cm ne sait afficher qu’une chose : ce que vous filmez. Aucun badge rouge n’y arrivera jamais.',
    color: 'blue',
  },
  {
    emoji: '🪶',
    title: '26 grammes, vraiment',
    body: 'Vous oubliez qu’il est là jusqu’à la seconde où vous en avez besoin. Boîtier ABS, celui des manettes de jeu.',
    color: 'green',
  },
  {
    emoji: '📐',
    title: 'Grand-angle 130°',
    body: 'Tout le monde entre dans le cadre, même à bout de bras. Pas de bras tendu qui coupe la moitié du groupe.',
    color: 'lime',
  },
  {
    emoji: '🎨',
    title: '9 couleurs, dont une transparente',
    body: 'Rouge flash, jaune pop, bleu cobalt, vert menthe… et un boîtier translucide qui laisse voir l’électronique.',
    color: 'blue',
  },
]

/** BAB — la situation d'avant, la situation d'après. */
export const useCases = [
  {
    title: 'En festival',
    before: 'Téléphone à 4 % dès 19 h, photos floues de dos.',
    after: 'Il pèse rien, il craint rien, il filme le moment où tout le monde saute.',
    color: 'red',
  },
  {
    title: 'En soirée',
    before: 'Trois personnes en train de scroller sur le canapé.',
    after: 'Un appareil qui circule, et 200 photos que personne n’a posées.',
    color: 'yellow',
  },
  {
    title: 'En voyage',
    before: 'Sortir un gros appareil, hésiter, ranger, regretter.',
    after: 'Il est sur vos clés. La photo est prise avant même d’y penser.',
    color: 'blue',
  },
  {
    title: 'Avec les enfants',
    before: 'La scène parfaite dure deux secondes. Le téléphone en met onze.',
    after: 'Un clic. Vous l’avez. Et vous êtes resté présent.',
    color: 'green',
  },
  {
    title: 'Au sport',
    before: 'Personne ne veut sortir son iPhone à 1 200 € sur un skate.',
    after: 'Un appareil à 18,99 € qu’on accroche et qu’on oublie.',
    color: 'lime',
  },
  {
    title: 'À offrir',
    before: 'Encore une carte cadeau.',
    after: 'Un objet coloré, immédiatement compris, qu’on garde sur soi tous les jours.',
    color: 'red',
  },
]

/** Réassurance affichée près des CTA — chaque ligne est un engagement à tenir. */
export const guarantees = [
  {
    emoji: '📦',
    title: 'Livraison suivie 3-5 jours',
    body: 'Expédié depuis notre stock. Offerte dès 40 € d’achat.',
  },
  {
    emoji: '↩️',
    title: '30 jours pour changer d’avis',
    body: 'Le délai légal est de 14 jours. On le double, sans poser de question.',
  },
  {
    emoji: '🛡️',
    title: 'Garantie 12 mois',
    body: 'Un défaut ? On remplace. Vous parlez à un humain, pas à un formulaire.',
  },
  {
    emoji: '🔒',
    title: 'Paiement sécurisé',
    body: 'Carte, Apple Pay, Google Pay. Chiffré par Stripe, nous ne voyons jamais votre numéro.',
  },
]

export const finalCta = {
  kicker: 'Dernier truc',
  title: 'Le prochain moment qui vaut le coup arrive bientôt.',
  body: 'Il durera quelques secondes. Vous aurez soit un appareil dans la main, soit un téléphone à déverrouiller. À vous de voir.',
  cta: 'Je prends le mien',
  micro: 'À partir de 18,99 € · 30 jours pour changer d’avis',
}

export const productPage = {
  eyebrow: 'Appareil photo porte-clés',
  title: 'Moments Caméra',
  tagline: 'Photo et vidéo 1080p, grand-angle 130°. Sur votre trousseau. Prêt en une seconde.',
  bullets: [
    'Vidéo 1080p, photo jusqu’à 5 MP, autofocus',
    'Objectif grand-angle 130° et écran TFT 0,96 pouce',
    'Mémoire 1 Go intégrée, extensible en microSD',
    'Charge et transfert USB-C, aucune appli à installer',
    'Boîtier ABS, 26 g, œillet et anneau porte-clés métal',
  ],
  colorLabel: 'Choisissez votre couleur',
  bundleLabel: 'Choisissez votre pack',
  viewerHint: 'Faites tourner l’appareil avec le doigt ou la souris',
}
