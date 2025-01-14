export interface FileManager {
  getRootDirectory(): string
  getUnprocessedFiles(): Promise<string[]>
  getCollectionDirectory(): string
  moveFile(filePath: string, fileDestination: string): Promise<void>
}
