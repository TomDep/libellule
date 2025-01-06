import { contextBridge, ipcRenderer } from 'electron'

// Create a type that should contain all the data we need to expose in the
// renderer process using `contextBridge`.
export type ContextBridgeApi = {}

const api: ContextBridgeApi = {}

// Expose our functions in the `api` namespace of the renderer `Window`.
contextBridge.exposeInMainWorld('api', api)
