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

## Meilenstein 2 — Punkteberechnungs-Logik (Kernstück, isoliert & getestet) ✅

- [x] Reine TypeScript-Funktionen für die Punkteberechnung (Abschnitt 3 der Anforderungen)
  — `src/game/scoring.ts`, Formel korrigiert: Stichpunkte zählen immer, siehe Commit `2a090b7`
- [x] Vitest-Unit-Tests für alle Fälle: korrekte/falsche Vorhersage, +5/−5-Bonus, Durchmarsch-Variante
  — 24 Tests, `src/game/scoring.test.ts` + `src/game/validation.test.ts`
- [x] Sieger-/Gleichstand-Logik (Abschnitt 5.5) als eigene getestete Funktion — `determineWinners`
- [x] Weiche Validierungs-Funktionen (Abschnitt 5a): Vorhersage vs. Kartenanzahl, Stichsumme vs.
      Kartenanzahl, Plus/Minus-Eins-Check — `src/game/validation.ts`, geben Warnung zurück, blockieren nichts
- [x] CI führt Testsuite vor jedem Build/Deploy aus

## Meilenstein 3 — Partie-Setup-Screen ✅

- [x] Spielernamen eingeben (3–8 Spieler) — `src/features/setup/PlayerSetupScreen.tsx`
- [x] Regel-Varianten beim Start auswählbar (UI-Toggles, Logik kommt aus Meilenstein 2)
- [x] Neue Partie anlegen — Formular validiert nur fehlende Namen (blockierend, strukturelle
      Spielregel), keine weiche Validierung nötig da kein Gameplay-Wert

## Meilenstein 4 — Rundenraster mit Live-Berechnung & Rangliste ✅

- [x] Rundenweise Erfassung (Vorhersage, gewonnene Stiche, Sonderpunkte als freies Zahlenfeld),
      Kartenanzahl 10→1 automatisch angezeigt — `src/features/game/RoundEntryScreen.tsx`
- [x] Punkte pro Runde live berechnet (nutzt Meilenstein 2)
- [x] Weiche Validierungshinweise bei unplausiblen Werten (nutzt Meilenstein 2, blockiert nicht) —
      erscheinen erst, sobald mindestens ein Feld befüllt ist (sonst unnötiges Rauschen bei leerem Formular)
- [x] Laufende Rangliste nach jeder Runde — `src/game/standings.ts`, `StandingsTable.tsx`

## Meilenstein 5 — Lokale Speicherung & Korrektur ✅

- [x] `localStorage`-Hook für Partie-Fortschritt (kein Datenverlust bei Reload) — `src/lib/useLocalStorage.ts`
- [x] Bereits erfasste Runden nachträglich bearbeitbar — `RoundHistory` + `RoundForm` im Edit-Modus,
      funktioniert auch nach Spielende. Zusätzlich: "Neue Partie"-Reset mit Bestätigung (notwendige
      Ergänzung, da der Fortschritt sonst dauerhaft im Browser hängen bliebe)

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
