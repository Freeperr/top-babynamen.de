import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';
import { WORLD_COUNTRIES, getCountryBySlug } from '@/data/worldNames';
import WeltweitCountryView from '@/components/WeltweitCountryView';

interface PageProps {
  params: Promise<{ country: string }>;
}

export async function generateStaticParams() {
  return WORLD_COUNTRIES.map((c) => ({ country: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { country: slug } = await params;
  const country = getCountryBySlug(slug);

  if (!country) {
    return { title: 'Land nicht gefunden | babynamen.me' };
  }

  return {
    title: `Beliebteste Babynamen in ${country.name} | babynamen.me`,
    description: `Die Top 10 Mädchennamen und Jungennamen in ${country.name}, mit Herkunft, Bedeutung und Steckbrief zu jedem Namen.`,
  };
}

export default async function WeltweitCountryPage({ params }: PageProps) {
  const { country: slug } = await params;
  const country = getCountryBySlug(slug);

  if (!country) {
    notFound();
  }

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <div className="mb-8">
        <Link
          href="/beliebte-namen-weltweit"
          className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-blue-deep transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Alle Länder
        </Link>
      </div>

      <header className="mb-10">
        <p className="kicker mb-3">Weltweit</p>
        <h1 className="font-editorial text-[clamp(2rem,5vw,3rem)] leading-tight text-ink">
          Die beliebtesten Babynamen in {country.name}
        </h1>
        <p className="mt-3 text-ink-soft text-[0.95rem] leading-relaxed max-w-xl">
          Die zehn beliebtesten Mädchennamen und Jungennamen in {country.name}.
          Klicke auf einen Namen, um seinen Steckbrief mit Herkunft und
          Bedeutung zu sehen.
        </p>
      </header>

      <WeltweitCountryView country={country} />

      {/* Source */}
      <div className="mt-12 pt-6 border-t border-line">
        <p className="text-xs text-fade leading-relaxed">
          <strong className="text-ink-soft">Quelle:</strong> {country.source}.
        </p>
      </div>
    </article>
  );
}
