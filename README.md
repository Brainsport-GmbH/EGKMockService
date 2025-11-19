# EGK Mock Service

Ein einfacher Mock-Service für deutsche Krankenversicherungsdaten (Elektronische Gesundheitskarte) mit benutzerfreundlicher grafischer Oberfläche.

## Funktionen

- **Grafische Benutzeroberfläche** - Einfach zu bedienen, auch für nicht-technische Nutzer
- **Konfigurierbare Versicherten-ID**:
  - Zufällige IDs bei jeder Anfrage
  - Feste ID für konsistente Tests
- **Erweiterte Einstellungen** - Alle EGK-Daten konfigurierbar:
  - Persönliche Daten (Vorname, Nachname, Geschlecht, Geburtsdatum)
  - Adressdaten (Straße, Hausnummer, Postleitzahl, Ort)
  - Versicherungsdaten (Krankenkasse, Versicherungsbeginn, Kostenträger, WOP, Versichertenart)
- **Windows-kompatibel** - Läuft als eigenständige .exe-Datei ohne zusätzliche Software

## Installation & Build

### Voraussetzungen (nur für Entwicklung)
- Node.js (Version 16 oder höher)

### Dependencies installieren

```bash
npm install
```

### Entwicklungsmodus starten

```bash
npm start
```

### Windows-Anwendung erstellen

```bash
npm run build
```

Die Anwendung wird mit **electron-packager** gepackt. Das Ergebnis befindet sich in:
- **Ordner**: `dist\EGK Mock Service-win32-x64\`
- **Executable**: `EGK Mock Service.exe`

Der gesamte Ordner kann auf andere Windows-PCs kopiert werden - keine Installation erforderlich!

## Verwendung

### Entwicklungsmodus
1. Öffnen Sie ein Terminal im Projektordner
2. Führen Sie `npm install` aus (nur beim ersten Mal)
3. Führen Sie `npm start` aus
4. Die Anwendung öffnet sich automatisch

### Windows-Anwendung (nach dem Build)
1. Navigieren Sie zum Ordner `dist\EGK Mock Service-win32-x64\`
2. Doppelklicken Sie auf `EGK Mock Service.exe`
3. Die Anwendung startet sofort - keine Installation nötig!

**Verteilung:**
- Kopieren Sie den gesamten Ordner `EGK Mock Service-win32-x64` auf andere PCs
- Alternativ: Erstellen Sie ein ZIP-Archiv für einfachere Verteilung

## Bedienung

### Grundeinstellungen

1. **Versicherten-ID wählen**:
   - **Zufällige ID**: Bei jeder Anfrage wird eine neue ID generiert (z.B. V123456789)
   - **Feste ID**: Geben Sie eine spezifische ID ein (Format: V + 9 Ziffern)

### Erweiterte Einstellungen

2. **Erweiterte Einstellungen öffnen**:
   - Klicken Sie auf "▶ Erweiterte Einstellungen"
   - Der Bereich klappt auf und zeigt drei Kategorien:
     - **Persönliche Daten**: Vorname, Nachname, Geschlecht, Geburtsdatum
     - **Adresse**: Straße, Hausnummer, Postleitzahl, Ort
     - **Versicherung**: Krankenkasse, Versicherungsbeginn, Kostenträger-IDs, WOP, Versichertenart

   **Hinweis**: Alle leeren Felder werden mit zufälligen Werten gefüllt. Nur ausgefüllte Felder verwenden die eingegebenen Werte.

### Server-Steuerung

3. **Server starten**:
   - Klicken Sie auf "Server starten"
   - Der Status ändert sich zu "Server läuft"
   - Die Server-URL wird angezeigt: `http://localhost:5724`
   - Alle Einstellungen werden während des Server-Betriebs gesperrt

4. **Server stoppen**:
   - Klicken Sie auf "Server stoppen"
   - Der Server wird beendet
   - Einstellungen können wieder geändert werden

5. **Anwendung beenden**:
   - Schließen Sie das Fenster
   - Der Server wird automatisch beendet

## API-Verwendung

Nach dem Start des Servers können Sie Mock-Daten abrufen:

```bash
curl http://localhost:5724
```

### Beispiel-Response

```json
{
  "daten": {
    "PersoenlicheVersicherungsdaten": {
      "Versicherter": {
        "Versicherten_ID": "V123456789",
        "Person": {
          "StrassenAdresse": {
            "Ort": "München",
            "Postleitzahl": "80331",
            "Strasse": "Hauptstraße",
            "Hausnummer": "42",
            "Land": {"Wohnsitzlaendercode": "D"}
          },
          "Geburtsdatum": "19750315",
          "Nachname": "Mustermann",
          "Geschlecht": "M",
          "Vorname": "Max"
        }
      }
    },
    "AllgemeineVersicherungsdaten": {
      "Versicherter": {
        "Versicherungsschutz": {
          "Beginn": "20150101",
          "Kostentraeger": {
            "Kostentraegerlaendercode": "D",
            "Kostentraegerkennung": "104212059",
            "Name": "AOK Bayern"
          }
        }
      }
    }
  },
  "status": "OK"
}
```

## Technische Details

- **Port**: 5724
- **Framework**: Electron + Express.js
- **Packaging**: electron-packager
- **CORS**: Aktiviert für alle Origins
- **Datenformat**: JSON
- **Plattform**: Windows (x64)

## Änderungsprotokoll

### Version 1.1.0
- ✨ **Neu**: Erweiterte Einstellungen mit allen konfigurierbaren EGK-Daten
  - Persönliche Daten (Vorname, Nachname, Geschlecht, Geburtsdatum)
  - Adressdaten (Straße, Hausnummer, PLZ, Ort)
  - Versicherungsdaten (Krankenkasse, Versicherungsbeginn, Kostenträger, WOP, Versichertenart)
- ✨ Ausklappbare UI-Sektion für erweiterte Einstellungen
- 🔧 Wechsel zu electron-packager für zuverlässiges Windows-Packaging
- 🐛 Build-Prozess optimiert (keine Admin-Rechte mehr erforderlich)

### Version 1.0.0
- Grafische Benutzeroberfläche mit Electron
- Konfigurierbare Versicherten-ID (zufällig oder fest)
- Windows .exe Build-Support
- Automatisches Beenden des Servers beim Schließen
- Bug-Fix: Versicherten-ID wird nun korrekt verwendet (nicht mehr hardcoded)

## Support

Bei Problemen oder Fragen öffnen Sie bitte ein Issue im Repository.
