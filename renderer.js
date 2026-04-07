// Get DOM elements
const radioButtons = document.querySelectorAll('input[name="idMode"]');
const fixedIdInput = document.getElementById('fixedId');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const statusDisplay = document.getElementById('statusDisplay');
const urlDisplay = document.getElementById('urlDisplay');
const statusIndicator = statusDisplay.querySelector('.status-indicator');
const statusText = statusDisplay.querySelector('.status-text');

// Advanced settings elements
const advancedToggle = document.getElementById('advancedToggle');
const advancedContent = document.getElementById('advancedContent');
const toggleIcon = advancedToggle.querySelector('.toggle-icon');

// Advanced field elements
const advancedFields = {
    vorname: document.getElementById('vorname'),
    nachname: document.getElementById('nachname'),
    geschlecht: document.getElementById('geschlecht'),
    geburtsdatum: document.getElementById('geburtsdatum'),
    strasse: document.getElementById('strasse'),
    hausnummer: document.getElementById('hausnummer'),
    postleitzahl: document.getElementById('postleitzahl'),
    ort: document.getElementById('ort'),
    krankenkasse: document.getElementById('krankenkasse'),
    versicherungsbeginn: document.getElementById('versicherungsbeginn'),
    kostentraeger1: document.getElementById('kostentraeger1'),
    kostentraeger2: document.getElementById('kostentraeger2'),
    wop: document.getElementById('wop'),
    versichertenart: document.getElementById('versichertenart')
};

let isServerRunning = false;
let isAdvancedExpanded = false;

// Handle advanced settings toggle
advancedToggle.addEventListener('click', () => {
    isAdvancedExpanded = !isAdvancedExpanded;

    if (isAdvancedExpanded) {
        advancedContent.classList.add('expanded');
        toggleIcon.classList.add('expanded');
    } else {
        advancedContent.classList.remove('expanded');
        toggleIcon.classList.remove('expanded');
    }
});

// Handle radio button changes
radioButtons.forEach(radio => {
    radio.addEventListener('change', (e) => {
        if (e.target.value === 'fixed') {
            fixedIdInput.disabled = false;
            fixedIdInput.focus();
        } else {
            fixedIdInput.disabled = true;
            fixedIdInput.value = '';
        }
    });
});

// Validate Versicherten-ID format
function validateVersichertenId(id) {
    if (!id) return true; // Empty is valid for random mode

    // Accept any non-empty input from the user
    return id.length > 0;
}

// Collect advanced settings
function collectAdvancedSettings() {
    const settings = {};

    for (const [key, element] of Object.entries(advancedFields)) {
        const value = element.value.trim();
        if (value) {
            settings[key] = value;
        }
    }

    return settings;
}

// Start server
startBtn.addEventListener('click', async () => {
    const mode = document.querySelector('input[name="idMode"]:checked').value;
    let versichertenId = null;

    if (mode === 'fixed') {
        const inputValue = fixedIdInput.value.trim();

        if (!inputValue) {
            alert('Bitte geben Sie eine Versicherten-ID ein oder wählen Sie "Zufällige ID".');
            fixedIdInput.focus();
            return;
        }

        if (!validateVersichertenId(inputValue)) {
            alert('Bitte geben Sie eine gültige Versicherten-ID ein.');
            fixedIdInput.focus();
            return;
        }

        versichertenId = inputValue;
    }

    // Collect advanced settings
    const advancedSettings = collectAdvancedSettings();

    try {
        // Send start command to main process with all settings
        await window.electronAPI.startServer({ versichertenId, ...advancedSettings });

        // Update UI
        isServerRunning = true;
        updateUIState();

        // Show success message
        const idInfo = versichertenId ? `mit ID: ${versichertenId}` : 'mit zufälligen IDs';
        console.log(`Server gestartet ${idInfo}`);

    } catch (error) {
        alert(`Fehler beim Starten des Servers: ${error.message}`);
    }
});

// Stop server
stopBtn.addEventListener('click', async () => {
    try {
        await window.electronAPI.stopServer();

        // Update UI
        isServerRunning = false;
        updateUIState();

        console.log('Server gestoppt');

    } catch (error) {
        alert(`Fehler beim Stoppen des Servers: ${error.message}`);
    }
});

// Update UI state based on server status
function updateUIState() {
    if (isServerRunning) {
        // Server is running
        startBtn.disabled = true;
        stopBtn.disabled = false;

        statusIndicator.className = 'status-indicator status-running';
        statusText.textContent = 'Server läuft';
        urlDisplay.style.display = 'block';

        // Disable settings while server is running
        radioButtons.forEach(radio => radio.disabled = true);
        fixedIdInput.disabled = true;
        advancedToggle.disabled = true;

        // Disable all advanced fields
        Object.values(advancedFields).forEach(field => field.disabled = true);

    } else {
        // Server is stopped
        startBtn.disabled = false;
        stopBtn.disabled = true;

        statusIndicator.className = 'status-indicator status-stopped';
        statusText.textContent = 'Server gestoppt';
        urlDisplay.style.display = 'none';

        // Enable settings
        radioButtons.forEach(radio => radio.disabled = false);
        advancedToggle.disabled = false;

        // Enable fixed ID input only if fixed mode is selected
        const fixedMode = document.querySelector('input[name="idMode"]:checked').value === 'fixed';
        fixedIdInput.disabled = !fixedMode;

        // Enable all advanced fields
        Object.values(advancedFields).forEach(field => field.disabled = false);
    }
}

// Listen for server status updates from main process
window.electronAPI.onServerStatus((status) => {
    isServerRunning = status.running;
    updateUIState();

    if (status.error) {
        alert(`Server-Fehler: ${status.error}`);
    }
});

// Format input as user types (optional enhancement)
fixedIdInput.addEventListener('input', (e) => {
    let value = e.target.value.toUpperCase();

    // If first character is a letter, keep it as prefix + digits only after
    if (value && /^[A-Z]/.test(value)) {
        value = value[0] + value.substring(1).replace(/\D/g, '');
        if (value.length > 10) {
            value = value.substring(0, 10);
        }
    } else {
        // No letter prefix — digits only
        value = value.replace(/\D/g, '');
    }

    e.target.value = value;
});
