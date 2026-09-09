import type { MetadataRoute } from 'next'
import { routes, site } from '@/lib/site'

/** Généré à la compilation : indispensable sous `output: export`. */
export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  return [
    { url: `${site.url}${routes.home}`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${site.url}${routes.product}`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${site.url}${routes.shipping}`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${site.url}${routes.cgv}`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${site.url}${routes.legal}`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${site.url}${routes.privacy}`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
  ]
}
