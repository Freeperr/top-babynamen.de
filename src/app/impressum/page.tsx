import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Impressum – top-babynamen.de',
  description: 'Angaben gemäß § 5 DDG für top-babynamen.de',
};

export default function ImpressumPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-[#777777] hover:text-[#FF4F87] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Zurück zur Startseite</span>
        </Link>
      </div>

      <div className="bg-white rounded-[24px] border border-[#F0E4E7] p-8 sm:p-14 shadow-xs">
        <h1 className="font-editorial text-4xl sm:text-5xl font-normal text-[#171717] tracking-tight mb-8">
          Impressum
        </h1>

        <div className="space-y-8 text-sm text-[#171717]/85 leading-relaxed">
          {/* Angaben gemäß § 5 DDG */}
          <section>
            <h2 className="text-base font-semibold text-[#171717] mb-3">
              Angaben gemäß § 5 DDG
            </h2>
            <div className="space-y-1 text-[#171717]/80">
              <p className="font-medium text-[#171717]">Inhaltlich verantwortlich und Diensteanbieter:</p>
              <p>MVC – Hamburg</p>
              <p>Frank Vomberg</p>
              <p>Phönixhof / Haus 11c</p>
              <p>Ruhrstraße 11 c</p>
              <p>22761 Hamburg</p>
              <p>Deutschland</p>
            </div>
            <div className="mt-3 space-y-1 text-[#171717]/80">
              <p><strong>Telefon:</strong> +49 (0)40 3616679-41</p>
              <p>
                <strong>E-Mail:</strong>{' '}
                <a href="mailto:info@mvc-hamburg.de" className="text-[#FF4F87] hover:underline">
                  info@mvc-hamburg.de
                </a>
              </p>
              <p>
                <strong>Website:</strong>{' '}
                <a
                  href="http://www.mvc-hamburg.de"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#FF4F87] hover:underline"
                >
                  www.mvc-hamburg.de
                </a>
              </p>
            </div>
            <div className="mt-3">
              <p><strong>Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG:</strong> DE 245982133</p>
            </div>
          </section>

          {/* Verantwortlich für die Inhalte */}
          <section className="pt-6 border-t border-[#F0E4E7]">
            <h2 className="text-base font-semibold text-[#171717] mb-3">
              Verantwortlich für die Inhalte
            </h2>
            <p className="mb-2 text-[#171717]/80">
              Verantwortlich für die redaktionellen Inhalte dieser Website ist:
            </p>
            <div className="space-y-0.5 text-[#171717]/80">
              <p>Frank Vomberg</p>
              <p>MVC – Hamburg</p>
              <p>Phönixhof / Haus 11c</p>
              <p>Ruhrstraße 11 c</p>
              <p>22761 Hamburg</p>
            </div>
          </section>

          {/* Konzeption und technische Umsetzung */}
          <section className="pt-6 border-t border-[#F0E4E7]">
            <h2 className="text-base font-semibold text-[#171717] mb-2">
              Konzeption und technische Umsetzung
            </h2>
            <p className="text-[#171717]/80">
              Ploog Webdesign<br />
              E-Mail:{' '}
              <a href="mailto:info@ploog-webdesign.de" className="text-[#FF4F87] hover:underline">
                info@ploog-webdesign.de
              </a>
            </p>
          </section>

          {/* Online-Vermarktung */}
          <section className="pt-6 border-t border-[#F0E4E7]">
            <h2 className="text-base font-semibold text-[#171717] mb-2">
              Online-Vermarktung
            </h2>
            <p className="text-[#171717]/80 mb-2">
              Die Online-Vermarktung von <strong>top-babynamen.de</strong> erfolgt durch die <strong>vertical network media GmbH</strong>.
            </p>
            <p className="text-[#171717]/80">
              Bei Interesse an Werbemöglichkeiten auf top-babynamen.de oder innerhalb des Netzwerks wenden Sie sich bitte an:<br />
              E-Mail:{' '}
              <a href="mailto:vermarktung@verticalnetwork.de" className="text-[#FF4F87] hover:underline">
                vermarktung@verticalnetwork.de
              </a>
            </p>
          </section>

          {/* Über top-babynamen.de */}
          <section className="pt-6 border-t border-[#F0E4E7]">
            <h2 className="text-base font-semibold text-[#171717] mb-2">
              Über top-babynamen.de
            </h2>
            <p className="text-[#171717]/80 mb-2">
              top-babynamen.de bietet einen Überblick über häufig vergebene Babynamen in verschiedenen europäischen Ländern.
            </p>
            <p className="text-[#171717]/80">
              Die Informationen basieren unter anderem auf öffentlich zugänglichen Namensstatistiken der jeweiligen Länder, eigenen Recherchen sowie weiteren öffentlich zugänglichen Quellen.
            </p>
          </section>

          {/* Haftung für Inhalte */}
          <section className="pt-6 border-t border-[#F0E4E7]">
            <h2 className="text-base font-semibold text-[#171717] mb-2">
              Haftung für Inhalte
            </h2>
            <p className="text-[#171717]/80 mb-2">
              Die Inhalte dieser Website wurden nach bestem Wissen und mit größtmöglicher Sorgfalt erstellt. Eine Gewähr für die Richtigkeit, Vollständigkeit und Aktualität der bereitgestellten Informationen kann jedoch nicht übernommen werden.
            </p>
            <p className="text-[#171717]/80">
              Die Nutzung der bereitgestellten Informationen erfolgt auf eigene Verantwortung.
            </p>
          </section>

          {/* Haftung für externe Links */}
          <section className="pt-6 border-t border-[#F0E4E7]">
            <h2 className="text-base font-semibold text-[#171717] mb-2">
              Haftung für externe Links
            </h2>
            <p className="text-[#171717]/80 mb-2">
              Diese Website enthält gegebenenfalls Links zu externen Websites Dritter. Auf deren Inhalte haben wir keinen Einfluss. Für die Inhalte der verlinkten externen Seiten ist stets der jeweilige Betreiber verantwortlich.
            </p>
            <p className="text-[#171717]/80 mb-2">
              Zum Zeitpunkt der Verlinkung waren keine rechtswidrigen Inhalte erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar.
            </p>
            <p className="text-[#171717]/80">
              Sollten uns Rechtsverletzungen auf verlinkten Seiten bekannt werden, werden die betreffenden Links nach entsprechender Prüfung entfernt.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
