import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
    runBrew: (args) => ipcRenderer.invoke('brew:run', args),
});