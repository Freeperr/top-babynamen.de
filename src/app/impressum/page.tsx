import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Impressum – top-babynamen.de',
  description: 'Angaben gemäß § 5 DDG für top-babynamen.de',
};

export default function ImpressumPage() {
  return (
    <article className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-accent-deep transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Zurück zur Startseite
        </Link>
      </div>

      <header className="mb-10">
        <p className="eyebrow mb-3">Rechtliches</p>
        <h1 className="font-editorial text-[clamp(2rem,5vw,3rem)] leading-tight text-ink">
          Impressum
        </h1>
      </header>

      <div className="space-y-8 text-[0.95rem] text-ink-soft leading-relaxed">
        <section>
          <h2 className="text-base text-ink mb-3">Angaben gemäß § 5 DDG</h2>
          <p className="font-medium text-ink">Diensteanbieter:</p>
          <p className="mt-2 font-medium text-ink">MVC – Hamburg</p>
          <p>Frank Vomberg</p>
          <p>Hellgrundweg 109</p>
          <p>22525 Hamburg</p>
          <p>Deutschland</p>

          <div className="mt-4 space-y-1">
            <p>
              <strong className="text-ink">Telefon:</strong> +49 (0)40 3616679-41
            </p>
            <p>
              <strong className="text-ink">E-Mail:</strong>{' '}
              <a href="mailto:info@mvc-hamburg.de" className="underline underline-offset-2 hover:text-accent-deep">
                info@mvc-hamburg.de
              </a>
            </p>
            <p>
              <strong className="text-ink">Website:</strong>{' '}
              <a
                href="http://www.mvc-hamburg.de"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-accent-deep"
              >
                www.mvc-hamburg.de
              </a>
            </p>
          </div>

          <p className="mt-4">
            <strong className="text-ink">Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG:</strong>{' '}
            DE 245982133
          </p>
        </section>

        <section className="pt-6 border-t border-line">
          <h2 className="text-base text-ink mb-3">Verantwortlich für die Inhalte</h2>
          <p className="mb-2">Verantwortlich für die Inhalte dieser Website ist:</p>
          <p className="font-medium text-ink">Frank Vomberg</p>
          <p>MVC – Hamburg</p>
          <p>Hellgrundweg 109</p>
          <p>22525 Hamburg</p>
          <p>Deutschland</p>
        </section>

        <section className="pt-6 border-t border-line">
          <h2 className="text-base text-ink mb-2">Konzeption, Gestaltung und technische Umsetzung</h2>
          <p className="mb-2">
            Die Konzeption, Gestaltung und technische Umsetzung von{' '}
            <strong className="text-ink">top-babynamen.de</strong> erfolgte durch:
          </p>
          <p className="font-medium text-ink">Freeperr / freeperr.dev</p>
          <p>
            E-Mail:{' '}
            <a href="mailto:business@freeperr.dev" className="underline underline-offset-2 hover:text-accent-deep">
              business@freeperr.dev
            </a>
          </p>
          <p className="mt-2">
            Bei der Entwicklung der Website wurden teilweise KI-gestützte Werkzeuge und
            Technologien eingesetzt.
          </p>
        </section>

        <section className="pt-6 border-t border-line">
          <h2 className="text-base text-ink mb-2">Online-Vermarktung</h2>
          <p className="mb-2">
            Die Online-Vermarktung von <strong className="text-ink">top-babynamen.de</strong> erfolgt
            durch:
          </p>
          <p className="font-medium text-ink">vertical network media GmbH</p>
          <p className="mb-2">
            Bei Interesse an Werbemöglichkeiten auf top-babynamen.de oder innerhalb des Netzwerks:
          </p>
          <p>
            <strong className="text-ink">E-Mail:</strong>{' '}
            <a href="mailto:vermarktung@verticalnetwork.de" className="underline underline-offset-2 hover:text-accent-deep">
              vermarktung@verticalnetwork.de
            </a>
          </p>
        </section>

        <section className="pt-6 border-t border-line">
          <h2 className="text-base text-ink mb-2">Über top-babynamen.de</h2>
          <p className="mb-2">
            <strong className="text-ink">top-babynamen.de</strong> bietet Informationen und
            Übersichten rund um Babynamen. Dazu gehören unter anderem beliebte und häufig
            vergebene Vornamen sowie Informationen zu deren Verbreitung und Verwendung.
          </p>
          <p>
            Die Informationen basieren unter anderem auf öffentlich zugänglichen
            Namensstatistiken, eigenen Recherchen sowie weiteren öffentlich zugänglichen Quellen.
          </p>
        </section>

        <section className="pt-6 border-t border-line">
          <h2 className="text-base text-ink mb-2">Haftung für Inhalte</h2>
          <p className="mb-2">
            Die Inhalte dieser Website werden mit größtmöglicher Sorgfalt erstellt. Eine Gewähr für
            die Richtigkeit, Vollständigkeit und Aktualität der bereitgestellten Informationen kann
            jedoch nicht übernommen werden.
          </p>
          <p className="mb-2">
            Insbesondere bei Namensstatistiken und Ranglisten können sich Daten im Laufe der Zeit
            ändern oder je nach Quelle und Erhebungsmethode unterscheiden.
          </p>
          <p>Die Nutzung der bereitgestellten Informationen erfolgt auf eigene Verantwortung.</p>
        </section>

        <section className="pt-6 border-t border-line">
          <h2 className="text-base text-ink mb-2">Haftung für externe Links</h2>
          <p className="mb-2">
            Diese Website kann Links zu externen Websites Dritter enthalten. Auf deren Inhalte
            haben wir keinen Einfluss. Für die Inhalte der verlinkten Websites ist grundsätzlich
            der jeweilige Betreiber verantwortlich.
          </p>
          <p className="mb-2">
            Zum Zeitpunkt der Verlinkung waren keine rechtswidrigen Inhalte erkennbar.
          </p>
          <p className="mb-2">
            Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist ohne konkrete
            Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Sollten uns konkrete
            Rechtsverletzungen bekannt werden, werden entsprechende Links nach Prüfung entfernt.
          </p>
        </section>
      </div>
    </article>
  );
}