import { DataBaseManager } from './databaseManager'

export class SongManager {
  private readonly databaseManager: DataBaseManager

  public constructor(databaseManager: DataBaseManager) {
    this.databaseManager = databaseManager
  }

  public updateSongPath(songId: number, songPath: string): Promise<number> {
    return this.databaseManager.run(
      'UPDATE song SET file_location = ? WHERE song_id = ?',
      songPath,
      songId,
    )
  }
}
