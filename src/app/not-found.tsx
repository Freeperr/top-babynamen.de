import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="flex-1">
      <section className="max-w-2xl mx-auto px-4 sm:px-6 py-24 sm:py-32 text-center">
        <p className="font-editorial text-[5rem] sm:text-[7rem] leading-none text-blue-soft">
          404
        </p>
        <h1 className="font-editorial text-[clamp(1.8rem,4vw,2.6rem)] leading-tight text-ink mt-6 mb-4">
          Diese Seite gibt es leider nicht.
        </h1>
        <p className="text-ink-soft text-[0.95rem] max-w-md mx-auto mb-10">
          Der gesuchte Name oder Link existiert nicht (mehr).
        </p>
        <Link href="/" className="btn btn-primary">
          <ArrowLeft className="w-4 h-4" />
          Zurück zur Startseite
        </Link>
      </section>
    </main>
  );
}