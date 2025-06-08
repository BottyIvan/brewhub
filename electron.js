import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { execFile } from 'child_process';

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        icon: path.join(process.cwd(), 'public', 'icon.png'),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(process.cwd(), 'preload.js'), // aggiungi preload
        },
    });

    // In dev, load localhost; in prod, load built Next.js app
    const startUrl = process.env.ELECTRON_START_URL || `http://localhost:3000`;
    win.loadURL(startUrl);
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
