import type { Metadata } from 'next';
import Script from 'next/script';
import { Spectral, Schibsted_Grotesk, Caveat } from 'next/font/google';
import './globals.css';
import { FavoritesProvider } from '@/context/FavoritesContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CookieConsent from '@/components/CookieConsent';

const schibsted = Schibsted_Grotesk({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const spectral = Spectral({
  variable: '--font-serif',
  subsets: ['latin'],
  display: 'swap',
  style: ['normal', 'italic'],
  weight: ['400', '500', '600'],
});

const caveat = Caveat({
  variable: '--font-caveat',
  subsets: ['latin'],
  display: 'swap',
  weight: ['700'],
});

export const metadata: Metadata = {
  title: 'babynamen.me – Beliebte und besondere Babynamen',
  description:
    'Beliebte Babynamen, schöne Klassiker und seltene Entdeckungen – mit Herkunft, Bedeutung und kleinen Namensspielen zum Stöbern.',
  keywords: [
    'Babynamen',
    'Mädchennamen',
    'Jungennamen',
    'Beliebte Vornamen',
    'Vornamen mit Bedeutung',
  ],
  openGraph: {
    title: 'babynamen.me – Namen, die man sich merkt',
    description:
      'Von beliebten Klassikern bis zu seltenen Entdeckungen: Stöbere durch Namen, schau dir Bedeutung und Herkunft an und speichere deine Favoriten.',
    url: 'https://babynamen.me',
    siteName: 'babynamen.me',
    locale: 'de_DE',
    type: 'website',
  },
  icons: {
    icon: [{ url: '/favicon.png', sizes: 'any', type: 'image/png' }],
    apple: [{ url: '/favicon.png', sizes: '180x180', type: 'image/png' }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" className={`${schibsted.variable} ${spectral.variable} ${caveat.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-paper text-ink font-sans">
        <Script id="consent-mode-init" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){ window.dataLayer.push(arguments); }
            window.gtag = gtag;
            gtag('consent', 'default', {
              ad_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied',
              analytics_storage: 'denied',
              wait_for_update: 500
            });
          `}
        </Script>
        <FavoritesProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <CookieConsent />
        </FavoritesProvider>
      </body>
    </html>
  );
}