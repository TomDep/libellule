import { app, BrowserWindow, ipcMain } from 'electron'
import { Backend } from '@/electron/backend/backend'
import { ElectronFileManager } from './electronFileManager'
import path from 'path'

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'
let backend: Backend | null = null

app.whenReady().then(() => {
    const win = new BrowserWindow({
        webPreferences: {
            // Link to your compiled preload file.
            preload: path.join(app.getAppPath(), 'dist-electron/preload.mjs'),
        },
        autoHideMenuBar: true,
        width: 1500,
        height: 900,
        minHeight: 400,
        minWidth: 300,
        icon: '../public/favicon.ico',
    })

    return win.loadURL(process.env.VITE_DEV_SERVER_URL ?? '')
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
    backend?.quit()
})

app.on('ready', async () => {
    const electronFileManager = new ElectronFileManager(app)
    backend = new Backend(electronFileManager)
    await backend.updateDatabase()

    ipcMain.handle('database:search', (_, query) => {
        return backend?.searchEngine.search(query)
    })

    ipcMain.handle('database:fetchAlbum', (_, albumId) => {
        return backend?.dataFetcher.fetchAlbum(albumId)
    })

    ipcMain.handle('database:fetchArtist', (_, artistId) => {
        return backend?.dataFetcher.fetchArtist(artistId)
    })

    ipcMain.handle('database:fetchArtistAlbumPreviews', (_, artistId) => {
        return backend?.dataFetcher.fetchArtistAlbumPreviews(artistId)
    })

    ipcMain.handle('database:fetchSongAlbumId', (_, songId) => {
        return backend?.dataFetcher.fetchSongAlbumId(songId)
    })
})
