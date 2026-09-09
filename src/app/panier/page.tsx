import type { Metadata } from 'next'
import { CartPageClient } from '@/components/cart/CartPageClient'

export const metadata: Metadata = {
  title: 'Mon panier',
  description: 'Récapitulatif de votre commande Moments Caméra.',
  robots: { index: false, follow: true },
}

export default function PanierPage() {
  return <CartPageClient />
}
