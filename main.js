const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { startServer, stopServer, PORT } = require('./server.js');

let mainWindow;
let serverRunning = false;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 650,
        height: 750,
        resizable: true,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        },
        title: 'EGK Mock Service',
        autoHideMenuBar: true
    });

    mainWindow.loadFile('index.html');

    // Handle window close - stop server and quit
    mainWindow.on('close', async (e) => {
        if (serverRunning) {
            e.preventDefault();

            try {
                await stopServer();
                serverRunning = false;
                console.log('Server stopped before closing');
            } catch (error) {
                console.error('Error stopping server:', error);
            }

            mainWindow.destroy();
            app.quit();
        }
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// Create window when app is ready
app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

// Quit when all windows are closed (Windows & Linux)
app.on('window-all-closed', async () => {
    if (serverRunning) {
        try {
            await stopServer();
            serverRunning = false;
        } catch (error) {
            console.error('Error stopping server on quit:', error);
        }
    }

    app.quit();
});

// Handle start server request from renderer
ipcMain.handle('start-server', async (event, settings) => {
    try {
        await startServer(settings);
        serverRunning = true;

        // Send status update to renderer
        mainWindow.webContents.send('server-status', {
            running: true,
            port: PORT,
            settings: settings
        });

        return { success: true, port: PORT };

    } catch (error) {
        // Send error status to renderer
        mainWindow.webContents.send('server-status', {
            running: false,
            error: error.message
        });

        throw error;
    }
});

// Handle stop server request from renderer
ipcMain.handle('stop-server', async () => {
    try {
        await stopServer();
        serverRunning = false;

        // Send status update to renderer
        mainWindow.webContents.send('server-status', {
            running: false
        });

        return { success: true };

    } catch (error) {
        throw error;
    }
});

// Cleanup on unexpected exit
process.on('exit', async () => {
    if (serverRunning) {
        await stopServer();
    }
});
