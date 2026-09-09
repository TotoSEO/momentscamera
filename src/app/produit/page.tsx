import type { Metadata } from 'next'
import { ProductPageClient } from '@/components/product/ProductPageClient'
import { UseCases } from '@/components/sections/UseCases'
import { Reviews } from '@/components/sections/Reviews'
import { Faq } from '@/components/sections/Faq'
import { FinalCta } from '@/components/sections/FinalCta'
import { Marquee } from '@/components/ui/Marquee'
import { marquee } from '@/content/copy'
import { JsonLd, faqJsonLd, productJsonLd } from '@/lib/structured-data'

export const metadata: Metadata = {
  title: 'Appareil photo porte-clés 1080p — 9 couleurs',
  description:
    "Un vrai appareil photo de 20 g accroché à vos clés. Vidéo 1080p, photo 5 MP, aucune appli à installer. 9 coloris, à partir de 29,90 €.",
  alternates: { canonical: '/produit' },
  openGraph: {
    title: 'Moments Caméra — appareil photo porte-clés 1080p',
    description:
      "Un vrai appareil photo de 20 g accroché à vos clés. Vidéo 1080p, photo 5 MP, 9 coloris.",
    url: '/produit',
  },
}

export default function ProduitPage() {
  return (
    <>
      <JsonLd data={[productJsonLd(), faqJsonLd()]} />
      <ProductPageClient />
      <Marquee items={marquee} className="bg-pop-yellow text-ink" duration="34s" />
      <UseCases />
      <Reviews />
      <Faq />
      <FinalCta />
    </>
  )
}
