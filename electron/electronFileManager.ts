import { FileManager } from '../backend/fileManager'
import { app as ElectronApp } from 'electron'

export class ElectronFileManager implements FileManager {
  private readonly app: typeof ElectronApp

  public constructor(app: typeof ElectronApp) {
    this.app = app
  }

  public getRootDirectory(): string {
    return this.app.getAppPath()
  }
}
