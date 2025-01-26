import { contextBridge, ipcRenderer } from 'electron'
import type { Album, SearchResult } from '@/api'

// Create a type that should contain all the data we need to expose in the
// renderer process using `contextBridge`.
export type ContextBridgeApi = {
    search: (query: string) => Promise<SearchResult[]>
    fetchAlbum: (albumId: number) => Promise<Album>
    fetchSongAlbumId: (songId: number) => Promise<number>
}

const api: ContextBridgeApi = {
    search: (query: string) => ipcRenderer.invoke('database:search', query),
    fetchAlbum: (albumId: number) => ipcRenderer.invoke('database:fetchAlbum', albumId),
    fetchSongAlbumId: (songId: number) => ipcRenderer.invoke('database:fetchSongAlbumId', songId),
}

// Expose our functions in the `api` namespace of the renderer `Window`.
contextBridge.exposeInMainWorld('api', api)
