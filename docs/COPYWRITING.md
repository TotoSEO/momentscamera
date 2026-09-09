# Le copywriting du site

Tout le texte vit dans `src/content/` : `copy.ts` (sections marketing),
`faq.ts` (objections), `product.ts` (caractéristiques). Aucune chaîne
n’est écrite en dur dans un composant — vous pouvez tout réécrire sans
toucher au code.

## L’angle

Le produit ne se vend pas sur sa fiche technique : un capteur 1080p à
5 mégapixels perd contre n’importe quel téléphone. Il se vend sur ce que
le téléphone **fait perdre** :

> On n’a jamais pris autant de photos. Ni gardé aussi peu de souvenirs.

C’est l’angle directeur. Chaque section y revient. Le grain, la définition
modeste, l’absence d’appli ne sont pas des compromis à excuser : ce sont
les raisons pour lesquelles les photos ressemblent à des souvenirs plutôt
qu’à des publications.

Le produit renforce l’angle : il est littéralement estampillé **« 1984 »**
et « Record Anytime Anywhere », avec un balayage arc-en-ciel rétro. Le
site ne fait qu’amplifier ce que l’objet raconte déjà.

## Les cadres utilisés, et où

| Section | Cadre | Ce qu’elle doit produire |
| --- | --- | --- |
| Hero | **AIDA** — Attention, Interest | Comprendre en 3 secondes de quoi il s’agit |
| Problème | **PAS** — Problem, Agitation | Reconnaître son propre problème |
| Comment ça marche | **PAS** — Solution | Voir que c’est simple |
| Bénéfices | **AIDA** — Desire | Se projeter |
| Les moments | **BAB** — Before / After / Bridge | S’identifier à une situation précise |
| Offres | Ancrage de prix | Choisir le pack du milieu |
| Garanties + FAQ | Levée d’objections | Ne plus avoir de raison d’hésiter |
| CTA final | **AIDA** — Action | Cliquer |

**Choisir le bon cadre selon le trafic.** PAS convertit mieux (+22 % sur
12 400 pages analysées) mais suppose que le lecteur connaît déjà le
problème — parfait sur une audience froide venue de TikTok. AIDA convient
mieux à un trafic tiède issu du reciblage. Les deux sont ici, dans cet
ordre, ce qui couvre les deux cas.

## Les règles tenues

1. **Bénéfice d’abord, caractéristique ensuite.** « Plus rapide que votre
   réflexe » avant « 1080p ». Personne n’achète un capteur.
2. **Aucune fausse urgence.** Pas de faux compteur de stock, pas de
   minuteur qui se réinitialise au rechargement. Ces procédés augmentent
   la conversion à court terme et détruisent la confiance dès qu’ils sont
   repérés — et ils sont interdits par la directive Omnibus (UE 2019/2161).
3. **Les objections gênantes en face.** La FAQ dit franchement que ce
   n’est pas un reflex et que la lumière basse le met en difficulté. Un
   client bien informé est moins cher qu’un colis retourné.
4. **Aucun faux avis.** La section avis a été retirée du site plutôt que
   remplie d’exemples : publier de faux avis est une pratique commerciale
   trompeuse, punie jusqu’à 300 000 € (art. L121-2 du Code de la
   consommation). Elle reviendra alimentée par une base Supabase, avec les
   avis d’acheteurs réellement vérifiés.
5. **Chaque promesse est un engagement.** « 30 jours pour changer d’avis »,
   « garantie 12 mois », « expédié sous 24 h » : si vous ne pouvez pas les
   tenir, changez-les dans `src/lib/site.ts` et `copy.ts` **avant**
   d’ouvrir la boutique. Elles apparaissent aussi dans les CGV.

## Quand vous réécrivez

- Une phrase = une idée. Si vous devez relire, c’est trop long.
- Le titre de section doit se suffire à lui-même : beaucoup de visiteurs
  ne lisent que les titres.
- Testez d’abord le hero. C’est lui qui décide de tout le reste, et c’est
  aussi l’aperçu partagé sur les réseaux sociaux.
- Gardez les avis à 3 et 4 étoiles quand vous en aurez de vrais : une page
  100 % 5 étoiles inspire moins confiance qu’une page nuancée.

## Ressources

- [Landing page design — méthode « Vibe Discovery » et principes anti-slop](https://github.com/2389-research/landing-page-design)
- [awesome-design-md — systèmes de design de marques, exploitables par un agent](https://github.com/VoltAgent/awesome-design-md)
- [35 cadres de copywriting](https://www.gogochimp.com/blog/copywriting-frameworks)
- [Yoast — copywriting e-commerce, cadres et checklist](https://yoast.com/ecommerce-copywriting-tips-frameworks-that-convert-a-free-checklist/)
- [VWO — checklist CRO e-commerce 2026](https://vwo.com/blog/ecommerce-cro-checklist/)
- [Product page optimization, guide 2026](https://www.digitalapplied.com/blog/product-page-optimization-ecommerce-conversion-guide-2026)
