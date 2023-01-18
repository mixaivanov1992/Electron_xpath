const path = require('path');
const {ipcMain, app, BrowserWindow} = require('electron');

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        fullscreen: true,
        title: 'Electron',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });
    win.loadFile('index.html');
    // win.webContents.openDevTools();
}

app.whenReady().then(() => {
    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin'){
        app.quit();
    }
});

app.on('activate', () => {
    if(BrowserWindow.getAllWindows().length === 0){
        createWindow();
    }
});

ipcMain.on('main:newWindow', (event, html) => {
    let addWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, './src/preload/newWindow.js'),
        }
    });
    addWindow.loadFile('./src/assets/template/index.html')
        .then(() => { addWindow.webContents.send('renderHTML', html); })
        .then(() => { addWindow.show(); });

    // addWindow.webContents.openDevTools();
    addWindow.on('closed', () => {
        addWindow = null;
    });
});