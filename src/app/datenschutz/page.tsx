import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Datenschutzerklärung – babynamen.me',
  description:
    'Datenschutzerklärung und Informationen zur Datenverarbeitung auf babynamen.me',
};

export default function DatenschutzPage() {
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
          Datenschutzerklärung
        </h1>
      </header>

      <div className="space-y-8 text-[0.95rem] text-ink-soft leading-relaxed">
        <section>
          <h2 className="text-base text-ink mb-2">1. Datenschutz auf einen Blick</h2>
          <p>
            Wir freuen uns über deinen Besuch auf babynamen.me. Der Schutz
            deiner persönlichen Daten hat für uns höchste Priorität.
          </p>
        </section>

        <section className="pt-6 border-t border-line">
          <h2 className="text-base text-ink mb-2">2. Verantwortlicher</h2>
          <p className="mb-2">Verantwortlich für die Datenverarbeitung auf dieser Website ist:</p>
          <p className="font-medium text-ink">PROMOTION UNION GMBH</p>
          <p>Hellgrundweg 109</p>
          <p>22525 Hamburg</p>
          <p>Deutschland</p>
          <p className="mt-2">Vertreten durch: Herrn Frank Vomberg</p>
          <p className="mt-2">
            <strong className="text-ink">E-Mail:</strong>{' '}
            <a href="mailto:info@promotionunion.de" className="underline underline-offset-2 hover:text-blue-deep">
              info@promotionunion.de
            </a>
          </p>
          <p>
            <strong className="text-ink">Telefon:</strong> 040 3616679/00
          </p>
        </section>

        <section className="pt-6 border-t border-line">
          <h2 className="text-base text-ink mb-2">3. Lokale Speicherung von Favoriten</h2>
          <p>
            Wenn du Namen favorisierst oder in Spielen abstimmst, werden diese
            Informationen ausschließlich lokal in deinem Webbrowser
            (LocalStorage) gespeichert. Es findet keine serverseitige Erfassung,
            Weitergabe oder Verknüpfung mit persönlichen Identitätsdaten statt.
            Du kannst diese Daten jederzeit leeren.
          </p>
        </section>

        <section className="pt-6 border-t border-line">
          <h2 className="text-base text-ink mb-2">4. Einwilligung zur Cookie-Nutzung</h2>
          <p>
            Unser Cookie-Hinweis fragt deine Einwilligung ab, bevor Google-Cookies
            (z.&nbsp;B. für Google Ads) gesetzt werden. Deine Entscheidung
            (&bdquo;Alle akzeptieren&ldquo; oder &bdquo;Nur notwendige&ldquo;)
            wird ebenfalls nur lokal in deinem Browser gespeichert (Art.&nbsp;6
            Abs.&nbsp;1 lit.&nbsp;a DSGVO, §&nbsp;25 Abs.&nbsp;1 TTDSG).
          </p>
          <p className="mt-3">
            Ohne deine Einwilligung werden keinerlei Dritt-Cookies gesetzt und
            keine Werbeskripte von Google geladen. Nur mit deiner gesonderten
            Zustimmung wurden oder werden solche Dienste eingesetzt.
          </p>
          <p className="mt-3">
            Du kannst deine Einwilligung jederzeit mit Wirkung für die Zukunft
            widerrufen &ndash; &uuml;ber die Schaltfl&auml;che &bdquo;Einwilligung verwalten&ldquo; im
            Footer der Website. Durch den Widerruf wird kein bereits erfolgtes
            Laden von Dritt-Skripten rückgängig gemacht, aber es werden keine
            weiteren Dienste mehr aktiviert. Alternativ kannst du die Auswahl
            ändern, indem du die Website-Daten in deinem Browser löschst.
          </p>
        </section>

        <section className="pt-6 border-t border-line">
          <h2 className="text-base text-ink mb-2">5. Server-Log-Dateien</h2>
          <p>
            Beim Aufruf dieser Website erhebt und speichert unser
            Hosting-Provider automatisch Informationen in so genannten
            Server-Log-Dateien, die dein Browser automatisch übermittelt
            (Browsertyp, Betriebssystem, Referrer URL, Hostname des
            zugreifenden Rechners, Uhrzeit der Serveranfrage, gekürzte
            IP-Adresse).
          </p>
          <p className="mt-3">
            Rechtsgrundlage ist unser berechtigtes Interesse an der
            Bereitstellung und Sicherheit der Website (Art.&nbsp;6 Abs.&nbsp;1
            lit.&nbsp;f DSGVO). Die Log-Daten werden nach [konkrete Frist
            einfügen] gelöscht und nicht mit anderen Datenquellen
            zusammengeführt.
          </p>
          <p className="mt-3">
            Diese Website wird bei der Vercel Inc., 340 S Lemon Ave #4133,
            Walnut, CA 91789, USA (&bdquo;Vercel&ldquo;), gehostet. Vercel
            verarbeitet die oben genannten Server-Log-Daten in unserem
            Auftrag als Auftragsverarbeiter (Art.&nbsp;28 DSGVO). Da Vercel
            seinen Sitz in den USA hat, erfolgt eine Datenübermittlung in ein
            Drittland auf Grundlage des EU-US Data Privacy Framework, soweit
            Vercel hierfür zertifiziert ist, bzw. auf Grundlage von
            EU-Standardvertragsklauseln. Weitere Informationen findest du in
            der{' '}
            <a
              href="https://vercel.com/legal/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-blue-deep"
            >
              Datenschutzerklärung von Vercel
            </a>
            .
          </p>
        </section>

        <section className="pt-6 border-t border-line">
          <h2 className="text-base text-ink mb-2">6. Google Ads / AdSense</h2>
          <p>
            Diese Website kann nach deiner Einwilligung Google Ads und/oder
            Google AdSense zur Einblendung von Werbung verwenden. Google kann
            dabei Cookies und ähnliche Technologien einsetzen, um Anzeigen
            bereitzustellen, zu personalisieren und ihre Leistung zu messen.
            Die Einbindung erfolgt ausschließlich nach deiner im Cookie-Hinweis
            erteilten Einwilligung.
          </p>
          <p className="mt-3">
            Anbieter dieser Dienste ist Google Ireland Limited, Gordon House,
            Barrow Street, Dublin 4, Irland (&bdquo;Google&ldquo;). Je nach
            konkret eingesetztem Dienst ist Google entweder als eigenständiger
            Verantwortlicher oder &ndash; soweit die Voraussetzungen des
            Art.&nbsp;26 DSGVO vorliegen &ndash; als gemeinsam Verantwortlicher
            tätig; die Einzelheiten hierzu ergeben sich aus den
            Datenschutzhinweisen von Google.
          </p>
          <p className="mt-3">
            Weitere Informationen findest du in den{' '}
            <a
              href="https://business.safety.google/intl/de/privacy/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-blue-deep"
            >
              Datenschutzhinweisen von Google
            </a>
            .
          </p>
          <p className="mt-3">
            Eine Datenübermittlung an Server in den USA erfolgt, soweit
            erforderlich, auf Grundlage des EU-US Data Privacy Framework,
            sofern Google hierfür zertifiziert ist, bzw. auf Grundlage von
            EU-Standardvertragsklauseln.
          </p>
        </section>

        <section className="pt-6 border-t border-line">
          <h2 className="text-base text-ink mb-2">7. Deine Rechte</h2>
          <p className="mb-2">
            Du hast als betroffene Person folgende Rechte:
          </p>
          <ul className="list-disc pl-5 space-y-1 mb-2">
            <li>
              <strong className="text-ink">Auskunftsrecht</strong> (Art.&nbsp;15
              DSGVO): unentgeltliche Auskunft über deine gespeicherten
              personenbezogenen Daten, deren Herkunft, Empfänger und den
              Zweck der Verarbeitung
            </li>
            <li>
              <strong className="text-ink">Recht auf Berichtigung</strong>{' '}
              (Art.&nbsp;16 DSGVO)
            </li>
            <li>
              <strong className="text-ink">Recht auf Löschung</strong>{' '}
              (Art.&nbsp;17 DSGVO)
            </li>
            <li>
              <strong className="text-ink">
                Recht auf Einschränkung der Verarbeitung
              </strong>{' '}
              (Art.&nbsp;18 DSGVO)
            </li>
            <li>
              <strong className="text-ink">
                Recht auf Datenübertragbarkeit
              </strong>{' '}
              (Art.&nbsp;20 DSGVO)
            </li>
            <li>
              <strong className="text-ink">Widerrufsrecht</strong> für erteilte
              Einwilligungen mit Wirkung für die Zukunft (Art.&nbsp;7
              Abs.&nbsp;3 DSGVO)
            </li>
            <li>
              <strong className="text-ink">Widerspruchsrecht</strong>{' '}
              (Art.&nbsp;21 DSGVO): Du kannst der Verarbeitung deiner Daten,
              die auf Grundlage unseres berechtigten Interesses (Art.&nbsp;6
              Abs.&nbsp;1 lit.&nbsp;f DSGVO) erfolgt, jederzeit aus Gründen
              widersprechen, die sich aus deiner besonderen Situation ergeben.
            </li>
          </ul>
          <p className="mb-2">
            Zur Ausübung dieser Rechte kannst du dich jederzeit mit Fragen
            oder Beschwerden über die in Abschnitt&nbsp;2 genannten
            Kontaktdaten an uns wenden.
          </p>
          <p>
            Darüber hinaus steht dir ein Beschwerderecht bei einer
            Datenschutz-Aufsichtsbehörde zu. Zuständige Aufsichtsbehörde ist
            der Hamburgische Beauftragte für Datenschutz und
            Informationsfreiheit (HmbBfDI), Ludwig-Erhard-Straße 22, 7.
            OG, 20459 Hamburg.
          </p>
        </section>

        <p className="pt-6 border-t border-line text-xs text-ink-soft">
          Stand: 10.09.2026
        </p>
      </div>
    </article>
  );
}