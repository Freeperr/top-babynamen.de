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
          <p className="font-medium text-ink">MVC – Hamburg</p>
          <p>Frank Vomberg</p>
          <p>Hellgrundweg 109</p>
          <p>22525 Hamburg</p>
          <p>Deutschland</p>
          <p className="mt-2">
            <strong className="text-ink">E-Mail:</strong>{' '}
            <a href="mailto:info@mvc-hamburg.de" className="underline underline-offset-2 hover:text-blue-deep">
              info@mvc-hamburg.de
            </a>
          </p>
          <p>
            <strong className="text-ink">Telefon:</strong> +49 (0)40 3616679-41
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
            Der Provider der Seiten erhebt und speichert automatisch Informationen
            in so genannten Server-Log-Dateien, die dein Browser automatisch
            übermittelt (Browsertyp, Betriebssystem, Referrer URL, Hostname des
            zugreifenden Rechners, Uhrzeit der Serveranfrage).
          </p>
          <p className="mt-3">
            Rechtsgrundlage ist unser berechtigtes Interesse an der
            Bereitstellung und Sicherheit der Website (Art.&nbsp;6 Abs.&nbsp;1
            lit.&nbsp;f DSGVO). Die Log-Daten werden in der Regel nach Ablauf
            der gesetzlichen Aufbewahrungsfristen gelöscht und nicht mit anderen
            Datenquellen zusammengeführt.
          </p>
        </section>

        <section className="pt-6 border-t border-line">
          <h2 className="text-base text-ink mb-2">6. Google Ads / AdSense</h2>
          <p>
            Diese Website kann Google Ads und Google AdSense zur Einblendung von
            Werbung verwenden. Google kann dabei Cookies und ähnliche Technologien
            einsetzen, um Anzeigen bereitzustellen und ihre Leistung zu messen.
            Die Einbindung erfolgt ausschließlich nach deiner Einwilligung, die im
            Cookie-Hinweis abgefragt wird.
          </p>
          <p className="mt-3">
            Soweit Google-Dienste nach deiner Einwilligung zum Einsatz kommen,
            ist Google Ireland Limited (Gordon House, Barrow Street, Dublin 4,
            Irland) gemeinsam mit uns Verantwortlicher für diese Datenverarbeitung.
            Details hierzu findest du in den{' '}
            <a
              href="https://business.safety.google/intl/de/privacy/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-blue-deep"
            >
              Datenschutzhinweisen von Google
            </a>
            . Eine Datenübermittlung an Server in den USA erfolgt auf Grundlage
            des EU-US Data Privacy Framework, soweit Google dafür zertifiziert ist.
          </p>
        </section>

        <section className="pt-6 border-t border-line">
          <h2 className="text-base text-ink mb-2">7. Deine Rechte</h2>
          <p className="mb-2">
            Du hast jederzeit das Recht auf unentgeltliche Auskunft über deine
            gespeicherten personenbezogenen Daten, deren Herkunft und Empfänger
            und den Zweck der Datenverarbeitung sowie ein Recht auf Berichtigung
            oder Löschung dieser Daten.
          </p>
          <p className="mb-2">
            Darüber hinaus stehen dir die Rechte auf Einschränkung der
            Verarbeitung, auf Datenübertragbarkeit und auf Widerruf erteilter
            Einwilligungen zu. Du kannst dich jederzeit mit Fragen oder
            Beschwerden an uns (Abschnitt&nbsp;2) oder an eine
            Datenschutz-Aufsichtsbehörde wenden.
          </p>
          <p>
            Zuständige Aufsichtsbehörde ist der Hamburgische Beauftragte für
            Datenschutz und Informationsfreiheit (HmbBfDI).
          </p>
        </section>
      </div>
    </article>
  );
}