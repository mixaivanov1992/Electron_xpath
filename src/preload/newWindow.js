const contextBridge = require('electron').contextBridge;
const ipcRenderer = require('electron').ipcRenderer;

contextBridge.exposeInMainWorld(
    'bridge', {
        renderHTML: (message) => {
            ipcRenderer.on('renderHTML', message);
        }
    }
);