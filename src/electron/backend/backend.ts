import { DataFetcher } from '@/electron/backend/data-fetcher/DataFetcher'
import { type FileManager } from '@/electron/backend/fileManager'
import { DataBaseManager } from '@/electron/backend/databaseManager'
import { MusicPlayer } from '@/electron/backend/music-player/MusicPlayer'
import { SearchEngine } from '@/electron/backend/search'
import path from 'path'
import { COLLECTION_DIRECTORY, UNPROCESSED_FILES_DIRECTORY } from './config'

export class Backend {
    public readonly databaseManager: DataBaseManager
    public readonly searchEngine: SearchEngine
    public readonly dataFetcher: DataFetcher
    public readonly musicPlayer: MusicPlayer

    private readonly fileManager: FileManager

    public constructor(fileManager: FileManager) {
        this.fileManager = fileManager
        this.musicPlayer = new MusicPlayer()

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
        this.musicPlayer.stop()
    }
}
