type SearchResultWithArtists = {
    artists: Array<{
        name: string
        id: number
    }>
}

export type SearchResultBase = {
    type: 'song' | 'album' | 'artist'
    id: number
    name: string
}

export type SearchResultArtist = SearchResultBase & {
    type: 'artist'
}

export type SearchResultAlbum = SearchResultBase &
    SearchResultWithArtists & {
        type: 'album'
    }

export type SearchResultSong = SearchResultBase &
    SearchResultWithArtists & {
        type: 'song'
    }

export type SearchResult = SearchResultArtist | SearchResultAlbum | SearchResultSong
