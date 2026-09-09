import type { Metadata, Viewport } from 'next'
import { Fredoka, Nunito, Space_Mono } from 'next/font/google'
import { site } from '@/lib/site'
import { SmoothScroll } from '@/components/SmoothScroll'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { CartProvider } from '@/components/cart/CartProvider'
import './globals.css'

/* Typo : rond, épais, joyeux. On évite volontairement Inter / Roboto. */
const fredoka = Fredoka({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-fredoka',
  display: 'swap',
})

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-nunito',
  display: 'swap',
})

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  keywords: [
    'appareil photo porte-clés',
    'mini caméra',
    'caméra porte clé 1080p',
    'appareil photo miniature',
    'cadeau original',
    'appareil photo jetable numérique',
  ],
  authors: [{ name: site.name }],
  openGraph: {
    type: 'website',
    locale: site.locale,
    url: site.url,
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    images: [{ url: `${site.url}/og.svg`, width: 1200, height: 630, alt: site.tagline }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    images: [`${site.url}/og.svg`],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: '/' },
}

export const viewport: Viewport = {
  themeColor: '#fff6e9',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={site.lang} className={`${fredoka.variable} ${nunito.variable} ${spaceMono.variable}`}>
      <body className="grain min-h-dvh antialiased">
        <SmoothScroll />
        <CartProvider>
          <a
            href="#contenu"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded-full focus:border-3 focus:border-ink focus:bg-pop-yellow focus:px-5 focus:py-2 focus:font-display focus:font-bold"
          >
            Aller au contenu
          </a>
          <Nav />
          <main id="contenu">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  )
}
