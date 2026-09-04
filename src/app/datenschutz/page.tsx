import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Datenschutzerklärung – top-babynamen.de',
  description: 'Datenschutzerklärung und Informationen zur Datenverarbeitung auf top-babynamen.de',
};

export default function DatenschutzPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#777777] hover:text-[#FF4F87] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Zurück zur Startseite</span>
        </Link>
      </div>

      <div className="bg-white rounded-[28px] border border-[#FFD6E3] p-8 sm:p-12 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-[#FFF5F8] border border-[#FFD6E3] flex items-center justify-center text-[#FF4F87]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h1 className="text-3xl font-extrabold text-[#171717] tracking-tight">
            Datenschutzerklärung
          </h1>
        </div>

        <div className="space-y-6 text-sm text-[#171717]/85 leading-relaxed">
          <section>
            <h2 className="text-base font-bold text-[#171717] mb-2">1. Datenschutz auf einen Blick</h2>
            <p>
              Wir freuen uns über deinen Besuch auf top-babynamen.de. Der Schutz deiner persönlichen Daten hat für uns höchste Priorität.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#171717] mb-2">2. Lokale Speicherung von Favoriten (LocalStorage)</h2>
            <p>
              Wenn du Namen favorisierst oder in Spielen abstimmst, werden diese Informationen ausschließlich lokal in deinem Webbrowser (LocalStorage) gespeichert. Es findet keine serverseitige Erfassung, Weitergabe oder Verknüpfung mit persönlichen Identitätsdaten statt. Du kannst diese Daten jederzeit leeren.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#171717] mb-2">3. Server-Log-Dateien</h2>
            <p>
              Der Provider der Seiten erhebt und speichert automatisch Informationen in so genannten Server-Log-Dateien, die dein Browser automatisch übermittelt (Browsertyp, Betriebssystem, Referrer URL, Hostname des zugreifenden Rechners, Uhrzeit der Serveranfrage).
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#171717] mb-2">4. Google AdSense</h2>
            <p>
              Diese Website kann Google AdSense zur Einblendung von Werbung verwenden. Google kann dabei Cookies und ähnliche Technologien einsetzen, um Anzeigen bereitzustellen und ihre Leistung zu messen. Die Einbindung erfolgt erst nach deiner Einwilligung. Du kannst deine Einwilligung jederzeit durch das Löschen der Website-Daten in deinem Browser widerrufen.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#171717] mb-2">5. Deine Rechte</h2>
            <p>
              Du hast jederzeit das Recht auf unentgeltliche Auskunft über deine gespeicherten personenbezogenen Daten, deren Herkunft und Empfänger und den Zweck der Datenverarbeitung sowie ein Recht auf Berichtigung oder Löschung dieser Daten.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
