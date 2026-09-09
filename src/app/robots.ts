import type { MetadataRoute } from 'next'
import { site } from '@/lib/site'

/** Généré à la compilation : indispensable sous `output: export`. */
export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Ces pages n'ont aucune valeur en recherche et diluent le crawl.
        disallow: ['/panier', '/merci', '/api/'],
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
  }
}
