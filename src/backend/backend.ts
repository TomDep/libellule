import { type FileManager } from '@/backend/fileManager'
import { DataBaseManager } from '@/backend/databaseManager'
import path from 'path'
import { COLLECTION_DIRECTORY, UNPROCESSED_FILES_DIRECTORY } from './config'

export class Backend {
    private readonly fileManager: FileManager
    public readonly databaseManager: DataBaseManager

    public constructor(fileManager: FileManager) {
        this.fileManager = fileManager

        const rootDirectory = fileManager.getRootDirectory()
        this.databaseManager = new DataBaseManager(rootDirectory)
    }

    public async updateDatabase() {
        const files = await this.fileManager.getUnprocessedFiles()

        for (const file of files) {
            const songPath = path.join(UNPROCESSED_FILES_DIRECTORY, file)
            const songId = await this.databaseManager.processSong(songPath)

            const fileDestination = path.join(COLLECTION_DIRECTORY, file)
            this.fileManager.moveFile(songPath, fileDestination).then((_) => {
                this.databaseManager.songManager.updateSongPath(songId, fileDestination)
            })
        }
    }

    public quit(): void {
        this.databaseManager.disconnect()
    }
}
