import { DataFetcher } from '@/electron/backend/data-fetcher/DataFetcher'
import { type FileManager } from '@/electron/backend/fileManager'
import { DataBaseManager } from '@/electron/backend/databaseManager'
import { SearchEngine } from '@/electron/backend/search'
import { SoundPlayer } from '@/electron/backend/sound-player/SoundPlayer'
import path from 'path'
import { COLLECTION_DIRECTORY, UNPROCESSED_FILES_DIRECTORY } from './config'

export class Backend {
    public readonly databaseManager: DataBaseManager
    public readonly searchEngine: SearchEngine
    public readonly dataFetcher: DataFetcher
    public readonly soundPlayer: SoundPlayer

    private readonly fileManager: FileManager

    public constructor(fileManager: FileManager) {
        this.fileManager = fileManager
        this.soundPlayer = new SoundPlayer({})

        const rootDirectory = fileManager.getRootDirectory()
        this.databaseManager = new DataBaseManager(rootDirectory)

        this.searchEngine = new SearchEngine(this.databaseManager)
        this.dataFetcher = new DataFetcher(this.databaseManager)
    }

    public async updateDatabase() {
        const files = await this.fileManager.getUnprocessedFiles()

        for (const file of files) {
            const songPath = path.join(UNPROCESSED_FILES_DIRECTORY, file)
            const songId = await this.databaseManager.processSong(songPath, file)

            const fileDestination = path.join(COLLECTION_DIRECTORY, file)
            this.fileManager.moveFile(songPath, fileDestination).then((_) => {
                this.databaseManager.songManager.updateSongPath(songId, fileDestination)
            })
        }
    }

    public quit(): void {
        this.databaseManager.disconnect()
        this.soundPlayer.stop()
    }
}
