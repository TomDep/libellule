import { type FileManager } from './fileManager'
import { DataBaseManager } from './databaseManager'

export class Backend {
  private readonly fileManager: FileManager
  private readonly databaseManager: DataBaseManager

  public constructor(fileManager: FileManager) {
    this.fileManager = fileManager

    const rootDirectory = fileManager.getRootDirectory()
    this.databaseManager = new DataBaseManager(rootDirectory)
  }
}
