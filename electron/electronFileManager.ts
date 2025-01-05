import { FileManager } from '../backend/fileManager'
import { app as ElectronApp } from 'electron'
import fs from 'fs'
import { UNPROCESSED_FILES_DIRECTORY } from '../backend/config'

export class ElectronFileManager implements FileManager {
  private readonly app: typeof ElectronApp

  public constructor(app: typeof ElectronApp) {
    this.app = app
  }

  public async getUnprocessedFiles(): Promise<string[]> {
    return new Promise<string[]>(async (resolve, reject) => {
      fs.readdir(
        UNPROCESSED_FILES_DIRECTORY,
        { encoding: 'utf8', recursive: true },
        (error: NodeJS.ErrnoException, files: string[]) => {
          if (error) {
            reject(error)
          }

          resolve(files)
        },
      )
    })
  }

  public getRootDirectory(): string {
    return this.app.getAppPath()
  }
}
