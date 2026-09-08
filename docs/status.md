# Implementierungsstatus & Vorgehen

> Bildet die Anforderungen aus [requirements.md](requirements.md) auf eine sinnvolle Bau-Reihenfolge ab.
> Ein Punkt wird im selben Commit abgehakt, der ihn implementiert — Details siehe Commit-Historie (`git log`).
>
> **Prinzip der Reihenfolge:** Erst die Deployment-Pipeline lauffähig machen (jede spätere Änderung sofort
> auf einem echten Gerät prüfbar), dann die Punkteberechnung als isolierte, getestete Logik bauen (das ist
> das fehleranfälligste Stück — muss vor jeder UI stimmen), danach den Kern-Loop des Wertungsblatt-Ersatzes
> fertigstellen. i18n, Regel-Varianten und Feinschliff folgen erst, wenn der Kern-Loop funktioniert.
> Komfort-Features und PWA kommen zuletzt, da sie den eigentlichen Zweck (Wertungsblatt ersetzen) nicht
> blockieren.

## Meilenstein 1 — Projekt-Grundgerüst & Deployment-Pipeline ✅

- [x] Vite + React + TypeScript Grundgerüst
- [x] Tailwind CSS eingerichtet
- [x] GitHub Pages Deployment (auch mit Platzhalter-Seite testen — Pipeline muss von Anfang an stehen)
  — live unter https://xskip.github.io/rage-companion/, automatischer Deploy bei Push auf `master`
  (Hinweis: Repo musste dafür auf öffentlich gestellt werden, da GitHub Pages für private Repos auf
  dem aktuellen Plan nicht verfügbar ist)

## Meilenstein 2 — Punkteberechnungs-Logik (Kernstück, isoliert & getestet)

- [ ] Reine TypeScript-Funktionen für die Punkteberechnung (Abschnitt 3 der Anforderungen)
- [ ] Vitest-Unit-Tests für alle Fälle: korrekte/falsche Vorhersage, +5/−5-Bonus, Durchmarsch-Variante
- [ ] Sieger-/Gleichstand-Logik (Abschnitt 5.5) als eigene getestete Funktion
- [ ] Weiche Validierungs-Funktionen (Abschnitt 5a): Vorhersage vs. Kartenanzahl, Stichsumme vs.
      Kartenanzahl, Plus/Minus-Eins-Check — geben Warnung zurück, blockieren nichts

## Meilenstein 3 — Partie-Setup-Screen

- [ ] Spielernamen eingeben (3–8 Spieler)
- [ ] Regel-Varianten beim Start auswählbar (UI-Toggles, Logik kommt aus Meilenstein 2)
- [ ] Neue Partie anlegen

## Meilenstein 4 — Rundenraster mit Live-Berechnung & Rangliste

- [ ] Rundenweise Erfassung (Vorhersage, gewonnene Stiche, Sonderpunkte als freies Zahlenfeld),
      Kartenanzahl 10→1 automatisch angezeigt
- [ ] Punkte pro Runde live berechnet (nutzt Meilenstein 2)
- [ ] Weiche Validierungshinweise bei unplausiblen Werten (nutzt Meilenstein 2, blockiert nicht)
- [ ] Laufende Rangliste nach jeder Runde

## Meilenstein 5 — Lokale Speicherung & Korrektur

- [ ] `localStorage`-Hook für Partie-Fortschritt (kein Datenverlust bei Reload)
- [ ] Bereits erfasste Runden nachträglich bearbeitbar

## Meilenstein 6 — Spielende

- [ ] Sieger-Anzeige nach Runde 10 (inkl. gemeinsamem Sieg bei Gleichstand)

## Meilenstein 7 — Internationalisierung

- [ ] Eigene i18n-Lösung (JSON-Wörterbücher `de`/`en` + Context-Hook)
- [ ] Sprachumschaltung in der App

## Meilenstein 8 — Responsive-Feinschliff

- [ ] Layout für Mobile/Tablet geprüft und optimiert (Gerät wird am Tisch herumgereicht)

**→ Ab hier ist der MVP (Wertungsblatt-Ersatz) vollständig.**

## Meilenstein 9 — Komfort-Features (Nice-to-Have)

- [ ] Trumpffarbe pro Runde vermerken
- [ ] Regel-Kurzreferenz in der App
- [ ] Verlauf & Statistiken über mehrere Partien
- [ ] Partie teilen/exportieren

## Meilenstein 10 — PWA

- [ ] Installierbar/offline-fähig (Manifest + Service Worker)
