import { contextBridge, ipcRenderer } from 'electron'
import type { Album, AlbumPreview, Artist, SearchResult } from '@/api'

interface ContextBridgeApiEvents {
    'player:songPlaying': (songId: number) => void
}

// Create a type that should contain all the data we need to expose in the
// renderer process using `contextBridge`.
export type ContextBridgeApi = {
    // Database
    search: (query: string) => Promise<SearchResult[]>
    fetchAlbum: (albumId: number) => Promise<Album>
    fetchArtist: (artistId: number) => Promise<Artist>
    fetchArtistAlbumPreviews: (albumId: number) => Promise<AlbumPreview[]>
    fetchSongAlbumId: (songId: number) => Promise<number>

    // Player
    playSong: (songId: number) => void
    pauseSong: () => void
    stopSong: () => void
    resumeSong: () => void

    on: <Event extends keyof ContextBridgeApiEvents>(
        event: Event,
        handler: ContextBridgeApiEvents[Event],
    ) => void
}

const api: ContextBridgeApi = {
    search: (query: string) => ipcRenderer.invoke('database:search', query),
    fetchAlbum: (albumId: number) => ipcRenderer.invoke('database:fetchAlbum', albumId),
    fetchArtist: (artistId: number) => ipcRenderer.invoke('database:fetchArtist', artistId),
    fetchArtistAlbumPreviews: (artistId) =>
        ipcRenderer.invoke('database:fetchArtistAlbumPreviews', artistId),
    fetchSongAlbumId: (songId: number) => ipcRenderer.invoke('database:fetchSongAlbumId', songId),
    playSong: (songId: number) => ipcRenderer.send('player:play', songId),
    pauseSong: () => ipcRenderer.send('player:pause'),
    stopSong: () => ipcRenderer.send('player:stop'),
    resumeSong: () => ipcRenderer.send('player:resume'),

    on: <Event extends keyof ContextBridgeApiEvents>(
        event: Event,
        handler: ContextBridgeApiEvents[Event],
    ) =>
        ipcRenderer.on(event, (_, args) => {
            handler(args)
        }),
}

// Expose our functions in the `api` namespace of the renderer `Window`.
contextBridge.exposeInMainWorld('api', api)
