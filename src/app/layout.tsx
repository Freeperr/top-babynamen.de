import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Newsreader, Caveat } from 'next/font/google';
import './globals.css';
import { FavoritesProvider } from '@/context/FavoritesContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CookieConsent from '@/components/CookieConsent';

const plusJakarta = Plus_Jakarta_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const newsreader = Newsreader({
  variable: '--font-serif',
  subsets: ['latin'],
  display: 'swap',
  style: ['normal', 'italic'],
  weight: ['400', '500', '600'],
});

const caveat = Caveat({
  variable: '--font-hand',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'top-babynamen.de – Beliebte und besondere Babynamen',
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
    title: 'top-babynamen.de – Namen, die man sich merkt',
    description:
      'Von beliebten Klassikern bis zu seltenen Entdeckungen: Stöbere durch Namen, schau dir Bedeutung und Herkunft an und speichere deine Favoriten.',
    url: 'https://top-babynamen.de',
    siteName: 'top-babynamen.de',
    locale: 'de_DE',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" className={`${plusJakarta.variable} ${newsreader.variable} ${caveat.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-paper text-ink font-sans">
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