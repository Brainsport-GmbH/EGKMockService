const express = require('express');
const app = express();
const PORT = 5724;

// Example data - sensitive information replaced with example data
const responseData = {
    "daten": {
        "PersoenlicheVersicherungsdaten": {"Versicherter": {
            "Versicherten_ID": "V495276477",
            "Person": {
                "StrassenAdresse": {
                    "Ort": "Beispielstadt",
                    "Postleitzahl":"12345",
                    "Strasse": "Beispielstraße",
                    "Hausnummer":"42",
                    "Land": {"Wohnsitzlaendercode": "D"}
                },
                "Geburtsdatum":"19900101",
                "Nachname": "Mustermann",
                "Geschlecht": "M",
                "Vorname": "Max"
            }
        }},
        "AllgemeineVersicherungsdaten": {"Versicherter": {
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
            "Zusatzinfos": {"ZusatzinfosGKV": {
                "Zusatzinfos_Abrechnung_GKV": {"WOP":"46"},
                "Versichertenart":"1"
            }}
        }}
    },
    "status": "OK"
};

// Route to serve the JSON data
app.get('/', (req, res) => {
    // Add Access-Control-Allow-Origin header
    res.header('Access-Control-Allow-Origin', '*');
    res.json(responseData);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});