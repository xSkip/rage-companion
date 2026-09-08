# RAGE Companion Website — Anforderungen

> Status: Entwurf — Kernanforderungen mit Projektinhaber abgestimmt (Stand 2026-09-08).
> Basis: Spielanleitung `Rage_Rules.pdf` (AMIGO Spiel + Freizeit, Version 2.3) und
> Wertungsblatt-Kopiervorlage `Rage_Wertung_Kopiervorlage.pdf`.

## 1. Überblick

- **Projekt:** Companion-Website zum Kartenspiel **RAGE** (AMIGO Spiele, Stichspiel, 3–8 Spieler, 10 Runden)
- **Ziel:** Digitaler Ersatz für das Papier-Wertungsblatt, das während einer physischen RAGE-Partie
  zum Notieren von Vorhersagen und Punkten verwendet wird.
- **Zielgruppe:** RAGE-Spielrunden, die das Kartenspiel analog spielen und die Punkteverwaltung
  digital/komfortabler erledigen wollen.

## 2. Zielsetzung & Nutzen

Das physische Wertungsblatt erfordert manuelles Rechnen (Vorhersage korrekt? +10, sonst −5,
plus/minus Sonderkarten) und ist fehleranfällig. Die Website übernimmt die Berechnung automatisch,
zeigt den Punktestand laufend an und bietet zusätzlichen Komfort (Regel-Nachschlagewerk, Statistiken
über mehrere Partien), den Papier nicht bieten kann.

## 3. Spielregel-Zusammenfassung (Kontext für die Umsetzung)

- 10 Runden. Karten pro Spieler: Runde 1 = 10 Karten, Runde 2 = 9, …, Runde 10 = 1 Karte.
- Pro Runde: jeder Spieler sagt vorher, wie viele Stiche er gewinnt (Vorhersage).
- Nach der Runde: Punkte pro Spieler =
  - **Vorhersage korrekt:** gewonnene Stiche + 10 Bonuspunkte + Sonderkartenpunkte (+5/−5)
  - **Vorhersage falsch:** −5 Punkte (pauschal, unabhängig von der Differenz) + Sonderkartenpunkte
- Sonderkartenpunkte (+5/−5) fallen an, wenn eine gewonnene Stich-Reihe eine +5- oder −5-Karte enthält.
- Nach 10 Runden gewinnt, wer die meisten Gesamtpunkte hat. Gleichstand an der Spitze = gemeinsamer Sieg.
- **Varianten** (offiziell, optional aktivierbar): Plus/Minus Eins, Verdeckter Tipp, Geheime Vorhersage,
  Durchmarsch (doppelte Stichpunkte bei Gewinn aller Stiche einer Runde, außer in Runde 10).

## 4. Projekt-Scope

**In Scope:** Ausschließlich der digitale Ersatz des Wertungsblatts (Vorhersagen erfassen, Stiche/Sonderpunkte
erfassen, Punkte automatisch berechnen, Rangliste anzeigen) plus unterstützende Zusatzfeatures rund um die
Punkteverwaltung und den Spielabend.

**Explizit Out of Scope:** Das Kartenspiel selbst wird **nicht** digital nachgebildet — kein Karten-Deck,
keine virtuelle Stichauswertung, kein Multiplayer-Kartenspiel. Die App begleitet eine physische Partie mit
echten Karten.

## 5. Kernfunktionen (Muss-Have)

1. **Partie starten:** 3–8 Spielernamen eingeben, neue Partie anlegen.
2. **Rundenweise Erfassung** für alle 10 Runden (Kartenanzahl 10→1 wird automatisch angezeigt):
   - Vorhersage (Anzahl angesagter Stiche) pro Spieler
   - Tatsächlich gewonnene Stiche pro Spieler
   - Sonderkarten-Bonus (+5/−5) pro Spieler, falls zutreffend
3. **Automatische Punkteberechnung** je Runde und Spieler nach der Regel aus Abschnitt 3.
4. **Laufende Rangliste** mit Gesamtpunktestand nach jeder abgeschlossenen Runde.
5. **Spielende & Sieger-Ermittlung** nach Runde 10, inkl. gemeinsamem Sieg bei Punktegleichstand.
6. **Korrekturmöglichkeit:** bereits erfasste Runden nachträglich bearbeiten.
7. **Lokale Speicherung:** Partie-Fortschritt wird lokal im Browser gespeichert (kein Datenverlust bei
   Reload/Schließen der Seite). Kein Login, kein Server-Backend nötig.

## 6. Regel-Varianten (Soll-Have)

8. Aktivierbare offizielle Varianten beim Partie-Start (siehe Abschnitt 3):
   - Plus/Minus Eins
   - Verdeckter Tipp / Geheime Vorhersage (reine Ablauf-/UI-Hilfe, kein Effekt auf Berechnung)
   - Durchmarsch (Sonderregel für Punkteberechnung bei vollständigem Stichgewinn)

## 7. Zusätzliche Komfort-Features (Nice-to-Have)

9. **Trumpffarbe pro Runde** vermerken (reine Anzeige/Erinnerung, kein Effekt auf Berechnung).
10. **Verlauf & Statistiken** über mehrere gespeicherte Partien hinweg (Siegstatistik, Punkteschnitt pro Spieler).
11. **Regel-Kurzreferenz** in der App (Wirkung von Joker, Trumpfwechsel, Kein Trumpf, +5/−5 zum Nachschlagen).
12. **Partie teilen/exportieren** (z. B. Endstand als Bild oder Text).

## 8. Internationalisierung

- Die Sprache muss in der App **umschaltbar** sein (Spracheinstellung durch den Nutzer).
- Startsprache: Deutsch. Weitere Sprachen (mind. Englisch) sollen ohne Architektur-Änderung
  nachrüstbar sein (Texte von Anfang an über eine i18n-Struktur auslagern, nicht hartcodieren).

## 9. Zielplattform

- Web-App, responsive für Mobile/Tablet (Gerät wird während der Partie am Tisch herumgereicht).
- Kein Login/Account-System (siehe Abschnitt 5.7).

## 10. Tech Stack

_TBD — wird in einem separaten Schritt entschieden (Frontend-Framework, Hosting)._

## 11. Design & Look and Feel

_TBD — Anlehnung an RAGE-Branding (siehe Kartendesign in der Anleitung)?_

## 12. Offene Fragen

- [ ] Tech-Stack-Entscheidung (Framework, Hosting)
- [ ] Design-/Branding-Richtung
- [ ] Reihenfolge/Priorisierung der Nice-to-Have-Features für einen ersten Release

---

_Dieses Dokument wird iterativ im Gespräch zwischen Nutzer und Claude ausgebaut und dient als
Referenz bei der Implementierung._
