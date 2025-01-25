import { parseFile } from 'music-metadata'
import path from 'path'
import sqlite3 from 'sqlite3'
import { type Album, type Artist, type Song } from '@/database/model'
import { type SearchResult } from '@/api'
import { SongManager } from '@/backend/songManager'

export class DataBaseManager {
    private db: sqlite3.Database

    public readonly songManager: SongManager

    public constructor(rootDirectory: string) {
        this.connectToDatabase(rootDirectory)

        this.songManager = new SongManager(this)
    }

    private connectToDatabase(rootDirectory: string) {
        try {
            const filename = path.join(rootDirectory, 'src/database/libellule.db')
            this.db = new (sqlite3.verbose().Database)(filename)
        } catch (error) {
            console.error(error)
        }

        // this.cleanTables()
    }

    private cleanTables(): void {
        // noinspection SqlWithoutWhere
        this.db.exec(
            'DELETE FROM song; DELETE FROM album; DELETE FROM artist; DELETE FROM song_artist; DELETE FROM sqlite_sequence; DELETE FROM genre',
        )
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

    public async search(query: string): Promise<SearchResult[]> {
        const searchQuery =
            'SELECT DISTINCT \n' +
            '    result.id,\n' +
            '    result.name,\n' +
            '    result.artist,\n' +
            '    result.artist_ids,\n' +
            '    result.type\n' +
            'FROM (\n' +
            '    SELECT \n' +
            '        s.song_id AS id,\n' +
            '        s.title AS name,\n' +
            "        GROUP_CONCAT(ar.name, ', ') AS artist,\n" +
            "        GROUP_CONCAT(ar.artist_id, ', ') AS artist_ids,\n" +
            "        'song' AS type\n" +
            '    FROM song s\n' +
            '    LEFT JOIN song_artist sa ON s.song_id = sa.song_id\n' +
            '    LEFT JOIN artist ar ON sa.artist_id = ar.artist_id\n' +
            "    WHERE LOWER(s.title) LIKE LOWER('%' || $searchTerm || '%')\n" +
            '    GROUP BY s.song_id, s.title\n' +
            '    \n' +
            '    UNION ALL\n' +
            '    \n' +
            '    SELECT \n' +
            '        a.album_id AS id,\n' +
            '        a.name AS name,\n' +
            '        ar.name AS artist,\n' +
            '        ar.artist_id AS artist_ids,\n' +
            "        'album' AS type\n" +
            '    FROM album a\n' +
            '    LEFT JOIN artist ar ON a.artist_id = ar.artist_id\n' +
            "    WHERE LOWER(a.name) LIKE LOWER('%' || $searchTerm || '%')\n" +
            '    \n' +
            '    UNION ALL\n' +
            '    \n' +
            '    SELECT \n' +
            '        ar.artist_id AS id,\n' +
            '        ar.name AS name,\n' +
            '        NULL AS artist,\n' +
            '        NULL AS artist_ids,\n' +
            "        'artist' AS type\n" +
            '    FROM artist ar\n' +
            "    WHERE LOWER(ar.name) LIKE LOWER('%' || $searchTerm || '%')\n" +
            ') AS result\n' +
            'LIMIT $limit;\n'

        return await new Promise<SearchResult[]>((resolve, reject) => {
            const rows: SearchResult[] = []

            this.db.each(
                searchQuery,
                {
                    $searchTerm: query,
                    $limit: 50,
                },
                function (error, row: SearchResult) {
                    if (error) {
                        reject(error)
                        return
                    }

                    rows.push(row)
                },
                function (error) {
                    if (error) {
                        reject(error)
                        return
                    }

                    resolve(rows)
                },
            )
        })
    }
}
