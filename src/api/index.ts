export type SearchResult =
    | {
          type: 'song'
          id: number
          name: string
          artist: string
          artist_ids: string
      }
    | {
          type: 'album'
          id: number
          name: string
          artist: string
          artist_ids: string
      }
    | {
          type: 'artist'
          id: number
          name: string
          artist: null
          artist_ids: null
      }
