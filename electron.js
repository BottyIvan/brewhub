import { app, BrowserWindow, ipcMain, Menu } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { execFile } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;
let splash;

function createWindow() {
    splash = new BrowserWindow({
        width: 1200,
        height: 800,
        frame: false,
        alwaysOnTop: true,
        transparent: true,
        show: true,
    });
    splash.loadFile(path.join(__dirname, 'splash.html')).catch(console.error);

    // Create the main window but do not show it immediately
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        icon: path.join(__dirname, 'public', 'icon.png'),
        show: false,
        title: process.env.npm_package_name || 'BrewHub',
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    // In dev, load localhost; in prod, load built Next.js app
    const startUrl = process.env.ELECTRON_START_URL || `http://localhost:3000`;
    mainWindow.loadURL(startUrl);

    // Set up the custom menu with the app name
    const appName = process.env.npm_package_productName || process.env.npm_package_name || 'BrewHub';
    const template = [
        {
            label: appName,
            submenu: [
                { role: 'about', label: `About ${appName}` },
                { type: 'separator' },
                { role: 'quit', label: 'Quit' }
            ]
        }
    ];
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    mainWindow.once('ready-to-show', () => {
        splash.destroy();
        mainWindow.show();
    });
}

// IPC handler to execute brew commands
ipcMain.handle('brew:run', async (_event, args) => {
    return new Promise((resolve) => {
        execFile('brew', args, (error, stdout, stderr) => {
            if (error) {
                resolve({ error: stderr || error.message });
            } else {
                resolve({ output: stdout });
            }
        });
    });
});

app.whenReady().then(() => {
    createWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});
