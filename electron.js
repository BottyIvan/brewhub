// Import required modules
import { app, BrowserWindow, ipcMain, Menu } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import next from 'next';
import http from 'http';
import { execFile } from 'child_process';

// Get current file and directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Determine if the app is in development mode
const isDev = !app.isPackaged;

// Initialize Next.js with configuration
const nextApp = next({
    dev: isDev,
    dir: __dirname,
    conf: {
        distDir: '.next'
    }
});

const handle = nextApp.getRequestHandler();

let mainWindow; // Main application window
let splash;     // Splash screen window

// Function to create the main window and splash screen
async function createWindow() {
    // Create the splash screen window
    splash = new BrowserWindow({
        width: 1200,
        height: 800,
        frame: false,
        alwaysOnTop: true,
        transparent: true,
        show: true,
    });
    splash.loadFile(path.join(__dirname, 'splash.html')).catch(console.error);

    // Create the main window but don't show it immediately
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

    // Load the Next.js app in the main window
    mainWindow.loadURL('http://localhost:3000');

    // Set a custom menu only in production
    if (process.env.NODE_ENV === 'production') {
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
    }

    // When the main window is ready, close the splash and show the main window
    mainWindow.once('ready-to-show', () => {
        splash.destroy();
        mainWindow.show();
    });
}

// IPC handler to run brew commands from the renderer
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

// Start the Next.js server and then create the Electron window
nextApp.prepare().then(() => {
    const server = http.createServer((req, res) => {
        handle(req, res);
    });

    server.listen(3000, () => {
        console.log('Next.js server listening on http://localhost:3000');
        app.whenReady().then(createWindow);
    });
});

// Handle app activation event (macOS)
app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// Quit the app when all windows are closed (except on macOS)
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});
