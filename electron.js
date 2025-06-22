import { app, BrowserWindow, ipcMain, Menu } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { execFile } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;
let splash;
let nextServerProcess;

function startNextServer() {
    return new Promise((resolve) => {
        // start the Next.js server using npx
        nextServerProcess = spawn('npx', ['next', 'start', '-p', '3000'], { cwd: __dirname });

        nextServerProcess.stdout.on('data', (data) => {
            console.log(`Next.js: ${data}`);
            if (data.toString().includes('started server on')) {
                resolve();
            }
        });

        nextServerProcess.stderr.on('data', (data) => {
            console.error(`Next.js error: ${data}`);
        });

        nextServerProcess.on('close', (code) => {
            console.log(`Next.js process exited with code ${code}`);
        });
    });
}

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

    // Set up the custom menu only in production
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

app.whenReady().then(async () => {
    // Start the Next.js server if in production
    if (process.env.NODE_ENV === 'production') {
        await startNextServer();
    }
    createWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', function () {
    // Kill the Next.js server process when all windows are closed
    if (nextServerProcess) {
        nextServerProcess.kill();
    }
    if (process.platform !== 'darwin') app.quit();
});
