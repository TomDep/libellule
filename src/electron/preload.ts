import artist from '@/front/pages/artist'
import { contextBridge, ipcRenderer } from 'electron'
import type { Album, AlbumPreview, Artist, SearchResult } from '@/api'

// Create a type that should contain all the data we need to expose in the
// renderer process using `contextBridge`.
export type ContextBridgeApi = {
    search: (query: string) => Promise<SearchResult[]>
    fetchAlbum: (albumId: number) => Promise<Album>
    fetchArtist: (artistId: number) => Promise<Artist>
    fetchArtistAlbumPreviews: (albumId: number) => Promise<AlbumPreview[]>
    fetchSongAlbumId: (songId: number) => Promise<number>
}

const api: ContextBridgeApi = {
    search: (query: string) => ipcRenderer.invoke('database:search', query),
    fetchAlbum: (albumId: number) => ipcRenderer.invoke('database:fetchAlbum', albumId),
    fetchArtist: (artistId: number) => ipcRenderer.invoke('database:fetchArtist', artistId),
    fetchArtistAlbumPreviews: (artistId) =>
        ipcRenderer.invoke('database:fetchArtistAlbumPreviews', artistId),
    fetchSongAlbumId: (songId: number) => ipcRenderer.invoke('database:fetchSongAlbumId', songId),
}

// Expose our functions in the `api` namespace of the renderer `Window`.
contextBridge.exposeInMainWorld('api', api)
