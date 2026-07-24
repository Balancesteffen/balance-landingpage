# BALANCE Landingpage für Cloudflare Pages

## Enthalten
- minimalistische Onepage
- Kontaktformular mit Name, E-Mail und Telefonnummer
- serverseitige Smartlead-Anbindung über Cloudflare Pages Functions
- responsive Darstellung
- Platzhalterseiten für Impressum und Datenschutz

## Deployment
1. Den Inhalt dieses Ordners in ein GitHub-Repository laden.
2. In Cloudflare: Workers & Pages → Create → Pages → Connect to Git.
3. Framework preset: `None`.
4. Build command: leer lassen.
5. Build output directory: `/`.
6. Unter Settings → Variables and Secrets zwei Variablen anlegen:
   - `SMARTLEAD_API_KEY` als Secret
   - `SMARTLEAD_CAMPAIGN_ID` als Variable
7. Neu deployen und anschließend die Domain verbinden.

## Wichtig
- Den Smartlead-API-Key niemals in `script.js` oder `index.html` eintragen.
- Impressum und Datenschutz vor Veröffentlichung mit den echten Unternehmensdaten ergänzen und rechtlich prüfen.
- Die Smartlead-Kampagne sollte bereits angelegt sein. Neue Formularanfragen werden dieser Kampagne hinzugefügt.
