import { app, BrowserWindow } from 'electron'
import { Backend } from '../backend/backend'
import { ElectronFileManager } from './electronFileManager'

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'
let backend: Backend | null = null

app.whenReady().then(() => {
    const win = new BrowserWindow({
        webPreferences: {
            // Link to your compiled preload file.
            // preload: path.join(app.getAppPath(), 'dist-electron/preload.mjs'),
        },
        autoHideMenuBar: true,
        width: 1500,
        height: 900,
        minHeight: 400,
        minWidth: 300,
        // icon: '../public/favicon.ico',
    })

    return win.loadURL(process.env.VITE_DEV_SERVER_URL)
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
    backend.quit()
})

app.on('ready', async () => {
    const electronFileManager = new ElectronFileManager(app)
    backend = new Backend(electronFileManager)

    await backend.updateDatabase()
})
