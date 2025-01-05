export interface FileManager {
  getRootDirectory(): string
  getUnprocessedFiles(): Promise<string[]>
}
