import type { Metadata } from 'next'
import { ThankYouClient } from '@/components/cart/ThankYouClient'

export const metadata: Metadata = {
  title: 'Merci pour votre commande',
  description: 'Votre commande Moments Caméra est confirmée.',
  robots: { index: false, follow: false },
}

export default function MerciPage() {
  return <ThankYouClient />
}
