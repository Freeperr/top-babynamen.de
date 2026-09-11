import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Search } from 'lucide-react';

export const metadata = {
  title: 'Seite nicht gefunden – babynamen.me',
};

export default function NotFound() {
  return (
    <article className="max-w-lg mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center">
      <p className="kicker mb-3">Fehler 404</p>
      <h1 className="font-editorial text-[clamp(2.5rem,10vw,4rem)] leading-none text-ink mb-4">
        Diesen Namen kennen wir nicht
      </h1>
      <p className="text-ink-soft text-[0.975rem] leading-relaxed mb-8">
        Die Seite, die du suchst, gibt es nicht &ndash; oder sie ist umgezogen.
        Vielleicht findest du, wonach du suchst, in unserer Namensübersicht.
      </p>

      <div className="flex items-center justify-center gap-3 flex-wrap">
        <Link href="/" className="btn btn-primary">
          <ArrowLeft className="w-4 h-4" />
          Zur Startseite
        </Link>
        <Link href="/babynamen" className="btn btn-secondary">
          <Search className="w-4 h-4" />
          Namen durchsuchen
        </Link>
      </div>
    </article>
  );
}
