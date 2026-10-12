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
- Deutsch und Türkisch mit DE/TR-Umschaltung
- Dialoge für Angebotsdetails und Terminanfragen
- Lokal vorbereiteter E-Mail-Entwurf an `medeinaa@hotmail.com`, ohne Backend oder Datenversand
- Vorhandene Bilder und Logos, ohne externe Bilddienste oder Fonts

Texte und Veranstaltungen: `src/app/translations.ts`. Die Sections liegen in eigenen Komponenten unter `src/app/`. Globale Farben und Grundregeln: `src/styles.scss`. Die Styles jeder Section liegen in ihrer jeweiligen `*.component.scss`-Datei. Bildausschnitte können mit `node scripts/extract-images.cjs` aus der ursprünglichen Vorlage erneut erzeugt werden.

## Komponenten auf einer Seite

Alle Sections werden gemeinsam in `src/app/app.component.html` in ihrer ursprünglichen Reihenfolge eingebunden. Jede Section besitzt eigene TypeScript-, HTML- und SCSS-Dateien unter `src/app/`:

- `hero/`: Startbereich
- `benefits/`: Vorteile
- `about/`: Über mich
- `slogans/`: Impulse
- `offers/`: Coaching, Seminare, Programme und Retreats
- `quote/`: Zitat und Einstieg
- `events/`: Termine
- `instagram/`: Instagram-Bereich
- `reviews/`: Google-Bewertungen

Header, Footer und Dialoge haben ebenfalls eigene Komponenten. `site-state.service.ts` hält die gemeinsame Sprache und die Daten für Angebotsdetails und Terminanfragen. Die Navigation scrollt per Sprunglink zu den Sections derselben Seite und schließt das mobile Menü. Es gibt keine separaten Section-Seiten und keinen Router.

Die Styles von Header, Footer, Dialogen und Sections sind über `styleUrl` an ihre Komponenten gebunden. `src/styles.scss` enthält nur Theme-Variablen, HTML-/Body-Grundregeln, Typografie und gemeinsam genutzte Container-, Button- und Überschriftenstile. Das SCSS-Mixin in `src/styles/_scroll-reveal.scss` wird von den animierten Sections eingebunden. Die bestehenden Instagram- und Google-Bewertungskomponenten verwenden ebenfalls eigene SCSS-Dateien.

Die Website wurde auf den Stand vor der Übernahme von `MEDEINA_Originaltexte.txt` zurückgesetzt. Impressum und Datenschutz enthalten weiterhin die damaligen Platzhalter. Die Veranstaltungsdaten sind Layoutbeispiele; der Hinweis ist über „Alle Termine anzeigen“ erreichbar.

## Prüfung

`npm run build` läuft erfolgreich. Die lokale Vorschau kann in dieser Umgebung wegen gesperrter Netzwerkports nicht gestartet werden.

## Google-Bewertungen vor dem Footer

Der Bewertungsbereich ist eine eigene Komponente (`src/app/google-reviews.component.*`). Er zeigt auf dem Desktop drei, auf Tablets zwei und auf Handys eine Karte. CSS Scroll Snap ermöglicht natives Wischen; Pfeile wechseln jeweils eine sichtbare Gruppe, Tastaturpfeile funktionieren ebenfalls. Bewertungen werden nach `publishedAt` absteigend sortiert. Autor, Datum, Sterne und Link zur Originalbewertung werden angezeigt; Rezensionstexte werden bei DE/TR nicht automatisch übersetzt.

Die Daten in `src/app/google-reviews.data.ts` sind bewusst leer, solange kein bestätigtes Google-Profil und keine echten Bewertungsdaten vorliegen. Die Website zeigt bis dahin einen neutralen Hinweis. Es existiert noch keine automatische Google-Verbindung und es werden keine externen Google-Skripte geladen.

Für den automatischen Abruf ist eine echte Datenanbindung erforderlich. Die [Google Business Profile API](https://developers.google.com/my-business/reference/rest/v4/accounts.locations.reviews/list) unterstützt paginierte Rezensionen eines verifizierten Standorts und benötigt eine autorisierte Kontoverbindung. Zugangsdaten gehören in einen serverseitigen Integrationsdienst. Die [Places API (New)](https://developers.google.com/maps/documentation/places/web-service/reference/rest/v1/places) liefert dagegen höchstens fünf nach Relevanz ausgewählte Bewertungen; sie garantiert keine vollständige Auswahl der drei neuesten Bewertungen. Eine solche Auswahl darf nicht als vollständig neueste Rezensionen dargestellt werden. Die Anbindung und die erforderliche Google-Quellenkennzeichnung müssen beim Anschluss des bestätigten Profils umgesetzt werden.

Der Produktionsbuild und die Prüfung von Sortierung sowie Platzierung vor dem Footer sind erfolgreich. Eine visuelle Browserprüfung steht in dieser Umgebung aus.

## Instagram-Beiträge

Der Instagram-Bereich befindet sich zwischen den Terminen und den Google-Bewertungen. `src/app/instagram-feed.component.*` zeigt bis zu sechs echte Beiträge: drei Spalten auf dem Desktop, zwei auf Tablets und eine auf kleinen Handys. Ein Klick öffnet den jeweiligen Originalbeitrag. Bilder werden verzögert geladen; Videos verwenden ihr Vorschaubild. DE/TR betrifft die Bedienoberfläche, nicht die Original-Bildunterschriften.

Der Profil-Link `https://www.instagram.com/medeinaland/` ist gesetzt. Es wurden keine Beiträge erfunden oder aus fremden Profilen übernommen. Der automatische Abruf ist vorbereitet, aber noch nicht angeschlossen. `instagramFeedEndpoint` in `src/app/instagram-feed.data.ts` bleibt bis zur tatsächlichen Kontoverbindung `null`; bis dahin erscheint ein neutraler Hinweis mit dem Profil-Link.

Eine echte serverseitige Verbindung muss `{ posts: [...] }` mit den Feldern `id`, `permalink`, `imageUrl`, `caption`, `publishedAt` und `mediaType` liefern. `publishedAt` enthält einen ISO-Zeitstempel; `mediaType` ist `IMAGE`, `VIDEO` oder `CAROUSEL_ALBUM`. Für Video-Beiträge ist `imageUrl` das Vorschaubild. Die Komponente prüft die Daten, sortiert nach Veröffentlichungszeit und begrenzt die Anzeige auf sechs Beiträge. Bei Ladefehlern bleibt der direkte Profil-Link verfügbar. Meta-Zugangsdaten gehören nicht in den Browser-Code.

Für die automatische Anzeige fehlt noch eine autorisierte Instagram-Kontoverbindung oder ein tatsächlich eingerichtetes Feed-Widget. Informationen zur Kontoverbindung: [Meta Instagram API](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/).
