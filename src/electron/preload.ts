import { contextBridge, ipcRenderer } from 'electron'
import type { SearchResult } from '../api'

// Create a type that should contain all the data we need to expose in the
// renderer process using `contextBridge`.
export type ContextBridgeApi = {
    search: (query: string) => Promise<SearchResult[]>
}

const api: ContextBridgeApi = {
    search: (query: string) => ipcRenderer.invoke('database:search', query),
}

// Expose our functions in the `api` namespace of the renderer `Window`.
contextBridge.exposeInMainWorld('api', api)
