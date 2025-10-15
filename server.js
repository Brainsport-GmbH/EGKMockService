const express = require('express');
const app = express();
const PORT = 5724;

// Helper function to generate random data
function generateRandomResponseData() {
    const firstNames = ['Max', 'Anna', 'Peter', 'Maria', 'Klaus', 'Sabine', 'Thomas', 'Julia', 'Michael', 'Sandra'];
    const lastNames = ['Mustermann', 'Schmidt', 'Müller', 'Weber', 'Meyer', 'Wagner', 'Becker', 'Schulz', 'Hoffmann', 'Schäfer'];
    const cities = ['Berlin', 'Hamburg', 'München', 'Köln', 'Frankfurt', 'Stuttgart', 'Düsseldorf', 'Dortmund', 'Essen', 'Bremen'];
    const streets = ['Hauptstraße', 'Bahnhofstraße', 'Kirchgasse', 'Schulstraße', 'Gartenweg', 'Lindenstraße', 'Berliner Straße', 'Am Markt', 'Dorfstraße', 'Poststraße'];
    const insuranceNames = ['AOK Bayern', 'Barmer GEK', 'TK Techniker', 'DAK Gesundheit', 'IKK Classic', 'BKK VBU', 'HEK Hanseatische', 'KKH Allianz'];
    
    // Generate random values
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const city = cities[Math.floor(Math.random() * cities.length)];
    const street = streets[Math.floor(Math.random() * streets.length)];
    const insuranceName = insuranceNames[Math.floor(Math.random() * insuranceNames.length)];
    
    const versichertenId = 'V' + Math.floor(Math.random() * 900000000 + 100000000);
    const postcode = String(Math.floor(Math.random() * 90000 + 10000));
    const houseNumber = String(Math.floor(Math.random() * 200 + 1));
    const gender = Math.random() > 0.5 ? 'M' : 'W';
    
    // Generate random birth date (between 1940 and 2005)
    const birthYear = Math.floor(Math.random() * 65 + 1940);
    const birthMonth = String(Math.floor(Math.random() * 12 + 1)).padStart(2, '0');
    const birthDay = String(Math.floor(Math.random() * 28 + 1)).padStart(2, '0');
    const birthDate = `${birthYear}${birthMonth}${birthDay}`;
    
    // Generate random insurance start date (between 2010 and 2023)
    const startYear = Math.floor(Math.random() * 14 + 2010);
    const startMonth = String(Math.floor(Math.random() * 12 + 1)).padStart(2, '0');
    const startDay = String(Math.floor(Math.random() * 28 + 1)).padStart(2, '0');
    const insuranceStart = `${startYear}${startMonth}${startDay}`;
    
    // Generate random insurance IDs
    const kostentraegerkennung1 = String(Math.floor(Math.random() * 900000000 + 100000000));
    const kostentraegerkennung2 = String(Math.floor(Math.random() * 900000000 + 100000000));
    const wop = String(Math.floor(Math.random() * 99 + 1));
    const versichertenart = String(Math.floor(Math.random() * 9 + 1));

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

// Route to serve the JSON data
app.get('/', (req, res) => {
    // Generate fresh random data for each request
    const randomData = generateRandomResponseData();
    
    // Add Access-Control-Allow-Origin header
    res.header('Access-Control-Allow-Origin', '*');
    res.json(randomData);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});