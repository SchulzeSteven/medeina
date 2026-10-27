# Coaching-Website – Angular

Responsive Umsetzung von `layout.png` mit Angular 20, Standalone-Komponente und zonenfreier Änderungserkennung.

## Starten

Voraussetzung: Node.js 22.12 oder neuer (Node 22 empfohlen) und npm.

```bash
npm install
npm start
```

Die Seite läuft unter http://localhost:4200. Produktionsbuild: `npm run build`; Ausgabe in `dist/medaina/browser`.

## Enthalten

- Layout mit Hero, Vorteilen, Über-mich-Bereich, vier Angeboten, Zitat und Veranstaltungen
- Responsive Darstellung und mobiles Menü
- Deutsch, Türkisch und Englisch mit DE/TR/EN-Umschaltung
- Dialoge für Angebotsdetails und Terminanfragen
- Anfrageformular mit serverseitigem Resend-Versand; Testempfänger `schulze89@hotmail.de`
- Vorhandene Bilder und Logos, ohne externe Bilddienste oder Fonts

Texte und Veranstaltungen: `src/app/translations.ts`. Die Sections liegen in eigenen Komponenten unter `src/app/`. Globale Farben und Grundregeln: `src/styles.scss`. Die Styles jeder Section liegen in ihrer jeweiligen `*.component.scss`-Datei. Bildausschnitte können mit `node scripts/extract-images.cjs` aus der ursprünglichen Vorlage erneut erzeugt werden.

## Komponenten auf einer Seite

Die Startseiten-Sections werden in `src/app/home/home.component.html` in ihrer ursprünglichen Reihenfolge eingebunden. `src/app/app.component.html` enthält den gemeinsamen Header, Router-Ausgang, Footer und Kontaktdialog. Jede Section besitzt eigene TypeScript-, HTML- und SCSS-Dateien unter `src/app/`:

- `hero/`: Startbereich
- `benefits/`: Vorteile
- `about/`: Über mich
- `slogans/`: Impulse
- `offers/`: Coaching, Seminare, Programme und Retreats
- `quote/`: Zitat und Einstieg
- `events/`: Termine
- `instagram/`: Instagram-Bereich
- `reviews/`: Google-Bewertungen

Header, Footer und Dialoge haben ebenfalls eigene Komponenten. `site-state.service.ts` hält die gemeinsame Sprache und die Daten für Angebotsdetails und Terminanfragen. Die Navigation führt per Sprunglink zu den Startseiten-Sections oder per Angular Router zu den Angebotsseiten und schließt das mobile Menü. Sprunglinks funktionieren auch von den Angebotsseiten zurück zur Startseite.

Die Styles von Header, Footer, Dialogen und Sections sind über `styleUrl` an ihre Komponenten gebunden. `src/styles.scss` enthält nur Theme-Variablen, HTML-/Body-Grundregeln, Typografie und gemeinsam genutzte Container-, Button- und Überschriftenstile. Das SCSS-Mixin in `src/styles/_scroll-reveal.scss` wird von den animierten Sections eingebunden. Die bestehenden Instagram- und Google-Bewertungskomponenten verwenden ebenfalls eigene SCSS-Dateien.

Die Website wurde auf den Stand vor der Übernahme von `MEDEINA_Originaltexte.txt` zurückgesetzt. Impressum und Datenschutz enthalten weiterhin die damaligen Platzhalter. Die Veranstaltungsdaten sind Layoutbeispiele; der Hinweis ist über „Alle Termine anzeigen“ erreichbar.

## Prüfung

`npm run check:languages` prüft die englische Inhaltsabdeckung, unveränderte
Angebotskennungen und Bildpfade sowie den Hinweis zur englischen Verdolmetschung.
Die Infobox steht bei den Angeboten auf der Startseite und im Angebotskatalog,
auf Detailseiten vor der Anfrage. Sie erläutert in allen drei Sprachen, dass
alle Angebote mit einem ins Englische übersetzenden Dolmetscher möglich sind
und zusätzliche Kosten vor der Buchung abgestimmt werden. Im englischen
Anfrageformular wird der Hinweis wiederholt. Die Anfrage-API und Mailvorlage
unterstützen ebenfalls Englisch; `npm run check:inquiry` prüft DE/TR/EN ohne Versand.

`npm run build` läuft erfolgreich. Die lokale Vorschau kann in dieser Umgebung wegen gesperrter Netzwerkports nicht gestartet werden.

## Google-Bewertungen vor dem Footer

Der Bewertungsbereich ist eine eigene Komponente (`src/app/google-reviews.component.*`). Er zeigt auf dem Desktop drei, auf Tablets zwei und auf Handys eine Karte. CSS Scroll Snap ermöglicht natives Wischen; Pfeile wechseln jeweils eine sichtbare Gruppe, Tastaturpfeile funktionieren ebenfalls. Bewertungen werden nach `publishedAt` absteigend sortiert. Autor, Datum, Sterne und Link zur Originalbewertung werden angezeigt; Rezensionstexte werden bei DE/TR nicht automatisch übersetzt.

Die Daten in `src/app/google-reviews.data.ts` sind bewusst leer, solange kein bestätigtes Google-Profil und keine echten Bewertungsdaten vorliegen. Die Website zeigt bis dahin einen neutralen Hinweis. Es existiert noch keine automatische Google-Verbindung und es werden keine externen Google-Skripte geladen.

Für den automatischen Abruf ist eine echte Datenanbindung erforderlich. Die [Google Business Profile API](https://developers.google.com/my-business/reference/rest/v4/accounts.locations.reviews/list) unterstützt paginierte Rezensionen eines verifizierten Standorts und benötigt eine autorisierte Kontoverbindung. Zugangsdaten gehören in einen serverseitigen Integrationsdienst. Die [Places API (New)](https://developers.google.com/maps/documentation/places/web-service/reference/rest/v1/places) liefert dagegen höchstens fünf nach Relevanz ausgewählte Bewertungen; sie garantiert keine vollständige Auswahl der drei neuesten Bewertungen. Eine solche Auswahl darf nicht als vollständig neueste Rezensionen dargestellt werden. Die Anbindung und die erforderliche Google-Quellenkennzeichnung müssen beim Anschluss des bestätigten Profils umgesetzt werden.

Der Produktionsbuild und die Prüfung von Sortierung sowie Platzierung vor dem Footer sind erfolgreich. Eine visuelle Browserprüfung steht in dieser Umgebung aus.

## Instagram-Beiträge

Der Instagram-Bereich befindet sich zwischen den Terminen und den Google-Bewertungen. `src/app/instagram-feed.component.*` zeigt bis zu sechs echte Beiträge: drei Spalten auf dem Desktop, zwei auf Tablets und eine auf kleinen Handys. Ein Klick öffnet den jeweiligen Originalbeitrag. Bilder werden verzögert geladen; Videos verwenden ihr Vorschaubild. DE/TR/EN betrifft die Bedienoberfläche, nicht die Original-Bildunterschriften.

Der Profil-Link `https://www.instagram.com/medeinaland/` ist gesetzt. Der Feed ruft
`api/instagram-feed.php` auf. Zugangsdaten bleiben ausschließlich serverseitig.
Ohne Konfiguration bleibt der Profil-Link mit einem Verfügbarkeitshinweis sichtbar.

### Token hinterlegen

Lokal ist `server/medeina-instagram-config.php` vorbereitet und von Git ausgeschlossen.
Den Token dort in `accessToken` eintragen. `login` ist `instagram` für Instagram Login
oder `facebook` für Facebook Login/Graph API Explorer. Bei Instagram Login kann
`userId` auf `me` bleiben; bei Facebook Login ist die Instagram-Konto-ID erforderlich
(nicht die Facebook-Seiten-ID). Der konfigurierte Account muss `medeinaland` heißen.
Die API-Version ist in `apiVersion` einstellbar. Keine Zugangsdaten in `public/`,
`dist/`, Screenshots, Chat oder Git ablegen.

Auf IONOS die private Datei außerhalb des öffentlichen Website-Ordners ablegen,
standardmäßig neben dem Ordner `medeina/` unter `medeina-instagram-config.php`.
Alternativ den vorhandenen, zuvor nachweislich per HTTP 403 gesperrten Ordner
`medeina-private/` verwenden (siehe Resend-Anleitung) oder den absoluten Dateipfad
über `MEDEINA_INSTAGRAM_CONFIG` setzen. Der Token kann alternativ als
`MEDEINA_INSTAGRAM_TOKEN` gesetzt werden. PHP mit cURL ist erforderlich.
Die private Konfiguration wird nicht mit der dist ausgeliefert.

Der Server prüft das Profil und fragt bis zu 50 Beiträge ab. Aus den gültigen
Ergebnissen werden die sechs neuesten nach Veröffentlichungszeit ausgewählt.
Videos verwenden Vorschaubilder. Die öffentlichen Ergebnisse werden zehn Minuten
zwischengespeichert; bei API-Fehlern wird frühestens nach einer Minute erneut angefragt.
Bei einem ungültigen oder abgelaufenen Token erscheint der Profil-Link als Rückfall.
Eine automatische Tokenverlängerung ist noch nicht eingerichtet.

`php scripts/check-instagram.php` prüft Verarbeitung und Validierung ohne Meta-Aufruf.
Nach Hinterlegen des Tokens muss der echte Abruf mit `api/instagram-feed.php` geprüft
werden. Der Token wird nie an den Browser zurückgegeben. Die Vorschaubilder werden
vom Browser direkt von Meta-CDNs geladen; die Datenschutzhinweise beschreiben dies.

Referenz: [Meta Instagram API](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/).

## Seminare, Ausbildungen und Sessions

Im Header führt ein gemeinsamer Eintrag „Angebote“ zur Seite `/angebote`. Dort wählt man zuerst „Seminare & Ausbildungen“ (13 Angebote) oder „Sessions & Coaching“ (10 Angebote) und danach eine Methode. Auch die bestehenden Angebotskarten für Seminare und Einzelcoaching führen zu diesen Übersichten. Die anderen Angebote und die bisherigen Sections bleiben erhalten.

- `src/app/catalog/catalog.data.ts`: zentrale Datenquelle mit stabilen IDs, DE/TR-Feldern, Kategorien, Inhalten, belegten Voraussetzungen, Dauer, Format und Ausbildungsstufen. Keine Preise.
- `src/app/catalog/catalog.component.*`: responsive Übersicht, Kategorie-Filter, Detailansichten, Sprachumschaltung und Anfragebuttons. Die Übersichten und Details sind reguläre Seiten mit eigenen URLs. Navigation per Tastatur, Browser-Zurück und das Öffnen der Links in einem neuen Tab werden unterstützt.
- `site-state.service.ts`: Navigation zu den Angebotsseiten sowie Übernahme der Angebots-ID in das vorhandene Kontaktformular. Die ausgewählte Sprache bestimmt den Angebotsnamen und die Sprache der Anfrage-E-Mail. Das Formular versendet über die PHP-API und Resend.

Alle Terminlisten sind zunächst leer. Bestätigte Termine lassen sich pro Angebot in `dates` ergänzen: `startsAt` (ISO-Zeitstempel), optional `endsAt`, `location` mit DE/TR und optional `registrationUrl`. Die Detailansicht zeigt vorhandene Termine; Registrierungslinks sind für eine spätere Erweiterung vorbereitet. Die bestehenden Veranstaltungskarten bleiben separate Layoutbeispiele.

Die Angebotsübersicht verwendet Angular Router mit sauberen URLs ohne Routing-Hash:

- `/`: bestehende Startseite
- `/angebote`: gemeinsame Einstiegseite
- `/angebote?bereich=seminars`: Seminare und Ausbildungen
- `/angebote?bereich=sessions`: Sessions und Coaching
- `/angebote/:id`: Detailseiten, z. B. `/angebote/basic-dna` und `/angebote/weekly-erstgespraech`
- Bisherige `/seminare`- und `/sessions-coaching`-URLs werden auf die gemeinsame Seite beziehungsweise die neue Detailadresse weitergeleitet.

Zunächst erscheinen ausschließlich die im jeweiligen Bereich verfügbaren Methoden als Auswahlkarten. Nach Auswahl werden nur die zugehörigen Angebote angezeigt. Die Methode steht im optionalen Query-Parameter `kategorie`; fehlende oder ungültige Werte führen zur Methodenübersicht. Detailseiten führen zurück zu ihrer eigenen Kategorie. Bei einer Anfrage aus einem konkreten Angebot enthält die Auswahl im Kontaktformular ausschließlich Angebote derselben Methode und Angebotsart. Fehlende oder ungültige `bereich`-Werte führen zur Bereichsauswahl. Detailseiten bestimmen Bereich und Methode anhand des Angebots selbst. Unbekannte Detail-IDs führen zur gemeinsamen Einstiegseite. Unbekannte Seiten führen zur Startseite. Header und Footer bleiben auf allen Seiten sichtbar. Seitentitel und Meta-Beschreibung wechseln passend zu Angebot und Sprache; beim Zurückkehren wird die Startseiten-Metadatenfassung wiederhergestellt. Die Katalogkomponente wird bei Bedarf geladen.

### Hosting für direkte Seitenaufrufe

Der Angular-Entwicklungsserver unterstützt die neuen URLs. Im Produktionshosting muss für Pfade ohne vorhandene Datei die `index.html` ausgeliefert werden, damit direkte Aufrufe und Neuladen von beispielsweise `/angebote/basic-dna` funktionieren. Eine aktive Hosting-Konfiguration liegt in diesem Repository nicht vor. Bei Nginx ist die übliche Regel `try_files $uri $uri/ /index.html;`; bei statischen Hostingdiensten ist entsprechend ein SPA-Fallback einzurichten. Vorhandene Assets müssen direkt ausgeliefert werden. Es wurde keine unbekannte Hosting-Konfiguration überschrieben.

### Noch zu bestätigende Angaben

- Aktuelle Termine und Verfügbarkeit sämtlicher Angebote; konkrete Veranstaltungsorte und Formate, soweit nicht angegeben.
- Fehlende Seminardauern sowie Voraussetzungen, die in den gelieferten Angaben nicht genannt sind. Ein fehlender Wert bedeutet ausdrücklich nicht „keine Voraussetzungen“.
- Pflanzenseminar: konkrete Inhalte, Dauer, Voraussetzungen und Format.
- Reiki-Reihen: Inhalte, Dauer, Voraussetzungen und Format je Stufe.
- JAAS / InnerSpeak™: Originalangaben zu Zertifikaten; es wird kein Zertifikat versprochen.
- Weitere Details zur Methode und zum Ablauf der sieben Tore des Bewusstseins.
- Rechtliche Prüfung des Hinweises zu spirituellen Methoden in Deutsch und Türkisch vor Veröffentlichung.

### Hinweisfassung zur rechtlichen Prüfung

Der in `catalogCopy` enthaltene deutsche und türkische Hinweis ist ein **ungeprüfter redaktioneller Entwurf**. Er beschreibt die Angebote als spirituelle beziehungsweise ergänzende Praxis für persönliche Entwicklung und Reflexion, grenzt medizinische Diagnosen und die Behandlung von Erkrankungen ab und verspricht keine Wirkungen oder Heilungen. Eine rechtlich geprüfte Freigabe liegt nicht vor. Vor Veröffentlichung ist der Wortlaut einschließlich der türkischen Übersetzung rechtlich prüfen und gegebenenfalls ersetzen zu lassen.

## Upload auf steven-schulze.com/medeina/

Mit `npm run build:medeina` einen Produktionsbuild für den Unterordner erstellen.
Den gesamten **Inhalt** von `dist/medaina/browser/` mit FileZilla in den
Serverordner `medeina` hochladen, einschließlich `.htaccess` und `images/`.
Die `index.html` muss direkt im Serverordner `medeina` liegen.
Danach `https://steven-schulze.com/medeina/` öffnen.

Die mitgelieferte `.htaccess` ermöglicht auf Apache mit aktiviertem mod_rewrite
auch direkte Aufrufe und Neuladen von Angebotsseiten. Bei Nginx muss das Hosting
stattdessen einen SPA-Fallback auf `/medeina/index.html` einrichten.

## Store-Vorschau

`/store` zeigt sechs DE/TR-Beispielprodukte mit vorhandenen Website-Bildern als Platzhaltern.
Kategorien werden über `?kategorie=` gefiltert, Details liegen unter `/store/:id`.
Produkte und Übersetzungen stehen in `src/app/store/store.data.ts`.
Alle Produkte und Euro-Preise sind als Beispiele gekennzeichnet. Beispielpreise werden in `priceCents` pro Produkt gepflegt. Die Produktanfrage
öffnet einen E-Mail-Entwurf. Ein eingebetteter Stripe-/PayPal-Testcheckout ist vorbereitet. Downloads und Bestellversand sind nicht automatisiert.
Vor einem Verkaufsstart sind das echte Sortiment, eigene Produktbilder, Preise,
Produktinformationen und der Bestellablauf einzurichten.

## Eingebetteter Testcheckout mit Stripe Elements und PayPal

Unter `/store/:id/checkout` erscheint wieder der Checkout mit echten Stripe-Kartenfeldern
und dem offiziellen PayPal-Button. Beide Anbieter sind ausschließlich im Testmodus.

### IONOS-Upload

1. `npm run build:medeina` ausführen. Den gesamten Inhalt von `dist/medaina/browser/`
   einschließlich `api/` und `.htaccess` in den Serverordner `medeina` hochladen.
2. Für vollständige Stripe-Testzahlungen `server/medeina-stripe-config.example.php`
   als `medeina-stripe-config.php` **außerhalb** des öffentlichen Website-Verzeichnisses
   ablegen. Standardpfad: `dirname(__DIR__, 3) . '/medeina-stripe-config.php'`, ausgehend
   von `medeina/api/stripe-common.php`. Bei anderer Serverstruktur den Suchpfad anpassen
   oder die Server-Umgebungsvariable `MEDEINA_STRIPE_CONFIG` setzen. Öffentlichen Testschlüssel
   `pk_test_…` und geheimen Testschlüssel `sk_test_…` desselben Stripe-Testkontos eintragen.
3. PHP 8.1+ und cURL aktivieren. Im Checkout mit `4242 4242 4242 4242`, zukünftiger
   Gültigkeit und beliebiger dreistelliger Prüfziffer testen. Kein echtes Geld wird abgebucht.

Die private Datei und geheime Schlüssel gehören weder in die dist noch nach GitHub.
Alternativ `MEDEINA_STRIPE_PUBLIC_KEY` / `MEDEINA_STRIPE_SECRET_KEY` serverseitig setzen.
Ohne private Serverkonfiguration kann nur eine vorhandene öffentliche Testkonfiguration
in `public/api/stripe-preview.json` die Stripe-Felder als Vorschau anzeigen; der Zahlungsabschluss
ist dann deaktiviert. Ohne jegliche Testkonfiguration erscheint ein Einrichtungshinweis.

### PayPal

Ohne Sandbox-Zugangsdaten zeigt der offizielle SDK-Wert `client-id=sb` die Button-Vorschau.
Für vollständige Testzahlungen eine PayPal-Sandbox-App erstellen und
`server/medeina-paypal-config.example.php` als `medeina-paypal-config.php` außerhalb
des öffentlichen Verzeichnisses neben der Stripe-Konfiguration ablegen. Sandbox-Client-ID
und Secret eintragen. Alternativ `MEDEINA_PAYPAL_CONFIG`, `MEDEINA_PAYPAL_CLIENT_ID` und
`MEDEINA_PAYPAL_SECRET` serverseitig setzen. Mit einem persönlichen PayPal-Sandboxkonto testen.

Preise werden in PHP anhand der Produkt-ID festgelegt und müssen mit `priceCents`
in `store.data.ts` übereinstimmen. Testschlüssel, Sitzungstoken, idempotente Aufrufe
und die Prüfung der Zahlungsbestätigung verhindern Liveabbuchungen oder falsche Erfolge.
Es gibt keine Produktlieferung oder Live-Bestellverwaltung. Vor einem Verkaufsstart
sind echte Produkte, Anbieter-Konten und eine verifizierte serverseitige Bestellverarbeitung nötig.

Die erneut eingerichtete temporäre Stripe-Sandbox läuft am 29.10.2026 ab. Ihre private
Konfiguration liegt lokal in der ignorierten Datei `server/medeina-stripe-config.php`.
Für vollständige Testzahlungen auf IONOS diese Datei wie oben beschrieben außerhalb
des öffentlichen Verzeichnisses ablegen. Nur der öffentliche Testschlüssel liegt in der dist.

## Anfrageformular mit Resend testen

Das Anfrageformular sendet direkt über `api/send-inquiry.php`. Im aktuellen Testbetrieb
gehen alle Anfragen ausschließlich an `schulze89@hotmail.de`. Die eingegebene Besucheradresse
wird als Reply-To gesetzt, nicht als zusätzlicher Empfänger. Die E-Mail enthält das eingebettete
Mainlogo und die Formulardaten auf Deutsch oder Türkisch.

### Lokal

1. `server/medeina-resend-config.example.php` als `server/medeina-resend-config.php` kopieren
   und den Resend-API-Schlüssel eintragen. Diese private Datei wird von Git und Prettier ignoriert.
   Die lokale Testkonfiguration ist bereits eingerichtet.
2. In einem Terminal `npm run start:api` starten (PHP 8.1+, cURL und mbstring erforderlich).
3. In einem zweiten Terminal `npm start` starten. Angular leitet `/api` über `proxy.conf.json`
   an den PHP-Server auf Port 8081 weiter. Im Entwicklungsbuild wird `public/api/` deshalb nicht als statischer Inhalt ausgeliefert. Einen bereits laufenden Angular-Server neu starten.
4. Das Anfrageformular ausfüllen und **Anfrage senden** klicken. Erst nach erfolgreicher
   Annahme durch Resend erscheint die Bestätigung. Das E-Mail-Programm wird nicht geöffnet.

### Hosting / IONOS

Mit `npm run build:medeina` bauen und den Inhalt von `dist/medaina/browser/` inklusive
`api/` und `images/` hochladen. Die private Resend-Konfiguration außerhalb des öffentlichen
Website-Verzeichnisses ablegen, standardmäßig unter
`dirname(__DIR__, 3) . '/medeina-resend-config.php'` relativ zu `api/send-inquiry.php`.
Alternativ den absoluten Pfad mit `MEDEINA_RESEND_CONFIG` konfigurieren.
Der API-Schlüssel darf niemals in `public/`, `dist/` oder im Frontend stehen.

Alternativ sind die serverseitigen Umgebungsvariablen `RESEND_API_KEY`,
`MEDEINA_INQUIRY_TO` und `MEDEINA_INQUIRY_FROM` möglich. Empfänger und Absender werden
ausschließlich serverseitig festgelegt. Ohne verifizierte Domain den Absender
`Medeina <onboarding@resend.dev>` und die eigene Resend-Konto-Adresse als Empfänger verwenden.
Für einen späteren Produktivbetrieb Empfänger, verifizierten Absender und den Testhinweis
`inquiryNote` in `src/app/translations.ts` anpassen.

Die API prüft Sitzungstoken, Eingaben und Größenlimits, begrenzt Sendeversuche pro Sitzung
und verwendet für Wiederholungen derselben Anfrage einen Idempotenzschlüssel.
Das Standardlimit beträgt fünf Versuche in zehn Minuten. Die private lokale Testkonfiguration
setzt `attemptLimit` auf 50; für den Produktivbetrieb wieder auf fünf setzen.
Bei Fehlern werden keine Erfolge angezeigt; die Eingaben bleiben erhalten.

Mit `npm run check:inquiry` lassen sich Validierung und beide E-Mail-Sprachen prüfen,
ohne E-Mails zu versenden. Dafür muss `npm run start:api` laufen.

### Wenn FileZilla nur das öffentliche Stammverzeichnis `/` zeigt

Alternativ ist ein per Apache gesperrter Ordner `/medeina-private/` neben `/medeina/`
möglich. Zuerst ausschließlich `.htaccess` und `check.txt` aus `server/resend-private/`
dorthin hochladen. `https://steven-schulze.com/medeina-private/check.txt` muss HTTP 403
liefern. Erst nach bestätigter Sperre die private `medeina-resend-config.php` in diesen
Ordner hochladen. Bei sichtbarer Testdatei, HTTP 404 oder HTTP 500 noch keine Zugangsdaten
hochladen; zuerst die Zugriffssperre klären. Die Mail-API unterstützt diesen Konfigurationspfad.
Die `.htaccess` muss dauerhaft im privaten Ordner bleiben. Anschließend die aktuelle dist
inklusive `api/send-inquiry.php` hochladen. Die Portfolio-`sendmail.php` bleibt unberührt.
