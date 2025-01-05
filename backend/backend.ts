import { type FileManager } from './fileManager'
import { DataBaseManager } from './databaseManager'
import path from 'path'
import { UNPROCESSED_FILES_DIRECTORY } from './config'

export class Backend {
  private readonly fileManager: FileManager
  private readonly databaseManager: DataBaseManager

  public constructor(fileManager: FileManager) {
    this.fileManager = fileManager

    const rootDirectory = fileManager.getRootDirectory()
    this.databaseManager = new DataBaseManager(rootDirectory)
  }

  public async updateDatabase() {
    const files = await this.fileManager.getUnprocessedFiles()

    for (const file of files) {
      const fullPath = path.join(UNPROCESSED_FILES_DIRECTORY, file)
      this.databaseManager.processSong(fullPath).then((r) => {
        // Move the file to the processed directory
      })
    }
  }

  public quit(): void {
    this.databaseManager.disconnect()
  }
}
