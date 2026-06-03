# HTML- & CSS-Drag-and-Drop-Übung

Eine einfache browserbasierte Übung zur Überprüfung von HTML- und CSS-Kenntnissen mit Drag-and-Drop-Aufgaben.

## Dateien

- `index.html` — Anwendungsschale und Container
- `styles.css` — Layout, Farben und Interaktionsdesign
- `script.js` — Drag-and-Drop-Logik sowie Auswertung
- `questions.json` — alle Fragen, Antworten, Schwierigkeitsgrade und Hinweise

## Ausführen

Die App lädt die Fragen aus `questions.json`. Am einfachsten funktioniert sie über einen lokalen Webserver, z. B.:

```powershell
cd p:\html-challenge
python -m http.server 8000
```

Dann im Browser öffnen:

`http://localhost:8000`

## Fragen hinzufügen

Weitere Aufgaben können direkt in `questions.json` ergänzt werden. Jede Übung muss mindestens folgende Felder enthalten:

- `id`
- `title`
- `description`
- `difficulty` (`easy`, `medium`, `hard`)
- `targets` mit `answer` und `label`
- `items` mit `value` und `label`
- optional `hint` für einen Lösungsbutton

## Spielablauf

1. Ziehe jeden Eintrag in die passende Drop-Zone.
2. Klicke auf **Antworten prüfen**, um deine Ergebnisse anzuzeigen.
3. Klicke auf **Zurücksetzen**, um alle Karten zurückzusetzen.
