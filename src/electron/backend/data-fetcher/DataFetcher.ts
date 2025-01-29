import { Album, AlbumPreview, Artist, Song } from '@/api'
import { DataBaseManager } from '@/electron/backend/databaseManager'

export class DataFetcher {
    private readonly databaseManager: DataBaseManager

    public constructor(databaseManager: DataBaseManager) {
        this.databaseManager = databaseManager
    }

    public async fetchArtistAlbumPreviews(artistId: number): Promise<AlbumPreview[]> {
        return this.databaseManager.each<AlbumPreview>(
            `SELECT 
            name, 
            album_id AS id,
            (SELECT 
                COUNT(*) 
                FROM (SELECT 
                        * 
                        FROM song 
                        WHERE song.album_id = album.album_id
                )
            ) as songNumber
            FROM album 
            WHERE artist_id = ?`,
            artistId,
        )
    }

    public async fetchSongAlbumId(songId: string): Promise<number> {
        const result = await this.databaseManager.get<{ album_id: number }>(
            `SELECT album_id FROM song WHERE song_id = ?`,
            songId,
        )

        if (!result) {
            throw new Error("Unable to fetch song's album id")
        }

        return result.album_id
    }

    public async fetchArtist(artistId: string): Promise<Artist> {
        const result = await this.databaseManager.get<Artist>(
            `SELECT artist_id as id, name FROM artist WHERE artist_id = ?`,
            artistId,
        )

        if (!result) {
            throw new Error('Unable to fetch artist')
        }

        return result
    }

    public async fetchAlbum(albumId: string): Promise<Album> {
        const songIds = (
            await this.databaseManager.each<{ songId: number }>(
                `SELECT 
            song_id as songId 
            FROM album al 
            LEFT JOIN song s ON al.album_id = s.album_id
            WHERE al.album_id = ?
        `,
                albumId,
            )
        ).map((result) => result.songId)

        const songs = await Promise.all(songIds.map((id) => this.fetchSong(id)))
        const albumDetails = await this.databaseManager.get<{
            id: number
            name: string
            artistId: number
            artist: string
        }>(
            `SELECT 
            al.album_id as id, 
            al.name as name, 
            ar.artist_id as artistId, 
            ar.name AS artist 
            FROM album al 
            LEFT JOIN artist ar ON al.artist_id = ar.artist_id 
            WHERE al.album_id = ?`,
            albumId,
        )

        if (!albumDetails) {
            throw new Error('Unable to fetch album')
        }

        return {
            name: String(albumDetails.name),
            id: Number(albumDetails.id),
            artist: {
                name: String(albumDetails.artist),
                id: Number(albumDetails.artistId),
            },
            songs,
        } satisfies Album
    }

    public async fetchSongLocation(songId: string): Promise<string> {
        const result = await this.databaseManager.get<{ filename: string }>(
            'SELECT file_location as filename FROM song WHERE song_id = ?',
            songId,
        )

        if (!result) {
            throw new Error('Unable to fetch song location')
        }

        return result.filename
    }

    public async fetchSong(songId: number): Promise<Song> {
        const songArtists = await this.fetchSongArtists(songId)

        const sql = `SELECT 
            s.title as title, al.name as album, al.album_id as albumId, s.song_id as id
            FROM song s
            LEFT JOIN album al ON s.album_id = al.album_id
            WHERE s.song_id = ?`
        const songDetails = await this.databaseManager.get<{
            id: number
            albumId: number
            album: string
            title: string
        }>(sql, songId)

        if (!songDetails) {
            throw new Error('Unable to fetch song')
        }

        return {
            id: Number(songDetails.id),
            albumId: Number(songDetails.albumId),
            album: String(songDetails.album),
            title: String(songDetails.title),
            artists: songArtists,
        } satisfies Song
    }

    private async fetchSongArtists(songId: number): Promise<Artist[]> {
        const sql = `SELECT 
            ar.artist_id as id, 
            ar.name as name 
            FROM artist ar 
            LEFT JOIN song_artist sa ON ar.artist_id = sa.artist_id 
            LEFT JOIN song s ON sa.song_id = s.song_id 
            WHERE s.song_id = ?`

        const results = await this.databaseManager.each<Artist>(sql, songId)
        return results.map((result) => ({
            id: Number(result.id),
            name: String(result.name),
        }))
    }
}
