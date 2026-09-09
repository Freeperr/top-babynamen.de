import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Impressum – babynamen.me',
  description: 'Angaben gemäß § 5 DDG für babynamen.me',
};

export default function ImpressumPage() {
  return (
    <article className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-blue-deep transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Zurück zur Startseite
        </Link>
      </div>

      <header className="mb-10">
        <p className="kicker mb-3">Rechtliches</p>
        <h1 className="font-editorial text-[clamp(2rem,5vw,3rem)] leading-tight text-ink">
          Impressum
        </h1>
      </header>

      <div className="space-y-8 text-[0.95rem] text-ink-soft leading-relaxed">
        <section>
          <h2 className="text-base text-ink mb-3">Angaben gemäß § 5 DDG</h2>
          <p className="font-medium text-ink">Diensteanbieter:</p>
          <p className="mt-2 font-medium text-ink">PROMOTION UNION GMBH</p>
          <p>Hellgrundweg 109</p>
          <p>22525 Hamburg</p>
          <p>Deutschland</p>
          <p className="mt-2">
            Vertreten durch: Herrn Frank Vomberg
          </p>

          <div className="mt-4 space-y-1">
            <p>
              <strong className="text-ink">E-Mail:</strong>{' '}
              <a href="mailto:info@promotionunion.de" className="underline underline-offset-2 hover:text-blue-deep">
                info@promotionunion.de
              </a>
            </p>
            <p>
              <strong className="text-ink">Telefon:</strong> 040 3616679/00
            </p>
            <p>
              <strong className="text-ink">Telefax:</strong> 040 3616679/68
            </p>
          </div>

          <p className="mt-4">
            <strong className="text-ink">Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG:</strong>{' '}
            DE243027167
          </p>
          <p>
            <strong className="text-ink">Sitz der Gesellschaft:</strong> Hamburg
          </p>
          <p>
            <strong className="text-ink">Registergericht:</strong> Amtsgericht Hamburg, HRB 94862
          </p>
        </section>

        <section className="pt-6 border-t border-line">
          <h2 className="text-base text-ink mb-3">Verantwortlich für die Inhalte</h2>
          <p className="mb-2">Verantwortlich für die Inhalte dieser Website ist:</p>
          <p className="font-medium text-ink">PROMOTION UNION GMBH</p>
          <p>vertreten durch Herrn Frank Vomberg</p>
          <p>Hellgrundweg 109</p>
          <p>22525 Hamburg</p>
          <p>Deutschland</p>
        </section>

        <section className="pt-6 border-t border-line">
          <h2 className="text-base text-ink mb-2">Konzeption, Gestaltung und technische Umsetzung</h2>
          <p className="mb-2">
            Die Konzeption, Gestaltung und technische Umsetzung von{' '}
            <strong className="text-ink">babynamen.me</strong> erfolgte durch:
          </p>
          <p className="font-medium text-ink">Freeperr / freeperr.dev</p>
          <p>
            E-Mail:{' '}
            <a href="mailto:business@freeperr.dev" className="underline underline-offset-2 hover:text-blue-deep">
              business@freeperr.dev
            </a>
          </p>
          <p className="mt-2">
            Bei der Entwicklung der Website wurden teilweise KI-gestützte Werkzeuge und
            Technologien eingesetzt.
          </p>
        </section>

        <section className="pt-6 border-t border-line">
          <h2 className="text-base text-ink mb-2">Über babynamen.me</h2>
          <p className="mb-2">
            <strong className="text-ink">babynamen.me</strong> bietet Informationen und
            Übersichten rund um Babynamen. Dazu gehören unter anderem beliebte und häufig
            vergebene Vornamen sowie Informationen zu deren Verbreitung und Verwendung.
          </p>
          <p>
            Die Informationen basieren unter anderem auf öffentlich zugänglichen
            Namensstatistiken, eigenen Recherchen sowie weiteren öffentlich zugänglichen Quellen.
          </p>
        </section>

        <section className="pt-6 border-t border-line">
          <h2 className="text-base text-ink mb-2">Hinweis zu Namensranglisten und Statistiken</h2>
          <p className="mb-2">
            Die auf <strong className="text-ink">babynamen.me</strong> dargestellten Ranglisten,
            Platzierungen und Statistiken zu Vornamen dienen ausschließlich der Information.
          </p>
          <p className="mb-2">
            Die genaue Platzierung oder Beliebtheit eines Namens kann je nach Quelle, Land,
            Zeitraum, Erhebungsmethode und Datenbasis unterschiedlich ausfallen. Insbesondere bei
            einzelnen Namen kann es daher zu Abweichungen zwischen verschiedenen Quellen und
            Statistiken kommen.
          </p>
          <p>
            Wir übernehmen keine Gewähr für die vollständige Genauigkeit, Aktualität oder
            Übereinstimmung der dargestellten Ranglisten mit anderen öffentlich verfügbaren
            Namensstatistiken. Für mögliche Abweichungen oder Unterschiede zwischen verschiedenen
            Quellen wird keine Verantwortung übernommen.
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