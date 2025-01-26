import { parseFile } from 'music-metadata'
import path from 'path'
import sqlite3 from 'sqlite3'
import { type Album, type Artist, type Song } from '@/database/model'
import { SongManager } from '@/electron/backend/songManager'

export class DataBaseManager {
    public readonly songManager: SongManager
    private db: sqlite3.Database

    public constructor(rootDirectory: string) {
        this.connectToDatabase(rootDirectory)

        this.songManager = new SongManager(this)
    }

    public disconnect(): void {
        this.db.close()
    }

    public async processSong(fullPath: string, file: string): Promise<number> {
        const metadata = await parseFile(fullPath)

        const title = metadata.common.title || file

        // Create the artists entries
        const artists = metadata.common.artist?.split(/\s*,\s*/) || ['Unknown Artist']
        const artistIds: number[] = []
        for (const artist of artists) {
            const artistId = await this.insertArtist({ name: artist })

            if (artistId) {
                artistIds.push(artistId)
            }
        }

        // Create the album entry
        // Main artist is always the first artist
        const album = metadata.common.album || 'Unknown Album'
        const albumId = await this.insertAlbum({ name: album, artist_id: artistIds[0] })

        // Insert the song
        const songId = await this.insertSong({ title, album_id: albumId })

        // Link the song to its artists
        for (const artistId of artistIds) {
            this.linkArtistAndSong(artistId, songId)
        }

        return songId
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

    public async each<T = object>(sql: string, ...params: unknown[]): Promise<T[]>
    public async each<T = object>(sql: string, params: Record<string, unknown>): Promise<T[]>
    public async each<T = object>(
        sql: string,
        params: unknown[] | Record<string, unknown>,
    ): Promise<T[]> {
        return new Promise<T[]>((resolve, reject) => {
            const rows: T[] = []

            this.db.each(
                sql,
                params,
                function (error, row: T) {
                    if (error) {
                        reject(rows)
                        return
                    }

                    rows.push(row)
                },
                function (error) {
                    if (error) {
                        reject(rows)
                        return
                    }

                    resolve(rows)
                },
            )
        })
    }

    private connectToDatabase(rootDirectory: string) {
        try {
            const filename = path.join(rootDirectory, 'src/database/libellule.db')
            this.db = new (sqlite3.verbose().Database)(filename)
        } catch (error) {
            console.error(error)
        }
    }

    private insertSong(song: Song): Promise<number> {
        return this.run(
            'INSERT INTO song (title, album_id) VALUES(?, ?)',
            song.title,
            song.album_id,
        )
    }

    private async insertArtist(artist: Artist): Promise<number | undefined> {
        const existingArtist = await this.findArtistByName(artist.name)
        if (existingArtist?.artist_id) {
            return existingArtist.artist_id
        }

        return await this.run('INSERT INTO artist (name) VALUES(?)', artist.name)
    }

    private findArtistByName(name: string): Promise<Artist | undefined> {
        return this.get('SELECT * FROM artist WHERE name = ?', name)
    }

    private async insertAlbum(album: Album): Promise<number> {
        const existingAlbum = await this.findAlbumByName(album.name)
        if (existingAlbum?.album_id) {
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

    private linkArtistAndSong(artistId: number, songId: number): void {
        this.db.run('INSERT INTO song_artist (song_id, artist_id) VALUES(?, ?)', songId, artistId)
    }
}
