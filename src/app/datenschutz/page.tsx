import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Datenschutzerklärung – top-babynamen.de',
  description:
    'Datenschutzerklärung und Informationen zur Datenverarbeitung auf top-babynamen.de',
};

export default function DatenschutzPage() {
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
          Datenschutzerklärung
        </h1>
      </header>

      <div className="space-y-8 text-[0.95rem] text-ink-soft leading-relaxed">
        <section>
          <h2 className="text-base text-ink mb-2">1. Datenschutz auf einen Blick</h2>
          <p>
            Wir freuen uns über deinen Besuch auf top-babynamen.de. Der Schutz
            deiner persönlichen Daten hat für uns höchste Priorität.
          </p>
        </section>

        <section>
          <h2 className="text-base text-ink mb-2">2. Lokale Speicherung von Favoriten</h2>
          <p>
            Wenn du Namen favorisierst oder in Spielen abstimmst, werden diese
            Informationen ausschließlich lokal in deinem Webbrowser
            (LocalStorage) gespeichert. Es findet keine serverseitige Erfassung,
            Weitergabe oder Verknüpfung mit persönlichen Identitätsdaten statt.
            Du kannst diese Daten jederzeit leeren.
          </p>
        </section>

        <section>
          <h2 className="text-base text-ink mb-2">3. Einwilligung zur Cookie-Nutzung</h2>
          <p>
            Unser Cookie-Hinweis fragt deine Einwilligung ab, bevor Google-Cookies
            (z.&nbsp;B. für Google Ads) gesetzt werden. Deine Entscheidung
            (&bdquo;Alle akzeptieren&ldquo; oder &bdquo;Nur notwendige&ldquo;)
            wird ebenfalls nur lokal in deinem Browser gespeichert. Du kannst die
            Auswahl jederzeit ändern, indem du die Website-Daten in deinem Browser
            löschst.
          </p>
        </section>

        <section>
          <h2 className="text-base text-ink mb-2">4. Server-Log-Dateien</h2>
          <p>
            Der Provider der Seiten erhebt und speichert automatisch Informationen
            in so genannten Server-Log-Dateien, die dein Browser automatisch
            übermittelt (Browsertyp, Betriebssystem, Referrer URL, Hostname des
            zugreifenden Rechners, Uhrzeit der Serveranfrage).
          </p>
        </section>

        <section>
          <h2 className="text-base text-ink mb-2">5. Google Ads / AdSense</h2>
          <p>
            Diese Website kann Google Ads und Google AdSense zur Einblendung von
            Werbung verwenden. Google kann dabei Cookies und ähnliche Technologien
            einsetzen, um Anzeigen bereitzustellen und ihre Leistung zu messen.
            Die Einbindung erfolgt erst nach deiner Einwilligung, die im
            Cookie-Hinweis abgefragt wird.
          </p>
        </section>

        <section>
          <h2 className="text-base text-ink mb-2">6. Deine Rechte</h2>
          <p>
            Du hast jederzeit das Recht auf unentgeltliche Auskunft über deine
            gespeicherten personenbezogenen Daten, deren Herkunft und Empfänger
            und den Zweck der Datenverarbeitung sowie ein Recht auf Berichtigung
            oder Löschung dieser Daten.
          </p>
        </section>
      </div>
    </article>
  );
}