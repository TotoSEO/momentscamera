import { faq } from '@/content/faq'
import { bundles, product } from '@/content/product'
import { site } from '@/lib/site'

/**
 * JSON-LD. Deux règles tenues ici :
 *  - aucun `aggregateRating` tant qu'il n'y a pas de vrais avis
 *    (Google sanctionne les notes inventées, et c'est de toute façon
 *    une pratique trompeuse) ;
 *  - les disponibilités et prix sont dérivés des données produit,
 *    jamais écrits en dur.
 */

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.name,
    url: site.url,
    email: site.email,
    description: site.description,
    sameAs: [site.instagram, site.tiktok],
  }
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.name,
    url: site.url,
    inLanguage: 'fr-FR',
  }
}

export function productJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${product.name} — ${product.subtitle}`,
    description: site.description,
    sku: product.sku,
    brand: { '@type': 'Brand', name: product.brand },
    color: product.colorways.map((c) => c.name),
    material: 'ABS',
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: site.currency,
      lowPrice: (Math.min(...bundles.map((b) => b.priceCents)) / 100).toFixed(2),
      highPrice: (Math.max(...bundles.map((b) => b.priceCents)) / 100).toFixed(2),
      offerCount: bundles.length,
      availability: 'https://schema.org/InStock',
      url: `${site.url}/produit`,
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'FR',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 30,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/FreeReturn',
      },
    },
  }
}

export function faqJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }
}

/** Injecte un ou plusieurs blocs JSON-LD. */
export function JsonLd({ data }: { data: object | object[] }) {
  const blocks = Array.isArray(data) ? data : [data]
  return (
    <>
      {blocks.map((block, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}
    </>
  )
}
