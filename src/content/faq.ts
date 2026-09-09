/**
 * FAQ = levée d'objections, dans l'ordre où elles arrivent réellement
 * dans la tête de l'acheteur. Les questions gênantes sont traitées
 * franchement : une objection esquivée devient un panier abandonné.
 *
 * Les réponses alimentent aussi le JSON-LD `FAQPage` (SEO).
 */

export type FaqItem = { q: string; a: string }

export const faq: FaqItem[] = [
  {
    q: 'La qualité photo est-elle vraiment bonne ?',
    a: "Soyons directs : ce n'est pas un reflex, et ce n'est pas non plus le dernier iPhone. C'est un capteur minuscule qui filme en 1080p et photographie jusqu'à 5 MP, derrière un objectif grand-angle 130° avec autofocus. Le rendu a du grain, les couleurs sont franches, la lumière basse le met en difficulté malgré la LED d'appoint. C'est précisément ce qui plaît : les photos ressemblent à celles d'un appareil jetable, pas à une publicité. Si vous cherchez une qualité studio, ce produit n'est pas pour vous, et on préfère vous le dire avant.",
  },
  {
    q: 'Combien de temps tient la batterie ?',
    a: "Environ 45 minutes d'enregistrement vidéo continu, ou plusieurs centaines de photos, sur une charge complète. La recharge prend une à une heure trente en USB. En usage réel (quelques photos et clips dans la journée), vous rechargez une à deux fois par semaine.",
  },
  {
    q: 'Combien de photos peut-il stocker ?',
    a: "Il embarque 1 Go de mémoire interne, soit environ 10 minutes de vidéo 1080p ou plusieurs centaines de photos. Un port microSD accepte une carte jusqu'à 32 Go si vous voulez filmer beaucoup plus. La carte n'est pas incluse.",
  },
  {
    q: 'Faut-il installer une application ?',
    a: "Non, et c'est volontaire. Vous branchez l'appareil en USB-C sur un ordinateur : il apparaît comme une clé USB. Vous glissez vos fichiers, c'est terminé. Pas de compte, pas de cloud, pas de mise à jour. Vos images restent chez vous.",
  },
  {
    q: 'Est-ce qu’il se connecte à mon téléphone ?',
    a: "Il n'a ni Wi-Fi ni Bluetooth : pas d'appairage, pas d'appli. En revanche, son port USB-C permet de le brancher directement sur un téléphone Android ou un iPhone récent avec un câble USB-C, et de récupérer les fichiers comme depuis une clé. Sur un ordinateur, c'est immédiat. Ce choix est assumé : c'est lui qui permet ce format, ce prix et cette simplicité.",
  },
  {
    q: 'À quoi sert l’écran, s’il est si petit ?',
    a: "L'écran TFT de 0,96 pouce, soit environ 2,4 cm de diagonale, sert à deux choses : cadrer avant d'appuyer, et revoir la dernière prise sur place. Il ne remplace pas l'écran d'un téléphone et ce n'est pas son rôle : il n'affiche que ce que voit l'objectif. C'est justement pour ça qu'on peut le sortir en soirée sans y perdre vingt minutes.",
  },
  {
    q: 'Est-ce légal de filmer avec ?',
    a: "Oui, dans le même cadre que n'importe quel appareil photo. Ce qui compte, c'est l'usage : en France, filmer ou photographier une personne à son insu dans un lieu privé est un délit (art. 226-1 du Code pénal), et la diffusion sans accord l'est aussi. Moments Caméra est conçu pour capturer vos moments avec des gens qui savent que vous les prenez en photo. Ce n'est pas un outil de surveillance, et nous ne le vendons pas comme tel.",
  },
  {
    q: 'Est-il résistant ?',
    a: "Le boîtier est en ABS renforcé, le même plastique que les manettes de jeu : à 26 g pour 6 cm, il encaisse les chutes de poche et les clés qui frottent. En revanche il n'est pas étanche : il supporte quelques gouttes, pas la piscine ni une averse prolongée.",
  },
  {
    q: 'Quels sont les délais de livraison ?',
    a: "Comptez 3 à 5 jours ouvrés en France métropolitaine, avec suivi. La livraison est offerte à partir de 40 € d'achat, sinon elle est à 3,90 €. Vous recevez le numéro de suivi par e-mail dès l'expédition.",
  },
  {
    q: 'Et si ça ne me plaît pas ?',
    a: "Vous avez 30 jours pour nous le renvoyer et être remboursé. Le délai légal de rétractation est de 14 jours, nous le doublons. L'appareil doit simplement revenir complet et en état de fonctionner. On ne demande pas de justification.",
  },
  {
    q: 'Y a-t-il une garantie ?',
    a: "12 mois sur les défauts de fabrication, en plus des garanties légales de conformité et des vices cachés prévues par le Code de la consommation. Un souci : vous écrivez, un humain répond, on remplace.",
  },
  {
    q: 'Puis-je choisir des couleurs différentes dans un pack ?',
    a: "Oui. Sur les packs Duo et La Bande, vous sélectionnez la couleur de chaque appareil avant d'ajouter au panier. Neuf coloris sont disponibles, dont un boîtier transparent.",
  },
  {
    q: 'Le paiement est-il sécurisé ?',
    a: "Le paiement est traité par Stripe, en 3D Secure. Carte bancaire, Apple Pay et Google Pay sont acceptés. Vos données de carte transitent chiffrées vers Stripe et ne passent jamais par nos serveurs.",
  },
]
