import path from 'path'
import sqlite3 from 'sqlite3'
import { parseFile } from 'music-metadata'
import { Album, Artist, Song } from '../database/model'
import { SongManager } from './songManager'

export class DataBaseManager {
  private db: sqlite3.Database

  public readonly songManager: SongManager

  public constructor(rootDirectory: string) {
    this.connectToDatabase(rootDirectory)

    this.songManager = new SongManager(this)
  }

  private connectToDatabase(rootDirectory: string) {
    try {
      const filename = path.join(rootDirectory, 'database/libellule.db')
      this.db = new (sqlite3.verbose().Database)(filename)
    } catch (error) {
      console.error(error)
    }

    this.cleanTables()
  }

  private cleanTables(): void {
    // noinspection SqlWithoutWhere
    this.db.exec(
      'DELETE FROM song; DELETE FROM album; DELETE FROM artist; DELETE FROM song_artist; DELETE FROM sqlite_sequence; DELETE FROM genre',
    )
  }

  private insertSong(song: Song): Promise<number> {
    return this.run('INSERT INTO song (title, album_id) VALUES(?, ?)', song.title, song.album_id)
  }

  private async insertArtist(artist: Artist): Promise<number> {
    const existingArtist = await this.findArtistByName(artist.name)
    if (existingArtist) {
      return existingArtist.artist_id
    }

    return await this.run('INSERT INTO artist (name) VALUES(?)', artist.name)
  }

  private findArtistByName(name: string): Promise<Artist | undefined> {
    return this.get('SELECT * FROM artist WHERE name = ?', name)
  }

  private async insertAlbum(album: Album): Promise<number> {
    const existingAlbum = await this.findAlbumByName(album.name)
    if (existingAlbum) {
      return existingAlbum.album_id
    }

    return await this.run(
      'INSERT INTO album (name, artist_id) VALUES(?, ?)',
      album.name,
      album.artist_id,
    )
  }

  private findAlbumByName(name: string): Promise<Album | undefined> {
    return new Promise<Album | undefined>((resolve, reject) => {
      this.db.get(
        'SELECT * FROM album WHERE name = ?',
        name,
        function (error: Error | null, row: Album | undefined) {
          if (error) reject(error)

          resolve(row)
        },
      )
    })
  }

  public disconnect(): void {
    this.db.close()
  }

  public async processSong(fullPath: string): Promise<number> {
    const metadata = await parseFile(fullPath)

    const title = metadata.common.title

    // Create the artists entries
    const artists = metadata.common.artist.split(/\s*,\s*/)
    const artistIds: number[] = []
    for (const artist of artists) {
      const artistId = await this.insertArtist({ name: artist })
      artistIds.push(artistId)
    }

    // Create the album entry
    // Main artist is always the first artist
    const album = metadata.common.album
    const albumId = await this.insertAlbum({ name: album, artist_id: artistIds[0] })

    // Insert the song
    const songId = await this.insertSong({ title, album_id: albumId })

    // Link the song to its artists
    for (const artistId of artistIds) {
      this.linkArtistAndSong(artistId, songId)
    }

    return songId
  }

  private linkArtistAndSong(artistId: number, songId: number): void {
    this.db.run('INSERT INTO song_artist (song_id, artist_id) VALUES(?, ?)', songId, artistId)
  }

  public run(sqlRequest: string, ...values: unknown[]): Promise<number> {
    return new Promise((resolve, reject) => {
      this.db.run(sqlRequest, values, function (error: Error | null) {
        if (error) {
          reject(error)
        } else {
          resolve(this.lastID)
        }
      })
    })
  }

  public get<T = object>(sqlRequest: string, ...values: unknown[]): Promise<T | undefined> {
    return new Promise((resolve, reject) => {
      this.db.get(sqlRequest, values, function (error: Error | null, row: T | undefined) {
        if (error) {
          reject(error)
        } else {
          resolve(row)
        }
      })
    })
  }
}
