# EGKMockService

A mock service that simulates German electronic health insurance card (elektronische Gesundheitskarte, EGK) data responses. This service is meant to be used as a mocking service for the card reader - if you don't have a physical card reader with a card inside, this service provides sample data to simulate one.

## Purpose

This lightweight mock service provides standardized sample data for development and testing purposes when you:
- Don't have access to a physical card reader
- Need consistent test data during development
- Want to test your application's integration with EGK data

## Features

- Provides a RESTful API endpoint that returns sample EGK insurance data
- Simulates the structure of real EGK data with anonymized information
- Includes CORS support for cross-origin requests
- Runs on port 5724

## Getting Started

### Prerequisites

- Node.js
- npm

### Installation

1. Clone this repository
2. Install dependencies:

```bash
npm install
```

### Running the Service

Start the server using either:

```bash
npm start
```

Or:

```bash
node server.js
```

The server will run on http://localhost:5724

## API Usage

Send a GET request to the root endpoint:

```
GET http://localhost:5724/
```

## Example Response

The service returns a JSON object with sample insurance data including:
- Personal data (name, address, date of birth)
- Insurance details (insurance ID, provider information)
- Coverage information

Example:
```json
{
    "daten": {
        "PersoenlicheVersicherungsdaten": {
            "Versicherter": {
                "Versicherten_ID": "V495276477",
                "Person": {
                    "StrassenAdresse": {
                        "Ort": "Beispielstadt",
                        "Postleitzahl":"12345",
                        "Strasse": "Beispielstraﬂe",
                        "Hausnummer":"42",
                        "Land": {"Wohnsitzlaendercode": "D"}
                    },
                    "Geburtsdatum":"19900101",
                    "Nachname": "Mustermann",
                    "Geschlecht": "M",
                    "Vorname": "Max"
                }
            }
        },
        "AllgemeineVersicherungsdaten": {
            "Versicherter": {
                "Versicherungsschutz": {
                    "Beginn":"20160501",
                    "Kostentraeger": {
                        "Kostentraegerlaendercode": "D",
                        "Kostentraegerkennung":"103170002",
                        "AbrechnenderKostentraeger": {
                            "Kostentraegerlaendercode": "D",
                            "Kostentraegerkennung":"105186802",
                            "Name": "Beispielkrankenkasse"
                        },
                        "Name": "Beispielkrankenkasse"
                    }
                },
                "Zusatzinfos": {
                    "ZusatzinfosGKV": {
                        "Zusatzinfos_Abrechnung_GKV": {"WOP":"46"},
                        "Versichertenart":"1"
                    }
                }
            }
        }
    },
    "status": "OK"
}
```