import { Hero } from '@/components/sections/Hero'
import { Problem } from '@/components/sections/Problem'
import { HowItWorks } from '@/components/sections/HowItWorks'
import { Benefits } from '@/components/sections/Benefits'
import { Colors } from '@/components/sections/Colors'
import { VideoWall } from '@/components/sections/VideoWall'
import { UseCases } from '@/components/sections/UseCases'
import { Offers } from '@/components/sections/Offers'
import { Reviews } from '@/components/sections/Reviews'
import { Guarantees } from '@/components/sections/Guarantees'
import { Faq } from '@/components/sections/Faq'
import { FinalCta } from '@/components/sections/FinalCta'
import { Marquee } from '@/components/ui/Marquee'
import { marquee } from '@/content/copy'
import { JsonLd, faqJsonLd, organizationJsonLd, productJsonLd, websiteJsonLd } from '@/lib/structured-data'

export default function HomePage() {
  return (
    <>
      <JsonLd data={[organizationJsonLd(), websiteJsonLd(), productJsonLd(), faqJsonLd()]} />

      <Hero />
      <Marquee items={marquee} className="bg-pop-red text-white" duration="34s" />
      <Problem />
      <HowItWorks />
      <Benefits />
      <Colors />
      <VideoWall />
      <UseCases />
      <Offers />
      <Reviews />
      <Guarantees />
      <Faq />
      <FinalCta />
    </>
  )
}
