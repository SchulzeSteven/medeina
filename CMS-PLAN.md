# CMS: besprochener Stand

Stand: 29. Oktober 2026. Planungsnotiz; noch keine CMS-Implementierung beauftragt oder begonnen.

## Ziel

- Ein zentrales, wiederverwendbares CMS für mehrere unterschiedliche Websites.
- Erste angebundene Website: medeina.de (bestehendes Angular-Frontend).
- Çağla soll ihre Website-Inhalte selbst pflegen können: Texte, Bilder, Buttons, Angebote, Termine, FAQs, Kontaktangaben und SEO-Metadaten, jeweils bei Bedarf auf DE/TR/EN.
- Das vorhandene Design bleibt durch feste Templates und strukturierte Inhaltsfelder vorgegeben. Kein freier Layout-Editor. Neue Layouts/Funktionen bleiben Entwicklungsarbeit.
- Der Eigentümer verwaltet alle Websites; Çağla erhält ausschließlich Zugriff auf Medeina. Inhalte, Medien, API-Zugriffe und Berechtigungen müssen pro Website getrennt sein.

## Geplante Technik

- Laravel als Backend und Inhalts-API.
- Filament als CMS-Oberfläche mit Seiten-/Bereichsnavigation, Bearbeitungsformularen und Bildvorschauen, ähnlich der vom Benutzer gezeigten Referenz.
- PostgreSQL für Inhalte, Übersetzungen, Benutzer und Zuordnungen.
- Dauerhafter Dateispeicher für Bilder; Datenbank speichert Medienreferenzen.
- Später Hosting auf Laravel Cloud, kein selbst verwalteter Server. Zunächst Starter vorgesehen; tatsächliche Nutzungskosten für Anwendung, Datenbank und Dateispeicher vor Buchung prüfen.
- Empfohlene CMS-Adresse: admin.medeina.de. medeina.de/admin wäre alternativ möglich, erfordert bei getrenntem Hosting zusätzliche Routing-/Proxy-Konfiguration.
- Die öffentliche Website kann beim bisherigen Hoster bleiben und veröffentlichte Inhalte über die API beziehen.
- Domain-Pfade wie /angebote verbrauchen keine zusätzlichen Custom Domains. Subdomains werden separat angebunden.

## Entwicklung und Veröffentlichung

- Zuerst vollständig lokal entwickeln und testen; medeina.de muss dafür nicht umgestellt werden.
- Docker Desktop ist laut Benutzer vorhanden. Bei Windows/WSL als Nächstes die Integration mit der verwendeten Distribution prüfen.
- Laravel/PHP/Composer-Verfügbarkeit und lokale Umgebung noch prüfen; Laravel Sail/Docker als geplanter Weg.
- Eigenes CMS-Projekt außerhalb des bestehenden Angular-Projekts und später separates privates GitHub-Repository, vorgeschlagener Name website-cms.
- Bestehendes Website-Repository: SchulzeSteven/medeina.
- Später CMS-Repository und Branch mit Laravel Cloud verbinden; Code-Pushes können Deployments auslösen.
- Redaktionelle Änderungen gehen in Datenbank/Dateispeicher und benötigen nach der API-Anbindung keinen Git-Push oder Frontend-Build.
- Laravel-Cloud-Abo, Datenbank und Domain-Anbindung sind für lokale Arbeit noch nicht nötig.

## Vorgeschlagene Reihenfolge

1. Lokale Voraussetzungen prüfen und separates Laravel-/Filament-Projekt mit PostgreSQL einrichten.
2. Website-/Mandantenmodell und Benutzerrechte aufbauen; Medeina als erste Website anlegen.
3. Als ersten vollständigen Durchstich „Angebote → Vorstellung von Çağla“ bearbeiten: Überschrift, DE/TR/EN-Texte, Porträt; in lokaler Angular-Website über API anzeigen.
4. Bestehende fest codierte Inhalte schrittweise übernehmen; Design beibehalten.
5. Entwürfe, Vorschau, Veröffentlichung, wiederherstellbare Inhaltsversionen und Backups vorsehen.
6. Trennung mehrerer Websites und Benutzer lokal prüfen.
7. Erst danach GitHub-/Laravel-Cloud-Deployment und admin.medeina.de einrichten.

## Nächster Gesprächsschritt

Der Benutzer hat darum gebeten, diese Punkte festzuhalten, bevor weitergearbeitet wird. Noch keine Installation, Cloud-Buchung oder Änderung der Domain vornehmen. Bei Wiederaufnahme mit der Prüfung der lokalen Docker-/WSL-Umgebung beginnen.
