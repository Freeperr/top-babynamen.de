import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getNameById, getAllNames, getSimilarNames } from '@/lib/nameService';
import NameDetailClient from './NameDetailClient';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const names = getAllNames();
  return names.map((name) => ({
    slug: name.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const name = getNameById(slug);

  if (!name) {
    return {
      title: 'Name nicht gefunden | babynamen.me',
    };
  }

  const genderStr = name.gender === 'girl' ? 'Mädchenname' : name.gender === 'boy' ? 'Jungenname' : 'Unisex-Name';

  return {
    title: `${name.name} | Bedeutung, Herkunft & Beliebtheit | babynamen.me`,
    description: `Alles über den Vornamen ${name.name} (${genderStr}): Herkunft (${name.origin}), Bedeutung („${name.meaning}“), aktueller Trend und passende Geschwisternamen.`,
  };
}

export default async function NameDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const name = getNameById(slug);

  if (!name) {
    notFound();
  }

  const similar = getSimilarNames(name.id);

  return <NameDetailClient name={name} similarNames={similar} />;
}
