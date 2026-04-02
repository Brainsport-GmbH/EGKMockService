const express = require('express');
const PORT = 5724;

let app = null;
let server = null;
let configuredSettings = {};

// Helper function to generate random data
function generateRandomResponseData() {
    const firstNames = ['Max', 'Anna', 'Peter', 'Maria', 'Klaus', 'Sabine', 'Thomas', 'Julia', 'Michael', 'Sandra'];
    const lastNames = ['Mustermann', 'Schmidt', 'Müller', 'Weber', 'Meyer', 'Wagner', 'Becker', 'Schulz', 'Hoffmann', 'Schäfer'];
    const cities = ['Berlin', 'Hamburg', 'München', 'Köln', 'Frankfurt', 'Stuttgart', 'Düsseldorf', 'Dortmund', 'Essen', 'Bremen'];
    const streets = ['Hauptstraße', 'Bahnhofstraße', 'Kirchgasse', 'Schulstraße', 'Gartenweg', 'Lindenstraße', 'Berliner Straße', 'Am Markt', 'Dorfstraße', 'Poststraße'];
    const insuranceNames = ['AOK Bayern', 'Barmer GEK', 'TK Techniker', 'DAK Gesundheit', 'IKK Classic', 'BKK VBU', 'HEK Hanseatische', 'KKH Allianz'];

    // Use configured values if set, otherwise generate random
    const firstName = configuredSettings.vorname || firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = configuredSettings.nachname || lastNames[Math.floor(Math.random() * lastNames.length)];
    const city = configuredSettings.ort || cities[Math.floor(Math.random() * cities.length)];
    const street = configuredSettings.strasse || streets[Math.floor(Math.random() * streets.length)];
    const insuranceName = configuredSettings.krankenkasse || insuranceNames[Math.floor(Math.random() * insuranceNames.length)];

    const versichertenId = configuredSettings.versichertenId || ('V' + Math.floor(Math.random() * 900000000 + 100000000));
    const postcode = configuredSettings.postleitzahl || String(Math.floor(Math.random() * 90000 + 10000));
    const houseNumber = configuredSettings.hausnummer || String(Math.floor(Math.random() * 200 + 1));
    const gender = configuredSettings.geschlecht || (Math.random() > 0.5 ? 'M' : 'W');
    
    // Birth date - use configured or generate random (between 1940 and 2005)
    let birthDate;
    if (configuredSettings.geburtsdatum) {
        birthDate = configuredSettings.geburtsdatum;
    } else {
        const birthYear = Math.floor(Math.random() * 65 + 1940);
        const birthMonth = String(Math.floor(Math.random() * 12 + 1)).padStart(2, '0');
        const birthDay = String(Math.floor(Math.random() * 28 + 1)).padStart(2, '0');
        birthDate = `${birthYear}${birthMonth}${birthDay}`;
    }

    // Insurance start date - use configured or generate random (between 2010 and 2023)
    let insuranceStart;
    if (configuredSettings.versicherungsbeginn) {
        insuranceStart = configuredSettings.versicherungsbeginn;
    } else {
        const startYear = Math.floor(Math.random() * 14 + 2010);
        const startMonth = String(Math.floor(Math.random() * 12 + 1)).padStart(2, '0');
        const startDay = String(Math.floor(Math.random() * 28 + 1)).padStart(2, '0');
        insuranceStart = `${startYear}${startMonth}${startDay}`;
    }

    // Insurance IDs - use configured or generate random
    const kostentraegerkennung1 = configuredSettings.kostentraeger1 || String(Math.floor(Math.random() * 900000000 + 100000000));
    const kostentraegerkennung2 = configuredSettings.kostentraeger2 || String(Math.floor(Math.random() * 900000000 + 100000000));
    const wop = configuredSettings.wop || String(Math.floor(Math.random() * 99 + 1));
    const versichertenart = configuredSettings.versichertenart || String(Math.floor(Math.random() * 9 + 1));

    return {
        "daten": {
            "PersoenlicheVersicherungsdaten": {"Versicherter": {
                "Versicherten_ID": versichertenId,
                "Person": {
                    "StrassenAdresse": {
                        "Ort": city,
                        "Postleitzahl": postcode,
                        "Strasse": street,
                        "Hausnummer": houseNumber,
                        "Land": {"Wohnsitzlaendercode": "D"}
                    },
                    "Geburtsdatum": birthDate,
                    "Nachname": lastName,
                    "Geschlecht": gender,
                    "Vorname": firstName
                }
            }},
            "AllgemeineVersicherungsdaten": {"Versicherter": {
                "Versicherungsschutz": {
                    "Beginn": insuranceStart,
                    "Kostentraeger": {
                        "Kostentraegerlaendercode": "D",
                        "Kostentraegerkennung": kostentraegerkennung1,
                        "AbrechnenderKostentraeger": {
                            "Kostentraegerlaendercode": "D",
                            "Kostentraegerkennung": kostentraegerkennung2,
                            "Name": insuranceName
                        },
                        "Name": insuranceName
                    }
                },
                "Zusatzinfos": {"ZusatzinfosGKV": {
                    "Zusatzinfos_Abrechnung_GKV": {"WOP": wop},
                    "Versichertenart": versichertenart
                }}
            }}
        },
        "status": "OK"
    };
}

// Start server function
function startServer(settings = {}) {
    return new Promise((resolve, reject) => {
        if (server) {
            reject(new Error('Server is already running'));
            return;
        }

        // Store all configured settings
        configuredSettings = settings || {};
        app = express();

        // Route to serve the JSON data
        app.get('/', (req, res) => {
            // Generate fresh random data for each request
            const randomData = generateRandomResponseData();

            // Add Access-Control-Allow-Origin header
            res.header('Access-Control-Allow-Origin', '*');
            res.json(randomData);
        });

        server = app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
            resolve();
        });

        server.on('error', (err) => {
            server = null;
            app = null;
            reject(err);
        });
    });
}

// Stop server function
function stopServer() {
    return new Promise((resolve) => {
        if (server) {
            server.close(() => {
                server = null;
                app = null;
                console.log('Server stopped');
                resolve();
            });
        } else {
            resolve();
        }
    });
}

module.exports = { startServer, stopServer, PORT };