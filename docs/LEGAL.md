# Ouvrir la boutique légalement

> Ce document est une synthèse de recherche, pas un conseil juridique. Il sert à
> savoir quoi demander à un comptable ou à un avocat, et dans quel ordre.
> Références vérifiées en septembre 2026.

## La réponse courte

**Non, pas encore.** Diffuser de la publicité pour vendre un produit, c'est déjà
exercer l'activité. Avant la première publicité et avant la première commande, il
faut être immatriculé. Concrètement : une déclaration au guichet unique de
l'INPI, gratuite, qui prend une à quatre semaines.

Les pages légales de `quiz-couple.com` indiquent aujourd'hui « Particulier
(personne physique) », sans SIREN ni RCS. C'est cohérent pour un site de contenu,
mais ce n'est pas un statut qui permet de vendre des marchandises.

## Pourquoi l'immatriculation n'est pas optionnelle

Acheter pour revendre est un acte de commerce (art. L110-1 du Code de commerce).
Accompli de manière habituelle et à but lucratif, il fait de vous un commerçant,
avec obligation de vous immatriculer.

Vendre sans être immatriculé est qualifié de **travail dissimulé par
dissimulation d'activité** (art. L8221-3 du Code du travail) : trois ans
d'emprisonnement et 45 000 € d'amende (art. L8224-1), auxquels s'ajoutent le
redressement des cotisations sociales et le redressement fiscal.

Le seuil n'est pas un montant : c'est le caractère habituel. Une seule campagne
publicitaire renvoyant vers un tunnel de paiement suffit à caractériser
l'intention commerciale.

Deux contraintes pratiques s'ajoutent :

- Ouvrir un compte publicitaire Meta ou TikTok demande de vérifier une entité,
  et le règlement européen sur les services numériques renforce l'identification
  des annonceurs.
- Stripe demande un identifiant d'entreprise pour activer les paiements en
  production. Le compte reste bloqué en mode test sans cela.

## La marche à suivre, dans l'ordre

### 1. Immatriculer l'activité

Sur [procedures.inpi.fr](https://procedures.inpi.fr), guichet unique depuis 2023.
Activité : achat pour revente de marchandises. Régime le plus simple pour
démarrer : entreprise individuelle au régime micro (micro-entrepreneur).

Ce que ça produit : un SIREN, un SIRET, un code APE, une inscription au registre
national des entreprises et au registre du commerce et des sociétés. Gratuit pour
une activité non réglementée, une à quatre semaines de délai.

Ensuite, la mention « EI » doit figurer à côté de votre nom sur les documents
commerciaux, et un compte bancaire dédié devient obligatoire si le chiffre
d'affaires dépasse 10 000 € deux années de suite.

### 2. Choisir le régime de TVA

Seuils 2026 pour la vente de marchandises : franchise en base jusqu'à **85 000 €**
de chiffre d'affaires encaissé, seuil majoré à **93 500 €**. En franchise, vous ne
facturez pas la TVA et vos factures portent la mention « TVA non applicable,
article 293 B du CGI ».

Attention : la franchise en base ne dispense pas de la **TVA à l'importation**,
due à l'entrée des marchandises dans l'Union européenne. Pour les envois d'une
valeur inférieure à 150 €, le guichet IOSS permet de collecter cette TVA au moment
du paiement plutôt qu'à la livraison. C'est ce que promettent les CGV du site : le
prix affiché est un prix rendu destination, sans supplément à la livraison.

Le régime se règle dans `src/lib/legal.ts`, constante `vatRegime`.

### 3. Obtenir un numéro EORI

Obligatoire pour toute opération douanière. Depuis le 1er janvier 2026, le format
est FR suivi des neuf chiffres du SIREN, et l'attribution est automatique via le
portail France Sésame de la douane. Gratuit, actif sous 24 à 72 heures.

### 4. Adhérer aux filières REP

Un appareil photo est un équipement électrique et électronique, il contient une
batterie et il arrive dans un emballage. Trois filières à responsabilité élargie
du producteur, donc trois adhésions à un éco-organisme (Ecologic ou ecosystem pour
les DEEE et les piles, Citeo pour les emballages).

Chaque adhésion donne un **identifiant unique ADEME**, qui doit être communiqué
dans les conditions générales de vente (art. L541-10-13 du Code de
l'environnement). Les trois identifiants se renseignent dans `operator.ademe`.

Importer soi-même depuis la Chine fait de vous le producteur au sens de la
réglementation : personne d'autre ne portera cette obligation à votre place.

### 5. Adhérer à un dispositif de médiation

Obligatoire pour tout professionnel vendant à des consommateurs (art. L612-1 du
Code de la consommation). Les coordonnées du médiateur doivent figurer sur le site
et dans les CGV. Compter quelques dizaines d'euros par an.

### 6. Vérifier la conformité du produit

À demander au fournisseur avant la première commande, par écrit :

- déclaration UE de conformité et marquage CE ;
- rapport RoHS sur les substances dangereuses ;
- fiche de sécurité de la batterie lithium (test UN 38.3, obligatoire pour le
  transport aérien) ;
- notice d'utilisation en français.

En tant qu'importateur dans l'Union européenne, vous êtes assimilé au producteur
pour la responsabilité du fait des produits défectueux (art. 1245-6 du Code
civil). Si la batterie d'un appareil provoque un dommage, c'est vous qui répondez,
pas l'usine.

### 7. Assurance

La responsabilité civile professionnelle n'est pas obligatoire pour cette activité,
mais elle est vivement recommandée au vu du point précédent.

## Ce qui est possible dès maintenant, sans immatriculation

- Construire et publier le site, tant qu'aucune commande ne peut être encaissée.
- Publier du contenu organique qui présente le projet, sans tunnel d'achat actif.
- Collecter des adresses e-mail pour une liste d'attente, avec une mention
  d'information conforme au RGPD.
- Préparer les créations publicitaires, commander un échantillon, négocier avec le
  fournisseur.

Ce qui doit attendre le SIREN : la publicité payante, le bouton d'achat, la
première facture.

## Quand la publicité démarrera

Installer un pixel Meta, TikTok ou Google change deux choses sur ce site :

1. La page Confidentialité affirme aujourd'hui qu'aucun traceur publicitaire n'est
   déposé. Elle devient fausse le jour de l'installation et doit être mise à jour.
2. Une bannière de consentement conforme aux lignes directrices de la CNIL devient
   obligatoire : refuser doit être aussi simple qu'accepter, et rien ne se
   déclenche avant le choix de l'internaute.

Deux points de vigilance sur le contenu des annonces :

- Ne jamais présenter le produit comme une caméra espion ou un appareil de
  captation discrète. La captation de l'image d'une personne à son insu dans un
  lieu privé est réprimée par l'article 226-1 du Code pénal, et un tel
  positionnement marketing attirerait cette qualification.
- Ne jamais annoncer un délai de livraison que le fournisseur ne tient pas.
  C'est une pratique commerciale trompeuse (art. L121-2 du Code de la
  consommation), et le vendeur reste responsable du délai même quand c'est le
  fournisseur qui expédie. Le délai annoncé sur tout le site vient d'une seule
  constante, `site.deliveryDays`.

## Comment le code suit tout ça

Toutes les informations légales de l'exploitant vivent dans
[`src/lib/legal.ts`](../src/lib/legal.ts).

- Un champ à `null` s'affiche comme un marqueur `[à compléter]` sur les pages
  légales, au lieu d'une valeur inventée.
- La constante `canSellLegally` devient vraie quand la forme juridique, le SIREN,
  l'adresse, le téléphone, le médiateur et l'identifiant DEEE sont renseignés.
- Le bandeau jaune « Document à compléter avant la première vente » disparaît
  automatiquement à ce moment-là, sur les quatre pages légales.

Il n'y a donc rien à modifier dans les pages elles-mêmes : renseigner
`src/lib/legal.ts` suffit.

## Checklist avant la première vente

- [ ] SIREN obtenu au guichet unique de l'INPI
- [ ] Adresse postale et téléphone du service client publiés
- [ ] Numéro EORI activé
- [ ] Régime de TVA arbitré, IOSS en place si expédition hors Union européenne
- [ ] Adhésions REP faites, identifiants ADEME publiés dans les CGV
- [ ] Médiateur de la consommation désigné
- [ ] Déclaration UE de conformité et rapport RoHS reçus du fournisseur
- [ ] Échantillon commandé et caractéristiques techniques vérifiées
- [ ] `src/lib/legal.ts` complété, bandeau jaune disparu
- [ ] Site déployé sur Vercel avec les clés Stripe en production
- [ ] Pages légales relues par un professionnel
