import type { SearchResult } from '@/api'
import { DataBaseManager } from '@/electron/backend/databaseManager'
import { RawSearchResult } from '@/electron/backend/search/SearchEngine.model'

export class SearchEngine {
    private readonly databaseManager: DataBaseManager

    public constructor(databaseManager: DataBaseManager) {
        this.databaseManager = databaseManager
    }

    public async search(query: string): Promise<SearchResult[]> {
        const searchQuery = `SELECT DISTINCT 
                result.id,
                result.name,
                result.artists,
                result.artist_ids,
                result.type
            FROM (
                SELECT 
                    s.song_id AS id,
                    s.title AS name,
                    GROUP_CONCAT(ar.name, '$#$') AS artists,
                    GROUP_CONCAT(ar.artist_id, '$#$') AS artist_ids,
                    'song' AS type
                FROM song s
                LEFT JOIN song_artist sa ON s.song_id = sa.song_id
                LEFT JOIN artist ar ON sa.artist_id = ar.artist_id
                WHERE LOWER(s.title) LIKE LOWER('%' || $searchTerm || '%')
                GROUP BY s.song_id, s.title
                
                UNION ALL
                
                SELECT 
                    a.album_id AS id,
                    a.name AS name,
                    ar.name AS artist,
                    ar.artist_id AS artist_ids,
                    'album' AS type
                FROM album a
                LEFT JOIN artist ar ON a.artist_id = ar.artist_id
                WHERE LOWER(a.name) LIKE LOWER('%' || $searchTerm || '%')
                
                UNION ALL
                
                SELECT 
                    ar.artist_id AS id,
                    ar.name AS name,
                    NULL AS artist,
                    NULL AS artist_ids,
                    'artist' AS type
                FROM artist ar
                WHERE LOWER(ar.name) LIKE LOWER('%' || $searchTerm || '%')
            ) AS result
            LIMIT $limit;
            `

        const databaseResult = await this.databaseManager.each<RawSearchResult>(searchQuery, {
            $limit: 50,
            $searchTerm: query,
        })

        if (!databaseResult) {
            return []
        }

        const searchResults: SearchResult[] = []
        for (const result of databaseResult) {
            if (result.type === 'artist') {
                searchResults.push(result)
            } else {
                const artists = result.artists?.split('$#$') ?? []
                const artistIds = String(result.artist_ids).split('$#$') ?? []

                searchResults.push({
                    name: result.name,
                    id: Number(result.id),
                    type: result.type,
                    artists: artists.map((artist, index) => ({
                        name: artist,
                        id: Number(artistIds[index]),
                    })),
                })
            }
        }

        return searchResults
    }
}
