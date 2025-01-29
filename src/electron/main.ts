import { app, BrowserWindow, ipcMain } from 'electron'
import { Backend } from '@/electron/backend/backend'
import { ElectronFileManager } from './electronFileManager'
import path from 'path'

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'
let backend: Backend | null = null
let window: BrowserWindow | null = null

app.whenReady().then(() => {
    window = new BrowserWindow({
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

    return window.loadURL(process.env.VITE_DEV_SERVER_URL ?? '')
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

    ipcMain.on('player:play', async (_, songId) => {
        const filename = await backend?.dataFetcher.fetchSongLocation(songId)
        console.log(filename)

        if (filename) {
            backend?.soundPlayer.play(filename)
            window?.webContents.send('player:songPlaying', songId)
        }
    })

    ipcMain.on('player:stop', (_) => {
        backend?.soundPlayer.stop()
    })

    ipcMain.on('player:resume', (_) => {
        backend?.soundPlayer.resume()
    })

    ipcMain.on('player:pause', (_) => {
        backend?.soundPlayer.pause()
    })
})
