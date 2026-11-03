# Projektanweisungen

## Produktionsbuild und dist

- Die Website wird unter `https://steven-schulze.com/medeina/` bereitgestellt.
- Wenn der Nutzer eine `dist` oder einen Build für den Upload anfordert, immer `npm run build:medeina` verwenden.
- `npm run build` verwendet den Basispfad `/` und ist für dieses Unterordner-Hosting ungeeignet: Das kann nach dem Upload eine weiße Seite verursachen.
- Nach dem Build prüfen, dass `dist/medaina/browser/index.html` den Eintrag `<base href="/medeina/">` enthält und die referenzierten JavaScript- und CSS-Dateien vorhanden sind.
- Upload: den gesamten Inhalt von `dist/medaina/browser/` einschließlich `.htaccess` in den Serverordner `medeina` übertragen.
