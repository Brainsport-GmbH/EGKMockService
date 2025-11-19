const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
    startServer: (versichertenId) => ipcRenderer.invoke('start-server', versichertenId),
    stopServer: () => ipcRenderer.invoke('stop-server'),
    onServerStatus: (callback) => ipcRenderer.on('server-status', (event, status) => callback(status))
});
